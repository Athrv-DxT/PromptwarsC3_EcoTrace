import React from 'react';
import { useCarbonContext } from '../../context/CarbonContext';
import { DIET_ANNUAL_KG } from '../../constants/emissionFactors';

export default function StepDiet() {
  const {
    inputs,
    updateInput,
    breakdown
  } = useCarbonContext();

  const dietOptions = [
    { id: 'vegan', label: 'Vegan', emissions: DIET_ANNUAL_KG.VEGAN, icon: '🌱', description: 'Zero animal products' },
    { id: 'vegetarian', label: 'Vegetarian', emissions: DIET_ANNUAL_KG.VEGETARIAN, icon: '🥗', description: 'No meat, includes dairy/eggs' },
    { id: 'pescatarian', label: 'Pescatarian', emissions: DIET_ANNUAL_KG.PESCATARIAN, icon: '🐟', description: 'Vegetarian plus seafood' },
    { id: 'omnivore', label: 'Omnivore', emissions: DIET_ANNUAL_KG.OMNIVORE, icon: '🍽️', description: 'Average meat & veggie mix' },
    { id: 'heavy_meat', label: 'Heavy Meat', emissions: DIET_ANNUAL_KG.HEAVY_MEAT, icon: '🥩', description: 'High frequency red meat intake' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Dietary Habits</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Choose the diet description that aligns closest to your typical weekly meals.
        </p>
      </div>

      <div className="space-y-3">
        {dietOptions.map((option) => {
          const isSelected = inputs.dietType.toLowerCase() === option.id;
          return (
            <label
              key={option.id}
              className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200
                ${isSelected
                  ? 'border-primary-600 bg-primary-50 dark:bg-primary-950/20 ring-2 ring-primary-600'
                  : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
            >
              <input
                type="radio"
                name="dietType"
                value={option.id}
                checked={inputs.dietType.toLowerCase() === option.id}
                onChange={(e) => updateInput('dietType', e.target.value)}
                className="sr-only"
              />
              <div className="flex items-center gap-4">
                <span className="text-3xl" aria-hidden="true">{option.icon}</span>
                <div>
                  <span className="block text-base font-bold text-gray-900 dark:text-white">
                    {option.label}
                  </span>
                  <span className="block text-xs text-gray-500 dark:text-gray-400">
                    {option.description}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="block text-sm font-bold text-gray-900 dark:text-white">
                  {option.emissions.toLocaleString()} kg
                </span>
                <span className="block text-[10px] uppercase tracking-wider text-gray-400 font-bold">
                  CO₂e / year
                </span>
              </div>
            </label>
          );
        })}
      </div>

      {/* Live subtotal block */}
      <div 
        className="mt-6 rounded-2xl bg-gray-100 p-4 transition-colors duration-200 dark:bg-gray-800"
        aria-live="polite"
        aria-atomic="true"
      >
        <div className="flex justify-between items-center">
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Dietary Subtotal:
          </span>
          <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
            {breakdown.diet.toLocaleString()} kg CO₂e / year
          </span>
        </div>
      </div>
    </div>
  );
}
