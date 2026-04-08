import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { format, addDays, subDays } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function DailyLog() {
  const { state, writeTodayLog } = useApp();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [entry, setEntry] = useState({
    date: format(selectedDate, 'yyyy-MM-dd'),
    doses: [],
    hrv: '',
    mood: 3,
    energy: 3,
    focus: 3,
    note: '',
  });

  const isToday = format(selectedDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
  const isOldEntry = (new Date() - selectedDate) / (1000 * 60 * 60 * 24) > 7;

  const handlePrevDay = () => {
    const newDate = subDays(selectedDate, 1);
    setSelectedDate(newDate);
    setEntry({ ...entry, date: format(newDate, 'yyyy-MM-dd') });
  };

  const handleNextDay = () => {
    const newDate = addDays(selectedDate, 1);
    setSelectedDate(newDate);
    setEntry({ ...entry, date: format(newDate, 'yyyy-MM-dd') });
  };

  const handleSave = () => {
    const logData = {
      month: format(selectedDate, 'yyyy-MM'),
      entries: [entry],
    };
    writeTodayLog(logData);
  };

  return (
    <div className="max-w-2xl mx-auto p-4 pt-6">
      {/* Date Picker */}
      <div className="flex items-center justify-between mb-8">
        <button onClick={handlePrevDay} className="p-2">
          <ChevronLeft size={20} />
        </button>
        <div className="text-center">
          <h1 className="text-xl font-bold">
            {format(selectedDate, 'EEEE, MMM d')}
          </h1>
          <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            {isToday ? 'Today' : isOldEntry ? 'Read-only (7+ days old)' : ''}
          </div>
        </div>
        <button onClick={handleNextDay} className="p-2">
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Dose Checklist */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Doses Logged</h2>
        <div className="space-y-2">
          {state.protocol?.peptides?.map((peptide) => (
            <label
              key={peptide.id}
              className="flex items-center p-3 rounded-lg cursor-pointer"
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border)',
              }}
            >
              <input
                type="checkbox"
                defaultChecked={false}
                disabled={isOldEntry}
                className="mr-3"
                onChange={(e) => {
                  const doses = e.target.checked
                    ? [...entry.doses, peptide.id]
                    : entry.doses.filter(d => d !== peptide.id);
                  setEntry({ ...entry, doses });
                }}
              />
              <span className="text-sm" style={{ opacity: isOldEntry ? 0.5 : 1 }}>
                {peptide.name}
              </span>
            </label>
          ))}
        </div>
      </section>

      {/* Metrics */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Metrics</h2>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
              HRV
            </label>
            <input
              type="number"
              disabled={isOldEntry}
              value={entry.hrv}
              onChange={(e) => setEntry({ ...entry, hrv: e.target.value })}
              className="w-full mt-2 px-3 py-2 rounded-lg text-sm"
              style={{
                backgroundColor: 'var(--bg-elevated)',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)',
                opacity: isOldEntry ? 0.5 : 1,
              }}
              placeholder="Heart rate variability"
            />
          </div>

          <div>
            <label className="text-xs font-medium mb-2 block" style={{ color: 'var(--text-secondary)' }}>
              Mood: {['😞', '😕', '😐', '😊', '😄'][entry.mood - 1]}
            </label>
            <input
              type="range"
              min="1"
              max="5"
              value={entry.mood}
              disabled={isOldEntry}
              onChange={(e) => setEntry({ ...entry, mood: parseInt(e.target.value) })}
              className="w-full"
              style={{ opacity: isOldEntry ? 0.5 : 1 }}
            />
          </div>

          <div>
            <label className="text-xs font-medium mb-2 block" style={{ color: 'var(--text-secondary)' }}>
              Energy: {entry.energy}/5
            </label>
            <input
              type="range"
              min="1"
              max="5"
              value={entry.energy}
              disabled={isOldEntry}
              onChange={(e) => setEntry({ ...entry, energy: parseInt(e.target.value) })}
              className="w-full"
              style={{ opacity: isOldEntry ? 0.5 : 1 }}
            />
          </div>

          <div>
            <label className="text-xs font-medium mb-2 block" style={{ color: 'var(--text-secondary)' }}>
              Focus: {entry.focus}/5
            </label>
            <input
              type="range"
              min="1"
              max="5"
              value={entry.focus}
              disabled={isOldEntry}
              onChange={(e) => setEntry({ ...entry, focus: parseInt(e.target.value) })}
              className="w-full"
              style={{ opacity: isOldEntry ? 0.5 : 1 }}
            />
          </div>
        </div>
      </section>

      {/* Quick Note */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Note</h2>
        <div>
          <textarea
            disabled={isOldEntry}
            value={entry.note}
            onChange={(e) => setEntry({ ...entry, note: e.target.value.slice(0, 500) })}
            maxLength="500"
            className="w-full px-3 py-2 rounded-lg text-sm"
            style={{
              backgroundColor: 'var(--bg-elevated)',
              border: '1px solid var(--border)',
              color: 'var(--text-primary)',
              resize: 'vertical',
              minHeight: '100px',
              opacity: isOldEntry ? 0.5 : 1,
            }}
            placeholder="How are you feeling? Any side effects?"
          />
          <div className="text-xs mt-2" style={{ color: 'var(--text-secondary)' }}>
            {entry.note.length}/500 characters
          </div>
        </div>
      </section>

      {!isOldEntry && (
        <button
          onClick={handleSave}
          className="w-full py-3 rounded-lg font-semibold text-white transition-all"
          style={{ backgroundColor: 'var(--accent)' }}
        >
          Save Entry
        </button>
      )}
    </div>
  );
}
