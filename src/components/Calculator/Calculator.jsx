import React from 'react';
import { useCarbonContext } from '../../context/CarbonContext';
import ProgressBar from '../Layout/ProgressBar';
import StepTransport from './StepTransport';
import StepHome from './StepHome';
import StepDiet from './StepDiet';
import StepShopping from './StepShopping';
import { formatTonnes } from '../../utils/formatters';

export default function Calculator() {
  const {
    currentStep,
    handleNext,
    handleBack,
    submitCalculation,
    totalKg,
    totalTonnes
  } = useCarbonContext();

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepTransport />;
      case 2:
        return <StepHome />;
      case 3:
        return <StepDiet />;
      case 4:
        return <StepShopping />;
      default:
        return <StepTransport />;
    }
  };

  return (
    <section className="mx-auto max-w-3xl rounded-2xl border border-gray-200 bg-white p-6 transition-all duration-200 dark:border-gray-800 dark:bg-gray-900 md:p-8">
      {/* ProgressBar */}
      <ProgressBar />

      {/* Step Contents */}
      <div className="mt-8 min-h-[350px]">
        {renderStep()}
      </div>

      {/* Navigation & Live Totals */}
      <div className="mt-8 flex flex-col gap-4 border-t border-gray-100 pt-6 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-between">
        
        {/* Running total element */}
        <div 
          className="flex items-center gap-2"
          aria-live="polite"
          aria-atomic="true"
        >
          <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">
            Running Annual Total:
          </span>
          <span className="text-xl font-extrabold text-primary-600 dark:text-primary-400">
            {formatTonnes(totalKg)} tonnes CO₂e
          </span>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 justify-end">
          {currentStep > 1 && (
            <button
              onClick={handleBack}
              className="rounded-xl border border-gray-200 bg-transparent px-5 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus:ring-offset-gray-900 transition-all duration-200"
            >
              Back
            </button>
          )}

          {currentStep < 4 ? (
            <button
              onClick={handleNext}
              className="rounded-xl bg-primary-600 px-6 py-3 text-sm font-bold text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-all duration-200"
            >
              Next Step
            </button>
          ) : (
            <button
              onClick={submitCalculation}
              className="rounded-xl bg-primary-600 px-6 py-3 text-sm font-bold text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-all duration-200"
            >
              Calculate footprint
            </button>
          )}
        </div>

      </div>
    </section>
  );
}
