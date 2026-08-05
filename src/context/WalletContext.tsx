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

export function WalletProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<WalletState>({
    isInstalled: false,
    isConnecting: false,
    isConnected: false,
    publicKey: null,
    error: null,
  });

  const storeConnect = useTreasuryStore((s) => s.connectWallet);
  const storeDisconnect = useTreasuryStore((s) => s.disconnectWallet);

  // Check if Freighter is installed on mount
  useEffect(() => {
    async function checkInstallation() {
      try {
        const result = await isConnected();
        setState((prev) => ({ ...prev, isInstalled: !!result?.isConnected }));
      } catch {
        setState((prev) => ({ ...prev, isInstalled: false }));
      }
    }
    checkInstallation();
  }, []);

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
        storeConnect(result.address);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to connect wallet';
      setState((prev) => ({
        ...prev,
        isConnecting: false,
        error: message,
      }));
    }
  }, [storeConnect]);

  const disconnect = useCallback(() => {
    setState({
      isInstalled: true,
      isConnecting: false,
      isConnected: false,
      publicKey: null,
      error: null,
    });
    storeDisconnect();
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
