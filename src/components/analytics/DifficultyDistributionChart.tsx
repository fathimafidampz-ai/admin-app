'use client';

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
  hardCount 
}: DifficultyDistributionChartProps) {
  const total = easyCount + mediumCount + hardCount;
  
  const data = [
    { name: 'Easy', value: easyCount, color: '#10b981' },
    { name: 'Medium', value: mediumCount, color: '#f59e0b' },
    { name: 'Hard', value: hardCount, color: '#ef4444' },
  ].filter(item => item.value > 0);

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
                contentStyle={{
                  backgroundColor: 'rgb(31 41 55)',
                  border: '1px solid rgb(55 65 81)',
                  borderRadius: '0.5rem',
                  color: 'white'
                }}
              />
              <Legend 
                verticalAlign="bottom"
                iconType="circle"
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* 🎨 BRIGHT GRADIENT CARDS */}
        <div className="grid grid-cols-3 gap-3 mt-6">
          {/* Easy Card - Bright Green Gradient */}
          <div className="rounded-lg bg-gradient-to-br from-green-400 to-green-600 dark:from-green-500 dark:to-green-700 p-4 text-white shadow-md hover:shadow-lg transition-all text-center">
            <p className="text-xs font-semibold mb-1.5 opacity-95">
              Easy
            </p>
            <p className="text-3xl font-bold">
              {easyCount}
            </p>
          </div>
          
          {/* Medium Card - Bright Orange Gradient */}
          <div className="rounded-lg bg-gradient-to-br from-amber-400 to-orange-600 dark:from-amber-500 dark:to-orange-700 p-4 text-white shadow-md hover:shadow-lg transition-all text-center">
            <p className="text-xs font-semibold mb-1.5 opacity-95">
              Medium
            </p>
            <p className="text-3xl font-bold">
              {mediumCount}
            </p>
          </div>
          
          {/* Hard Card - Bright Red Gradient */}
          <div className="rounded-lg bg-gradient-to-br from-rose-400 to-red-600 dark:from-rose-500 dark:to-red-700 p-4 text-white shadow-md hover:shadow-lg transition-all text-center">
            <p className="text-xs font-semibold mb-1.5 opacity-95">
              Hard
            </p>
            <p className="text-3xl font-bold">
              {hardCount}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}