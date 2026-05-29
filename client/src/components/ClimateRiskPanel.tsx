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
import AnimatedCounter from './AnimatedCounter';
import LiquidGlass from './LiquidGlass';
import Tilt3DCard from './Tilt3DCard';
import type { RiskLevel } from '../types';

type Props = { stateName: string | null };

const overallStyle: Record<RiskLevel, { ring: string; text: string; glow: string }> = {
  low:    { ring: 'ring-emerald-400/50', text: 'text-emerald-400', glow: 'shadow-[0_0_30px_rgba(52,211,153,0.4)]' },
  medium: { ring: 'ring-amber-400/50',   text: 'text-amber-400',   glow: 'shadow-[0_0_30px_rgba(252,211,77,0.4)]' },
  high:   { ring: 'ring-rose-400/50',    text: 'text-rose-400',    glow: 'shadow-[0_0_30px_rgba(251,113,133,0.4)]' },
  severe: { ring: 'ring-red-500/60',     text: 'text-red-400',     glow: 'shadow-[0_0_40px_rgba(239,68,68,0.5)]'   },
};

export default function ClimateRiskPanel({ stateName }: Props) {
  const [loading, setLoading] = useState(false);

  const data = useMemo(
    () => (stateName ? computeRisk(stateName) : null),
    [stateName]
  );

  useEffect(() => {
    if (!stateName) return;
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(t);
  }, [stateName]);

  if (!stateName) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={stateName}
        initial={{ opacity: 0, y: 22, rotateY: -10, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, rotateY: 0, scale: 1 }}
        exit={{ opacity: 0, y: 22, rotateY: 10, scale: 0.94 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-auto absolute bottom-6 left-6 z-[1000] w-[400px] max-w-[calc(100vw-3rem)] perspective-1500"
      >
        <Tilt3DCard maxTilt={6} lift={6}>
          <LiquidGlass rim className="border-glow relative overflow-hidden rounded-2xl p-5">
            {/* scanline */}
            <div
              className="pointer-events-none absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-lime-400/60 to-transparent"
              style={{ animation: 'scanline 4s linear infinite' }}
            />

            {/* header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-lime-400 to-leaf-700 text-leaf-950 shadow-glow">
                  <Sparkles size={13} />
                </div>
                <span className="font-semibold text-leaf-50">SeedSense AI</span>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full border border-lime-400/30 bg-leaf-500/10 px-2 py-0.5 text-xs text-lime-400">
                <MapPin size={11} />
                {data?.matchedKey ?? stateName}
              </span>
            </div>

            {/* title */}
            <div className="mt-3">
              <h3 className="font-display text-lg font-bold text-leaf-50">
                🌱 Climate Risk Index
              </h3>
              <p className="text-xs text-leaf-100/50">
                Based on {data?.month} climate patterns
              </p>
            </div>

            {/* loading */}
            <AnimatePresence>
              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mt-4 flex items-center gap-2 rounded-xl border border-lime-400/20 bg-leaf-500/5 px-3 py-2 text-sm text-lime-400"
                >
                  <Loader2 size={14} className="animate-spin" />
                  Analyzing climate data...
                </motion.div>
              )}
            </AnimatePresence>

            {/* content */}
            {!loading && data && (
              <>
                <div className="mt-4 grid grid-cols-3 gap-2">
                  <RiskRing
                    label="Drought"
                    value={data.drought}
                    color="#fbbf24"
                    icon={<Flame size={13} />}
                  />
                  <RiskRing
                    label="Flood"
                    value={data.flood}
                    color="#38bdf8"
                    icon={<Droplets size={13} />}
                  />
                  <div
                    className={`flex flex-col justify-center rounded-xl border border-leaf-500/15 bg-moss-950/60 px-3 py-2 ring-2 ${overallStyle[data.overall].ring} ${overallStyle[data.overall].glow}`}
                  >
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-leaf-100/50">
                      Overall
                    </div>
                    <div className={`font-display text-base font-bold ${overallStyle[data.overall].text}`}>
                      {data.overall.toUpperCase()}
                    </div>
                  </div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mt-3 flex items-start gap-2 rounded-xl border border-sky-400/20 bg-sky-500/5 p-3"
                >
                  <Brain size={14} className="mt-0.5 shrink-0 text-sky-400" />
                  <p className="text-[12px] leading-snug text-leaf-100/85">
                    {data.reason}
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-2 flex items-start gap-2 rounded-xl border border-amber-400/20 bg-amber-500/5 p-3"
                >
                  <Lightbulb size={14} className="mt-0.5 shrink-0 text-amber-400" />
                  <p className="text-[12px] leading-snug text-leaf-100/85">
                    {data.advice}
                  </p>
                </motion.div>
              </>
            )}
          </LiquidGlass>
        </Tilt3DCard>
      </motion.div>
    </AnimatePresence>
  );
}

/* Animated radial percent ring */
function RiskRing({
  label,
  value,
  color,
  icon,
}: {
  label: string;
  value: number;
  color: string;
  icon: React.ReactNode;
}) {
  const C = 2 * Math.PI * 22;
  const offset = C - (value / 100) * C;

  return (
    <div className="rounded-xl border border-leaf-500/15 bg-moss-950/60 p-2.5 backdrop-blur">
      <div
        className="flex items-center gap-1 text-[11px] font-semibold"
        style={{ color }}
      >
        {icon}
        <span>{label}</span>
      </div>
      <div className="mt-1 flex items-center justify-between">
        <div className="font-display text-xl font-bold text-leaf-50">
          <AnimatedCounter
            value={value}
            formatter={(n) => `${Math.round(n)}%`}
          />
        </div>
        <svg width="50" height="50" viewBox="0 0 50 50">
          <circle
            cx="25"
            cy="25"
            r="22"
            stroke="rgba(132, 204, 22, 0.12)"
            strokeWidth="4"
            fill="none"
          />
          <motion.circle
            cx="25"
            cy="25"
            r="22"
            stroke={color}
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
            strokeDasharray={C}
            initial={{ strokeDashoffset: C }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            transform="rotate(-90 25 25)"
            style={{ filter: `drop-shadow(0 0 6px ${color})` }}
          />
        </svg>
      </div>
    </div>
  );
}
