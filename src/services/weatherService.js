// @ts-nocheck
/**
 * Service to fetch environmental and air quality metrics from Open-Meteo APIs.
 */

/**
 * Fetches air quality metrics (PM2.5, Carbon Monoxide) and current weather details.
 * 
 * @param {number} lat - Latitude coordinates.
 * @param {number} lon - Longitude coordinates.
 * @param {AbortSignal} [signal] - Optional abort signal for network timeout.
 * @returns {Promise<{ pm2_5: number|null, co: number|null, temperature: number|null }>} Environmental data.
 * @throws {Error} If one or both network calls fail or return invalid structure.
 */
export async function fetchEnvironmentalData(lat, lon, signal) {
  const aqUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&hourly=pm2_5,carbon_monoxide&timezone=auto`;
  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m&timezone=auto`;

  const [aqRes, weatherRes] = await Promise.all([
    fetch(aqUrl, { signal }),
    fetch(weatherUrl, { signal })
  ]);

  if (!aqRes.ok || !weatherRes.ok) {
    throw new Error('Failed to retrieve environment data from Open-Meteo');
  }

  const aqData = await aqRes.json();
  const weatherData = await weatherRes.json();

  // Validate response structures
  if (!aqData || typeof aqData !== 'object' || !weatherData || typeof weatherData !== 'object') {
    throw new Error('Invalid JSON response structure from environment APIs');
  }

  let pm2_5 = null;
  let co = null;

  if (aqData.hourly && Array.isArray(aqData.hourly.time)) {
    const nowIso = new Date().toISOString().substring(0, 13);
    let index = aqData.hourly.time.findIndex(t => t.startsWith(nowIso));
    if (index === -1) index = 0; // Fallback to first hour
    
    pm2_5 = (aqData.hourly.pm2_5 && Array.isArray(aqData.hourly.pm2_5)) 
      ? (aqData.hourly.pm2_5[index] ?? null) 
      : null;
      
    co = (aqData.hourly.carbon_monoxide && Array.isArray(aqData.hourly.carbon_monoxide)) 
      ? (aqData.hourly.carbon_monoxide[index] ?? null) 
      : null;
  }

  const temperature = weatherData.current?.temperature_2m ?? weatherData.current_weather?.temperature ?? null;

  return { pm2_5, co, temperature };
}
