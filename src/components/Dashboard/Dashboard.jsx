// @ts-nocheck
import { useCarbonContext } from '../../context/CarbonContext';
import { getFootprintVerdict } from '../../utils';
import ComparisonChart from './ComparisonChart';
import FootprintChart from './FootprintChart';
import ContextCard from './ContextCard';
import Tracker from '../Tracker/Tracker';
import FutureSimulator from './FutureSimulator';
import VerdictCard from './VerdictCard';
import TelemetryWidget from './TelemetryWidget';
import { CONTEXT_MULTIPLIERS } from '../../constants';

/**
 * Main analytics dashboard summarizing carbon breakdown, regional benchmarks,
 * environmental telemetry, historical goals tracking, and simulations.
 * 
 * @returns {React.JSX.Element} Dashboard container.
 */
export default function Dashboard() {
  const {
    breakdown,
    totalKg,
    totalTonnes,
    resetCalculator
  } = useCarbonContext();

  const { color } = getFootprintVerdict(totalTonnes);

  // Context math equivalencies
  const flightsEquiv = Math.round(totalKg / CONTEXT_MULTIPLIERS.FLIGHT);
  const treesEquiv = Math.round(totalKg / CONTEXT_MULTIPLIERS.TREE);
  const kmDrivenEquiv = Math.round(totalKg / CONTEXT_MULTIPLIERS.PETROL_CAR);

  return (
    <section className="space-y-8">
      {/* Header and Recalculate */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white md:text-3xl">Your Footprint Analysis</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            A comprehensive breakdown of your impact, regional comparisons, and telemetry.
          </p>
        </div>
        <button
          onClick={resetCalculator}
          className="self-start rounded-xl bg-primary-600 px-5 py-3 text-sm font-bold text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-all duration-200"
        >
          🔄 Recalculate Footprint
        </button>
      </div>

      {/* Hero verdict card and Air Quality telemetry */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <VerdictCard />
        <TelemetryWidget />
      </div>

      {/* Chart Visualizations */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <h2 className="text-sm font-extrabold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-4">
            Comparison Against Benchmarks
          </h2>
          <ComparisonChart userScoreTonnes={totalTonnes} userColor={color} />
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <h2 className="text-sm font-extrabold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-4">
            Footprint Segment Breakdown
          </h2>
          <FootprintChart breakdown={breakdown} />
        </div>
      </div>

      {/* Equivalency Context Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <ContextCard
          title="Transatlantic Flights"
          value={flightsEquiv}
          unit="return flights"
          icon="✈️"
          description="A single return flight from London to New York emits roughly 1.2 tonnes of carbon per passenger."
        />
        <ContextCard
          title="Tree Offsets Required"
          value={treesEquiv}
          unit="trees / year"
          icon="🌳"
          description="A mature tree absorbs roughly 21 kg of CO₂ annually from our atmosphere."
        />
        <ContextCard
          title="Petrol Car Distance"
          value={kmDrivenEquiv}
          unit="kilometers"
          icon="🚗"
          description="Equivalent to driving a standard petrol vehicle, producing 0.21 kg CO₂e per kilometer."
        />
      </div>

      {/* Future Simulator */}
      <FutureSimulator />

      {/* Goals Tracker */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <Tracker />
      </div>
    </section>
  );
}
