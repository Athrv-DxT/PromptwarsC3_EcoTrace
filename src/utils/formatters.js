/**
 * Formats carbon values and date strings.
 * 
 * TEST CASES:
 * formatTonnes(3402) => '3.40'
 * formatTonnes(12000) => '12.00'
 * formatTonnes(0) => '0.00'
 * formatDate('2026-06-15T18:50:35.000Z') => Localized date representation, e.g. 'Jun 15, 2026'
 */

export function formatTonnes(kg) {
  const num = Number(kg);
  if (isNaN(num) || !isFinite(num)) {
    return '0.00';
  }
  return (num / 1000).toFixed(2);
}

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
  } catch (e) {
    return '';
  }
}
