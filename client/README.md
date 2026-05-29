# SeedSense — React + TypeScript Frontend

A modern rewrite of the original SeedSense HTML/JS app. Built with **Vite + React 18 + TypeScript + Tailwind CSS + Framer Motion**, with a crop-themed animated UI.

## Quick start

```bash
cd client
npm install
npm run dev      # starts Vite on http://localhost:3000
```

To build for production:

```bash
npm run build    # output goes to client/dist
npm run preview  # serve the production build locally
```

## Stack

| Concern        | Choice                                    |
| -------------- | ----------------------------------------- |
| Build tool     | Vite 5                                    |
| UI             | React 18 + TypeScript (strict)            |
| Styling        | Tailwind CSS (custom `leaf` / `wheat` / `soil` palettes) |
| Animation      | Framer Motion                             |
| Map            | React-Leaflet + OpenStreetMap tiles       |
| Routing        | React Router v6 (with animated transitions) |
| Icons          | lucide-react                              |
| Chatbot        | Botpress Webchat (loaded at runtime)      |
| Translation    | Google Translate widget (9 Indian languages) |

## Routes

| Path                | Page              |
| ------------------- | ----------------- |
| `/`                 | Login / Sign-up   |
| `/dashboard`        | Map + state picker + climate risk |
| `/recommendations`  | Weather / soil / crop details     |

State chosen on the dashboard is stored in `sessionStorage` under `selectedLocation` (same contract as the legacy app).

## Features (parity with the original)

- ✅ **Login**: email/password + Google Sign-In (same `client_id`)
- ✅ **Dashboard**: searchable list of all 36 Indian states/UTs, geolocation button, animated Leaflet map (with `flyTo`), Climate Risk Index card with month-aware drought/flood scoring
- ✅ **Recommendations**: mock weather, soil profile, top 5 crops, animated cultivation steps + mandi price card
- ✅ **Floating Farm Calculator** (`SeedSenseCalc`): Soil pH correction, Irrigation water requirement, Seed rate per hectare
- ✅ **Floating Climate Risk Index** modal with full state coverage
- ✅ **Language bar**: English, Hindi, Marathi, Odia, Bengali, Kannada, Telugu, Assamese, Gujarati
- ✅ **Botpress chatbot** (Customer Support)

## Project structure

```
client/
├── public/                # static assets (favicon)
├── src/
│   ├── components/        # reusable UI + animated widgets
│   │   ├── Background.tsx        # floating leaves + seeds + sun glow
│   │   ├── BotpressChatbot.tsx
│   │   ├── CalculatorWidget.tsx  # 3-tab pH / irrigation / seed
│   │   ├── ClimateRiskFab.tsx    # global modal
│   │   ├── ClimateRiskPanel.tsx  # in-map panel on dashboard
│   │   ├── LanguageBar.tsx
│   │   ├── Logo.tsx
│   │   └── MapView.tsx
│   ├── data/              # static data ported from the legacy JS
│   │   ├── calculator.ts         # CROP_PH, SEED_DB, etc.
│   │   ├── climateRisk.ts        # STATE_RISK + month multipliers + computeRisk()
│   │   ├── crops.ts              # CROP_DATABASE + recommendations + soil
│   │   ├── mockWeather.ts
│   │   └── states.ts             # 36 states with lat/lon
│   ├── hooks/
│   │   └── useSelectedLocation.ts
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   ├── Login.tsx
│   │   └── Recommendations.tsx
│   ├── App.tsx            # router + global widgets
│   ├── index.css          # Tailwind + design tokens + animations
│   ├── main.tsx
│   └── types.ts
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

## Backend

The legacy `server.js` (in the repo root) provides `/get-weather`, `/recommend-crops`, `/get-crop-details` etc. It is **optional** — the React app uses bundled mock data by default (parity with `red.js`). If you want to wire up the real backend:

```bash
# Terminal 1 — backend
cd ..
node server.js                # listens on :3000 (or change PORT in server.js)

# Terminal 2 — frontend (dev)
cd client
npm run dev                   # Vite proxies /get-weather etc. (see vite.config.ts)
```

> The default Express server uses port 3000, which Vite also uses. Change one before running both — `vite.config.ts` is currently set up to proxy to `http://localhost:4000`.

## Notes

- All data (crop database, state climate risk, soil mapping, calculator formulas) is preserved verbatim from the original codebase.
- The original `chatbot (6).js`, `ClimateRiskCard.js`, and `translator.js` floating widgets are reimplemented as React components with Framer Motion animations.
- Botpress is loaded via the same CDN/inject.js as the original.
