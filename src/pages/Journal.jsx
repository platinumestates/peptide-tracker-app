import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import LogEntry from '../components/LogEntry';
import { format, eachDayOfInterval, startOfMonth, endOfMonth } from 'date-fns';
import { Plus } from 'lucide-react';

export default function Journal() {
  const { state } = useApp();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showNewEntry, setShowNewEntry] = useState(false);
  const [newNote, setNewNote] = useState('');

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const handleAddEntry = () => {
    if (newNote.trim()) {
      // In a real app, this would save to GitHub
      setNewNote('');
      setShowNewEntry(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 pt-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Journal</h1>
        <button
          onClick={() => setShowNewEntry(!showNewEntry)}
          className="p-2 rounded-lg transition-all"
          style={{
            backgroundColor: 'var(--accent)',
            color: '#fff',
          }}
        >
          <Plus size={20} />
        </button>
      </div>

      {/* New Entry Form */}
      {showNewEntry && (
        <div
          className="p-4 rounded-xl mb-6"
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border)',
          }}
        >
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            maxLength="500"
            className="w-full px-3 py-2 rounded-lg text-sm mb-2"
            style={{
              backgroundColor: 'var(--bg-elevated)',
              border: '1px solid var(--border)',
              color: 'var(--text-primary)',
              resize: 'vertical',
              minHeight: '100px',
            }}
            placeholder="Write a note..."
          />
          <div className="flex gap-2">
            <button
              onClick={handleAddEntry}
              className="flex-1 py-2 rounded-lg text-sm font-medium text-white"
              style={{ backgroundColor: 'var(--accent)' }}
            >
              Add
            </button>
            <button
              onClick={() => setShowNewEntry(false)}
              className="flex-1 py-2 rounded-lg text-sm font-medium"
              style={{
                backgroundColor: 'var(--bg-elevated)',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)',
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Calendar Heatmap */}
      <div
        className="p-4 rounded-xl mb-6"
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border)',
        }}
      >
        <h2 className="text-sm font-semibold mb-4">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <div className="grid grid-cols-7 gap-1">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-xs text-center font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
              {day}
            </div>
          ))}
          {daysInMonth.map((day) => (
            <div
              key={day.toISOString()}
              className="aspect-square rounded-lg flex items-center justify-center text-xs"
              style={{
                backgroundColor: 'var(--bg-elevated)',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)',
              }}
            >
              {format(day, 'd')}
            </div>
          ))}
        </div>
      </div>

      {/* Recent Entries */}
      <h2 className="text-lg font-semibold mb-4">Recent Entries</h2>
      <div className="space-y-3">
        {state.protocol?.peptides?.slice(0, 3).map((peptide) => (
          <LogEntry
            key={peptide.id}
            entry={{
              date: format(new Date(), 'yyyy-MM-dd'),
              doses: [],
              note: `Sample entry for ${peptide.name}`,
            }}
          />
        ))}
      </div>

      {state.protocol?.peptides?.length === 0 && (
        <div
          className="p-6 rounded-xl text-center"
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border)',
          }}
        >
          <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            No journal entries yet
          </div>
        </div>
      )}
    </div>
  );
}
