/**
 * TxProgress.jsx — Brutalist transaction progress stages
 *
 * Numbered stage list with industrial styling.
 * IDLE → PREPARING → SIGNING → SUBMITTING → CONFIRMED | ERROR
 */
import { memo } from 'react';
import { TX_STATES } from '../hooks/useTransaction';

const STEPS = [
  { state: TX_STATES.PREPARING, label: 'PREPARING', desc: 'Building Soroban invokeHostFunction tx', num: '1' },
  { state: TX_STATES.SIGNING, label: 'SIGNING', desc: 'Awaiting wallet signature authorization', num: '2' },
  { state: TX_STATES.SUBMITTING, label: 'SUBMITTING', desc: 'Broadcasting XDR to Soroban RPC', num: '3' },
  { state: TX_STATES.CONFIRMED, label: 'CONFIRMED', desc: 'Transaction finalized on ledger', num: '4' },
];

const STATE_ORDER = {
  [TX_STATES.IDLE]: 0,
  [TX_STATES.PREPARING]: 1,
  [TX_STATES.SIGNING]: 2,
  [TX_STATES.SUBMITTING]: 3,
  [TX_STATES.CONFIRMED]: 4,
  [TX_STATES.ERROR]: -1,
};

function TxProgress({ txState }) {
  const currentOrder = STATE_ORDER[txState] ?? 0;
  const isError = txState === TX_STATES.ERROR;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {/* Idle Stage */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        padding: '16px 0',
        borderBottom: '1px solid var(--gray3)',
        opacity: txState === TX_STATES.IDLE ? 1 : 0.5,
        transition: 'opacity 0.3s',
      }}>
        <div style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: '32px',
          color: txState === TX_STATES.IDLE ? 'var(--white)' : 'var(--gray3)',
          width: '40px',
          textAlign: 'center',
        }}>
          0
        </div>
        <div style={{ flex: 1 }}>
          <div style={{
            fontWeight: 700,
            letterSpacing: '2px',
            textTransform: 'uppercase',
            fontSize: '12px',
            color: 'var(--white)',
          }}>
            IDLE
          </div>
          <div style={{ fontSize: '11px', opacity: 0.5, marginTop: '2px' }}>
            Awaiting settlement trigger
          </div>
        </div>
        <div style={{ fontSize: '20px', width: '28px', textAlign: 'right' }}>◯</div>
      </div>

      {/* Transaction Stages */}
      {STEPS.map((step, i) => {
        const stepOrder = i + 1;
        const isCompleted = currentOrder > stepOrder;
        const isActive = currentOrder === stepOrder && !isError;
        const isErrorOnThisStep = isError && currentOrder === -1;

        let numColor = 'var(--gray3)';
        let nameColor = 'var(--white)';
        let stageOpacity = 0.3;

        if (isActive) {
          numColor = 'var(--yellow)';
          nameColor = 'var(--yellow)';
          stageOpacity = 1;
        } else if (isCompleted) {
          numColor = 'var(--green)';
          nameColor = 'var(--green)';
          stageOpacity = 0.7;
        }

        let icon = '—';
        if (isCompleted) {
          icon = <span style={{ color: 'var(--green)' }}>✓</span>;
        } else if (isActive) {
          icon = step.state === TX_STATES.CONFIRMED
            ? <span style={{ color: 'var(--green)' }}>✓</span>
            : <div className="spinner" />;
        }

        return (
          <div
            key={step.state}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              padding: '16px 0',
              borderBottom: i < STEPS.length - 1 ? '1px solid var(--gray3)' : 'none',
              opacity: stageOpacity,
              transition: 'opacity 0.3s',
            }}
          >
            <div style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: '32px',
              color: numColor,
              width: '40px',
              textAlign: 'center',
              transition: 'color 0.3s',
            }}>
              {step.num}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{
                fontWeight: 700,
                letterSpacing: '2px',
                textTransform: 'uppercase',
                fontSize: '12px',
                color: nameColor,
                transition: 'color 0.3s',
              }}>
                {step.label}
              </div>
              <div style={{ fontSize: '11px', opacity: 0.5, marginTop: '2px' }}>
                {step.desc}
              </div>
            </div>
            <div style={{ fontSize: '20px', width: '28px', textAlign: 'right' }}>
              {icon}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default memo(TxProgress);
