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
  Sparkles,
  Sprout,
  Thermometer,
  Wheat,
} from 'lucide-react';

import Logo from '../components/Logo';
import MeshBackground from '../components/MeshBackground';
import Tilt3DCard from '../components/Tilt3DCard';
import AnimatedCounter from '../components/AnimatedCounter';
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

  useEffect(() => {
    if (!location) navigate('/dashboard');
  }, [location, navigate]);

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
    <div className="relative min-h-screen overflow-hidden bg-forest-night">
      <MeshBackground showEmbers={false} />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-[1500px]">
        {/* ─────────── MAIN CONTENT ─────────── */}
        <main className="thin-scroll flex-1 overflow-y-auto p-6 md:p-10">
          <header className="flex items-center justify-between">
            <Logo variant="light" />
            <span className="hidden md:inline-flex items-center gap-1.5 rounded-full border border-lime-400/30 bg-lime-400/10 px-3 py-1 text-xs font-semibold text-lime-400">
              <Sprout size={11} /> Live recommendations
            </span>
          </header>

          {loading && (
            <div className="mx-auto mt-24 max-w-md text-center">
              <div className="relative mx-auto h-20 w-20">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                  className="absolute inset-0 rounded-full border-2 border-lime-400/30 border-t-lime-400"
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
                  className="absolute inset-2 rounded-full border-2 border-leaf-500/30 border-b-leaf-500"
                />
                <div className="absolute inset-0 grid place-items-center">
                  <Sprout className="text-lime-400" size={24} />
                </div>
              </div>
              <h2 className="mt-6 font-display text-2xl font-bold text-leaf-50">
                Analyzing your land…
              </h2>
              <p className="mt-1 text-sm text-leaf-100/60">
                Fetching weather, soil and the best crops for{' '}
                <span className="font-semibold text-lime-400">
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

          {!loading && currentCrop && (
            <AnimatePresence mode="wait">
              <motion.div
                key={currentCrop.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="mt-8"
              >
                {/* 3D Hero */}
                <Tilt3DCard maxTilt={6} lift={10}>
                  <div className="border-glow relative h-[340px] overflow-hidden rounded-3xl shadow-3d-lift md:h-[440px]">
                    <img
                      src={currentCrop.image}
                      alt={currentCrop.name}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-forest-night via-forest-night/55 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-forest-night/70 via-transparent to-transparent" />

                    <div
                      className="pointer-events-none absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-lime-400 to-transparent"
                      style={{ filter: 'blur(2px)' }}
                    />

                    <div className="absolute inset-x-0 bottom-0 p-6 md:p-10">
                      <motion.span
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-lime-400/40 bg-lime-400/15 px-3 py-1 text-xs font-semibold text-lime-400 backdrop-blur"
                      >
                        <Wheat size={11} /> Recommended for {location.name}
                      </motion.span>
                      <motion.h1
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="font-display text-5xl font-bold text-leaf-50 drop-shadow-lg md:text-7xl"
                      >
                        {currentCrop.name}
                      </motion.h1>
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="mt-1 text-leaf-100/80"
                      >
                        {currentCrop.climate} • {currentCrop.soilTypes.join(', ')}
                      </motion.p>
                    </div>
                  </div>
                </Tilt3DCard>

                {/* Stat cards (3D) */}
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <Tilt3DCard maxTilt={10} lift={12}>
                    <StatCard
                      title="Harvest Time"
                      value={currentCrop.harvestTime}
                      icon={<CalendarClock size={20} />}
                      accent="leaf"
                    />
                  </Tilt3DCard>
                  <Tilt3DCard maxTilt={10} lift={12}>
                    <StatCard
                      title="Local Mandi Price"
                      value={
                        marketPrice !== null ? (
                          <>
                            ₹ <AnimatedCounter value={marketPrice} /> / Quintal
                          </>
                        ) : (
                          '—'
                        )
                      }
                      icon={<Coins size={20} />}
                      accent="wheat"
                    />
                  </Tilt3DCard>
                </div>

                {/* Steps */}
                <h2 className="section-title mt-12 flex items-center gap-2">
                  <Sparkles size={18} className="text-lime-400" />
                  Cultivation Procedure
                </h2>
                <ol className="mt-5 space-y-3">
                  {currentCrop.steps.map((s, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 * i, duration: 0.35 }}
                      whileHover={{ x: 4 }}
                      className="group relative flex items-start gap-4 overflow-hidden rounded-2xl border border-leaf-500/15 bg-moss-900/60 p-4 backdrop-blur transition-all hover:border-lime-400/40"
                    >
                      <span
                        className="pointer-events-none absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-lime-400 to-leaf-500 opacity-0 transition-opacity group-hover:opacity-100"
                        aria-hidden
                      />
                      <div className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-xl bg-gradient-to-br from-lime-400 to-leaf-700 font-bold text-leaf-950 shadow-glow">
                        {i + 1}
                      </div>
                      <p className="pt-1.5 leading-relaxed text-leaf-100/90">
                        {s}
                      </p>
                    </motion.li>
                  ))}
                </ol>
              </motion.div>
            </AnimatePresence>
          )}
        </main>

        {/* ─────────── SIDEBAR ─────────── */}
        <aside className="thin-scroll sticky top-0 hidden h-screen w-[400px] flex-shrink-0 overflow-y-auto border-l border-leaf-500/15 bg-moss-950/60 p-6 backdrop-blur-2xl lg:block">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1 text-sm font-semibold text-lime-400 hover:text-lime-500"
          >
            <ArrowLeft size={14} /> Change Location
          </Link>

          <h2 className="mt-2 font-display text-2xl font-bold text-leaf-50">
            Analysis for{' '}
            <span className="bg-gradient-to-r from-lime-400 to-leaf-300 bg-clip-text text-transparent">
              {location.name}
            </span>
          </h2>

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

          <Card title="Soil Profile" icon={<Layers size={16} />}>
            {!soil ? (
              <Skeleton n={2} />
            ) : (
              <ul className="space-y-2 text-sm text-leaf-100/85">
                <li className="flex justify-between">
                  <span className="text-leaf-100/50">Primary</span>
                  <strong className="rounded bg-lime-400/15 px-2 py-0.5 text-lime-400">
                    {soil.type}
                  </strong>
                </li>
                <li className="flex justify-between">
                  <span className="text-leaf-100/50">pH Level</span>
                  <strong className="text-leaf-50">{soil.ph}</strong>
                </li>
                <li className="flex justify-between">
                  <span className="text-leaf-100/50">Fertility</span>
                  <strong className="text-leaf-50">{soil.fertility}</strong>
                </li>
              </ul>
            )}
          </Card>

          <Card title="Top 5 Recommendations" icon={<Sprout size={16} />}>
            {crops.length === 0 ? (
              <Skeleton n={5} tall />
            ) : (
              <ul className="space-y-2">
                {crops.map((c, i) => (
                  <CropRow
                    key={c.name}
                    crop={c}
                    rank={i + 1}
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

/* ── building blocks ─────────────────────────────────── */

function StatCard({
  title,
  value,
  icon,
  accent,
}: {
  title: string;
  value: React.ReactNode;
  icon: React.ReactNode;
  accent: 'leaf' | 'wheat';
}) {
  const styles =
    accent === 'leaf'
      ? {
          gradient: 'from-leaf-700 via-leaf-800 to-moss-950',
          glow: 'shadow-glow',
          accent: 'text-lime-400',
        }
      : {
          gradient: 'from-wheat-500 via-saffron-500 to-soil-700',
          glow: 'shadow-glow-amber',
          accent: 'text-wheat-200',
        };

  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br p-6 ${styles.gradient} ${styles.glow}`}
    >
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/15 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10" />
      <div className={`relative flex items-center gap-2 text-sm font-semibold ${styles.accent}`}>
        {icon} {title}
      </div>
      <div className="relative mt-2 font-display text-3xl font-bold text-white md:text-4xl">
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
    <section className="mt-5 rounded-2xl border border-leaf-500/15 bg-moss-900/40 p-4 backdrop-blur">
      <header className="mb-3 flex items-center gap-2 text-sm font-semibold text-leaf-50">
        <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-lime-400 to-leaf-700 text-leaf-950 shadow-glow">
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
    <div className="rounded-xl border border-leaf-500/10 bg-moss-950/60 p-2.5">
      <div className="flex items-center justify-center gap-1 text-[10px] font-medium uppercase text-leaf-100/50">
        {icon} {label}
      </div>
      <div className="mt-0.5 font-display text-lg font-bold text-leaf-50">
        {value}
      </div>
    </div>
  );
}

function CropRow({
  crop,
  rank,
  active,
  onClick,
}: {
  crop: Crop;
  rank: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <li>
      <motion.button
        onClick={onClick}
        whileTap={{ scale: 0.98 }}
        whileHover={{ x: 4 }}
        className={`group relative flex w-full items-center gap-3 overflow-hidden rounded-xl p-2 text-left transition-all ${
          active
            ? 'bg-gradient-to-r from-lime-400 to-leaf-500 text-leaf-950 shadow-glow'
            : 'bg-moss-950/60 hover:bg-moss-800/60 border border-leaf-500/15'
        }`}
      >
        <span
          className={`grid h-5 w-5 flex-shrink-0 place-items-center rounded-full text-[10px] font-bold ${
            active ? 'bg-leaf-950 text-lime-400' : 'bg-lime-400/15 text-lime-400'
          }`}
        >
          {rank}
        </span>
        <img
          src={crop.image}
          alt={crop.name}
          className="h-12 w-12 flex-shrink-0 rounded-lg object-cover ring-1 ring-white/15"
        />
        <div className="flex-1">
          <div className={`font-semibold ${active ? '' : 'text-leaf-50'}`}>
            {crop.name}
          </div>
          <div
            className={`text-[11px] ${
              active ? 'text-leaf-950/70' : 'text-leaf-100/50'
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
