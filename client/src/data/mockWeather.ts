import type { Coords, SoilSummary, WeatherSummary } from '../types';
import { getSoilType } from './crops';

/**
 * Mock weather generator (parity with the original red.js).
 *
 * Roughly: hotter near the equator, randomized humidity / rainfall.
 */
export function generateMockWeather({ lat }: Coords): WeatherSummary {
  const baseTemp = Math.round(15 + (30 - Math.abs(lat)) * 0.8 + Math.random() * 10);
  const humidity = Math.round(40 + Math.random() * 40);
  const rainfall = Math.round(Math.random() * 50);
  return { temperature: baseTemp, humidity, rainfall };
}

export function generateMockPH(): string {
  return (6.0 + Math.random() * 2.5).toFixed(1);
}

export function generateMockFertility(): string {
  const levels = ['Low', 'Medium', 'High', 'Very High'];
  return levels[Math.floor(Math.random() * levels.length)];
}

export function buildSoilProfile(stateName: string): SoilSummary {
  return {
    type: getSoilType(stateName),
    ph: generateMockPH(),
    fertility: generateMockFertility(),
  };
}
