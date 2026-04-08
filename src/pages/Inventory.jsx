import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import InventoryBar from '../components/InventoryBar';
import { AlertTriangle } from 'lucide-react';

export default function Inventory() {
  const { state } = useApp();
  const [showReorderOnly, setShowReorderOnly] = useState(false);

  const inventory = state.inventory?.inventory || [];

  const filteredInventory = showReorderOnly
    ? inventory.filter((item) => item.estimatedDaysRemaining <= item.reorderThresholdDays)
    : inventory;

  const reorderCount = inventory.filter(
    (item) => item.estimatedDaysRemaining <= item.reorderThresholdDays
  ).length;

  return (
    <div className="max-w-2xl mx-auto p-4 pt-6">
      <h1 className="text-2xl font-bold mb-8">Inventory</h1>

      {reorderCount > 0 && (
        <div
          className="mb-6 p-4 rounded-xl border flex items-start gap-3"
          style={{
            backgroundColor: 'var(--warning)',
            opacity: 0.15,
            borderColor: 'var(--warning)',
          }}
        >
          <AlertTriangle size={18} style={{ color: 'var(--warning)', flexShrink: 0 }} />
          <div className="text-sm">
            <div className="font-semibold" style={{ color: 'var(--warning)' }}>
              {reorderCount} item{reorderCount !== 1 ? 's' : ''} need reorder
            </div>
          </div>
        </div>
      )}

      {/* Toggle */}
      <div className="mb-6 flex gap-2">
        <button
          onClick={() => setShowReorderOnly(false)}
          className="flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all"
          style={{
            backgroundColor: !showReorderOnly ? 'var(--accent)' : 'var(--bg-elevated)',
            color: !showReorderOnly ? '#fff' : 'var(--text-primary)',
            border: `1px solid ${!showReorderOnly ? 'var(--accent)' : 'var(--border)'}`,
          }}
        >
          All
        </button>
        <button
          onClick={() => setShowReorderOnly(true)}
          className="flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all"
          style={{
            backgroundColor: showReorderOnly ? 'var(--warning)' : 'var(--bg-elevated)',
            color: showReorderOnly ? '#fff' : 'var(--text-primary)',
            border: `1px solid ${showReorderOnly ? 'var(--warning)' : 'var(--border)'}`,
          }}
        >
          Reorder
        </button>
      </div>

      {/* Inventory List */}
      <div className="space-y-4">
        {filteredInventory.map((item) => {
          const peptide = state.protocol?.peptides?.find((p) => p.id === item.peptideId);
          if (!peptide) return null;

          return (
            <InventoryBar
              key={item.peptideId}
              item={item}
              peptide={peptide}
            />
          );
        })}
      </div>

      {filteredInventory.length === 0 && (
        <div
          className="p-6 rounded-xl text-center"
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border)',
          }}
        >
          <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            {showReorderOnly ? 'No items need reorder' : 'No inventory data'}
          </div>
        </div>
      )}
    </div>
  );
}
