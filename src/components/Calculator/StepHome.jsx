import React from 'react';
import { useCarbonContext } from '../../context/CarbonContext';

export default function StepHome() {
  const {
    inputs,
    errors,
    updateInput,
    breakdown
  } = useCarbonContext();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Home Energy Profile</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Tell us about your home energy usage to compute heating and grid emissions.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Monthly electricity in kWh */}
        <div className="space-y-2">
          <label htmlFor="monthlyKwh" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
            Monthly Electricity Usage (kWh)
          </label>
          <input
            type="number"
            id="monthlyKwh"
            value={inputs.monthlyKwh}
            min="0"
            max="2000"
            aria-describedby={errors.monthlyKwh ? 'monthlyKwh-error' : undefined}
            onChange={(e) => updateInput('monthlyKwh', e.target.value)}
            className={`w-full rounded-xl border px-4 py-3 text-gray-900 dark:text-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-600
              ${errors.monthlyKwh 
                ? 'border-red-500 focus:border-red-500 focus:ring-red-200 dark:border-red-800' 
                : 'border-gray-300 dark:border-gray-700 focus:border-primary-600'
              }`}
          />
          {errors.monthlyKwh && (
            <span role="alert" id="monthlyKwh-error" className="text-xs text-red-500 dark:text-red-400">
              {errors.monthlyKwh}
            </span>
          )}
        </div>

        {/* Heating Type Selector */}
        <div className="space-y-2">
          <span className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
            Primary Heating Source
          </span>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'none', label: 'None', icon: '❌' },
              { id: 'gas', label: 'Gas Furnace', icon: '🔥' },
              { id: 'electric', label: 'Electric Heater', icon: '⚡' },
              { id: 'heatpump', label: 'Heat Pump', icon: '🌀' }
            ].map((heat) => (
              <label
                key={heat.id}
                className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all duration-200 text-sm font-semibold
                  ${inputs.heatingType === heat.id
                    ? 'border-primary-600 bg-primary-50 dark:bg-primary-950/20 text-primary-600 dark:text-primary-400 ring-2 ring-primary-600'
                    : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                  }`}
              >
                <input
                  type="radio"
                  name="heatingType"
                  value={heat.id}
                  checked={inputs.heatingType === heat.id}
                  onChange={(e) => updateInput('heatingType', e.target.value)}
                  className="sr-only"
                />
                <span>{heat.icon}</span>
                <span>{heat.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Conditionally reveal Gas Usage */}
      {inputs.heatingType === 'gas' && (
        <div className="space-y-2 max-w-sm">
          <label htmlFor="monthlyGas" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
            Monthly Natural Gas Usage (kWh)
          </label>
          <input
            type="number"
            id="monthlyGas"
            value={inputs.monthlyGas}
            min="0"
            max="1000"
            aria-describedby={errors.monthlyGas ? 'monthlyGas-error' : undefined}
            onChange={(e) => updateInput('monthlyGas', e.target.value)}
            className={`w-full rounded-xl border px-4 py-3 text-gray-900 dark:text-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-600
              ${errors.monthlyGas 
                ? 'border-red-500 focus:border-red-500 focus:ring-red-200 dark:border-red-800' 
                : 'border-gray-300 dark:border-gray-700 focus:border-primary-600'
              }`}
          />
          {errors.monthlyGas && (
            <span role="alert" id="monthlyGas-error" className="text-xs text-red-500 dark:text-red-400">
              {errors.monthlyGas}
            </span>
          )}
        </div>
      )}

      {/* Live subtotal block */}
      <div 
        className="mt-6 rounded-2xl bg-gray-100 p-4 transition-colors duration-200 dark:bg-gray-800"
        aria-live="polite"
        aria-atomic="true"
      >
        <div className="flex justify-between items-center">
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Home Energy Subtotal:
          </span>
          <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
            {breakdown.home.toLocaleString()} kg CO₂e / year
          </span>
        </div>
      </div>
    </div>
  );
}
