'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

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
  '#0ea5e9', // primary-500
  '#a855f7', // secondary-500
  '#22c55e', // success-500
  '#f59e0b', // warning-500
  '#ef4444', // error-500
  '#8b5cf6', // purple-500
];

export function HierarchyDistributionChart({ data }: HierarchyDistributionChartProps) {
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
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="name" 
              tick={{ fill: '#6b7280', fontSize: 12 }}
              axisLine={{ stroke: '#e5e7eb' }}
            />
            <YAxis 
              tick={{ fill: '#6b7280', fontSize: 12 }}
              axisLine={{ stroke: '#e5e7eb' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Bar dataKey="value" radius={[8, 8, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}