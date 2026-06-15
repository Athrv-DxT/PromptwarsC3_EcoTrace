# EcoTrace - Carbon Footprint Awareness Platform

EcoTrace is a production-ready Carbon Footprint Awareness Platform built as a React SPA with Vite, styled with Tailwind CSS, and powered by free, keyless real-time APIs (Open-Meteo Air Quality/Weather and REST Countries).

---

## Features

1. **Multi-Step Footprint Calculator**:
   - Calculates carbon footprint across Transport, Home, Diet, and Shopping.
   - Leverages IPCC AR6 and UK DESNZ 2023 emission constants.
   - Provides live subtotal calculations at each step.
2. **Interactive Analytics Dashboard**:
   - Compares user footprint against World, UK, EU averages, and the 1.5°C target.
   - Provides detailed segment breakdown using Recharts.
   - Visualizes equivalent environmental contexts (flights, offset trees, car km).
3. **Environment Telemetry Widget**:
   - Requests browser geolocation permissions to fetch PM2.5, CO, and temperature.
   - Shows active energy-saving tips based on local weather conditions.
4. **Interactive Goal Tracker**:
   - Saves calculation runs in localStorage (excluding PII).
   - Generates an SVG trend sparkline tracking the last 5 calculations.
   - Recommends specific carbon-reduction tips to meet user target percentages.
5. **Auto-Rotate Fact Carousel**:
   - Rotates environmental facts every 5 seconds, pausing on hover/focus.
6. **Robust Accessibility & Security**:
   - Skip to main content links, label associations, ARIA attributes, and high color contrasts.
   - Strictly enforced client-side input validators, sanitized URLs, and Content-Security-Policy.

---

## Deploy to Vercel

1. Push this repo to GitHub
2. Go to vercel.com → New Project → Import your repo
3. Framework preset: Vite
4. Build command: npm run build
5. Output directory: dist
6. Click Deploy — live in 60 seconds

---

## Local Development

```bash
# Install dependencies
npm install

# Start local server
npm run dev

# Build for production
npm run build
```
