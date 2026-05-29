import type { Crop } from '../types';

/** Detailed crop database (image, harvest time, cultivation steps). */
export const CROP_DATABASE: Record<string, Crop> = {
  Rice: {
    name: 'Rice',
    image:
      'https://images.pexels.com/photos/1459339/pexels-photo-1459339.jpeg?auto=compress&cs=tinysrgb&w=600',
    harvestTime: '120-150 days',
    steps: [
      'Prepare the field by plowing and leveling',
      'Soak seeds for 24 hours before sowing',
      'Transplant seedlings after 25-30 days',
      'Maintain water level at 2-3 inches',
      'Apply fertilizers at regular intervals',
      'Control weeds and pests regularly',
      'Harvest when grains turn golden yellow',
    ],
    soilTypes: ['Clay', 'Loamy', 'Alluvial'],
    climate: 'Tropical, Subtropical',
  },
  Wheat: {
    name: 'Wheat',
    image:
      'https://images.pexels.com/photos/326082/pexels-photo-326082.jpeg?auto=compress&cs=tinysrgb&w=600',
    harvestTime: '110-130 days',
    steps: [
      'Prepare field with deep plowing',
      'Apply organic manure before sowing',
      'Sow seeds at proper depth (3-4 cm)',
      'Ensure adequate irrigation',
      'Apply nitrogen fertilizer in splits',
      'Monitor for diseases and pests',
      'Harvest when moisture content is 12-14%',
    ],
    soilTypes: ['Loamy', 'Clay Loam', 'Sandy Loam'],
    climate: 'Temperate, Semi-arid',
  },
  Sugarcane: {
    name: 'Sugarcane',
    image:
      'https://images.pexels.com/photos/8969226/pexels-photo-8969226.jpeg?auto=compress&cs=tinysrgb&w=600',
    harvestTime: '10-12 months',
    steps: [
      'Select healthy seed canes',
      'Prepare furrows 4-5 feet apart',
      'Plant cane sets in furrows',
      'Provide regular irrigation',
      'Apply fertilizers as per soil test',
      'Earthing up after 45-60 days',
      'Harvest when sugar content is maximum',
    ],
    soilTypes: ['Loamy', 'Clay Loam', 'Red Soil'],
    climate: 'Tropical, Subtropical',
  },
  Cotton: {
    name: 'Cotton',
    image:
      'https://images.pexels.com/photos/6069112/pexels-photo-6069112.jpeg?auto=compress&cs=tinysrgb&w=600',
    harvestTime: '160-200 days',
    steps: [
      'Prepare field with deep plowing',
      'Apply pre-plant fertilizers',
      'Sow seeds at recommended spacing',
      'Provide irrigation at critical stages',
      'Monitor for bollworm and other pests',
      'Apply growth regulators if needed',
      'Hand pick cotton when bolls open',
    ],
    soilTypes: ['Black Cotton', 'Alluvial', 'Red Soil'],
    climate: 'Semi-arid, Subtropical',
  },
  Maize: {
    name: 'Maize',
    image:
      'https://images.pexels.com/photos/547263/pexels-photo-547263.jpeg?auto=compress&cs=tinysrgb&w=600',
    harvestTime: '90-120 days',
    steps: [
      'Prepare field with proper tillage',
      'Apply basal fertilizers',
      'Sow seeds at 2-3 cm depth',
      'Maintain proper plant population',
      'Provide irrigation at critical stages',
      'Control weeds mechanically or chemically',
      'Harvest when kernels reach physiological maturity',
    ],
    soilTypes: ['Loamy', 'Sandy Loam', 'Clay Loam'],
    climate: 'Temperate, Subtropical',
  },
  Tomato: {
    name: 'Tomato',
    image:
      'https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg?auto=compress&cs=tinysrgb&w=600',
    harvestTime: '70-90 days',
    steps: [
      'Prepare nursery beds for seedlings',
      'Transplant 4-5 week old seedlings',
      'Provide support with stakes or cages',
      'Water regularly but avoid waterlogging',
      'Apply fertilizers at regular intervals',
      'Prune suckers and lower leaves',
      'Harvest fruits when they turn red',
    ],
    soilTypes: ['Loamy', 'Sandy Loam', 'Well-drained'],
    climate: 'Temperate, Subtropical',
  },
  Onion: {
    name: 'Onion',
    image:
      'https://images.pexels.com/photos/1323712/pexels-photo-1323712.jpeg?auto=compress&cs=tinysrgb&w=600',
    harvestTime: '120-150 days',
    steps: [
      'Prepare raised beds for good drainage',
      'Transplant seedlings at proper spacing',
      'Provide light but frequent irrigation',
      'Apply fertilizers in split doses',
      'Keep field weed-free',
      'Stop irrigation 2 weeks before harvest',
      'Harvest when tops fall over and dry',
    ],
    soilTypes: ['Sandy Loam', 'Loamy', 'Well-drained'],
    climate: 'Temperate, Semi-arid',
  },
  Potato: {
    name: 'Potato',
    image:
      'https://images.pexels.com/photos/144248/potatoes-vegetables-erdfrucht-bio-144248.jpeg?auto=compress&cs=tinysrgb&w=600',
    harvestTime: '90-120 days',
    steps: [
      'Prepare field with deep plowing',
      'Cut seed tubers with 2-3 eyes',
      'Plant tubers in furrows',
      'Earth up plants 2-3 times',
      'Provide irrigation as needed',
      'Apply fertilizers in splits',
      'Harvest when plants start yellowing',
    ],
    soilTypes: ['Sandy Loam', 'Loamy', 'Well-drained'],
    climate: 'Temperate, Cool',
  },
};

/** State -> top 5 recommended crops. */
export const STATE_CROP_MAPPING: Record<string, string[]> = {
  Punjab:               ['Wheat', 'Rice', 'Maize', 'Cotton', 'Sugarcane'],
  Haryana:              ['Wheat', 'Rice', 'Maize', 'Cotton', 'Sugarcane'],
  'Uttar Pradesh':      ['Wheat', 'Rice', 'Sugarcane', 'Potato', 'Maize'],
  Bihar:                ['Rice', 'Wheat', 'Maize', 'Sugarcane', 'Potato'],
  'West Bengal':        ['Rice', 'Potato', 'Maize', 'Sugarcane', 'Wheat'],
  Maharashtra:          ['Cotton', 'Sugarcane', 'Rice', 'Wheat', 'Onion'],
  Gujarat:              ['Cotton', 'Wheat', 'Rice', 'Sugarcane', 'Potato'],
  Rajasthan:            ['Wheat', 'Maize', 'Cotton', 'Rice', 'Potato'],
  'Madhya Pradesh':     ['Wheat', 'Rice', 'Cotton', 'Maize', 'Sugarcane'],
  Karnataka:            ['Rice', 'Cotton', 'Sugarcane', 'Maize', 'Tomato'],
  'Andhra Pradesh':     ['Rice', 'Cotton', 'Sugarcane', 'Maize', 'Tomato'],
  'Tamil Nadu':         ['Rice', 'Sugarcane', 'Cotton', 'Maize', 'Tomato'],
  Kerala:               ['Rice', 'Sugarcane', 'Tomato', 'Maize', 'Potato'],
  Odisha:               ['Rice', 'Maize', 'Sugarcane', 'Cotton', 'Potato'],
  Telangana:            ['Rice', 'Cotton', 'Maize', 'Sugarcane', 'Tomato'],
  Assam:                ['Rice', 'Maize', 'Sugarcane', 'Potato', 'Tomato'],
  Jharkhand:            ['Rice', 'Maize', 'Wheat', 'Potato', 'Sugarcane'],
  Chhattisgarh:         ['Rice', 'Maize', 'Wheat', 'Sugarcane', 'Cotton'],
  'Himachal Pradesh':   ['Wheat', 'Maize', 'Rice', 'Potato', 'Tomato'],
  Uttarakhand:          ['Wheat', 'Rice', 'Maize', 'Potato', 'Sugarcane'],
  Goa:                  ['Rice', 'Sugarcane', 'Tomato', 'Maize', 'Potato'],
  Manipur:              ['Rice', 'Maize', 'Potato', 'Tomato', 'Sugarcane'],
  Meghalaya:            ['Rice', 'Maize', 'Potato', 'Tomato', 'Wheat'],
  Mizoram:              ['Rice', 'Maize', 'Potato', 'Tomato', 'Sugarcane'],
  Nagaland:             ['Rice', 'Maize', 'Potato', 'Tomato', 'Wheat'],
  Sikkim:               ['Rice', 'Maize', 'Wheat', 'Potato', 'Tomato'],
  Tripura:              ['Rice', 'Maize', 'Potato', 'Sugarcane', 'Tomato'],
  'Arunachal Pradesh':  ['Rice', 'Maize', 'Potato', 'Wheat', 'Tomato'],
  Delhi:                ['Wheat', 'Rice', 'Maize', 'Potato', 'Tomato'],
  Chandigarh:           ['Wheat', 'Rice', 'Maize', 'Potato', 'Tomato'],
  Puducherry:           ['Rice', 'Sugarcane', 'Cotton', 'Maize', 'Tomato'],
  'Jammu and Kashmir':  ['Wheat', 'Rice', 'Maize', 'Potato', 'Tomato'],
  Ladakh:               ['Wheat', 'Potato', 'Tomato', 'Maize', 'Rice'],
  'Andaman & Nicobar':  ['Rice', 'Sugarcane', 'Tomato', 'Maize', 'Potato'],
  Lakshadweep:          ['Rice', 'Tomato', 'Potato', 'Maize', 'Sugarcane'],
  'Daman & Diu':        ['Rice', 'Cotton', 'Sugarcane', 'Tomato', 'Maize'],
};

/** State -> primary soil type. */
export const STATE_SOIL_MAPPING: Record<string, string> = {
  Punjab:               'Alluvial Soil',
  Haryana:              'Alluvial Soil',
  'Uttar Pradesh':      'Alluvial Soil',
  Bihar:                'Alluvial Soil',
  'West Bengal':        'Alluvial Soil',
  Maharashtra:          'Black Cotton Soil',
  Gujarat:              'Black Cotton Soil',
  Rajasthan:            'Arid Soil',
  'Madhya Pradesh':     'Black Cotton Soil',
  Karnataka:            'Red Soil',
  'Andhra Pradesh':     'Red Soil',
  'Tamil Nadu':         'Red Soil',
  Kerala:               'Laterite Soil',
  Odisha:               'Red & Laterite Soil',
  Telangana:            'Red Soil',
  Assam:                'Alluvial Soil',
  Jharkhand:            'Red Soil',
  Chhattisgarh:         'Red Soil',
  'Himachal Pradesh':   'Mountain Soil',
  Uttarakhand:          'Mountain Soil',
  Goa:                  'Laterite Soil',
  Manipur:              'Hill Soil',
  Meghalaya:            'Hill Soil',
  Mizoram:              'Hill Soil',
  Nagaland:             'Hill Soil',
  Sikkim:               'Mountain Soil',
  Tripura:              'Hill Soil',
  'Arunachal Pradesh':  'Mountain Soil',
  Delhi:                'Alluvial Soil',
  Chandigarh:           'Alluvial Soil',
  Puducherry:           'Alluvial Soil',
  'Jammu and Kashmir':  'Mountain Soil',
  Ladakh:               'Cold Desert Soil',
  'Andaman & Nicobar':  'Tropical Soil',
  Lakshadweep:          'Coral Soil',
  'Daman & Diu':        'Coastal Soil',
};

/** Realistic mandi price ranges (₹ / Quintal). */
const PRICE_RANGES: Record<string, [number, number]> = {
  Rice:      [1800, 2200],
  Wheat:     [2000, 2400],
  Sugarcane: [280, 320],
  Cotton:    [5500, 6500],
  Maize:     [1600, 2000],
  Tomato:    [800, 1500],
  Onion:     [1200, 2000],
  Potato:    [800, 1200],
};

export function generateMarketPrice(cropName: string): number {
  const range = PRICE_RANGES[cropName] ?? [1000, 2000];
  const base = range[0] + Math.random() * (range[1] - range[0]);
  const fluctuation = (Math.random() - 0.5) * 200;
  return Math.round(base + fluctuation);
}

export function getRecommendedCrops(stateName: string): string[] {
  return (
    STATE_CROP_MAPPING[stateName] ??
    ['Rice', 'Wheat', 'Maize', 'Potato', 'Tomato']
  );
}

export function getSoilType(stateName: string): string {
  return STATE_SOIL_MAPPING[stateName] ?? 'Mixed Soil';
}
