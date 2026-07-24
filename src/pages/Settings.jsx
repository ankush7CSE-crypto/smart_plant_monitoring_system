import React, { useState, useEffect } from 'react';
import { User, LogOut, Bell, Shield, Moon, Volume2, Settings2, Sparkles, HelpCircle } from 'lucide-react';
import AppShell from '../components/AppShell';
import { useSession, usePlants, useSettings } from '../store';
import toast from 'react-hot-toast';

export default function Settings() {
  const [session, setSession] = useSession();
  const [plants] = usePlants();
  const [settings, setSettings] = useSettings();
  const [permissionStatus, setPermissionStatus] = useState(() => 
    typeof window !== 'undefined' ? Notification.permission : 'default'
  );

  // Monitor permission state changes
  useEffect(() => {
    if (typeof window === 'undefined' || !('Notification' in window)) return;
    
    // Check permission status regularly
    const checkInterval = setInterval(() => {
      if (Notification.permission !== permissionStatus) {
        setPermissionStatus(Notification.permission);
      }
    }, 2000);
    
    return () => clearInterval(checkInterval);
  }, [permissionStatus]);

  const requestNotificationPermission = () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      toast.error('Notifications are not supported in this browser.');
      return;
    }

    Notification.requestPermission().then((permission) => {
      setPermissionStatus(permission);
      if (permission === 'granted') {
        toast.success('Desktop notifications enabled! 🔔');
        // Trigger test notification
        new Notification('🌱 Smart Plant Monitor', {
          body: 'System alerts registered successfully. You are ready to track!'
        });
      } else if (permission === 'denied') {
        toast.error('Notifications blocked. Please update your browser site settings.');
      }
    });
  };

  const handleToggle = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value
    }));
    toast.success('Preferences updated');
  };

  const handleSignOut = () => {
    if (window.confirm('Are you sure you want to sign out?')) {
      setSession(null);
      toast('Signed out successfully', { icon: '👋' });
    }
  };

  return (
    <AppShell title="Settings">
      <div className="space-y-6 pb-6 animate-slide-up">
        
        {/* User Card */}
        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm flex items-center gap-3.5">
          <div className="size-12 rounded-full flex items-center justify-center text-white shrink-0" style={{ background: 'var(--gradient-leaf)' }}>
            <User className="size-5.5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-slate-800 text-base truncate">{session?.name || 'Gardener'}</p>
            <p className="text-xs text-slate-400 capitalize mt-0.5 font-medium">
              {session?.mode || 'guest'} · {plants.length} active plant{plants.length === 1 ? '' : 's'}
            </p>
          </div>
        </div>

        {/* System Notifications Permission Checker */}
        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm space-y-3">
          <div className="flex justify-between items-start">
            <div className="min-w-0 pr-2">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <Shield className="size-4 text-primary" /> System Alerts
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">Allow browser permissions to get native notifications outside the app.</p>
            </div>
            
            {/* Permission indicator status */}
            <span className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
              permissionStatus === 'granted' ? 'bg-emerald-50 text-emerald-700' :
              permissionStatus === 'denied' ? 'bg-rose-50 text-rose-600' :
              'bg-amber-50 text-amber-600'
            }`}>
              {permissionStatus === 'granted' ? 'Enabled' :
               permissionStatus === 'denied' ? 'Blocked' :
               'Not Configured'}
            </span>
          </div>

          {permissionStatus !== 'granted' && (
            <button
              onClick={requestNotificationPermission}
              className="w-full py-2.5 bg-primary/10 hover:bg-primary/20 text-primary font-bold text-xs rounded-xl active:scale-95 transition-all cursor-pointer"
            >
              Request Notification Permission
            </button>
          )}

          {permissionStatus === 'granted' && (
            <div className="text-[11px] text-slate-400 flex items-center gap-1">
              <Sparkles className="size-3.5 text-primary shrink-0 animate-pulse" />
              <span>Background notifications are configured and active!</span>
            </div>
          )}
        </div>

        {/* Alerts Configuration Toggle Toggles */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
            <Bell className="size-4 text-slate-400" /> Alert Subscriptions
          </h2>
          <div className="bg-white border border-slate-100 rounded-2xl divide-y divide-slate-100 overflow-hidden shadow-sm">
            
            <ToggleSwitch
              label="Watering alerts"
              description="Alerts when soil moisture goes low"
              checked={settings.notifyWater}
              onChange={(val) => handleToggle('notifyWater', val)}
            />

            <ToggleSwitch
              label="Sunlight alerts"
              description="Daily sunlight exposure checks"
              checked={settings.notifySunlight}
              onChange={(val) => handleToggle('notifySunlight', val)}
            />

            <ToggleSwitch
              label="Fertilizer alerts"
              description="Reminders for scheduled feed cycles"
              checked={settings.notifyFertilizer}
              onChange={(val) => handleToggle('notifyFertilizer', val)}
            />

            <ToggleSwitch
              label="Manure alerts"
              description="Periodic compost & organic manure cycles"
              checked={settings.notifyManure}
              onChange={(val) => handleToggle('notifyManure', val)}
            />

            <ToggleSwitch
              label="Quiet Hours (10 PM - 7 AM)"
              description="Mute system alerts during the night"
              icon={Moon}
              checked={settings.quietHours}
              onChange={(val) => handleToggle('quietHours', val)}
            />

          </div>
        </div>

        {/* Help Panel */}
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex gap-3">
          <HelpCircle className="size-5 text-slate-400 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-500 leading-relaxed font-medium">
            <p className="font-bold text-slate-700">How do notifications work?</p>
            <p className="mt-1">
              When notifications are enabled, a background loop checks your plants schedules. If a care task becomes due and Quiet Hours are inactive, your browser triggers a native system alert.
            </p>
          </div>
        </div>

        {/* Log Out */}
        <button
          onClick={handleSignOut}
          className="w-full h-11 border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 font-bold rounded-xl active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
        >
          <LogOut className="size-4" /> Sign Out
        </button>

      </div>
    </AppShell>
  );
}

function ToggleSwitch({ label, description, icon: Icon, checked, onChange }) {
  return (
    <div className="flex items-center justify-between gap-4 p-4 hover:bg-slate-50/30 transition-colors">
      <div className="min-w-0">
        <p className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
          {Icon && <Icon className="size-4 text-slate-400 shrink-0" />}
          {label}
        </p>
        <p className="text-xs text-slate-400 mt-0.5 leading-snug">{description}</p>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`w-11 h-6 rounded-full p-0.5 transition-all relative shrink-0 focus:outline-none cursor-pointer ${
          checked ? 'bg-primary' : 'bg-slate-200'
        }`}
        role="switch"
        aria-checked={checked}
      >
        <div className={`size-5 rounded-full bg-white shadow-md transform transition-all ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`} />
      </button>
    </div>
  );
}
