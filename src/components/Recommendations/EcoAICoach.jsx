import React, { useState } from 'react';

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

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    if (!apiKey) {
      // Smart local pattern-matching fallback parser
      setTimeout(() => {
        const queryLower = query.toLowerCase();
        let status = 'moderate';
        let opportunities = [];
        let savings = 380;

        if (queryLower.includes('ev') || queryLower.includes('electric vehicle')) {
          status = 'lower';
          opportunities.push('Charge EV during off-peak hours to reduce grid pressure.');
          opportunities.push('Plan routes ahead to optimize regenerative braking efficiency.');
          opportunities.push('Maintain tire pressure to optimize electric range.');
          savings = 190;
        } else if (queryLower.includes('car') || queryLower.includes('drive')) {
          status = 'above average';
          opportunities.push('Replace 2 car trips per week with cycling or public transit.');
          opportunities.push('Combine errands to avoid multiple cold starts.');
          opportunities.push('Practice eco-driving by avoiding rapid acceleration.');
          savings = 620;
        } else {
          opportunities.push('Replace 2 AC hours with ceiling fan usage.');
          opportunities.push('Batch errands into fewer weekly trips.');
          opportunities.push('Reduce meat consumption by one meal weekly.');
        }

        if (queryLower.includes('meat') || queryLower.includes('beef')) {
          opportunities.push('Introduce two meat-free days per week to cut diet footprint.');
          savings += 200;
        }

        if (queryLower.includes('ac') || queryLower.includes('air conditioning')) {
          opportunities.push('Install a programmable thermostat set to 25°C when away.');
          savings += 150;
        }

        const simulatedResponse = `Your estimated annual carbon footprint is **${status}**.

### Top Opportunities:
1. ${opportunities[0]}
2. ${opportunities[1]}
3. ${opportunities[2] || 'Opt for second-hand items next shopping run.'}

### Estimated Reduction:
* **-${savings} kg CO₂ / year**`;

        setResult(simulatedResponse);
        setLoading(false);
      }, 800);
      return;
    }

    // Call actual Gemini API (gemini-1.5-flash)
    try {
      const prompt = `You are the EcoTrace Sustainability Coach. The user states their current lifestyle habits: "${query}". 
Provide a personalized carbon footprint analysis and actionable opportunities.
Format the output in clean markdown strictly like this:
"Your estimated annual carbon footprint is [low/moderate/high].

### Top Opportunities:
1. [Opportunity 1 details]
2. [Opportunity 2 details]
3. [Opportunity 3 details]

### Estimated Reduction:
* **-[X] kg CO₂ / year**"`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Gemini API returned status ${response.status}`);
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!text) {
        throw new Error('Empty response from Gemini model');
      }

      setResult(text);
    } catch (err) {
      console.error('Gemini API Error:', err);
      setError('Failed to reach Gemini Sustainability Coach. Running smart fallback evaluation.');
      // Execute fallback immediately upon actual API failure
      const fallbackResponse = `Your estimated annual carbon footprint is **moderate**.

### Top Opportunities:
1. Replace 2 AC hours with ceiling fan usage.
2. Batch errands into fewer weekly trips.
3. Reduce meat consumption by one meal weekly.

### Estimated Reduction:
* **-380 kg CO₂ / year**`;
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

      {/* Results output */}
      <div 
        className="aria-live-polite" 
        aria-live="polite" 
        aria-atomic="true"
      >
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
