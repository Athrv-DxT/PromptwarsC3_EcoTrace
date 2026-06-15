import { useCarbonContext } from '../../context/CarbonContext';
import { getFootprintVerdict } from '../../utils';

/**
 * Renders the verdict card highlighting the user's annual carbon footprint score
 * and benchmarking category status (Excellent, Moderate, High).
 * 
 * @returns {React.JSX.Element} Verdict layout.
 */
export default function VerdictCard() {
  const { totalTonnes } = useCarbonContext();
  const { textClass, verdictTitle, verdictDesc, icon } = getFootprintVerdict(totalTonnes);

  return (
    <div className={`col-span-1 md:col-span-2 rounded-2xl border p-6 flex flex-col justify-between transition-colors duration-200 ${textClass}`}>
      <div className="flex items-start gap-4">
        <span className="text-4xl select-none" aria-hidden="true">{icon}</span>
        <div className="space-y-1">
          <h2 className="text-lg font-black uppercase tracking-wider">{verdictTitle}</h2>
          <p className="text-sm font-medium leading-relaxed opacity-90">{verdictDesc}</p>
        </div>
      </div>
      <div className="mt-6">
        <span className="block text-[10px] uppercase font-extrabold tracking-widest opacity-75">
          Annual Emissions Score
        </span>
        <span className="text-5xl font-black tracking-tight">
          {totalTonnes} <span className="text-2xl font-bold">tonnes CO₂e</span>
        </span>
      </div>
    </div>
  );
}
