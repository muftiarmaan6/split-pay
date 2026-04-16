import { useEffect, useState, useRef } from 'react';
import * as StellarSdk from '@stellar/stellar-sdk';

const sorobanUrl = 'https://soroban-testnet.stellar.org';
const sorobanServer = new StellarSdk.rpc.Server(sorobanUrl);

// The SAC / SplitPay contract to watch
const CONTRACT_ID = 'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC';
const POLL_INTERVAL = 6000; // 6 seconds

function typeLabel(topics) {
  try {
    const t = topics.map((t) => StellarSdk.scValToNative(t));
    if (t[0] === 'expense' && t[1] === 'settled') return { label: 'Settled', color: 'green' };
    if (t[0] === 'expense' && t[1] === 'added') return { label: 'Added', color: 'blue' };
    if (t[0] === 'transfer') return { label: 'Transfer', color: 'purple' };
  } catch (_) { /* ignore */ }
  return { label: 'Event', color: 'gray' };
}

const colorMap = {
  green: 'bg-green-900/20 border-green-600/30 text-green-300',
  blue: 'bg-blue-900/20 border-blue-600/30 text-blue-300',
  purple: 'bg-purple-900/20 border-purple-600/30 text-purple-300',
  gray: 'bg-gray-800/40 border-gray-700/30 text-gray-400',
};

const dotMap = {
  green: 'bg-green-400',
  blue: 'bg-blue-400',
  purple: 'bg-purple-400',
  gray: 'bg-gray-500',
};

export default function EventFeed({ publicKey }) {
  const [events, setEvents] = useState([]);
  const [status, setStatus] = useState('idle'); // idle | polling | error
  const seenIds = useRef(new Set());

  useEffect(() => {
    if (!publicKey) return;
    setStatus('polling');

    const poll = async () => {
      try {
        const ledger = await sorobanServer.getLatestLedger();
        const startLedger = Math.max(ledger.sequence - 200, 1);
        const { events: raw } = await sorobanServer.getEvents({
          startLedger,
          filters: [{ contractIds: [CONTRACT_ID] }],
        });

        if (!raw?.length) return;

        const fresh = raw
          .filter((e) => !seenIds.current.has(e.id))
          .map((e) => {
            seenIds.current.add(e.id);
            const { label, color } = typeLabel(e.topic || []);
            return {
              id: e.id,
              label,
              color,
              ledger: e.ledger,
              time: new Date().toLocaleTimeString(),
            };
          });

        if (fresh.length > 0) {
          setEvents((prev) => [...fresh.reverse(), ...prev].slice(0, 20));
        }
        setStatus('polling');
      } catch (_) {
        setStatus('error');
      }
    };

    poll(); // immediate first run
    const timer = setInterval(poll, POLL_INTERVAL);
    return () => {
      clearInterval(timer);
      setStatus('idle');
    };
  }, [publicKey]);

  if (!publicKey) return null;

  return (
    <div className="w-full max-w-2xl mx-auto mt-6 bg-card rounded-2xl border border-gray-900 shadow-[0_0_20px_rgba(168,85,247,0.08)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-900">
        <div className="flex items-center gap-2.5">
          {/* Animated live dot */}
          <span className="relative flex h-2.5 w-2.5">
            {status === 'polling' && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            )}
            <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${status === 'error' ? 'bg-red-500' : 'bg-green-400'}`} />
          </span>
          <h3 className="font-bold text-sm tracking-wide uppercase text-textMuted">
            Live Network Feed
          </h3>
        </div>
        <span className="text-xs text-textMuted bg-gray-900 px-2.5 py-1 rounded-full border border-gray-800">
          Contract: {CONTRACT_ID.slice(0, 4)}…{CONTRACT_ID.slice(-4)}
        </span>
      </div>

      {/* Feed */}
      <div className="divide-y divide-gray-900 max-h-64 overflow-y-auto">
        {events.length === 0 ? (
          <div className="py-8 text-center text-textMuted text-sm flex flex-col items-center gap-2">
            <svg className="w-8 h-8 text-gray-700 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Listening for on-chain events…
          </div>
        ) : (
          events.map((ev) => (
            <div
              key={ev.id}
              className={`flex items-center gap-3 px-5 py-3 border-l-2 ${colorMap[ev.color]} border-l-${dotMap[ev.color].replace('bg-', '')}`}
            >
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${dotMap[ev.color]}`} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold">{ev.label}</p>
                <p className="text-xs opacity-60 font-mono truncate">Ledger #{ev.ledger}</p>
              </div>
              <span className="text-xs opacity-50 flex-shrink-0">{ev.time}</span>
            </div>
          ))
        )}
      </div>

      {/* Footer bar */}
      <div className="px-5 py-2 border-t border-gray-900 bg-black/20 flex items-center justify-between">
        <span className="text-xs text-textMuted">
          {events.length > 0 ? `${events.length} event${events.length !== 1 ? 's' : ''} detected` : 'Polling every 6s'}
        </span>
        <span className="text-xs text-textMuted">Soroban Testnet</span>
      </div>
    </div>
  );
}
