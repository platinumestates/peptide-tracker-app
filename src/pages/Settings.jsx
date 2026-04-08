import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { readFile } from '../services/github';
import { useGitHub } from '../hooks/useGitHub';
import { Check, X, AlertCircle } from 'lucide-react';

export default function Settings() {
  const { state, dispatch, loadAppData } = useApp();
  const { loading: testLoading, error: testError, execute } = useGitHub();
  const [token, setToken] = useState(state.token);
  const [repo, setRepo] = useState(state.repo);
  const [testResult, setTestResult] = useState(null);

  const handleTestConnection = async () => {
    setTestResult(null);
    try {
      await execute(async () => {
        const result = await readFile(repo, 'protocol.json', token);
        if (result) {
          setTestResult({ success: true });
        } else {
          setTestResult({ success: false, error: 'protocol.json not found' });
        }
      });
    } catch (err) {
      setTestResult({ success: false, error: err.message });
    }
  };

  const handleSave = () => {
    dispatch({ type: 'SET_TOKEN', payload: token });
    dispatch({ type: 'SET_REPO', payload: repo });
    if (token && repo) {
      loadAppData(token, repo);
    }
  };

  const handleRequestNotifications = async () => {
    if (!('Notification' in window)) {
      alert('Notifications not supported');
      return;
    }
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      new Notification('Peptide Tracker', { body: 'Notifications enabled!' });
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 pt-6">
      <h1 className="text-2xl font-bold mb-8">Settings</h1>

      {!token || !repo ? (
        <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: '#ef4444', opacity: 0.15 }}>
          <div className="flex items-start gap-2 text-sm">
            <AlertCircle size={16} style={{ color: 'var(--danger)', flexShrink: 0 }} />
            <span>Connect GitHub to start tracking →</span>
          </div>
        </div>
      ) : null}

      {/* GitHub Connection */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-4">GitHub Connection</h2>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
              Personal Access Token
            </label>
            <input
              type="password"
              placeholder="ghp_..."
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="w-full mt-2 px-3 py-2 rounded-lg text-sm"
              style={{
                backgroundColor: 'var(--bg-elevated)',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)',
              }}
            />
          </div>
          <div>
            <label className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
              Data Repository
            </label>
            <input
              type="text"
              placeholder="username/peptide-tracker-data"
              value={repo}
              onChange={(e) => setRepo(e.target.value)}
              className="w-full mt-2 px-3 py-2 rounded-lg text-sm"
              style={{
                backgroundColor: 'var(--bg-elevated)',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)',
              }}
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={handleTestConnection}
              disabled={testLoading}
              className="flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                backgroundColor: 'var(--bg-elevated)',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)',
              }}
            >
              {testLoading ? 'Testing...' : 'Test Connection'}
            </button>
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-2 rounded-lg text-sm font-medium text-white transition-all"
              style={{ backgroundColor: 'var(--accent)' }}
            >
              Save
            </button>
          </div>

          {testResult && (
            <div className="p-3 rounded-lg text-sm" style={{ backgroundColor: testResult.success ? '#10b981' : '#ef4444', opacity: 0.2 }}>
              {testResult.success ? (
                <div className="flex items-center gap-2">
                  <Check size={16} />
                  <span>Connection successful!</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <X size={16} />
                  <span>{testResult.error}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Notifications */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Notifications</h2>
        <button
          onClick={handleRequestNotifications}
          className="w-full px-4 py-2 rounded-lg text-sm font-medium text-white transition-all"
          style={{ backgroundColor: 'var(--accent)' }}
        >
          Enable Dose Reminders
        </button>
        <div className="text-xs mt-2" style={{ color: 'var(--text-secondary)' }}>
          Permission: {Notification.permission === 'granted' ? '✓ Granted' : Notification.permission === 'denied' ? '✗ Denied' : '○ Not Set'}
        </div>
      </section>

      {/* Display */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Display</h2>
        <button
          onClick={() => dispatch({ type: 'TOGGLE_DARK_MODE' })}
          className="w-full px-4 py-2 rounded-lg text-sm font-medium text-white transition-all"
          style={{ backgroundColor: 'var(--accent)' }}
        >
          {state.darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
      </section>

      {/* Protocol Info */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Protocol</h2>
        {state.protocol ? (
          <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <div className="text-sm space-y-2">
              <div>
                <span style={{ color: 'var(--text-secondary)' }}>Version:</span> v{state.protocol.version}
              </div>
              <div>
                <span style={{ color: 'var(--text-secondary)' }}>Last Updated:</span> {state.protocol.lastUpdated}
              </div>
              <div>
                <span style={{ color: 'var(--text-secondary)' }}>Peptides:</span> {state.protocol.peptides?.length || 0}
              </div>
            </div>
          </div>
        ) : (
          <div style={{ color: 'var(--text-secondary)' }} className="text-sm">
            No protocol loaded
          </div>
        )}
      </section>
    </div>
  );
}
