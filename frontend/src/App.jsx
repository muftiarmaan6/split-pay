/**
 * App.jsx — Root application component (Brutalist Design)
 *
 * Updated structure to match marketing layout:
 * - Ticker
 * - Navbar
 * - Hero Section
 * - How It Works
 * - Dashboard
 */
import { lazy, Suspense, useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import BalanceCard from './components/BalanceCard';
import Toast, { useToast } from './components/Toast';
import EventFeed from './components/EventFeed';
import useWallet from './hooks/useWallet';
import useBalance from './hooks/useBalance';
import useTransaction from './hooks/useTransaction';
import FloatingElements from './components/FloatingElements';

const ExpensePanel = lazy(() => import('./components/ExpensePanel'));

const Icons = {
  wallet: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a8 8 0 0 1-5 7.59l-1.42 1.42a2 2 0 0 1-2.83 0l-1.42-1.42A8 8 0 0 1 5 19v-4"/><path d="M22 11h-4a2 2 0 0 0 0 4h4z"/>
    </svg>
  ),
  users: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  doc: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
    </svg>
  ),
  zap: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  ),
  anchor: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="5" r="3"/><line x1="12" y1="22" x2="12" y2="8"/><path d="M5 12H2a10 10 0 0 0 20 0h-3"/>
    </svg>
  ),
  target: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
    </svg>
  ),
  star: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  )
};

function PanelSkeleton() {
  return (
    <>
      <div className="panel anim-pulse" style={{ borderLeft: 'none', background: 'var(--black)', minHeight: '400px' }}>
        <div className="panel-label">// 03 — LOADING...</div>
        <div style={{ height: '40px', background: 'var(--gray)', marginBottom: '16px' }} />
        <div style={{ height: '40px', background: 'var(--gray)', marginBottom: '16px' }} />
        <div style={{ height: '40px', background: 'var(--gray)' }} />
      </div>
      <div className="panel anim-pulse" style={{ borderRight: 'none', background: 'var(--gray)', minHeight: '400px' }}>
        <div className="panel-label">// 04 — LOADING...</div>
      </div>
    </>
  );
}

function Ticker() {
  const [ledger, setLedger] = useState(48302114);
  const [xlmPrice, setXlmPrice] = useState(0.1124);

  useEffect(() => {
    const interval = setInterval(() => {
      setLedger((prev) => prev + Math.floor(Math.random() * 3) + 1);
      setXlmPrice((prev) => Math.max(0.08, prev + (Math.random() - 0.5) * 0.002));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      padding: '8px 32px',
      fontSize: '10px',
      background: 'var(--black)',
      borderBottom: '1px solid var(--gray3)',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      letterSpacing: '1px',
    }}>
      <div style={{ display: 'flex', gap: '32px' }}>
        <span style={{ color: 'var(--green)' }}>● +5 TODAY</span>
        <span style={{ opacity: 0.6 }}>NETWORK FEE <span style={{ color: 'var(--white)', opacity: 1 }}>0.00001 XLM STELLAR</span></span>
        <span style={{ opacity: 0.6 }}>SOROBAN <span style={{ color: 'var(--green)', opacity: 1 }}>ACTIVE TESTNET</span></span>
      </div>
      <div style={{ display: 'flex', gap: '32px' }}>
        <span style={{ opacity: 0.6 }}>LEDGER <span style={{ color: 'var(--white)', opacity: 1 }}>{ledger.toLocaleString()}</span></span>
        <span style={{ opacity: 0.6 }}>XLM/USD <span style={{ color: 'var(--green)', opacity: 1 }}>${xlmPrice.toFixed(4)}</span></span>
      </div>
    </div>
  );
}

function HeroSection({ onNavigate, isConnected }) {
  return (
    <div style={{
      padding: '100px 32px',
      textAlign: 'center',
      borderBottom: 'var(--border)',
      background: 'radial-gradient(circle at center, var(--gray) 0%, var(--black) 100%)',
    }}>
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '12px',
        border: '1px solid var(--gray3)',
        padding: '6px 16px',
        borderRadius: '20px',
        marginBottom: '40px',
        fontSize: '11px',
        letterSpacing: '2px',
        color: 'var(--green)'
      }}>
        <div className="anim-blink" style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--green)' }} />
        DECENTRALIZED EXPENSE SETTLEMENT ON STELLAR
      </div>

      <h1 style={{
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: 'clamp(64px, 10vw, 140px)',
        lineHeight: 0.9,
        letterSpacing: '2px',
        marginBottom: '24px',
        background: 'linear-gradient(90deg, var(--white) 0%, var(--yellow) 50%, var(--green) 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}>
        SPLIT. SETTLE. REPEAT.
      </h1>

      <p style={{
        maxWidth: '600px',
        margin: '0 auto 48px',
        fontSize: '16px',
        lineHeight: 1.6,
        color: 'var(--white)',
        opacity: 0.7,
      }}>
        Log shared expenses, automatically calculate who owes whom, and settle debts on-chain using XLM — all on the Stellar blockchain.
      </p>

      <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
        {!isConnected ? (
          <button onClick={() => onNavigate('dashboard')} className="btn btn-green" style={{ fontSize: '14px', padding: '16px 32px' }}>
            CONNECT WALLET →
          </button>
        ) : (
          <button 
            onClick={() => {
              onNavigate('expenses');
              setTimeout(() => {
                document.getElementById('add-expense-section')?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }} 
            className="btn btn-yellow" 
            style={{ fontSize: '14px', padding: '16px 32px' }}
          >
            + SPLIT EXPENSES
          </button>
        )}
        <a href="#how-it-works" className="btn" style={{ fontSize: '14px', padding: '16px 32px', border: '1px solid var(--gray3)' }}>
          EXPLORE FEATURES
        </a>
      </div>

      {/* Stats Row */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '64px',
        marginTop: '80px',
        flexWrap: 'wrap'
      }}>
        {[
          { label: 'TOTAL EXPENSES', value: '14,892', color: 'var(--green)' },
          { label: 'GROUPS CREATED', value: '3,401', color: 'var(--yellow)' },
          { label: 'SUCCESS RATE', value: '99.9%', color: 'var(--white)' },
          { label: 'XLM SETTLED', value: '1.2M+', color: 'var(--yellow)' },
        ].map((stat, i) => (
          <div key={i} style={{ textAlign: 'center' }}>
            <div style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: '48px',
              color: stat.color,
              lineHeight: 1,
              marginBottom: '8px'
            }}>{stat.value}</div>
            <div style={{ fontSize: '10px', letterSpacing: '2px', opacity: 0.5 }}>{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function HomeMarquee() {
  const phrases = Array(6).fill("• NO MIDDLEMEN • SETTLE ON-CHAIN • ZERO HIDDEN FEES • DECENTRALIZED PROTOCOL");
  return (
    <div style={{
      overflow: 'hidden',
      background: 'var(--yellow)',
      color: 'var(--black)',
      padding: '12px 0',
      borderBottom: '1px solid var(--gray)',
      position: 'relative',
      zIndex: 10
    }}>
      <div className="anim-marquee">
        <div style={{ display: 'flex', whiteSpace: 'nowrap' }}>
          {phrases.map((p, i) => <span key={i} style={{ margin: '0 24px', fontWeight: 700, letterSpacing: '2px', fontSize: '12px' }}>{p}</span>)}
        </div>
        <div style={{ display: 'flex', whiteSpace: 'nowrap' }}>
          {phrases.map((p, i) => <span key={'dup-'+i} style={{ margin: '0 24px', fontWeight: 700, letterSpacing: '2px', fontSize: '12px' }}>{p}</span>)}
        </div>
      </div>
    </div>
  );
}

function HowItWorksSection() {
  const steps = [
    { num: '01', title: 'CONNECT WALLET', desc: 'Link your Freighter wallet to authenticate on the Stellar network.' },
    { num: '02', title: 'CREATE GROUP', desc: 'Form a group with friends, roommates, or colleagues to share costs.' },
    { num: '03', title: 'LOG EXPENSES', desc: 'Add bills and let the smart contract calculate who owes whom.' },
    { num: '04', title: 'SETTLE ON-CHAIN', desc: 'Settle your debts instantly with XLM via automated batch transactions.' }
  ];

  return (
    <div id="how-it-works" style={{ padding: '80px 32px', borderBottom: 'var(--border)' }}>
      <div style={{ fontSize: '10px', color: 'var(--green)', letterSpacing: '3px', marginBottom: '16px' }}>— PROTOCOL</div>
      <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '64px', marginBottom: '48px', color: 'var(--white)' }}>
        HOW IT WORKS
      </h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
        {steps.map((step, i) => (
          <div key={i} style={{
            background: 'var(--gray)',
            border: '1px solid var(--gray3)',
            padding: '32px 24px',
            position: 'relative',
            overflow: 'hidden',
            transition: 'transform 0.2s, border-color 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--yellow)'}
          onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--gray3)'}
          >
            <div style={{
              position: 'absolute',
              top: '24px',
              right: '24px',
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: '32px',
              color: 'var(--gray3)',
              opacity: 0.5
            }}>
              {step.num}
            </div>
            <div style={{ color: 'var(--green)', marginBottom: '24px', display: 'flex' }}>
              {i === 0 ? Icons.wallet : i === 1 ? Icons.users : i === 2 ? Icons.doc : Icons.zap}
            </div>
            <div style={{ fontSize: '14px', fontWeight: 700, letterSpacing: '1px', marginBottom: '12px', color: 'var(--white)' }}>
              {step.title}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--white)', opacity: 0.6, lineHeight: 1.6 }}>
              {step.desc}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function WalletConnectPanel({ wallet }) {
  const [showOptions, setShowOptions] = useState(false);

  return (
    <div className="panel" style={{ background: 'var(--black)', width: '100%' }}>
      <div className="panel-label">// 01 — WALLET CONNECTION</div>
      
      {!showOptions ? (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <button 
            className="btn btn-green" 
            style={{ fontSize: '18px', padding: '20px 40px' }}
            onClick={() => setShowOptions(true)}
          >
            CONNECT WALLET
          </button>
        </div>
      ) : (
        <>
          <p className="mono-small" style={{ marginBottom: '20px', opacity: 0.6, fontSize: '12px', textAlign: 'center' }}>
            SELECT YOUR STELLAR WALLET PROVIDER. KEYS NEVER LEAVE YOUR DEVICE.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px', margin: '24px 0' }}>
            {['freighter', 'xbull', 'albedo'].map((id) => {
              const icons = { freighter: Icons.anchor, xbull: Icons.target, albedo: Icons.star };
              return (
                <button
                  key={id}
                  style={{
                    border: 'var(--border)', padding: '24px 16px', background: 'var(--gray)', cursor: 'pointer', textAlign: 'center',
                    fontFamily: "'IBM Plex Mono', monospace", fontSize: '14px', letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--white)', transition: 'all 0.1s',
                  }}
                  onClick={() => wallet.connect(id)}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--yellow)'; e.currentTarget.style.color = 'var(--black)'; e.currentTarget.style.borderColor = 'var(--yellow)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--gray)'; e.currentTarget.style.color = 'var(--white)'; e.currentTarget.style.borderColor = 'var(--white)'; }}
                >
                  <span style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>{icons[id]}</span>
                  {id.toUpperCase()}
                </button>
              );
            })}
          </div>
          <div className="sep" />
          <p className="mono-small" style={{ textAlign: 'center' }}>SUPPORTED: FREIGHTER · XBULL · ALBEDO · MORE SOON</p>
        </>
      )}
    </div>
  );
}

function WalletInfoPanel({ wallet, addToast }) {
  const handleCopy = () => {
    navigator.clipboard.writeText(wallet.publicKey);
    if (addToast) addToast('Address copied to clipboard', 'success');
  };

  return (
    <div className="panel" style={{ borderRight: 'none', background: 'var(--black)' }}>
      <div className="panel-label">// 02 — WALLET CONNECTED</div>
      <p className="mono-small" style={{ color: 'var(--green)', marginBottom: '8px' }}>✓ WALLET CONNECTED</p>
      <div 
        onClick={handleCopy}
        title="Click to copy"
        style={{ 
          fontSize: '12px', wordBreak: 'break-all', color: 'var(--green)', 
          padding: '12px 16px', border: 'var(--border-green)', margin: '16px 0', 
          background: 'rgba(0,255,136,0.05)', cursor: 'copy', transition: 'background 0.2s'
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0,255,136,0.15)'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(0,255,136,0.05)'}
      >
        {wallet.publicKey}
      </div>
      <div style={{ display: 'flex', gap: '10px' }}>
        <button className="btn btn-red" onClick={wallet.disconnect}>DISCONNECT</button>
      </div>
    </div>
  );
}

function App() {
  const wallet = useWallet();
  const balance = useBalance(wallet.publicKey);
  const transaction = useTransaction();
  const { toasts, addToast, dismissToast } = useToast();
  const [currentView, setCurrentView] = useState('home');
  const [scanlines, setScanlines] = useState(true);

  // Apply scanlines class to body
  useEffect(() => {
    if (scanlines) {
      document.body.classList.add('scanlines-on');
    } else {
      document.body.classList.remove('scanlines-on');
    }
  }, [scanlines]);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--black)', color: 'var(--white)', position: 'relative' }}>
      <FloatingElements />
      <Toast toasts={toasts} onDismiss={dismissToast} />
      
      {/* Top Banner Ticker */}
      <Ticker />

      {/* Navigation */}
      <Navbar
        publicKey={wallet.publicKey}
        walletId={wallet.walletId}
        isConnecting={wallet.isConnecting}
        onConnect={wallet.connect}
        onDisconnect={wallet.disconnect}
        currentView={currentView}
        onNavigate={setCurrentView}
      />

      {currentView === 'home' && (
        <>
          <HomeMarquee />
          {/* Hero Marketing Section */}
          <HeroSection onNavigate={setCurrentView} isConnected={wallet.isConnected} />

          {/* How it Works */}
          <HowItWorksSection />
        </>
      )}

      {currentView === 'dashboard' && (
        <>
          <div style={{
            padding: '40px 32px',
            borderBottom: 'var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--black)',
          }}>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '48px', color: 'var(--white)' }}>
              DASHBOARD
            </h2>
            <div style={{ fontSize: '11px', color: 'var(--green)', letterSpacing: '2px' }}>
              ● WALLET OVERVIEW
            </div>
          </div>

          <main className="main-scrollable" style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '48px', padding: '40px 32px', maxWidth: '1400px', margin: '0 auto' }}>
            <BalanceCard
              balance={balance.balance}
              isLoading={balance.isLoading}
              isStale={balance.isStale}
              error={balance.error}
              onRefresh={balance.refresh}
              onFund={balance.fundAccount}
              publicKey={wallet.publicKey}
              addToast={addToast}
            />

            {!wallet.isConnected ? (
              <WalletConnectPanel wallet={wallet} />
            ) : (
              <div className="panel" style={{ background: 'var(--black)', width: '100%' }}>
                <div className="panel-label">// 02 — QUICK ACTIONS</div>
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <button 
                    className="btn btn-yellow" 
                    style={{ fontSize: '18px', padding: '20px 40px', background: 'rgba(245, 230, 66, 0.05)' }}
                    onClick={() => {
                      setCurrentView('expenses');
                      setTimeout(() => {
                        document.getElementById('add-expense-section')?.scrollIntoView({ behavior: 'smooth' });
                      }, 100);
                    }}
                  >
                    + SPLIT EXPENSES
                  </button>
                </div>
              </div>
            )}

            {/* Event Feed spans the full width of the column */}
            <EventFeed publicKey={wallet.publicKey} />
          </main>
        </>
      )}

      {currentView === 'expenses' && (
        <>
          <div style={{
            padding: '40px 32px',
            borderBottom: 'var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--black)',
          }}>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '48px', color: 'var(--white)' }}>
              EXPENSES
            </h2>
            <div style={{ fontSize: '11px', color: 'var(--green)', letterSpacing: '2px' }}>
              ● SETTLEMENT LIVE
            </div>
          </div>

          <main className="main-scrollable" style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '48px', padding: '40px 32px', maxWidth: '1400px', margin: '0 auto' }}>
            <Suspense fallback={<PanelSkeleton />}>
              <ExpensePanel
                publicKey={wallet.publicKey}
                walletId={wallet.walletId}
                txState={transaction.txState}
                txHash={transaction.txHash}
                txError={transaction.txError}
                isPending={transaction.isPending}
                onAddExpenseTx={transaction.executeAddExpense}
                onSettleTx={transaction.executeSettlement}
                onResetTx={transaction.reset}
                addToast={addToast}
                isConnected={wallet.isConnected}
              />
            </Suspense>
          </main>
        </>
      )}
      
      {/* Footer */}
      <footer style={{ 
        padding: '40px 32px', 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTop: 'var(--border)' 
      }}>
        <div style={{ fontSize: '11px', opacity: 0.5 }}>
          SPLITPAY © 2026. BUILT ON STELLAR SOROBAN.
        </div>
        
        <button 
          onClick={() => setScanlines(!scanlines)}
          style={{
            background: 'transparent',
            border: '1px solid var(--gray3)',
            color: scanlines ? 'var(--green)' : 'var(--white)',
            opacity: scanlines ? 1 : 0.5,
            padding: '6px 12px',
            fontSize: '10px',
            fontFamily: "'IBM Plex Mono', monospace",
            letterSpacing: '1px',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          {scanlines ? 'CRT EFFECT: ON' : 'CRT EFFECT: OFF'}
        </button>
      </footer>
    </div>
  );
}

export default App;
