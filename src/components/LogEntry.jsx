import React from 'react';
import { format } from 'date-fns';

export default function LogEntry({ entry, date }) {
  if (!entry) return null;

  const dosesTaken = entry.doses ? entry.doses.filter(d => d.taken).length : 0;
  const totalDoses = entry.doses ? entry.doses.length : 0;

  return (
    <div
      className="p-4 rounded-xl border"
      style={{
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--border)',
      }}
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-sm">
          {format(new Date(entry.date), 'EEEE, MMM d')}
        </h3>
        <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: 'var(--accent)', opacity: 0.2, color: 'var(--accent)' }}>
          {dosesTaken}/{totalDoses} doses
        </span>
      </div>

      <div className="grid grid-cols-4 gap-2 mb-3">
        {entry.hrv && (
          <div className="text-center text-xs">
            <div className="font-mono font-bold">{entry.hrv}</div>
            <div style={{ color: 'var(--text-secondary)' }}>HRV</div>
          </div>
        )}
        {entry.mood && (
          <div className="text-center text-xs">
            <div className="text-lg">{['😞', '😕', '😐', '😊', '😄'][entry.mood - 1] || '😐'}</div>
            <div style={{ color: 'var(--text-secondary)' }}>Mood</div>
          </div>
        )}
        {entry.energy && (
          <div className="text-center text-xs">
            <div className="text-lg">⚡</div>
            <div style={{ color: 'var(--text-secondary)' }}>{entry.energy}/5</div>
          </div>
        )}
        {entry.focus && (
          <div className="text-center text-xs">
            <div className="text-lg">🎯</div>
            <div style={{ color: 'var(--text-secondary)' }}>{entry.focus}/5</div>
          </div>
        )}
      </div>

      {entry.note && (
        <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
          {entry.note.substring(0, 100)}{entry.note.length > 100 ? '...' : ''}
        </div>
      )}
    </div>
  );
}
