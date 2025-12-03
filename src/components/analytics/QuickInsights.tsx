'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle } from 'lucide-react';

interface Insight {
  type: 'success' | 'warning' | 'info' | 'error';
  title: string;
  description: string;
}

interface QuickInsightsProps {
  insights: Insight[];
}

export function QuickInsights({ insights }: QuickInsightsProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-success-600 dark:text-success-400" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-warning-600 dark:text-warning-400" />;
      case 'info':
        return <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
      case 'error':
        return <TrendingDown className="w-5 h-5 text-error-600 dark:text-error-400" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-600 dark:text-gray-400" />;
    }
  };

  const getBackgroundColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-success-50 dark:bg-success-900/20 border-success-200 dark:border-success-700';
      case 'warning':
        return 'bg-warning-50 dark:bg-warning-900/20 border-warning-200 dark:border-warning-700';
      case 'info':
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700';
      case 'error':
        return 'bg-error-50 dark:bg-error-900/20 border-error-200 dark:border-error-700';
      default:
        return 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Insights</CardTitle>
      </CardHeader>
      <CardContent>
        {insights.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">
            No insights available. Create more questions to see recommendations.
          </p>
        ) : (
          <div className="space-y-3">
            {insights.map((insight, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${getBackgroundColor(insight.type)}`}
              >
                <div className="flex items-start gap-3">
                  {getIcon(insight.type)}
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                      {insight.title}
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {insight.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}