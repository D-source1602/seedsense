export type Coords = {
  lat: number;
  lon: number;
};

export type LocationSelection = Coords & {
  name: string;
};

export type StateInfo = {
  name: string;
  lat: number;
  lon: number;
};

export type RiskLevel = 'low' | 'medium' | 'high' | 'severe';

export type StateRisk = {
  drought: number;
  flood: number;
  reason: string;
  advice: string;
};

export type MonthMultiplier = {
  drought: number;
  flood: number;
};

export type Crop = {
  name: string;
  image: string;
  harvestTime: string;
  steps: string[];
  soilTypes: string[];
  climate: string;
};

export type WeatherSummary = {
  temperature: number;
  humidity: number;
  rainfall: number;
};

export type SoilSummary = {
  type: string;
  ph: string;
  fertility: string;
};
