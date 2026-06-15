// @ts-nocheck
import { useCarbonContext } from '../../context/CarbonContext';

/**
 * FlightInputs component rendering fields for short-haul and long-haul annual flights.
 * 
 * @returns {React.JSX.Element} Flight inputs block.
 */
export default function FlightInputs() {
  const { inputs, errors, updateInput } = useCarbonContext();

  return (
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
  );
}
