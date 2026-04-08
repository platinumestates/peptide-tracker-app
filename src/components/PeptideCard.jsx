import React from 'react';
import { ChevronDown } from 'lucide-react';

export default function PeptideCard({ peptide, cycleStatus, expanded, onToggle }) {
  return (
    <div
      className="rounded-xl border transition-all"
      style={{
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--border)',
        borderLeft: `4px solid ${peptide.color}`,
      }}
    >
      <button
        onClick={onToggle}
        className="w-full p-4 flex items-center gap-3 hover:bg-opacity-80 transition-colors"
      >
        <div className="flex-1 text-left">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-base">{peptide.name}</h3>
            <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: peptide.color + '20', color: peptide.color }}>
              {peptide.shortName}
            </span>
          </div>
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: 'var(--border)', color: 'var(--text-secondary)' }}>
              {peptide.category.replace(/_/g, ' ')}
            </span>
            <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              {peptide.schedule === 'daily' ? 'Daily'
              : peptide.schedule === 'MWF' ? 'Mon/Wed/Fri'
              : peptide.schedule === 'weekdays' ? 'Weekdays'
              : peptide.schedule === 'workout_days' ? 'Workout Days (MWF)'
              : peptide.schedule === 'daily_during_course' ? 'During Course'
              : peptide.schedule}
            </span>
          </div>
          <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            {peptide.doses.length} dose{peptide.doses.length !== 1 ? 's' : ''} / day
          </div>
        </div>
        <ChevronDown
          size={20}
          style={{ color: 'var(--text-secondary)', transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
        />
      </button>

      {expanded && (
        <div className="border-t px-4 py-3" style={{ borderColor: 'var(--border)' }}>
          <div className="space-y-3">
            {peptide.doses.map((dose, idx) => (
              <div key={idx} className="text-sm">
                <div className="font-medium mb-1">{dose.label}</div>
                <div className="text-xs space-y-1" style={{ color: 'var(--text-secondary)' }}>
                  <div>Amount: {dose.amount} {dose.unit}</div>
                  <div>Route: {dose.route}</div>
                  <div>Timing: {dose.timing}</div>
                  {dose.reminderTime && <div>Reminder: {dose.reminderTime}</div>}
                </div>
              </div>
            ))}

            {peptide.cycleDays && (
              <div className="mt-3 pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
                <div className="text-xs font-medium mb-1">Cycle Pattern:</div>
                <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  {peptide.cycleDays.on} days ON
                  {peptide.cycleDays.bridge ? ` → ${peptide.cycleDays.bridgeDays} days ${peptide.cycleDays.bridge}` : ` / ${peptide.cycleDays.off} days OFF`}
                </div>
              </div>
            )}

            {peptide.notes && (
              <div className="mt-3 pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
                <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  {peptide.notes}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
