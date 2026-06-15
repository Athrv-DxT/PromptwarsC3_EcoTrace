import { useCarbonContext } from '../../context/CarbonContext';
import { formatTonnes } from '../../utils';
import { generateRecommendations } from '../../utils/recommendations';
import ProgressSummary from './ProgressSummary';
import HistoryTable from './HistoryTable';

/**
 * Progress tracker dashboard widget.
 * Orchestrates past run telemetry, reduction goal settings, and run logs.
 * 
 * @returns {React.JSX.Element} Tracker container.
 */
export default function Tracker() {
  const {
    totalKg,
    reductionGoal,
    setReductionGoal,
    breakdown
  } = useCarbonContext();

  // Calculate target saving
  const targetSavingKg = totalKg * (reductionGoal / 100);

  // Determine top recommendations that fit the target
  const tips = generateRecommendations(breakdown);
  let cumulativeSaving = 0;
  const tipsToReachGoal = [];

  for (const tip of tips) {
    if (cumulativeSaving < targetSavingKg) {
      tipsToReachGoal.push(tip);
      cumulativeSaving += tip.potentialSaving;
    } else {
      break;
    }
  }

  return (
    <div className="space-y-6">
      {/* History comparison and sparkline */}
      <ProgressSummary />

      {/* Reduction Goal input */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="goal-input" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
            Set Carbon Reduction Goal (%)
          </label>
          <div className="flex items-center gap-3">
            <input
              id="goal-input"
              type="number"
              min="1"
              max="100"
              value={reductionGoal}
              onChange={(e) => setReductionGoal(Math.max(1, Math.min(100, Number(e.target.value))))}
              className="w-24 rounded-xl border border-gray-300 bg-white px-4 py-2 text-center font-bold text-gray-900 shadow-sm focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-600 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
            <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">
              Goal Target: <span className="font-extrabold text-gray-800 dark:text-white">-{formatTonnes(targetSavingKg)} tonnes CO₂e</span>
            </span>
          </div>
        </div>

        {/* Goal results */}
        <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-950/20 flex flex-col justify-center">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
            Goal Completion Plan
          </h3>
          {tipsToReachGoal.length > 0 ? (
            <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 leading-normal">
              Implementing the top <span className="font-black text-primary-600 dark:text-primary-400">{tipsToReachGoal.length}</span> recommendations below yields a savings of <span className="font-bold text-gray-800 dark:text-white">{(cumulativeSaving / 1000).toFixed(2)} tonnes</span>, meeting your target!
            </p>
          ) : (
            <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 leading-normal">
              No recommendations available for your current footprint setup. Enjoy your sustainable lifestyle!
            </p>
          )}
        </div>
      </div>

      {/* History table log */}
      <HistoryTable />
    </div>
  );
}
