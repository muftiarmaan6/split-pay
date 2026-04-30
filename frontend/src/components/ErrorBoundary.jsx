import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // In production this would send to an error tracking service (e.g. Sentry)
    console.error('[ErrorBoundary] Caught error:', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          background: 'var(--black)',
          color: 'var(--white)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '48px',
          fontFamily: "'IBM Plex Mono', monospace",
        }}>
          <div style={{
            maxWidth: '480px',
            width: '100%',
            border: 'var(--border-red)',
            padding: '48px',
            textAlign: 'center',
          }}>
            <div style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: '72px',
              color: 'var(--red)',
              marginBottom: '16px',
              letterSpacing: '4px',
            }}>
              ERROR
            </div>
            <p style={{
              fontSize: '12px',
              opacity: 0.7,
              marginBottom: '24px',
              letterSpacing: '1px',
              lineHeight: 1.6,
            }}>
              AN UNEXPECTED ERROR OCCURRED. PLEASE RELOAD THE PAGE.
              IF THE ISSUE PERSISTS, TRY DISCONNECTING YOUR WALLET AND RECONNECTING.
            </p>
            {import.meta.env.DEV && this.state.error && (
              <pre style={{
                textAlign: 'left',
                fontSize: '10px',
                color: 'var(--red)',
                border: '1px solid var(--red)',
                padding: '12px',
                marginBottom: '24px',
                overflow: 'auto',
                maxHeight: '120px',
                background: 'rgba(255,43,43,0.05)',
              }}>
                {this.state.error.message}
              </pre>
            )}
            <button
              className="btn btn-red btn-lg"
              onClick={() => window.location.reload()}
            >
              RELOAD APP
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
