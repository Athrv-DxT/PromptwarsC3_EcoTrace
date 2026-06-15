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

---

## Why EcoTrace Is Different

| Feature | Existing Solutions | EcoTrace |
| :--- | :--- | :--- |
| **Methodology** | Mostly generic calculator questions | Real-time context, regional API factors |
| **Conversational AI** | Static forms with generic output | **AI-powered Sustainability Coach** (Gemini) |
| **Predictive Analytics** | Basic static charts | **Predictive Future Impact Simulator** |
| **Personalization** | Rigid formulas with no custom tips | Priority-impact score action plans |
| **Progress Tracking** | Single-use sessions | Local storage tracking with SVG trend sparklines |
| **Engagement** | Plain list displays | Gamified Fact Carousels with auto-pausing |

---

## Security Features

- **Input Validation**: Strict client-side numeric range and type enforcement to avoid NaN/Infinity corruption.
- **AbortController API**: Integrates AbortController timeouts to safely abort REST queries after 8 seconds.
- **Environment Variable Isolation**: Critical configurations and keys (e.g., Gemini API keys) are kept isolated within environment modules.
- **Content Security Policy (CSP)**: Meta tags strictly bound to domain endpoints to prevent cross-site scripting (XSS).
- **Error Boundaries & Fallbacks**: Smart UI failovers for geolocation and restful API services ensure uninterrupted user sessions.
- **Sanitized URL Queries**: Complete sanitization of URL parameters and inputs using `encodeURIComponent` to protect APIs.
- **Secure Local Storage**: Zero PII (personal identifiable information) is stored; only scores and run dates are persisted.

---

## Accessibility Features (WCAG 2.1 AA)

- **Keyboard Navigation**: 100% traversable via standard Tab/Shift-Tab focus loops.
- **Skip Links**: Accessible skip-to-content links bypass headers for screen reader convenience.
- **Semantic HTML**: Proper section tags (`header`, `main`, `section`) and nesting hierarchies (`h1` -> `h2` -> `h3`).
- **Focus Management**: Focus outline styling remains explicitly visible during keyboard navigation.
- **Screen Reader Support**: Associated labels (`htmlFor`), explicit descriptions (`aria-describedby`), and polite live announcements (`aria-live="polite"`).
- **Color Contrast Compliance**: Highly readable text elements exceeding contrast minimums for both light and dark mode configurations.
- **Responsive Layout**: Fluid CSS styling preventing horizontal overflows on multiple viewports.

