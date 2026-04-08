import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { format } from 'date-fns';

export default function DoseButton({ dose, peptide, taken, timestamp, onTake, disabled, isMissed }) {
  const [animating, setAnimating] = useState(false);

  const handleClick = () => {
    if (taken || disabled) return;
    setAnimating(true);
    setTimeout(() => setAnimating(false), 300);
    onTake();
  };

  return (
    <button
      onClick={handleClick}
      disabled={taken || disabled}
      className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${
        taken ? 'border-green-600 bg-green-500/10'
        : isMissed ? 'border-red-600 bg-red-500/10'
        : 'border-[var(--border)] bg-[var(--bg-elevated)] hover:border-accent'
      } ${animating ? 'dose-check-anim' : ''}`}
    >
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
        taken ? 'bg-green-600' : isMissed ? 'bg-red-600/20' : ''
      }`}
        style={!taken && !isMissed ? { border: `2px solid ${peptide.color}` } : {}}>
        {taken && <Check size={16} color="white" />}
      </div>
      <div className="flex-1 text-left">
        <div className="text-sm font-medium" style={{ color: taken ? 'var(--success)' : isMissed ? 'var(--danger)' : 'var(--text-primary)' }}>
          {dose.label}
        </div>
        <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
          {dose.amount} {dose.unit} · {dose.route}
          {taken && timestamp && ` · ${format(new Date(timestamp), 'h:mm a')}`}
          {isMissed && !taken && ' · MISSED'}
        </div>
      </div>
    </button>
  );
}
