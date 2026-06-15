// Source: IPCC AR6 WG3 Ch10, Table 10.5 (2023)
export const TRANSPORT = {
  PETROL_CAR_KG_PER_KM: 0.21,
  DIESEL_CAR_KG_PER_KM: 0.17,
  HYBRID_CAR_KG_PER_KM: 0.11,
  EV_KG_PER_KM: 0.05,
  SHORT_HAUL_FLIGHT_KG: 255,   // per return flight <3hrs, includes radiative forcing
  LONG_HAUL_FLIGHT_KG: 1200,  // per return flight >6hrs
  BUS_KG_PER_HR: 3.2,
  TRAIN_KG_PER_HR: 1.6,
};

// Source: UK DESNZ Conversion Factors 2023
export const HOME = {
  UK_GRID_KG_PER_KWH: 0.233,
  NATURAL_GAS_KG_PER_KWH: 0.183,
  HEAT_PUMP_KG_PER_KWH: 0.07,
};

// Source: Poore & Nemecek (2018), Science. doi:10.1126/science.aaq0216
export const DIET_ANNUAL_KG = {
  VEGAN: 1500,
  VEGETARIAN: 1700,
  PESCATARIAN: 2300,
  OMNIVORE: 2500,
  HEAVY_MEAT: 3300,
};

// Source: WRAP UK (2022), clothing lifecycle assessment
export const SHOPPING = {
  CLOTHING_ITEM_KG: 25,       // avg per new garment
  ELECTRONICS_ITEM_KG: 70,    // avg smartphone/laptop
};

// Regional grid factors to apply based on country's region/subregion
// Source: REST Countries API integration mapping
export const REGIONAL_GRID_FACTORS = {
  'Western Europe': 0.233,
  'Northern Europe': 0.233,
  'Southern Europe': 0.233,
  'South Asia': 0.82,          // India
  'North America': 0.386,
  'East Asia': 0.555,
  'Southeast Asia': 0.521,
  'Middle East': 0.63,
  'Africa': 0.481,
  'Default': 0.475             // global average
};
