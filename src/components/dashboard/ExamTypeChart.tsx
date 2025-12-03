'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface ExamTypeChartProps {
  competitiveCount: number;
  schoolCount: number;
}

const COLORS = {
  competitive: '#0ea5e9', // primary-500
  school: '#a855f7', // secondary-500
};

export function ExamTypeChart({ competitiveCount, schoolCount }: ExamTypeChartProps) {
  const data = [
    { name: 'Competitive Exams', value: competitiveCount, color: COLORS.competitive },
    { name: 'School Exams', value: schoolCount, color: COLORS.school },
  ];

  const total = competitiveCount + schoolCount;

  if (total === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Exam Type Distribution</CardTitle>
          <CardDescription>Breakdown by exam category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center text-gray-400">
            <p>No exams created yet</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Custom label render function
  const renderLabel = (entry: any) => {
    const percent = ((entry.value / total) * 100).toFixed(0);
    return `${entry.name}: ${percent}%`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Exam Type Distribution</CardTitle>
        <CardDescription>Breakdown by exam category</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderLabel}
              outerRadius={80}
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
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              iconType="circle"
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}