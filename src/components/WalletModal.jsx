import { useState } from 'react';

// Wallet selection modal + Freighter connection
// This replaces the broken SWK mock with a proper React-based multi-wallet modal

const WALLETS = [
  { id: 'freighter', name: 'Freighter', color: 'bg-blue-500', letter: 'F', available: true },
  { id: 'xbull', name: 'xBull Wallet', color: 'bg-yellow-500 text-black', letter: 'xB', available: false },
  { id: 'albedo', name: 'Albedo', color: 'bg-green-500', letter: 'A', available: false },
];

export default function WalletModal({ isOpen, onClose, onConnect }) {
  const [connecting, setConnecting] = useState(null);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSelect = async (wallet) => {
    if (!wallet.available) {
      setError(`${wallet.name} is not installed. Please install it or choose another wallet.`);
      return;
    }

    setConnecting(wallet.id);
    setError(null);

    try {
      if (wallet.id === 'freighter') {
        // Dynamically import freighter-api to connect
        const freighterApi = await import('@stellar/freighter-api');

        // v6 API: requestAccess returns { address, error }
        const result = await freighterApi.requestAccess();
        
        if (result.error) {
          throw new Error(result.error);
        }

        const address = typeof result === 'string' ? result : result.address;
        if (address) {
          onConnect(address);
          onClose();
        } else {
          throw new Error('No address returned from Freighter');
        }
      }
    } catch (err) {
      console.error('Wallet connection error:', err);
      setError(err.message || 'Connection failed. Please try again.');
    } finally {
      setConnecting(null);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl animate-fade-in-up">
        {/* Header */}
        <div className="p-6 border-b border-gray-800 flex items-center justify-between">
          <div>
            <h3 className="text-white text-lg font-bold">Connect a Wallet</h3>
            <p className="text-gray-400 text-sm mt-0.5">Select your preferred Stellar wallet</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white transition-colors p-1"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Wallet options */}
        <div className="p-4 space-y-2">
          {WALLETS.map((wallet) => (
            <button
              key={wallet.id}
              onClick={() => handleSelect(wallet)}
              disabled={connecting !== null}
              className={`w-full flex items-center justify-between p-4 rounded-xl transition-all border group
                ${wallet.available
                  ? 'bg-gray-800 hover:bg-gray-700 border-gray-700 hover:border-purple-500 cursor-pointer'
                  : 'bg-gray-800/50 border-gray-800 cursor-not-allowed opacity-60'
                }
                ${connecting === wallet.id ? 'border-purple-500 bg-gray-700' : ''}
              `}
            >
              <span className="text-white font-semibold flex items-center gap-3">
                <div className={`w-8 h-8 ${wallet.color} rounded-full flex items-center justify-center font-bold text-xs`}>
                  {wallet.letter}
                </div>
                {wallet.name}
              </span>
              <span className="text-xs">
                {connecting === wallet.id ? (
                  <span className="text-purple-400 animate-pulse">Connecting...</span>
                ) : wallet.available ? (
                  <span className="text-green-400 opacity-0 group-hover:opacity-100 transition-opacity">Detected ✓</span>
                ) : (
                  <span className="text-gray-500">Not Installed</span>
                )}
              </span>
            </button>
          ))}
        </div>

        {/* Error message */}
        {error && (
          <div className="mx-4 mb-4 p-3 bg-red-900/20 border border-red-500/30 rounded-lg text-red-300 text-xs">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
