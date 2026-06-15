import React from 'react';
import { useCarbonContext } from '../../context/CarbonContext';
import { COUNTRIES_LIST } from '../../constants';

/**
 * CountrySelector component to manage regional grid factor lookups.
 * 
 * @returns {React.JSX.Element} Selector element.
 */
export default function CountrySelector() {
  const {
    inputs,
    updateInput,
    countryRegionInfo,
    countryLoading,
    countryError
  } = useCarbonContext();

  return (
    <div className="space-y-2">
      <label htmlFor="country-selector" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
        Country (determines grid electricity factor)
      </label>
      <select
        id="country-selector"
        value={inputs.country}
        onChange={(e) => updateInput('country', e.target.value)}
        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-600 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
      >
        {COUNTRIES_LIST.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
      
      {countryLoading && (
        <p className="text-xs text-primary-600 dark:text-primary-400 flex items-center gap-1">
          <span className="inline-block animate-spin">⏳</span> Fetching regional electricity factor...
        </p>
      )}
      
      {!countryLoading && countryRegionInfo && (
        <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
          {countryRegionInfo}
        </p>
      )}

      {countryError && (
        <p className="text-xs text-red-500 dark:text-red-400" role="alert">
          Could not fetch region details ({countryError}). Using estimated factor.
        </p>
      )}
    </div>
  );
}
