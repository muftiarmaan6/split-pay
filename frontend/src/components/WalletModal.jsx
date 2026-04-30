/**
 * WalletModal.jsx — Brutalist wallet connection panel
 *
 * Grid-based wallet selection with industrial styling.
 * Uses wallet.js abstraction for actual connections.
 */
import { useState } from 'react';
import { SUPPORTED_WALLETS } from '../lib/wallet';

const Icons = {
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

const WALLET_ICONS = {
  freighter: Icons.anchor,
  xbull: Icons.target,
  albedo: Icons.star,
};

export default function WalletModal({ isOpen, onClose, onConnect }) {
  const [connecting, setConnecting] = useState(null);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleConnect = async (wallet) => {
    setConnecting(wallet.id);
    setError(null);

    try {
      await onConnect(wallet.id);
      onClose();
    } catch (err) {
      setError(err.message || 'Connection failed. Please try again.');
    } finally {
      setConnecting(null);
    }
  };

  const handleClose = () => {
    onClose();
    setError(null);
    setConnecting(null);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.85)',
        zIndex: 500,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'default',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div
        style={{
          background: 'var(--black)',
          border: 'var(--border)',
          width: '100%',
          maxWidth: '480px',
          margin: '0 16px',
        }}
        className="anim-fade-up"
      >
        {/* Header */}
        <div style={{
          padding: '24px 32px',
          borderBottom: 'var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div>
            <h3 style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: '24px',
              letterSpacing: '3px',
              color: 'var(--yellow)',
            }}>
              CONNECT WALLET
            </h3>
            <p className="mono-small" style={{ marginTop: '4px', opacity: 0.5 }}>
              SELECT YOUR STELLAR WALLET PROVIDER
            </p>
          </div>
          <button
            onClick={handleClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--white)',
              cursor: 'pointer',
              fontSize: '20px',
              opacity: 0.5,
              padding: 0,
            }}
          >
            ✕
          </button>
        </div>

        {/* Wallet Grid */}
        <div style={{
          padding: '24px 32px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '12px',
        }}>
          {SUPPORTED_WALLETS.map((wallet) => (
            <button
              key={wallet.id}
              onClick={() => handleConnect(wallet)}
              disabled={connecting !== null}
              style={{
                border: connecting === wallet.id ? 'var(--border-yellow)' : 'var(--border)',
                padding: '20px 12px',
                background: connecting === wallet.id ? 'var(--yellow)' : 'var(--gray)',
                cursor: connecting !== null && connecting !== wallet.id ? 'not-allowed' : 'pointer',
                textAlign: 'center',
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: '11px',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                color: connecting === wallet.id ? 'var(--black)' : 'var(--white)',
                transition: 'all 0.1s',
                opacity: connecting !== null && connecting !== wallet.id ? 0.3 : 1,
              }}
              onMouseEnter={(e) => {
                if (connecting === null) {
                  e.currentTarget.style.background = 'var(--yellow)';
                  e.currentTarget.style.color = 'var(--black)';
                  e.currentTarget.style.borderColor = 'var(--yellow)';
                }
              }}
              onMouseLeave={(e) => {
                if (connecting !== wallet.id) {
                  e.currentTarget.style.background = 'var(--gray)';
                  e.currentTarget.style.color = 'var(--white)';
                  e.currentTarget.style.borderColor = 'var(--white)';
                }
              }}
            >
              <span style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
                {WALLET_ICONS[wallet.id] || '●'}
              </span>
              {connecting === wallet.id ? 'CONNECTING...' : wallet.name.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div style={{
            margin: '0 32px 16px',
            padding: '12px 16px',
            border: 'var(--border-red)',
            background: 'rgba(255,43,43,0.05)',
            fontSize: '11px',
            color: 'var(--red)',
          }}>
            ⚠ {error}
          </div>
        )}

        {/* Footer */}
        <div style={{
          padding: '16px 32px',
          borderTop: '1px solid var(--gray3)',
          textAlign: 'center',
        }}>
          <p className="mono-small">
            KEYS NEVER LEAVE YOUR DEVICE · STELLAR TESTNET
          </p>
        </div>
      </div>
    </div>
  );
}
