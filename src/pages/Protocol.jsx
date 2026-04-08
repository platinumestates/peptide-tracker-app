import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import PeptideCard from '../components/PeptideCard';
import { AlertTriangle, Search } from 'lucide-react';

const categories = [
  'All',
  'GH_stimulation',
  'anabolic',
  'nootropic',
  'hormonal',
  'longevity',
  'regenerative',
  'mitochondrial',
];

export default function Protocol() {
  const { state } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedPeptides, setExpandedPeptides] = useState(new Set());

  const filteredPeptides = useMemo(() => {
    if (!state.protocol?.peptides) return [];

    return state.protocol.peptides.filter((peptide) => {
      const matchesCategory = selectedCategory === 'All' || peptide.category === selectedCategory;
      const matchesSearch =
        searchTerm === '' ||
        peptide.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        peptide.shortName.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [state.protocol, selectedCategory, searchTerm]);

  const toggleExpanded = (id) => {
    const newExpanded = new Set(expandedPeptides);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedPeptides(newExpanded);
  };

  if (!state.protocol) {
    return (
      <div className="max-w-2xl mx-auto p-4 pt-6">
        <h1 className="text-2xl font-bold mb-8">Protocol</h1>
        <div
          className="p-6 rounded-xl text-center"
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border)',
          }}
        >
          <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Connect GitHub in Settings to load protocol
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 pt-6">
      <h1 className="text-2xl font-bold mb-8">Protocol v{state.protocol.version}</h1>

      {/* Search */}
      <div className="mb-6 relative">
        <Search size={18} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--text-secondary)' }} />
        <input
          type="text"
          placeholder="Search peptides..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-lg text-sm"
          style={{
            backgroundColor: 'var(--bg-elevated)',
            border: '1px solid var(--border)',
            color: 'var(--text-primary)',
          }}
        />
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className="px-3 py-1 rounded-full text-xs font-medium transition-all whitespace-nowrap"
            style={{
              backgroundColor: selectedCategory === cat ? 'var(--accent)' : 'var(--bg-elevated)',
              color: selectedCategory === cat ? '#fff' : 'var(--text-secondary)',
              border: `1px solid ${selectedCategory === cat ? 'var(--accent)' : 'var(--border)'}`,
            }}
          >
            {cat === 'GH_stimulation' ? 'GH' : cat}
          </button>
        ))}
      </div>

      {/* Peptide List */}
      <div className="space-y-3 mb-8">
        {filteredPeptides.map((peptide) => (
          <PeptideCard
            key={peptide.id}
            peptide={peptide}
            cycleStatus={null}
            expanded={expandedPeptides.has(peptide.id)}
            onToggle={() => toggleExpanded(peptide.id)}
          />
        ))}
      </div>

      {filteredPeptides.length === 0 && (
        <div
          className="p-6 rounded-xl text-center"
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border)',
          }}
        >
          <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            No peptides found
          </div>
        </div>
      )}

      {/* Allergy & Avoid List */}
      <div
        className="p-6 rounded-xl border"
        style={{
          backgroundColor: 'transparent',
          borderColor: 'var(--danger)',
          borderWidth: '2px',
        }}
      >
        <div className="flex gap-3 mb-4">
          <AlertTriangle size={20} style={{ color: 'var(--danger)', flexShrink: 0 }} />
          <h3 className="font-semibold">Allergens & Avoid</h3>
        </div>

        <div className="space-y-3">
          {state.protocol.allergyFlags && state.protocol.allergyFlags.length > 0 && (
            <div>
              <div className="text-xs font-medium mb-2" style={{ color: 'var(--danger)' }}>
                ALLERGIC TO:
              </div>
              <div className="flex flex-wrap gap-2">
                {state.protocol.allergyFlags.map((allergen, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 text-xs rounded-full"
                    style={{ backgroundColor: 'var(--danger)', opacity: 0.2, color: 'var(--danger)' }}
                  >
                    {allergen}
                  </span>
                ))}
              </div>
            </div>
          )}

          {state.protocol.avoidList && state.protocol.avoidList.length > 0 && (
            <div>
              <div className="text-xs font-medium mb-2" style={{ color: 'var(--warning)' }}>
                AVOID:
              </div>
              <div className="flex flex-wrap gap-2">
                {state.protocol.avoidList.map((avoid, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 text-xs rounded-full"
                    style={{ backgroundColor: 'var(--warning)', opacity: 0.2, color: 'var(--warning)' }}
                  >
                    {avoid}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
