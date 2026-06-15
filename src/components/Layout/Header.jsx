import React, { useState, useEffect } from 'react';
import { useCarbonContext } from '../../context/CarbonContext';
import { LOGO_RAPID_CLICKS_LIMIT } from '../../constants';

/**
 * Global Header component. Coordinates theme toggles and resets,
 * and handles the logo 5-click rapid populate feature.
 * 
 * @returns {React.JSX.Element} Sticky header container.
 */
export default function Header() {
  const { triggerAutoPopulate, resetCalculator } = useCarbonContext();
  const [clickCount, setClickCount] = useState(0);
  const [lastClick, setLastClick] = useState(0);
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'light';
    }
    return 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleLogoClick = () => {
    const now = Date.now();
    if (now - lastClick < 1000) {
      const newCount = clickCount + 1;
      if (newCount >= LOGO_RAPID_CLICKS_LIMIT) {
        triggerAutoPopulate();
        setClickCount(0);
      } else {
        setClickCount(newCount);
      }
    } else {
      setClickCount(1);
    }
    setLastClick(now);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md transition-colors duration-200 dark:border-gray-800 dark:bg-gray-900/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo and Tagline */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleLogoClick}
            className="flex items-center gap-2 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 rounded-lg p-1"
            aria-label="EcoTrace Logo - click 5 times rapidly to trigger test populate mode"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-600 text-white font-bold text-xl select-none" aria-hidden="true">
              🌱
            </span>
            <div>
              <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white block leading-none">
                EcoTrace
              </span>
              <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">
                Measure. Understand. Reduce.
              </span>
            </div>
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={resetCalculator}
            className="rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 transition hover:bg-gray-50 dark:hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600"
          >
            Reset
          </button>
          
          <button
            onClick={toggleTheme}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700 transition hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
      </div>
    </header>
  );
}
