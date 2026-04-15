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
        <div className="min-h-screen bg-background text-text flex flex-col items-center justify-center p-6 font-sans">
          <div className="max-w-md w-full bg-card border border-red-900/40 rounded-2xl p-8 text-center shadow-[0_0_40px_rgba(239,68,68,0.1)]">
            <div className="w-16 h-16 mx-auto bg-red-900/20 rounded-full flex items-center justify-center mb-6 border border-red-500/20">
              <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Something went wrong</h2>
            <p className="text-textMuted text-sm mb-6 leading-relaxed">
              An unexpected error occurred. Please reload the page. If the issue persists, 
              try disconnecting your wallet and reconnecting.
            </p>
            {import.meta.env.DEV && this.state.error && (
              <pre className="text-left text-xs text-red-400 bg-red-900/10 border border-red-800/30 rounded-lg p-3 mb-6 overflow-auto max-h-32">
                {this.state.error.message}
              </pre>
            )}
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 bg-primary hover:bg-opacity-90 text-white rounded-lg font-medium text-sm transition-all shadow-[0_4px_14px_0_rgba(168,85,247,0.39)]"
            >
              Reload App
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
