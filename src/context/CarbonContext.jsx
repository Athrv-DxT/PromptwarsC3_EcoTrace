import React, { createContext, useState, useEffect, useContext } from 'react';
import { useLocalStorage, useCarbon } from '../hooks';
import { fetchCountryElectricityInfo } from '../services';
import { validateStepInputs } from '../utils';
import {
  INITIAL_INPUTS,
  SAMPLE_POPULATE_DATA,
  HISTORY_LIMIT,
  DEFAULT_REDUCTION_GOAL,
  API_TIMEOUT_MS,
  GRID_FACTORS
} from '../constants';

const CarbonContext = createContext();

/**
 * Context Provider that coordinates the global carbon tracking state,
 * inputs, validation errors, history logs, and triggers the useCarbon calculator hook.
 * 
 * @param {Object} props - Component properties.
 * @param {React.ReactNode} props.children - Child nodes.
 * @returns {React.JSX.Element} Provider component.
 */
export function CarbonProvider({ children }) {
  const [inputs, setInputs] = useState(INITIAL_INPUTS);
  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [gridFactor, setGridFactor] = useState(GRID_FACTORS.EUROPE); // Defaults to UK/Europe grid
  const [countryRegionInfo, setCountryRegionInfo] = useState('');
  const [countryLoading, setCountryLoading] = useState(false);
  const [countryError, setCountryError] = useState(null);

  // localStorage history management (no PII, only score & date)
  const [history, setHistory] = useLocalStorage('ecotrace_history', []);
  
  // Reduction Goal target percentage (default 20%)
  const [reductionGoal, setReductionGoal] = useState(DEFAULT_REDUCTION_GOAL);

  // Live footprint calculation
  const { breakdown, totalKg, totalTonnes } = useCarbon(inputs, gridFactor);

  // REST Countries API call when inputs.country changes
  useEffect(() => {
    if (!inputs.country) return;

    let active = true;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

    setCountryLoading(true);
    setCountryError(null);

    const fetchCountryInfo = async () => {
      try {
        const { gridFactor: matchedFactor, displayRegion } = await fetchCountryElectricityInfo(
          inputs.country,
          controller.signal
        );
        clearTimeout(timeoutId);

        if (!active) return;

        setGridFactor(matchedFactor);
        setCountryRegionInfo(`You're in ${displayRegion} — your grid emission factor is ${matchedFactor} kg CO2e/kWh.`);
        setCountryLoading(false);
      } catch (err) {
        clearTimeout(timeoutId);
        if (!active) return;
        console.error('REST Countries API error:', err);
        
        // Fallback checks on connection errors or abort timeouts
        let matchedFactor = GRID_FACTORS.DEFAULT;
        let displayRegion = 'Global Average';
        const name = inputs.country.toLowerCase();

        if (name.includes('india')) {
          matchedFactor = GRID_FACTORS.INDIA;
          displayRegion = 'South Asia (India)';
        } else if (name.includes('united kingdom') || name.includes('germany') || name.includes('france') || name.includes('italy')) {
          matchedFactor = GRID_FACTORS.EUROPE;
          displayRegion = 'Western Europe';
        } else if (name.includes('united states') || name.includes('canada')) {
          matchedFactor = GRID_FACTORS.NORTH_AMERICA;
          displayRegion = 'North America';
        } else if (name.includes('china') || name.includes('japan')) {
          matchedFactor = GRID_FACTORS.EAST_ASIA;
          displayRegion = 'East Asia';
        }

        setGridFactor(matchedFactor);
        setCountryRegionInfo(`You're in ${displayRegion} (estimated fallback) — your grid emission factor is ${matchedFactor} kg CO2e/kWh.`);
        setCountryLoading(false);
        setCountryError(err.name === 'AbortError' ? 'Countries API request timed out (8s).' : err.message);
      }
    };

    fetchCountryInfo();

    return () => {
      active = false;
      controller.abort();
    };
  }, [inputs.country]);

  // Update input helper
  const updateInput = (key, value) => {
    setInputs(prev => ({
      ...prev,
      [key]: value
    }));

    // Dynamic error clearing
    if (errors[key]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  // Step validator before proceeding
  const validateStep = (step) => {
    const stepErrors = validateStepInputs(step, inputs);
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  // Logo 5-click rapid populate
  const triggerAutoPopulate = () => {
    setInputs(SAMPLE_POPULATE_DATA);
    setErrors({});
    setCurrentStep(4);
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const submitCalculation = () => {
    const newEntry = {
      score: totalKg,
      date: new Date().toISOString()
    };
    setHistory(prev => {
      const updated = [newEntry, ...prev];
      return updated.slice(0, HISTORY_LIMIT);
    });
    setIsSubmitted(true);
  };

  const resetCalculator = () => {
    setInputs(INITIAL_INPUTS);
    setErrors({});
    setCurrentStep(1);
    setIsSubmitted(false);
  };

  return (
    <CarbonContext.Provider value={{
      inputs,
      errors,
      currentStep,
      isSubmitted,
      gridFactor,
      countryRegionInfo,
      countryLoading,
      countryError,
      history,
      reductionGoal,
      setReductionGoal,
      updateInput,
      handleNext,
      handleBack,
      validateStep,
      submitCalculation,
      resetCalculator,
      triggerAutoPopulate,
      setInputs,
      setCurrentStep,
      breakdown,
      totalKg,
      totalTonnes
    }}>
      {children}
    </CarbonContext.Provider>
  );
}

/**
 * Accesses the global CarbonContext.
 * 
 * @returns {Object} Carbon tracking states and functions.
 */
export function useCarbonContext() {
  return useContext(CarbonContext);
}
