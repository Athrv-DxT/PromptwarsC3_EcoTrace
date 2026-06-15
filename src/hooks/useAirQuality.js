import { useState, useEffect } from 'react';
import { fetchEnvironmentalData } from '../services';
import { DEFAULT_COORDINATES, API_TIMEOUT_MS, GEOLOCATION_TIMEOUT_MS } from '../constants';

/**
 * Custom hook to fetch weather telemetry and air quality metrics (PM2.5, Carbon Monoxide)
 * from Open-Meteo API. Supports Geolocation with fallback to Delhi coordinates.
 * Operates under an 8-second timeout.
 * 
 * @returns {Object} Data loading status, error messages, weather/AQ values, and location text.
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
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

    const loadData = async (lat, lon, isFallback) => {
      try {
        const result = await fetchEnvironmentalData(lat, lon, controller.signal);
        clearTimeout(timeoutId);

        if (!active) return;

        setData({
          ...result,
          locationName: isFallback ? 'Default (Delhi, IN)' : 'Local Area',
          loading: false,
          error: null
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

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (active) {
            loadData(
              position.coords.latitude,
              position.coords.longitude,
              false
            );
          }
        },
        (error) => {
          console.warn('Geolocation access denied/failed, falling back to default:', error.message);
          if (active) {
            loadData(DEFAULT_COORDINATES.latitude, DEFAULT_COORDINATES.longitude, true);
          }
        },
        { timeout: GEOLOCATION_TIMEOUT_MS }
      );
    } else {
      console.warn('Geolocation not supported, using defaults.');
      if (active) {
        loadData(DEFAULT_COORDINATES.latitude, DEFAULT_COORDINATES.longitude, true);
      }
    }

    return () => {
      active = false;
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, []);

  return data;
}
