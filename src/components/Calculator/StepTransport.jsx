import React from 'react';
import { useCarbonContext } from '../../context/CarbonContext';

export default function StepTransport() {
  const {
    inputs,
    errors,
    updateInput,
    countryRegionInfo,
    countryLoading,
    countryError,
    breakdown
  } = useCarbonContext();

  const countries = [
    'United Kingdom',
    'India',
    'United States',
    'Germany',
    'China',
    'Japan',
    'Brazil',
    'France',
    'South Africa',
    'Australia',
    'Canada'
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Transportation Profile</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Provide your travel details to calculate your transit footprint.
        </p>
      </div>

      {/* Grid Country Selector */}
      <div className="space-y-2">
        <label htmlFor="country-selector" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
          Country (determines grid electricity factor)
        </label>
        <select
          id="country-selector"
          value={inputs.country}
          onChange={(e) => updateInput('country', e.target.value)}
          className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-600 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        >
          {countries.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        
        {countryLoading && (
          <p className="text-xs text-primary-600 dark:text-primary-400 flex items-center gap-1">
            <span className="inline-block animate-spin">⏳</span> Fetching regional electricity factor...
          </p>
        )}
        
        {!countryLoading && countryRegionInfo && (
          <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
            {countryRegionInfo}
          </p>
        )}

        {countryError && (
          <p className="text-xs text-red-500 dark:text-red-400" role="alert">
            Could not fetch region details ({countryError}). Using estimated factor.
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Car Type Selector */}
        <div className="space-y-2">
          <span className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
            Primary Car Type
          </span>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {[
              { id: 'none', label: 'None', icon: '🚶' },
              { id: 'petrol', label: 'Petrol', icon: '⛽' },
              { id: 'diesel', label: 'Diesel', icon: '🛢️' },
              { id: 'hybrid', label: 'Hybrid', icon: '⚡🔋' },
              { id: 'ev', label: 'EV', icon: '🔌' },
            ].map((car) => (
              <label
                key={car.id}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center cursor-pointer transition-all duration-200
                  ${inputs.carType === car.id
                    ? 'border-primary-600 bg-primary-50 dark:bg-primary-950/20 text-primary-600 dark:text-primary-400 ring-2 ring-primary-600'
                    : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                  }`}
              >
                <input
                  type="radio"
                  name="carType"
                  value={car.id}
                  checked={inputs.carType === car.id}
                  onChange={(e) => updateInput('carType', e.target.value)}
                  className="sr-only"
                />
                <span className="text-xl mb-1">{car.icon}</span>
                <span className="text-xs font-semibold">{car.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Weekly km driven */}
        {inputs.carType !== 'none' && (
          <div className="space-y-2">
            <label htmlFor="weeklyKm" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Weekly Distance Driven (km)
            </label>
            <input
              type="number"
              id="weeklyKm"
              value={inputs.weeklyKm}
              min="0"
              max="1000"
              aria-describedby={errors.weeklyKm ? 'weeklyKm-error' : undefined}
              onChange={(e) => updateInput('weeklyKm', e.target.value)}
              className={`w-full rounded-xl border px-4 py-3 text-gray-900 dark:text-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-600
                ${errors.weeklyKm 
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-200 dark:border-red-800' 
                  : 'border-gray-300 dark:border-gray-700 focus:border-primary-600'
                }`}
            />
            {errors.weeklyKm && (
              <span role="alert" id="weeklyKm-error" className="text-xs text-red-500 dark:text-red-400">
                {errors.weeklyKm}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Short flights */}
        <div className="space-y-2">
          <label htmlFor="shortFlights" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
            Short-Haul Return Flights/yr (&lt;3 hrs)
          </label>
          <input
            type="number"
            id="shortFlights"
            value={inputs.shortFlights}
            min="0"
            max="20"
            aria-describedby={errors.shortFlights ? 'shortFlights-error' : undefined}
            onChange={(e) => updateInput('shortFlights', e.target.value)}
            className={`w-full rounded-xl border px-4 py-3 text-gray-900 dark:text-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-600
              ${errors.shortFlights 
                ? 'border-red-500 focus:border-red-500 focus:ring-red-200 dark:border-red-800' 
                : 'border-gray-300 dark:border-gray-700 focus:border-primary-600'
              }`}
          />
          {errors.shortFlights && (
            <span role="alert" id="shortFlights-error" className="text-xs text-red-500 dark:text-red-400">
              {errors.shortFlights}
            </span>
          )}
        </div>

        {/* Long flights */}
        <div className="space-y-2">
          <label htmlFor="longFlights" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
            Long-Haul Return Flights/yr (&gt;6 hrs)
          </label>
          <input
            type="number"
            id="longFlights"
            value={inputs.longFlights}
            min="0"
            max="10"
            aria-describedby={errors.longFlights ? 'longFlights-error' : undefined}
            onChange={(e) => updateInput('longFlights', e.target.value)}
            className={`w-full rounded-xl border px-4 py-3 text-gray-900 dark:text-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-600
              ${errors.longFlights 
                ? 'border-red-500 focus:border-red-500 focus:ring-red-200 dark:border-red-800' 
                : 'border-gray-300 dark:border-gray-700 focus:border-primary-600'
              }`}
          />
          {errors.longFlights && (
            <span role="alert" id="longFlights-error" className="text-xs text-red-500 dark:text-red-400">
              {errors.longFlights}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Public transit hours */}
        <div className="space-y-2">
          <label htmlFor="publicTransitHours" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
            Public Transit usage (hours/week)
          </label>
          <input
            type="number"
            id="publicTransitHours"
            value={inputs.publicTransitHours}
            min="0"
            max="40"
            aria-describedby={errors.publicTransitHours ? 'publicTransitHours-error' : undefined}
            onChange={(e) => updateInput('publicTransitHours', e.target.value)}
            className={`w-full rounded-xl border px-4 py-3 text-gray-900 dark:text-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-600
              ${errors.publicTransitHours 
                ? 'border-red-500 focus:border-red-500 focus:ring-red-200 dark:border-red-800' 
                : 'border-gray-300 dark:border-gray-700 focus:border-primary-600'
              }`}
          />
          {errors.publicTransitHours && (
            <span role="alert" id="publicTransitHours-error" className="text-xs text-red-500 dark:text-red-400">
              {errors.publicTransitHours}
            </span>
          )}
        </div>

        {/* Transit Mode */}
        {Number(inputs.publicTransitHours) > 0 && (
          <div className="space-y-2">
            <span className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Transit Mode Type
            </span>
            <div className="flex gap-4">
              {[
                { id: 'bus', label: 'Bus', icon: '🚌' },
                { id: 'train', label: 'Train', icon: '🚊' },
                { id: 'both', label: 'Mixed', icon: '🚏' }
              ].map((mode) => (
                <label
                  key={mode.id}
                  className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer transition-all duration-200 text-sm font-semibold
                    ${inputs.publicTransitType === mode.id
                      ? 'border-primary-600 bg-primary-50 dark:bg-primary-950/20 text-primary-600 dark:text-primary-400 ring-2 ring-primary-600'
                      : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                    }`}
                >
                  <input
                    type="radio"
                    name="publicTransitType"
                    value={mode.id}
                    checked={inputs.publicTransitType === mode.id}
                    onChange={(e) => updateInput('publicTransitType', e.target.value)}
                    className="sr-only"
                  />
                  <span>{mode.icon}</span>
                  <span>{mode.label}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Live subtotal block */}
      <div 
        className="mt-6 rounded-2xl bg-gray-100 p-4 transition-colors duration-200 dark:bg-gray-800"
        aria-live="polite"
        aria-atomic="true"
      >
        <div className="flex justify-between items-center">
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Transport Subtotal:
          </span>
          <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
            {breakdown.transport.toLocaleString()} kg CO₂e / year
          </span>
        </div>
      </div>
    </div>
  );
}
