// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { useCarbonContext } from '../../context/CarbonContext';
import { useDebounce } from '../../hooks/useDebounce';

export default function StepShopping() {
  const {
    inputs,
    errors,
    updateInput,
    breakdown
  } = useCarbonContext();

  // Local state for smooth slider rendering
  const [localClothes, setLocalClothes] = useState(inputs.monthlyClothes);
  const [localElectronics, setLocalElectronics] = useState(inputs.yearlyElectronics);

  const debouncedClothes = useDebounce(localClothes, 250);
  const debouncedElectronics = useDebounce(localElectronics, 250);

  // Sync debounced values back to global context
  useEffect(() => {
    updateInput('monthlyClothes', debouncedClothes);
  }, [debouncedClothes]);

  useEffect(() => {
    updateInput('yearlyElectronics', debouncedElectronics);
  }, [debouncedElectronics]);

  // Sync local state if global context auto-populates
  useEffect(() => {
    setLocalClothes(inputs.monthlyClothes);
    setLocalElectronics(inputs.yearlyElectronics);
  }, [inputs.monthlyClothes, inputs.yearlyElectronics]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Shopping Profile</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Estimate your consumption habits for garments and tech items.
        </p>
      </div>

      <div className="space-y-6">
        {/* Clothing Purchases Slider */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label htmlFor="clothes-slider" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              New Clothing Items (monthly)
            </label>
            <span className="text-sm font-bold bg-primary-50 dark:bg-primary-950/20 text-primary-600 dark:text-primary-400 px-2.5 py-1 rounded-lg">
              {localClothes} {Number(localClothes) === 1 ? 'item' : 'items'}
            </span>
          </div>
          <input
            id="clothes-slider"
            type="range"
            min="0"
            max="20"
            value={localClothes}
            onChange={(e) => setLocalClothes(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary-600"
            aria-describedby={errors.monthlyClothes ? 'monthlyClothes-error' : undefined}
          />
          {errors.monthlyClothes && (
            <span role="alert" id="monthlyClothes-error" className="text-xs text-red-500 dark:text-red-400 block">
              {errors.monthlyClothes}
            </span>
          )}
          <div className="flex justify-between text-[10px] text-gray-400 font-bold uppercase">
            <span>0 (Minimalist)</span>
            <span>20 (Fast Fashion)</span>
          </div>
        </div>

        {/* Electronics Purchases Slider */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label htmlFor="electronics-slider" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              New Electronics/Gadgets (yearly)
            </label>
            <span className="text-sm font-bold bg-primary-50 dark:bg-primary-950/20 text-primary-600 dark:text-primary-400 px-2.5 py-1 rounded-lg">
              {localElectronics} {Number(localElectronics) === 1 ? 'purchase' : 'purchases'}
            </span>
          </div>
          <input
            id="electronics-slider"
            type="range"
            min="0"
            max="10"
            value={localElectronics}
            onChange={(e) => setLocalElectronics(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary-600"
            aria-describedby={errors.yearlyElectronics ? 'yearlyElectronics-error' : undefined}
          />
          {errors.yearlyElectronics && (
            <span role="alert" id="yearlyElectronics-error" className="text-xs text-red-500 dark:text-red-400 block">
              {errors.yearlyElectronics}
            </span>
          )}
          <div className="flex justify-between text-[10px] text-gray-400 font-bold uppercase">
            <span>0 (Keep devices longer)</span>
            <span>10 (Tech Enthusiast)</span>
          </div>
        </div>
      </div>

      {/* Live subtotal block */}
      <div 
        className="mt-6 rounded-2xl bg-gray-100 p-4 transition-colors duration-200 dark:bg-gray-800"
        aria-live="polite"
        aria-atomic="true"
      >
        <div className="flex justify-between items-center">
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Shopping Subtotal:
          </span>
          <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
            {breakdown.shopping.toLocaleString()} kg CO₂e / year
          </span>
        </div>
      </div>
    </div>
  );
}
