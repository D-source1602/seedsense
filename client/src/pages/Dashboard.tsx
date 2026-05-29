import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Crosshair, Map as MapIcon, Search } from 'lucide-react';

import Logo from '../components/Logo';
import MapView from '../components/MapView';
import ClimateRiskPanel from '../components/ClimateRiskPanel';
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
    // sessionStorage already written by the hook; navigate
    navigate('/recommendations');
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-cream">
      {/* ────────── SIDEBAR ────────── */}
      <aside className="relative z-20 flex w-[360px] flex-shrink-0 flex-col overflow-hidden bg-gradient-to-b from-leaf-700 via-leaf-800 to-leaf-900 text-white shadow-2xl">
        {/* swaying glow */}
        <div className="pointer-events-none absolute -left-10 top-20 h-72 w-72 rounded-full bg-leaf-400/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-10 bottom-20 h-60 w-60 rounded-full bg-wheat-300/15 blur-3xl" />

        {/* header */}
        <div className="relative z-10 px-6 pt-6">
          <Logo variant="light" />
          <div className="mt-5">
            <h1 className="font-display text-2xl font-bold">Climate Explorer</h1>
            <p className="text-sm text-leaf-100/70">
              Pick your land and discover what to grow.
            </p>
          </div>
        </div>

        {/* geolocate button */}
        <div className="relative z-10 px-6 pt-5">
          <motion.button
            onClick={getMyLocation}
            disabled={geoLoading}
            whileTap={{ scale: 0.97 }}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-semibold backdrop-blur transition hover:bg-white/15 disabled:opacity-60"
          >
            <Crosshair size={16} />
            {geoLoading ? 'Locating…' : 'Get My Current Location'}
          </motion.button>
          {geoError && (
            <p className="mt-2 text-xs text-rose-200">{geoError}</p>
          )}
        </div>

        {/* search */}
        <div className="relative z-10 mt-5 px-6">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-leaf-100/60"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search states & UTs"
              className="w-full rounded-xl border border-white/20 bg-white/10 py-2.5 pl-9 pr-3 text-sm text-white placeholder-leaf-100/50 backdrop-blur focus:border-wheat-300 focus:outline-none focus:ring-2 focus:ring-wheat-300/40"
            />
          </div>
        </div>

        {/* state list */}
        <div className="relative z-10 mt-3 flex-1 overflow-hidden px-6">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-leaf-100/70">
              Indian States &amp; UTs
            </h2>
            <span className="text-xs text-leaf-100/50">{filtered.length}</span>
          </div>
          <ul className="thin-scroll h-full overflow-y-auto pb-32 pr-1">
            {filtered.map((s) => (
              <StateRow
                key={s.name}
                name={s.name}
                active={location?.name === s.name}
                onClick={() => pickState(s)}
              />
            ))}
            {filtered.length === 0 && (
              <li className="rounded-lg bg-white/5 px-3 py-4 text-center text-sm text-leaf-100/60">
                No matches — try another search
              </li>
            )}
          </ul>
        </div>

        {/* confirm */}
        <div className="relative z-10 border-t border-white/10 bg-leaf-900/40 px-6 py-4 backdrop-blur">
          <motion.button
            whileTap={{ scale: 0.97 }}
            disabled={!location}
            onClick={confirm}
            className="btn-wheat w-full"
          >
            Confirm &amp; Continue
            <ArrowRight size={18} />
          </motion.button>
          {location && (
            <p className="mt-2 text-center text-xs text-leaf-100/70">
              Selected:{' '}
              <span className="font-semibold text-wheat-300">{location.name}</span>
            </p>
          )}
        </div>
      </aside>

      {/* ────────── MAP AREA ────────── */}
      <section className="relative flex-1">
        {/* Empty-state overlay */}
        {!location && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="pointer-events-none absolute right-6 top-6 z-[400] flex items-center gap-2 rounded-full border border-leaf-100 bg-white/85 px-4 py-2 text-sm text-leaf-800 shadow-soft backdrop-blur"
          >
            <MapIcon size={14} />
            Pick a state on the left or use your current location
          </motion.div>
        )}

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

/* ── single sidebar row ─────────────────────────────────────── */
function StateRow({
  name,
  active,
  onClick,
}: {
  name: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <li>
      <button
        onClick={onClick}
        className={`group flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition-all ${
          active
            ? 'bg-wheat-300 text-leaf-900 font-semibold shadow-md'
            : 'text-leaf-50 hover:bg-white/10'
        }`}
      >
        <span>{name}</span>
        <ArrowRight
          size={14}
          className={`transition-all ${
            active
              ? 'translate-x-0 opacity-100'
              : '-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-60'
          }`}
        />
      </button>
    </li>
  );
}
