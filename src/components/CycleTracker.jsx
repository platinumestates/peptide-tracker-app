import React, { useMemo } from 'react';

export default function CycleTracker({ cycleData, peptide }) {
  const status = useMemo(() => {
    if (!cycleData) return null;

    const elapsed = cycleData.daysElapsed || 0;
    const total = cycleData.currentPhaseDays || 0;
    const percent = total > 0 ? (elapsed / total) * 100 : 0;

    let color = 'var(--danger)';
    if (cycleData.daysRemaining > 7) {
      color = 'var(--success)';
    } else if (cycleData.daysRemaining > 0) {
      color = 'var(--warning)';
    }

    return {
      percent: Math.min(100, percent),
      color,
      daysRemaining: cycleData.daysRemaining,
      nextPhase: cycleData.nextPhaseType,
    };
  }, [cycleData]);

  if (!status) return null;

  return (
    <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-elevated)' }}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-medium">{peptide.shortName}</span>
        <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
          {status.daysRemaining} days
        </span>
      </div>
      <div className="w-full h-2 rounded-full" style={{ backgroundColor: 'var(--border)' }}>
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${status.percent}%`, backgroundColor: status.color }}
        />
      </div>
      <div className="text-xs mt-2" style={{ color: 'var(--text-secondary)' }}>
        {status.nextPhase && `→ ${status.nextPhase}`}
      </div>
    </div>
  );
}
