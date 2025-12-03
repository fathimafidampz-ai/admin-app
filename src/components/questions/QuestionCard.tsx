'use client';

import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Edit, Trash2, Eye, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Question } from '@/types';

interface QuestionCardProps {
  question: Question;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onView?: (id: string) => void;
}

export function QuestionCard({ question, onEdit, onDelete, onView }: QuestionCardProps) {
  const getOptionLabel = (option: 'A' | 'B' | 'C' | 'D') => {
    return {
      A: question.option_a,
      B: question.option_b,
      C: question.option_c,
      D: question.option_d,
    }[option];
  };

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty < 0.33) return 'bg-success-100 text-success-700';
    if (difficulty < 0.67) return 'bg-warning-100 text-warning-700';
    return 'bg-error-100 text-error-700';
  };

  const getDifficultyLabel = (difficulty: number) => {
    if (difficulty < 0.33) return 'Easy';
    if (difficulty < 0.67) return 'Medium';
    return 'Hard';
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="pt-6">
        {/* Question Content */}
        <div className="mb-4">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex-1">
              <p className="text-gray-900 font-medium leading-relaxed">
                {question.content}
              </p>
            </div>
            <span className={cn(
              "px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap",
              getDifficultyColor(question.difficulty)
            )}>
              {getDifficultyLabel(question.difficulty)}
            </span>
          </div>

          {/* Question Image */}
          {question.question_image_url && (
            <div className="mt-3">
              <img
                src={question.question_image_url}
                alt="Question"
                className="max-w-xs rounded-lg border border-gray-200"
              />
            </div>
          )}
        </div>

        {/* Options */}
        <div className="space-y-2 mb-4">
          {(['A', 'B', 'C', 'D'] as const).map((option) => (
            <div
              key={option}
              className={cn(
                "p-3 rounded-lg border-2 transition-colors",
                question.correct_answer === option
                  ? "border-success-500 bg-success-50"
                  : "border-gray-200 bg-gray-50"
              )}
            >
              <div className="flex items-start gap-3">
                <div className={cn(
                  "flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm font-semibold",
                  question.correct_answer === option
                    ? "bg-success-500 text-white"
                    : "bg-gray-300 text-gray-700"
                )}>
                  {option}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-700">{getOptionLabel(option)}</p>
                  {question[`option_${option.toLowerCase()}_image_url` as keyof Question] && (
                    <img
                      src={question[`option_${option.toLowerCase()}_image_url` as keyof Question] as string}
                      alt={`Option ${option}`}
                      className="mt-2 max-w-[200px] rounded border border-gray-200"
                    />
                  )}
                </div>
                {question.correct_answer === option && (
                  <CheckCircle className="w-5 h-5 text-success-600 flex-shrink-0" />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* 3PL Parameters */}
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-xs font-semibold text-blue-900 mb-2">3PL Parameters</p>
          <div className="grid grid-cols-3 gap-3 text-xs">
            <div>
              <span className="text-blue-700">Difficulty:</span>
              <span className="ml-1 font-semibold text-blue-900">{question.difficulty.toFixed(2)}</span>
            </div>
            <div>
              <span className="text-blue-700">Discrimination:</span>
              <span className="ml-1 font-semibold text-blue-900">{question.discrimination.toFixed(2)}</span>
            </div>
            <div>
              <span className="text-blue-700">Guessing:</span>
              <span className="ml-1 font-semibold text-blue-900">{question.guessing.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Explanation */}
        {question.explanation && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-xs font-semibold text-gray-700 mb-1">Explanation:</p>
            <p className="text-sm text-gray-600">{question.explanation}</p>
          </div>
        )}

        {/* Tags */}
        {question.tags && question.tags.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {question.tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-primary-100 text-primary-700 rounded text-xs font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-4 border-t border-gray-200">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onView?.(question.id)}
            className="flex-1"
          >
            <Eye className="w-4 h-4 mr-2" />
            View
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit?.(question.id)}
            className="flex-1"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete?.(question.id)}
            className="text-error-600 hover:bg-error-50"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}