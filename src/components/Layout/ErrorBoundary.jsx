import React from 'react';

/**
 * Standard React class Error Boundary component.
 * Catches runtime rendering exceptions across the child tree, logs telemetry,
 * and renders a secure local fallback UI instead of crashing the process.
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  /**
   * Derives error state from caught exception.
   * 
   * @param {Error} error - The caught error object.
   * @returns {Object} Error state.
   */
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  /**
   * Lifecycle catch hook to log error stacks.
   * 
   * @param {Error} error - The caught error object.
   * @param {Object} errorInfo - Component stack trace information.
   */
  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6 text-center dark:bg-gray-900 font-sans">
          <div className="rounded-2xl border border-red-200 bg-white p-8 shadow-sm dark:border-red-900/50 dark:bg-gray-800 max-w-md space-y-4">
            <span className="text-4xl" aria-hidden="true">⚠️</span>
            <h1 className="text-lg font-black text-gray-900 dark:text-white">Something went wrong</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              An unexpected error occurred. Please refresh the page or reset the calculator to retry.
            </p>
            <button
              onClick={() => {
                window.location.reload();
              }}
              className="w-full rounded-xl bg-primary-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-primary-700 transition-all duration-200"
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
