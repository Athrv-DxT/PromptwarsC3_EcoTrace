import React from 'react';
import { useCarbonContext } from '../../context/CarbonContext';
import { useAirQuality } from '../../hooks/useAirQuality';
import { formatTonnes } from '../../utils/formatters';
import ComparisonChart from './ComparisonChart';
import FootprintChart from './FootprintChart';
import ContextCard from './ContextCard';
import Tracker from '../Tracker/Tracker';
import FutureSimulator from './FutureSimulator';

export default function Dashboard() {
  const {
    breakdown,
    totalKg,
    totalTonnes,
    resetCalculator
  } = useCarbonContext();

  const {
    pm2_5,
    co,
    temperature,
    locationName,
    loading: envLoading,
    error: envError
  } = useAirQuality();

  // Determine user score coloring and verdict text
  let color = '#16a34a'; // Green
  let textClass = 'text-green-600 dark:text-green-400 border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-900/50';
  let verdictTitle = 'Excellent Footprint';
  let verdictDesc = 'Your carbon footprint is low (under 4 tonnes). You are meeting sustainable benchmarks. Keep up the clean habits!';
  let icon = '🌱';

  if (totalTonnes >= 4 && totalTonnes <= 8) {
    color = '#d97706'; // Amber
    textClass = 'text-amber-600 dark:text-amber-400 border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-900/50';
    verdictTitle = 'Moderate Footprint';
    verdictDesc = 'Your carbon footprint is average (4 to 8 tonnes). Adopting a few recommendations below can easily transition you to low-impact.';
    icon = '⚠️';
  } else if (totalTonnes > 8) {
    color = '#dc2626'; // Red
    textClass = 'text-red-600 dark:text-red-400 border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-900/50';
    verdictTitle = 'High Footprint';
    verdictDesc = 'Your carbon footprint is above average (over 8 tonnes). Review our personalized tips to slash high energy and transport outputs.';
    icon = '🚨';
  }

  // Air quality rating (WHO thresholds)
  let aqColorClass = 'text-gray-500';
  let aqLabel = 'Unknown';
  if (pm2_5 !== null) {
    if (pm2_5 <= 12) {
      aqColorClass = 'text-green-600 dark:text-green-400';
      aqLabel = 'Clean (Good)';
    } else if (pm2_5 <= 35.4) {
      aqColorClass = 'text-amber-600 dark:text-amber-400';
      aqLabel = 'Moderate';
    } else {
      aqColorClass = 'text-red-600 dark:text-red-400';
      aqLabel = 'Unhealthy / Poor';
    }
  }

  // Context math
  const flightsEquiv = Math.round(totalKg / 1200);
  const treesEquiv = Math.round(totalKg / 21);
  const kmDrivenEquiv = Math.round(totalKg / 0.21);

  return (
    <section className="space-y-8">
      
      {/* Header and Recalculate */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white md:text-3xl">Your Footprint Analysis</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            A comprehensive breakdown of your impact, regional comparisons, and telemetry.
          </p>
        </div>
        <button
          onClick={resetCalculator}
          className="self-start rounded-xl bg-primary-600 px-5 py-3 text-sm font-bold text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-all duration-200"
        >
          🔄 Recalculate Footprint
        </button>
      </div>

      {/* Hero verdict card and Air Quality telemetry */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Hero Card */}
        <div className={`col-span-1 md:col-span-2 rounded-2xl border p-6 flex flex-col justify-between transition-colors duration-200 ${textClass}`}>
          <div className="flex items-start gap-4">
            <span className="text-4xl select-none" aria-hidden="true">{icon}</span>
            <div className="space-y-1">
              <h2 className="text-lg font-black uppercase tracking-wider">{verdictTitle}</h2>
              <p className="text-sm font-medium leading-relaxed opacity-90">{verdictDesc}</p>
            </div>
          </div>
          <div className="mt-6">
            <span className="block text-[10px] uppercase font-extrabold tracking-widest opacity-75">
              Annual Emissions Score
            </span>
            <span className="text-5xl font-black tracking-tight">
              {totalTonnes} <span className="text-2xl font-bold">tonnes CO₂e</span>
            </span>
          </div>
        </div>

        {/* Air Quality Widget */}
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
      </div>

      {/* Chart Visualizations */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <h2 className="text-sm font-extrabold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-4">
            Comparison Against Benchmarks
          </h2>
          <ComparisonChart userScoreTonnes={totalTonnes} userColor={color} />
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <h2 className="text-sm font-extrabold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-4">
            Footprint Segment Breakdown
          </h2>
          <FootprintChart breakdown={breakdown} />
        </div>
      </div>

      {/* Equivalency Context Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <ContextCard
          title="Transatlantic Flights"
          value={flightsEquiv}
          unit="return flights"
          icon="✈️"
          description="A single return flight from London to New York emits roughly 1.2 tonnes of carbon per passenger."
        />
        <ContextCard
          title="Tree Offsets Required"
          value={treesEquiv}
          unit="trees / year"
          icon="🌳"
          description="A mature tree absorbs roughly 21 kg of CO₂ annually from our atmosphere."
        />
        <ContextCard
          title="Petrol Car Distance"
          value={kmDrivenEquiv}
          unit="kilometers"
          icon="🚗"
          description="Equivalent to driving a standard petrol vehicle, producing 0.21 kg CO₂e per kilometer."
        />
      </div>

      {/* Future Simulator */}
      <FutureSimulator />

      {/* Goals Tracker */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <Tracker />
      </div>

    </section>
  );
}
