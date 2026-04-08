import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useProtocol } from '../hooks/useProtocol';
import DoseButton from '../components/DoseButton';
import { format } from 'date-fns';
import { AlertTriangle } from 'lucide-react';

export default function Dashboard() {
  const { state, dispatch, writeTodayLog } = useApp();
  const { todaysDoses } = useProtocol(state.protocol, state.cycles);
  const [streak, setStreak] = useState(0);

  const now = new Date();
  const greeting = now.getHours() < 12 ? 'Morning' : now.getHours() < 18 ? 'Afternoon' : 'Evening';
  const emoji = now.getHours() < 12 ? '☀️' : now.getHours() < 18 ? '🌤' : '🌙';

  useEffect(() => {
    // Calculate streak (mock - would come from log history)
    setStreak(Math.floor(Math.random() * 20) + 1);
  }, []);

  const handleDoseTaken = (doseId) => {
    dispatch({ type: 'MARK_DOSE_TAKEN', payload: { doseId } });

    if (state.todayLog?.entries?.[0]) {
      const entry = state.todayLog.entries[0];
      const dose = entry.doses?.find(d => d.id === doseId);
      if (dose) {
        dose.taken = true;
        dose.timestamp = new Date().toISOString();
        const logData = {
          month: format(now, 'yyyy-MM'),
          entries: [entry],
        };
        writeTodayLog(logData);
      }
    }
  };

  const nextCycleEvent = state.cycles?.cycles?.find(c => c.daysRemaining > 0 && c.daysRemaining <= 7);

  const groupedDoses = todaysDoses.reduce((acc, dose) => {
    const peptideId = dose.peptideId;
    if (!acc[peptideId]) {
      acc[peptideId] = { peptide: state.protocol?.peptides.find(p => p.id === peptideId), doses: [] };
    }
    acc[peptideId].doses.push(dose);
    return acc;
  }, {});

  if (!state.token || !state.repo) {
    return (
      <div className="max-w-2xl mx-auto p-4 pt-6">
        <h1 className="text-2xl font-bold mb-8">Get Started</h1>
        <div
          className="p-6 rounded-xl text-center"
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border)',
          }}
        >
          <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>
            To start tracking your peptide protocol, connect GitHub.
          </p>
          <Link
            to="/settings"
            className="inline-block px-6 py-2 rounded-lg font-semibold text-white transition-all"
            style={{ backgroundColor: 'var(--accent)' }}
          >
            Go to Settings
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 pt-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Good {greeting}, Justin {emoji}
        </h1>
        <div className="font-mono text-sm" style={{ color: 'var(--text-secondary)' }}>
          {format(now, 'EEEE, MMM d, yyyy')}
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        <div
          className="p-4 rounded-xl text-center"
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border)',
          }}
        >
          <div className="text-2xl font-bold" style={{ color: 'var(--accent)' }}>
            {streak}
          </div>
          <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
            Day Streak
          </div>
        </div>
        <div
          className="p-4 rounded-xl text-center"
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border)',
          }}
        >
          <div className="text-lg font-bold mb-1">
            {nextCycleEvent ? `${nextCycleEvent.daysRemaining}d` : '—'}
          </div>
          <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            Next Cycle
          </div>
        </div>
        <div
          className="p-4 rounded-xl text-center"
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border)',
          }}
        >
          <div className="text-xl font-bold mb-1">
            {state.token ? '✅' : '❌'}
          </div>
          <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            Connected
          </div>
        </div>
      </div>

      {/* Allergy Warning */}
      <div
        className="mb-8 p-4 rounded-xl border"
        style={{
          backgroundColor: '#ef4444',
          opacity: 0.15,
          borderColor: 'var(--danger)',
        }}
      >
        <div className="flex gap-3">
          <AlertTriangle size={18} style={{ color: 'var(--danger)', flexShrink: 0 }} />
          <div className="text-xs">
            <div className="font-semibold mb-1" style={{ color: 'var(--danger)' }}>
              AVOID:
            </div>
            <div style={{ color: 'var(--danger)' }}>
              CJC-1295 · Sermorelin · Tesamorelin · Any GHRH analog
            </div>
          </div>
        </div>
      </div>

      {/* Today's Doses */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Today's Doses</h2>
        {todaysDoses.length > 0 ? (
          <div className="space-y-4">
            {Object.entries(groupedDoses).map(([peptideId, { peptide, doses }]) => (
              <div key={peptideId}>
                <div className="text-xs font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                  {peptide?.name}
                </div>
                <div className="space-y-2">
                  {doses.map((dose) => (
                    <DoseButton
                      key={dose.id}
                      dose={dose}
                      peptide={peptide}
                      taken={false}
                      timestamp={null}
                      onTake={() => handleDoseTaken(dose.id)}
                      disabled={false}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            className="p-6 rounded-xl text-center"
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border)',
            }}
          >
            <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              No scheduled doses for today
            </div>
          </div>
        )}
      </div>

      {/* Upcoming */}
      {nextCycleEvent && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Upcoming</h2>
          <div
            className="p-4 rounded-xl"
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border)',
            }}
          >
            <div className="text-sm">
              <div className="font-medium mb-1">
                {nextCycleEvent.peptideId} cycle transition in {nextCycleEvent.daysRemaining} days
              </div>
              <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                {nextCycleEvent.currentPhaseType} → {nextCycleEvent.nextPhaseType}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
