import React from 'react';
import { Link } from 'react-router-dom';
import { Check, Droplets, Sun, Sprout, Layers } from 'lucide-react';
import AppShell from '../components/AppShell';
import { usePlants, useSettings, logCareAction } from '../store';
import { calculateReminders, REMINDER_TYPES } from '../reminders';
import toast from 'react-hot-toast';

export default function Reminders() {
  const [plants] = usePlants();
  const [settings] = useSettings();

  // Calculate and filter reminders based on preferences
  const reminders = calculateReminders(plants).filter(r => {
    if (r.type === 'water' && !settings.notifyWater) return false;
    if (r.type === 'sunlight' && !settings.notifySunlight) return false;
    if (r.type === 'fertilizer' && !settings.notifyFertilizer) return false;
    if (r.type === 'manure' && !settings.notifyManure) return false;
    return true;
  });

  const dueNow = reminders.filter(r => r.dueAt <= Date.now());
  const upcoming = reminders.filter(r => r.dueAt > Date.now());

  const handleMarkDone = (reminder) => {
    const actionMap = {
      water: { key: 'lastWatered', label: 'Watered', emoji: '💧' },
      sunlight: { key: 'lastSunlight', label: 'Sunlight check', emoji: '☀️' },
      fertilizer: { key: 'lastFertilized', label: 'Fertilized', emoji: '🌱' },
      manure: { key: 'lastManure', label: 'Manured', emoji: '♻️' }
    };

    const action = actionMap[reminder.type];
    logCareAction(reminder.plantInstanceId, action.key, action.label, action.emoji);
    toast.success(`Marked ${reminder.type} done for ${reminder.plantName}`);
  };

  const getDueLabel = (dueAt) => {
    const diff = dueAt - Date.now();
    const days = Math.round(diff / (24 * 60 * 60 * 1000));
    
    if (days < 0) {
      const absDays = Math.abs(days);
      return `${absDays}d overdue`;
    }
    if (days === 0) return 'Due today';
    if (days === 1) return 'Due tomorrow';
    return `In ${days} days`;
  };

  const icons = {
    water: Droplets,
    sunlight: Sun,
    fertilizer: Sprout,
    manure: Layers
  };

  const colors = {
    water: 'text-sky-500',
    sunlight: 'text-amber-500',
    fertilizer: 'text-emerald-500',
    manure: 'text-stone-500'
  };

  if (plants.length === 0) {
    return (
      <AppShell title="Reminders">
        <div className="text-center py-12 animate-slide-up bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-200 p-8 my-4">
          <div className="text-5xl mb-3">🔔</div>
          <p className="text-sm font-semibold text-slate-700">Add plants to get care reminders</p>
          <p className="text-xs text-slate-400 mt-1">Once you add a plant, its watering, feeding, and light schedule will show up here.</p>
          <Link to="/search" className="inline-block mt-4">
            <button className="bg-primary text-white font-bold text-sm px-4 py-2 rounded-xl hover:opacity-90 active:scale-95 transition-all shadow-sm cursor-pointer">
              Browse Plants
            </button>
          </Link>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title="Reminders">
      <div className="space-y-6 pb-6">
        
        {/* Due Now Section */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-rose-500 mb-3 flex items-center gap-1.5">
            Due Now ({dueNow.length})
          </h2>
          {dueNow.length === 0 ? (
            <div className="bg-white border border-emerald-100 rounded-2xl p-5 text-center text-xs text-slate-400 font-medium shadow-sm animate-slide-up flex flex-col items-center gap-1.5">
              <div className="size-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 text-base">✨</div>
              All caught up. 🌟 Great job keeping your garden happy!
            </div>
          ) : (
            <div className="space-y-2.5">
              {dueNow.map((reminder) => (
                <ReminderItem
                  key={`${reminder.plantInstanceId}-${reminder.type}`}
                  reminder={reminder}
                  icon={icons[reminder.type]}
                  iconColor={colors[reminder.type]}
                  dueLabel={getDueLabel(reminder.dueAt)}
                  overdue={true}
                  onDone={handleMarkDone}
                />
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Section */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            Upcoming ({upcoming.length})
          </h2>
          {upcoming.length === 0 ? (
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 text-center text-xs text-slate-400 font-medium">
              No upcoming actions.
            </div>
          ) : (
            <div className="space-y-2.5">
              {upcoming.slice(0, 15).map((reminder) => (
                <ReminderItem
                  key={`${reminder.plantInstanceId}-${reminder.type}`}
                  reminder={reminder}
                  icon={icons[reminder.type]}
                  iconColor={colors[reminder.type]}
                  dueLabel={getDueLabel(reminder.dueAt)}
                  onDone={handleMarkDone}
                />
              ))}
            </div>
          )}
        </div>

      </div>
    </AppShell>
  );
}

function ReminderItem({ reminder, icon: Icon, iconColor, dueLabel, overdue, onDone }) {
  return (
    <div className={`bg-white rounded-2xl p-3.5 border flex items-center justify-between gap-3 shadow-sm hover:border-slate-200 transition-all animate-slide-up ${
      overdue ? 'border-rose-100/80 bg-gradient-to-r from-white to-rose-50/10' : 'border-slate-100'
    }`}>
      {/* Icon & plant detail */}
      <div className="flex items-center gap-3.5 min-w-0">
        <div className="size-11 rounded-xl flex items-center justify-center text-2xl shrink-0" style={{ background: 'var(--gradient-leaf)' }}>
          {reminder.emoji}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold text-slate-800 truncate leading-snug">{reminder.plantName}</p>
          <div className="flex items-center gap-1.5 mt-0.5 text-xs text-slate-400 font-medium capitalize">
            <Icon className={`size-3.5 ${iconColor}`} />
            <span>{reminder.type}</span>
            <span>·</span>
            <span className={overdue ? 'text-rose-500 font-bold' : ''}>{dueLabel}</span>
          </div>
        </div>
      </div>

      {/* Done Button */}
      <button
        onClick={() => onDone(reminder)}
        className="size-9 rounded-full bg-primary text-white flex items-center justify-center hover:opacity-90 active:scale-90 transition-all shrink-0 cursor-pointer shadow-sm"
        aria-label="Mark done"
      >
        <Check className="size-4.5 stroke-[2.5]" />
      </button>
    </div>
  );
}
