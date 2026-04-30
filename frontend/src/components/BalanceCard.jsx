/**
 * BalanceCard.jsx — Brutalist balance display panel
 *
 * Large Bebas Neue typography for balance, cache status badge,
 * meta info row, and action buttons.
 */
import { memo } from 'react';

function BalanceCard({ balance, isLoading, isStale, error, onRefresh, onFund, publicKey, addToast }) {
  const xlmPrice = 0.1124;
  const numBalance = parseFloat(balance) || 0;
  const usdValue = (numBalance * xlmPrice).toFixed(2);

  return (
    <div
      className="panel"
      style={{
        background: 'var(--gray)',
        borderLeft: 'none',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: '260px',
      }}
    >
      <div className="panel-label">// 01 — WALLET BALANCE</div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          {/* Cache Badge */}
          <div className={`cache-badge ${isStale ? 'cached' : 'fresh'}`}>
            <span>{isStale ? '◆' : '●'}</span>
            <span>{isLoading ? 'FETCHING' : isStale ? 'CACHED' : 'FRESH'}</span>
          </div>

          {/* Wallet Address Display */}
          {publicKey && (
            <div 
              onClick={() => {
                navigator.clipboard.writeText(publicKey);
                if (addToast) addToast('Wallet address copied!', 'success');
              }}
              title="Click to copy"
              style={{
                fontSize: '14px',
                color: 'var(--green)',
                padding: '8px 16px',
                border: 'var(--border-green)',
                background: 'rgba(0,255,136,0.05)',
                cursor: 'copy',
                transition: 'background 0.2s',
                fontFamily: "'IBM Plex Mono', monospace",
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0,255,136,0.15)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(0,255,136,0.05)'}
            >
              <span style={{ opacity: 0.5, marginRight: '8px' }}>WALLET:</span>
              {publicKey.slice(0, 8)}...{publicKey.slice(-8)}
            </div>
          )}
        </div>

        {/* Balance Amount */}
        {error ? (
          <div style={{
            margin: '16px 0',
            padding: '16px',
            border: 'var(--border-red)',
            background: 'rgba(255,43,43,0.05)',
          }}>
            <p style={{ color: 'var(--red)', fontSize: '12px', letterSpacing: '1px' }}>
              {error}
            </p>
            {error.includes('Friendbot') && (
              <button
                className="btn btn-yellow"
                onClick={onFund}
                style={{ marginTop: '12px', fontSize: '10px', padding: '8px 16px' }}
              >
                FUND WITH TESTNET XLM
              </button>
            )}
          </div>
        ) : (
          <div
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 'clamp(72px, 13.5vw, 144px)',
              letterSpacing: '-4px',
              lineHeight: 0.9,
              color: 'var(--yellow)',
              margin: '24px 0',
              transition: 'opacity 0.3s',
              opacity: isLoading && !isStale ? 0.3 : 1,
              textShadow: '0 0 40px rgba(245, 230, 66, 0.1)',
            }}
            className={isLoading && !isStale ? 'anim-pulse' : ''}
          >
            {numBalance.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 7,
            })}
            <span style={{
              fontSize: 'clamp(24px, 4vw, 40px)',
              color: 'var(--white)',
              opacity: 0.4,
              marginLeft: '16px',
              letterSpacing: '2px'
            }}>
              XLM
            </span>
          </div>
        )}

        {/* Meta Row */}
        <div style={{ display: 'flex', gap: '48px', marginTop: '16px', borderTop: '1px solid var(--gray3)', paddingTop: '24px' }}>
          <div style={{ fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', opacity: 0.6 }}>
            <span style={{ color: 'var(--white)', display: 'block', fontSize: '18px', fontWeight: 700, marginBottom: '4px', opacity: 1 }}>
              ${parseFloat(usdValue).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
            ESTIMATED USD VALUE
          </div>
          <div style={{ fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', opacity: 0.6 }}>
            <span style={{ color: 'var(--white)', display: 'block', fontSize: '18px', fontWeight: 700, marginBottom: '4px', opacity: 1 }}>
              {publicKey ? new Date().toLocaleTimeString() : '—'}
            </span>
            LAST NETWORK FETCH
          </div>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '10px', marginTop: '20px', flexWrap: 'wrap' }}>
        <button className="btn" onClick={onRefresh} disabled={isLoading && !isStale}>
          ↻ REFRESH
        </button>
        <button
          className="btn"
          onClick={() => {
            if (publicKey) {
              navigator.clipboard.writeText(publicKey);
            }
          }}
          disabled={!publicKey}
        >
          ⧉ COPY ADDRESS
        </button>
      </div>
    </div>
  );
}

export default memo(BalanceCard);
