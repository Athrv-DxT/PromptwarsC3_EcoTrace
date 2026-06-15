import { useCarbonContext } from '../../context/CarbonContext';

export default function ProgressBar() {
  const { currentStep, setCurrentStep, validateStep } = useCarbonContext();

  const steps = [
    { number: 1, label: 'Transport', icon: '🚗' },
    { number: 2, label: 'Home', icon: '🏠' },
    { number: 3, label: 'Diet', icon: '🥗' },
    { number: 4, label: 'Shopping', icon: '🛒' },
  ];

  const handleStepClick = (stepNumber) => {
    if (stepNumber < currentStep) {
      setCurrentStep(stepNumber);
    } else if (stepNumber > currentStep) {
      // Validate all steps between currentStep and targeted stepNumber
      let isValid = true;
      for (let s = currentStep; s < stepNumber; s++) {
        if (!validateStep(s)) {
          isValid = false;
          break;
        }
      }
      if (isValid) {
        setCurrentStep(stepNumber);
      }
    }
  };

  return (
    <div className="w-full py-6">
      <div className="relative flex items-center justify-between">
        {/* Progress Line */}
        <div className="absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 bg-gray-200 dark:bg-gray-700" aria-hidden="true" />
        <div
          className="absolute left-0 top-1/2 h-0.5 -translate-y-1/2 bg-primary-600 transition-all duration-300"
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          aria-hidden="true"
        />

        {/* Step Dots */}
        {steps.map((step) => {
          const isCompleted = step.number < currentStep;
          const isActive = step.number === currentStep;

          return (
            <button
              key={step.number}
              onClick={() => handleStepClick(step.number)}
              disabled={step.number > currentStep && !validateStep(currentStep)}
              className="relative z-10 flex flex-col items-center group focus-visible:outline-none"
              aria-current={isActive ? 'step' : undefined}
              aria-label={`Step ${step.number}: ${step.label}`}
            >
              {/* Dot Ring */}
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 bg-white transition-all duration-200 font-bold text-sm
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 dark:bg-gray-800
                  ${isActive 
                    ? 'border-primary-600 text-primary-600 ring-2 ring-primary-100 dark:ring-primary-950/30' 
                    : isCompleted 
                      ? 'border-primary-600 bg-primary-600 text-white dark:border-primary-600' 
                      : 'border-gray-300 text-gray-400 dark:border-gray-600 dark:text-gray-500 hover:border-gray-400'
                  }`}
              >
                {isCompleted ? '✓' : step.number}
              </div>

              {/* Label */}
              <span
                className={`absolute top-12 whitespace-nowrap text-xs font-semibold transition-colors duration-200
                  ${isActive 
                    ? 'text-primary-600 dark:text-primary-400' 
                    : 'text-gray-500 dark:text-gray-400'
                  }`}
              >
                <span className="hidden sm:inline mr-1">{step.icon}</span>
                {step.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
