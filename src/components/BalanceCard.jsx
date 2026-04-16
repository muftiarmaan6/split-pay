import { useState, useEffect } from 'react';
import * as StellarSdk from '@stellar/stellar-sdk';
import { getCache, setCache } from '../lib/cache';

const horizonUrl = "https://horizon-testnet.stellar.org";
const server = new StellarSdk.Horizon.Server(horizonUrl);

export default function BalanceCard({ publicKey }) {
  const [balance, setBalance] = useState("0.00");
  const [isLoading, setIsLoading] = useState(true);
  const [isStale, setIsStale] = useState(false); // showing cached data
  const [error, setError] = useState("");

  const fetchBalance = async (useCache = true) => {
    // Serve from cache immediately if fresh
    if (useCache) {
      const cached = getCache(`balance_${publicKey}`);
      if (cached !== null) {
        setBalance(cached);
        setIsLoading(false);
        setIsStale(true);
        // Still revalidate in background
        fetchBalance(false);
        return;
      }
    }
    setIsLoading(true);
    setIsStale(false);
    setError("");
    try {
      const account = await server.loadAccount(publicKey);
      const nativeBalance = account.balances.find((b) => b.asset_type === "native");
      if (nativeBalance) {
        const formatted = parseFloat(nativeBalance.balance).toFixed(2);
        setBalance(formatted);
        setCache(`balance_${publicKey}`, formatted, 30); // cache 30s
      }
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setError("Account not found. Please fund it via Friendbot.");
      } else {
        setError("Failed to fetch balance.");
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (publicKey) {
      fetchBalance();
    }
  }, [publicKey]);

  const requestFriendbot = async () => {
    setIsLoading(true);
    setError("");
    try {
      await fetch(`https://friendbot.stellar.org?addr=${encodeURIComponent(publicKey)}`);
      await fetchBalance();
    } catch (err) {
      setError("Failed to fund account.");
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-card rounded-2xl border border-gray-900 shadow-[0_0_20px_rgba(168,85,247,0.15)] p-5 sm:p-6 animate-fade-in-up mt-4 sm:mt-6">
      <h3 className="text-textMuted text-xs sm:text-sm font-medium uppercase tracking-wider mb-2">Available Balance</h3>
      
      {isLoading ? (
        <div className="h-10 w-32 bg-gray-900 rounded animate-pulse my-2"></div>
      ) : error ? (
        <div className="text-accent text-sm my-4 bg-accent/10 p-3 rounded-lg border border-accent/20">
          {error}
          {error.includes("Friendbot") && (
            <button 
              onClick={requestFriendbot}
              className="block mt-3 px-4 py-2 bg-primary hover:bg-secondary text-white text-xs font-semibold rounded-md transition-colors"
            >
              Fund with Testnet XLM
            </button>
          )}
        </div>
      ) : (
        <div className="flex items-baseline gap-2 my-2">
          <span className="text-4xl font-extrabold text-white tracking-tight">{balance}</span>
          <span className="text-xl text-primary font-bold">XLM</span>
        </div>
      )}

      <button 
        onClick={fetchBalance}
        disabled={isLoading}
        className="mt-4 w-full flex justify-center items-center gap-2 py-2.5 rounded-lg bg-gray-900 hover:bg-gray-800 text-textMuted hover:text-white transition-colors border border-gray-800 text-sm font-medium disabled:opacity-50"
      >
        <svg className={`w-4 h-4 ${isLoading ? 'animate-spin text-primary' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
        </svg>
        {isLoading ? 'Updating...' : isStale ? '⚡ Cached · Refresh' : 'Refresh Balance'}
      </button>
    </div>
  );
}
