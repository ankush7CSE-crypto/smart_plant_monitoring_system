import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Search, Bell, Settings, Sprout } from 'lucide-react';
import { usePlants, useSettings } from '../store';
import { calculateReminders } from '../reminders';

export default function AppShell({ children, title }) {
  const location = useLocation();
  const [plants] = usePlants();
  const [settings] = useSettings();

  // Calculate active due reminders for the nav badge
  const allReminders = calculateReminders(plants);
  const activeReminders = allReminders.filter(r => {
    if (r.type === 'water' && !settings.notifyWater) return false;
    if (r.type === 'sunlight' && !settings.notifySunlight) return false;
    if (r.type === 'fertilizer' && !settings.notifyFertilizer) return false;
    if (r.type === 'manure' && !settings.notifyManure) return false;
    return r.dueAt <= Date.now();
  });

  const dueCount = activeReminders.length;

  const navItems = [
    { to: '/home', label: 'Home', icon: Home },
    { to: '/search', label: 'Search', icon: Search },
    { to: '/reminders', label: 'Reminders', icon: Bell, badge: dueCount },
    { to: '/settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex justify-center">
      <div className="w-full max-w-md flex flex-col min-h-screen bg-white relative pb-20 shadow-xl border-x border-slate-100">
        
        {/* Sticky Header */}
        <header className="sticky top-0 z-10 px-5 py-4 flex items-center justify-between text-white shadow-md" style={{ background: 'var(--gradient-leaf)' }}>
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-white/20 rounded-xl">
              <Sprout className="size-6 text-white" />
            </div>
            <h1 className="text-lg font-bold tracking-tight">{title || 'Smart Plant Monitor'}</h1>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 px-5 py-6 overflow-y-auto animate-slide-up">
          {children}
        </main>

        {/* Bottom Tab Navigation */}
        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md border-t border-slate-100 bg-white/95 backdrop-blur-md z-20 shadow-[0_-4px_20px_-4px_rgba(0,0,0,0.05)]">
          <ul className="grid grid-cols-4">
            {navItems.map(({ to, label, icon: Icon, badge }) => {
              const isActive = location.pathname === to;
              return (
                <li key={to}>
                  <NavLink
                    to={to}
                    className={`flex flex-col items-center gap-1 py-3 text-xs transition-all relative ${
                      isActive ? 'text-primary font-semibold scale-105' : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    <div className="relative">
                      <Icon className={`size-5 transition-transform ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                      {badge > 0 && (
                        <span className="absolute -top-1.5 -right-2 bg-rose-500 text-white text-[9px] font-bold min-w-[15px] h-[15px] px-1 rounded-full flex items-center justify-center border border-white animate-pulse">
                          {badge}
                        </span>
                      )}
                    </div>
                    <span>{label}</span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

      </div>
    </div>
  );
}
