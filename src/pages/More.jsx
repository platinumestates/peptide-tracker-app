import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, BookOpen, Settings, Zap } from 'lucide-react';

const menuItems = [
  { label: 'Inventory', path: '/inventory', icon: ShoppingCart },
  { label: 'Journal', path: '/journal', icon: BookOpen },
  { label: 'Settings', path: '/settings', icon: Settings },
];

export default function More() {
  return (
    <div className="max-w-2xl mx-auto p-4 pt-6">
      <h1 className="text-2xl font-bold mb-8">More</h1>

      <div className="space-y-3">
        {menuItems.map(({ label, path, icon: Icon }) => (
          <Link
            key={path}
            to={path}
            className="flex items-center gap-3 p-4 rounded-xl transition-all"
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border)',
            }}
          >
            <Icon size={24} style={{ color: 'var(--accent)' }} />
            <span className="font-medium">{label}</span>
          </Link>
        ))}
      </div>

      {/* About */}
      <div className="mt-12 pt-8" style={{ borderTop: '1px solid var(--border)' }}>
        <h2 className="text-lg font-semibold mb-4">About</h2>
        <div
          className="p-4 rounded-xl"
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border)',
          }}
        >
          <div className="space-y-3 text-sm">
            <div>
              <span style={{ color: 'var(--text-secondary)' }}>App:</span> Peptide Tracker
            </div>
            <div>
              <span style={{ color: 'var(--text-secondary)' }}>Version:</span> 1.0.0
            </div>
            <div>
              <span style={{ color: 'var(--text-secondary)' }}>Built with:</span> React + Vite
            </div>
            <div>
              <span style={{ color: 'var(--text-secondary)' }}>Data:</span> GitHub API
            </div>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="mt-8 p-4 rounded-xl" style={{ backgroundColor: 'var(--bg-elevated)' }}>
        <div className="flex gap-2 mb-2">
          <Zap size={18} style={{ color: 'var(--accent)' }} />
          <div className="text-sm">
            <div className="font-semibold mb-1">Progressive Web App</div>
            <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              Works offline. Install to your home screen for quick access.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
