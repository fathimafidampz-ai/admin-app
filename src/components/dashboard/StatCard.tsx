'use client';

import { Card, CardContent } from '@/components/ui/Card';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  change?: string;
  changeType?: 'increase' | 'decrease' | 'positive' | 'negative';
  color?: string;
  delay?: number; // ← Make sure this has the ? to be optional
}

export function StatCard({
  label,
  value,
  icon: Icon,
  change,
  changeType,
  color = 'from-primary-500 to-primary-700',
  delay = 0, // ← Add default value
}: StatCardProps) {
  return (
    <Card className="hover:shadow-lg transition-all duration-300 animate-fade-in">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{label}</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
            {change && (
              <p className={`text-sm mt-1 ${
                changeType === 'increase' || changeType === 'positive'
                  ? 'text-success-600 dark:text-success-400' 
                  : 'text-error-600 dark:text-error-400'
              }`}>
                {change}
              </p>
            )}
          </div>
          <div className={`p-3 rounded-xl bg-gradient-to-br ${color} shadow-lg`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}