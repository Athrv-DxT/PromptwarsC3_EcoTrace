import React, { useState } from 'react';
import { useCarbonContext } from '../../context/CarbonContext';
import { formatTonnes } from '../../utils';
import { SIMULATION_SAVINGS, TIMELINE_MULTIPLIERS } from '../../constants';

/**
 * FutureImpactSimulator component to allow users to toggle lifestyle adjustments
 * and see projections of their 6-month, 1-year, and 5-year emissions totals.
 * 
 * @returns {React.JSX.Element} Simulator layout.
 */
export default function FutureSimulator() {
  const { totalKg } = useCarbonContext();

  const [simulations, setSimulations] = useState({
    ev: false,
    plastic: false,
    transit: false,
    solar: false
  });

  const handleToggle = (key) => {
    setSimulations(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Sum yearly savings based on selected toggles
  let annualSaving = 0;
  if (simulations.ev) annualSaving += SIMULATION_SAVINGS.ev;
  if (simulations.plastic) annualSaving += SIMULATION_SAVINGS.plastic;
  if (simulations.transit) annualSaving += SIMULATION_SAVINGS.transit;
  if (simulations.solar) annualSaving += SIMULATION_SAVINGS.solar;

  const saving6mo = Math.round(annualSaving * TIMELINE_MULTIPLIERS.SIX_MONTHS);
  const saving1yr = Math.round(annualSaving * TIMELINE_MULTIPLIERS.ONE_YEAR);
  const saving5yr = Math.round(annualSaving * TIMELINE_MULTIPLIERS.FIVE_YEARS);

  const startScore = totalKg;
  const score6mo = Math.max(0, startScore - saving6mo);
  const score1yr = Math.max(0, startScore - saving1yr);
  const score5yr = Math.max(0, startScore - saving5yr);

  const timelineData = [
    { label: 'Current Score', score: startScore, saving: 0, time: 'Start' },
    { label: '6 Months Project', score: score6mo, saving: saving6mo, time: '6 Months' },
    { label: '1 Year Project', score: score1yr, saving: saving1yr, time: '1 Year' },
    { label: '5 Year Project', score: score5yr, saving: saving5yr, time: '5 Years' }
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 space-y-6">
      <div className="flex items-center gap-2">
        <span className="text-2xl" aria-hidden="true">🔮</span>
        <div>
          <h3 className="text-base font-black text-gray-900 dark:text-white">Future Impact Simulator</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">Select potential lifestyle shifts to project your future carbon trajectory.</p>
        </div>
      </div>

      {/* Inputs check grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { key: 'ev', label: 'Switch to EV / Hybrid', icon: '🚗', savingText: '-1.2t / year' },
          { key: 'plastic', label: 'Stop Single-use Plastic', icon: '🥤', savingText: '-80kg / year' },
          { key: 'transit', label: 'Use Public Transit', icon: '🚌', savingText: '-600kg / year' },
          { key: 'solar', label: 'Switch to Solar / Green Tariff', icon: '☀️', savingText: '-800kg / year' }
        ].map((item) => (
          <button
            key={item.key}
            onClick={() => handleToggle(item.key)}
            className={`flex flex-col items-center justify-center p-4 rounded-xl border text-center transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600
              ${simulations[item.key]
                ? 'border-primary-600 bg-primary-50 dark:bg-primary-950/20 text-primary-600 dark:text-primary-400 ring-2 ring-primary-600'
                : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
            aria-pressed={simulations[item.key]}
          >
            <span className="text-2xl mb-1.5" aria-hidden="true">{item.icon}</span>
            <span className="text-xs font-bold leading-tight">{item.label}</span>
            <span className="text-[10px] font-extrabold uppercase text-gray-400 mt-1">{item.savingText}</span>
          </button>
        ))}
      </div>

      {/* Visual Timeline */}
      <div className="pt-4">
        <h4 className="text-xs font-extrabold uppercase tracking-widest text-gray-400 mb-6">Projected Savings Timeline</h4>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4 relative">
          {/* Connecting line in background for large screens */}
          <div className="absolute top-4 left-[12.5%] right-[12.5%] h-0.5 bg-gray-200 dark:bg-gray-700 hidden md:block" aria-hidden="true" />

          {timelineData.map((data, index) => {
            const isDecreased = data.saving > 0;
            return (
              <div key={index} className="flex md:flex-col items-center md:text-center gap-4 md:gap-2 relative z-10">
                {/* Timeline Dot */}
                <div 
                  className={`flex h-8 w-8 items-center justify-center rounded-full border-2 font-bold text-xs select-none shrink-0
                    ${isDecreased 
                      ? 'border-primary-600 bg-primary-600 text-white' 
                      : 'border-gray-300 bg-white text-gray-400 dark:border-gray-600 dark:bg-gray-800'
                    }`}
                >
                  {index === 0 ? '●' : `-${formatTonnes(data.saving)}t`}
                </div>

                {/* Details */}
                <div className="space-y-0.5">
                  <span className="block text-[10px] font-extrabold uppercase tracking-wider text-gray-400">
                    {data.time}
                  </span>
                  <span className="block text-sm font-black text-gray-900 dark:text-white">
                    {data.label}
                  </span>
                  <span className="block text-xs font-extrabold text-primary-600 dark:text-primary-400">
                    {formatTonnes(data.score)} tonnes CO₂e
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
