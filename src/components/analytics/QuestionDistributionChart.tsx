'use client';

import { useTheme } from 'next-themes';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/Card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';

interface QuestionDistributionChartProps {
  data: Array<{
    name: string;
    questions: number;
  }>;
}

const BAR_COLOR = '#3b82f6';

export function QuestionDistributionChart({ data }: QuestionDistributionChartProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Question Distribution by Exam</CardTitle>
          <CardDescription>Total questions per exam</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            No data to display
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Question Distribution by Exam</CardTitle>
        <CardDescription>Total questions per exam</CardDescription>
      </CardHeader>
      <CardContent>
        <div style={{ width: '100%', height: '320px' }}>
          <ResponsiveContainer>
            <BarChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 16 }}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={isDark ? 'rgba(75,85,99,0.6)' : '#e5e7eb'}
              />
              <XAxis
                dataKey="name"
                tick={{ fill: isDark ? '#9ca3af' : '#6b7280', fontSize: 12 }}
                axisLine={{ stroke: isDark ? '#4b5563' : '#e5e7eb' }}
                tickLine={{ stroke: isDark ? '#4b5563' : '#e5e7eb' }}
              />
              <YAxis
                tick={{ fill: isDark ? '#9ca3af' : '#6b7280', fontSize: 12 }}
                axisLine={{ stroke: isDark ? '#4b5563' : '#e5e7eb' }}
                tickLine={{ stroke: isDark ? '#4b5563' : '#e5e7eb' }}
              />
              <Tooltip
                cursor={false} // no gray hover block
                wrapperStyle={{ outline: 'none' }}
                contentStyle={{
                  backgroundColor: isDark ? 'rgba(15,23,42,0.98)' : '#ffffff',
                  border: `1px solid ${isDark ? '#4b5563' : '#e5e7eb'}`,
                  borderRadius: 8,
                  boxShadow: isDark
                    ? '0 10px 25px -5px rgba(0,0,0,0.7)'
                    : '0 4px 6px -1px rgba(0,0,0,0.1)',
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
                wrapperStyle={{
                  color: isDark ? '#e5e7eb' : '#374151',
                  fontSize: 12,
                }}
              />
              <Bar
                dataKey="questions"
                radius={[8, 8, 0, 0]}
                fill={BAR_COLOR}
                fillOpacity={isDark ? 0.9 : 1}
                activeBar={{ fillOpacity: 1 }}
              >
                {data.map((entry, index) => (
                  <Cell key={entry.name ?? index} fill={BAR_COLOR} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
