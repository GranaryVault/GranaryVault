'use client';

import { useState, useCallback } from 'react';
import { useWallet } from '@/context/WalletContext';
import {
  NETWORK_PASSPHRASE,
  buildPaymentTransaction,
  submitTransaction,
  getAccountBalances,
  getHorizonServer,
} from '@/lib/stellar';

interface ContractState {
  isLoading: boolean;
  error: string | null;
  result: unknown;
  txHash?: string;
}

/**
 * Hook for blockchain operations — payments, contract interactions, and account queries.
 * Connects to the real Stellar Testnet via Horizon and Soroban RPC.
 */
export function useContract() {
  const { isConnected, publicKey, signTx } = useWallet();
  const [state, setState] = useState<ContractState>({
    isLoading: false,
    error: null,
    result: null,
  });

  /**
   * Send a real Stellar payment on Testnet.
   */
  const sendPayment = useCallback(
    async (params: {
      destination: string;
      amount: string;
      assetCode?: string;
      assetIssuer?: string;
      memo?: string;
    }): Promise<{ txHash: string } | null> => {
      if (!isConnected || !publicKey) {
        setState({ isLoading: false, error: 'Wallet not connected', result: null });
        return null;
      }

      setState({ isLoading: true, error: null, result: null });

      try {
        // Build transaction XDR
        const xdr = await buildPaymentTransaction({
          sourcePublicKey: publicKey,
          destinationAddress: params.destination,
          amount: params.amount,
          assetCode: params.assetCode,
          assetIssuer: params.assetIssuer,
          memo: params.memo,
        });

        // Sign with wallet
        const signedXdr = await signTx(xdr);

        // Submit to network
        const response = await submitTransaction(signedXdr);

        setState({
          isLoading: false,
          error: null,
          result: response,
          txHash: response.hash,
        });

        return { txHash: response.hash };
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Payment failed';
        setState({ isLoading: false, error: message, result: null });
        return null;
      }
    },
    [isConnected, publicKey, signTx]
  );

  /**
   * Fetch live account balances from Horizon.
   */
  const fetchBalances = useCallback(
    async (address?: string) => {
      const target = address || publicKey;
      if (!target) {
        setState({ isLoading: false, error: 'No address provided', result: null });
        return null;
      }

      setState({ isLoading: true, error: null, result: null });

      try {
        const balances = await getAccountBalances(target);
        setState({ isLoading: false, error: null, result: balances });
        return balances;
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Failed to fetch balances';
        setState({ isLoading: false, error: message, result: null });
        return null;
      }
    },
    [publicKey]
  );

  /**
   * Invoke a Soroban contract method (simulated for now).
   * In production, this would use the Soroban RPC to simulate and submit.
   */
  const invoke = useCallback(
    async (options: { contractId: string; method: string; args?: unknown[] }) => {
      if (!isConnected || !publicKey) {
        setState({ isLoading: false, error: 'Wallet not connected', result: null });
        return null;
      }

      setState({ isLoading: true, error: null, result: null });

      try {
        // In production: build Soroban transaction, simulate via RPC, sign, submit
        const result = {
          contractId: options.contractId,
          method: options.method,
          status: 'simulated',
          timestamp: new Date().toISOString(),
        };

        setState({ isLoading: false, error: null, result });
        return result;
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Contract invocation failed';
        setState({ isLoading: false, error: message, result: null });
        return null;
      }
    },
    [isConnected, publicKey]
  );

  /**
   * Query account details from Horizon.
   */
  const getAccount = useCallback(async (address: string) => {
    try {
      const server = getHorizonServer();
      return server.loadAccount(address);
    } catch {
      return null;
    }
  }, []);

  return {
    ...state,
    sendPayment,
    fetchBalances,
    invoke,
    getAccount,
  };
}
