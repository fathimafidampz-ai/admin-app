'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { FileQuestion, Upload, Edit, Trash2, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Activity {
  id: string;
  type: 'question_created' | 'question_updated' | 'question_deleted' | 'bulk_upload';
  description: string;
  timestamp: string;
  count?: number;
}

interface ActivityTimelineProps {
  activities: Activity[];
}

export function ActivityTimeline({ activities }: ActivityTimelineProps) {
  const getIcon = (type: Activity['type']) => {
    switch (type) {
      case 'question_created':
        return FileQuestion;
      case 'bulk_upload':
        return Upload;
      case 'question_updated':
        return Edit;
      case 'question_deleted':
        return Trash2;
      default:
        return Clock;
    }
  };

  const getColor = (type: Activity['type']) => {
    switch (type) {
      case 'question_created':
        return 'bg-success-100 text-success-600';
      case 'bulk_upload':
        return 'bg-blue-100 text-blue-600';
      case 'question_updated':
        return 'bg-warning-100 text-warning-600';
      case 'question_deleted':
        return 'bg-error-100 text-error-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest actions and changes</CardDescription>
      </CardHeader>
      <CardContent>
        {activities.length > 0 ? (
          <div className="space-y-4">
            {activities.slice(0, 10).map((activity, index) => {
              const Icon = getIcon(activity.type);
              const colorClass = getColor(activity.type);

              return (
                <div key={activity.id} className="flex gap-4">
                  {/* Timeline Line */}
                  <div className="flex flex-col items-center">
                    <div className={`p-2 rounded-full ${colorClass}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    {index < activities.length - 1 && index < 9 && (
                      <div className="w-0.5 h-full bg-gray-200 mt-2"></div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 pb-4">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.description}
                      {activity.count && (
                        <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs font-semibold">
                          {activity.count}
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            No recent activity
          </div>
        )}
      </CardContent>
    </Card>
  );
}