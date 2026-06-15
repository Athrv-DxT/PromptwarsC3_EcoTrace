import { describe, expect, test } from 'vitest';
import { calculateCarbon } from '../hooks/useCarbon';

describe('carbon calculations test suite', () => {
  test('calculates transport emissions correctly', () => {
    const inputs = {
      carType: 'petrol',
      weeklyKm: 100,
      shortFlights: 2,
      longFlights: 1,
      publicTransitHours: 0,
      publicTransitType: 'bus',
      dietType: 'vegan',
      monthlyKwh: 0,
      heatingType: 'none',
      monthlyGas: 0,
      monthlyClothes: 0,
      yearlyElectronics: 0
    };
    // Expected transport total: (100 * 52 * 0.21) + (2 * 255) + (1 * 1200) = 2,802 kg CO2e
    const result = calculateCarbon(inputs, 0.233);
    expect(result.breakdown.transport).toBe(2802);
  });

  test('calculates home and diet emissions correctly', () => {
    const inputs = {
      carType: 'none',
      weeklyKm: 0,
      shortFlights: 0,
      longFlights: 0,
      publicTransitHours: 0,
      publicTransitType: 'bus',
      dietType: 'vegan',
      monthlyKwh: 200,
      heatingType: 'heatpump',
      monthlyGas: 0,
      monthlyClothes: 0,
      yearlyElectronics: 0
    };
    // Expected: diet 1500 + (200*12*0.233) + (200*12*0.07) = 1500 + 559.2 + 168 = 2,227.2 kg CO2e
    const result = calculateCarbon(inputs, 0.233);
    expect(result.breakdown.diet).toBe(1500);
    expect(result.breakdown.home).toBe(Math.round(559.2 + 168));
    expect(result.totalKg).toBe(2227);
  });
});
