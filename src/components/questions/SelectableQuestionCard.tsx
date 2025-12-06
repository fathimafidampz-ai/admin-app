'use client';

import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Eye, Edit, Trash2, CheckCircle2, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Question {
  id: string;
  content: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
  difficulty: number;
  discrimination: number;
  guessing: number;
  tags?: string[];
}

interface SelectableQuestionCardProps {
  question: Question;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onView: (id: string) => void;
}

export function SelectableQuestionCard({
  question,
  isSelected,
  onToggleSelect,
  onEdit,
  onDelete,
  onView,
}: SelectableQuestionCardProps) {
  const getDifficultyLabel = (difficulty: number) => {
    if (difficulty < 0.33) return { label: 'Easy', color: 'bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-300' };
    if (difficulty < 0.67) return { label: 'Medium', color: 'bg-warning-100 dark:bg-warning-900/30 text-warning-700 dark:text-warning-300' };
    return { label: 'Hard', color: 'bg-error-100 dark:bg-error-900/30 text-error-700 dark:text-error-300' };
  };

  const difficultyInfo = getDifficultyLabel(question.difficulty);

  const getOptionClass = (option: string) => {
    const isCorrect = option === question.correct_answer;
    
    if (isCorrect) {
      return cn(
        'flex items-center gap-3 p-3 rounded-lg border-2 transition-all',
        'bg-success-50 dark:bg-success-900/20',
        'border-success-300 dark:border-success-700',
        'text-gray-900 dark:text-gray-100'
      );
    }
    
    return cn(
      'flex items-center gap-3 p-3 rounded-lg border transition-all',
      'bg-white dark:bg-gray-800',
      'border-gray-200 dark:border-gray-700',
      'text-gray-700 dark:text-gray-300'
    );
  };

  return (
    <Card 
      className={cn(
        'transition-all duration-200 hover:shadow-lg',
        isSelected && 'ring-2 ring-primary-500 dark:ring-primary-400'
      )}
    >
      <CardContent className="pt-6">
        {/* Header with checkbox */}
        <div className="flex items-start gap-3 mb-4">
          <button
            onClick={() => onToggleSelect(question.id)}
            className="flex-shrink-0 mt-1"
          >
            {isSelected ? (
              <CheckCircle2 className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            ) : (
              <Circle className="w-5 h-5 text-gray-400 dark:text-gray-500 hover:text-primary-500 dark:hover:text-primary-400" />
            )}
          </button>
          
          <div className="flex-1">
            {/* Question content */}
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3 leading-relaxed">
              {question.content}
            </h3>

            {/* Difficulty badge */}
            <div className="mb-4">
              <span className={cn(
                'inline-block px-3 py-1 rounded-full text-xs font-medium',
                difficultyInfo.color
              )}>
                {difficultyInfo.label}
              </span>
            </div>

            {/* Options */}
            <div className="space-y-2 mb-4">
              <div className={getOptionClass('A')}>
                <div className={cn(
                  'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0',
                  question.correct_answer === 'A'
                    ? 'bg-success-500 dark:bg-success-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                )}>
                  A
                </div>
                <span className="text-sm">{question.option_a}</span>
                {question.correct_answer === 'A' && (
                  <CheckCircle2 className="w-4 h-4 text-success-600 dark:text-success-400 ml-auto" />
                )}
              </div>

              <div className={getOptionClass('B')}>
                <div className={cn(
                  'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0',
                  question.correct_answer === 'B'
                    ? 'bg-success-500 dark:bg-success-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                )}>
                  B
                </div>
                <span className="text-sm">{question.option_b}</span>
                {question.correct_answer === 'B' && (
                  <CheckCircle2 className="w-4 h-4 text-success-600 dark:text-success-400 ml-auto" />
                )}
              </div>

              <div className={getOptionClass('C')}>
                <div className={cn(
                  'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0',
                  question.correct_answer === 'C'
                    ? 'bg-success-500 dark:bg-success-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                )}>
                  C
                </div>
                <span className="text-sm">{question.option_c}</span>
                {question.correct_answer === 'C' && (
                  <CheckCircle2 className="w-4 h-4 text-success-600 dark:text-success-400 ml-auto" />
                )}
              </div>

              <div className={getOptionClass('D')}>
                <div className={cn(
                  'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0',
                  question.correct_answer === 'D'
                    ? 'bg-success-500 dark:bg-success-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                )}>
                  D
                </div>
                <span className="text-sm">{question.option_d}</span>
                {question.correct_answer === 'D' && (
                  <CheckCircle2 className="w-4 h-4 text-success-600 dark:text-success-400 ml-auto" />
                )}
              </div>
            </div>

            {/* 3PL Parameters */}
            <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
              <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">3PL Parameters</p>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Difficulty:</span>
                  <span className="ml-1 font-medium text-gray-900 dark:text-gray-100">
                    {question.difficulty.toFixed(2)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Discrimination:</span>
                  <span className="ml-1 font-medium text-gray-900 dark:text-gray-100">
                    {question.discrimination.toFixed(2)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Guessing:</span>
                  <span className="ml-1 font-medium text-gray-900 dark:text-gray-100">
                    {question.guessing.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Tags */}
            {question.tags && question.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-4">
                {question.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 text-xs rounded-md bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-700"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Action buttons */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onView(question.id)}
                className="flex-1"
              >
                <Eye className="w-4 h-4 mr-1" />
                View
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(question.id)}
                className="flex-1"
              >
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(question.id)}
                className="text-error-600 dark:text-error-400 hover:bg-error-50 dark:hover:bg-error-900/20 border-error-200 dark:border-error-800"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}