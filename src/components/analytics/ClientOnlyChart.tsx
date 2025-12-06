'use client';

import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

export const DifficultyDistributionChart = dynamic(
  () => import('./DifficultyDistributionChart').then(mod => mod.DifficultyDistributionChart),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center" style={{ height: '320px' }}>
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    ),
  }
);

export const QuestionDistributionChart = dynamic(
  () => import('./QuestionDistributionChart').then(mod => mod.QuestionDistributionChart),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center" style={{ height: '320px' }}>
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    ),
  }
);

export const ParameterAnalysis = dynamic(
  () => import('./ParameterAnalysis').then(mod => mod.ParameterAnalysis),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center" style={{ height: '320px' }}>
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    ),
  }
);