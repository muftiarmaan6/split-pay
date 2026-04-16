import { useState, lazy, Suspense } from 'react';
import Navbar from './components/Navbar';
import BalanceCard from './components/BalanceCard';
import Toast, { useToast } from './components/Toast';
import EventFeed from './components/EventFeed';

// Lazy load ExpensePanel for code splitting — improves initial load time
const ExpensePanel = lazy(() => import('./components/ExpensePanel'));

// Skeleton fallback shown while ExpensePanel lazy-loads
function PanelSkeleton() {
  return (
    <div className="w-full max-w-2xl mx-auto mt-6 space-y-6 animate-pulse">
      <div className="bg-card rounded-2xl border border-gray-900 p-6">
        <div className="h-6 w-32 bg-gray-800 rounded mb-4" />
        <div className="h-4 w-64 bg-gray-800 rounded mb-6" />
        <div className="space-y-3">
          <div className="h-10 bg-gray-800 rounded-lg" />
          <div className="grid grid-cols-2 gap-4">
            <div className="h-10 bg-gray-800 rounded-lg" />
            <div className="h-10 bg-gray-800 rounded-lg" />
          </div>
          <div className="h-10 bg-gray-800 rounded-lg" />
          <div className="h-12 bg-gray-700 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

function App() {
  const [publicKey, setPublicKey] = useState('');
  const { toasts, addToast } = useToast();

  return (
    <div className="min-h-screen bg-background text-text flex flex-col font-sans">
      {/* Toast Notifications */}
      <Toast toasts={toasts} onDismiss={() => {}} />

      {/* Navigation & Wallet Connect */}
      <Navbar publicKey={publicKey} setPublicKey={setPublicKey} />

      {/* Main Content Area */}
      <main className="flex-1 w-full mx-auto px-4 sm:px-6 max-w-5xl flex flex-col items-center mt-8 sm:mt-12 pb-16 sm:pb-24">
        <div className="w-full max-w-2xl text-center space-y-3 sm:space-y-5">
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

            {/* ✨ Advanced Event Streaming — Live Network Feed */}
            <EventFeed publicKey={publicKey} />

            {/* Suspense boundary — shows skeleton while ExpensePanel bundle loads */}
            <Suspense fallback={<PanelSkeleton />}>
              <ExpensePanel publicKey={publicKey} addToast={addToast} />
            </Suspense>
          </div>
        )}
      </main>

      {/* Mobile-friendly footer */}
      <footer className="w-full border-t border-gray-900 py-4 px-4 text-center text-xs text-textMuted">
        SplitPay · Built on{' '}
        <a href="https://stellar.org" target="_blank" rel="noreferrer" className="text-primary hover:underline">
          Stellar Testnet
        </a>{' '}
        · Contract{' '}
        <a
          href="https://stellar.expert/explorer/testnet/contract/CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC"
          target="_blank"
          rel="noreferrer"
          className="font-mono text-primary hover:underline"
        >
          CDLZ…CYSC
        </a>
      </footer>
    </div>
  );
}

export default App;
