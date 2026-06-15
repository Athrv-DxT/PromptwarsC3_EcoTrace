import { useState, useEffect } from 'react';

/**
 * Custom hook to fetch air quality (PM2.5, CO) and weather data from Open-Meteo APIs.
 * Utilizes Geolocation with permission checks and handles fallback coordinates.
 * Operates under an 8-second timeout via AbortController.
 * 
 * TEST CASES:
 * 1. Geolocation denied -> uses default coordinates (Delhi: 28.6, 77.2), fetches data successfully.
 * 2. Geolocation allowed -> uses user coordinates, fetches data successfully.
 * 3. Network timeout -> aborts call after 8 seconds, returns error state.
 */
export function useAirQuality() {
  const [data, setData] = useState({
    pm2_5: null,
    co: null,
    temperature: null,
    locationName: 'Default Location (Delhi, IN)',
    loading: true,
    error: null,
  });

  useEffect(() => {
    let active = true;
    const fallbackCoords = { latitude: 28.6, longitude: 77.2, name: 'Delhi, IN' };

    const fetchEnvironmentalData = async (lat, lon, isFallback) => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      try {
        // Fetch Air Quality
        const aqUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&hourly=pm2_5,carbon_monoxide&timezone=auto`;
        // Fetch Weather
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m&timezone=auto`;

        const [aqRes, weatherRes] = await Promise.all([
          fetch(aqUrl, { signal: controller.signal }),
          fetch(weatherUrl, { signal: controller.signal })
        ]);

        clearTimeout(timeoutId);

        if (!aqRes.ok || !weatherRes.ok) {
          throw new Error('Failed to retrieve environment data from Open-Meteo');
        }

        const aqData = await aqRes.json();
        const weatherData = await weatherRes.json();

        if (!active) return;

        // Parse Air Quality
        let pm2_5 = null;
        let co = null;
        if (aqData.hourly && aqData.hourly.time) {
          const nowIso = new Date().toISOString().substring(0, 13);
          let index = aqData.hourly.time.findIndex(t => t.startsWith(nowIso));
          if (index === -1) index = 0; // Fallback to first hour
          pm2_5 = aqData.hourly.pm2_5?.[index] ?? null;
          co = aqData.hourly.carbon_monoxide?.[index] ?? null;
        }

        // Parse Temperature
        const temperature = weatherData.current?.temperature_2m ?? weatherData.current_weather?.temperature ?? null;

        setData({
          pm2_5,
          co,
          temperature,
          locationName: isFallback ? 'Default (Delhi, IN)' : 'Local Area',
          loading: false,
          error: null,
        });

      } catch (err) {
        clearTimeout(timeoutId);
        if (!active) return;
        console.error('Environment fetch error:', err);
        setData(prev => ({
          ...prev,
          loading: false,
          error: err.name === 'AbortError' ? 'API request timed out (8s limit reached).' : err.message,
        }));
      }
    };

    // Check Geolocation Support
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (active) {
            fetchEnvironmentalData(
              position.coords.latitude,
              position.coords.longitude,
              false
            );
          }
        },
        (error) => {
          console.warn('Geolocation access denied/failed, falling back to default:', error.message);
          if (active) {
            fetchEnvironmentalData(fallbackCoords.latitude, fallbackCoords.longitude, true);
          }
        },
        { timeout: 5000 }
      );
    } else {
      console.warn('Geolocation not supported, using defaults.');
      fetchEnvironmentalData(fallbackCoords.latitude, fallbackCoords.longitude, true);
    }

    return () => {
      active = false;
    };
  }, []);

  return data;
}
