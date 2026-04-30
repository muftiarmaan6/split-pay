/**
 * Toast.jsx — Brutalist toast notification system
 *
 * Industrial-styled error/success/info notifications.
 */
import { useState, useCallback } from 'react';

// ─── Toast Hook ─────────────────────────────────────────────────────────────
export function useToast() {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, addToast, dismissToast };
}

// ─── Styles ─────────────────────────────────────────────────────────────────
const TOAST_STYLES = {
  success: {
    border: 'var(--border-green)',
    titleColor: 'var(--green)',
    icon: '✓',
  },
  error: {
    border: 'var(--border-red)',
    titleColor: 'var(--red)',
    icon: '⚠',
  },
  info: {
    border: 'var(--border-yellow)',
    titleColor: 'var(--yellow)',
    icon: '●',
  },
};

// ─── Toast Component ────────────────────────────────────────────────────────
export default function Toast({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '32px',
      left: '32px',
      right: '32px',
      maxWidth: '480px',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
    }}>
      {toasts.map((toast) => {
        const style = TOAST_STYLES[toast.type] || TOAST_STYLES.info;
        return (
          <div
            key={toast.id}
            className="anim-toast"
            style={{
              background: 'var(--black)',
              border: style.border,
              padding: '16px 20px',
              display: 'flex',
              gap: '12px',
              alignItems: 'flex-start',
            }}
          >
            <div style={{ color: style.titleColor, fontSize: '18px', marginTop: '1px' }}>
              {style.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{
                color: style.titleColor,
                fontWeight: 700,
                fontSize: '12px',
                letterSpacing: '2px',
                textTransform: 'uppercase',
                marginBottom: '4px',
              }}>
                {toast.type.toUpperCase()}
              </div>
              <div style={{ fontSize: '12px', opacity: 0.8 }}>
                {toast.message}
              </div>
            </div>
            <button
              onClick={() => onDismiss?.(toast.id)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--white)',
                cursor: 'pointer',
                fontSize: '18px',
                opacity: 0.5,
                padding: 0,
                lineHeight: 1,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = 1; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = 0.5; }}
            >
              ✕
            </button>
          </div>
        );
      })}
    </div>
  );
}
