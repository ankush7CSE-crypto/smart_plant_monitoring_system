import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useSession, usePlants, useSettings } from './store';
import { checkAndTriggerNotifications } from './reminders';

// Pages
import Login from './pages/Login';
import Home from './pages/Home';
import Search from './pages/Search';
import PlantDetail from './pages/PlantDetail';
import Reminders from './pages/Reminders';
import Settings from './pages/Settings';

// Route Guard Component
function ProtectedRoutes() {
  const [session] = useSession();
  
  if (!session) {
    return <Navigate to="/" replace />;
  }
  
  return <Outlet />;
}

export default function App() {
  const [session] = useSession();
  const [plants] = usePlants();
  const [settings] = useSettings();

  // 1. Register Service Worker and Request Notification permissions
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((reg) => {
          console.log('Service Worker registered successfully:', reg.scope);
        })
        .catch((err) => {
          console.error('Service Worker registration failed:', err);
        });
    }

    if (session && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then((permission) => {
        console.log('Notification permission status:', permission);
      });
    }
  }, [session]);

  // 2. Set up background reminder checker (runs every 60 seconds)
  useEffect(() => {
    if (!session || plants.length === 0) return;

    // Run immediately when state changes
    checkAndTriggerNotifications(plants, settings);

    // Set interval to check every 60 seconds
    const intervalId = setInterval(() => {
      checkAndTriggerNotifications(plants, settings);
    }, 60000);

    return () => clearInterval(intervalId);
  }, [session, plants, settings]);

  return (
    <BrowserRouter>
      {/* Toast Notifications */}
      <Toaster
        position="top-center"
        toastOptions={{
          className: 'glass-card font-medium text-slate-800 text-sm rounded-2xl shadow-lg border border-slate-100',
          duration: 3000,
          style: {
            background: 'rgba(255, 255, 255, 0.9)',
          },
          success: {
            iconTheme: {
              primary: 'oklch(52% 0.14 145)',
              secondary: '#fff',
            },
          },
        }}
      />

      <Routes>
        {/* Public Route */}
        <Route path="/" element={session ? <Navigate to="/home" replace /> : <Login />} />
        
        {/* Protected Routes */}
        <Route element={<ProtectedRoutes />}>
          <Route path="/home" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/plant/:id" element={<PlantDetail />} />
          <Route path="/reminders" element={<Reminders />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
