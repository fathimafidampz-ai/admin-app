'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
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
  return (
    <Card>
      <CardHeader>
        <CardTitle>3PL Parameter Analysis</CardTitle>
        <CardDescription>Average parameters across difficulty ranges</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="range" 
              tick={{ fill: '#6b7280', fontSize: 12 }}
            />
            <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '8px'
              }}
            />
            <Legend />
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

        {/* Summary Stats */}
<div className="grid grid-cols-3 gap-4 mt-6">
  <div className="p-4 bg-gradient-to-br from-blue-400 to-blue-600 dark:from-blue-500 dark:to-blue-700 border-2 border-blue-500 dark:border-blue-600 rounded-xl text-center shadow-lg hover:shadow-xl transition-all">
    <p className="text-sm font-semibold text-blue-50 dark:text-blue-100 mb-1">Avg Difficulty</p>
    <p className="text-3xl font-bold text-white drop-shadow-md">
      {data.length > 0 
        ? (data.reduce((sum, d) => sum + d.difficulty, 0) / data.length).toFixed(2)
        : '0.00'}
    </p>
  </div>
  <div className="p-4 bg-gradient-to-br from-emerald-400 to-emerald-600 dark:from-emerald-500 dark:to-emerald-700 border-2 border-emerald-500 dark:border-emerald-600 rounded-xl text-center shadow-lg hover:shadow-xl transition-all">
    <p className="text-sm font-semibold text-emerald-50 dark:text-emerald-100 mb-1">Avg Discrimination</p>
    <p className="text-3xl font-bold text-white drop-shadow-md">
      {data.length > 0 
        ? (data.reduce((sum, d) => sum + d.discrimination, 0) / data.length).toFixed(2)
        : '0.00'}
    </p>
  </div>
  <div className="p-4 bg-gradient-to-br from-amber-400 to-orange-500 dark:from-amber-500 dark:to-orange-600 border-2 border-orange-500 dark:border-orange-600 rounded-xl text-center shadow-lg hover:shadow-xl transition-all">
    <p className="text-sm font-semibold text-orange-50 dark:text-orange-100 mb-1">Avg Guessing</p>
    <p className="text-3xl font-bold text-white drop-shadow-md">
      {data.length > 0 
        ? (data.reduce((sum, d) => sum + d.guessing, 0) / data.length).toFixed(2)
        : '0.00'}
    </p>
  </div>
</div>
      </CardContent>
    </Card>
  );
}