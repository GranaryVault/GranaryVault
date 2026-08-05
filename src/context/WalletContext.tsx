'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
  isConnected,
  getAddress,
  requestAccess,
  signTransaction,
} from '@stellar/freighter-api';
import { NETWORK_PASSPHRASE } from '@/lib/stellar';
import { useTreasuryStore } from '@/store/treasuryStore';
import { logger } from '@/lib/logger';

const WALLET_STORAGE_KEY = 'granaryvault-wallet';

interface WalletState {
  isInstalled: boolean;
  isConnecting: boolean;
  isConnected: boolean;
  publicKey: string | null;
  error: string | null;
}

interface WalletContextType extends WalletState {
  connect: () => Promise<void>;
  disconnect: () => void;
  signTx: (xdr: string) => Promise<string>;
}

const WalletContext = createContext<WalletContextType>({
  isInstalled: false,
  isConnecting: false,
  isConnected: false,
  publicKey: null,
  error: null,
  connect: async () => {},
  disconnect: () => {},
  signTx: async () => '',
});

export const useWallet = () => useContext(WalletContext);

/**
 * Persist wallet public key to localStorage for session recovery across refreshes.
 */
function persistWallet(publicKey: string | null) {
  try {
    if (publicKey) {
      localStorage.setItem(WALLET_STORAGE_KEY, JSON.stringify({ publicKey, timestamp: Date.now() }));
    } else {
      localStorage.removeItem(WALLET_STORAGE_KEY);
    }
  } catch {
    // localStorage may be unavailable
  }
}

/**
 * Restore wallet public key from localStorage.
 */
function restoreWallet(): string | null {
  try {
    const stored = localStorage.getItem(WALLET_STORAGE_KEY);
    if (stored) {
      const { publicKey, timestamp } = JSON.parse(stored);
      // Expire sessions older than 24 hours
      if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
        return publicKey;
      }
      localStorage.removeItem(WALLET_STORAGE_KEY);
    }
  } catch {
    // Ignore parse errors
  }
  return null;
}

export function WalletProvider({ children }: { children: ReactNode }) {
  const restoredKey = typeof window !== 'undefined' ? restoreWallet() : null;

  const [state, setState] = useState<WalletState>({
    isInstalled: false,
    isConnecting: false,
    isConnected: !!restoredKey,
    publicKey: restoredKey,
    error: null,
  });

  const storeConnect = useTreasuryStore((s) => s.connectWallet);
  const storeDisconnect = useTreasuryStore((s) => s.disconnectWallet);

  // If we have a restored key, also update the store
  useEffect(() => {
    if (restoredKey) {
      storeConnect(restoredKey);
      logger.info('Wallet session restored from localStorage', { publicKey: restoredKey.slice(0, 6) + '...' });
    }
  }, [restoredKey, storeConnect]);

  // Check if Freighter is installed on mount, and auto-reconnect
  useEffect(() => {
    async function checkAndReconnect() {
      try {
        const result = await isConnected();
        const installed = !!result?.isConnected;
        setState((prev) => ({ ...prev, isInstalled: installed }));

        // Auto-reconnect if Freighter is available and we have a stored key
        if (installed && restoredKey) {
          try {
            const addr = await getAddress();
            if (addr && addr.address) {
              setState((prev) => ({
                ...prev,
                isConnected: true,
                publicKey: addr.address,
              }));
              storeConnect(addr.address);
              persistWallet(addr.address);
              logger.info('Wallet auto-reconnected on page load');
            }
          } catch {
            // Freighter may be locked; user needs to reconnect manually
            logger.warn('Auto-reconnect failed — wallet may be locked');
            setState((prev) => ({ ...prev, isConnected: false, publicKey: null }));
            persistWallet(null);
            storeDisconnect();
          }
        }
      } catch {
        setState((prev) => ({ ...prev, isInstalled: false }));
      }
    }
    checkAndReconnect();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const connect = useCallback(async () => {
    setState((prev) => ({ ...prev, isConnecting: true, error: null }));
    try {
      await requestAccess();
      const result = await getAddress();
      if (result && result.address) {
        setState({
          isInstalled: true,
          isConnecting: false,
          isConnected: true,
          publicKey: result.address,
          error: null,
        });
        persistWallet(result.address);
        storeConnect(result.address);
        logger.info('Wallet connected', { publicKey: result.address.slice(0, 6) + '...' });
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to connect wallet';
      setState((prev) => ({ ...prev, isConnecting: false, error: message }));
      logger.error('Wallet connection failed', err instanceof Error ? err : undefined);
    }
  }, [storeConnect]);

  const disconnect = useCallback(() => {
    persistWallet(null);
    setState({
      isInstalled: true,
      isConnecting: false,
      isConnected: false,
      publicKey: null,
      error: null,
    });
    storeDisconnect();
    logger.info('Wallet disconnected');
  }, [storeDisconnect]);

  const signTx = useCallback(async (xdr: string): Promise<string> => {
    if (!state.isConnected) throw new Error('Wallet not connected');
    const result = await signTransaction(xdr, {
      networkPassphrase: NETWORK_PASSPHRASE,
    });
    return result.signedTxXdr;
  }, [state.isConnected]);

  return (
    <WalletContext.Provider value={{ ...state, connect, disconnect, signTx }}>
      {children}
    </WalletContext.Provider>
  );
}
