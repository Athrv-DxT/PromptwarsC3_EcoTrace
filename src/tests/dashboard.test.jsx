import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import Dashboard from '../components/Dashboard/Dashboard';

// Mock context values or hooks
vi.mock('../context/CarbonContext', () => {
  return {
    useCarbonContext: () => ({
      breakdown: { transport: 1000, home: 1000, diet: 1500, shopping: 500 },
      totalKg: 4000,
      totalTonnes: 4.0,
      resetCalculator: () => {},
      history: [{ score: 4000, date: new Date().toISOString() }],
      reductionGoal: 20,
      setReductionGoal: () => {}
    }),
    CarbonProvider: ({ children }) => <div>{children}</div>
  };
});

vi.mock('../hooks/useAirQuality', () => {
  return {
    useAirQuality: () => ({
      pm2_5: 10,
      co: 200,
      temperature: 20,
      locationName: 'Test City',
      loading: false,
      error: null
    })
  };
});

// Mock Recharts since it requires DOM measurements which fail in JSDOM
vi.mock('recharts', () => {
  return {
    ResponsiveContainer: ({ children }) => <div>{children}</div>,
    BarChart: ({ children }) => <div>{children}</div>,
    Bar: () => <div>Bar</div>,
    XAxis: () => <div>XAxis</div>,
    YAxis: () => <div>YAxis</div>,
    CartesianGrid: () => <div>Grid</div>,
    Tooltip: () => <div>Tooltip</div>,
    Cell: () => <div>Cell</div>,
    PieChart: ({ children }) => <div>{children}</div>,
    Pie: () => <div>Pie</div>,
    Legend: () => <div>Legend</div>
  };
});

describe('Dashboard component test suite', () => {
  test('renders dashboard titles and carbon outputs', () => {
    render(<Dashboard />);
    expect(screen.getByText(/Your Footprint Analysis/i)).toBeInTheDocument();
    expect(screen.getAllByText(/tonnes CO₂e/i).length).toBeGreaterThan(0);
  });
});
