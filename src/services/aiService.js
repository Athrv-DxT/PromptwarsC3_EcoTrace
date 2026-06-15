/**
 * Service to consult the EcoAI Sustainability Coach.
 * Integrates with Gemini API and hosts local fallback pattern-matching analysis.
 */

/**
 * Generates local fallback analysis response based on pattern matching the user's habits.
 * 
 * @param {string} query - User habits input.
 * @returns {string} Markdown formatted analysis advice.
 */
export function getFallbackResponse(query) {
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

  return `Your estimated annual carbon footprint is **${status}**.

### Top Opportunities:
1. ${opportunities[0]}
2. ${opportunities[1]}
3. ${opportunities[2] || 'Opt for second-hand items next shopping run.'}

### Estimated Reduction:
* **-${savings} kg CO₂ / year**`;
}

/**
 * Submits the user's lifestyle query to the Gemini AI API, falling back to local evaluation if needed.
 * 
 * @param {string} query - The habits information entered by the user.
 * @returns {Promise<string>} The sustainability coach response.
 * @throws {Error} If Gemini API call fails.
 */
export async function generateCoachingAdvice(query) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    // Return mock fallback analysis after a short simulated latency to match original flow
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(getFallbackResponse(query));
      }, 800);
    });
  }

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
  
  // Validate response content
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error('Empty response from Gemini model');
  }

  return text;
}
