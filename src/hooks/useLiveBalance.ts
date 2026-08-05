'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useWallet } from '@/context/WalletContext';
import { getAccountBalances } from '@/lib/stellar';
import { logger } from '@/lib/logger';
import type { Horizon } from '@stellar/stellar-sdk';

interface BalanceState {
  balances: Horizon.HorizonApi.BalanceLine[];
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;
}

/**
 * Hook that fetches live XLM/token balances from Stellar Horizon
 * whenever the wallet connects, and auto-refreshes periodically.
 */
export function useLiveBalance(refreshIntervalMs = 30000) {
  const { isConnected, publicKey } = useWallet();
  const [state, setState] = useState<BalanceState>({
    balances: [],
    isLoading: false,
    error: null,
    lastFetched: null,
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchBalance = useCallback(async () => {
    if (!isConnected || !publicKey) {
      setState({ balances: [], isLoading: false, error: null, lastFetched: null });
      return;
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const balances = await getAccountBalances(publicKey);
      setState({
        balances,
        isLoading: false,
        error: null,
        lastFetched: Date.now(),
      });
      logger.debug('Live balance fetched', { count: balances.length });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch balance';
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: message,
      }));
      logger.error('Balance fetch failed', err instanceof Error ? err : undefined);
    }
  }, [isConnected, publicKey]);

  // Fetch on wallet connect/disconnect
  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  // Auto-refresh on interval
  useEffect(() => {
    if (isConnected && refreshIntervalMs > 0) {
      intervalRef.current = setInterval(fetchBalance, refreshIntervalMs);
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isConnected, fetchBalance, refreshIntervalMs]);

  /**
   * Get the native XLM balance from the balance lines.
   */
  const xlmBalance = state.balances.find(
    (b) => b.asset_type === 'native'
  );

  /**
   * Get non-native (custom asset) balances.
   */
  const customAssets = state.balances.filter(
    (b) => b.asset_type !== 'native'
  );

  return {
    ...state,
    xlmBalance,
    customAssets,
    refresh: fetchBalance,
  };
}
