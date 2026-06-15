import React, { createContext, useState, useEffect, useContext } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { validateInput } from '../utils/validators';
import { useCarbon } from '../hooks/useCarbon';

const CarbonContext = createContext();

const initialInputs = {
  carType: 'none',
  weeklyKm: 0,
  shortFlights: 0,
  longFlights: 0,
  publicTransitHours: 0,
  publicTransitType: 'bus',
  country: 'United Kingdom',
  monthlyKwh: 0,
  heatingType: 'none',
  monthlyGas: 0,
  dietType: 'vegan',
  monthlyClothes: 0,
  yearlyElectronics: 0
};

export function CarbonProvider({ children }) {
  const [inputs, setInputs] = useState(initialInputs);
  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [gridFactor, setGridFactor] = useState(0.233); // Defaults to UK grid
  const [countryRegionInfo, setCountryRegionInfo] = useState('');
  const [countryLoading, setCountryLoading] = useState(false);
  const [countryError, setCountryError] = useState(null);

  // localStorage history management (no PII, only score & date)
  const [history, setHistory] = useLocalStorage('ecotrace_history', []);
  
  // Reduction Goal target percentage (default 20%)
  const [reductionGoal, setReductionGoal] = useState(20);

  // Live footprint calculation
  const { breakdown, totalKg, totalTonnes } = useCarbon(inputs, gridFactor);

  // REST Countries API call when inputs.country changes
  useEffect(() => {
    if (!inputs.country) return;

    let active = true;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    setCountryLoading(true);
    setCountryError(null);

    const fetchCountryInfo = async () => {
      try {
        const res = await fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(inputs.country)}`, {
          signal: controller.signal
        });
        
        if (!res.ok) {
          throw new Error(`RestCountries API responded with status ${res.status}`);
        }
        
        const data = await res.json();
        clearTimeout(timeoutId);

        if (!active) return;

        const countryData = data[0];
        const region = countryData?.region;
        const subregion = countryData?.subregion;

        let matchedFactor = 0.475; // Global average default
        let displayRegion = subregion || region || 'Unknown';

        // Grid Factors mapping
        const nameLower = inputs.country.toLowerCase();
        if (nameLower === 'india' || subregion === 'Southern Asia') {
          matchedFactor = 0.82;
          displayRegion = 'South Asia';
        } else if (region === 'Europe') {
          matchedFactor = 0.233;
          displayRegion = 'Western Europe';
        } else if (subregion === 'Northern America') {
          matchedFactor = 0.386;
          displayRegion = 'North America';
        } else if (subregion === 'Eastern Asia') {
          matchedFactor = 0.555;
          displayRegion = 'East Asia';
        } else if (subregion === 'South-Eastern Asia') {
          matchedFactor = 0.521;
          displayRegion = 'Southeast Asia';
        } else if (subregion === 'Western Asia' || subregion === 'Middle East') {
          matchedFactor = 0.63;
          displayRegion = 'Middle East';
        } else if (region === 'Africa') {
          matchedFactor = 0.481;
          displayRegion = 'Africa';
        }

        setGridFactor(matchedFactor);
        setCountryRegionInfo(`You're in ${displayRegion} — your grid emission factor is ${matchedFactor} kg CO2e/kWh.`);
        setCountryLoading(false);
      } catch (err) {
        clearTimeout(timeoutId);
        if (!active) return;
        console.error('REST Countries API error:', err);
        
        // Fallback checks
        let matchedFactor = 0.475;
        let displayRegion = 'Global Average';
        const name = inputs.country.toLowerCase();

        if (name.includes('india')) {
          matchedFactor = 0.82;
          displayRegion = 'South Asia (India)';
        } else if (name.includes('united kingdom') || name.includes('germany') || name.includes('france') || name.includes('italy')) {
          matchedFactor = 0.233;
          displayRegion = 'Western Europe';
        } else if (name.includes('united states') || name.includes('canada')) {
          matchedFactor = 0.386;
          displayRegion = 'North America';
        } else if (name.includes('china') || name.includes('japan')) {
          matchedFactor = 0.555;
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

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  // Logo 5-click rapid populate
  const triggerAutoPopulate = () => {
    const sampleData = {
      carType: 'petrol',
      weeklyKm: 200,
      shortFlights: 4,
      longFlights: 2,
      monthlyKwh: 350,
      heatingType: 'gas',
      monthlyGas: 400,
      dietType: 'omnivore',
      monthlyClothes: 3,
      yearlyElectronics: 2,
      country: 'United Kingdom',
      publicTransitHours: 10,
      publicTransitType: 'bus'
    };
    setInputs(sampleData);
    setErrors({});
    setCurrentStep(4); // Advance to end or reset
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
    // Add current run to history (limit to last 5 runs)
    const newEntry = {
      score: totalKg,
      date: new Date().toISOString()
    };
    setHistory(prev => {
      const updated = [newEntry, ...prev];
      return updated.slice(0, 5);
    });
    setIsSubmitted(true);
  };

  const resetCalculator = () => {
    setInputs(initialInputs);
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

export function useCarbonContext() {
  return useContext(CarbonContext);
}
