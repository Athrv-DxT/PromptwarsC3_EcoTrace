import React, { Suspense } from 'react';
import { CarbonProvider, useCarbonContext } from './context/CarbonContext';
import SkipLink from './components/Layout/SkipLink';
import Header from './components/Layout/Header';
import Calculator from './components/Calculator/Calculator';
import FactCarousel from './components/Education/FactCarousel';

// Lazy loading high-weight dashboard & recommendations components
const Dashboard = React.lazy(() => import('./components/Dashboard/Dashboard'));
const Recommendations = React.lazy(() => import('./components/Recommendations/Recommendations'));

function MainContent() {
  const { isSubmitted } = useCarbonContext();

  return (
    <main 
      id="main-content" 
      className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 focus:outline-none" 
      tabIndex="-1"
    >
      {isSubmitted ? (
        <Suspense 
          fallback={
            <div className="flex h-96 items-center justify-center text-sm font-semibold text-gray-500">
              <span className="animate-spin mr-2">⏳</span> Assembling personalized analytics dashboard...
            </div>
          }
        >
          <div className="space-y-12">
            <Dashboard />
            <Recommendations />
          </div>
        </Suspense>
      ) : (
        <Calculator />
      )}

      {/* Did You Know fact rotation block */}
      <div className="mt-12 border-t border-gray-200 pt-8 dark:border-gray-800">
        <FactCarousel />
      </div>
    </main>
  );
}

export default function App() {
  return (
    <CarbonProvider>
      <div className="min-h-screen bg-gray-50 text-gray-950 transition-colors duration-200 dark:bg-gray-900 dark:text-gray-50 font-sans">
        <SkipLink />
        <Header />
        <MainContent />
      </div>
    </CarbonProvider>
  );
}
