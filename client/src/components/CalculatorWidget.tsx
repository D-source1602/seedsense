import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Calculator,
  ChevronDown,
  Droplets,
  FlaskConical,
  Sparkles,
  Sprout,
  X,
} from 'lucide-react';

import LiquidGlass from './LiquidGlass';
import {
  CROP_PH,
  CROP_WATER,
  IRRIG_EFFICIENCY,
  SEASON_SCALE,
  SEED_DB,
  SOIL_BUFFER,
  type SeedDef,
} from '../data/calculator';

type Tab = 'ph' | 'water' | 'seed';

/* ════════════════════════════════════════════════════════
   FLOATING CALCULATOR WIDGET
   pH · Irrigation · Seed Rate (perfect alignment grid)
   ════════════════════════════════════════════════════════ */
export default function CalculatorWidget() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>('ph');
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowHint(true), 2500);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      {/* ── FAB ──────────────────────────────────────── */}
      <motion.button
        onClick={() => {
          setOpen((v) => !v);
          setShowHint(false);
        }}
        whileHover={{ scale: 1.1, y: -3 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open SeedSense farm calculator"
        className="pulse-glow fixed bottom-6 right-6 z-[2147483647] grid h-14 w-14 place-items-center rounded-full text-leaf-950 shadow-glow-lg"
        style={{
          background:
            'linear-gradient(135deg, #a3e635 0%, #46c468 50%, #22a04a 100%)',
        }}
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.span
              key="x"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X size={22} />
            </motion.span>
          ) : (
            <motion.span
              key="calc"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Calculator size={22} />
            </motion.span>
          )}
        </AnimatePresence>
        {showHint && !open && (
          <span className="absolute right-0 top-0 h-3 w-3 rounded-full border-2 border-leaf-950 bg-saffron-500 shadow-glow-amber animate-pulse" />
        )}
      </motion.button>

      {/* ── PANEL ──────────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.92, rotateX: -10 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
            exit={{ opacity: 0, y: 24, scale: 0.92, rotateX: -10 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-24 right-6 z-[2147483646] w-[420px] max-w-[calc(100vw-2rem)] perspective-1500"
          >
            <LiquidGlass
              rim
              className="relative flex max-h-[calc(100vh-7rem)] flex-col overflow-hidden rounded-2xl"
            >
              {/* Header — fixed 96px tall, padding 16px, gap aligned */}
              <header className="relative flex items-center gap-3 border-b border-white/8 bg-gradient-to-br from-moss-900/70 via-leaf-900/70 to-moss-950/70 px-5 py-4">
                <div className="pointer-events-none absolute -right-6 -top-6 h-32 w-32 rounded-full bg-lime-400/20 blur-3xl" />
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-lime-400 to-leaf-700 text-leaf-950 ring-2 ring-lime-400/30 shadow-glow">
                  <Sparkles size={20} />
                </div>
                <div className="flex-1 leading-tight">
                  <div className="font-display text-lg font-bold text-leaf-50">
                    SeedSenseCalc
                  </div>
                  <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-leaf-100/70">
                    <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-lime-400 shadow-glow" />
                    Indian Farm Calculator
                  </div>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="grid h-8 w-8 place-items-center rounded-lg bg-white/5 text-leaf-100/70 transition hover:bg-white/10 hover:text-leaf-50"
                  aria-label="Close calculator"
                >
                  <X size={16} />
                </button>
              </header>

              {/* Capability strip — perfectly aligned 3-col grid */}
              <div className="grid grid-cols-3 gap-2 border-b border-white/8 px-5 py-3">
                <CapPill icon="🇮🇳" label="India Data" />
                <CapPill icon="🧮" label="3 Calculators" />
                <CapPill icon="⚡" label="Free Forever" />
              </div>

              {/* Tab bar — equal-flex, layoutId underline */}
              <nav className="relative flex items-stretch border-b border-white/8 bg-moss-950/40">
                <TabBtn active={tab === 'ph'} onClick={() => setTab('ph')}>
                  <FlaskConical size={14} /> pH Fixer
                </TabBtn>
                <TabBtn active={tab === 'water'} onClick={() => setTab('water')}>
                  <Droplets size={14} /> Irrigation
                </TabBtn>
                <TabBtn active={tab === 'seed'} onClick={() => setTab('seed')}>
                  <Sprout size={14} /> Seed Rate
                </TabBtn>
              </nav>

              {/* Body — consistent 20px padding, vertical 16px gap */}
              <div className="thin-scroll flex-1 overflow-y-auto px-5 py-5">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={tab}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{ duration: 0.25 }}
                  >
                    {tab === 'ph' && <PhPanel />}
                    {tab === 'water' && <WaterPanel />}
                    {tab === 'seed' && <SeedPanel />}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Footer */}
              <footer className="flex items-center justify-center gap-1.5 border-t border-white/8 bg-moss-950/60 px-5 py-2.5 text-[10px] font-medium uppercase tracking-wider text-leaf-100/40">
                <Sprout size={10} className="text-lime-400/70" />
                SeedSenseCalc · Made for Indian Farmers
              </footer>
            </LiquidGlass>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ─────────── BUILDING BLOCKS ─────────── */

function CapPill({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="flex h-8 items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2 text-[11px] font-semibold text-leaf-100/85 backdrop-blur">
      <span>{icon}</span>
      <span>{label}</span>
    </div>
  );
}

function TabBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="liquid-tab"
      data-active={active}
      type="button"
    >
      {children}
      {active && (
        <motion.span
          layoutId="calcTabUnderline"
          className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-gradient-to-r from-lime-400 via-leaf-300 to-lime-400 shadow-glow"
          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
        />
      )}
    </button>
  );
}

/** Section card inside a panel — uses .liquid-glass-soft for the second layer. */
function CardShell({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="liquid-glass-soft overflow-hidden rounded-xl">
      <h3 className="flex items-center gap-2 border-b border-white/8 px-4 py-3 text-sm font-bold text-lime-400">
        <span className="grid h-6 w-6 place-items-center text-base">{icon}</span>
        <span>{title}</span>
      </h3>
      <div className="space-y-3 px-4 py-4">{children}</div>
    </section>
  );
}

/** Aligned form field — fixed label height, fixed input height = 44px. */
function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-leaf-100/55">
          {label}
        </span>
        {hint && (
          <span className="text-[10px] text-leaf-100/35">{hint}</span>
        )}
      </div>
      {children}
    </label>
  );
}

function LiquidSelect({
  value,
  onChange,
  children,
}: {
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <select
        className="liquid-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {children}
      </select>
      <ChevronDown
        size={14}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-leaf-100/55"
      />
    </div>
  );
}

function ResultBox({
  show,
  title,
  value,
  detail,
}: {
  show: boolean;
  title: string;
  value: string;
  detail: string;
}) {
  if (!show) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-xl border border-lime-400/40 bg-gradient-to-br from-leaf-500/15 via-moss-900/70 to-moss-950 p-4 shadow-glow"
    >
      <span className="liquid-shine" aria-hidden />
      <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-lime-400/30 blur-3xl" />
      <div className="relative">
        <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-lime-400">
          <Sparkles size={11} /> {title}
        </div>
        <div className="font-display text-xl font-bold leading-tight text-leaf-50">
          {value}
        </div>
        {detail && (
          <pre className="mt-3 whitespace-pre-line border-t border-lime-400/20 pt-3 font-sans text-[12px] leading-relaxed text-leaf-100/85">
            {detail}
          </pre>
        )}
      </div>
    </motion.div>
  );
}

function CalcButton({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.98 }}
      whileHover={{ y: -1 }}
      type="button"
      className="btn-primary mt-1 h-11 w-full text-sm"
    >
      {children}
    </motion.button>
  );
}

/* ════════════════════════════════════════════════════════
   pH PANEL
   ════════════════════════════════════════════════════════ */
function PhPanel() {
  const [cur, setCur] = useState('');
  const [crop, setCrop] = useState('');
  const [soil, setSoil] = useState('loamy');
  const [area, setArea] = useState('');
  const [result, setResult] = useState<{ value: string; detail: string } | null>(null);

  function calc() {
    const curN = parseFloat(cur);
    const areaN = parseFloat(area);
    if (!curN || !crop || !areaN) {
      setResult({ value: '⚠️ Please fill in all fields.', detail: '' });
      return;
    }
    const ideal = CROP_PH[crop].ideal;
    const diff = ideal - curN;
    const buf = SOIL_BUFFER[soil];

    if (Math.abs(diff) < 0.2) {
      setResult({
        value: '✅ pH is already ideal!',
        detail: `Your soil pH ${curN} is perfect for ${crop}. No amendment needed.`,
      });
    } else if (diff > 0) {
      const lime = (diff * buf * areaN).toFixed(2);
      const cost = Math.round(parseFloat(lime) * 1800);
      setResult({
        value: `${lime} tonnes of Agricultural Lime`,
        detail:
          `To raise pH ${curN} → ${ideal} for ${crop} on ${areaN} ha\n` +
          `Estimated cost: ₹${cost.toLocaleString('en-IN')}\n` +
          `Apply 2–3 weeks before sowing, mix into top 15 cm of soil.`,
      });
    } else {
      const s = (Math.abs(diff) * 200 * areaN).toFixed(0);
      const cost = Math.round(parseFloat(s) * 35);
      setResult({
        value: `${s} kg of Gypsum / Sulphur`,
        detail:
          `To lower pH ${curN} → ${ideal} for ${crop} on ${areaN} ha\n` +
          `Estimated cost: ₹${cost.toLocaleString('en-IN')}\n` +
          `Apply 3–4 weeks before sowing. Retest pH after 6 weeks.`,
      });
    }
  }

  return (
    <CardShell title="Soil pH Correction" icon="🧪">
      {/* 2-column grid for the first row, full width below */}
      <div className="grid grid-cols-2 gap-3">
        <Field label="Current pH" hint="3.0 – 10.0">
          <input
            type="number"
            value={cur}
            step="0.1"
            min="3"
            max="10"
            placeholder="5.2"
            onChange={(e) => setCur(e.target.value)}
            className="liquid-input"
          />
        </Field>
        <Field label="Field Area" hint="hectares">
          <input
            type="number"
            value={area}
            step="0.1"
            min="0.1"
            placeholder="2.5"
            onChange={(e) => setArea(e.target.value)}
            className="liquid-input"
          />
        </Field>
      </div>

      <Field label="Crop to Grow">
        <LiquidSelect value={crop} onChange={setCrop}>
          <option value="">— Select crop —</option>
          <option value="rice">Rice (ideal 5.5–6.5)</option>
          <option value="wheat">Wheat (ideal 6.0–7.5)</option>
          <option value="cotton">Cotton (ideal 6.0–8.0)</option>
          <option value="sugarcane">Sugarcane (ideal 6.0–7.5)</option>
          <option value="maize">Maize (ideal 5.8–7.0)</option>
          <option value="groundnut">Groundnut (ideal 5.5–6.5)</option>
          <option value="mustard">Mustard (ideal 6.0–7.5)</option>
          <option value="pulses">Pulses / Dal (ideal 6.0–7.5)</option>
          <option value="soybean">Soybean (ideal 6.0–6.8)</option>
          <option value="potato">Potato (ideal 5.0–6.5)</option>
        </LiquidSelect>
      </Field>

      <Field label="Soil Type">
        <LiquidSelect value={soil} onChange={setSoil}>
          <option value="sandy">Sandy / Desert (Rajasthan, Coastal)</option>
          <option value="loamy">Loamy / Alluvial (UP, Punjab, Bihar)</option>
          <option value="clay">Clay / Black Cotton (MH, MP, GJ)</option>
        </LiquidSelect>
      </Field>

      <CalcButton onClick={calc}>⚗️ Calculate Amendment Needed</CalcButton>

      <ResultBox
        show={!!result}
        title="Soil Amendment Required"
        value={result?.value ?? ''}
        detail={result?.detail ?? ''}
      />
    </CardShell>
  );
}

/* ════════════════════════════════════════════════════════
   WATER PANEL
   ════════════════════════════════════════════════════════ */
function WaterPanel() {
  const [crop, setCrop] = useState('rice');
  const [meth, setMeth] = useState('drip');
  const [area, setArea] = useState('');
  const [seas, setSeas] = useState('summer');
  const [result, setResult] = useState<{ value: string; detail: string } | null>(null);

  function calc() {
    const areaN = parseFloat(area);
    if (!areaN) {
      setResult({ value: '⚠️ Please enter field area.', detail: '' });
      return;
    }
    const mm = CROP_WATER[crop].avg * SEASON_SCALE[seas];
    const L = (mm * areaN * 10000) / IRRIG_EFFICIENCY[meth];
    setResult({
      value: `${Math.round(L).toLocaleString('en-IN')} Litres / Day`,
      detail:
        `= ${(L / 1000).toFixed(1)} m³/day for ${areaN} ha of ${crop}\n` +
        `Season: ${seas} | Method: ${meth} (${IRRIG_EFFICIENCY[meth] * 100}% efficiency)\n` +
        `≈ ${Math.round(L / (areaN * 2.47)).toLocaleString('en-IN')} L/acre/day\n` +
        `≈ ${Math.round(L / (areaN * 20)).toLocaleString('en-IN')} L/bigha/day`,
    });
  }

  return (
    <CardShell title="Irrigation Water Requirement" icon="💧">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Crop">
          <LiquidSelect value={crop} onChange={setCrop}>
            <option value="rice">Rice</option>
            <option value="wheat">Wheat</option>
            <option value="cotton">Cotton</option>
            <option value="sugarcane">Sugarcane</option>
            <option value="maize">Maize</option>
            <option value="groundnut">Groundnut</option>
            <option value="vegetables">Vegetables</option>
            <option value="pulses">Pulses</option>
          </LiquidSelect>
        </Field>
        <Field label="Field Area" hint="hectares">
          <input
            type="number"
            value={area}
            step="0.1"
            min="0.1"
            placeholder="1.5"
            onChange={(e) => setArea(e.target.value)}
            className="liquid-input"
          />
        </Field>
      </div>

      <Field label="Irrigation Method">
        <LiquidSelect value={meth} onChange={setMeth}>
          <option value="drip">Drip Irrigation (90% efficient)</option>
          <option value="sprinkler">Sprinkler (75% efficient)</option>
          <option value="flood">Flood / Surface (50% efficient)</option>
        </LiquidSelect>
      </Field>

      <Field label="Season">
        <LiquidSelect value={seas} onChange={setSeas}>
          <option value="summer">Summer / Zaid (peak demand)</option>
          <option value="kharif">Kharif / Monsoon (rain offset)</option>
          <option value="rabi">Rabi / Winter (lower demand)</option>
        </LiquidSelect>
      </Field>

      <CalcButton onClick={calc}>💧 Calculate Water Needed</CalcButton>

      <ResultBox
        show={!!result}
        title="Daily Irrigation Requirement"
        value={result?.value ?? ''}
        detail={result?.detail ?? ''}
      />
    </CardShell>
  );
}

/* ════════════════════════════════════════════════════════
   SEED PANEL
   ════════════════════════════════════════════════════════ */
function SeedPanel() {
  const [crop, setCrop] = useState('rice_t');
  const [area, setArea] = useState('');
  const [germ, setGerm] = useState('85');
  const [result, setResult] = useState<{ value: string; detail: string } | null>(null);

  function calc() {
    const areaN = parseFloat(area);
    const germN = parseFloat(germ) || 85;
    if (!areaN) {
      setResult({ value: '⚠️ Please enter field area.', detail: '' });
      return;
    }
    const d: SeedDef = SEED_DB[crop];
    const adj =
      d.unit === 'g'
        ? (d.rate * areaN * (85 / germN)).toFixed(0)
        : (d.rate * areaN * (85 / germN)).toFixed(1);
    const cost =
      d.unit === 'g'
        ? Math.round((parseFloat(adj) / 1000) * d.cost)
        : Math.round(parseFloat(adj) * d.cost);

    setResult({
      value: d.unit === 'g' ? `${adj} grams` : `${adj} kg`,
      detail:
        `For ${areaN} ha at ${germN}% germination\n` +
        `Approx seed cost: ₹${cost.toLocaleString('en-IN')}\n` +
        `Recommended spacing: ${d.space}\n` +
        `💡 ${d.note}`,
    });
  }

  return (
    <CardShell title="Seed Rate per Hectare" icon="🌾">
      <Field label="Crop">
        <LiquidSelect value={crop} onChange={setCrop}>
          <option value="rice_t">Rice – Transplanted</option>
          <option value="rice_d">Rice – Direct Seeded</option>
          <option value="wheat">Wheat</option>
          <option value="maize">Maize (Hybrid)</option>
          <option value="bajra">Bajra / Pearl Millet</option>
          <option value="jowar">Jowar / Sorghum</option>
          <option value="cotton">Cotton (Hybrid / Bt)</option>
          <option value="groundnut">Groundnut</option>
          <option value="soybean">Soybean</option>
          <option value="mustard">Mustard / Rapeseed</option>
          <option value="arhar">Arhar / Tur Dal</option>
          <option value="moong">Moong Dal</option>
          <option value="urad">Urad Dal</option>
          <option value="onion">Onion</option>
          <option value="tomato">Tomato</option>
        </LiquidSelect>
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Field Area" hint="hectares">
          <input
            type="number"
            value={area}
            step="0.1"
            min="0.1"
            placeholder="3.0"
            onChange={(e) => setArea(e.target.value)}
            className="liquid-input"
          />
        </Field>
        <Field label="Germination" hint="percent">
          <input
            type="number"
            value={germ}
            step="1"
            min="50"
            max="100"
            placeholder="85"
            onChange={(e) => setGerm(e.target.value)}
            className="liquid-input"
          />
        </Field>
      </div>

      <CalcButton onClick={calc}>🌱 Calculate Seeds Needed</CalcButton>

      <ResultBox
        show={!!result}
        title="Seed Requirement"
        value={result?.value ?? ''}
        detail={result?.detail ?? ''}
      />
    </CardShell>
  );
}
