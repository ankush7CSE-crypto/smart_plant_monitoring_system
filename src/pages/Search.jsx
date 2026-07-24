import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search as SearchIcon, Plus } from 'lucide-react';
import AppShell from '../components/AppShell';
import { addPlantInstance } from '../store';
import { searchPlantSpecies } from '../plants';
import toast from 'react-hot-toast';

export default function Search() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  // Search results
  const results = searchPlantSpecies(query);

  const handleAddPlant = (speciesId, name, emoji) => {
    const instance = addPlantInstance(speciesId, name, emoji);
    toast.success(`${name} added to your garden! 🎉`);
    navigate(`/plant/${instance.id}`);
  };

  return (
    <AppShell title="Plant Database">
      {/* Search Input Bar */}
      <div className="relative mb-5">
        <SearchIcon className="size-4.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          autoFocus
          placeholder="Search plant (e.g. ragi, tomato, aloe)..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full h-11 rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-inner text-slate-800"
        />
      </div>

      {/* Search Results Database List */}
      <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3.5">
        {query ? 'Search Results' : 'Standard Plant Species'} ({results.length})
      </h2>

      {results.length === 0 ? (
        <div className="text-center py-10 text-slate-400 text-sm">
          No plants matched “<span className="font-semibold text-slate-600">{query}</span>”.
        </div>
      ) : (
        <ul className="space-y-3">
          {results.map((plant) => (
            <li
              key={plant.id}
              className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center justify-between gap-3 shadow-sm hover:border-slate-200 transition-all animate-slide-up"
            >
              {/* Emoji Emblem */}
              <div className="size-12 rounded-xl flex items-center justify-center text-3xl shrink-0" style={{ background: 'var(--gradient-leaf)' }}>
                {plant.emoji}
              </div>

              {/* Name Details */}
              <div className="flex-1 min-w-0">
                <p className="font-bold text-slate-800 truncate text-base">{plant.name}</p>
                <p className="text-xs text-slate-400 italic truncate mt-0.5">{plant.scientific}</p>
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleAddPlant(plant.id, plant.name, plant.emoji)}
                className="size-9 rounded-xl bg-primary text-white flex items-center justify-center hover:opacity-90 transition-all active:scale-90 shadow-md cursor-pointer"
                title="Add to garden"
              >
                <Plus className="size-5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </AppShell>
  );
}
