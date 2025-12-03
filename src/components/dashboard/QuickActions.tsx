'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Plus, Eye, FileQuestion, BarChart3 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function QuickActions() {
  const router = useRouter();

  const actions = [
    {
      label: 'Create Exam',
      description: 'Start new exam',
      icon: Plus,
      color: 'from-primary-500 to-primary-700',
      onClick: () => router.push('/hierarchy'),
    },
    {
      label: 'View Hierarchy',
      description: 'Browse structure',
      icon: Eye,
      color: 'from-success-500 to-success-700',
      onClick: () => router.push('/hierarchy'),
    },
    {
      label: 'Browse Questions',
      description: 'View Q-matrix',
      icon: FileQuestion,
      color: 'from-warning-500 to-warning-700',
      onClick: () => router.push('/browse'),
    },
    {
      label: 'Analytics',
      description: 'View insights',
      icon: BarChart3,
      color: 'from-secondary-500 to-secondary-700',
      onClick: () => router.push('/analytics'),
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.label}
                onClick={action.onClick}
                className="flex flex-col items-center gap-3 p-4 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 hover:shadow-lg transition-all duration-200 group"
              >
                <div className={`p-3 rounded-xl bg-gradient-to-br ${action.color} shadow-lg group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-center">
                  <p className="font-medium text-gray-900 dark:text-white text-sm">{action.label}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{action.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}