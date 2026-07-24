import React, { useState } from 'react';
import { Leaf, Sprout } from 'lucide-react';
import toast from 'react-hot-toast';
import { useSession } from '../store';

export default function Login() {
  const [, setSession] = useSession();
  const [name, setName] = useState('');

  // Handle permission request and set session
  const handleLogin = (mode, displayName) => {
    // Request notification permission immediately
    if ('Notification' in window) {
      Notification.requestPermission().then((permission) => {
        console.log('Notification permission requested at login:', permission);
      });
    }

    setSession({
      mode,
      name: displayName
    });

    toast.success(`Welcome, ${displayName}! 🌱`, {
      duration: 4000
    });
  };

  return (
    <div className="min-h-screen flex justify-center items-center px-4 py-8" style={{ background: 'var(--gradient-soft)' }}>
      <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-xl border border-slate-100/50 flex flex-col justify-between min-h-[480px] animate-slide-up">
        
        {/* Top Header Card */}
        <div className="rounded-2xl p-6 text-white shadow-lg text-center" style={{ background: 'var(--gradient-leaf)', boxShadow: 'var(--shadow-leaf)' }}>
          <div className="flex justify-center mb-3">
            <div className="p-3 bg-white/20 rounded-full animate-bounce">
              <Leaf className="size-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-extrabold leading-tight tracking-tight">Smart Plant Monitor</h1>
          <p className="mt-2 text-xs opacity-90 font-medium">Your green companion — track water, sun, soil & reminders.</p>
        </div>

        {/* Action Form */}
        <div className="my-8 flex-1 flex flex-col justify-center gap-5">
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Sprout className="size-4 text-primary animate-pulse" />
              Continue as User
            </label>
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-11 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm mt-3.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-inner text-slate-800"
            />
            <button
              disabled={!name.trim()}
              onClick={() => handleLogin('user', name.trim())}
              className="w-full h-11 bg-primary text-white font-bold rounded-xl mt-3.5 shadow-sm hover:opacity-95 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              Login
            </button>
          </div>

          <div className="flex items-center justify-between text-slate-400 text-xs px-2 select-none">
            <hr className="w-1/3 border-slate-200" />
            <span>or</span>
            <hr className="w-1/3 border-slate-200" />
          </div>

          <button
            onClick={() => handleLogin('guest', 'Guest Gardener')}
            className="w-full h-11 bg-white border-2 border-primary text-primary font-bold rounded-xl hover:bg-slate-50 active:scale-[0.98] transition-all cursor-pointer"
          >
            Continue as Guest
          </button>
        </div>

        {/* Footer */}
        <p className="text-xs text-center text-slate-400 font-medium select-none">🌱 Healthy plants, happy you.</p>
      </div>
    </div>
  );
}
