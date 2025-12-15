'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

interface ContentCoverageItem {
  exam: string;
  subjects: number;
  chapters: number;
  topics: number;
  concepts: number;
  questions: number;
  coverage: number;
}

interface ContentCoverageTableProps {
  data: ContentCoverageItem[];
}

export function ContentCoverageTable({ data }: ContentCoverageTableProps) {
  const getCoverageColor = (coverage: number) => {
    if (coverage >= 80) return 'bg-success-100 text-success-700';
    if (coverage >= 50) return 'bg-warning-100 text-warning-700';
    return 'bg-error-100 text-error-700';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Content Coverage</CardTitle>
        <CardDescription>Question coverage across hierarchy</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Exam</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Subjects</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Chapters</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Topics</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Concepts</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Questions</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Coverage</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-500">
                    No data available
                  </td>
                </tr>
              ) : (
                data.map((item, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-sky-50 dark:border-gray-700 dark:hover:bg-sky-900">

                    <td className="py-3 px-4 font-medium text-gray-900">{item.exam}</td>
                    <td className="text-center py-3 px-4 text-gray-700">{item.subjects}</td>
                    <td className="text-center py-3 px-4 text-gray-700">{item.chapters}</td>
                    <td className="text-center py-3 px-4 text-gray-700">{item.topics}</td>
                    <td className="text-center py-3 px-4 text-gray-700">{item.concepts}</td>
                    <td className="text-center py-3 px-4 font-semibold text-gray-900">{item.questions}</td>
                    <td className="text-center py-3 px-4">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-sm font-semibold",
                        getCoverageColor(item.coverage)
                      )}>
                        {item.coverage}%
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div className="mt-4 flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-success-500 rounded-full"></div>
            <span className="text-gray-600">80%+ Coverage</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-warning-500 rounded-full"></div>
            <span className="text-gray-600">50-79% Coverage</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-error-500 rounded-full"></div>
            <span className="text-gray-600">&lt;50% Coverage</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}