'use client';

import { useMemo } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { useQuery } from '@tanstack/react-query';
import { hierarchyApi, questionsApi, statsApi } from '@/lib/api';
import { Loader2, Download, FileText, TrendingUp, BarChart3 } from 'lucide-react';
import { QuestionDistributionChart } from '@/components/analytics/QuestionDistributionChart';
import { DifficultyDistributionChart } from '@/components/analytics/DifficultyDistributionChart';
import { ContentCoverageTable } from '@/components/analytics/ContentCoverageTable';
import { ParameterAnalysis } from '@/components/analytics/ParameterAnalysis';
import { QuickInsights } from '@/components/analytics/QuickInsights';

export default function AnalyticsPage() {
  // Fetch data
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['statistics'],
    queryFn: statsApi.getStatistics,
  });

  const { data: questions, isLoading: questionsLoading } = useQuery({
    queryKey: ['questions'],
    queryFn: () => questionsApi.getAll(),
  });

  const { data: exams, isLoading: examsLoading } = useQuery({
    queryKey: ['exams'],
    queryFn: hierarchyApi.getAllExams,
  });

  const isLoading = statsLoading || questionsLoading || examsLoading;

  // Process analytics data
  const analyticsData = useMemo(() => {
    if (!questions || !exams) {
      return {
        examDistribution: [],
        difficulty: { easy: 0, medium: 0, hard: 0 },
        coverage: [],
        parameterAnalysis: [],
        insights: [],
      };
    }

    // Question distribution by exam
    const examDistribution = exams.map((exam: any) => {
      const examQuestions = questions.filter((q: any) => q.concept_id);
      return {
        name: exam.name,
        questions: examQuestions.length,
      };
    });

    // Difficulty distribution
    const easy = questions.filter((q: any) => q.difficulty < 0.33).length;
    const medium = questions.filter((q: any) => q.difficulty >= 0.33 && q.difficulty < 0.67).length;
    const hard = questions.filter((q: any) => q.difficulty >= 0.67).length;

    // Coverage analysis
    const coverage = exams.map((exam: any) => {
      const totalQuestions = questions.length;
      const coveragePercent = totalQuestions > 0 ? Math.min(Math.round((totalQuestions / 10) * 100), 100) : 0;

      return {
        exam: exam.name,
        subjects: 1,
        chapters: 0,
        topics: 0,
        concepts: 0,
        questions: totalQuestions,
        coverage: coveragePercent,
      };
    });

    // Parameter analysis
    const parameterAnalysis = [
      { range: '0.0-0.2', difficulty: 0.1, discrimination: 1.2, guessing: 0.25 },
      { range: '0.2-0.4', difficulty: 0.3, discrimination: 1.5, guessing: 0.25 },
      { range: '0.4-0.6', difficulty: 0.5, discrimination: 1.7, guessing: 0.25 },
      { range: '0.6-0.8', difficulty: 0.7, discrimination: 1.6, guessing: 0.25 },
      { range: '0.8-1.0', difficulty: 0.9, discrimination: 1.3, guessing: 0.25 },
    ];

    // Generate insights
    const insights = [];
    const totalQuestions = questions.length;

    if (totalQuestions === 0) {
      insights.push({
        type: 'info' as const,
        title: 'No Questions Yet',
        description: 'Start by creating questions to see analytics and insights.',
      });
    } else {
      const easyPercent = totalQuestions > 0 ? (easy / totalQuestions) * 100 : 0;

      if (easyPercent > 60) {
        insights.push({
          type: 'warning' as const,
          title: 'Too Many Easy Questions',
          description: `${easyPercent.toFixed(0)}% of questions are easy. Consider adding more challenging questions.`,
        });
      } else {
        insights.push({
          type: 'success' as const,
          title: 'Good Question Balance',
          description: 'Your questions have a good difficulty distribution.',
        });
      }

      if (totalQuestions < 20) {
        insights.push({
          type: 'info' as const,
          title: 'Build Your Question Bank',
          description: `You have ${totalQuestions} questions. Aim for at least 50 for better coverage.`,
        });
      }
    }

    return {
      examDistribution,
      difficulty: { easy, medium, hard },
      coverage,
      parameterAnalysis,
      insights,
    };
  }, [questions, exams]);

  const handleExportReport = () => {
    const report = {
      generatedAt: new Date().toISOString(),
      summary: {
        totalQuestions: questions?.length || 0,
        totalExams: exams?.length || 0,
        difficulty: analyticsData.difficulty,
      },
      insights: analyticsData.insights,
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-report-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <AppLayout title="Analytics" subtitle="Detailed insights and metrics">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-12 h-12 animate-spin text-primary-500" />
        </div>
      </AppLayout>
    );
  }

  const totalQuestions = questions?.length || 0;
  const totalExams = exams?.length || 0;
  const avgQuestionsPerExam = totalExams > 0 ? Math.round(totalQuestions / totalExams) : 0;
  const avgCoverage = analyticsData.coverage.length > 0
    ? Math.round(analyticsData.coverage.reduce((sum, c) => sum + c.coverage, 0) / analyticsData.coverage.length)
    : 0;

  return (
    <AppLayout
      title="Analytics"
      subtitle="Detailed insights and performance metrics"
    >
      {/* Export Button - Responsive */}
      <div className="flex justify-end gap-3 mb-4 sm:mb-6">
        <Button 
          variant="outline" 
          onClick={handleExportReport}
          className="text-sm"
        >
          <Download className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Export Report</span>
          <span className="sm:hidden">Export</span>
        </Button>
      </div>

      {/* Summary Cards - Fully Responsive */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <Card>
          <CardContent className="pt-4 sm:pt-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-2 sm:gap-0">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 mb-1 truncate">
                  Total Questions
                </p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                  {totalQuestions}
                </p>
              </div>
              <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-lg flex-shrink-0">
                <FileText className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4 sm:pt-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-2 sm:gap-0">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 mb-1 truncate">
                  Total Exams
                </p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                  {totalExams}
                </p>
              </div>
              <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-gradient-to-br from-success-500 to-success-700 shadow-lg flex-shrink-0">
                <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4 sm:pt-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-2 sm:gap-0">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 mb-1 truncate">
                  Avg/Exam
                </p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                  {avgQuestionsPerExam}
                </p>
              </div>
              <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-gradient-to-br from-warning-500 to-warning-700 shadow-lg flex-shrink-0">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4 sm:pt-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-2 sm:gap-0">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 mb-1 truncate">
                  Coverage
                </p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                  {avgCoverage}%
                </p>
              </div>
              <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-gradient-to-br from-purple-500 to-purple-700 shadow-lg flex-shrink-0">
                <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid - Stacks on small screens */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 mb-6">
        <QuestionDistributionChart data={analyticsData.examDistribution} />
        <DifficultyDistributionChart 
          easy={analyticsData.difficulty.easy}
          medium={analyticsData.difficulty.medium}
          hard={analyticsData.difficulty.hard}
        />
      </div>

      {/* Coverage Table - Scrollable on mobile */}
      <div className="mb-6 overflow-x-auto">
        <ContentCoverageTable data={analyticsData.coverage} />
      </div>

      {/* Parameter Analysis & Insights - Stacks on mobile */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
        <div className="xl:col-span-2">
          <ParameterAnalysis data={analyticsData.parameterAnalysis} />
        </div>
        <div className="xl:col-span-1">
          <QuickInsights insights={analyticsData.insights} />
        </div>
      </div>
    </AppLayout>
  );
}