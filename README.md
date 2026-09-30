# Smart Plant Monitoring System

A modern, responsive progressive web application designed to help gardeners monitor plant health, track care schedules, simulate environmental conditions, and receive automated notifications for watering, feeding, and sunlight.

---

## 🚀 Live Demo

👉 [Live Demo](https://smartplantmonitoringsystem-gules.vercel.app/)

---

## 🌱 Overview

The **Smart Plant Monitoring System** serves as a digital companion for plant care. Whether you are managing house flora, herbs, or garden crops, the system tracks care intervals (watering, fertilization, manure/composting, and sunlight exposure), alerts you when tasks are overdue, and simulates real-time soil and ambient sensor metrics to diagnose potential health issues like root rot, dehydration, or temperature stress.

---

## ✨ Features

- **Plant Care Database**: Pre-configured with species profiles (e.g., Ragi, Tomato, Basil, Rose, Aloe Vera, Mint, Chili Pepper, Money Plant) containing optimal soil pH, watering frequency, sunlight requirements, and temperature ranges.
- **Instant Plant Search**: Real-time searching by common name, scientific botanical name, or category.
- **Care Schedule & Overdue Tracker**: Automated calculation of due dates and overdue statuses for watering, fertilizing, compost application, and daily sunlight checks.
- **Interactive Environmental Condition Simulator**: Interactive sliders for soil moisture (%), ambient temperature (°C), and daily sunlight (hours) with dynamic health alerts for out-of-range environmental conditions.
- **Native Browser Notifications**: Background notification support via Service Workers and Web Notifications API, alerting users when care tasks are due.
- **Quiet Hours & Alert Controls**: Custom preference toggles to mute alerts between 10:00 PM and 7:00 AM, with individual switches for each alert category.
- **Activity & Care Log Timeline**: Live timeline recording recent care actions (watered, fed, composted, sunlight checked) with relative timestamps.
- **Offline-First & Reactive State**: Persistent client-side data management using reactive `localStorage` events.
- **Modern Mobile-First UI**: Polished glassmorphism aesthetics, clean typography with Google Font Outfit, custom OKLCH color palettes, and smooth micro-animations.

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite 8](https://vite.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Routing**: [React Router v7](https://reactrouter.com/)
- **Notifications & Toasts**: [React Hot Toast](https://react-hot-toast.com/) & Web Notifications API
- **Service Worker**: PWA background notification handler
- **Linter**: [Oxlint](https://oxc.rs/)
- **Deployment**: [Vercel](https://vercel.com/)

---

## 📁 Project Structure

```text
├── public/
│   ├── favicon.svg          # Application favicon
│   ├── icons.svg            # UI iconography
│   └── sw.js                # Service worker for background notification management
├── src/
│   ├── assets/              # Static assets and graphics
│   ├── components/
│   │   └── AppShell.jsx     # Navigation shell, header, and tab bar
│   ├── pages/
│   │   ├── Home.jsx         # Garden overview, guides, and care activity timeline
│   │   ├── Login.jsx        # User and guest authentication view
│   │   ├── PlantDetail.jsx  # Health metrics, specs, simulator, and care action logger
│   │   ├── Reminders.jsx    # Due now and upcoming care schedule tracker
│   │   ├── Search.jsx       # Species database search and discovery
│   │   └── Settings.jsx     # Notification permissions and alert preference toggles
│   ├── App.css              # Legacy layout styles
│   ├── App.jsx              # Main routing, notification interval loops, and guards
│   ├── index.css            # Tailwind theme tokens, glassmorphism utilities, animations
│   ├── main.jsx             # React DOM entry point
│   ├── plants.js            # Plant species catalog and search helper
│   ├── reminders.js         # Interval calculation and notification trigger logic
│   └── store.js             # Reactive localStorage state hooks
├── .env.example             # Safe environment variable configuration template
├── .gitignore               # Ignored dependencies, build outputs, and local files
├── .oxlintrc.json           # Linter configuration
├── index.html               # Single page application HTML shell
├── package.json             # Dependencies and build scripts
├── vercel.json              # Vercel SPA routing rewrite rules
└── vite.config.js           # Vite build and Tailwind plugin configuration
```

---

## ⚙️ Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/ankush7CSE-crypto/smart_plant_monitoring_system.git
   ```

2. **Navigate to the project directory**:
   ```bash
   cd smart_plant_monitoring_system
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

---

## 🔐 Environment Variables

This application is built as a client-side progressive web application and does not require external backend credentials or API keys to operate.

To configure optional environment variables:
```bash
cp .env.example .env
```

---

## ▶️ Running Locally

Start the local development server:
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

---

## 🏗️ Production Build

To generate the optimized production build:
```bash
npm run build
```

To preview the production build locally:
```bash
npm run preview
```

---

## 👥 Author

- **Shanmukh / Ankush** ([@ankush7CSE-crypto](https://github.com/ankush7CSE-crypto))
