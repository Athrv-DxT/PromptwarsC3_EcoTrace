// @ts-nocheck
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const CATEGORY_COLORS = {
  'Transport': '#3b82f6', // blue-500
  'Home': '#eab308',      // yellow-500
  'Diet': '#10b981',      // emerald-500
  'Shopping': '#ec4899'   // pink-500
};

export default function FootprintChart({ breakdown }) {
  const data = [
    { name: 'Transport', value: breakdown.transport },
    { name: 'Home', value: breakdown.home },
    { name: 'Diet', value: breakdown.diet },
    { name: 'Shopping', value: breakdown.shopping }
  ].filter(item => item.value > 0);

  return (
    <div 
      role="img" 
      aria-label="Pie chart depicting breakdown of your carbon footprint by category" 
      className="h-64 w-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={4}
            dataKey="value"
          >
            {data.map((entry) => (
              <Cell 
                key={entry.name} 
                fill={CATEGORY_COLORS[entry.name] || '#9ca3af'} 
              />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const item = payload[0].payload;
                return (
                  <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-md dark:border-gray-700 dark:bg-gray-800">
                    <p className="text-xs font-bold text-gray-800 dark:text-white flex items-center gap-1.5">
                      <span 
                        className="inline-block h-2.5 w-2.5 rounded-full" 
                        style={{ backgroundColor: CATEGORY_COLORS[item.name] }}
                      />
                      {item.name}
                    </p>
                    <p className="text-sm font-extrabold text-primary-600 dark:text-primary-400">
                      {payload[0].value.toLocaleString()} kg CO₂e
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value) => (
              <span className="text-xs font-bold text-gray-600 dark:text-gray-400 mr-2">
                {value}
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
