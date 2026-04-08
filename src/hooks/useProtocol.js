import { useMemo } from 'react';
import { getDay } from 'date-fns';

export function useProtocol(protocol, cycles, date = new Date()) {
  const todaysDoses = useMemo(() => {
    if (!protocol || !protocol.peptides) return [];

    const dayOfWeek = getDay(date);
    const doseList = [];

    protocol.peptides.forEach(peptide => {
      let shouldInclude = false;

      if (peptide.schedule === 'daily') {
        shouldInclude = true;
      } else if (peptide.schedule === 'MWF') {
        shouldInclude = [1, 3, 5].includes(dayOfWeek);
      } else if (peptide.schedule === 'weekdays') {
        shouldInclude = dayOfWeek >= 1 && dayOfWeek <= 5;
      } else if (peptide.schedule === 'workout_days') {
        shouldInclude = [1, 3, 5].includes(dayOfWeek);
      } else if (peptide.schedule === 'daily_during_course') {
        if (cycles) {
          const cycleData = cycles.cycles.find(c => c.peptideId === peptide.id);
          shouldInclude = cycleData && cycleData.status === 'ON';
        }
      }

      if (shouldInclude && peptide.doses) {
        peptide.doses.forEach(dose => {
          doseList.push({
            peptideId: peptide.id,
            peptideName: peptide.name,
            peptideColor: peptide.color,
            shortName: peptide.shortName,
            ...dose,
          });
        });
      }
    });

    return doseList;
  }, [protocol, cycles, date]);

  const isScheduledToday = todaysDoses.length > 0;

  return { todaysDoses, isScheduledToday };
}
