// @ts-nocheck
import React from 'react';

const RecommendationCard = React.memo(({ icon, tip, detail, potentialSaving, difficulty, category }) => {
  // Color-coded difficulty badges
  const difficultyBadge = () => {
    switch (difficulty) {
      case 'easy':
        return (
          <span className="inline-flex items-center rounded-lg bg-green-50 px-2 py-0.5 text-xs font-bold text-green-700 dark:bg-green-950/20 dark:text-green-400">
            🟢 Easy
          </span>
        );
      case 'medium':
        return (
          <span className="inline-flex items-center rounded-lg bg-amber-50 px-2 py-0.5 text-xs font-bold text-amber-700 dark:bg-amber-950/20 dark:text-amber-400">
            🟡 Medium
          </span>
        );
      case 'hard':
        return (
          <span className="inline-flex items-center rounded-lg bg-red-50 px-2 py-0.5 text-xs font-bold text-red-700 dark:bg-red-950/20 dark:text-red-400">
            🔴 Hard
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-5 transition-all duration-200 hover:border-primary-600/50 hover:shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="space-y-4">
        {/* Top line category and difficulty */}
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">
            {category}
          </span>
          {difficultyBadge()}
        </div>

        {/* Tip content */}
        <div className="flex items-start gap-3">
          <span className="text-3xl select-none" aria-hidden="true">{icon}</span>
          <div className="space-y-1">
            <h3 className="text-sm font-black text-gray-900 dark:text-white leading-snug">
              {tip}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-normal">
              {detail}
            </p>
          </div>
        </div>
      </div>

      {/* Saving metric */}
      <div className="mt-5 border-t border-gray-100 pt-3 dark:border-gray-800">
        <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">
          Estimated Annual Reduction
        </span>
        <span className="text-lg font-black text-primary-600 dark:text-primary-400">
          {(potentialSaving / 1000).toFixed(2)} tonnes CO₂e
        </span>
      </div>
    </div>
  );
});

RecommendationCard.displayName = 'RecommendationCard';

export default RecommendationCard;
