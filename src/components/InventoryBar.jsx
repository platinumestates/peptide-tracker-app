import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default function InventoryBar({ item, peptide }) {
  const percentUsed = item.vialsPerBox > 0 ? ((item.vialsPerBox - item.vialsRemaining) / item.vialsPerBox) * 100 : 0;
  const needsReorder = item.estimatedDaysRemaining <= item.reorderThresholdDays;

  return (
    <div
      className="p-4 rounded-xl border"
      style={{
        backgroundColor: 'var(--bg-card)',
        borderColor: needsReorder ? 'var(--danger)' : 'var(--border)',
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-sm">{peptide.name}</h3>
          <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            {item.supplier} • {item.productCode}
          </div>
        </div>
        {needsReorder && <AlertTriangle size={16} style={{ color: 'var(--danger)' }} />}
      </div>

      <div className="flex items-end gap-3 mb-3">
        <div className="font-mono text-2xl font-bold">{item.vialsRemaining}</div>
        <div className="text-xs mb-0.5" style={{ color: 'var(--text-secondary)' }}>
          of {item.vialsPerBox} vials
        </div>
      </div>

      <div className="w-full h-2 rounded-full" style={{ backgroundColor: 'var(--border)' }}>
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${percentUsed}%`, backgroundColor: peptide.color }}
        />
      </div>

      <div className="mt-2 flex justify-between items-center text-xs" style={{ color: 'var(--text-secondary)' }}>
        <span>{item.estimatedDaysRemaining} days remaining</span>
        <span className="text-xs" style={{ color: 'var(--accent)' }}>
          {item.storageTemp}
        </span>
      </div>

      {item.reconstituted && (
        <div className="mt-2 text-xs" style={{ color: 'var(--warning)' }}>
          Reconstituted {item.reconstitutedDate} (30-day shelf life)
        </div>
      )}
    </div>
  );
}
