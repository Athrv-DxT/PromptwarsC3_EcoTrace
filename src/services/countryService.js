// @ts-nocheck
import { GRID_FACTORS } from '../constants/appConstants';

/**
 * Service to interact with the REST Countries API.
 * Contains logic to fetch country metadata and map region grid factors.
 */

/**
 * Resolves estimated fallback electricity parameters based on country name matching.
 * 
 * @param {string} countryName - The name of the country.
 * @returns {{ gridFactor: number, displayRegion: string }} Grid factor and region name.
 */
export function getFallbackElectricityInfo(countryName) {
  if (!countryName) {
    return { gridFactor: GRID_FACTORS.DEFAULT, displayRegion: 'Global Average' };
  }
  const nameLower = countryName.toLowerCase();
  let matchedFactor = GRID_FACTORS.DEFAULT;
  let displayRegion = 'Global Average';

  if (nameLower.includes('india')) {
    matchedFactor = GRID_FACTORS.INDIA;
    displayRegion = 'South Asia (India)';
  } else if (nameLower.includes('united kingdom') || nameLower.includes('germany') || nameLower.includes('france') || nameLower.includes('italy')) {
    matchedFactor = GRID_FACTORS.EUROPE;
    displayRegion = 'Western Europe';
  } else if (nameLower.includes('united states') || nameLower.includes('canada')) {
    matchedFactor = GRID_FACTORS.NORTH_AMERICA;
    displayRegion = 'North America';
  } else if (nameLower.includes('china') || nameLower.includes('japan')) {
    matchedFactor = GRID_FACTORS.EAST_ASIA;
    displayRegion = 'East Asia';
  }

  return { gridFactor: matchedFactor, displayRegion };
}

/**
 * Fetches country information and maps it to a regional grid emission factor.
 * Falls back to estimated factors based on name matching in case of error.
 * 
 * @param {string} countryName - The name of the country to fetch.
 * @param {AbortSignal} [signal] - Optional abort signal for network timeout.
 * @returns {Promise<{ gridFactor: number, displayRegion: string }>} Resolves with grid factor and region name.
 * @throws {Error} If API responds with an error.
 */
export async function fetchCountryElectricityInfo(countryName, signal) {
  if (!countryName) {
    return { gridFactor: GRID_FACTORS.DEFAULT, displayRegion: 'Global Average' };
  }

  const nameLower = countryName.toLowerCase();
  
  try {
    const res = await fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(countryName)}`, {
      signal
    });
    
    if (!res.ok) {
      throw new Error(`RestCountries API responded with status ${res.status}`);
    }
    
    const data = await res.json();
    
    // Simple response schema validation
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('Invalid response structure from RestCountries API');
    }
    
    const countryData = data[0];
    const region = countryData?.region;
    const subregion = countryData?.subregion;

    let matchedFactor = GRID_FACTORS.DEFAULT;
    let displayRegion = subregion || region || 'Unknown';

    // Grid Factors mapping
    if (nameLower === 'india' || subregion === 'Southern Asia') {
      matchedFactor = GRID_FACTORS.INDIA;
      displayRegion = 'South Asia';
    } else if (region === 'Europe') {
      matchedFactor = GRID_FACTORS.EUROPE;
      displayRegion = 'Western Europe';
    } else if (subregion === 'Northern America') {
      matchedFactor = GRID_FACTORS.NORTH_AMERICA;
      displayRegion = 'North America';
    } else if (subregion === 'Eastern Asia') {
      matchedFactor = GRID_FACTORS.EAST_ASIA;
      displayRegion = 'East Asia';
    } else if (subregion === 'South-Eastern Asia') {
      matchedFactor = GRID_FACTORS.SOUTHEAST_ASIA;
      displayRegion = 'Southeast Asia';
    } else if (subregion === 'Western Asia' || subregion === 'Middle East') {
      matchedFactor = GRID_FACTORS.MIDDLE_EAST;
      displayRegion = 'Middle East';
    } else if (region === 'Africa') {
      matchedFactor = GRID_FACTORS.AFRICA;
      displayRegion = 'Africa';
    }

    return { gridFactor: matchedFactor, displayRegion };
  } catch (err) {
    // Re-throw if it was aborted
    if (err.name === 'AbortError') {
      throw err;
    }
    
    return getFallbackElectricityInfo(countryName);
  }
}
