import { useAirQuality } from '../../hooks/useAirQuality';
import { PM25_THRESHOLDS } from '../../constants';

/**
 * Telemetry widget displaying real-time environmental data (PM2.5, CO, temp)
 * based on user geolocation or default location fallback.
 * 
 * @returns {React.JSX.Element} Environmental telemetry container.
 */
export default function TelemetryWidget() {
  const {
    pm2_5,
    co,
    temperature,
    locationName,
    loading: envLoading,
    error: envError
  } = useAirQuality();

  // Air quality rating (WHO thresholds)
  let aqColorClass = 'text-gray-500';
  let aqLabel = 'Unknown';
  if (pm2_5 !== null) {
    if (pm2_5 <= PM25_THRESHOLDS.GOOD) {
      aqColorClass = 'text-green-600 dark:text-green-400';
      aqLabel = 'Clean (Good)';
    } else if (pm2_5 <= PM25_THRESHOLDS.MODERATE) {
      aqColorClass = 'text-amber-600 dark:text-amber-400';
      aqLabel = 'Moderate';
    } else {
      aqColorClass = 'text-red-600 dark:text-red-400';
      aqLabel = 'Unhealthy / Poor';
    }
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 flex flex-col justify-between">
      <div>
        <h2 className="text-xs font-extrabold uppercase tracking-widest text-gray-500 dark:text-gray-400">
          Environment Telemetry
        </h2>
        <p className="text-[10px] text-gray-400 dark:text-gray-500 font-semibold mt-0.5">
          Location: {locationName}
        </p>
        
        {envLoading ? (
          <div className="mt-4 flex items-center justify-center h-20 text-sm font-semibold text-gray-500">
            <span className="animate-spin mr-2">⏳</span> Loading real-time values...
          </div>
        ) : envError ? (
          <div className="mt-4 text-xs font-semibold text-red-500 dark:text-red-400 leading-normal">
            ⚠️ {envError}
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            {pm2_5 !== null && (
              <div>
                <span className="block text-[10px] font-bold text-gray-400 uppercase">PM2.5 Pollution</span>
                <div className="flex items-baseline gap-2">
                  <span className={`text-2xl font-black ${aqColorClass}`}>
                    {pm2_5.toFixed(1)} <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">µg/m³</span>
                  </span>
                  <span className="text-xs font-bold text-gray-400">({aqLabel})</span>
                </div>
              </div>
            )}
            {co !== null && (
              <div>
                <span className="block text-[10px] font-bold text-gray-400 uppercase">Carbon Monoxide (CO)</span>
                <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                  {co.toFixed(0)} µg/m³
                </span>
              </div>
            )}
            {temperature !== null && (
              <div className="pt-1 border-t border-gray-100 dark:border-gray-800">
                <span className="block text-[10px] font-bold text-gray-400 uppercase">Local Temperature</span>
                <span className="text-base font-bold text-gray-800 dark:text-gray-200">
                  {temperature}°C
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Conditional temperature alert */}
      {!envLoading && !envError && temperature !== null && temperature > 30 && (
        <div className="mt-4 rounded-xl bg-orange-50 border border-orange-200 p-2.5 text-[10px] text-orange-800 dark:bg-orange-950/20 dark:border-orange-900/50 dark:text-orange-300 font-semibold leading-normal">
          🌡️ It's currently {temperature}°C near you — cooling accounts for a large share of home energy. Consider a ceiling fan instead of AC today.
        </div>
      )}
    </div>
  );
}
