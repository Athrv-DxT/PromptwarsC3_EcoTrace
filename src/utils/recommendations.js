// src/utils/recommendations.js

/**
 * Generates personalized carbon reduction recommendations
 * based on the user's footprint breakdown.
 * Mimics AI personalization through rule-based logic with priority scoring.
 * 
 * @param {Object} breakdown - { transport, flights, home, diet, shopping } in kg CO2e/year
 * @returns {Array} top 5 recommendations sorted by potential impact
 */
export function generateRecommendations(breakdown) {
  const allTips = [
    // Transport tips
    {
      id: 'ev_switch',
      category: 'transport',
      condition: (b) => b.transport > 2000,
      tip: 'Switch to an electric vehicle or hybrid',
      detail: 'Based on your driving habits, switching to an EV could save you over 1.2 tonnes CO2e/year',
      potentialSaving: (b) => Math.round(b.transport * 0.6),
      difficulty: 'hard',
      icon: '🚗'
    },
    {
      id: 'public_transit',
      category: 'transport',
      condition: (b) => b.transport > 1000,
      tip: 'Replace 2 car trips per week with public transit',
      detail: 'Even partial shifts to buses or trains dramatically reduce transport emissions',
      potentialSaving: (b) => Math.round(b.transport * 0.25),
      difficulty: 'medium',
      icon: '🚌'
    },
    {
      id: 'flight_offset',
      category: 'transport',
      condition: (b) => b.flights > 1500,
      tip: 'Reduce long-haul flights by one per year',
      detail: 'A single long-haul flight emits more CO2 than driving for 3 months',
      potentialSaving: () => 1200,
      difficulty: 'medium',
      icon: '✈️'
    },
    // Home tips
    {
      id: 'renewable_energy',
      category: 'home',
      condition: (b) => b.home > 1500,
      tip: 'Switch to a renewable energy tariff',
      detail: 'Your home energy use is above average. A green energy provider could eliminate this entirely',
      potentialSaving: (b) => Math.round(b.home * 0.8),
      difficulty: 'easy',
      icon: '⚡'
    },
    {
      id: 'smart_thermostat',
      category: 'home',
      condition: (b) => b.home > 800,
      tip: 'Install a smart thermostat',
      detail: 'Reduces heating/cooling energy by 10–15% with zero lifestyle change',
      potentialSaving: (b) => Math.round(b.home * 0.12),
      difficulty: 'easy',
      icon: '🌡️'
    },
    // Diet tips
    {
      id: 'reduce_beef',
      category: 'diet',
      condition: (b) => b.diet > 2000,
      tip: 'Try Meat-Free Mondays',
      detail: 'Beef produces 27kg CO2e per kg of meat. One day less per week saves ~400kg CO2e/year',
      potentialSaving: () => 400,
      difficulty: 'easy',
      icon: '🥗'
    },
    {
      id: 'plant_based',
      category: 'diet',
      condition: (b) => b.diet > 2500,
      tip: 'Shift to a plant-rich diet',
      detail: 'Moving from a heavy-meat to omnivore diet cuts food emissions by 800kg CO2e/year',
      potentialSaving: () => 800,
      difficulty: 'medium',
      icon: '🌱'
    },
    // Shopping tips
    {
      id: 'second_hand',
      category: 'shopping',
      condition: (b) => b.shopping > 500,
      tip: 'Buy second-hand clothing for 3 months',
      detail: 'Fast fashion accounts for 10% of global carbon emissions. Second-hand cuts per-item impact by 82%',
      potentialSaving: () => 300,
      difficulty: 'easy',
      icon: '👕'
    },
    {
      id: 'electronics_lifespan',
      category: 'shopping',
      condition: (b) => b.shopping > 300,
      tip: 'Extend your phone/laptop lifespan by 1 year',
      detail: 'Manufacturing a new smartphone emits ~70kg CO2e. Keeping yours longer is the greenest option',
      potentialSaving: () => 70,
      difficulty: 'easy',
      icon: '📱'
    }
  ];

  return allTips
    .filter(tip => tip.condition(breakdown))
    .map(tip => ({
      ...tip,
      potentialSaving: tip.potentialSaving(breakdown)
    }))
    .sort((a, b) => b.potentialSaving - a.potentialSaving)
    .slice(0, 5);
}
