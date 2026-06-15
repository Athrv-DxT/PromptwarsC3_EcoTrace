import { useCarbonContext } from '../../context/CarbonContext';
import CountrySelector from './CountrySelector';
import CarTypeSelector from './CarTypeSelector';
import TransitModeSelector from './TransitModeSelector';
import FlightInputs from './FlightInputs';

/**
 * Transportation profile step screen for carbon footprint calculator.
 * Includes car configurations, yearly flights, and weekly transit hours.
 * 
 * @returns {React.JSX.Element} Step transit view container.
 */
export default function StepTransport() {
  const {
    inputs,
    errors,
    updateInput,
    breakdown
  } = useCarbonContext();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Transportation Profile</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Provide your travel details to calculate your transit footprint.
        </p>
      </div>

      {/* Grid Country Selector */}
      <CountrySelector />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Car Type Selector */}
        <CarTypeSelector />

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

      {/* Flight Inputs Component */}
      <FlightInputs />

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

        {/* Transit Mode Selector Component */}
        <TransitModeSelector />
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
