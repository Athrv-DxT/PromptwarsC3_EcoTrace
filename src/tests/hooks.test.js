import { describe, expect, test, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLocalStorage, useDebounce, useCarbon, useAirQuality } from '../hooks';

// Mock weatherService
vi.mock('../services/weatherService', () => ({
  fetchEnvironmentalData: vi.fn().mockResolvedValue({
    pm2_5: 9.8,
    co: 150,
    temperature: 19.5
  })
}));

describe('Hooks Unit Tests', () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  test('useLocalStorage reads and writes key values', () => {
    const { result } = renderHook(() => useLocalStorage('test_key', 'initial'));
    
    expect(result.current[0]).toBe('initial');
    
    act(() => {
      result.current[1]('updated_value');
    });

    expect(result.current[0]).toBe('updated_value');
    expect(window.localStorage.getItem('test_key')).toBe(JSON.stringify('updated_value'));
  });

  test('useDebounce delays state propagation', async () => {
    vi.useFakeTimers();
    
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'first', delay: 200 } }
    );

    expect(result.current).toBe('first');

    rerender({ value: 'second', delay: 200 });
    expect(result.current).toBe('first'); // Should still be first before timer triggers

    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(result.current).toBe('second');
    vi.useRealTimers();
  });

  test('useCarbon returns memoized calculations', () => {
    const inputs = {
      carType: 'petrol',
      weeklyKm: 100,
      shortFlights: 0,
      longFlights: 0,
      publicTransitHours: 0,
      publicTransitType: 'bus',
      dietType: 'vegan',
      monthlyKwh: 100,
      heatingType: 'none',
      monthlyGas: 0,
      monthlyClothes: 0,
      yearlyElectronics: 0
    };

    const { result } = renderHook(() => useCarbon(inputs, 0.233));
    // Expected Transport: 100 * 52 * 0.21 = 1,092
    // Expected Home: 100 * 12 * 0.233 = 280 (rounded electricity emissions)
    // Expected Diet: 1500 (vegan)
    // Expected Total: 1092 + 280 + 1500 = 2872 kg CO2e
    expect(result.current.totalKg).toBe(2872);
  });

  test('useAirQuality triggers geolocation API lookup', async () => {
    const mockGeolocation = {
      getCurrentPosition: vi.fn().mockImplementation((success) => {
        success({
          coords: {
            latitude: 35.6,
            longitude: 139.7
          }
        });
      })
    };
    
    vi.stubGlobal('navigator', {
      geolocation: mockGeolocation
    });

    const { result } = renderHook(() => useAirQuality());
    
    // Check loading state
    expect(result.current.loading).toBe(true);

    // Wait for resolving
    await vi.waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.pm2_5).toBe(9.8);
    expect(result.current.co).toBe(150);
    expect(result.current.temperature).toBe(19.5);
    expect(result.current.locationName).toBe('Local Area');
  });
});
