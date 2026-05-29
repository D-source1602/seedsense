import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Crosshair,
  Globe2,
  Leaf,
  Map as MapIcon,
  Search,
  Sparkles,
} from 'lucide-react';

import Logo from '../components/Logo';
import MapView from '../components/MapView';
import ClimateRiskPanel from '../components/ClimateRiskPanel';
import MagneticButton from '../components/MagneticButton';
import { INDIAN_STATES } from '../data/states';
import { useSelectedLocation } from '../hooks/useSelectedLocation';
import type { LocationSelection } from '../types';

export default function Dashboard() {
  const navigate = useNavigate();
  const { location, setLocation } = useSelectedLocation();
  const [query, setQuery] = useState('');
  const [geoError, setGeoError] = useState<string | null>(null);
  const [geoLoading, setGeoLoading] = useState(false);

  const filtered = INDIAN_STATES.filter((s) =>
    s.name.toLowerCase().includes(query.toLowerCase())
  );

  function pickState(s: { name: string; lat: number; lon: number }) {
    setLocation({ name: s.name, lat: s.lat, lon: s.lon });
  }

  function getMyLocation() {
    setGeoError(null);
    if (!('geolocation' in navigator)) {
      setGeoError('Geolocation is not supported by your browser.');
      return;
    }
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGeoLoading(false);
        setLocation({
          name: 'Your Current Location',
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        });
      },
      () => {
        setGeoLoading(false);
        setGeoError(
          'Could not get your location. Please ensure you have granted permission.'
        );
      }
    );
  }

  function confirm() {
    if (!location) return;
    navigate('/recommendations');
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-forest-night">
      {/* ────────── SIDEBAR ────────── */}
      <aside className="relative z-20 flex w-[380px] flex-shrink-0 flex-col overflow-hidden bg-gradient-to-b from-moss-900 via-leaf-950 to-forest-night text-leaf-50 shadow-3d-lift">
        {/* mesh glows */}
        <div className="pointer-events-none absolute -left-20 top-32 h-72 w-72 rounded-full bg-leaf-500/25 blur-3xl animate-orbDrift" />
        <div className="pointer-events-none absolute -right-16 bottom-40 h-64 w-64 rounded-full bg-saffron-500/15 blur-3xl animate-orbDrift" />
        <div className="pointer-events-none absolute right-1/3 top-1/2 h-48 w-48 rounded-full bg-lime-400/15 blur-3xl" />

        {/* film grain */}
        <div className="noise" />

        {/* header */}
        <div className="relative z-10 px-6 pt-6">
          <Logo variant="light" />

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mt-6"
          >
            <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-lime-400/30 bg-lime-400/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-lime-400">
              <Sparkles size={10} /> Climate Explorer
            </div>
            <h1 className="font-display text-3xl font-bold leading-tight">
              Pick your{' '}
              <span className="bg-gradient-to-r from-lime-400 to-leaf-300 bg-clip-text text-transparent">
                land.
              </span>
            </h1>
            <p className="mt-1 text-sm text-leaf-100/60">
              Discover what to grow with AI-driven climate insights.
            </p>
          </motion.div>
        </div>

        {/* geolocate button */}
        <div className="relative z-10 px-6 pt-5">
          <motion.button
            onClick={getMyLocation}
            disabled={geoLoading}
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.02 }}
            className="pulse-glow relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl border border-lime-400/30 bg-gradient-to-br from-leaf-500/20 via-leaf-700/10 to-moss-900 px-4 py-3 text-sm font-semibold text-lime-400 backdrop-blur transition disabled:opacity-60"
          >
            <span
              className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-lime-400/15 to-transparent"
              style={{
                animation: geoLoading ? 'none' : 'shimmer 2.4s linear infinite',
              }}
            />
            <Crosshair size={16} className={geoLoading ? 'animate-spin' : ''} />
            {geoLoading ? 'Locating you…' : 'Use My Current Location'}
          </motion.button>
          <AnimatePresence>
            {geoError && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-2 rounded-md border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 text-xs text-rose-200"
              >
                {geoError}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* search */}
        <div className="relative z-10 mt-5 px-6">
          <div className="group relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-leaf-100/40 transition group-focus-within:text-lime-400"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search states & UTs…"
              className="w-full rounded-xl border border-leaf-500/20 bg-moss-950/60 py-2.5 pl-9 pr-3 text-sm text-leaf-50 placeholder-leaf-100/30 backdrop-blur focus:border-lime-400/60 focus:outline-none focus:ring-2 focus:ring-lime-400/40"
            />
          </div>
        </div>

        {/* state list */}
        <div className="relative z-10 mt-3 flex-1 overflow-hidden px-6">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-leaf-100/50">
              <Globe2 size={11} /> Indian States &amp; UTs
            </h2>
            <span className="rounded-full bg-leaf-500/10 px-2 py-0.5 text-[10px] font-semibold text-lime-400">
              {filtered.length}
            </span>
          </div>
          <ul className="thin-scroll h-full overflow-y-auto pb-32 pr-1 space-y-1">
            <AnimatePresence>
              {filtered.map((s, i) => (
                <StateRow
                  key={s.name}
                  index={i}
                  name={s.name}
                  active={location?.name === s.name}
                  onClick={() => pickState(s)}
                />
              ))}
            </AnimatePresence>
            {filtered.length === 0 && (
              <li className="rounded-lg border border-leaf-500/10 bg-moss-950/40 px-3 py-6 text-center text-sm text-leaf-100/50">
                No matches — try another search 🔎
              </li>
            )}
          </ul>
        </div>

        {/* confirm */}
        <div className="relative z-10 border-t border-leaf-500/15 bg-moss-950/60 px-6 py-4 backdrop-blur">
          <MagneticButton
            disabled={!location}
            onClick={confirm}
            className="btn-wheat group w-full"
            strength={0.25}
          >
            Confirm &amp; Continue
            <span className="grid h-7 w-7 place-items-center rounded-full bg-soil-800 text-wheat-300 transition-transform group-hover:translate-x-0.5">
              <ArrowRight size={16} />
            </span>
          </MagneticButton>
          {location && (
            <motion.p
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 text-center text-xs text-leaf-100/60"
            >
              Selected:{' '}
              <span className="font-semibold text-wheat-300">{location.name}</span>
            </motion.p>
          )}
        </div>
      </aside>

      {/* ────────── MAP AREA ────────── */}
      <section className="relative flex-1 bg-forest-night">
        {/* Top bar */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-[400] flex items-center justify-between gap-4 px-6 pt-4">
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="pointer-events-auto flex items-center gap-2 rounded-full border border-leaf-500/20 bg-moss-900/70 px-4 py-2 text-sm text-leaf-100 backdrop-blur-xl"
          >
            <MapIcon size={14} className="text-lime-400" />
            <span className="font-semibold">India</span>
            <span className="text-leaf-100/40">/</span>
            <span className="text-leaf-100/70">
              {location ? location.name : 'Pick a state to begin'}
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="pointer-events-auto inline-flex items-center gap-1.5 rounded-full border border-lime-400/30 bg-moss-900/70 px-3 py-1.5 text-xs text-lime-400 backdrop-blur-xl"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-lime-400" />
            </span>
            Live climate data
          </motion.div>
        </div>

        {/* Empty-state center hint */}
        <AnimatePresence>
          {!location && (
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.5 }}
              className="pointer-events-none absolute inset-0 z-[400] grid place-items-center"
            >
              <div className="glass-card-strong px-6 py-5 text-center">
                <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-lime-400 to-leaf-700 text-leaf-950 shadow-glow">
                  <Leaf size={20} />
                </div>
                <p className="mt-3 font-display text-lg font-bold text-leaf-50">
                  Let's grow something{' '}
                  <span className="text-lime-400">amazing.</span>
                </p>
                <p className="mt-1 text-xs text-leaf-100/60">
                  Pick a state on the left or use your current location
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <MapView
          selection={location as LocationSelection | null}
          zoom={location?.name === 'Your Current Location' ? 13 : 7}
        />

        {/* AI Climate Risk panel */}
        <ClimateRiskPanel stateName={location?.name ?? null} />
      </section>
    </div>
  );
}

/* ── single sidebar state row ─────────────────────────── */
function StateRow({
  name,
  active,
  index,
  onClick,
}: {
  name: string;
  active: boolean;
  index: number;
  onClick: () => void;
}) {
  return (
    <motion.li
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: Math.min(index * 0.012, 0.4), duration: 0.3 }}
    >
      <motion.button
        onClick={onClick}
        whileHover={{ x: 4 }}
        whileTap={{ scale: 0.98 }}
        className={`group relative flex w-full items-center justify-between overflow-hidden rounded-xl px-3 py-2.5 text-left text-sm transition-all ${
          active
            ? 'bg-gradient-to-r from-lime-400 to-leaf-500 text-leaf-950 font-semibold shadow-glow'
            : 'text-leaf-100/85 hover:bg-moss-800/60 hover:text-leaf-50'
        }`}
      >
        {!active && (
          <span
            className="pointer-events-none absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-lime-400 to-leaf-500 opacity-0 transition-opacity group-hover:opacity-100"
            aria-hidden
          />
        )}
        <span className="relative">{name}</span>
        <ArrowRight
          size={14}
          className={`relative transition-all ${
            active
              ? 'translate-x-0 opacity-100'
              : '-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-60'
          }`}
        />
      </motion.button>
    </motion.li>
  );
}
