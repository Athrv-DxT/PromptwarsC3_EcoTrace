import { useMemo } from 'react';
import { TRANSPORT, HOME, DIET_ANNUAL_KG, SHOPPING } from '../constants/emissionFactors';

/**
 * Core carbon emissions calculator.
 * Computes individual transit, home energy, diet, and shopping footprints.
 * 
 * @param {Object} inputs - Carbon inputs state object.
 * @param {number} gridFactor - Grid electricity emission factor.
 * @returns {{ breakdown: { transport: number, flights: number, home: number, diet: number, shopping: number }, totalKg: number, totalTonnes: number }} Footprint calculations.
 */
export function calculateCarbon(inputs, gridFactor) {
  // 1. TRANSPORT CALCULATION
  const carType = inputs.carType || 'none';
  const weeklyKm = Number(inputs.weeklyKm) || 0;
  const shortFlights = Number(inputs.shortFlights) || 0;
  const longFlights = Number(inputs.longFlights) || 0;
  const publicTransitHours = Number(inputs.publicTransitHours) || 0;
  const publicTransitType = inputs.publicTransitType || 'bus';

  let carFactor = 0;
  if (carType === 'petrol') carFactor = TRANSPORT.PETROL_CAR_KG_PER_KM;
  else if (carType === 'diesel') carFactor = TRANSPORT.DIESEL_CAR_KG_PER_KM;
  else if (carType === 'hybrid') carFactor = TRANSPORT.HYBRID_CAR_KG_PER_KM;
  else if (carType === 'ev') carFactor = TRANSPORT.EV_KG_PER_KM;

  const carEmissions = weeklyKm * 52 * carFactor;
  const flightEmissions = (shortFlights * TRANSPORT.SHORT_HAUL_FLIGHT_KG) + 
                          (longFlights * TRANSPORT.LONG_HAUL_FLIGHT_KG);

  let transitFactor = 0;
  if (publicTransitType === 'bus') transitFactor = TRANSPORT.BUS_KG_PER_HR;
  else if (publicTransitType === 'train') transitFactor = TRANSPORT.TRAIN_KG_PER_HR;
  else if (publicTransitType === 'both') transitFactor = (TRANSPORT.BUS_KG_PER_HR + TRANSPORT.TRAIN_KG_PER_HR) / 2;

  const transitEmissions = publicTransitHours * 52 * transitFactor;
  const transportTotal = carEmissions + flightEmissions + transitEmissions;

  // 2. HOME CALCULATION
  const monthlyKwh = Number(inputs.monthlyKwh) || 0;
  const heatingType = inputs.heatingType || 'none';
  const monthlyGas = Number(inputs.monthlyGas) || 0;

  const effectiveGridFactor = Number(gridFactor) !== undefined && !isNaN(Number(gridFactor)) ? Number(gridFactor) : HOME.UK_GRID_KG_PER_KWH;

  const electricityEmissions = monthlyKwh * 12 * effectiveGridFactor;

  let heatingEmissions = 0;
  if (heatingType === 'gas') {
    heatingEmissions = monthlyGas * 12 * HOME.NATURAL_GAS_KG_PER_KWH;
  } else if (heatingType === 'heatpump') {
    heatingEmissions = monthlyKwh * 12 * HOME.HEAT_PUMP_KG_PER_KWH;
  } else if (heatingType === 'electric') {
    heatingEmissions = monthlyKwh * 12 * effectiveGridFactor;
  }

  const homeTotal = electricityEmissions + heatingEmissions;

  // 3. DIET CALCULATION
  const dietType = (inputs.dietType || 'vegan').toUpperCase();
  const dietTotal = DIET_ANNUAL_KG[dietType] || DIET_ANNUAL_KG.VEGAN;

  // 4. SHOPPING CALCULATION
  const monthlyClothes = Number(inputs.monthlyClothes) || 0;
  const yearlyElectronics = Number(inputs.yearlyElectronics) || 0;

  const clothingEmissions = monthlyClothes * 12 * SHOPPING.CLOTHING_ITEM_KG;
  const electronicsEmissions = yearlyElectronics * SHOPPING.ELECTRONICS_ITEM_KG;
  const shoppingTotal = clothingEmissions + electronicsEmissions;

  // TOTALS
  const totalKg = transportTotal + homeTotal + dietTotal + shoppingTotal;
  const totalTonnes = totalKg / 1000;

  return {
    breakdown: {
      transport: Math.round(transportTotal),
      flights: Math.round(flightEmissions),
      home: Math.round(homeTotal),
      diet: Math.round(dietTotal),
      shopping: Math.round(shoppingTotal),
    },
    totalKg: Math.round(totalKg),
    totalTonnes: Number(totalTonnes.toFixed(2)),
  };
}

/**
 * Custom React hook wrapper to calculate footprint breakdown memoized.
 * 
 * @param {Object} inputs - Carbon inputs state object.
 * @param {number} gridFactor - Grid electricity emission factor.
 * @returns {Object} Footprint calculations.
 */
export function useCarbon(inputs, gridFactor) {
  return useMemo(() => {
    return calculateCarbon(inputs, gridFactor);
  }, [inputs, gridFactor]);
}
