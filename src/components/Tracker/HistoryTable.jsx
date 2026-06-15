import { useCarbonContext } from '../../context/CarbonContext';
import { formatDate } from '../../utils';
import { FOOTPRINT_THRESHOLDS } from '../../constants';

/**
 * Renders the table of historical carbon calculations.
 * 
 * @returns {React.JSX.Element|null} History log layout.
 */
export default function HistoryTable() {
  const { history } = useCarbonContext();

  if (history.length === 0) return null;

  return (
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
              let badge = (
                <span className="px-2 py-0.5 rounded-full font-bold bg-green-50 text-green-600 dark:bg-green-950/20 dark:text-green-400">
                  Low (&lt;{FOOTPRINT_THRESHOLDS.LOW}t)
                </span>
              );
              if (tonnes >= FOOTPRINT_THRESHOLDS.LOW && tonnes <= FOOTPRINT_THRESHOLDS.MODERATE_MAX) {
                badge = (
                  <span className="px-2 py-0.5 rounded-full font-bold bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400">
                    Moderate ({FOOTPRINT_THRESHOLDS.LOW}-{FOOTPRINT_THRESHOLDS.MODERATE_MAX}t)
                  </span>
                );
              } else if (tonnes > FOOTPRINT_THRESHOLDS.MODERATE_MAX) {
                badge = (
                  <span className="px-2 py-0.5 rounded-full font-bold bg-red-50 text-red-600 dark:bg-red-950/20 dark:text-red-400">
                    High (&gt;{FOOTPRINT_THRESHOLDS.MODERATE_MAX}t)
                  </span>
                );
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
  );
}
