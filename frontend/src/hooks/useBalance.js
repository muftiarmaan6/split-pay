/**
 * useBalance — Custom hook for XLM balance with cache-then-revalidate
 *
 * Shows cached balance instantly, then fetches fresh data in background.
 * Uses localStorage TTL cache (30 seconds).
 */
import { useState, useEffect, useCallback } from 'react';
import { fetchNativeBalance, fundWithFriendbot } from '../lib/stellar';
import { getCache, setCache } from '../lib/cache';
import { formatXLM } from '../lib/math';

const CACHE_TTL = 30; // seconds

export default function useBalance(publicKey) {
  const [balance, setBalance] = useState('0.00');
  const [isLoading, setIsLoading] = useState(false);
  const [isStale, setIsStale] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch balance with optional cache bypass.
   */
  const fetchBalance = useCallback(
    async (useLocalCache = true) => {
      if (!publicKey) return;

      // Serve from cache immediately if fresh
      if (useLocalCache) {
        const cached = getCache(`balance_${publicKey}`);
        if (cached !== null) {
          setBalance(cached);
          setIsLoading(false);
          setIsStale(true);
          // Background revalidation
          fetchBalance(false);
          return;
        }
      }

      setIsLoading(true);
      setIsStale(false);
      setError(null);

      try {
        const { balance: rawBalance } = await fetchNativeBalance(publicKey);
        const formatted = formatXLM(rawBalance);
        setBalance(formatted);
        setCache(`balance_${publicKey}`, formatted, CACHE_TTL);
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setError('Account not found. Please fund it via Friendbot.');
        } else {
          setError('Failed to fetch balance. Check your connection.');
        }
      } finally {
        setIsLoading(false);
      }
    },
    [publicKey]
  );

  /**
   * Fund the account via Friendbot (testnet only).
   */
  const fundAccount = useCallback(async () => {
    if (!publicKey) return;

    setIsLoading(true);
    setError(null);

    try {
      await fundWithFriendbot(publicKey);
      await fetchBalance(false);
    } catch {
      setError('Failed to fund account via Friendbot.');
      setIsLoading(false);
    }
  }, [publicKey, fetchBalance]);

  /**
   * Force refresh balance (bypasses cache).
   */
  const refresh = useCallback(() => {
    return fetchBalance(false);
  }, [fetchBalance]);

  // Fetch on mount / publicKey change
  useEffect(() => {
    if (publicKey) {
      fetchBalance(true);
    } else {
      setBalance('0.00');
      setIsLoading(false);
      setIsStale(false);
      setError(null);
    }
  }, [publicKey, fetchBalance]);

  return {
    balance,
    isLoading,
    isStale,
    error,
    refresh,
    fundAccount,
  };
}
