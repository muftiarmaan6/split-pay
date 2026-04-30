/**
 * useWallet — Custom hook for wallet connection state management
 *
 * Provides connect/disconnect functionality with support for
 * Freighter, xBull, and Albedo wallets.
 */
import { useState, useCallback } from 'react';
import { connectWallet as connectWalletLib } from '../lib/wallet';

const STORAGE_KEY = 'splitpay_last_wallet';

export default function useWallet() {
  const [publicKey, setPublicKey] = useState('');
  const [walletId, setWalletId] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Connect to a specific wallet.
   * @param {string} id - Wallet identifier ('freighter', 'xbull', 'albedo')
   */
  const connect = useCallback(async (id) => {
    setIsConnecting(true);
    setError(null);

    try {
      const address = await connectWalletLib(id);
      setPublicKey(address);
      setWalletId(id);

      // Remember last wallet for reconnection hint
      try {
        localStorage.setItem(STORAGE_KEY, id);
      } catch {
        // localStorage unavailable
      }
    } catch (err) {
      const message = err.message || 'Wallet connection failed.';
      setError(message);
      throw err; // Re-throw so callers can handle
    } finally {
      setIsConnecting(false);
    }
  }, []);

  /**
   * Disconnect the current wallet.
   */
  const disconnect = useCallback(() => {
    setPublicKey('');
    setWalletId(null);
    setError(null);

    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // localStorage unavailable
    }
  }, []);

  /**
   * Clear the current error.
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Get the last used wallet ID from localStorage.
   * @returns {string|null}
   */
  const getLastWallet = useCallback(() => {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch {
      return null;
    }
  }, []);

  return {
    publicKey,
    walletId,
    isConnecting,
    error,
    connect,
    disconnect,
    clearError,
    getLastWallet,
    isConnected: !!publicKey,
  };
}
