import React from 'react';

/**
 * Catches render-time crashes so a single bad data field or stale cache can't
 * leave the user staring at a blank (black) screen with nothing actionable.
 * The reset button also clears the service worker + caches, which recovers the
 * app if a stale precache is serving a broken shell.
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('App crashed:', error, info);
  }

  handleReset = async () => {
    try {
      if ('serviceWorker' in navigator) {
        const regs = await navigator.serviceWorker.getRegistrations();
        await Promise.all(regs.map((r) => r.unregister()));
      }
      if (window.caches) {
        const keys = await caches.keys();
        await Promise.all(keys.map((k) => caches.delete(k)));
      }
    } catch (e) {
      // best-effort cleanup; reload regardless
    }
    window.location.reload();
  };

  render() {
    if (this.state.error) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            textAlign: 'center',
            backgroundColor: 'var(--bg-primary)',
            color: 'var(--text-primary)',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          <h1 style={{ fontSize: '20px', marginBottom: '8px' }}>Something went wrong</h1>
          <p
            style={{
              color: 'var(--text-secondary)',
              fontSize: '14px',
              maxWidth: '320px',
              marginBottom: '20px',
            }}
          >
            The app hit an unexpected error. Reloading and clearing the cache usually fixes it.
          </p>
          <button
            onClick={this.handleReset}
            style={{
              backgroundColor: 'var(--accent)',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              padding: '10px 20px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Reload &amp; clear cache
          </button>
          <pre
            style={{
              marginTop: '20px',
              fontSize: '11px',
              color: 'var(--text-secondary)',
              maxWidth: '90vw',
              overflow: 'auto',
              whiteSpace: 'pre-wrap',
            }}
          >
            {String(this.state.error?.message || this.state.error)}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}
