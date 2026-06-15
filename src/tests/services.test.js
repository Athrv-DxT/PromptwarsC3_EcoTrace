import { describe, expect, test, vi, beforeEach } from 'vitest';
import { fetchCountryElectricityInfo } from '../services/countryService';
import { fetchEnvironmentalData } from '../services/weatherService';
import { generateCoachingAdvice, getFallbackResponse } from '../services/aiService';

describe('Services Unit Tests', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  test('countryService maps API responses and fallback values', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [{ region: 'Europe', subregion: 'Western Europe' }]
    });
    global.fetch = mockFetch;

    const result = await fetchCountryElectricityInfo('Germany');
    expect(result.gridFactor).toBe(0.233);
    expect(result.displayRegion).toBe('Western Europe');

    // Test offline fallback matching
    mockFetch.mockRejectedValueOnce(new Error('Network offline'));
    const fallback = await fetchCountryElectricityInfo('India');
    expect(fallback.gridFactor).toBe(0.82);
    expect(fallback.displayRegion).toBe('South Asia (India)');
  });

  test('weatherService requests and parses environment variables', async () => {
    const mockFetch = vi.fn().mockImplementation((url) => {
      if (url.includes('air-quality')) {
        const currentHour = new Date().toISOString().substring(0, 13) + ':00';
        return Promise.resolve({
          ok: true,
          json: async () => ({
            hourly: {
              time: [currentHour],
              pm2_5: [12.5],
              carbon_monoxide: [205]
            }
          })
        });
      }
      return Promise.resolve({
        ok: true,
        json: async () => ({
          current: {
            temperature_2m: 22.4
          }
        })
      });
    });
    global.fetch = mockFetch;

    const env = await fetchEnvironmentalData(28.6, 77.2);
    expect(env.pm2_5).toBe(12.5);
    expect(env.co).toBe(205);
    expect(env.temperature).toBe(22.4);
  });

  test('aiService resolves advice or parses local fallbacks', async () => {
    // Inject mock environment variable
    import.meta.env.VITE_GEMINI_API_KEY = 'mock-key';

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        candidates: [{
          content: {
            parts: [{ text: 'Your estimated annual carbon footprint is low.' }]
          }
        }]
      })
    });
    global.fetch = mockFetch;

    const advice = await generateCoachingAdvice('I cycle and eat plants.');
    expect(advice).toContain('footprint is low');

    // Test local pattern fallback resolving
    const fallbackText = getFallbackResponse('I drive an ev');
    expect(fallbackText).toContain('estimated annual carbon footprint is **lower**');
    expect(fallbackText).toContain('tire pressure');

    const dietFallback = getFallbackResponse('I consume beef');
    expect(dietFallback).toContain('Reduce meat consumption');
  });
});
