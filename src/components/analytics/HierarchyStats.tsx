'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { BookOpen, FileText, Layers, Network, Target, Lightbulb } from 'lucide-react';

interface HierarchyStatsProps {
  stats: {
    exams: number;
    classes: number;
    subjects: number;
    chapters: number;
    topics: number;
    concepts: number;
  };
}

export function HierarchyStats({ stats }: HierarchyStatsProps) {
  const items = [
    { label: 'Exams', value: stats.exams, icon: BookOpen, color: 'from-blue-500 to-blue-600' },
    { label: 'Classes', value: stats.classes, icon: Layers, color: 'from-purple-500 to-purple-600' },
    { label: 'Subjects', value: stats.subjects, icon: FileText, color: 'from-green-500 to-green-600' },
    { label: 'Chapters', value: stats.chapters, icon: Network, color: 'from-yellow-500 to-yellow-600' },
    { label: 'Topics', value: stats.topics, icon: Target, color: 'from-orange-500 to-orange-600' },
    { label: 'Concepts', value: stats.concepts, icon: Lightbulb, color: 'from-red-500 to-red-600' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hierarchy Overview</CardTitle>
        <CardDescription>Content structure statistics</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${item.color}`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-sm font-medium text-gray-600">{item.label}</p>
                </div>
                <p className="text-3xl font-bold text-gray-900">{item.value}</p>
              </div>
            );
          })}
        </div>

        {/* Completion Indicator */}
        <div className="mt-6 p-4 bg-gradient-to-r from-primary-50 to-success-50 rounded-lg border border-primary-200">
          <div className="flex items-center justify-between mb-2">
            <p className="font-semibold text-gray-900">Content Hierarchy Depth</p>
            <p className="text-sm text-gray-600">Level 6/6</p>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-gradient-to-r from-primary-500 to-success-500 h-2 rounded-full" style={{ width: '100%' }}></div>
          </div>
          <p className="text-xs text-gray-600 mt-2">Full hierarchy structure implemented</p>
        </div>
      </CardContent>
    </Card>
  );
}