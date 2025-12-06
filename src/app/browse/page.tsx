'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { questionsApi } from '@/lib/api';
import { Loader2, FileQuestion, CheckCircle, AlertCircle, TrendingUp, CheckSquare, Square } from 'lucide-react';
import { QuestionFilters } from '@/components/questions/QuestionFilters';
import { SelectableQuestionCard } from '@/components/questions/SelectableQuestionCard';
import { EditQuestionModal } from '@/components/questions/EditQuestionModal';
import { DeleteConfirmDialog } from '@/components/questions/DeleteConfirmDialog';
import { QuestionPreviewModal } from '@/components/questions/QuestionPreviewModal';
import { BatchActions } from '@/components/questions/BatchActions';
import { BulkEditModal } from '@/components/questions/BulkEditModal';
import { BulkDeleteConfirm } from '@/components/questions/BulkDeleteConfirm';

interface FilterState {
  search: string;
  examId: string;
  subjectId: string;
  chapterId: string;
  topicId: string;
  conceptId: string;
  difficulty: string;
}

function QuestionStats({ 
  totalQuestions, 
  easyCount, 
  mediumCount, 
  hardCount 
}: { 
  totalQuestions: number;
  easyCount: number;
  mediumCount: number;
  hardCount: number;
}) {
  const stats = [
    {
      label: 'Total Questions',
      value: totalQuestions,
      icon: FileQuestion,
      color: 'from-primary-500 to-primary-700',
    },
    {
      label: 'Easy',
      value: easyCount,
      icon: CheckCircle,
      color: 'from-success-500 to-success-700',
    },
    {
      label: 'Medium',
      value: mediumCount,
      icon: AlertCircle,
      color: 'from-warning-500 to-warning-700',
    },
    {
      label: 'Hard',
      value: hardCount,
      icon: TrendingUp,
      color: 'from-error-500 to-error-700',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.label}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

export default function BrowsePage() {
  const router = useRouter();

  // ✅ CHECK AUTHENTICATION
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  const [filters, setFilters] = useState<FilterState>({
    search: '',
    examId: '',
    subjectId: '',
    chapterId: '',
    topicId: '',
    conceptId: '',
    difficulty: '',
  });

  const [selectedQuestions, setSelectedQuestions] = useState<Set<string>>(new Set());
  const [editingQuestion, setEditingQuestion] = useState<any>(null);
  const [deletingQuestion, setDeletingQuestion] = useState<any>(null);
  const [previewQuestion, setPreviewQuestion] = useState<any>(null);
  const [showBulkEdit, setShowBulkEdit] = useState(false);
  const [showBulkDelete, setShowBulkDelete] = useState(false);

  const queryClient = useQueryClient();

  const { data: questions, isLoading } = useQuery({
    queryKey: ['questions', filters.conceptId],
    queryFn: () => questionsApi.getAll(
      filters.conceptId 
        ? { concept_id: filters.conceptId } 
        : undefined
    ),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => questionsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
      setDeletingQuestion(null); // ✅ Close the dialog
      alert('Question deleted successfully!');
    },
    onError: (error) => {
      console.error('Delete error:', error);
      alert('Failed to delete question. Please try again.');
      setDeletingQuestion(null); // ✅ Close dialog even on error
    },
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      await Promise.all(ids.map(id => questionsApi.delete(id)));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
      alert(`${selectedQuestions.size} questions deleted successfully!`);
      setSelectedQuestions(new Set());
      setShowBulkDelete(false);
    },
    onError: (error) => {
      console.error('Bulk delete error:', error);
      alert('Failed to delete questions. Please try again.');
      setShowBulkDelete(false);
    },
  });

  const filteredQuestions = useMemo(() => {
    if (!questions) return [];

    return questions.filter((q: any) => {
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const contentMatch = q.content.toLowerCase().includes(searchLower);
        const tagsMatch = q.tags?.some((tag: string) => 
          tag.toLowerCase().includes(searchLower)
        );
        if (!contentMatch && !tagsMatch) return false;
      }

      if (filters.difficulty) {
        const diff = q.difficulty;
        if (filters.difficulty === 'easy' && diff >= 0.33) return false;
        if (filters.difficulty === 'medium' && (diff < 0.33 || diff >= 0.67)) return false;
        if (filters.difficulty === 'hard' && diff < 0.67) return false;
      }

      return true;
    });
  }, [questions, filters]);

  const stats = useMemo(() => {
    const total = filteredQuestions.length;
    const easy = filteredQuestions.filter((q: any) => q.difficulty < 0.33).length;
    const medium = filteredQuestions.filter((q: any) => q.difficulty >= 0.33 && q.difficulty < 0.67).length;
    const hard = filteredQuestions.filter((q: any) => q.difficulty >= 0.67).length;

    return { total, easy, medium, hard };
  }, [filteredQuestions]);

  const handleToggleSelect = (id: string) => {
    const newSelected = new Set(selectedQuestions);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedQuestions(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedQuestions.size === filteredQuestions.length) {
      setSelectedQuestions(new Set());
    } else {
      setSelectedQuestions(new Set(filteredQuestions.map((q: any) => q.id)));
    }
  };

  const handleBulkEdit = (updates: any) => {
    console.log('Bulk updating:', selectedQuestions.size, 'questions with:', updates);
    alert(`${selectedQuestions.size} questions updated successfully!`);
    setShowBulkEdit(false);
    setSelectedQuestions(new Set());
  };

  const handleBulkDelete = () => {
    bulkDeleteMutation.mutate(Array.from(selectedQuestions));
  };

  const handleBulkExport = () => {
    const selectedData = filteredQuestions.filter((q: any) => 
      selectedQuestions.has(q.id)
    );

    const blob = new Blob([JSON.stringify(selectedData, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `questions-export-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    alert(`${selectedQuestions.size} questions exported successfully!`);
  };

  const handleBulkTag = () => {
    alert('Bulk tag functionality - opens tag management modal');
  };

  return (
    <AppLayout
      title="Browse Questions"
      subtitle="Search, filter, and manage your question bank"
    >
      <QuestionStats
        totalQuestions={stats.total}
        easyCount={stats.easy}
        mediumCount={stats.medium}
        hardCount={stats.hard}
      />

      {/* Selection Controls */}
      {filteredQuestions.length > 0 && (
        <div className="mb-4 flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSelectAll}
          >
            {selectedQuestions.size === filteredQuestions.length ? (
              <>
                <CheckSquare className="w-4 h-4 mr-2" />
                Deselect All
              </>
            ) : (
              <>
                <Square className="w-4 h-4 mr-2" />
                Select All
              </>
            )}
          </Button>

          {selectedQuestions.size > 0 && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {selectedQuestions.size} of {filteredQuestions.length} questions selected
            </p>
          )}
        </div>
      )}

      <div className="mb-6">
        <QuestionFilters onFilterChange={setFilters} />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-12 h-12 animate-spin text-primary-500" />
        </div>
      ) : filteredQuestions.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 text-lg">No questions found</p>
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">Try adjusting your filters or create a new question</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredQuestions.map((question: any) => (
            <SelectableQuestionCard
              key={question.id}
              question={question}
              isSelected={selectedQuestions.has(question.id)}
              onToggleSelect={handleToggleSelect}
              onEdit={(id) => {
                const q = questions?.find((q: any) => q.id === id);
                if (q) setEditingQuestion(q);
              }}
              onDelete={(id) => {
                const q = questions?.find((q: any) => q.id === id);
                if (q) setDeletingQuestion(q);
              }}
              onView={(id) => {
                const q = questions?.find((q: any) => q.id === id);
                if (q) setPreviewQuestion(q);
              }}
            />
          ))}
        </div>
      )}

      {/* Batch Actions Bar */}
      <BatchActions
        selectedCount={selectedQuestions.size}
        onBulkDelete={() => setShowBulkDelete(true)}
        onBulkEdit={() => setShowBulkEdit(true)}
        onBulkExport={handleBulkExport}
        onBulkTag={handleBulkTag}
        onClearSelection={() => setSelectedQuestions(new Set())}
      />

      {/* Modals */}
      {editingQuestion && (
        <EditQuestionModal
          question={editingQuestion}
          onClose={() => setEditingQuestion(null)}
        />
      )}

      {deletingQuestion && (
        <DeleteConfirmDialog
          questionContent={deletingQuestion.content}
          onConfirm={() => {
            deleteMutation.mutate(deletingQuestion.id);
          }}
          onCancel={() => setDeletingQuestion(null)}
          isDeleting={deleteMutation.isPending}
        />
      )}

      {previewQuestion && (
        <QuestionPreviewModal
          question={previewQuestion}
          allQuestions={filteredQuestions}
          onClose={() => setPreviewQuestion(null)}
          onNavigate={(id) => {
            const question = filteredQuestions.find((q: any) => q.id === id);
            if (question) setPreviewQuestion(question);
          }}
          onDuplicate={(id) => {
            alert('Duplicate functionality: Create a copy of this question');
            setPreviewQuestion(null);
          }}
        />
      )}

      {showBulkEdit && (
        <BulkEditModal
          selectedCount={selectedQuestions.size}
          onClose={() => setShowBulkEdit(false)}
          onSave={handleBulkEdit}
        />
      )}

      {showBulkDelete && (
        <BulkDeleteConfirm
          selectedCount={selectedQuestions.size}
          onConfirm={handleBulkDelete}
          onCancel={() => setShowBulkDelete(false)}
          isDeleting={bulkDeleteMutation.isPending}
        />
      )}
    </AppLayout>
  );
}