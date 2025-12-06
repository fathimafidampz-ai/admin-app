'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ParameterAnalysisProps {
  data: Array<{
    range: string;
    difficulty: number;
    discrimination: number;
    guessing: number;
  }>;
}

export function ParameterAnalysis({ data }: ParameterAnalysisProps) {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>3PL Parameter Analysis</CardTitle>
          <CardDescription>Distribution of IRT parameters</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            No data to display
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate average values for the summary cards
  const avgDifficulty = data.reduce((sum, item) => sum + item.difficulty, 0) / data.length;
  const avgDiscrimination = data.reduce((sum, item) => sum + item.discrimination, 0) / data.length;
  const avgGuessing = data.reduce((sum, item) => sum + item.guessing, 0) / data.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle>3PL Parameter Analysis</CardTitle>
        <CardDescription>Distribution of IRT parameters across difficulty ranges</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Line Chart */}
        <div style={{ width: '100%', height: '320px' }}>
          <ResponsiveContainer>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis 
                dataKey="range" 
                stroke="#9ca3af"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#9ca3af"
                style={{ fontSize: '12px' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgb(31 41 55)',
                  border: '1px solid rgb(55 65 81)',
                  borderRadius: '0.5rem',
                  color: 'white'
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Line 
                type="monotone" 
                dataKey="difficulty" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={{ r: 4 }}
                name="Difficulty"
              />
              <Line 
                type="monotone" 
                dataKey="discrimination" 
                stroke="#10b981" 
                strokeWidth={2}
                dot={{ r: 4 }}
                name="Discrimination"
              />
              <Line 
                type="monotone" 
                dataKey="guessing" 
                stroke="#f59e0b" 
                strokeWidth={2}
                dot={{ r: 4 }}
                name="Guessing"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* 🎨 BRIGHT GRADIENT CARDS */}
        <div className="grid grid-cols-3 gap-3 mt-6">
          {/* Difficulty Card - Bright Blue Gradient */}
          <div className="rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 dark:from-blue-500 dark:to-blue-700 p-4 text-white shadow-md hover:shadow-lg transition-all">
            <p className="text-xs font-semibold mb-1.5 opacity-95">
              Avg Difficulty
            </p>
            <p className="text-3xl font-bold">
              {avgDifficulty.toFixed(2)}
            </p>
          </div>
          
          {/* Discrimination Card - Bright Green Gradient */}
          <div className="rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 dark:from-emerald-500 dark:to-emerald-700 p-4 text-white shadow-md hover:shadow-lg transition-all">
            <p className="text-xs font-semibold mb-1.5 opacity-95">
              Avg Discrimination
            </p>
            <p className="text-3xl font-bold">
              {avgDiscrimination.toFixed(2)}
            </p>
          </div>
          
          {/* Guessing Card - Bright Orange Gradient */}
          <div className="rounded-lg bg-gradient-to-br from-amber-400 to-orange-600 dark:from-amber-500 dark:to-orange-700 p-4 text-white shadow-md hover:shadow-lg transition-all">
            <p className="text-xs font-semibold mb-1.5 opacity-95">
              Avg Guessing
            </p>
            <p className="text-3xl font-bold">
              {avgGuessing.toFixed(2)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}