// @ts-nocheck
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const ComparisonChart = React.memo(({ userScoreTonnes, userColor }) => {
  // Data for benchmarks in tonnes CO2e
  const data = [
    { name: '1.5°C Target', value: 2.5, isUser: false },
    { name: 'Your Score', value: userScoreTonnes, isUser: true },
    { name: 'World Avg', value: 7.0, isUser: false },
    { name: 'EU Avg', value: 8.5, isUser: false },
    { name: 'UK Avg', value: 10.0, isUser: false }
  ];

  return (
    <div 
      role="img" 
      aria-label="Bar chart comparing your carbon footprint to global averages" 
      className="h-64 w-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} className="stroke-gray-200 dark:stroke-gray-700" />
          <XAxis 
            type="number" 
            unit="t" 
            className="text-[10px] text-gray-500 dark:text-gray-400 font-semibold"
            stroke="#9ca3af"
          />
          <YAxis 
            dataKey="name" 
            type="category" 
            className="text-[10px] text-gray-500 dark:text-gray-400 font-bold"
            stroke="#9ca3af"
            width={90}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-md dark:border-gray-700 dark:bg-gray-800">
                    <p className="text-xs font-bold text-gray-800 dark:text-white">
                      {payload[0].payload.name}
                    </p>
                    <p className="text-sm font-extrabold text-primary-600 dark:text-primary-400">
                      {payload[0].value} t CO₂e
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={24}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.isUser ? userColor : '#9ca3af'}
                className={entry.isUser ? '' : 'fill-gray-300 dark:fill-gray-600'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
});

ComparisonChart.displayName = 'ComparisonChart';

export default ComparisonChart;
