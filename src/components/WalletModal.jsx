import { useState } from 'react';

const WALLETS = [
  { id: 'freighter', name: 'Freighter', color: 'bg-blue-500', letter: 'F', description: 'Browser Extension Wallet' },
  { id: 'xbull', name: 'xBull Wallet', color: 'bg-yellow-500 text-black', letter: 'xB', description: 'Browser & PWA Wallet' },
  { id: 'albedo', name: 'Albedo', color: 'bg-green-500', letter: 'A', description: 'Web-based Wallet' },
];

export default function WalletModal({ isOpen, onClose, onConnect }) {
  const [connecting, setConnecting] = useState(null);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const checkAndConnect = async (wallet) => {
    setConnecting(wallet.id);
    setError(null);

    try {
      if (wallet.id === 'freighter') {
        const freighterApi = await import('@stellar/freighter-api');

        // Check if Freighter is actually installed
        const isInstalled = await freighterApi.isConnected();
        if (!isInstalled) {
          throw new Error('Freighter wallet is not installed. Please install the Freighter browser extension and try again.');
        }

        const result = await freighterApi.requestAccess();
        if (result.error) throw new Error(result.error);

        const address = typeof result === 'string' ? result : result.address;
        if (address) {
          onConnect(address);
          onClose();
        } else {
          throw new Error('No address returned from Freighter.');
        }

      } else if (wallet.id === 'xbull') {
        // Check for xBull — it injects window.xBullSDK
        if (!window.xBullSDK) {
          throw new Error('xBull Wallet is not installed. Please install the xBull browser extension and try again.');
        }
        const result = await window.xBullSDK.connect();
        if (result?.publicKey) {
          onConnect(result.publicKey);
          onClose();
        }

      } else if (wallet.id === 'albedo') {
        // Check for Albedo — it's web-based, try dynamic import
        try {
          const albedo = await import('albedo-link');
          const result = await albedo.default.publicKey({});
          if (result?.pubkey) {
            onConnect(result.pubkey);
            onClose();
          }
        } catch {
          throw new Error('Albedo wallet is not available. Please ensure pop-ups are enabled or install the Albedo extension.');
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
      onClick={(e) => { if (e.target === e.currentTarget) { onClose(); setError(null); } }}
    >
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl animate-fade-in-up">
        {/* Header */}
        <div className="p-6 border-b border-gray-800 flex items-center justify-between">
          <div>
            <h3 className="text-white text-lg font-bold">Connect a Wallet</h3>
            <p className="text-gray-400 text-sm mt-0.5">Select your preferred Stellar wallet</p>
          </div>
          <button
            onClick={() => { onClose(); setError(null); }}
            className="text-gray-500 hover:text-white transition-colors p-1"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Wallet Options */}
        <div className="p-4 space-y-2">
          {WALLETS.map((wallet) => (
            <button
              key={wallet.id}
              onClick={() => checkAndConnect(wallet)}
              disabled={connecting !== null}
              className={`w-full flex items-center justify-between p-4 rounded-xl transition-all border group
                bg-gray-800 hover:bg-gray-700 border-gray-700 hover:border-purple-500 cursor-pointer
                ${connecting === wallet.id ? 'border-purple-500 bg-gray-700' : ''}
                ${connecting !== null && connecting !== wallet.id ? 'opacity-50' : ''}
              `}
            >
              <span className="text-white font-semibold flex items-center gap-3">
                <div className={`w-8 h-8 ${wallet.color} rounded-full flex items-center justify-center font-bold text-xs`}>
                  {wallet.letter}
                </div>
                <div className="text-left">
                  <div>{wallet.name}</div>
                  <div className="text-xs text-gray-400 font-normal">{wallet.description}</div>
                </div>
              </span>
              <span className="text-xs">
                {connecting === wallet.id ? (
                  <span className="text-purple-400 animate-pulse">Connecting...</span>
                ) : (
                  <svg className="w-4 h-4 text-gray-500 group-hover:text-purple-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </span>
            </button>
          ))}
        </div>

        {/* Error message — only shows AFTER clicking a wallet */}
        {error && (
          <div className="mx-4 mb-4 p-3 bg-red-900/20 border border-red-500/30 rounded-lg text-red-300 text-xs flex items-start gap-2">
            <svg className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  );
}
