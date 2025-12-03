'use client';

import { AppLayout } from '@/components/layout/AppLayout';
import { useQuery } from '@tanstack/react-query';
import { statsApi } from '@/lib/api';
import { StatCard } from '@/components/dashboard/StatCard';
import { HierarchyDistributionChart } from '@/components/dashboard/HierarchyDistributionChart';
import { ExamTypeChart } from '@/components/dashboard/ExamTypeChart';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { 
  BarChart3, 
  Users, 
  FileText, 
  TrendingUp,
  Loader2 
} from 'lucide-react';

export default function DashboardPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['statistics'],
    queryFn: statsApi.getStatistics,
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  if (isLoading) {
    return (
      <AppLayout title="Dashboard" subtitle="Welcome back! Here's what's happening">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-12 h-12 animate-spin text-primary-500" />
        </div>
      </AppLayout>
    );
  }

  const statCards = [
    { 
      label: 'Total Exams', 
      value: stats?.total_exams || 0, 
      icon: FileText, 
      change: '+12%', 
      changeType: 'positive' as const,
      color: 'from-primary-500 to-primary-700'
    },
    { 
      label: 'Total Subjects', 
      value: stats?.total_subjects || 0, 
      icon: BarChart3, 
      change: '+8%', 
      changeType: 'positive' as const,
      color: 'from-success-500 to-success-700'
    },
    { 
      label: 'Total Chapters', 
      value: stats?.total_chapters || 0, 
      icon: TrendingUp, 
      change: '+23%', 
      changeType: 'positive' as const,
      color: 'from-warning-500 to-warning-700'
    },
    { 
      label: 'Total Concepts', 
      value: stats?.total_concepts || 0, 
      icon: Users, 
      change: '+5%', 
      changeType: 'positive' as const,
      color: 'from-secondary-500 to-secondary-700'
    },
  ];

  return (
    <AppLayout title="Dashboard" subtitle="Welcome back! Here's what's happening">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <StatCard
            key={stat.label}
            {...stat}
            delay={index * 100}
          />
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <QuickActions />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <HierarchyDistributionChart 
          data={stats?.hierarchy_distribution || {
            exams: 0,
            classes: 0,
            subjects: 0,
            chapters: 0,
            topics: 0,
            concepts: 0,
          }}
        />
        <ExamTypeChart 
          competitiveCount={stats?.competitive_exams || 0}
          schoolCount={stats?.school_exams || 0}
        />
      </div>

      {/* Recent Activity */}
      <RecentActivity activities={stats?.recent_activity || []} />
    </AppLayout>
  );
}