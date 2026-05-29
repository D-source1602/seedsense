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
   3 tabs: pH · Irrigation · Seed Rate
   ════════════════════════════════════════════════════════ */
export default function CalculatorWidget() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>('ph');
  const [showHint, setShowHint] = useState(false);

  // pulse the FAB once after a few seconds (parity with original notif dot)
  useEffect(() => {
    const t = setTimeout(() => setShowHint(true), 2500);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      {/* ── Floating Action Button ── */}
      <motion.button
        onClick={() => {
          setOpen((v) => !v);
          setShowHint(false);
        }}
        whileHover={{ scale: 1.08, y: -2 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open SeedSense farm calculator"
        className="fixed bottom-6 right-6 z-[2147483647] grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-leaf-500 to-leaf-700 text-white shadow-leaf"
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
          <span className="absolute right-0 top-0 h-3 w-3 rounded-full border-2 border-white bg-rose-500 animate-pulse" />
        )}
      </motion.button>

      {/* ── Panel ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.92 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-24 right-6 z-[2147483646] flex max-h-[calc(100vh-7rem)] w-[400px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl bg-cream shadow-2xl ring-1 ring-leaf-200"
          >
            {/* Header */}
            <header className="relative overflow-hidden bg-gradient-to-br from-leaf-700 via-leaf-800 to-leaf-900 p-4 text-white">
              <div className="pointer-events-none absolute -right-6 -top-6 h-32 w-32 rounded-full bg-wheat-300/20 blur-2xl" />
              <div className="relative flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-leaf-300/20 ring-2 ring-white/15 backdrop-blur">
                  <Sparkles className="text-wheat-300" size={20} />
                </div>
                <div className="flex-1">
                  <div className="font-display text-lg font-bold leading-none">
                    SeedSenseCalc
                  </div>
                  <div className="mt-1 flex items-center gap-1.5 text-[11px] text-leaf-100/80">
                    <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                    Indian Farm Calculator
                  </div>
                </div>
              </div>
              <div className="relative mt-3 flex flex-wrap gap-1">
                <span className="pill bg-white/10 text-white">🇮🇳 India Data</span>
                <span className="pill bg-white/10 text-white">🧮 3 Calculators</span>
                <span className="pill bg-white/10 text-white">⚡ Free</span>
              </div>
            </header>

            {/* Tab bar */}
            <nav className="flex border-b border-leaf-100 bg-white">
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

            {/* Panel body */}
            <div className="thin-scroll flex-1 overflow-y-auto p-4">
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

            <footer className="border-t border-leaf-100 bg-white py-2 text-center text-[10px] text-leaf-700/50">
              SeedSenseCalc · Made for Indian Farmers
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ─── Reusable building blocks ─────────────────────────── */
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
      className={`flex flex-1 items-center justify-center gap-1.5 px-3 py-3 text-xs font-semibold transition-all ${
        active
          ? 'border-b-2 border-leaf-600 text-leaf-700'
          : 'border-b-2 border-transparent text-leaf-700/50 hover:text-leaf-700'
      }`}
    >
      {children}
    </button>
  );
}

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
    <section className="rounded-xl border border-leaf-100 bg-white p-4 shadow-sm">
      <h3 className="mb-3 flex items-center gap-2 border-b border-leaf-100 pb-2 text-sm font-bold text-leaf-700">
        {icon} {title}
      </h3>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] font-medium text-leaf-700/70">
        {label}
      </span>
      {children}
    </label>
  );
}

const inputClass =
  'w-full rounded-lg border border-leaf-200 bg-leaf-50/40 px-3 py-2 text-sm text-leaf-900 outline-none transition focus:border-leaf-400 focus:ring-2 focus:ring-leaf-300/40';

function Select({
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
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${inputClass} appearance-none pr-9`}
      >
        {children}
      </select>
      <ChevronDown
        size={14}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-leaf-700/60"
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
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-leaf-100/60 p-3"
    >
      <div className="mb-1 text-[11px] font-semibold text-leaf-700">📊 {title}</div>
      <div className="font-display text-lg font-bold leading-tight text-leaf-800">
        {value}
      </div>
      {detail && (
        <pre className="mt-2 whitespace-pre-line border-t border-emerald-200/60 pt-2 text-[11.5px] leading-relaxed text-leaf-900/85">
          {detail}
        </pre>
      )}
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
      className="mt-1 w-full rounded-lg bg-gradient-to-br from-leaf-500 to-leaf-700 py-2.5 text-sm font-bold text-white shadow-md transition hover:shadow-lg"
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
        detail: `To raise pH ${curN} → ${ideal} for ${crop} on ${areaN} ha\nEstimated cost: ₹${cost.toLocaleString('en-IN')}\nApply 2–3 weeks before sowing, mix into top 15 cm of soil.`,
      });
    } else {
      const s = (Math.abs(diff) * 200 * areaN).toFixed(0);
      const cost = Math.round(parseFloat(s) * 35);
      setResult({
        value: `${s} kg of Gypsum / Sulphur`,
        detail: `To lower pH ${curN} → ${ideal} for ${crop} on ${areaN} ha\nEstimated cost: ₹${cost.toLocaleString('en-IN')}\nApply 3–4 weeks before sowing. Retest pH after 6 weeks.`,
      });
    }
  }

  return (
    <CardShell title="Soil pH Correction" icon="🧪">
      <Field label="Current Soil pH">
        <input
          type="number"
          value={cur}
          step="0.1"
          min="3"
          max="10"
          placeholder="e.g. 5.2"
          onChange={(e) => setCur(e.target.value)}
          className={inputClass}
        />
      </Field>

      <Field label="Crop to Grow">
        <Select value={crop} onChange={setCrop}>
          <option value="">-- Select Crop --</option>
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
        </Select>
      </Field>

      <Field label="Soil Type">
        <Select value={soil} onChange={setSoil}>
          <option value="sandy">Sandy / Desert (Rajasthan, Coastal)</option>
          <option value="loamy">Loamy / Alluvial (UP, Punjab, Bihar)</option>
          <option value="clay">Clay / Black Cotton (Maharashtra, MP, Gujarat)</option>
        </Select>
      </Field>

      <Field label="Field Area (Hectares)">
        <input
          type="number"
          value={area}
          step="0.1"
          min="0.1"
          placeholder="e.g. 2.5"
          onChange={(e) => setArea(e.target.value)}
          className={inputClass}
        />
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
        `≈ ${Math.round(L / (areaN * 2.47)).toLocaleString('en-IN')} litres/acre/day\n` +
        `≈ ${Math.round(L / (areaN * 20)).toLocaleString('en-IN')} litres/bigha/day`,
    });
  }

  return (
    <CardShell title="Irrigation Water Requirement" icon="💧">
      <Field label="Crop">
        <Select value={crop} onChange={setCrop}>
          <option value="rice">Rice (8–10 mm/day)</option>
          <option value="wheat">Wheat (5–6 mm/day)</option>
          <option value="cotton">Cotton (6–8 mm/day)</option>
          <option value="sugarcane">Sugarcane (8–10 mm/day)</option>
          <option value="maize">Maize (5–7 mm/day)</option>
          <option value="groundnut">Groundnut (4–5 mm/day)</option>
          <option value="vegetables">Vegetables (4–6 mm/day)</option>
          <option value="pulses">Pulses (3–5 mm/day)</option>
        </Select>
      </Field>
      <Field label="Irrigation Method">
        <Select value={meth} onChange={setMeth}>
          <option value="drip">Drip Irrigation (90% efficient)</option>
          <option value="sprinkler">Sprinkler (75% efficient)</option>
          <option value="flood">Flood / Surface (50% efficient)</option>
        </Select>
      </Field>
      <Field label="Field Area (Hectares)">
        <input
          type="number"
          value={area}
          step="0.1"
          min="0.1"
          placeholder="e.g. 1.5"
          onChange={(e) => setArea(e.target.value)}
          className={inputClass}
        />
      </Field>
      <Field label="Season">
        <Select value={seas} onChange={setSeas}>
          <option value="summer">Summer / Zaid (peak demand)</option>
          <option value="kharif">Kharif / Monsoon (25% rain offset)</option>
          <option value="rabi">Rabi / Winter (15% demand reduction)</option>
        </Select>
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
        <Select value={crop} onChange={setCrop}>
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
        </Select>
      </Field>
      <Field label="Field Area (Hectares)">
        <input
          type="number"
          value={area}
          step="0.1"
          min="0.1"
          placeholder="e.g. 3.0"
          onChange={(e) => setArea(e.target.value)}
          className={inputClass}
        />
      </Field>
      <Field label="Seed Germination % (default 85%)">
        <input
          type="number"
          value={germ}
          step="1"
          min="50"
          max="100"
          placeholder="85"
          onChange={(e) => setGerm(e.target.value)}
          className={inputClass}
        />
      </Field>

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
