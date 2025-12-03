'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface DifficultyDistributionChartProps {
  easy: number;
  medium: number;
  hard: number;
}

const COLORS = {
  easy: '#10b981',
  medium: '#f59e0b',
  hard: '#ef4444',
};

export function DifficultyDistributionChart({ easy, medium, hard }: DifficultyDistributionChartProps) {
  const data = [
    { name: 'Easy', value: easy, color: COLORS.easy },
    { name: 'Medium', value: medium, color: COLORS.medium },
    { name: 'Hard', value: hard, color: COLORS.hard },
  ];

  const total = easy + medium + hard;

  const renderLabel = (entry: any) => {
    const percent = total > 0 ? ((entry.value / total) * 100).toFixed(0) : 0;
    return `${entry.name}: ${percent}%`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Difficulty Distribution</CardTitle>
        <CardDescription>Questions by difficulty level</CardDescription>
      </CardHeader>
      <CardContent>
        {total === 0 ? (
          <div className="h-[300px] flex items-center justify-center text-gray-500">
            No questions available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderLabel}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '8px'
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}

        {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mt-6">
            <div className="p-4 bg-gradient-to-br from-green-400 to-green-600 dark:from-green-500 dark:to-green-700 border-2 border-green-500 dark:border-green-600 rounded-xl text-center shadow-lg hover:shadow-xl transition-all">
              <p className="text-3xl font-bold text-white drop-shadow-md">{easy}</p>
              <p className="text-sm font-semibold text-green-50 dark:text-green-100">Easy</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-yellow-400 to-orange-500 dark:from-yellow-500 dark:to-orange-600 border-2 border-orange-500 dark:border-orange-600 rounded-xl text-center shadow-lg hover:shadow-xl transition-all">
              <p className="text-3xl font-bold text-white drop-shadow-md">{medium}</p>
              <p className="text-sm font-semibold text-orange-50 dark:text-orange-100">Medium</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-red-500 to-red-700 dark:from-red-600 dark:to-red-800 border-2 border-red-600 dark:border-red-700 rounded-xl text-center shadow-lg hover:shadow-xl transition-all">
              <p className="text-3xl font-bold text-white drop-shadow-md">{hard}</p>
              <p className="text-sm font-semibold text-red-50 dark:text-red-100">Hard</p>
            </div>
          </div>
      </CardContent>
    </Card>
  );
}