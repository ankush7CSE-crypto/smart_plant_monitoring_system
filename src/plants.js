export const DEFAULT_PLANTS = [
  {
    id: "ragi",
    name: "Ragi (Finger Millet)",
    scientific: "Eleusine coracana",
    emoji: "🌾",
    water: "Moderate — 25–30 mm weekly; avoid waterlogging",
    sunlight: "Full sun, 6–8 hours daily",
    soil: "Well-drained red loamy or sandy loam, pH 5.0–8.2",
    fertilizer: "NPK 50:25:25 kg/ha; split N application",
    manure: "FYM 5–10 tonnes/ha before sowing",
    temperature: "26°C – 32°C (tolerates up to 35°C)",
    humidity: "50% – 70%",
    waterEveryDays: 5,
    fertilizerEveryDays: 30,
    manureEveryDays: 60,
    sunlightHours: 7,
    description: "A hardy nutri-cereal native to East Africa and widely grown in India. Drought-tolerant and rich in calcium and iron."
  },
  {
    id: "tomato",
    name: "Tomato",
    scientific: "Solanum lycopersicum",
    emoji: "🍅",
    water: "Deep watering 1–2 inches/week, keep soil evenly moist",
    sunlight: "Full sun, 6–8 hours daily",
    soil: "Well-drained loamy soil, pH 6.0–6.8",
    fertilizer: "Balanced 10-10-10 every 2 weeks",
    manure: "Compost 2 kg per plant at planting",
    temperature: "21°C – 27°C",
    humidity: "65% – 75%",
    waterEveryDays: 2,
    fertilizerEveryDays: 14,
    manureEveryDays: 45,
    sunlightHours: 7,
    description: "Warm-season fruit, prolific producer with proper care."
  },
  {
    id: "basil",
    name: "Basil (Tulsi)",
    scientific: "Ocimum basilicum",
    emoji: "🌿",
    water: "Keep soil moist, water when top inch dries",
    sunlight: "Full sun to partial, 6 hours daily",
    soil: "Rich, well-drained soil, pH 6.0–7.5",
    fertilizer: "Light liquid fertilizer every 4 weeks",
    manure: "Compost monthly, light dose",
    temperature: "18°C – 30°C",
    humidity: "40% – 60%",
    waterEveryDays: 2,
    fertilizerEveryDays: 28,
    manureEveryDays: 30,
    sunlightHours: 6,
    description: "Aromatic herb, sacred in many cultures, easy indoor grow."
  },
  {
    id: "rose",
    name: "Rose",
    scientific: "Rosa spp.",
    emoji: "🌹",
    water: "Deep weekly watering, more in heat",
    sunlight: "Full sun, at least 6 hours",
    soil: "Loamy, well-drained, pH 6.0–6.5",
    fertilizer: "Rose-specific fertilizer every 4–6 weeks",
    manure: "Aged cow manure twice a year",
    temperature: "15°C – 28°C",
    humidity: "40% – 60%",
    waterEveryDays: 3,
    fertilizerEveryDays: 35,
    manureEveryDays: 90,
    sunlightHours: 6,
    description: "Classic flowering shrub; needs pruning and airflow."
  },
  {
    id: "aloe",
    name: "Aloe Vera",
    scientific: "Aloe barbadensis miller",
    emoji: "🪴",
    water: "Sparse — every 2–3 weeks; let soil dry",
    sunlight: "Bright indirect light, 4–6 hours",
    soil: "Sandy, cactus mix, pH 7.0–8.5",
    fertilizer: "Diluted houseplant fertilizer 2–3x/year",
    manure: "Light compost annually",
    temperature: "13°C – 27°C",
    humidity: "30% – 40%",
    waterEveryDays: 14,
    fertilizerEveryDays: 120,
    manureEveryDays: 180,
    sunlightHours: 5,
    description: "Succulent with healing gel; thrives on neglect."
  },
  {
    id: "mint",
    name: "Mint",
    scientific: "Mentha",
    emoji: "🌱",
    water: "Consistently moist soil, water every 1–2 days",
    sunlight: "Partial shade to full sun, 4–6 hours",
    soil: "Moist, rich soil, pH 6.0–7.0",
    fertilizer: "Light feed every 4–6 weeks",
    manure: "Compost top-dress monthly",
    temperature: "13°C – 24°C",
    humidity: "50% – 70%",
    waterEveryDays: 2,
    fertilizerEveryDays: 30,
    manureEveryDays: 30,
    sunlightHours: 5,
    description: "Vigorous spreader — grow in pots to contain."
  },
  {
    id: "chili",
    name: "Chili Pepper",
    scientific: "Capsicum annuum",
    emoji: "🌶️",
    water: "Moderate, water when top soil dries",
    sunlight: "Full sun, 6–8 hours",
    soil: "Well-drained loamy, pH 6.0–6.8",
    fertilizer: "Balanced NPK every 2 weeks during fruiting",
    manure: "FYM 2 kg per plant before flowering",
    temperature: "20°C – 30°C",
    humidity: "50% – 70%",
    waterEveryDays: 3,
    fertilizerEveryDays: 14,
    manureEveryDays: 45,
    sunlightHours: 7,
    description: "Hot loving fruiting plant; high yield in warm climates."
  },
  {
    id: "money-plant",
    name: "Money Plant",
    scientific: "Epipremnum aureum",
    emoji: "💚",
    water: "Water when top inch dries, every 5–7 days",
    sunlight: "Bright indirect light, 4–6 hours",
    soil: "Well-drained potting mix, pH 6.1–6.8",
    fertilizer: "Balanced liquid feed monthly",
    manure: "Compost every 3 months",
    temperature: "17°C – 30°C",
    humidity: "50% – 70%",
    waterEveryDays: 6,
    fertilizerEveryDays: 30,
    manureEveryDays: 90,
    sunlightHours: 5,
    description: "Popular indoor vine, purifies air and easy to propagate."
  }
];

export function getPlantSpecies(id) {
  return DEFAULT_PLANTS.find(p => p.id === id);
}

export function searchPlantSpecies(query) {
  const normalizedQuery = query.trim().toLowerCase();
  
  if (!normalizedQuery) return DEFAULT_PLANTS;
  
  return DEFAULT_PLANTS.filter(
    p =>
      p.name.toLowerCase().includes(normalizedQuery) ||
      p.scientific.toLowerCase().includes(normalizedQuery) ||
      p.id.includes(normalizedQuery)
  );
}
