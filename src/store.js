import { useState, useEffect, useCallback } from 'react';

// Keys
const SESSION_KEY = 'spm.session.v1';
const PLANTS_KEY = 'spm.plants.v1';
const SETTINGS_KEY = 'spm.settings.v1';
const HISTORY_KEY = 'spm.history.v1';

// Default Settings
const DEFAULT_SETTINGS = {
  notifyWater: true,
  notifySunlight: true,
  notifyFertilizer: true,
  notifyManure: true,
  quietHours: false
};

// Local storage helpers
function getStorageItem(key, defaultValue) {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading key ${key}:`, error);
    return defaultValue;
  }
}

function setStorageItem(key, value) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent('spm:change', { detail: key }));
  } catch (error) {
    console.error(`Error setting key ${key}:`, error);
  }
}

// Reusable hook for reactive local storage
function useLocalStorage(key, defaultValue) {
  const [value, setValue] = useState(() => getStorageItem(key, defaultValue));

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.detail === key) {
        setValue(getStorageItem(key, defaultValue));
      }
    };
    window.addEventListener('spm:change', handleStorageChange);
    return () => window.removeEventListener('spm:change', handleStorageChange);
  }, [key, defaultValue]);

  const updateValue = useCallback((newValue) => {
    const computed = typeof newValue === 'function' ? newValue(getStorageItem(key, defaultValue)) : newValue;
    setStorageItem(key, computed);
    setValue(computed);
  }, [key, defaultValue]);

  return [value, updateValue];
}

// Exported Hooks
export function useSession() {
  return useLocalStorage(SESSION_KEY, null);
}

export function usePlants() {
  return useLocalStorage(PLANTS_KEY, []);
}

export function useSettings() {
  return useLocalStorage(SETTINGS_KEY, DEFAULT_SETTINGS);
}

export function useCareHistory() {
  return useLocalStorage(HISTORY_KEY, []);
}

// Care action mutator functions
export function addPlantInstance(plantId, nickname, emoji) {
  const plants = getStorageItem(PLANTS_KEY, []);
  const now = Date.now();
  const newInstance = {
    id: `${plantId}-${now}`,
    plantId,
    nickname: nickname || plantId,
    emoji: emoji || '🌱',
    addedAt: now,
    lastWatered: now,
    lastFertilized: now,
    lastManure: now,
    lastSunlight: now
  };
  setStorageItem(PLANTS_KEY, [newInstance, ...plants]);
  
  // Log history
  addHistoryLog(newInstance.nickname, emoji, 'Added to Garden');
  
  return newInstance;
}

export function removePlantInstance(id) {
  const plants = getStorageItem(PLANTS_KEY, []);
  const plantToRemove = plants.find(p => p.id === id);
  if (plantToRemove) {
    addHistoryLog(plantToRemove.nickname, plantToRemove.emoji, 'Removed from Garden');
  }
  setStorageItem(PLANTS_KEY, plants.filter(p => p.id !== id));
}

export function logCareAction(plantInstanceId, actionType, label, emoji) {
  const plants = getStorageItem(PLANTS_KEY, []);
  let plantName = 'Plant';
  let plantEmoji = '🌱';
  
  const updatedPlants = plants.map(plant => {
    if (plant.id === plantInstanceId) {
      plantName = plant.nickname;
      plantEmoji = plant.emoji;
      return {
        ...plant,
        [actionType]: Date.now()
      };
    }
    return plant;
  });
  
  setStorageItem(PLANTS_KEY, updatedPlants);
  
  // Log history
  addHistoryLog(plantName, plantEmoji, label);
}

export function addHistoryLog(plantName, emoji, action) {
  const history = getStorageItem(HISTORY_KEY, []);
  const newLog = {
    id: `${Date.now()}-${Math.random()}`,
    plantName,
    emoji,
    action,
    timestamp: Date.now()
  };
  // Limit to last 10 logs
  setStorageItem(HISTORY_KEY, [newLog, ...history].slice(0, 10));
}
