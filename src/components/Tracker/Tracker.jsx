import React from 'react';
import { useCarbonContext } from '../../context/CarbonContext';
import { formatTonnes, formatDate } from '../../utils/formatters';
import { generateRecommendations } from '../../utils/recommendations';

export default function Tracker() {
  const {
    history,
    totalKg,
    reductionGoal,
    setReductionGoal,
    breakdown
  } = useCarbonContext();

  // Calculate target saving
  const targetSavingKg = totalKg * (reductionGoal / 100);

  // Get recommendations and see which ones fit the target
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

  // Comparison logic with previous calculation
  let comparisonText = '';
  let trendIndicator = null;
  if (history.length > 1) {
    const currentScore = history[0].score;
    const previousScore = history[1].score;
    const diff = currentScore - previousScore;
    const absDiffTonnes = formatTonnes(Math.abs(diff));

    if (diff > 0) {
      comparisonText = `Last time you calculated: ${formatTonnes(previousScore)} tonnes on ${formatDate(history[1].date)}. You're UP by ${absDiffTonnes} tonnes.`;
      trendIndicator = <span className="text-red-500 font-extrabold">▲ Up</span>;
    } else if (diff < 0) {
      comparisonText = `Last time you calculated: ${formatTonnes(previousScore)} tonnes on ${formatDate(history[1].date)}. You're DOWN by ${absDiffTonnes} tonnes.`;
      trendIndicator = <span className="text-green-600 dark:text-green-400 font-extrabold">▼ Down</span>;
    } else {
      comparisonText = `Last time you calculated: ${formatTonnes(previousScore)} tonnes on ${formatDate(history[1].date)}. Your footprint is unchanged.`;
      trendIndicator = <span className="text-gray-500 font-extrabold">✦ Constant</span>;
    }
  } else {
    comparisonText = 'This is your first carbon calculation! Welcome to EcoTrace. Try setting a reduction goal below.';
  }

  // Draw simple SVG sparkline for history (up to last 5 runs)
  const renderSparkline = () => {
    if (history.length < 2) return null;

    const scores = history.slice(0, 5).reverse().map(h => h.score);
    const min = Math.min(...scores);
    const max = Math.max(...scores);
    const range = max - min || 1;

    const width = 120;
    const height = 40;
    const padding = 5;

    const points = scores.map((val, idx) => {
      const x = padding + (idx / (scores.length - 1)) * (width - 2 * padding);
      const y = padding + (height - 2 * padding) - ((val - min) / range) * (height - 2 * padding);
      return `${x},${y}`;
    }).join(' ');

    return (
      <div className="flex items-center gap-3">
        <div>
          <span className="block text-[10px] font-bold text-gray-400 uppercase">Trend Sparkline</span>
          <span className="text-xs text-gray-500 font-semibold">(last {scores.length} runs)</span>
        </div>
        <svg 
          width={width} 
          height={height} 
          className="border border-gray-100 dark:border-gray-800 rounded-lg bg-gray-50 dark:bg-gray-950/20"
          aria-hidden="true"
        >
          <polyline
            fill="none"
            stroke="#16a34a"
            strokeWidth="2.5"
            points={points}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {scores.map((val, idx) => {
            const x = padding + (idx / (scores.length - 1)) * (width - 2 * padding);
            const y = padding + (height - 2 * padding) - ((val - min) / range) * (height - 2 * padding);
            return (
              <circle
                key={idx}
                cx={x}
                cy={y}
                r="3.5"
                className="fill-primary-600 stroke-white dark:stroke-gray-900"
                strokeWidth="1.5"
              />
            );
          })}
        </svg>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* History comparison banner */}
      <div className="border-b border-gray-100 pb-4 dark:border-gray-800 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-sm font-extrabold uppercase tracking-widest text-gray-500 dark:text-gray-400">
            Progress Tracking
          </h2>
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            {comparisonText}
          </p>
        </div>
        <div className="flex items-center gap-4">
          {trendIndicator && <div className="text-sm font-semibold">{trendIndicator}</div>}
          {renderSparkline()}
        </div>
      </div>

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
      {history.length > 0 && (
        <div className="pt-2">
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">
            Historical Runs
          </h3>
          <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-gray-800">
            <table className="w-full border-collapse text-left text-xs text-gray-600 dark:text-gray-400">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-850 font-bold border-b border-gray-100 dark:border-gray-800 text-gray-700 dark:text-gray-300">
                  <th className="p-3">Run Date</th>
                  <th className="p-3">Carbon Footprint</th>
                  <th className="p-3">Benchmarked Verdict</th>
                </tr>
              </thead>
              <tbody>
                {history.map((h, i) => {
                  const tonnes = Number((h.score / 1000).toFixed(2));
                  let badge = <span className="px-2 py-0.5 rounded-full font-bold bg-green-50 text-green-600 dark:bg-green-950/20 dark:text-green-400">Low (&lt;4t)</span>;
                  if (tonnes >= 4 && tonnes <= 8) {
                    badge = <span className="px-2 py-0.5 rounded-full font-bold bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400">Moderate (4-8t)</span>;
                  } else if (tonnes > 8) {
                    badge = <span className="px-2 py-0.5 rounded-full font-bold bg-red-50 text-red-600 dark:bg-red-950/20 dark:text-red-400">High (&gt;8t)</span>;
                  }
                  return (
                    <tr key={i} className="border-b border-gray-100 dark:border-gray-800 last:border-none">
                      <td className="p-3 font-semibold">{formatDate(h.date)}</td>
                      <td className="p-3 font-bold text-gray-900 dark:text-white">{tonnes} tonnes CO₂e</td>
                      <td className="p-3">{badge}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
