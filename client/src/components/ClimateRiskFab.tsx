import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Brain,
  Droplets,
  Flame,
  Lightbulb,
  Leaf,
  MapPin,
  X,
} from 'lucide-react';

import { computeRisk, STATE_RISK } from '../data/climateRisk';
import type { RiskLevel } from '../types';

/* a curated subset of states for the quick-pick dropdown */
const POPULAR_STATES = [
  'Kerala',
  'Assam',
  'Rajasthan',
  'Maharashtra',
  'Punjab',
  'Odisha',
];

const RISK_COLOR: Record<RiskLevel, string> = {
  low:    '#16a34a',
  medium: '#d97706',
  high:   '#dc2626',
  severe: '#7f1d1d',
};

/**
 * Always-on floating Climate Risk Index modal — port of ClimateRiskCard.js.
 * Lives bottom-left so it doesn't clash with the Calculator FAB (bottom-right).
 */
export default function ClimateRiskFab() {
  const [open, setOpen] = useState(false);
  const [stateName, setStateName] = useState<string>('Kerala');
  const [dropdown, setDropdown] = useState(false);

  const data = computeRisk(stateName);

  return (
    <>
      {/* FAB (bottom-left, just above the language bar) */}
      <motion.button
        onClick={() => setOpen(true)}
        whileHover={{ scale: 1.08, y: -2 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open Climate Risk Index"
        title="Climate Risk Index"
        className="fixed bottom-6 left-6 z-[2147483646] grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-leaf-500 to-leaf-700 text-white shadow-leaf"
      >
        <Leaf size={20} />
      </motion.button>

      {/* Overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[2147483647] grid place-items-center bg-black/40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ y: 22, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 22, opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-[360px] max-w-[94vw] rounded-3xl bg-white p-6 shadow-2xl ring-1 ring-leaf-100"
            >
              <button
                onClick={() => setOpen(false)}
                className="absolute right-4 top-4 grid h-7 w-7 place-items-center rounded-full bg-leaf-50 text-leaf-700 transition hover:bg-leaf-100"
              >
                <X size={14} />
              </button>

              {/* header */}
              <header className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-leaf-400 to-leaf-700 text-white shadow-sm">
                    <Leaf size={14} />
                  </div>
                  <span className="font-bold text-leaf-700">SeedSense AI</span>
                </div>

                {/* state selector */}
                <div className="relative">
                  <button
                    onClick={() => setDropdown((v) => !v)}
                    className="flex items-center gap-1 rounded-full border border-leaf-100 bg-leaf-50 px-3 py-1 text-xs font-semibold text-leaf-800 hover:bg-leaf-100"
                  >
                    <MapPin size={12} /> {stateName}
                  </button>

                  <AnimatePresence>
                    {dropdown && (
                      <motion.ul
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className="absolute right-0 top-full z-10 mt-2 max-h-72 w-48 overflow-y-auto rounded-xl border border-leaf-100 bg-white p-1 text-xs shadow-xl thin-scroll"
                      >
                        {[
                          ...POPULAR_STATES,
                          ...Object.keys(STATE_RISK)
                            .filter(
                              (k) =>
                                k !== 'Your Current Location' &&
                                !POPULAR_STATES.includes(k)
                            )
                            .sort(),
                        ].map((s) => (
                          <li key={s}>
                            <button
                              onClick={() => {
                                setStateName(s);
                                setDropdown(false);
                              }}
                              className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left font-semibold ${
                                s === stateName
                                  ? 'bg-leaf-50 text-leaf-700'
                                  : 'text-leaf-900/80 hover:bg-leaf-50/60'
                              }`}
                            >
                              {s}
                            </button>
                          </li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </div>
              </header>

              {/* title */}
              <div className="mt-4">
                <h3 className="font-display text-lg font-bold text-leaf-900">
                  🌱 Climate Risk Index
                </h3>
                <p className="text-[12px] text-leaf-700/60">
                  Based on {data.month} climate patterns
                </p>
              </div>

              {/* Metrics */}
              <div className="mt-4 grid grid-cols-3 gap-2">
                <Metric
                  label="Drought"
                  value={data.drought}
                  icon={<Flame size={12} />}
                  tone="amber"
                />
                <Metric
                  label="Flood"
                  value={data.flood}
                  icon={<Droplets size={12} />}
                  tone="blue"
                />
                <div className="flex flex-col justify-center rounded-xl border border-leaf-100 bg-leaf-50/50 px-3 py-2">
                  <div className="text-[11px] font-semibold uppercase text-leaf-700/60">
                    Overall Risk
                  </div>
                  <div
                    className="font-display text-base font-extrabold"
                    style={{ color: RISK_COLOR[data.overall] }}
                  >
                    {data.overall.toUpperCase()}
                  </div>
                </div>
              </div>

              {/* Reason */}
              <div className="mt-3 flex items-start gap-2 rounded-xl bg-sky-50 p-3 ring-1 ring-sky-100">
                <Brain size={14} className="mt-0.5 shrink-0 text-sky-700" />
                <p className="text-[12px] leading-snug text-sky-900/90">
                  {data.reason}
                </p>
              </div>

              {/* Tip */}
              <div className="mt-2 flex items-start gap-2 rounded-xl bg-amber-50 p-3 ring-1 ring-amber-100">
                <Lightbulb size={14} className="mt-0.5 shrink-0 text-amber-700" />
                <p className="text-[12px] leading-snug text-amber-900/90">
                  {data.advice}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ── animated metric tile ─────────────────────────────── */
function Metric({
  label,
  value,
  icon,
  tone,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  tone: 'amber' | 'blue';
}) {
  const styles =
    tone === 'amber'
      ? {
          card: 'bg-amber-50 ring-amber-100',
          fill: 'from-amber-300 to-amber-500',
          track: 'bg-amber-100',
          text: 'text-amber-700',
        }
      : {
          card: 'bg-sky-50 ring-sky-100',
          fill: 'from-sky-300 to-sky-600',
          track: 'bg-sky-100',
          text: 'text-sky-700',
        };

  return (
    <div className={`rounded-xl p-3 ring-1 ${styles.card}`}>
      <div className={`flex items-center gap-1 text-[11px] font-semibold ${styles.text}`}>
        {icon} {label}
      </div>
      <div className="mt-1 font-display text-2xl font-bold text-leaf-900">
        {value}%
      </div>
      <div className={`mt-1 h-1 w-full overflow-hidden rounded-full ${styles.track}`}>
        <motion.div
          className={`h-full rounded-full bg-gradient-to-r ${styles.fill}`}
          key={value}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}
