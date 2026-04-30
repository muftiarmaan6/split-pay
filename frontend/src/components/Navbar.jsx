/**
 * Navbar.jsx — Brutalist top navigation bar
 *
 * Grid-based nav with logo, status indicator, and wallet controls.
 */
import { useState, memo } from 'react';
import WalletModal from './WalletModal';
import { truncateKey } from '../lib/math';

function Navbar({ publicKey, walletId, isConnecting, onConnect, onDisconnect, currentView, onNavigate }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <nav
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 32px',
          height: '72px',
          borderBottom: 'var(--border)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          background: 'var(--black)',
        }}
      >
        {/* Logo */}
        <a
          href="#"
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: '28px',
            letterSpacing: '4px',
            color: 'var(--yellow)',
            textDecoration: 'none',
          }}
        >
          SPLIT
          <span
            style={{
              color: 'var(--white)',
              fontSize: '10px',
              verticalAlign: 'middle',
              marginLeft: '8px',
              fontFamily: "'IBM Plex Mono', monospace",
              letterSpacing: '2px',
              opacity: 0.6,
            }}
          >
            PAY /// v0.9.4
          </span>
        </a>

        {/* Center Navigation Links */}
        <div style={{
          display: 'flex',
          gap: '32px',
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: '12px',
          fontWeight: 700,
          letterSpacing: '2px',
        }}>
          <button 
            onClick={() => onNavigate('home')} 
            style={{ 
              background: 'transparent',
              cursor: 'pointer',
              color: currentView === 'home' ? 'var(--green)' : 'var(--white)', 
              opacity: currentView === 'home' ? 1 : 0.6,
              border: currentView === 'home' ? '1px solid var(--green)' : '1px solid transparent', 
              borderRadius: '4px',
              padding: '8px 16px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => { if (currentView !== 'home') e.currentTarget.style.opacity = 1; }}
            onMouseLeave={(e) => { if (currentView !== 'home') e.currentTarget.style.opacity = 0.6; }}
          >
            HOME
          </button>
          
          <button 
            onClick={() => onNavigate('expenses')} 
            style={{ 
              background: 'transparent',
              cursor: 'pointer',
              color: currentView === 'expenses' ? 'var(--green)' : 'var(--white)', 
              opacity: currentView === 'expenses' ? 1 : 0.6,
              border: currentView === 'expenses' ? '1px solid var(--green)' : '1px solid transparent', 
              borderRadius: '4px',
              padding: '8px 16px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => { if (currentView !== 'expenses') e.currentTarget.style.opacity = 1; }}
            onMouseLeave={(e) => { if (currentView !== 'expenses') e.currentTarget.style.opacity = 0.6; }}
          >
            EXPENSES
          </button>

          <button 
            onClick={() => onNavigate('dashboard')} 
            style={{ 
              background: 'transparent',
              cursor: 'pointer',
              color: currentView === 'dashboard' ? 'var(--green)' : 'var(--white)', 
              opacity: currentView === 'dashboard' ? 1 : 0.6,
              border: currentView === 'dashboard' ? '1px solid var(--green)' : '1px solid transparent', 
              borderRadius: '4px',
              padding: '8px 16px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => { if (currentView !== 'dashboard') e.currentTarget.style.opacity = 1; }}
            onMouseLeave={(e) => { if (currentView !== 'dashboard') e.currentTarget.style.opacity = 0.6; }}
          >
            DASHBOARD
          </button>
        </div>

        {/* Right */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', alignItems: 'center' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '3px 8px',
            border: '1px solid var(--gray3)',
            fontSize: '10px',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            color: 'var(--white)',
            opacity: 0.5,
          }}>
            <div
              className="anim-blink"
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: 'var(--blue)',
              }}
            />
            STELLAR TESTNET
          </div>

          {!publicKey ? (
            <button
              className="btn btn-yellow"
              onClick={() => setShowModal(true)}
              disabled={isConnecting}
            >
              {isConnecting ? 'CONNECTING...' : 'CONNECT WALLET'}
            </button>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                fontSize: '11px',
                color: 'var(--green)',
                letterSpacing: '1px',
                fontFamily: "'IBM Plex Mono', monospace",
              }}>
                ● {truncateKey(publicKey)}
              </span>
              <button className="btn btn-red" onClick={onDisconnect} style={{ fontSize: '10px', padding: '6px 14px' }}>
                DISCONNECT
              </button>
            </div>
          )}
        </div>
      </nav>

      <WalletModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConnect={async (walletIdToConnect) => {
          await onConnect(walletIdToConnect);
          setShowModal(false);
        }}
      />
    </>
  );
}

export default memo(Navbar);
