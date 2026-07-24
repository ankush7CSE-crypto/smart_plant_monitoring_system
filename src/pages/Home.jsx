import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, Plus, Droplets, Sun, Sprout, Calendar, Clock, ArrowRight, Info, ChevronDown, ChevronUp, BookOpen, Layers } from 'lucide-react';
import AppShell from '../components/AppShell';
import { useSession, usePlants, useCareHistory, logCareAction } from '../store';
import { calculateReminders } from '../reminders';
import toast from 'react-hot-toast';

export default function Home() {
  const [session] = useSession();
  const [plants] = usePlants();
  const [careHistory] = useCareHistory();
  const [showGuide, setShowGuide] = useState(true);

  // Find due tasks
  const reminders = calculateReminders(plants);
  const dueTasks = reminders.filter(r => r.dueAt <= Date.now());

  const handleQuickCare = (e, instanceId, plantName, actionType, label, emoji) => {
    e.preventDefault();
    e.stopPropagation();
    logCareAction(instanceId, actionType, label, emoji);
    toast.success(`${label} logged for ${plantName} ${emoji}`);
  };

  // Convert timestamp to human-friendly time
  const formatTime = (ts) => {
    const diff = Date.now() - ts;
    if (diff < 60000) return 'Just now';
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return new Date(ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  return (
    <AppShell title={`Hi, ${session?.name || 'Gardener'} 🌿`}>
      
      {/* Dynamic onboarding Instructions / Guided Tour Card */}
      <div className="mb-5 bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
        <button 
          onClick={() => setShowGuide(!showGuide)}
          className="w-full px-4 py-3 flex items-center justify-between bg-slate-50/60 hover:bg-slate-50 transition-colors font-bold text-xs text-slate-700 uppercase tracking-wider cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <BookOpen className="size-4 text-primary" /> 
            Gardening Guide & Instructions
          </span>
          {showGuide ? <ChevronUp className="size-4 text-slate-400" /> : <ChevronDown className="size-4 text-slate-400" />}
        </button>

        {showGuide && (
          <div className="p-4 text-xs text-slate-500 space-y-3 leading-relaxed border-t border-slate-50">
            <div>
              <p className="font-bold text-slate-700 flex items-center gap-1">🌱 1. Add Plants</p>
              <p className="pl-5 mt-0.5">Click the <strong className="text-primary">+ Add Plant</strong> button to browse and search the plant database (Ragi, Tomatoes, Basil, etc.) to start tracking them.</p>
            </div>
            <div>
              <p className="font-bold text-slate-700 flex items-center gap-1">⏰ 2. Check Reminders</p>
              <p className="pl-5 mt-0.5">The app calculates when tasks are due based on intervals. When a task is due, it displays in <strong className="text-rose-500">Due Now</strong>. You will receive native system notifications on your desktop or phone even when the website is in the background.</p>
            </div>
            <div>
              <p className="font-bold text-slate-700 flex items-center gap-1">💧 3. Log Actions to Reset Timers</p>
              <p className="pl-5 mt-0.5">Use the quick actions (<strong className="text-slate-700">Water, Sun, Feed, Compost</strong>) on plant cards below to log care events. This resets the timer and registers an entry in your care activity logs.</p>
            </div>
            <div>
              <p className="font-bold text-slate-700 flex items-center gap-1">⚙️ 4. Turn On System Alerts</p>
              <p className="pl-5 mt-0.5">Navigate to <strong className="text-slate-700">Settings</strong> to grant browser notification permissions and choose which reminders you want to receive.</p>
            </div>
          </div>
        )}
      </div>

      {/* Due Tasks Alert Banner */}
      {dueTasks.length > 0 && (
        <div className="mb-6 rounded-2xl border border-rose-100 bg-rose-50/70 p-4 flex gap-3 items-start animate-pulse-ring">
          <AlertCircle className="size-5 text-rose-500 shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold text-rose-800">
              {dueTasks.length} care task{dueTasks.length > 1 ? 's' : ''} overdue!
            </p>
            <p className="text-rose-600 text-xs mt-0.5">Your green buddies are waiting for attention.</p>
            <Link to="/reminders" className="text-primary font-bold text-xs underline mt-2 inline-flex items-center gap-1 hover:text-primary-glow">
              View due reminders <ArrowRight className="size-3" />
            </Link>
          </div>
        </div>
      )}

      {/* Header section with Plants List */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-slate-800">My Garden</h2>
        <Link to="/search">
          <button className="flex items-center gap-1 bg-primary text-white font-semibold text-xs px-3 py-1.5 rounded-xl hover:opacity-90 active:scale-95 transition-all cursor-pointer shadow-sm">
            <Plus className="size-3.5" /> Add Plant
          </button>
        </Link>
      </div>

      {plants.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-8 text-center my-4 animate-slide-up">
          <div className="text-5xl mb-3">🌱</div>
          <p className="text-sm font-semibold text-slate-700">No plants in your garden yet</p>
          <p className="text-xs text-slate-400 mt-1">Browse our plant database to begin.</p>
          <Link to="/search" className="inline-block">
            <button className="mt-4 bg-primary text-white font-bold text-sm px-4 py-2 rounded-xl hover:opacity-90 active:scale-95 transition-all shadow-sm cursor-pointer">
              Add your first plant
            </button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4 mb-8">
          {plants.map((plant) => (
            <div
              key={plant.id}
              className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200/60 transition-all group"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5 min-w-0">
                  {/* Emoji Emblem */}
                  <div className="size-11 rounded-xl flex items-center justify-center text-2.5xl shrink-0 group-hover:scale-105 transition-transform" style={{ background: 'var(--gradient-leaf)' }}>
                    {plant.emoji}
                  </div>
                  
                  {/* Name details */}
                  <div className="min-w-0">
                    <p className="font-bold text-slate-800 truncate text-base leading-snug">{plant.nickname}</p>
                    <p className="text-xs text-slate-400 truncate mt-0.5 capitalize">{plant.plantId.replace(/-/g, ' ')}</p>
                  </div>
                </div>

                {/* View Details Button */}
                <Link to={`/plant/${plant.id}`} className="shrink-0">
                  <button className="bg-primary/10 hover:bg-primary/20 text-primary font-bold text-xs px-3.5 py-1.5 rounded-xl transition-all cursor-pointer border border-primary/10">
                    Details
                  </button>
                </Link>
              </div>

              {/* Quick Care Actions */}
              <div className="mt-4 grid grid-cols-4 gap-2">
                <button
                  onClick={(e) => handleQuickCare(e, plant.id, plant.nickname, 'lastWatered', 'Watered', '💧')}
                  className="flex flex-col items-center justify-center gap-1.5 py-2 px-1 rounded-xl bg-sky-100/50 border border-sky-200 text-sky-800 text-[10px] font-bold hover:bg-sky-200/80 active:scale-95 transition-all cursor-pointer shadow-sm"
                  title="Log Watering"
                >
                  <Droplets className="size-3.5" />
                  Water
                </button>
                <button
                  onClick={(e) => handleQuickCare(e, plant.id, plant.nickname, 'lastSunlight', 'Sunlight check', '☀️')}
                  className="flex flex-col items-center justify-center gap-1.5 py-2 px-1 rounded-xl bg-amber-100/50 border border-amber-200 text-amber-800 text-[10px] font-bold hover:bg-amber-200/80 active:scale-95 transition-all cursor-pointer shadow-sm"
                  title="Log Sunlight Check"
                >
                  <Sun className="size-3.5" />
                  Sun
                </button>
                <button
                  onClick={(e) => handleQuickCare(e, plant.id, plant.nickname, 'lastFertilized', 'Fertilized', '🌱')}
                  className="flex flex-col items-center justify-center gap-1.5 py-2 px-1 rounded-xl bg-emerald-100/50 border border-emerald-200 text-emerald-800 text-[10px] font-bold hover:bg-emerald-200/80 active:scale-95 transition-all cursor-pointer shadow-sm"
                  title="Log Fertilizer Feed"
                >
                  <Sprout className="size-3.5" />
                  Feed
                </button>
                <button
                  onClick={(e) => handleQuickCare(e, plant.id, plant.nickname, 'lastManure', 'Manured', '♻️')}
                  className="flex flex-col items-center justify-center gap-1.5 py-2 px-1 rounded-xl bg-slate-100/80 border border-slate-200 text-slate-800 text-[10px] font-bold hover:bg-slate-200 active:scale-95 transition-all cursor-pointer shadow-sm"
                  title="Log Compost/Manure"
                >
                  <Layers className="size-3.5" />
                  Compost
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Care Timeline Logs */}
      <div>
        <h2 className="text-lg font-bold text-slate-800 mb-3.5 flex items-center gap-1.5">
          <Calendar className="size-5 text-primary" /> Care Activity Log
        </h2>
        {careHistory.length === 0 ? (
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 text-center text-xs text-slate-400">
            Care actions you log will show up here as a timeline.
          </div>
        ) : (
          <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm relative overflow-hidden">
            {/* Timeline line */}
            <div className="absolute top-6 bottom-6 left-8 w-0.5 bg-slate-100"></div>

            <div className="space-y-4 relative">
              {careHistory.slice(0, 5).map((log) => (
                <div key={log.id} className="flex gap-4 items-start animate-slide-up">
                  {/* Circle Indicator */}
                  <div className="z-10 size-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-sm shrink-0">
                    {log.emoji}
                  </div>
                  
                  {/* Log description */}
                  <div className="flex-1 min-w-0 pt-0.5">
                    <p className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="size-3" /> {formatTime(log.timestamp)}
                    </p>
                    <p className="text-sm font-semibold text-slate-700 mt-0.5">
                      {log.action} <span className="text-primary">{log.plantName}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
