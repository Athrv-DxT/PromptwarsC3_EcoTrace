import React, { useState, useEffect } from 'react';

// Memoized FactCard child component
const FactCard = React.memo(({ fact, number, total }) => {
  return (
    <div className="text-center px-4 py-8 md:px-12 min-h-[140px] flex flex-col justify-center">
      <span className="block text-[10px] font-extrabold uppercase tracking-widest text-primary-600 dark:text-primary-400 mb-3 select-none">
        Did You Know? — Fact {number} of {total}
      </span>
      <p className="text-base font-bold text-gray-800 dark:text-gray-100 leading-relaxed max-w-2xl mx-auto">
        &ldquo;{fact}&rdquo;
      </p>
    </div>
  );
});

FactCard.displayName = 'FactCard';

export default function FactCarousel() {
  const facts = [
    "The average person in India emits 1.9 tonnes CO2e/year — one of the lowest in the world",
    "Aviation is responsible for 3.5% of effective climate forcing despite carrying only 11% of passengers",
    "A plant-based diet for one year saves the equivalent of driving 8,000 km in a petrol car",
    "Renewable energy capacity surpassed coal globally for the first time in 2023",
    "The 1.5°C target requires global per-capita emissions to fall to 2.5 tonnes by 2030",
    "Extending a smartphone's life by just one extra year saves 70 kg CO2e — equivalent to 333 km of driving"
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % facts.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused, facts.length]);

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      className="mx-auto max-w-3xl rounded-2xl border border-gray-200 bg-white p-4 transition-colors duration-200 dark:border-gray-800 dark:bg-gray-900"
      aria-roledescription="carousel"
      aria-label="Environmental Facts Carousel"
    >
      {/* Fact Card Slide */}
      <div 
        aria-live="polite" 
        className="transition-all duration-300"
      >
        <FactCard 
          fact={facts[currentIndex]} 
          number={currentIndex + 1} 
          total={facts.length} 
        />
      </div>

      {/* Slide dots indicators */}
      <div className="flex justify-center gap-2 pb-2">
        {facts.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-2.5 w-2.5 rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600
              ${currentIndex === idx 
                ? 'bg-primary-600 w-6' 
                : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400'
              }`}
            aria-label={`Go to slide ${idx + 1}`}
            aria-selected={currentIndex === idx}
          />
        ))}
      </div>
    </div>
  );
}
