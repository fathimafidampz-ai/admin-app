'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Search, Filter, X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { hierarchyApi } from '@/lib/api';

interface FilterState {
  search: string;
  examId: string;
  subjectId: string;
  chapterId: string;
  topicId: string;
  conceptId: string;
  difficulty: string;
}

interface QuestionFiltersProps {
  onFilterChange: (filters: FilterState) => void;
}

export function QuestionFilters({ onFilterChange }: QuestionFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    examId: '',
    subjectId: '',
    chapterId: '',
    topicId: '',
    conceptId: '',
    difficulty: '',
  });

  const [showFilters, setShowFilters] = useState(false);

  // Fetch hierarchy data
  const { data: exams } = useQuery({
    queryKey: ['exams'],
    queryFn: hierarchyApi.getAllExams,
  });

  const { data: subjects } = useQuery({
    queryKey: ['subjects', filters.examId],
    queryFn: () => hierarchyApi.getSubjects(filters.examId),
    enabled: !!filters.examId,
  });

  const { data: chapters } = useQuery({
    queryKey: ['chapters', filters.subjectId],
    queryFn: () => hierarchyApi.getChapters(filters.subjectId),
    enabled: !!filters.subjectId,
  });

  const { data: topics } = useQuery({
    queryKey: ['topics', filters.chapterId],
    queryFn: () => hierarchyApi.getTopics(filters.chapterId),
    enabled: !!filters.chapterId,
  });

  const { data: concepts } = useQuery({
    queryKey: ['concepts', filters.topicId],
    queryFn: () => hierarchyApi.getConcepts(filters.topicId),
    enabled: !!filters.topicId,
  });

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value };
    
    // Reset dependent filters
    if (key === 'examId') {
      newFilters.subjectId = '';
      newFilters.chapterId = '';
      newFilters.topicId = '';
      newFilters.conceptId = '';
    } else if (key === 'subjectId') {
      newFilters.chapterId = '';
      newFilters.topicId = '';
      newFilters.conceptId = '';
    } else if (key === 'chapterId') {
      newFilters.topicId = '';
      newFilters.conceptId = '';
    } else if (key === 'topicId') {
      newFilters.conceptId = '';
    }
    
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const emptyFilters: FilterState = {
      search: '',
      examId: '',
      subjectId: '',
      chapterId: '',
      topicId: '',
      conceptId: '',
      difficulty: '',
    };
    setFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };

  const hasActiveFilters = Object.values(filters).some(v => v !== '');

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </CardTitle>
          <div className="flex gap-2">
            {hasActiveFilters && (
              <Button variant="outline" size="sm" onClick={clearFilters}>
                <X className="w-4 h-4 mr-2" />
                Clear All
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              {showFilters ? 'Hide' : 'Show'} Filters
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Search Bar - Always Visible */}
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search questions by content or tags..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-colors"
            />
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="space-y-4">
            {/* Difficulty Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty Level
              </label>
              <select
                value={filters.difficulty}
                onChange={(e) => handleFilterChange('difficulty', e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-colors"
              >
                <option value="">All Levels</option>
                <option value="easy">Easy (0-0.33)</option>
                <option value="medium">Medium (0.33-0.67)</option>
                <option value="hard">Hard (0.67-1)</option>
              </select>
            </div>

            {/* Hierarchy Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Exam */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Exam
                </label>
                <select
                  value={filters.examId}
                  onChange={(e) => handleFilterChange('examId', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-colors"
                >
                  <option value="">All Exams</option>
                  {exams?.map((exam: any) => (
                    <option key={exam.id} value={exam.id}>
                      {exam.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <select
                  value={filters.subjectId}
                  onChange={(e) => handleFilterChange('subjectId', e.target.value)}
                  disabled={!filters.examId}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-colors disabled:bg-gray-50"
                >
                  <option value="">All Subjects</option>
                  {subjects?.map((subject: any) => (
                    <option key={subject.id} value={subject.id}>
                      {subject.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Chapter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chapter
                </label>
                <select
                  value={filters.chapterId}
                  onChange={(e) => handleFilterChange('chapterId', e.target.value)}
                  disabled={!filters.subjectId}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-colors disabled:bg-gray-50"
                >
                  <option value="">All Chapters</option>
                  {chapters?.map((chapter: any) => (
                    <option key={chapter.id} value={chapter.id}>
                      {chapter.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Topic */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Topic
                </label>
                <select
                  value={filters.topicId}
                  onChange={(e) => handleFilterChange('topicId', e.target.value)}
                  disabled={!filters.chapterId}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-colors disabled:bg-gray-50"
                >
                  <option value="">All Topics</option>
                  {topics?.map((topic: any) => (
                    <option key={topic.id} value={topic.id}>
                      {topic.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Concept */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Concept
                </label>
                <select
                  value={filters.conceptId}
                  onChange={(e) => handleFilterChange('conceptId', e.target.value)}
                  disabled={!filters.topicId}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-colors disabled:bg-gray-50"
                >
                  <option value="">All Concepts</option>
                  {concepts?.map((concept: any) => (
                    <option key={concept.id} value={concept.id}>
                      {concept.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-2">Active Filters:</p>
            <div className="flex flex-wrap gap-2">
              {filters.search && (
                <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
                  Search: "{filters.search}"
                </span>
              )}
              {filters.difficulty && (
                <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
                  {filters.difficulty.charAt(0).toUpperCase() + filters.difficulty.slice(1)}
                </span>
              )}
              {filters.conceptId && (
                <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
                  Concept Selected
                </span>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}