import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Sprout, Heart, Compass, FileText, Droplets, Sun, Calendar, Thermometer, Layers, CloudRain } from 'lucide-react';
import AppShell from '../components/AppShell';
import { addCustomPlantSpecies, addPlantInstance } from '../store';
import toast from 'react-hot-toast';

export default function CustomPlant() {
  const navigate = useNavigate();

  // Form states
  const [name, setName] = useState('');
  const [scientific, setScientific] = useState('');
  const [emoji, setEmoji] = useState('🪴');
  const [description, setDescription] = useState('');
  
  // Care intervals
  const [waterDays, setWaterDays] = useState(7);
  const [feedDays, setFeedDays] = useState(30);
  const [manureDays, setManureDays] = useState(90);
  const [sunlightHours, setSunlightHours] = useState(4);
  
  // Environment details
  const [temperature, setTemperature] = useState('18°C – 28°C');
  const [humidity, setHumidity] = useState('40% – 60%');
  const [soil, setSoil] = useState('Well-drained organic potting soil');

  // Care text guidelines
  const [waterText, setWaterText] = useState('Water when top soil dries');
  const [sunlightText, setSunlightText] = useState('Bright indirect light');
  const [fertilizerText, setFertilizerText] = useState('Balanced houseplant food');
  const [manureText, setManureText] = useState('Organic compost top-dress');

  const emojis = ['🪴', '🌿', '🌾', '🌹', '🍅', '🌱', '🌶️', '💚', '🌵', '🌻', '🌸', '🌳', '🍂', '🍀', '🍎'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Please enter a plant name');
      return;
    }

    const speciesId = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const speciesData = {
      id: speciesId,
      name: name.trim(),
      scientific: scientific.trim() || 'Custom Species',
      emoji,
      description: description.trim() || 'A beautiful custom addition to your garden.',
      water: waterText.trim() || 'Water regularly',
      sunlight: sunlightText.trim() || 'Medium indirect sunlight',
      soil: soil.trim() || 'Potting soil mix',
      fertilizer: fertilizerText.trim() || 'General purpose plant feed',
      manure: manureText.trim() || 'Light organic compost',
      temperature: temperature.trim() || '15°C – 25°C',
      humidity: humidity.trim() || 'Average humidity',
      waterEveryDays: Number(waterDays) || 7,
      fertilizerEveryDays: Number(feedDays) || 30,
      manureEveryDays: Number(manureDays) || 90,
      sunlightHours: Number(sunlightHours) || 4
    };

    // Save custom plant species to DB
    addCustomPlantSpecies(speciesData);

    // Automatically add it to the user's garden
    const instance = addPlantInstance(speciesData.id, speciesData.name, speciesData.emoji);

    toast.success(`${speciesData.name} created and added to your garden! 🎉`);
    navigate(`/plant/${instance.id}`);
  };

  return (
    <AppShell title="Custom Plant Creator">
      {/* Back button */}
      <Link to="/search" className="inline-flex items-center gap-1 text-sm text-slate-500 mb-4 hover:text-primary transition-colors">
        <ArrowLeft className="size-4" /> Back to Database
      </Link>

      <form onSubmit={handleSubmit} className="space-y-6 pb-6 animate-slide-up">
        
        {/* Core Info */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-800 border-b border-slate-50 pb-2 flex items-center gap-2">
            <Compass className="size-4 text-primary" /> Basic Information
          </h3>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Plant Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Peace Lily"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-800"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Scientific Name</label>
            <input
              type="text"
              placeholder="e.g. Spathiphyllum"
              value={scientific}
              onChange={(e) => setScientific(e.target.value)}
              className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-800"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Select Emoji Icon</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {emojis.map((em) => (
                <button
                  key={em}
                  type="button"
                  onClick={() => setEmoji(em)}
                  className={`size-10 rounded-xl flex items-center justify-center text-xl transition-all cursor-pointer border ${
                    emoji === em ? 'border-primary bg-primary/10 scale-110 shadow-sm' : 'border-slate-100 hover:bg-slate-50'
                  }`}
                >
                  {em}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Short Description</label>
            <textarea
              placeholder="e.g. Beautiful indoor plant known for its air-purifying qualities and elegant white blooms."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="3"
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-800"
            />
          </div>
        </div>

        {/* Intervals */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-800 border-b border-slate-50 pb-2 flex items-center gap-2">
            <Calendar className="size-4 text-primary" /> Care Schedules & Intervals
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <Droplets className="size-3 text-sky-500" /> Water Every
              </label>
              <div className="flex items-center gap-1.5 mt-1">
                <input
                  type="number"
                  min="1"
                  max="365"
                  value={waterDays}
                  onChange={(e) => setWaterDays(e.target.value)}
                  className="w-20 h-10 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-800"
                />
                <span className="text-xs font-semibold text-slate-600">days</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <Sprout className="size-3 text-emerald-500" /> Feed Every
              </label>
              <div className="flex items-center gap-1.5 mt-1">
                <input
                  type="number"
                  min="1"
                  max="365"
                  value={feedDays}
                  onChange={(e) => setFeedDays(e.target.value)}
                  className="w-20 h-10 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-800"
                />
                <span className="text-xs font-semibold text-slate-600">days</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <Layers className="size-3 text-amber-600" /> Manure Every
              </label>
              <div className="flex items-center gap-1.5 mt-1">
                <input
                  type="number"
                  min="1"
                  max="365"
                  value={manureDays}
                  onChange={(e) => setManureDays(e.target.value)}
                  className="w-20 h-10 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-800"
                />
                <span className="text-xs font-semibold text-slate-600">days</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <Sun className="size-3 text-amber-500" /> Sunlight Hours
              </label>
              <div className="flex items-center gap-1.5 mt-1">
                <input
                  type="number"
                  min="0"
                  max="24"
                  value={sunlightHours}
                  onChange={(e) => setSunlightHours(e.target.value)}
                  className="w-20 h-10 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-800"
                />
                <span className="text-xs font-semibold text-slate-600">hours/day</span>
              </div>
            </div>
          </div>
        </div>

        {/* Environmental Requirements */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-800 border-b border-slate-50 pb-2 flex items-center gap-2">
            <Thermometer className="size-4 text-primary" /> Environment & Care Guidelines
          </h3>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Ideal Temperature</label>
            <input
              type="text"
              placeholder="e.g. 18°C – 24°C"
              value={temperature}
              onChange={(e) => setTemperature(e.target.value)}
              className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-800"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Ideal Humidity</label>
            <input
              type="text"
              placeholder="e.g. 50% – 60%"
              value={humidity}
              onChange={(e) => setHumidity(e.target.value)}
              className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-800"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Preferred Soil</label>
            <input
              type="text"
              placeholder="e.g. Well-drained peat mix"
              value={soil}
              onChange={(e) => setSoil(e.target.value)}
              className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-800"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <Droplets className="size-3 text-sky-500" /> Watering Instructions
            </label>
            <input
              type="text"
              placeholder="e.g. Keep soil evenly moist but not waterlogged"
              value={waterText}
              onChange={(e) => setWaterText(e.target.value)}
              className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-800"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <Sun className="size-3 text-amber-500" /> Sunlight Instructions
            </label>
            <input
              type="text"
              placeholder="e.g. Medium to bright filtered light"
              value={sunlightText}
              onChange={(e) => setSunlightText(e.target.value)}
              className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-800"
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full h-11 bg-primary text-white font-bold rounded-xl shadow-md hover:opacity-95 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <Sprout className="size-4" /> Create & Add Plant
        </button>
      </form>
    </AppShell>
  );
}
