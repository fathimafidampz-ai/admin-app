'use client';

import { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Copy, Printer, Download, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
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
  explanation?: string;
  year?: number;
}

interface QuestionPreviewModalProps {
  question: Question;
  allQuestions: Question[];
  onClose: () => void;
  onNavigate: (id: string) => void;
  onDuplicate: (id: string) => void;
}

export function QuestionPreviewModal({
  question,
  allQuestions,
  onClose,
  onNavigate,
  onDuplicate,
}: QuestionPreviewModalProps) {
  const currentIndex = allQuestions.findIndex(q => q.id === question.id);
  const hasNext = currentIndex < allQuestions.length - 1;
  const hasPrevious = currentIndex > 0;

  const getDifficultyLabel = (difficulty: number) => {
    if (difficulty < 0.33) return { label: 'Easy', color: 'bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-300' };
    if (difficulty < 0.67) return { label: 'Medium', color: 'bg-warning-100 dark:bg-warning-900/30 text-warning-700 dark:text-warning-300' };
    return { label: 'Hard', color: 'bg-error-100 dark:bg-error-900/30 text-error-700 dark:text-error-300' };
  };

  const difficultyInfo = getDifficultyLabel(question.difficulty);

  const handlePrevious = () => {
    if (hasPrevious) {
      onNavigate(allQuestions[currentIndex - 1].id);
    }
  };

  const handleNext = () => {
    if (hasNext) {
      onNavigate(allQuestions[currentIndex + 1].id);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopy = () => {
    const text = `Question: ${question.content}\n\nA) ${question.option_a}\nB) ${question.option_b}\nC) ${question.option_c}\nD) ${question.option_d}\n\nCorrect Answer: ${question.correct_answer}`;
    navigator.clipboard.writeText(text);
    alert('Question copied to clipboard!');
  };

  const handleDownload = () => {
    const data = {
      question: question.content,
      options: {
        A: question.option_a,
        B: question.option_b,
        C: question.option_c,
        D: question.option_d,
      },
      correct_answer: question.correct_answer,
      parameters: {
        difficulty: question.difficulty,
        discrimination: question.discrimination,
        guessing: question.guessing,
      },
      tags: question.tags,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `question-${question.id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const getOptionClass = (option: string) => {
    const isCorrect = option === question.correct_answer;
    
    if (isCorrect) {
      return cn(
        'flex items-center gap-3 p-4 rounded-lg border-2 transition-all',
        'bg-success-50 dark:bg-success-900/20',
        'border-success-300 dark:border-success-700'
      );
    }
    
    return cn(
      'flex items-center gap-3 p-4 rounded-lg border transition-all',
      'bg-white dark:bg-gray-800',
      'border-gray-200 dark:border-gray-700'
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <div className="flex items-center gap-3">
            <span className={cn('px-3 py-1 rounded-full text-xs font-medium', difficultyInfo.color)}>
              {difficultyInfo.label}
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {currentIndex + 1} / {allQuestions.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="w-4 h-4 mr-1" />
              Print
            </Button>
            <Button variant="outline" size="sm" onClick={handleCopy}>
              <Copy className="w-4 h-4 mr-1" />
              Copy
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="w-4 h-4 mr-1" />
              Download
            </Button>
            <Button variant="outline" size="sm" onClick={() => onDuplicate(question.id)}>
              Duplicate
            </Button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Question */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">Question:</h3>
            <p className="text-lg font-medium text-gray-900 dark:text-white leading-relaxed">
              {question.content}
            </p>
          </div>

          {/* Options */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">Options:</h3>
            <div className="space-y-3">
              <div className={getOptionClass('A')}>
                <div className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0',
                  question.correct_answer === 'A'
                    ? 'bg-success-500 dark:bg-success-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                )}>
                  A
                </div>
                <span className="text-base text-gray-900 dark:text-gray-100">{question.option_a}</span>
                {question.correct_answer === 'A' && (
                  <CheckCircle2 className="w-5 h-5 text-success-600 dark:text-success-400 ml-auto" />
                )}
              </div>

              <div className={getOptionClass('B')}>
                <div className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0',
                  question.correct_answer === 'B'
                    ? 'bg-success-500 dark:bg-success-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                )}>
                  B
                </div>
                <span className="text-base text-gray-900 dark:text-gray-100">{question.option_b}</span>
                {question.correct_answer === 'B' && (
                  <CheckCircle2 className="w-5 h-5 text-success-600 dark:text-success-400 ml-auto" />
                )}
              </div>

              <div className={getOptionClass('C')}>
                <div className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0',
                  question.correct_answer === 'C'
                    ? 'bg-success-500 dark:bg-success-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                )}>
                  C
                </div>
                <span className="text-base text-gray-900 dark:text-gray-100">{question.option_c}</span>
                {question.correct_answer === 'C' && (
                  <CheckCircle2 className="w-5 h-5 text-success-600 dark:text-success-400 ml-auto" />
                )}
              </div>

              <div className={getOptionClass('D')}>
                <div className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0',
                  question.correct_answer === 'D'
                    ? 'bg-success-500 dark:bg-success-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                )}>
                  D
                </div>
                <span className="text-base text-gray-900 dark:text-gray-100">{question.option_d}</span>
                {question.correct_answer === 'D' && (
                  <CheckCircle2 className="w-5 h-5 text-success-600 dark:text-success-400 ml-auto" />
                )}
              </div>
            </div>
          </div>

          {/* Correct Answer */}
          <div className="p-4 bg-success-50 dark:bg-success-900/20 border-l-4 border-success-500 dark:border-success-600 rounded-r-lg">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-success-600 dark:text-success-400" />
              <span className="font-semibold text-success-900 dark:text-success-200">
                Correct Answer: Option {question.correct_answer}
              </span>
            </div>
          </div>

          {/* 3PL Parameters */}
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">3PL Parameters:</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Difficulty</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{question.difficulty.toFixed(2)}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{difficultyInfo.label}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Discrimination</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{question.discrimination.toFixed(2)}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Ability to differentiate</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Guessing</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{question.guessing.toFixed(2)}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Probability of random correct</p>
              </div>
            </div>
          </div>

          {/* Tags */}
          {question.tags && question.tags.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">Tags:</h3>
              <div className="flex flex-wrap gap-2">
                {question.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-sm rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-700"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Explanation */}
          {question.explanation && (
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 dark:border-blue-600 rounded-r-lg">
              <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-2">Explanation:</h3>
              <p className="text-sm text-blue-800 dark:text-blue-300 leading-relaxed">
                {question.explanation}
              </p>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={!hasPrevious}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </Button>

          <span className="text-sm text-gray-600 dark:text-gray-400">
            Question {currentIndex + 1} of {allQuestions.length}
          </span>

          <Button
            variant="outline"
            onClick={handleNext}
            disabled={!hasNext}
          >
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}