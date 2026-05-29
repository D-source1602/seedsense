/* ─── Soil pH correction data ──────────────────────────── */
export const CROP_PH: Record<string, { ideal: number }> = {
  rice:      { ideal: 6.0 },
  wheat:     { ideal: 6.5 },
  cotton:    { ideal: 7.0 },
  sugarcane: { ideal: 6.8 },
  maize:     { ideal: 6.5 },
  groundnut: { ideal: 6.0 },
  mustard:   { ideal: 6.5 },
  pulses:    { ideal: 6.5 },
  soybean:   { ideal: 6.4 },
  potato:    { ideal: 5.8 },
};

export const SOIL_BUFFER: Record<string, number> = {
  sandy: 0.5,
  loamy: 1.0,
  clay:  2.0,
};

/* ─── Irrigation water ──────────────────────────────────── */
export const CROP_WATER: Record<string, { avg: number }> = {
  rice:       { avg: 9 },
  wheat:      { avg: 5.5 },
  cotton:     { avg: 7 },
  sugarcane:  { avg: 9 },
  maize:      { avg: 6 },
  groundnut:  { avg: 4.5 },
  vegetables: { avg: 5 },
  pulses:     { avg: 4 },
};

export const IRRIG_EFFICIENCY: Record<string, number> = {
  drip:      0.90,
  sprinkler: 0.75,
  flood:     0.50,
};

export const SEASON_SCALE: Record<string, number> = {
  summer: 1.0,
  kharif: 0.75,
  rabi:   0.85,
};

/* ─── Seed rate ─────────────────────────────────────────── */
export type SeedDef = {
  rate: number;
  unit: 'kg' | 'g';
  cost: number;
  space: string;
  note: string;
};

export const SEED_DB: Record<string, SeedDef> = {
  rice_t:    { rate: 22,  unit: 'kg', cost: 60,   space: '20×15 cm',    note: 'Nursery: 500–600 g/m². Use certified seed.' },
  rice_d:    { rate: 45,  unit: 'kg', cost: 60,   space: '20×15 cm',    note: 'Pre-germinate seeds before direct seeding.' },
  wheat:     { rate: 112, unit: 'kg', cost: 30,   space: '22.5 cm rows', note: 'HD-2967, GW-496, PBW-343 popular varieties.' },
  maize:     { rate: 22,  unit: 'kg', cost: 280,  space: '60×25 cm',    note: 'Hybrid seed only — do NOT save for next season.' },
  bajra:     { rate: 4.5, unit: 'kg', cost: 120,  space: '45×15 cm',    note: 'Kharif crop. Very drought tolerant.' },
  jowar:     { rate: 11,  unit: 'kg', cost: 80,   space: '45×15 cm',    note: 'Dual purpose: grain + fodder.' },
  cotton:    { rate: 3.5, unit: 'kg', cost: 1200, space: '90×60 cm',    note: 'Buy certified Bt cotton. RCH-2, Bunny, Jackpot.' },
  groundnut: { rate: 90,  unit: 'kg', cost: 70,   space: '30×10 cm',    note: 'Shell just before sowing. Treat with Rhizobium.' },
  soybean:   { rate: 75,  unit: 'kg', cost: 65,   space: '45×5 cm',     note: 'Inoculate with Bradyrhizobium. JS-9305, NRC-37.' },
  mustard:   { rate: 5.5, unit: 'kg', cost: 90,   space: '30×15 cm',    note: 'Rabi crop, sow Oct–Nov. Pusa Bold, RH-30.' },
  arhar:     { rate: 17,  unit: 'kg', cost: 130,  space: '75×30 cm',    note: 'Mixed with soybean in MP/Maharashtra.' },
  moong:     { rate: 22,  unit: 'kg', cost: 120,  space: '30×10 cm',    note: 'Short duration 60–65 days.' },
  urad:      { rate: 22,  unit: 'kg', cost: 110,  space: '30×10 cm',    note: 'Kharif season. Fixes nitrogen naturally.' },
  onion:     { rate: 9,   unit: 'kg', cost: 200,  space: '15×10 cm',    note: 'Raise nursery first, transplant at 6 weeks.' },
  tomato:    { rate: 350, unit: 'g',  cost: 2500, space: '60×45 cm',    note: 'Nursery raised. Transplant at 25–30 days.' },
};
