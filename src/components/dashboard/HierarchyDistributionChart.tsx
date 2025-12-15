'use client';

import { useTheme } from 'next-themes';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/Card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

interface HierarchyDistributionChartProps {
  data: {
    exams: number;
    classes: number;
    subjects: number;
    chapters: number;
    topics: number;
    concepts: number;
  };
}

const COLORS = [
  '#0ea5e9',
  '#a855f7',
  '#22c55e',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
];

export function HierarchyDistributionChart({ data }: HierarchyDistributionChartProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const chartData = [
    { name: 'Exams', value: data.exams },
    { name: 'Classes', value: data.classes },
    { name: 'Subjects', value: data.subjects },
    { name: 'Chapters', value: data.chapters },
    { name: 'Topics', value: data.topics },
    { name: 'Concepts', value: data.concepts },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hierarchy Distribution</CardTitle>
        <CardDescription>Content breakdown by hierarchy level</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ top: 8, right: 16, left: 0, bottom: 16 }}>
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
              cursor={false}  // <- removes the gray hover block entirely
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
            <Bar
              dataKey="value"
              radius={[8, 8, 0, 0]}
              fillOpacity={isDark ? 0.9 : 1}
              activeBar={{ fillOpacity: 1 }}  // only bar itself changes on hover
            >
              {chartData.map((entry, index) => (
                <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
