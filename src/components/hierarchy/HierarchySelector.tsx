'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { hierarchyApi } from '@/lib/api';
import { ChevronDown, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SelectorProps {
  examId?: string;
  classId?: string;
  subjectId?: string;
  chapterId?: string;
  topicId?: string;
  onExamSelect?: (id: string, name: string, examType: 'competitive' | 'school') => void;
  onClassSelect?: (id: string, name: string) => void;
  onSubjectSelect?: (id: string, name: string) => void;
  onChapterSelect?: (id: string, name: string) => void;
  onTopicSelect?: (id: string, name: string) => void;
}

export function HierarchySelector({
  examId,
  classId,
  subjectId,
  chapterId,
  topicId,
  onExamSelect,
  onClassSelect,
  onSubjectSelect,
  onChapterSelect,
  onTopicSelect,
}: SelectorProps) {
  const [selectedExamType, setSelectedExamType] = useState<'competitive' | 'school' | null>(null);

  // Fetch exams
  const { data: exams, isLoading: loadingExams } = useQuery({
    queryKey: ['exams'],
    queryFn: hierarchyApi.getAllExams,
  });

  // Fetch classes (for school exams)
  const { data: classes, isLoading: loadingClasses } = useQuery({
    queryKey: ['classes', examId],
    queryFn: () => hierarchyApi.getClasses(examId!),
    enabled: !!examId && selectedExamType === 'school',
  });

  // Fetch subjects
  const { data: subjects, isLoading: loadingSubjects } = useQuery({
    queryKey: ['subjects', examId, classId],
    queryFn: () => hierarchyApi.getSubjects(
      selectedExamType === 'competitive' ? examId : undefined,
      selectedExamType === 'school' ? classId : undefined
    ),
    enabled: (selectedExamType === 'competitive' && !!examId) || (selectedExamType === 'school' && !!classId),
  });

  // Fetch chapters
  const { data: chapters, isLoading: loadingChapters } = useQuery({
    queryKey: ['chapters', subjectId],
    queryFn: () => hierarchyApi.getChapters(subjectId!),
    enabled: !!subjectId,
  });

  // Fetch topics
  const { data: topics, isLoading: loadingTopics } = useQuery({
    queryKey: ['topics', chapterId],
    queryFn: () => hierarchyApi.getTopics(chapterId!),
    enabled: !!chapterId,
  });

  // Update exam type when exam is selected
  useEffect(() => {
    if (examId && exams) {
      const selectedExam = exams.find((ex: any) => ex.id === examId);
      if (selectedExam) {
        setSelectedExamType(selectedExam.exam_type);
      }
    }
  }, [examId, exams]);

  const isSchoolExam = selectedExamType === 'school';
  const showClassSelector = isSchoolExam;

  return (
    <div className={cn(
      "grid gap-4",
      showClassSelector ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-5" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
    )}>
      {/* Exam Selector */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Exam
        </label>
        <div className="relative">
          <select
            value={examId || ''}
            onChange={(e) => {
              const selectedExam = exams?.find((ex: any) => ex.id === e.target.value);
              onExamSelect?.(e.target.value, selectedExam?.name || '', selectedExam?.exam_type || 'competitive');
            }}
            disabled={loadingExams}
            className="w-full px-4 py-2.5 pr-10 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-colors appearance-none bg-white disabled:bg-gray-50 disabled:cursor-not-allowed"
          >
            <option value="">Choose an exam...</option>
            {exams?.map((exam: any) => (
              <option key={exam.id} value={exam.id}>
                {exam.name} ({exam.exam_type})
              </option>
            ))}
          </select>
          {loadingExams ? (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 animate-spin" />
          ) : (
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          )}
        </div>
      </div>

      {/* Class Selector (Only for School Exams) */}
      {showClassSelector && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Class
          </label>
          <div className="relative">
            <select
              value={classId || ''}
              onChange={(e) => {
                const selectedClass = classes?.find((cls: any) => cls.id === e.target.value);
                onClassSelect?.(e.target.value, selectedClass?.name || '');
              }}
              disabled={!examId || loadingClasses}
              className="w-full px-4 py-2.5 pr-10 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-colors appearance-none bg-white disabled:bg-gray-50 disabled:cursor-not-allowed"
            >
              <option value="">Choose a class...</option>
              {classes?.map((cls: any) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </select>
            {loadingClasses ? (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 animate-spin" />
            ) : (
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            )}
          </div>
        </div>
      )}

      {/* Subject Selector */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Subject
        </label>
        <div className="relative">
          <select
            value={subjectId || ''}
            onChange={(e) => {
              const selectedSubject = subjects?.find((sub: any) => sub.id === e.target.value);
              onSubjectSelect?.(e.target.value, selectedSubject?.name || '');
            }}
            disabled={
              (selectedExamType === 'competitive' && !examId) ||
              (selectedExamType === 'school' && !classId) ||
              loadingSubjects
            }
            className="w-full px-4 py-2.5 pr-10 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-colors appearance-none bg-white disabled:bg-gray-50 disabled:cursor-not-allowed"
          >
            <option value="">Choose a subject...</option>
            {subjects?.map((subject: any) => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>
          {loadingSubjects ? (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 animate-spin" />
          ) : (
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          )}
        </div>
      </div>

      {/* Chapter Selector */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Chapter
        </label>
        <div className="relative">
          <select
            value={chapterId || ''}
            onChange={(e) => {
              const selectedChapter = chapters?.find((ch: any) => ch.id === e.target.value);
              onChapterSelect?.(e.target.value, selectedChapter?.name || '');
            }}
            disabled={!subjectId || loadingChapters}
            className="w-full px-4 py-2.5 pr-10 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-colors appearance-none bg-white disabled:bg-gray-50 disabled:cursor-not-allowed"
          >
            <option value="">Choose a chapter...</option>
            {chapters?.map((chapter: any) => (
              <option key={chapter.id} value={chapter.id}>
                {chapter.name}
              </option>
            ))}
          </select>
          {loadingChapters ? (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 animate-spin" />
          ) : (
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          )}
        </div>
      </div>

      {/* Topic Selector */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Topic
        </label>
        <div className="relative">
          <select
            value={topicId || ''}
            onChange={(e) => {
              const selectedTopic = topics?.find((tp: any) => tp.id === e.target.value);
              onTopicSelect?.(e.target.value, selectedTopic?.name || '');
            }}
            disabled={!chapterId || loadingTopics}
            className="w-full px-4 py-2.5 pr-10 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-colors appearance-none bg-white disabled:bg-gray-50 disabled:cursor-not-allowed"
          >
            <option value="">Choose a topic...</option>
            {topics?.map((topic: any) => (
              <option key={topic.id} value={topic.id}>
                {topic.name}
              </option>
            ))}
          </select>
          {loadingTopics ? (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 animate-spin" />
          ) : (
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          )}
        </div>
      </div>
    </div>
  );
}