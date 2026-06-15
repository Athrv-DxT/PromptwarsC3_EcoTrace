import React from 'react';
import { useCarbonContext } from '../../context/CarbonContext';
import { formatTonnes, formatDate } from '../../utils';

/**
 * ProgressSummary component to render comparative stats and sparklines for the user's past runs.
 * 
 * @returns {React.JSX.Element|null} Progress telemetry block.
 */
export default function ProgressSummary() {
  const { history } = useCarbonContext();

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
  );
}
