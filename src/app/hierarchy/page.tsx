'use client';

import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Network, Plus, List, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  HierarchySelector,
  CreateExamForm,
  CreateClassForm,
  CreateSubjectForm,
  CreateChapterForm,
  CreateTopicForm,
  CreateConceptForm,
  HierarchyTree
} from '@/components/hierarchy';

type HierarchyLevel = {
  id: string;
  name: string;
  type: 'exam' | 'class' | 'subject' | 'chapter' | 'topic' | 'concept';
};

type ViewMode = 'create' | 'list';

// Breadcrumb component
function HierarchyBreadcrumb({ 
  path, 
  onLevelClick 
}: { 
  path: HierarchyLevel[]; 
  onLevelClick: (index: number) => void;
}) {
  if (path.length === 0) return null;

  return (
    <div className="flex items-center gap-2 flex-wrap mb-6">
      {path.map((level, index) => (
        <div key={level.id} className="flex items-center gap-2">
          <button
            onClick={() => onLevelClick(index)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
              index === path.length - 1
                ? "bg-primary-100 text-primary-700"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            )}
          >
            <span className="capitalize">{level.type}</span>: {level.name}
          </button>
          {index < path.length - 1 && (
            <ChevronRight className="w-4 h-4 text-gray-400" />
          )}
        </div>
      ))}
    </div>
  );
}

export default function HierarchyPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('create');
  const [currentPath, setCurrentPath] = useState<HierarchyLevel[]>([]);
  const [examType, setExamType] = useState<'competitive' | 'school' | null>(null);
  
  // Track selected IDs
  const [selectedExamId, setSelectedExamId] = useState<string>('');
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');
  const [selectedChapterId, setSelectedChapterId] = useState<string>('');
  const [selectedTopicId, setSelectedTopicId] = useState<string>('');

  // Add refresh key to force re-render
  const [refreshKey, setRefreshKey] = useState(0);

  const handleExamSelect = (id: string, name: string, type: 'competitive' | 'school') => {
    setSelectedExamId(id);
    setExamType(type);
    setSelectedClassId('');
    setSelectedSubjectId('');
    setSelectedChapterId('');
    setSelectedTopicId('');
    setCurrentPath([{ id, name, type: 'exam' }]);
  };

  const handleClassSelect = (id: string, name: string) => {
    setSelectedClassId(id);
    setSelectedSubjectId('');
    setSelectedChapterId('');
    setSelectedTopicId('');
    const newPath = currentPath.slice(0, 1);
    newPath.push({ id, name, type: 'class' });
    setCurrentPath(newPath);
  };

  const handleSubjectSelect = (id: string, name: string) => {
    setSelectedSubjectId(id);
    setSelectedChapterId('');
    setSelectedTopicId('');
    const pathUpToParent = examType === 'school' ? currentPath.slice(0, 2) : currentPath.slice(0, 1);
    const newPath = [...pathUpToParent, { id, name, type: 'subject' as const }];
    setCurrentPath(newPath);
  };

  const handleChapterSelect = (id: string, name: string) => {
    setSelectedChapterId(id);
    setSelectedTopicId('');
    const pathLength = examType === 'school' ? 3 : 2;
    const newPath = currentPath.slice(0, pathLength);
    newPath.push({ id, name, type: 'chapter' });
    setCurrentPath(newPath);
  };

  const handleTopicSelect = (id: string, name: string) => {
    setSelectedTopicId(id);
    const pathLength = examType === 'school' ? 4 : 3;
    const newPath = currentPath.slice(0, pathLength);
    newPath.push({ id, name, type: 'topic' });
    setCurrentPath(newPath);
  };

  const handleBreadcrumbClick = (index: number) => {
    const newPath = currentPath.slice(0, index + 1);
    setCurrentPath(newPath);
    
    const clickedLevel = currentPath[index];
    
    // Reset selections based on level clicked
    if (clickedLevel.type === 'exam') {
      setSelectedClassId('');
      setSelectedSubjectId('');
      setSelectedChapterId('');
      setSelectedTopicId('');
    } else if (clickedLevel.type === 'class') {
      setSelectedSubjectId('');
      setSelectedChapterId('');
      setSelectedTopicId('');
    } else if (clickedLevel.type === 'subject') {
      setSelectedChapterId('');
      setSelectedTopicId('');
    } else if (clickedLevel.type === 'chapter') {
      setSelectedTopicId('');
    }
  };

  // Success handlers
  const handleExamCreated = () => {
    setRefreshKey(prev => prev + 1);
    console.log('Exam created successfully!');
  };

  const handleClassCreated = () => {
    setRefreshKey(prev => prev + 1);
    console.log('Class created successfully!');
  };

  const handleSubjectCreated = () => {
    setRefreshKey(prev => prev + 1);
    console.log('Subject created successfully!');
  };

  const handleChapterCreated = () => {
    setRefreshKey(prev => prev + 1);
    console.log('Chapter created successfully!');
  };

  const handleTopicCreated = () => {
    setRefreshKey(prev => prev + 1);
    console.log('Topic created successfully!');
  };

  const handleConceptCreated = () => {
    setRefreshKey(prev => prev + 1);
    console.log('Concept created successfully!');
  };

  // Determine which form to show
  const getCurrentForm = () => {
    // No exam selected - show exam form
    if (!selectedExamId) {
      return <CreateExamForm onSuccess={handleExamCreated} />;
    }

    // School exam path: Exam → Class → Subject → Chapter → Topic → Concept
    if (examType === 'school') {
      if (!selectedClassId) {
        return (
          <CreateClassForm
            examId={selectedExamId}
            examName={currentPath[0]?.name || ''}
            onSuccess={handleClassCreated}
          />
        );
      }
      
      if (!selectedSubjectId) {
        return (
          <CreateSubjectForm
            examId={selectedExamId}
            classId={selectedClassId}
            className={currentPath[1]?.name || ''}
            onSuccess={handleSubjectCreated}
          />
        );
      }
    }
    
    // Competitive exam path: Exam → Subject → Chapter → Topic → Concept
    if (examType === 'competitive') {
      if (!selectedSubjectId) {
        return (
          <CreateSubjectForm
            examId={selectedExamId}
            examName={currentPath[0]?.name || ''}
            onSuccess={handleSubjectCreated}
          />
        );
      }
    }

    // Common path for both: Subject → Chapter → Topic → Concept
    if (!selectedChapterId) {
      return (
        <CreateChapterForm
          subjectId={selectedSubjectId}
          subjectName={currentPath.find(p => p.type === 'subject')?.name || ''}
          onSuccess={handleChapterCreated}
        />
      );
    }
    
    if (!selectedTopicId) {
      return (
        <CreateTopicForm
          chapterId={selectedChapterId}
          chapterName={currentPath.find(p => p.type === 'chapter')?.name || ''}
          onSuccess={handleTopicCreated}
        />
      );
    }
    
    return (
      <CreateConceptForm
        topicId={selectedTopicId}
        topicName={currentPath.find(p => p.type === 'topic')?.name || ''}
        onSuccess={handleConceptCreated}
      />
    );
  };

  return (
    <AppLayout 
      title="Create Hierarchy" 
      subtitle="Build your content structure for competitive and school exams"
    >
      {/* View Mode Toggle */}
      <div className="flex items-center gap-3 mb-6">
        <Button
          variant={viewMode === 'create' ? 'primary' : 'outline'}
          onClick={() => setViewMode('create')}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Mode
        </Button>
        <Button
          variant={viewMode === 'list' ? 'primary' : 'outline'}
          onClick={() => setViewMode('list')}
          className="flex items-center gap-2"
        >
          <List className="w-4 h-4" />
          View Hierarchy
        </Button>
      </div>

      {viewMode === 'create' ? (
        <>
          {/* Breadcrumb */}
          <HierarchyBreadcrumb 
            path={currentPath} 
            onLevelClick={handleBreadcrumbClick}
          />

          {/* Hierarchy Navigation */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary-100">
                  <Network className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <CardTitle>Navigate Hierarchy</CardTitle>
                  <CardDescription>
                    Select items to navigate deeper into the hierarchy
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <HierarchySelector
                key={refreshKey}
                examId={selectedExamId}
                classId={selectedClassId}
                subjectId={selectedSubjectId}
                chapterId={selectedChapterId}
                topicId={selectedTopicId}
                onExamSelect={handleExamSelect}
                onClassSelect={handleClassSelect}
                onSubjectSelect={handleSubjectSelect}
                onChapterSelect={handleChapterSelect}
                onTopicSelect={handleTopicSelect}
              />
            </CardContent>
          </Card>

          {/* Create Form */}
          <div className="max-w-3xl">
            {getCurrentForm()}
          </div>
        </>
      ) : (
        <HierarchyTree examId={selectedExamId || undefined} />
      )}
    </AppLayout>
  );
}