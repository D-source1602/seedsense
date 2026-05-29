import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  CalendarClock,
  CloudRain,
  Coins,
  Droplet,
  Layers,
  Sprout,
  Thermometer,
  Wheat,
} from 'lucide-react';

import Logo from '../components/Logo';
import {
  CROP_DATABASE,
  generateMarketPrice,
  getRecommendedCrops,
} from '../data/crops';
import { buildSoilProfile, generateMockWeather } from '../data/mockWeather';
import { readSavedLocation } from '../hooks/useSelectedLocation';
import type { Crop, SoilSummary, WeatherSummary } from '../types';

export default function Recommendations() {
  const navigate = useNavigate();
  const location = useMemo(() => readSavedLocation(), []);

  const [loading, setLoading] = useState(true);
  const [weather, setWeather] = useState<WeatherSummary | null>(null);
  const [soil, setSoil] = useState<SoilSummary | null>(null);
  const [crops, setCrops] = useState<Crop[]>([]);
  const [activeCrop, setActiveCrop] = useState<string | null>(null);
  const [marketPrice, setMarketPrice] = useState<number | null>(null);

  // Bounce back if no location saved
  useEffect(() => {
    if (!location) navigate('/dashboard');
  }, [location, navigate]);

  // Initial load (mocks the original 1.5s analysis delay)
  useEffect(() => {
    if (!location) return;
    const t = setTimeout(() => {
      setWeather(generateMockWeather(location));
      setSoil(buildSoilProfile(location.name));

      const cropNames = getRecommendedCrops(location.name);
      const cropList = cropNames
        .map((n) => CROP_DATABASE[n])
        .filter((c): c is Crop => Boolean(c));
      setCrops(cropList);
      if (cropList[0]) {
        setActiveCrop(cropList[0].name);
        setMarketPrice(generateMarketPrice(cropList[0].name));
      }
      setLoading(false);
    }, 1500);
    return () => clearTimeout(t);
  }, [location]);

  function handleSelect(name: string) {
    setActiveCrop(name);
    setMarketPrice(generateMarketPrice(name));
  }

  if (!location) return null;

  const currentCrop = crops.find((c) => c.name === activeCrop) ?? null;

  return (
    <div className="relative min-h-screen bg-cream">
      {/* very subtle field gradient for the page bg */}
      <div className="pointer-events-none fixed inset-0 bg-field-radial" aria-hidden />

      <div className="relative mx-auto flex min-h-screen max-w-[1500px]">
        {/* ─────────── MAIN CONTENT ─────────── */}
        <main className="flex-1 overflow-y-auto p-6 md:p-10">
          <header className="flex items-center justify-between">
            <Logo />
            <span className="hidden md:inline pill bg-leaf-50 text-leaf-700">
              <Sprout size={11} /> Live recommendations
            </span>
          </header>

          {/* Loading placeholder */}
          {loading && (
            <div className="mx-auto mt-24 max-w-md text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-leaf-400 to-leaf-700 text-white shadow-leaf"
              >
                <Sprout size={28} />
              </motion.div>
              <h2 className="mt-6 font-display text-2xl font-bold text-leaf-900">
                Analyzing your land…
              </h2>
              <p className="mt-1 text-sm text-leaf-700/70">
                Fetching weather, soil and the best crops for{' '}
                <span className="font-semibold text-leaf-800">
                  {location.name}
                </span>
              </p>
              <div className="mt-6 grid grid-cols-3 gap-3">
                <div className="shimmer h-20 rounded-xl" />
                <div className="shimmer h-20 rounded-xl" />
                <div className="shimmer h-20 rounded-xl" />
              </div>
            </div>
          )}

          {/* Crop detail card */}
          {!loading && currentCrop && (
            <AnimatePresence mode="wait">
              <motion.div
                key={currentCrop.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="mt-8"
              >
                {/* Hero image */}
                <div className="relative h-[320px] overflow-hidden rounded-3xl shadow-soft md:h-[420px]">
                  <img
                    src={currentCrop.image}
                    alt={currentCrop.name}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-leaf-900/85 via-leaf-900/30 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                    <span className="pill mb-3 bg-white/15 text-white">
                      <Wheat size={11} /> Recommended for {location.name}
                    </span>
                    <h1 className="font-display text-4xl font-bold text-white md:text-6xl">
                      {currentCrop.name}
                    </h1>
                    <p className="mt-1 text-leaf-50/80">
                      {currentCrop.climate} • {currentCrop.soilTypes.join(', ')}
                    </p>
                  </div>
                </div>

                {/* Stat cards */}
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <StatCard
                    title="Harvest Time"
                    value={currentCrop.harvestTime}
                    icon={<CalendarClock size={20} />}
                    accent="leaf"
                  />
                  <StatCard
                    title="Local Mandi Price"
                    value={
                      marketPrice
                        ? `₹ ${marketPrice.toLocaleString('en-IN')} / Quintal`
                        : '—'
                    }
                    icon={<Coins size={20} />}
                    accent="wheat"
                  />
                </div>

                {/* Steps */}
                <h2 className="section-title mt-10 flex items-center gap-2">
                  <Layers size={18} /> Cultivation Procedure
                </h2>
                <ol className="mt-5 space-y-3">
                  {currentCrop.steps.map((s, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 * i, duration: 0.3 }}
                      className="flex items-start gap-4 rounded-2xl border border-leaf-100 bg-white p-4 shadow-soft transition-shadow hover:shadow-md"
                    >
                      <div className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-full bg-gradient-to-br from-leaf-400 to-leaf-700 font-bold text-white shadow-md">
                        {i + 1}
                      </div>
                      <p className="pt-1 leading-relaxed text-leaf-900/90">{s}</p>
                    </motion.li>
                  ))}
                </ol>
              </motion.div>
            </AnimatePresence>
          )}
        </main>

        {/* ─────────── SIDEBAR ─────────── */}
        <aside className="thin-scroll sticky top-0 hidden h-screen w-[400px] flex-shrink-0 overflow-y-auto border-l border-leaf-100 bg-white/80 p-6 backdrop-blur lg:block">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1 text-sm font-semibold text-leaf-700 hover:text-leaf-900"
          >
            <ArrowLeft size={14} /> Change Location
          </Link>

          <h2 className="mt-2 font-display text-2xl font-bold text-leaf-900">
            Analysis for{' '}
            <span className="text-leaf-600">{location.name}</span>
          </h2>

          {/* Weather card */}
          <Card title="Current Weather" icon={<CloudRain size={16} />}>
            {!weather ? (
              <Skeleton n={3} />
            ) : (
              <div className="grid grid-cols-3 gap-2 text-center">
                <Stat label="Temp" value={`${weather.temperature}°C`} icon={<Thermometer size={14} />} />
                <Stat label="Humidity" value={`${weather.humidity}%`} icon={<Droplet size={14} />} />
                <Stat label="Rain" value={`${weather.rainfall} mm`} icon={<CloudRain size={14} />} />
              </div>
            )}
          </Card>

          {/* Soil card */}
          <Card title="Soil Profile" icon={<Layers size={16} />}>
            {!soil ? (
              <Skeleton n={2} />
            ) : (
              <ul className="space-y-1.5 text-sm text-leaf-900/90">
                <li>
                  <span className="text-leaf-700/70">Primary:</span>{' '}
                  <strong className="rounded bg-leaf-50 px-1.5 py-0.5 text-leaf-800">
                    {soil.type}
                  </strong>
                </li>
                <li>
                  <span className="text-leaf-700/70">pH Level:</span>{' '}
                  <strong>{soil.ph}</strong>
                </li>
                <li>
                  <span className="text-leaf-700/70">Fertility:</span>{' '}
                  <strong>{soil.fertility}</strong>
                </li>
              </ul>
            )}
          </Card>

          {/* Top recommendations */}
          <Card title="Top 5 Recommendations" icon={<Sprout size={16} />}>
            {crops.length === 0 ? (
              <Skeleton n={5} tall />
            ) : (
              <ul className="space-y-2">
                {crops.map((c) => (
                  <CropRow
                    key={c.name}
                    crop={c}
                    active={c.name === activeCrop}
                    onClick={() => handleSelect(c.name)}
                  />
                ))}
              </ul>
            )}
          </Card>
        </aside>
      </div>
    </div>
  );
}

/* ── reusable building blocks ───────────────────────────── */

function StatCard({
  title,
  value,
  icon,
  accent,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  accent: 'leaf' | 'wheat';
}) {
  const styles =
    accent === 'leaf'
      ? 'from-leaf-500/95 to-leaf-700/95 text-white'
      : 'from-wheat-300 to-wheat-500 text-soil-800';
  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br p-6 shadow-soft ${styles}`}>
      <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/15 blur-2xl" />
      <div className="relative flex items-center gap-2 text-sm font-semibold opacity-90">
        {icon} {title}
      </div>
      <div className="relative mt-2 font-display text-2xl font-bold md:text-3xl">
        {value}
      </div>
    </div>
  );
}

function Card({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-5 rounded-2xl border border-leaf-100 bg-white p-4 shadow-soft">
      <header className="mb-3 flex items-center gap-2 text-sm font-semibold text-leaf-800">
        <span className="grid h-7 w-7 place-items-center rounded-lg bg-leaf-50 text-leaf-700">
          {icon}
        </span>
        {title}
      </header>
      {children}
    </section>
  );
}

function Stat({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl bg-leaf-50 p-2.5">
      <div className="flex items-center justify-center gap-1 text-[10px] font-medium uppercase text-leaf-700/70">
        {icon}
        {label}
      </div>
      <div className="mt-0.5 font-display text-lg font-bold text-leaf-900">
        {value}
      </div>
    </div>
  );
}

function CropRow({
  crop,
  active,
  onClick,
}: {
  crop: Crop;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <li>
      <motion.button
        onClick={onClick}
        whileTap={{ scale: 0.98 }}
        whileHover={{ x: 4 }}
        className={`flex w-full items-center gap-3 rounded-xl p-2 text-left transition-all ${
          active
            ? 'bg-gradient-to-r from-leaf-500 to-leaf-700 text-white shadow-leaf'
            : 'bg-white hover:bg-leaf-50'
        } border ${active ? 'border-transparent' : 'border-leaf-100'}`}
      >
        <img
          src={crop.image}
          alt={crop.name}
          className="h-12 w-12 flex-shrink-0 rounded-lg object-cover ring-1 ring-white/40"
        />
        <div className="flex-1">
          <div className={`font-semibold ${active ? '' : 'text-leaf-900'}`}>
            {crop.name}
          </div>
          <div
            className={`text-[11px] ${
              active ? 'text-white/80' : 'text-leaf-700/60'
            }`}
          >
            {crop.harvestTime}
          </div>
        </div>
      </motion.button>
    </li>
  );
}

function Skeleton({ n = 3, tall = false }: { n?: number; tall?: boolean }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: n }).map((_, i) => (
        <div
          key={i}
          className={`shimmer rounded-lg ${tall ? 'h-14' : 'h-10'}`}
        />
      ))}
    </div>
  );
}
