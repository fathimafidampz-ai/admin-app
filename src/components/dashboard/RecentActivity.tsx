'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { FileQuestion, Network, Upload, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Activity {
  id: string;
  type: 'question_created' | 'hierarchy_created' | 'resource_uploaded' | 'question_deleted';
  description: string;
  timestamp: string;
}

interface RecentActivityProps {
  activities: Activity[];
}

const iconMap = {
  question_created: FileQuestion,
  hierarchy_created: Network,
  resource_uploaded: Upload,
  question_deleted: Trash2,
};

const colorMap = {
  question_created: 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400',
  hierarchy_created: 'bg-success-100 dark:bg-success-900/30 text-success-600 dark:text-success-400',
  resource_uploaded: 'bg-warning-100 dark:bg-warning-900/30 text-warning-600 dark:text-warning-400',
  question_deleted: 'bg-error-100 dark:bg-error-900/30 text-error-600 dark:text-error-400',
};

export function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {activities.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">No recent activity</p>
          ) : (
            activities.map((activity) => {
              const Icon = iconMap[activity.type];
              return (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className={`p-2 rounded-lg ${colorMap[activity.type]}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 dark:text-gray-100 font-medium">
                      {activity.description}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}