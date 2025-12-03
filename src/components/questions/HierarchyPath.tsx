'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { hierarchyApi } from '@/lib/api';
import { ChevronDown, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HierarchyPathProps {
  onConceptSelect: (conceptId: string, path: string) => void;
  selectedConceptId?: string;
}

export function HierarchyPath({ onConceptSelect, selectedConceptId }: HierarchyPathProps) {
  const [selectedExamId, setSelectedExamId] = useState('');
  const [selectedExamType, setSelectedExamType] = useState<'competitive' | 'school' | null>(null);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [selectedChapterId, setSelectedChapterId] = useState('');
  const [selectedTopicId, setSelectedTopicId] = useState('');
  const [hierarchyPath, setHierarchyPath] = useState('');

  // Fetch exams
  const { data: exams, isLoading: loadingExams } = useQuery({
    queryKey: ['exams'],
    queryFn: hierarchyApi.getAllExams,
  });

  // Fetch classes
  const { data: classes, isLoading: loadingClasses } = useQuery({
    queryKey: ['classes', selectedExamId],
    queryFn: () => hierarchyApi.getClasses(selectedExamId!),
    enabled: !!selectedExamId && selectedExamType === 'school',
  });

  // Fetch subjects
  const { data: subjects, isLoading: loadingSubjects } = useQuery({
    queryKey: ['subjects', selectedExamId, selectedClassId],
    queryFn: () => hierarchyApi.getSubjects(
      selectedExamType === 'competitive' ? selectedExamId : undefined,
      selectedExamType === 'school' ? selectedClassId : undefined
    ),
    enabled: (selectedExamType === 'competitive' && !!selectedExamId) || 
             (selectedExamType === 'school' && !!selectedClassId),
  });

  // Fetch chapters
  const { data: chapters, isLoading: loadingChapters } = useQuery({
    queryKey: ['chapters', selectedSubjectId],
    queryFn: () => hierarchyApi.getChapters(selectedSubjectId!),
    enabled: !!selectedSubjectId,
  });

  // Fetch topics
  const { data: topics, isLoading: loadingTopics } = useQuery({
    queryKey: ['topics', selectedChapterId],
    queryFn: () => hierarchyApi.getTopics(selectedChapterId!),
    enabled: !!selectedChapterId,
  });

  // Fetch concepts
  const { data: concepts, isLoading: loadingConcepts } = useQuery({
    queryKey: ['concepts', selectedTopicId],
    queryFn: () => hierarchyApi.getConcepts(selectedTopicId!),
    enabled: !!selectedTopicId,
  });

  const buildPath = (
    examName: string,
    className: string | null,
    subjectName: string,
    chapterName: string,
    topicName: string,
    conceptName: string
  ) => {
    const parts = [examName];
    if (className) parts.push(className);
    parts.push(subjectName, chapterName, topicName, conceptName);
    return parts.join(' → ');
  };

  const handleExamChange = (examId: string) => {
    const exam = exams?.find((e: any) => e.id === examId);
    setSelectedExamId(examId);
    setSelectedExamType(exam?.exam_type || null);
    setSelectedClassId('');
    setSelectedSubjectId('');
    setSelectedChapterId('');
    setSelectedTopicId('');
  };

  const handleConceptChange = (conceptId: string) => {
    const exam = exams?.find((e: any) => e.id === selectedExamId);
    const cls = classes?.find((c: any) => c.id === selectedClassId);
    const subject = subjects?.find((s: any) => s.id === selectedSubjectId);
    const chapter = chapters?.find((ch: any) => ch.id === selectedChapterId);
    const topic = topics?.find((t: any) => t.id === selectedTopicId);
    const concept = concepts?.find((c: any) => c.id === conceptId);

    const path = buildPath(
      exam?.name || '',
      cls?.name || null,
      subject?.name || '',
      chapter?.name || '',
      topic?.name || '',
      concept?.name || ''
    );

    setHierarchyPath(path);
    onConceptSelect(conceptId, path);
  };

  const isSchoolExam = selectedExamType === 'school';

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Exam */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Exam <span className="text-error-500">*</span>
          </label>
          <div className="relative">
            <select
              value={selectedExamId}
              onChange={(e) => handleExamChange(e.target.value)}
              disabled={loadingExams}
              className="w-full px-4 py-2.5 pr-10 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-colors appearance-none bg-white disabled:bg-gray-50"
            >
              <option value="">Select exam...</option>
              {exams?.map((exam: any) => (
                <option key={exam.id} value={exam.id}>
                  {exam.name}
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

        {/* Class (School only) */}
        {isSchoolExam && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Class <span className="text-error-500">*</span>
            </label>
            <div className="relative">
              <select
                value={selectedClassId}
                onChange={(e) => {
                  setSelectedClassId(e.target.value);
                  setSelectedSubjectId('');
                  setSelectedChapterId('');
                  setSelectedTopicId('');
                }}
                disabled={!selectedExamId || loadingClasses}
                className="w-full px-4 py-2.5 pr-10 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-colors appearance-none bg-white disabled:bg-gray-50"
              >
                <option value="">Select class...</option>
                {classes?.map((cls: any) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>
        )}

        {/* Subject */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Subject <span className="text-error-500">*</span>
          </label>
          <div className="relative">
            <select
              value={selectedSubjectId}
              onChange={(e) => {
                setSelectedSubjectId(e.target.value);
                setSelectedChapterId('');
                setSelectedTopicId('');
              }}
              disabled={
                (selectedExamType === 'competitive' && !selectedExamId) ||
                (selectedExamType === 'school' && !selectedClassId) ||
                loadingSubjects
              }
              className="w-full px-4 py-2.5 pr-10 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-colors appearance-none bg-white disabled:bg-gray-50"
            >
              <option value="">Select subject...</option>
              {subjects?.map((subject: any) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Chapter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Chapter <span className="text-error-500">*</span>
          </label>
          <div className="relative">
            <select
              value={selectedChapterId}
              onChange={(e) => {
                setSelectedChapterId(e.target.value);
                setSelectedTopicId('');
              }}
              disabled={!selectedSubjectId || loadingChapters}
              className="w-full px-4 py-2.5 pr-10 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-colors appearance-none bg-white disabled:bg-gray-50"
            >
              <option value="">Select chapter...</option>
              {chapters?.map((chapter: any) => (
                <option key={chapter.id} value={chapter.id}>
                  {chapter.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Topic */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Topic <span className="text-error-500">*</span>
          </label>
          <div className="relative">
            <select
              value={selectedTopicId}
              onChange={(e) => setSelectedTopicId(e.target.value)}
              disabled={!selectedChapterId || loadingTopics}
              className="w-full px-4 py-2.5 pr-10 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-colors appearance-none bg-white disabled:bg-gray-50"
            >
              <option value="">Select topic...</option>
              {topics?.map((topic: any) => (
                <option key={topic.id} value={topic.id}>
                  {topic.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Concept */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Concept <span className="text-error-500">*</span>
          </label>
          <div className="relative">
            <select
              value={selectedConceptId}
              onChange={(e) => handleConceptChange(e.target.value)}
              disabled={!selectedTopicId || loadingConcepts}
              className="w-full px-4 py-2.5 pr-10 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-colors appearance-none bg-white disabled:bg-gray-50"
            >
              <option value="">Select concept...</option>
              {concepts?.map((concept: any) => (
                <option key={concept.id} value={concept.id}>
                  {concept.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Hierarchy Path Display */}
      {hierarchyPath && (
        <div className="mt-4 p-4 bg-primary-50 border border-primary-200 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Selected Path:</p>
          <p className="text-sm font-medium text-primary-700">{hierarchyPath}</p>
        </div>
      )}
    </div>
  );
}