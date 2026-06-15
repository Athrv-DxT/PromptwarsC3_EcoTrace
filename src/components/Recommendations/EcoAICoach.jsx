import { useState } from 'react';
import { generateCoachingAdvice, getFallbackResponse } from '../../services';

/**
 * EcoAI Sustainability Coach component.
 * Allows users to write queries about their daily habits and receive AI advice or fallback suggestions.
 * 
 * @returns {React.JSX.Element} Coach container.
 */
export default function EcoAICoach() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleQuerySubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setResult('');

    try {
      const text = await generateCoachingAdvice(query);
      setResult(text);
    } catch (err) {
      console.error('Gemini API Error:', err);
      setError('Failed to reach Gemini Sustainability Coach. Running smart fallback evaluation.');
      const fallbackResponse = getFallbackResponse(query);
      setResult(fallbackResponse);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-2xl" aria-hidden="true">🤖</span>
        <div>
          <h3 className="text-base font-black text-gray-900 dark:text-white">EcoAI Sustainability Coach</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">Ask the Gemini model to analyze your habits and find carbon leaks.</p>
        </div>
      </div>

      <form onSubmit={handleQuerySubmit} className="space-y-3">
        <div className="space-y-1">
          <label htmlFor="coach-input" className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
            Tell the coach about your habits
          </label>
          <textarea
            id="coach-input"
            rows="3"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g., I travel 20 km daily by bike, eat meat 3 times a week, and use AC for 5 hours."
            className="w-full rounded-xl border border-gray-300 bg-white p-3 text-sm text-gray-900 shadow-sm focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-600 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />
        </div>

        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="w-full sm:w-auto rounded-xl bg-primary-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-primary-700 disabled:opacity-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
        >
          {loading ? 'Consulting Coach...' : 'Get AI Advice'}
        </button>
      </form>

      <div className="aria-live-polite" aria-live="polite" aria-atomic="true">
        {error && (
          <p className="text-xs font-bold text-amber-600 dark:text-amber-400 mb-2">
            ⚠️ {error}
          </p>
        )}

        {result && (
          <div className="rounded-xl bg-gray-50 p-4 border border-gray-100 dark:bg-gray-950/20 dark:border-gray-800 text-sm leading-relaxed text-gray-700 dark:text-gray-300 whitespace-pre-line">
            {result}
          </div>
        )}
      </div>
    </div>
  );
}
