import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  Droplets,
  Flame,
  Lightbulb,
  Loader2,
  MapPin,
  Sparkles,
} from 'lucide-react';

import { computeRisk } from '../data/climateRisk';
import type { RiskLevel } from '../types';

type Props = {
  stateName: string | null;
};

const overallStyle: Record<RiskLevel, string> = {
  low:    'bg-emerald-100 text-emerald-800 ring-emerald-200',
  medium: 'bg-amber-100 text-amber-800 ring-amber-200',
  high:   'bg-rose-100 text-rose-800 ring-rose-200',
  severe: 'bg-rose-200 text-rose-900 ring-rose-300',
};

/** AI Climate Risk panel that overlays the map. */
export default function ClimateRiskPanel({ stateName }: Props) {
  const [loading, setLoading] = useState(false);

  const data = useMemo(
    () => (stateName ? computeRisk(stateName) : null),
    [stateName]
  );

  // 800 ms loading shimmer when state changes (parity with original)
  useEffect(() => {
    if (!stateName) return;
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, [stateName]);

  if (!stateName) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={stateName}
        initial={{ opacity: 0, y: 16, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.97 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="glass-card pointer-events-auto absolute bottom-6 left-6 z-[1000] w-[380px] max-w-[calc(100vw-3rem)] p-5"
      >
        {/* header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-leaf-400 to-leaf-700 text-white shadow-sm">
              <Sparkles size={14} />
            </div>
            <span className="font-semibold text-leaf-800">SeedSense AI</span>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full border border-leaf-100 bg-white/80 px-2 py-0.5 text-xs text-leaf-700">
            <MapPin size={11} />
            {data?.matchedKey ?? stateName}
          </span>
        </div>

        {/* title */}
        <div className="mt-3">
          <h3 className="font-display text-lg font-bold text-leaf-900">
            🌱 Climate Risk Index
          </h3>
          <p className="text-xs text-leaf-700/60">
            Based on {data?.month} climate patterns
          </p>
        </div>

        {/* loading */}
        {loading && (
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-leaf-50 px-3 py-2 text-sm text-leaf-700">
            <Loader2 size={14} className="animate-spin" />
            Analyzing climate data...
          </div>
        )}

        {/* content */}
        {!loading && data && (
          <>
            <div className="mt-4 grid grid-cols-3 gap-2">
              <RiskTile
                label="Drought"
                value={data.drought}
                tone="amber"
                icon={<Flame size={13} />}
              />
              <RiskTile
                label="Flood"
                value={data.flood}
                tone="blue"
                icon={<Droplets size={13} />}
              />
              <div
                className={`flex flex-col justify-center rounded-xl px-3 py-2 ring-1 ${overallStyle[data.overall]}`}
              >
                <div className="text-[11px] font-semibold uppercase tracking-wide opacity-70">
                  Overall
                </div>
                <div className="font-display text-base font-bold">
                  {data.overall.toUpperCase()}
                </div>
              </div>
            </div>

            <div className="mt-3 flex items-start gap-2 rounded-xl bg-sky-50 p-3 ring-1 ring-sky-100">
              <Brain size={14} className="mt-0.5 shrink-0 text-sky-700" />
              <p className="text-[12px] leading-snug text-sky-900/90">
                {data.reason}
              </p>
            </div>

            <div className="mt-2 flex items-start gap-2 rounded-xl bg-amber-50 p-3 ring-1 ring-amber-100">
              <Lightbulb size={14} className="mt-0.5 shrink-0 text-amber-700" />
              <p className="text-[12px] leading-snug text-amber-900/90">
                {data.advice}
              </p>
            </div>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

/* Animated risk tile with progress bar */
function RiskTile({
  label,
  value,
  tone,
  icon,
}: {
  label: string;
  value: number;
  tone: 'amber' | 'blue';
  icon: React.ReactNode;
}) {
  const styles =
    tone === 'amber'
      ? {
          card: 'bg-amber-50 ring-amber-100',
          track: 'bg-amber-100',
          fill: 'from-amber-300 to-amber-500',
          text: 'text-amber-700',
        }
      : {
          card: 'bg-sky-50 ring-sky-100',
          track: 'bg-sky-100',
          fill: 'from-sky-300 to-sky-600',
          text: 'text-sky-700',
        };

  return (
    <div className={`rounded-xl p-3 ring-1 ${styles.card}`}>
      <div className={`flex items-center gap-1 text-[11px] font-semibold ${styles.text}`}>
        {icon}
        <span>{label}</span>
      </div>
      <div className="mt-1 font-display text-2xl font-bold text-leaf-900">{value}%</div>
      <div className={`mt-1 h-1.5 w-full overflow-hidden rounded-full ${styles.track}`}>
        <motion.div
          className={`h-full rounded-full bg-gradient-to-r ${styles.fill}`}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}
