'use client';

import { Card, CardContent } from '@/components/ui/Card';
import { FileQuestion, CheckCircle, AlertCircle, TrendingUp } from 'lucide-react';

interface QuestionStatsProps {
  totalQuestions: number;
  easyCount: number;
  mediumCount: number;
  hardCount: number;
}

export function QuestionStats({ totalQuestions, easyCount, mediumCount, hardCount }: QuestionStatsProps) {
  const stats = [
    {
      label: 'Total Questions',
      value: totalQuestions,
      icon: FileQuestion,
      color: 'from-primary-500 to-primary-700',
    },
    {
      label: 'Easy',
      value: easyCount,
      icon: CheckCircle,
      color: 'from-success-500 to-success-700',
    },
    {
      label: 'Medium',
      value: mediumCount,
      icon: AlertCircle,
      color: 'from-warning-500 to-warning-700',
    },
    {
      label: 'Hard',
      value: hardCount,
      icon: TrendingUp,
      color: 'from-error-500 to-error-700',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.label}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
