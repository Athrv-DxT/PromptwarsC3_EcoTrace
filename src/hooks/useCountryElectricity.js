import { useState, useEffect } from 'react';
import { fetchCountryElectricityInfo } from '../services';
import { GRID_FACTORS, API_TIMEOUT_MS } from '../constants';

/**
 * Custom hook to load regional grid factors and region descriptions
 * based on selected country inputs.
 * 
 * @param {string} countryName - The name of the country.
 * @returns {{ gridFactor: number, countryRegionInfo: string, countryLoading: boolean, countryError: string|null }} Electricity parameters.
 */
export function useCountryElectricity(countryName) {
  const [gridFactor, setGridFactor] = useState(GRID_FACTORS.EUROPE);
  const [countryRegionInfo, setCountryRegionInfo] = useState('');
  const [countryLoading, setCountryLoading] = useState(false);
  const [countryError, setCountryError] = useState(null);

  useEffect(() => {
    if (!countryName) return;

    let active = true;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

    setCountryLoading(true);
    setCountryError(null);

    const fetchCountryInfo = async () => {
      try {
        const { gridFactor: matchedFactor, displayRegion } = await fetchCountryElectricityInfo(
          countryName,
          controller.signal
        );
        clearTimeout(timeoutId);

        if (!active) return;

        setGridFactor(matchedFactor);
        setCountryRegionInfo(`You're in ${displayRegion} — your grid emission factor is ${matchedFactor} kg CO2e/kWh.`);
        setCountryLoading(false);
      } catch (err) {
        clearTimeout(timeoutId);
        if (!active) return;
        console.error('REST Countries API error:', err);
        
        let matchedFactor = GRID_FACTORS.DEFAULT;
        let displayRegion = 'Global Average';
        const name = countryName.toLowerCase();

        if (name.includes('india')) {
          matchedFactor = GRID_FACTORS.INDIA;
          displayRegion = 'South Asia (India)';
        } else if (name.includes('united kingdom') || name.includes('germany') || name.includes('france') || name.includes('italy')) {
          matchedFactor = GRID_FACTORS.EUROPE;
          displayRegion = 'Western Europe';
        } else if (name.includes('united states') || name.includes('canada')) {
          matchedFactor = GRID_FACTORS.NORTH_AMERICA;
          displayRegion = 'North America';
        } else if (name.includes('china') || name.includes('japan')) {
          matchedFactor = GRID_FACTORS.EAST_ASIA;
          displayRegion = 'East Asia';
        }

        setGridFactor(matchedFactor);
        setCountryRegionInfo(`You're in ${displayRegion} (estimated fallback) — your grid emission factor is ${matchedFactor} kg CO2e/kWh.`);
        setCountryLoading(false);
        setCountryError(err.name === 'AbortError' ? 'Countries API request timed out (8s).' : err.message);
      }
    };

    fetchCountryInfo();

    return () => {
      active = false;
      controller.abort();
    };
  }, [countryName]);

  return { gridFactor, countryRegionInfo, countryLoading, countryError };
}
