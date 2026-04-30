/**
 * EventFeed.jsx — Brutalist live contract event feed
 *
 * Grid-based event rows with type badges.
 * Polls Soroban RPC every 5 seconds for contract events.
 */
import { useEffect, useState, useRef, memo, useCallback } from 'react';
import { fetchContractEvents, CONTRACT_ID } from '../lib/stellar';
import { truncateKey } from '../lib/math';

const POLL_INTERVAL = 5000;

const TYPE_STYLES = {
  Settled: { borderColor: 'var(--green)', color: 'var(--green)', label: 'SETTLE' },
  Transfer: { borderColor: 'var(--blue)', color: '#4d9eff', label: 'TRANSFER' },
  Added: { borderColor: 'var(--yellow)', color: 'var(--yellow)', label: 'SPLIT' },
  Event: { borderColor: 'var(--gray3)', color: 'var(--white)', label: 'EVENT' },
};

function EventFeed({ publicKey }) {
  const [events, setEvents] = useState([]);
  const [status, setStatus] = useState('idle');
  const seenIds = useRef(new Set());

  const poll = useCallback(async () => {
    try {
      const allEvents = await fetchContractEvents(CONTRACT_ID);
      const fresh = allEvents
        .filter((e) => !seenIds.current.has(e.id))
        .map((e) => {
          seenIds.current.add(e.id);
          return {
            ...e,
            time: new Date(e.timestamp).toLocaleTimeString('en-US', {
              hour12: false,
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            }),
          };
        });

      if (fresh.length > 0) {
        setEvents((prev) => [...fresh.reverse(), ...prev].slice(0, 50));
      }
      setStatus('polling');
    } catch {
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    if (!publicKey) return;
    setStatus('polling');

    poll();
    const timer = setInterval(poll, POLL_INTERVAL);

    return () => {
      clearInterval(timer);
      setStatus('idle');
    };
  }, [publicKey, poll]);

  if (!publicKey) return null;

  return (
    <div
      className="panel"
      style={{
        gridColumn: '1 / 3',
        borderLeft: 'none',
        borderRight: 'none',
        background: 'var(--black)',
        padding: 0,
      }}
    >
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px 32px',
        borderBottom: 'var(--border)',
        position: 'sticky',
        top: '56px',
        background: 'var(--black)',
        zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: '20px',
            letterSpacing: '3px',
          }}>
            CONTRACT EVENT FEED
          </div>
          <div style={{
            padding: '2px 8px',
            background: 'var(--yellow)',
            color: 'var(--black)',
            fontSize: '11px',
            fontWeight: 700,
          }}>
            {events.length}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div className="cache-badge fresh">
            <div
              className="anim-blink"
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: status === 'error' ? 'var(--red)' : 'var(--green)',
              }}
            />
            {status === 'error' ? 'RPC ERROR' : 'POLLING EVERY 5s'}
          </div>
          <button
            className="btn"
            style={{ fontSize: '10px', padding: '6px 14px' }}
            onClick={() => {
              setEvents([]);
              seenIds.current.clear();
            }}
          >
            CLEAR
          </button>
        </div>
      </div>

      {/* Event List */}
      <div
        className="scrollbar-brutal"
        style={{ maxHeight: '320px', overflowY: 'auto' }}
      >
        {events.length === 0 ? (
          <div style={{
            padding: '40px 32px',
            opacity: 0.3,
            fontSize: '12px',
            letterSpacing: '2px',
            textTransform: 'uppercase',
          }}>
            — NO EVENTS YET. EVENTS WILL APPEAR HERE IN REAL TIME —
          </div>
        ) : (
          events.map((ev) => {
            const typeStyle = TYPE_STYLES[ev.label] || TYPE_STYLES.Event;
            return (
              <div
                key={ev.id}
                className="anim-slide-in event-row-grid"
                style={{
                  display: 'grid',
                  gridTemplateColumns: '120px 1fr 120px 100px',
                  gap: '16px',
                  padding: '16px 32px',
                  borderBottom: '1px solid var(--gray)',
                  alignItems: 'center',
                  transition: 'background 0.1s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--gray)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                <div style={{
                  fontSize: '10px',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  padding: '4px 8px',
                  border: `1px solid ${typeStyle.borderColor}`,
                  textAlign: 'center',
                  fontWeight: 700,
                  color: typeStyle.color,
                }}>
                  {typeStyle.label}
                </div>
                <div style={{ fontSize: '12px', opacity: 0.7 }}>
                  Ledger #{ev.ledger?.toLocaleString()}
                </div>
                <div style={{ fontSize: '11px', textAlign: 'right', opacity: 0.4, letterSpacing: '1px' }}>
                  LEDGER #{ev.ledger?.toLocaleString()}
                </div>
                <div className="event-time-col" style={{ fontSize: '11px', textAlign: 'right', color: 'var(--yellow)', opacity: 0.8 }}>
                  {ev.time}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default memo(EventFeed);
