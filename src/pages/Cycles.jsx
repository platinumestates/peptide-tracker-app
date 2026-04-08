import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import CycleTracker from '../components/CycleTracker';
import { format, addDays } from 'date-fns';

export default function Cycles() {
  const { state } = useApp();
  const [editingCycle, setEditingCycle] = useState(null);
  const [newStartDate, setNewStartDate] = useState('');

  const cyclingPeptides = state.cycles?.cycles?.filter(
    (c) => c.currentPhaseDays && (c.currentPhaseDays.on || c.currentPhaseDays.bridge)
  ) || [];

  const hcgKissData = state.cycles?.cycles?.find((c) => c.peptideId === 'hcg');
  const kisspeptinData = state.cycles?.cycles?.find((c) => c.peptideId === 'kisspeptin');

  const handleEditCycle = (cycleId) => {
    const cycle = state.cycles.cycles.find((c) => c.peptideId === cycleId);
    if (cycle) {
      setEditingCycle(cycleId);
      setNewStartDate(cycle.currentPhaseStartDate || '');
    }
  };

  const handleSaveStartDate = async () => {
    // In a real app, this would save to GitHub
    setEditingCycle(null);
  };

  return (
    <div className="max-w-2xl mx-auto p-4 pt-6">
      <h1 className="text-2xl font-bold mb-8">Cycle Management</h1>

      {/* Active Cycles */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Active Cycles</h2>
        <div className="space-y-3">
          {cyclingPeptides.map((cycleData) => {
            const peptide = state.protocol?.peptides?.find((p) => p.id === cycleData.peptideId);
            if (!peptide) return null;

            return (
              <div
                key={cycleData.peptideId}
                className="p-4 rounded-xl"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">{peptide.name}</h3>
                  <span
                    className="text-xs px-2 py-1 rounded-full"
                    style={{
                      backgroundColor: cycleData.status === 'ON' ? 'var(--success)' : 'var(--warning)',
                      opacity: 0.2,
                      color: cycleData.status === 'ON' ? 'var(--success)' : 'var(--warning)',
                    }}
                  >
                    {cycleData.status}
                  </span>
                </div>

                <CycleTracker cycleData={cycleData} peptide={peptide} />

                <button
                  onClick={() => handleEditCycle(cycleData.peptideId)}
                  className="mt-3 text-xs px-3 py-1.5 rounded-lg w-full transition-all"
                  style={{
                    backgroundColor: 'var(--bg-elevated)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-primary)',
                  }}
                >
                  Edit Start Date
                </button>

                {editingCycle === cycleData.peptideId && (
                  <div className="mt-3 flex gap-2">
                    <input
                      type="date"
                      value={newStartDate}
                      onChange={(e) => setNewStartDate(e.target.value)}
                      className="flex-1 px-2 py-1 text-sm rounded-lg"
                      style={{
                        backgroundColor: 'var(--bg-elevated)',
                        border: '1px solid var(--border)',
                        color: 'var(--text-primary)',
                      }}
                    />
                    <button
                      onClick={handleSaveStartDate}
                      className="px-3 py-1 rounded-lg text-xs font-medium text-white"
                      style={{ backgroundColor: 'var(--accent)' }}
                    >
                      Save
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* HCG / Kisspeptin Rotation */}
      {hcgKissData && kisspeptinData && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-4">HCG ↔ Kisspeptin Bridge</h2>
          <div
            className="p-6 rounded-xl"
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border)',
            }}
          >
            <div className="text-sm space-y-4">
              <div>
                <div className="font-semibold mb-2">Current Phase:</div>
                <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {hcgKissData.status === 'ON'
                    ? `HCG: ${hcgKissData.daysRemaining} days remaining`
                    : `Kisspeptin Bridge: Starting soon`}
                </div>
              </div>

              <div>
                <div className="font-semibold mb-2">Rotation Pattern:</div>
                <div className="space-y-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                  <div>→ 8 weeks HCG (M/W/F injections)</div>
                  <div>→ 4 weeks Kisspeptin Bridge (M/W/F)</div>
                  <div>→ Repeat</div>
                </div>
              </div>

              <div>
                <div className="font-semibold mb-2">Next Transition:</div>
                <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {hcgKissData.daysRemaining} days
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Upcoming Transitions */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Upcoming (30 days)</h2>
        <div className="space-y-2">
          {state.cycles?.cycles
            ?.filter((c) => c.daysRemaining && c.daysRemaining > 0 && c.daysRemaining <= 30)
            ?.sort((a, b) => (a.daysRemaining || 0) - (b.daysRemaining || 0))
            ?.map((cycleData) => {
              const peptide = state.protocol?.peptides?.find((p) => p.id === cycleData.peptideId);
              if (!peptide) return null;

              return (
                <div
                  key={cycleData.peptideId}
                  className="p-3 rounded-lg flex items-center justify-between"
                  style={{
                    backgroundColor: 'var(--bg-elevated)',
                    border: '1px solid var(--border)',
                  }}
                >
                  <div>
                    <div className="text-sm font-medium">{peptide.name}</div>
                    <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                      {cycleData.currentPhaseType} → {cycleData.nextPhaseType}
                    </div>
                  </div>
                  <div className="font-mono font-bold" style={{ color: 'var(--accent)' }}>
                    {cycleData.daysRemaining}d
                  </div>
                </div>
              );
            })}
        </div>
      </section>
    </div>
  );
}
