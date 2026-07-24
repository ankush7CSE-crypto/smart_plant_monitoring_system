import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Trash2, Droplets, Sun, Sprout, Layers, Thermometer, CloudRain, AlertTriangle, ShieldCheck } from 'lucide-react';
import AppShell from '../components/AppShell';
import { usePlants, removePlantInstance, logCareAction } from '../store';
import { getPlantSpecies } from '../plants';
import toast from 'react-hot-toast';

export default function PlantDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plants] = usePlants();

  const plant = plants.find((p) => p.id === id);
  const species = plant ? getPlantSpecies(plant.plantId) : null;

  // Simulator states
  const [moisture, setMoisture] = useState(55);
  const [temperature, setTemperature] = useState(22);
  const [lightHours, setLightHours] = useState(6);

  // Set default simulator values based on plant requirements
  useEffect(() => {
    if (species) {
      // Parse temperature midpoint
      const tempMatch = species.temperature.match(/(\d+)\D+(\d+)/);
      if (tempMatch) {
        const minT = parseInt(tempMatch[1]);
        const maxT = parseInt(tempMatch[2]);
        setTemperature(Math.round((minT + maxT) / 2));
      }
      setLightHours(species.sunlightHours || 6);

      // Default moisture based on watering interval
      if (species.waterEveryDays <= 2) setMoisture(70); // moisture loving
      else if (species.waterEveryDays >= 10) setMoisture(25); // succulent/dry loving
      else setMoisture(50);
    }
  }, [species]);

  if (!plant || !species) {
    return (
      <AppShell title="Not Found">
        <div className="text-center py-10 animate-slide-up">
          <p className="text-sm text-slate-500">This plant isn't in your garden.</p>
          <Link to="/home" className="text-primary text-sm font-bold underline mt-3 inline-block">
            Back to dashboard
          </Link>
        </div>
      </AppShell>
    );
  }

  // Parse ranges for simulator warning logic
  const tempRange = species.temperature.match(/(\d+)\D+(\d+)/);
  const minTemp = tempRange ? parseInt(tempRange[1]) : 15;
  const maxTemp = tempRange ? parseInt(tempRange[2]) : 30;

  const humRange = species.humidity.match(/(\d+)\D+(\d+)/);
  const minHum = humRange ? parseInt(humRange[1]) : 40;
  const maxHum = humRange ? parseInt(humRange[2]) : 70;

  // Moisture ideal ranges
  let minMoisture = 35;
  let maxMoisture = 75;
  if (species.id === 'aloe' || species.description?.toLowerCase().includes('succulent')) {
    minMoisture = 15;
    maxMoisture = 40;
  } else if (species.waterEveryDays <= 2) {
    minMoisture = 55;
    maxMoisture = 85;
  }

  // Simulator status checks
  const isMoistureTooDry = moisture < minMoisture;
  const isMoistureTooWet = moisture > maxMoisture;
  const isTempTooCold = temperature < minTemp;
  const isTempTooHot = temperature > maxTemp;
  const isLightTooLow = lightHours < species.sunlightHours - 1.5;
  const isLightTooHigh = lightHours > species.sunlightHours + 3;

  const hasAlerts = isMoistureTooDry || isMoistureTooWet || isTempTooCold || isTempTooHot || isLightTooLow || isLightTooHigh;

  const handleAction = (actionType, label, emoji) => {
    logCareAction(plant.id, actionType, label, emoji);
    toast.success(`${label} logged for ${plant.nickname} ${emoji}`);

    // Adjust simulator after action
    if (actionType === 'lastWatered') setMoisture(Math.min(95, maxMoisture + 10));
    if (actionType === 'lastSunlight') setLightHours(species.sunlightHours);
  };

  const handleRemove = () => {
    if (window.confirm(`Are you sure you want to remove ${plant.nickname} from your garden?`)) {
      removePlantInstance(plant.id);
      toast('Plant removed from garden', { icon: '🗑️' });
      navigate('/home');
    }
  };

  return (
    <AppShell title={plant.nickname}>
      {/* Back navigation */}
      <Link to="/home" className="inline-flex items-center gap-1 text-sm text-slate-500 mb-3 hover:text-primary transition-colors">
        <ArrowLeft className="size-4" /> Back to Dashboard
      </Link>

      <div className="space-y-5 animate-slide-up pb-6">
        
        {/* Plant Species Banner Card */}
        <div className="rounded-3xl p-6 text-white shadow-lg relative overflow-hidden" style={{ background: 'var(--gradient-leaf)', boxShadow: 'var(--shadow-leaf)' }}>
          <div className="flex justify-between items-start">
            <div className="min-w-0 pr-2">
              <div className="text-4xl mb-2.5">{plant.emoji}</div>
              <h2 className="text-xl font-extrabold truncate">{plant.nickname}</h2>
              <p className="text-xs italic opacity-90 truncate mt-0.5">{species.name} · {species.scientific}</p>
              <p className="text-xs mt-3 opacity-95 leading-relaxed font-medium">{species.description}</p>
            </div>
            
            {/* Dynamic Health Badge */}
            <span className={`shrink-0 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
              hasAlerts ? 'bg-amber-400 text-slate-900 animate-pulse' : 'bg-white/20 text-white'
            }`}>
              {hasAlerts ? 'Attention' : 'Healthy'}
            </span>
          </div>
        </div>

        {/* Dynamic Condition Warnings */}
        {hasAlerts && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4 space-y-2">
            <h4 className="text-xs font-bold text-amber-800 flex items-center gap-1.5 uppercase tracking-wide">
              <AlertTriangle className="size-4 text-amber-600 shrink-0" /> Plant Health Alerts:
            </h4>
            <ul className="text-xs text-amber-700 space-y-1 list-disc pl-4 font-medium">
              {isMoistureTooDry && <li>Soil is dry! Needs watering ({moisture}% &lt; ideal {minMoisture}%).</li>}
              {isMoistureTooWet && <li>Soil is waterlogged! Risk of root rot ({moisture}% &gt; ideal {maxMoisture}%).</li>}
              {isTempTooCold && <li>Too cold! Move to a warmer spot ({temperature}°C &lt; ideal {minTemp}°C).</li>}
              {isTempTooHot && <li>Too hot! Move to a cooler spot ({temperature}°C &gt; ideal {maxTemp}°C).</li>}
              {isLightTooLow && <li>Insufficient light! Needs more sun ({lightHours}h &lt; ideal {species.sunlightHours}h).</li>}
              {isLightTooHigh && <li>Too much direct sun! Risk of leaf scorch ({lightHours}h &gt; ideal {species.sunlightHours + 3}h).</li>}
            </ul>
          </div>
        )}

        {!hasAlerts && (
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4 flex items-center gap-2">
            <ShieldCheck className="size-5 text-emerald-600 shrink-0" />
            <span className="text-xs font-semibold text-emerald-800">All conditions are optimal. Your plant is thriving!</span>
          </div>
        )}

        {/* Plant Specs Stats Grid */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Care Specifications</h3>
          <div className="grid grid-cols-2 gap-3">
            <SpecCard icon={Droplets} label="Watering" value={species.water} accent={isMoistureTooDry} />
            <SpecCard icon={Sun} label="Sunlight" value={species.sunlight} accent={isLightTooLow} />
            <SpecCard icon={Layers} label="Soil Preference" value={species.soil} />
            <SpecCard icon={Sprout} label="Fertilization" value={species.fertilizer} />
            <SpecCard icon={Layers} label="Compost/Manure" value={species.manure} />
            <SpecCard icon={Thermometer} label="Temperature" value={species.temperature} accent={isTempTooCold || isTempTooHot} />
            <SpecCard icon={CloudRain} label="Humidity" value={species.humidity} className="col-span-2" />
          </div>
        </div>

        {/* Action Logs Panel */}
        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
          <p className="text-sm font-bold text-slate-800 mb-3.5">Log a care action</p>
          <div className="grid grid-cols-2 gap-2.5">
            <ActionButton label="Watered" icon={Droplets} color="bg-sky-500 text-white hover:bg-sky-600 shadow-md" onClick={() => handleAction('lastWatered', 'Watered', '💧')} />
            <ActionButton label="Sunlight" icon={Sun} color="bg-amber-500 text-white hover:bg-amber-600 shadow-md" onClick={() => handleAction('lastSunlight', 'Sunlight check', '☀️')} />
            <ActionButton label="Fertilizer" icon={Sprout} color="bg-emerald-500 text-white hover:bg-emerald-600 shadow-md" onClick={() => handleAction('lastFertilized', 'Fertilized', '🌱')} />
            <ActionButton label="Manure" icon={Layers} color="bg-stone-500 text-white hover:bg-stone-600 shadow-md" onClick={() => handleAction('lastManure', 'Manure', '♻️')} />
          </div>
        </div>

        {/* Interactive Condition Simulator Sliders */}
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 shadow-inner space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-800">Condition Simulator</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Adjust environmental levels to simulate real-time sensor triggers.</p>
          </div>

          {/* Moisture Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold text-slate-600">
              <span className="flex items-center gap-1"><Droplets className="size-3.5 text-sky-500" /> Soil Moisture</span>
              <span className={isMoistureTooDry ? 'text-rose-500' : isMoistureTooWet ? 'text-sky-500' : 'text-emerald-600'}>
                {moisture}% ({isMoistureTooDry ? 'Dry' : isMoistureTooWet ? 'Wet' : 'Ideal'})
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={moisture}
              onChange={(e) => setMoisture(Number(e.target.value))}
              className="w-full accent-sky-500 cursor-pointer h-1.5 bg-slate-200 rounded-lg appearance-none"
            />
          </div>

          {/* Temp Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold text-slate-600">
              <span className="flex items-center gap-1"><Thermometer className="size-3.5 text-rose-500" /> Temperature</span>
              <span className={isTempTooCold ? 'text-blue-500' : isTempTooHot ? 'text-red-500' : 'text-emerald-600'}>
                {temperature}°C ({isTempTooCold ? 'Cold' : isTempTooHot ? 'Hot' : 'Ideal'})
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              value={temperature}
              onChange={(e) => setTemperature(Number(e.target.value))}
              className="w-full accent-rose-500 cursor-pointer h-1.5 bg-slate-200 rounded-lg appearance-none"
            />
          </div>

          {/* Light Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold text-slate-600">
              <span className="flex items-center gap-1"><Sun className="size-3.5 text-amber-500" /> Sunlight Exposure</span>
              <span className={isLightTooLow ? 'text-amber-600' : isLightTooHigh ? 'text-orange-500' : 'text-emerald-600'}>
                {lightHours}h ({isLightTooLow ? 'Low' : isLightTooHigh ? 'High' : 'Ideal'})
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="15"
              value={lightHours}
              onChange={(e) => setLightHours(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer h-1.5 bg-slate-200 rounded-lg appearance-none"
            />
          </div>
        </div>

        {/* Delete plant button */}
        <button
          onClick={handleRemove}
          className="w-full h-11 border border-rose-200 text-rose-600 hover:bg-rose-50 font-bold rounded-xl active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Trash2 className="size-4" /> Remove Plant
        </button>

      </div>
    </AppShell>
  );
}

function SpecCard({ icon: Icon, label, value, accent, className }) {
  return (
    <div className={`rounded-2xl p-3.5 border transition-all ${
      accent ? 'border-amber-200 bg-amber-50/50' : 'border-slate-100 bg-white'
    } ${className || ''}`}>
      <div className="flex items-center gap-1.5 text-slate-400 mb-1.5">
        <Icon className={`size-4 ${accent ? 'text-amber-500' : 'text-primary'}`} />
        <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-xs font-semibold text-slate-700 leading-snug">{value}</p>
    </div>
  );
}

function ActionButton({ label, icon: Icon, color, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold active:scale-[0.97] transition-all cursor-pointer ${color}`}
    >
      <Icon className="size-4.5" />
      {label}
    </button>
  );
}
