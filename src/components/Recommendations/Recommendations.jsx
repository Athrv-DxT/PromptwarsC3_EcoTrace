import React from 'react';
import { useCarbonContext } from '../../context/CarbonContext';
import { generateRecommendations } from '../../utils/recommendations';
import RecommendationCard from './RecommendationCard';
import EcoAICoach from './EcoAICoach';

export default function Recommendations() {
  const { breakdown } = useCarbonContext();
  const tips = generateRecommendations(breakdown);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-gray-900 dark:text-white md:text-2xl">
          Personalized Reduction Plan
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Rule-based tips matching your highest emission areas, sorted by potential impact.
        </p>
      </div>

      {/* AI Sustainability Coach */}
      <EcoAICoach />

      {tips.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tips.map((tip) => (
            <RecommendationCard
              key={tip.id}
              icon={tip.icon}
              tip={tip.tip}
              detail={tip.detail}
              potentialSaving={tip.potentialSaving}
              difficulty={tip.difficulty}
              category={tip.category}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-gray-200 p-8 text-center dark:border-gray-800">
          <p className="text-sm text-gray-500 dark:text-gray-400 font-semibold">
            Your footprint is already highly optimized. Great work keeping a low impact!
          </p>
        </div>
      )}
    </div>
  );
}
