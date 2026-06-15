import { FOOTPRINT_THRESHOLDS } from '../constants/appConstants';

/**
 * Utility to determine user verdict categories based on carbon footprint score.
 */

/**
 * Resolves styling and text descriptions for the user's carbon footprint score.
 * 
 * @param {number} totalTonnes - Carbon footprint score in tonnes.
 * @returns {{ color: string, textClass: string, verdictTitle: string, verdictDesc: string, icon: string }} Verdict payload.
 */
export function getFootprintVerdict(totalTonnes) {
  let color = '#16a34a'; // Green
  let textClass = 'text-green-600 dark:text-green-400 border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-900/50';
  let verdictTitle = 'Excellent Footprint';
  let verdictDesc = 'Your carbon footprint is low (under 4 tonnes). You are meeting sustainable benchmarks. Keep up the clean habits!';
  let icon = '🌱';

  if (totalTonnes >= FOOTPRINT_THRESHOLDS.LOW && totalTonnes <= FOOTPRINT_THRESHOLDS.MODERATE_MAX) {
    color = '#d97706'; // Amber
    textClass = 'text-amber-600 dark:text-amber-400 border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-900/50';
    verdictTitle = 'Moderate Footprint';
    verdictDesc = 'Your carbon footprint is average (4 to 8 tonnes). Adopting a few recommendations below can easily transition you to low-impact.';
    icon = '⚠️';
  } else if (totalTonnes > FOOTPRINT_THRESHOLDS.MODERATE_MAX) {
    color = '#dc2626'; // Red
    textClass = 'text-red-600 dark:text-red-400 border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-900/50';
    verdictTitle = 'High Footprint';
    verdictDesc = 'Your carbon footprint is above average (over 8 tonnes). Review our personalized tips to slash high energy and transport outputs.';
    icon = '🚨';
  }

  return { color, textClass, verdictTitle, verdictDesc, icon };
}
