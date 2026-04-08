import { useCallback } from 'react';

export function useNotifications() {
  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) return false;
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }, []);

  const scheduleNotification = useCallback((title, body, scheduledTime) => {
    const [hours, minutes] = scheduledTime.split(':').map(Number);
    const now = new Date();
    const target = new Date(now);
    target.setHours(hours, minutes, 0, 0);
    if (target <= now) target.setDate(target.getDate() + 1);
    const delay = target - now;

    setTimeout(() => {
      if (Notification.permission === 'granted') {
        new Notification(title, { body, icon: '/peptide-tracker-app/icons/icon-192.png' });
      }
    }, delay);
  }, []);

  const scheduleAllReminders = useCallback((protocol) => {
    if (!protocol?.peptides) return;
    protocol.peptides.forEach(peptide => {
      peptide.doses.forEach(dose => {
        if (dose.reminderTime) {
          scheduleNotification(
            `Time for ${peptide.name}`,
            `${dose.label} — ${dose.amount} ${dose.unit} ${dose.route}`,
            dose.reminderTime
          );
        }
      });
    });
  }, [scheduleNotification]);

  return { requestPermission, scheduleNotification, scheduleAllReminders };
}
