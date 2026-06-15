// @ts-nocheck
import { useCarbonContext } from '../../context/CarbonContext';

/**
 * CarTypeSelector component presenting radio options for car drive configuration.
 * 
 * @returns {React.JSX.Element} Selector element.
 */
export default function CarTypeSelector() {
  const { inputs, updateInput } = useCarbonContext();

  const carOptions = [
    { id: 'none', label: 'None', icon: '🚶' },
    { id: 'petrol', label: 'Petrol', icon: '⛽' },
    { id: 'diesel', label: 'Diesel', icon: '🛢️' },
    { id: 'hybrid', label: 'Hybrid', icon: '⚡🔋' },
    { id: 'ev', label: 'EV', icon: '🔌' },
  ];

  return (
    <div className="space-y-2">
      <span className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
        Primary Car Type
      </span>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {carOptions.map((car) => (
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
  );
}
