/**
 * Validates a numeric value within a specific range.
 * Returns null if valid, or a descriptive error message if invalid.
 * 
 * TEST CASES:
 * validateInput('100', 0, 1000, 'km') => null
 * validateInput('-5', 0, 1000, 'km') => 'Please enter a value between 0 and 1000 km'
 * validateInput('1500', 0, 1000, 'km') => 'Please enter a value between 0 and 1000 km'
 * validateInput('abc', 0, 1000, 'km') => 'Please enter a valid number'
 * validateInput('NaN', 0, 1000, 'km') => 'Please enter a valid number'
 */

export function validateInput(value, min, max, unit) {
  if (value === '' || value === undefined || value === null) {
    return `Please enter a value between ${min} and ${max} ${unit}`;
  }
  
  const num = Number(value);
  
  if (isNaN(num) || !isFinite(num)) {
    return 'Please enter a valid number';
  }
  
  if (num < min || num > max) {
    return `Please enter a value between ${min} and ${max} ${unit}`;
  }
  
  return null;
}

export function sanitizeCountry(country) {
  if (!country) return '';
  // Sanitize to avoid injection issues, and encode
  return encodeURIComponent(country.trim());
}
