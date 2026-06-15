/**
 * Utility functions for user input validation and sanitization.
 */

/**
 * Validates a numeric value within a specific range.
 * Returns null if valid, or a descriptive error message if invalid.
 * 
 * @param {string|number} value - The input value.
 * @param {number} min - Minimum allowed value.
 * @param {number} max - Maximum allowed value.
 * @param {string} unit - The unit of measurement (e.g. km, flights).
 * @returns {string|null} The error message or null if valid.
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

/**
 * Sanitizes a country name for safe querying.
 * 
 * @param {string} country - The country name input.
 * @returns {string} Sanitized and encoded country name.
 */
export function sanitizeCountry(country) {
  if (!country) return '';
  return encodeURIComponent(country.trim());
}

/**
 * Validates all input values for a given form step.
 * 
 * @param {number} step - The step number (1 to 4).
 * @param {Object} inputs - The current form inputs object.
 * @returns {Object} Key-value map of input field errors.
 */
export function validateStepInputs(step, inputs) {
  const stepErrors = {};

  if (step === 1) {
    const kmErr = validateInput(inputs.weeklyKm, 0, 1000, 'km');
    const sfErr = validateInput(inputs.shortFlights, 0, 20, 'flights');
    const lfErr = validateInput(inputs.longFlights, 0, 10, 'flights');
    const ptErr = validateInput(inputs.publicTransitHours, 0, 40, 'hours');

    if (kmErr) stepErrors.weeklyKm = kmErr;
    if (sfErr) stepErrors.shortFlights = sfErr;
    if (lfErr) stepErrors.longFlights = lfErr;
    if (ptErr) stepErrors.publicTransitHours = ptErr;
  }

  if (step === 2) {
    const kwhErr = validateInput(inputs.monthlyKwh, 0, 2000, 'kWh');
    if (kwhErr) stepErrors.monthlyKwh = kwhErr;

    if (inputs.heatingType === 'gas') {
      const gasErr = validateInput(inputs.monthlyGas, 0, 1000, 'kWh');
      if (gasErr) stepErrors.monthlyGas = gasErr;
    }
  }

  if (step === 4) {
    const clothErr = validateInput(inputs.monthlyClothes, 0, 20, 'items');
    const elecErr = validateInput(inputs.yearlyElectronics, 0, 10, 'purchases');

    if (clothErr) stepErrors.monthlyClothes = clothErr;
    if (elecErr) stepErrors.yearlyElectronics = elecErr;
  }

  return stepErrors;
}
