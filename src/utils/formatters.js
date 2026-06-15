// @ts-nocheck
/**
 * Formatting utilities for metrics and dates.
 */

/**
 * Formats carbon values in kg to a fixed two-decimal string representing tonnes.
 * 
 * @param {number|string} kg - The weight in kilograms.
 * @returns {string} The formatted weight in tonnes (e.g. "3.40").
 */
export function formatTonnes(kg) {
  const num = Number(kg);
  if (isNaN(num) || !isFinite(num)) {
    return '0.00';
  }
  return (num / 1000).toFixed(2);
}

/**
 * Converts an ISO date string to a human-readable localized short date format.
 * 
 * @param {string} isoString - The ISO date string.
 * @returns {string} Localized date string (e.g., "Jun 15, 2026") or empty string if invalid.
 */
export function formatDate(isoString) {
  if (!isoString) return '';
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return '';
  }
}
