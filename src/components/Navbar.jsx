import { useState } from 'react';
import WalletModal from './WalletModal';

export default function Navbar({ publicKey, setPublicKey }) {
  const [showModal, setShowModal] = useState(false);

  const disconnectWallet = () => setPublicKey("");

  const formatKey = (key) => {
    if (!key) return "";
    // Shorter on mobile
    return `${key.slice(0, 4)}...${key.slice(-4)}`;
  };

  return (
    <>
      <nav className="w-full flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5 bg-card border-b border-gray-900 border-opacity-50">
        {/* Logo */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-md bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-bold text-white text-xs sm:text-sm shadow-[0_0_10px_rgba(168,85,247,0.4)] animate-pulse">
            SP
          </div>
          <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white">
            Split<span className="text-primary ml-0.5">Pay</span>
          </h1>
        </div>

        {/* Wallet Actions */}
        <div>
          {!publicKey ? (
            <button
              onClick={() => setShowModal(true)}
              className="px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg bg-primary hover:bg-opacity-90 transition-all text-white font-medium text-xs sm:text-sm shadow-[0_4px_14px_0_rgba(168,85,247,0.39)]"
            >
              <span className="hidden sm:inline">Connect Wallet</span>
              <span className="sm:hidden">Connect</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 sm:gap-4">
              <span className="text-xs font-mono text-textMuted bg-gray-900 px-2 sm:px-3 py-1 sm:py-1.5 rounded-md border border-gray-800 max-w-[120px] sm:max-w-none truncate">
                {formatKey(publicKey)}
              </span>
              <button
                onClick={disconnectWallet}
                className="text-xs sm:text-sm text-accent hover:text-red-400 transition-colors font-medium whitespace-nowrap"
              >
                Disconnect
              </button>
            </div>
          )}
        </div>
      </nav>

      <WalletModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConnect={(address) => setPublicKey(address)}
      />
    </>
  );
}
