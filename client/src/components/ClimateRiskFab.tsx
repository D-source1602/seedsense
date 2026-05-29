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
import AnimatedCounter from './AnimatedCounter';
import LiquidGlass from './LiquidGlass';
import Tilt3DCard from './Tilt3DCard';
import type { RiskLevel } from '../types';

const POPULAR_STATES = ['Kerala', 'Assam', 'Rajasthan', 'Maharashtra', 'Punjab', 'Odisha'];

const RISK_COLOR: Record<RiskLevel, string> = {
  low:    '#34d399',
  medium: '#fbbf24',
  high:   '#fb7185',
  severe: '#ef4444',
};

export default function ClimateRiskFab() {
  const [open, setOpen] = useState(false);
  const [stateName, setStateName] = useState<string>('Kerala');
  const [dropdown, setDropdown] = useState(false);

  const data = computeRisk(stateName);

  return (
    <>
      <motion.button
        onClick={() => setOpen(true)}
        whileHover={{ scale: 1.1, y: -3, rotate: -8 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open Climate Risk Index"
        title="Climate Risk Index"
        className="pulse-glow fixed bottom-6 left-6 z-[2147483646] grid h-12 w-12 place-items-center rounded-full text-leaf-950 shadow-glow"
        style={{
          background: 'linear-gradient(135deg, #a3e635 0%, #46c468 50%, #22a04a 100%)',
        }}
      >
        <Leaf size={20} />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[2147483647] grid place-items-center bg-forest-night/70 backdrop-blur-md"
          >
            <motion.div
              initial={{ y: 28, opacity: 0, scale: 0.92, rotateX: -10 }}
              animate={{ y: 0, opacity: 1, scale: 1, rotateX: 0 }}
              exit={{ y: 28, opacity: 0, scale: 0.92, rotateX: -10 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="perspective-1500"
            >
              <Tilt3DCard maxTilt={5} lift={4} className="w-[360px] max-w-[94vw]">
                <LiquidGlass rim className="border-glow relative rounded-2xl p-6">
                  <button
                    onClick={() => setOpen(false)}
                    className="absolute right-4 top-4 grid h-7 w-7 place-items-center rounded-full bg-moss-800/80 text-leaf-100 transition hover:bg-moss-700"
                  >
                    <X size={14} />
                  </button>

                  <header className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-lime-400 to-leaf-700 text-leaf-950 shadow-glow">
                        <Leaf size={14} />
                      </div>
                      <span className="font-bold text-leaf-50">SeedSense AI</span>
                    </div>

                    <div className="relative">
                      <button
                        onClick={() => setDropdown((v) => !v)}
                        className="flex items-center gap-1 rounded-full border border-lime-400/30 bg-lime-400/10 px-3 py-1 text-xs font-semibold text-lime-400 hover:bg-lime-400/15"
                      >
                        <MapPin size={12} /> {stateName}
                      </button>
                      <AnimatePresence>
                        {dropdown && (
                          <motion.ul
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            className="thin-scroll absolute right-0 top-full z-10 mt-2 max-h-72 w-48 overflow-y-auto rounded-xl border border-leaf-500/25 bg-moss-900/95 p-1 text-xs shadow-3d-lift backdrop-blur-xl"
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
                                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left font-semibold transition ${
                                    s === stateName
                                      ? 'bg-lime-400/15 text-lime-400'
                                      : 'text-leaf-100/85 hover:bg-moss-800'
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

                  <div className="mt-4">
                    <h3 className="font-display text-lg font-bold text-leaf-50">
                      🌱 Climate Risk Index
                    </h3>
                    <p className="text-[12px] text-leaf-100/50">
                      Based on {data.month} climate patterns
                    </p>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-2">
                    <Metric label="Drought" value={data.drought} icon={<Flame size={12} />} color="#fbbf24" />
                    <Metric label="Flood"   value={data.flood}   icon={<Droplets size={12} />} color="#38bdf8" />
                    <div className="flex flex-col justify-center rounded-xl border border-leaf-500/15 bg-moss-950/60 px-3 py-2">
                      <div className="text-[11px] font-semibold uppercase text-leaf-100/50">Overall</div>
                      <div className="font-display text-base font-extrabold" style={{ color: RISK_COLOR[data.overall] }}>
                        {data.overall.toUpperCase()}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 flex items-start gap-2 rounded-xl border border-sky-400/20 bg-sky-500/5 p-3">
                    <Brain size={14} className="mt-0.5 shrink-0 text-sky-400" />
                    <p className="text-[12px] leading-snug text-leaf-100/85">{data.reason}</p>
                  </div>

                  <div className="mt-2 flex items-start gap-2 rounded-xl border border-amber-400/20 bg-amber-500/5 p-3">
                    <Lightbulb size={14} className="mt-0.5 shrink-0 text-amber-400" />
                    <p className="text-[12px] leading-snug text-leaf-100/85">{data.advice}</p>
                  </div>
                </div>
              </LiquidGlass>
            </Tilt3DCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Metric({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}) {
  const C = 2 * Math.PI * 18;
  const offset = C - (value / 100) * C;

  return (
    <div className="rounded-xl border border-leaf-500/15 bg-moss-950/60 p-2.5">
      <div className="flex items-center gap-1 text-[11px] font-semibold" style={{ color }}>
        {icon} {label}
      </div>
      <div className="mt-1 flex items-center justify-between">
        <div className="font-display text-xl font-bold text-leaf-50">
          <AnimatedCounter value={value} formatter={(n) => `${Math.round(n)}%`} />
        </div>
        <svg width="42" height="42" viewBox="0 0 42 42">
          <circle cx="21" cy="21" r="18" stroke="rgba(132, 204, 22, 0.12)" strokeWidth="3" fill="none" />
          <motion.circle
            cx="21"
            cy="21"
            r="18"
            stroke={color}
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
            strokeDasharray={C}
            initial={{ strokeDashoffset: C }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            transform="rotate(-90 21 21)"
            style={{ filter: `drop-shadow(0 0 4px ${color})` }}
          />
        </svg>
      </div>
    </div>
  );
}
