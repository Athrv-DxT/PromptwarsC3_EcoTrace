import React, { createContext, useState, useContext } from 'react';
import { useLocalStorage, useCarbon, useCountryElectricity } from '../hooks';
import { validateStepInputs } from '../utils';
import {
  INITIAL_INPUTS,
  SAMPLE_POPULATE_DATA,
  HISTORY_LIMIT,
  DEFAULT_REDUCTION_GOAL
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

  // Delegate Country API loading and state storage to custom hook
  const {
    gridFactor,
    countryRegionInfo,
    countryLoading,
    countryError
  } = useCountryElectricity(inputs.country);

  // localStorage history management (no PII, only score & date)
  const [history, setHistory] = useLocalStorage('ecotrace_history', []);
  
  // Reduction Goal target percentage (default 20%)
  const [reductionGoal, setReductionGoal] = useState(DEFAULT_REDUCTION_GOAL);

  // Live footprint calculation
  const { breakdown, totalKg, totalTonnes } = useCarbon(inputs, gridFactor);

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
