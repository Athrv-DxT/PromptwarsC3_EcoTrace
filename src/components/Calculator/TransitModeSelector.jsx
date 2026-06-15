import { useCarbonContext } from '../../context/CarbonContext';

/**
 * TransitModeSelector component presenting radio options for public transit mode type selection.
 * 
 * @returns {React.JSX.Element|null} Selector element.
 */
export default function TransitModeSelector() {
  const { inputs, updateInput } = useCarbonContext();

  if (Number(inputs.publicTransitHours) <= 0) return null;

  const transitModes = [
    { id: 'bus', label: 'Bus', icon: '🚌' },
    { id: 'train', label: 'Train', icon: '🚊' },
    { id: 'both', label: 'Mixed', icon: '🚏' }
  ];

  return (
    <div className="space-y-2">
      <span className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
        Transit Mode Type
      </span>
      <div className="flex gap-4">
        {transitModes.map((mode) => (
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
  );
}
