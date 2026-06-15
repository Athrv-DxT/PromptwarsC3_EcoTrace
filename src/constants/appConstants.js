/**
 * Centralized application constants.
 * Eliminates magic numbers and hardcoded configuration values.
 */

export const API_TIMEOUT_MS = 8000;
export const GEOLOCATION_TIMEOUT_MS = 5000;

export const DEFAULT_COORDINATES = {
  latitude: 28.6,
  longitude: 77.2,
  name: 'Delhi, IN'
};

export const GRID_FACTORS = {
  DEFAULT: 0.475,
  INDIA: 0.82,
  EUROPE: 0.233,
  NORTH_AMERICA: 0.386,
  EAST_ASIA: 0.555,
  SOUTHEAST_ASIA: 0.521,
  MIDDLE_EAST: 0.63,
  AFRICA: 0.481
};

export const FOOTPRINT_THRESHOLDS = {
  LOW: 4,
  MODERATE_MAX: 8
};

export const PM25_THRESHOLDS = {
  GOOD: 12,
  MODERATE: 35.4
};

export const CONTEXT_MULTIPLIERS = {
  FLIGHT: 1200,
  TREE: 21,
  PETROL_CAR: 0.21
};

export const SIMULATION_SAVINGS = {
  ev: 1200,
  plastic: 80,
  transit: 600,
  solar: 800
};

export const TIMELINE_MULTIPLIERS = {
  SIX_MONTHS: 0.5,
  ONE_YEAR: 1,
  FIVE_YEARS: 5
};

export const CAROUSEL_INTERVAL_MS = 5000;

export const LOGO_RAPID_CLICKS_LIMIT = 5;
export const HISTORY_LIMIT = 5;
export const DEFAULT_REDUCTION_GOAL = 20;

export const INITIAL_INPUTS = {
  carType: 'none',
  weeklyKm: 0,
  shortFlights: 0,
  longFlights: 0,
  publicTransitHours: 0,
  publicTransitType: 'bus',
  country: 'United Kingdom',
  monthlyKwh: 0,
  heatingType: 'none',
  monthlyGas: 0,
  dietType: 'vegan',
  monthlyClothes: 0,
  yearlyElectronics: 0
};

export const SAMPLE_POPULATE_DATA = {
  carType: 'petrol',
  weeklyKm: 200,
  shortFlights: 4,
  longFlights: 2,
  monthlyKwh: 350,
  heatingType: 'gas',
  monthlyGas: 400,
  dietType: 'omnivore',
  monthlyClothes: 3,
  yearlyElectronics: 2,
  country: 'United Kingdom',
  publicTransitHours: 10,
  publicTransitType: 'bus'
};

export const ENVIRONMENTAL_FACTS = [
  "The average person in India emits 1.9 tonnes CO2e/year — one of the lowest in the world",
  "Aviation is responsible for 3.5% of effective climate forcing despite carrying only 11% of passengers",
  "A plant-based diet for one year saves the equivalent of driving 8,000 km in a petrol car",
  "Renewable energy capacity surpassed coal globally for the first time in 2023",
  "The 1.5°C target requires global per-capita emissions to fall to 2.5 tonnes by 2030",
  "Extending a smartphone's life by just one extra year saves 70 kg CO2e — equivalent to 333 km of driving"
];

export const COUNTRIES_LIST = [
  'United Kingdom',
  'India',
  'United States',
  'Germany',
  'China',
  'Japan',
  'Brazil',
  'France',
  'South Africa',
  'Australia',
  'Canada'
];
