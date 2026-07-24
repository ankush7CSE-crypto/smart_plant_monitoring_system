import { getPlantSpecies } from './plants';

export const REMINDER_TYPES = {
  water: { lastKey: 'lastWatered', label: 'Watering', emoji: '💧' },
  sunlight: { lastKey: 'lastSunlight', label: 'Sunlight check', emoji: '☀️' },
  fertilizer: { lastKey: 'lastFertilized', label: 'Fertilizer', emoji: '🌱' },
  manure: { lastKey: 'lastManure', label: 'Manure', emoji: '♻️' }
};

export function calculateReminders(plantsList) {
  const now = Date.now();
  const reminders = [];

  for (const instance of plantsList) {
    const species = getPlantSpecies(instance.plantId);
    if (!species) continue;

    const intervals = {
      water: species.waterEveryDays,
      fertilizer: species.fertilizerEveryDays,
      manure: species.manureEveryDays,
      sunlight: 1 // Sunlight check is due every 1 day
    };

    Object.keys(intervals).forEach(type => {
      const lastKey = REMINDER_TYPES[type].lastKey;
      const intervalDays = intervals[type];
      
      // Calculate due time
      const lastActionTime = instance[lastKey] ?? instance.addedAt;
      const dueAt = lastActionTime + intervalDays * 24 * 60 * 60 * 1000;
      
      // Calculate overdue days
      const overdueDays = Math.max(0, Math.floor((now - dueAt) / (24 * 60 * 60 * 1000)));

      reminders.push({
        plantInstanceId: instance.id,
        plantName: instance.nickname,
        emoji: instance.emoji || species.emoji,
        type,
        dueAt,
        overdueDays
      });
    });
  }

  // Sort reminders: soonest/most overdue first
  return reminders.sort((a, b) => a.dueAt - b.dueAt);
}

// Local cache for notifications already sent in the current session
const sentNotifications = new Set();

export function checkAndTriggerNotifications(plantsList, settings) {
  if (typeof window === 'undefined' || !('Notification' in window)) return;
  if (Notification.permission !== 'granted') return;

  // Check Quiet Hours (10 PM to 7 AM)
  if (settings.quietHours) {
    const currentHour = new Date().getHours();
    if (currentHour >= 22 || currentHour < 7) {
      console.log('Suppressing notifications due to Quiet Hours (10 PM - 7 AM)');
      return;
    }
  }

  const now = Date.now();
  const reminders = calculateReminders(plantsList);
  const dueReminders = reminders.filter(r => r.dueAt <= now);

  dueReminders.forEach(reminder => {
    // Check if notification is enabled for this type
    const isEnabled = 
      (reminder.type === 'water' && settings.notifyWater) ||
      (reminder.type === 'sunlight' && settings.notifySunlight) ||
      (reminder.type === 'fertilizer' && settings.notifyFertilizer) ||
      (reminder.type === 'manure' && settings.notifyManure);

    if (!isEnabled) return;

    // Create unique cache key
    const dateStr = new Date().toISOString().slice(0, 13); // yyyy-mm-ddThh
    const cacheKey = `${reminder.plantInstanceId}-${reminder.type}-${dateStr}`;

    if (sentNotifications.has(cacheKey)) return;

    // Trigger Notification
    const actionLabel = REMINDER_TYPES[reminder.type].label;
    const title = `${reminder.emoji} Care Due: ${reminder.plantName}`;
    const options = {
      body: `Your ${reminder.plantName} needs its scheduled ${actionLabel.toLowerCase()}!`,
      icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🌱</text></svg>',
      tag: reminder.plantInstanceId + '-' + reminder.type,
      requireInteraction: false
    };

    if (navigator.serviceWorker && navigator.serviceWorker.controller) {
      navigator.serviceWorker.ready.then(registration => {
        registration.showNotification(title, options);
      });
    } else {
      new Notification(title, options);
    }

    sentNotifications.add(cacheKey);
  });
}
