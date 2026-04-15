import { useState } from 'react';
import Navbar from './components/Navbar';
import BalanceCard from './components/BalanceCard';
import ExpensePanel from './components/ExpensePanel';
import Toast, { useToast } from './components/Toast';

function App() {
  const [publicKey, setPublicKey] = useState("");
  const { toasts, addToast } = useToast();

  return (
    <div className="min-h-screen bg-background text-text flex flex-col font-sans">
      {/* Toast Notifications */}
      <Toast toasts={toasts} onDismiss={(id) => {}} />

      {/* Navigation & Wallet Connect */}
      <Navbar publicKey={publicKey} setPublicKey={setPublicKey} />

      {/* Main Content Area */}
      <main className="flex-1 w-full mx-auto px-4 sm:px-6 max-w-5xl flex flex-col items-center mt-8 sm:mt-12 pb-16 sm:pb-24">
        <div className="w-full max-w-2xl text-center space-y-4 sm:space-y-6">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
            Split expenses on <span className="text-primary italic">Stellar</span>
          </h2>
          <p className="text-base sm:text-lg text-textMuted max-w-xl mx-auto px-2">
            A decentralized, frictionless way to split bills and settle debts directly using XLM.
          </p>
        </div>

        {!publicKey ? (
          <div className="mt-10 sm:mt-16 w-full max-w-2xl bg-card rounded-2xl border border-gray-900 border-opacity-50 p-6 sm:p-8 shadow-[0_0_40px_rgba(168,85,247,0.1)] transition-all duration-500 text-center py-10 sm:py-12 animate-fade-in-up">
            <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto bg-black rounded-full flex items-center justify-center mb-5 sm:mb-6 shadow-inner border border-gray-800">
              <svg className="w-7 h-7 sm:w-8 sm:h-8 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold mb-3 tracking-tight">Connect Your Wallet</h3>
            <p className="text-textMuted mb-6 max-w-sm mx-auto leading-relaxed text-sm sm:text-base">
              Connect your Freighter wallet to verify your identity and start splitting expenses.
            </p>
          </div>
        ) : (
          <div className="w-full mt-6 sm:mt-10">
            <BalanceCard publicKey={publicKey} />
            <ExpensePanel publicKey={publicKey} addToast={addToast} />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
