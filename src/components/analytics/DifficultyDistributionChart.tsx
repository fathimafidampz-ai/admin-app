'use client';

import { useTheme } from 'next-themes';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface DifficultyDistributionChartProps {
  easyCount: number;
  mediumCount: number;
  hardCount: number;
}

export function DifficultyDistributionChart({
  easyCount,
  mediumCount,
  hardCount,
}: DifficultyDistributionChartProps) {
  const total = easyCount + mediumCount + hardCount;
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const data = [
    { name: 'Easy', value: easyCount, color: '#10b981' },
    { name: 'Medium', value: mediumCount, color: '#f59e0b' },
    { name: 'Hard', value: hardCount, color: '#ef4444' },
  ].filter((item) => item.value > 0);

  if (total === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Difficulty Distribution</CardTitle>
          <CardDescription>Questions by difficulty level</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            No questions to display
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Difficulty Distribution</CardTitle>
        <CardDescription>Questions by difficulty level</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Pie Chart */}
        <div style={{ width: '100%', height: '320px' }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                cursor={false}
                contentStyle={{
                  backgroundColor: isDark ? 'rgba(15,23,42,0.98)' : '#ffffff',
                  border: `1px solid ${isDark ? '#4b5563' : '#e5e7eb'}`,
                  borderRadius: '0.5rem',
                  color: isDark ? '#f9fafb' : '#111827',
                  padding: '8px 10px',
                }}
                labelStyle={{
                  color: isDark ? '#e5e7eb' : '#374151',
                  fontSize: 12,
                  marginBottom: 4,
                }}
                itemStyle={{
                  color: isDark ? '#e5e7eb' : '#374151',
                  fontSize: 12,
                }}
              />
              <Legend
                verticalAlign="bottom"
                iconType="circle"
                wrapperStyle={{
                  color: isDark ? '#e5e7eb' : '#374151',
                  fontSize: 12,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* gradient cards unchanged */}
        <div className="grid grid-cols-3 gap-3 mt-6">
          <div className="rounded-lg bg-gradient-to-br from-green-400 to-green-600 dark:from-green-500 dark:to-green-700 p-4 text-white shadow-md hover:shadow-lg transition-all text-center">
            <p className="text-xs font-semibold mb-1.5 opacity-95">Easy</p>
            <p className="text-3xl font-bold">{easyCount}</p>
          </div>
          <div className="rounded-lg bg-gradient-to-br from-amber-400 to-orange-600 dark:from-amber-500 dark:to-orange-700 p-4 text-white shadow-md hover:shadow-lg transition-all text-center">
            <p className="text-xs font-semibold mb-1.5 opacity-95">Medium</p>
            <p className="text-3xl font-bold">{mediumCount}</p>
          </div>
          <div className="rounded-lg bg-gradient-to-br from-rose-400 to-red-600 dark:from-rose-500 dark:to-red-700 p-4 text-white shadow-md hover:shadow-lg transition-all text-center">
            <p className="text-xs font-semibold mb-1.5 opacity-95">Hard</p>
            <p className="text-3xl font-bold">{hardCount}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

