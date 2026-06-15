import { describe, expect, test } from 'vitest';
import { validateInput, sanitizeCountry, validateStepInputs, formatTonnes, formatDate, getFootprintVerdict, generateRecommendations } from '../utils';

describe('Validators Unit Tests', () => {
  test('validateInput handles range and type validations', () => {
    expect(validateInput(5, 0, 10, 'kg')).toBeNull();
    expect(validateInput(-1, 0, 10, 'kg')).toContain('Please enter a value between 0 and 10 kg');
    expect(validateInput(11, 0, 10, 'kg')).toContain('Please enter a value between 0 and 10 kg');
    expect(validateInput('abc', 0, 10, 'kg')).toBe('Please enter a valid number');
    expect(validateInput('', 0, 10, 'kg')).toBe('Please enter a value between 0 and 10 kg');
  });

  test('sanitizeCountry safely encodes strings', () => {
    expect(sanitizeCountry(' United Kingdom ')).toBe('United%20Kingdom');
    expect(sanitizeCountry('')).toBe('');
  });

  test('validateStepInputs handles step-based validations', () => {
    const inputsStep1Invalid = { weeklyKm: -5, shortFlights: 22, longFlights: 11, publicTransitHours: 45 };
    const errors1 = validateStepInputs(1, inputsStep1Invalid);
    expect(errors1.weeklyKm).toBeDefined();
    expect(errors1.shortFlights).toBeDefined();
    expect(errors1.longFlights).toBeDefined();
    expect(errors1.publicTransitHours).toBeDefined();

    const inputsStep2Invalid = { monthlyKwh: 2500, heatingType: 'gas', monthlyGas: 1500 };
    const errors2 = validateStepInputs(2, inputsStep2Invalid);
    expect(errors2.monthlyKwh).toBeDefined();
    expect(errors2.monthlyGas).toBeDefined();

    const inputsStep4Invalid = { monthlyClothes: 25, yearlyElectronics: 15 };
    const errors4 = validateStepInputs(4, inputsStep4Invalid);
    expect(errors4.monthlyClothes).toBeDefined();
    expect(errors4.yearlyElectronics).toBeDefined();
  });
});

describe('Formatters Unit Tests', () => {
  test('formatTonnes converts kg to tonnes strings', () => {
    expect(formatTonnes(3402)).toBe('3.40');
    expect(formatTonnes(0)).toBe('0.00');
    expect(formatTonnes('invalid')).toBe('0.00');
  });

  test('formatDate translates ISO strings to local dates', () => {
    expect(formatDate('2026-06-15T21:51:12+05:30')).toBeDefined();
    expect(formatDate('')).toBe('');
    expect(formatDate('invalid-date')).toBe('');
  });
});

describe('Verdict Resolver Unit Tests', () => {
  test('getFootprintVerdict maps score ranges correctly', () => {
    const low = getFootprintVerdict(2.5);
    expect(low.verdictTitle).toBe('Excellent Footprint');
    
    const moderate = getFootprintVerdict(5.0);
    expect(moderate.verdictTitle).toBe('Moderate Footprint');

    const high = getFootprintVerdict(10.0);
    expect(high.verdictTitle).toBe('High Footprint');
  });
});

describe('Recommendations Engine Unit Tests', () => {
  test('generateRecommendations outputs prioritized tips', () => {
    const breakdown = { transport: 3000, flights: 2000, home: 2000, diet: 3000, shopping: 1000 };
    const tips = generateRecommendations(breakdown);
    expect(tips.length).toBeGreaterThan(0);
    expect(tips[0].potentialSaving).toBeGreaterThan(tips[tips.length - 1].potentialSaving);
  });
});
