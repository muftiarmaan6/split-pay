import { useState, useEffect } from 'react';
import { isConnected, isAllowed, requestAccess, getAddress } from '@stellar/freighter-api';

export default function Navbar({ publicKey, setPublicKey }) {
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const { isAllowed: allowed } = await isAllowed();
        if (allowed) {
          const { address } = await getAddress();
          if (address) setPublicKey(address);
        }
      } catch (error) {
        console.error("Passive connection check failed:", error);
      }
    };
    checkConnection();
  }, [setPublicKey]);

  const connectWallet = async () => {
    setIsConnecting(true);
    try {
      const { isConnected: installed } = await isConnected();
      if (!installed) {
        alert("Freighter browser extension not detected. Please install Freighter.");
        setIsConnecting(false);
        return;
      }
      
      const { address, error: accessError } = await requestAccess();
      if (accessError) {
        alert("Access denied by user.");
      } else if (address) {
        setPublicKey(address);
      }
    } catch (error) {
      console.error("Manual connection failed:", error);
      alert(`Wallet Connection Error:\n${error}\n${error.message}\nIf this persists, lock and unlock Freighter.`);
    }
    setIsConnecting(false);
  };

  const disconnectWallet = () => {
    setPublicKey("");
  };

  const formatKey = (key) => {
    if (!key) return "";
    return `${key.slice(0, 5)}...${key.slice(-4)}`;
  };

  return (
    <nav className="w-full flex items-center justify-between p-6 bg-card border-b border-gray-900 border-opacity-50">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-md bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-bold text-white shadow-[0_0_10px_rgba(168,85,247,0.4)] animate-pulse">
          SP
        </div>
        <h1 className="text-xl font-bold tracking-tight text-white">Split<span className="text-primary ml-1">Pay</span></h1>
      </div>

      <div>
        {!publicKey ? (
          <button
            onClick={connectWallet}
            disabled={isConnecting}
            className="px-5 py-2.5 rounded-lg bg-primary hover:bg-opacity-90 transition-all text-white font-medium text-sm shadow-[0_4px_14px_0_rgba(168,85,247,0.39)] disabled:opacity-50"
          >
            {isConnecting ? "Connecting..." : "Connect Wallet"}
          </button>
        ) : (
          <div className="flex items-center gap-4">
            <span className="text-sm font-mono text-textMuted bg-gray-900 px-3 py-1.5 rounded-md border border-gray-800">
              {formatKey(publicKey)}
            </span>
            <button
              onClick={disconnectWallet}
              className="text-sm text-accent hover:text-red-400 transition-colors font-medium"
            >
              Disconnect
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
