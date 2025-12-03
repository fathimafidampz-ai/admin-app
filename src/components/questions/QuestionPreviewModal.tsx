'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  X, 
  Printer, 
  Copy, 
  Download, 
  ChevronLeft, 
  ChevronRight,
  CheckCircle,
  Maximize2
} from 'lucide-react';
import { Question } from '@/types';
import { cn } from '@/lib/utils';

interface QuestionPreviewModalProps {
  question: Question;
  allQuestions?: Question[];
  onClose: () => void;
  onDuplicate?: (id: string) => void;
  onNavigate?: (id: string) => void;
}

export function QuestionPreviewModal({ 
  question, 
  allQuestions = [],
  onClose,
  onDuplicate,
  onNavigate 
}: QuestionPreviewModalProps) {
  const [imageZoom, setImageZoom] = useState<string | null>(null);

  const currentIndex = allQuestions.findIndex(q => q.id === question.id);
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < allQuestions.length - 1;

  const handlePrint = () => {
    window.print();
  };

  const handleCopy = () => {
    const text = `
Question: ${question.content}

A) ${question.option_a}
B) ${question.option_b}
C) ${question.option_c}
D) ${question.option_d}

Correct Answer: ${question.correct_answer}
${question.explanation ? `\nExplanation: ${question.explanation}` : ''}
    `.trim();

    navigator.clipboard.writeText(text);
    alert('Question copied to clipboard!');
  };

  const handleDownload = () => {
    // Simple text download
    const text = `
Question: ${question.content}

A) ${question.option_a}
B) ${question.option_b}
C) ${question.option_c}
D) ${question.option_d}

Correct Answer: ${question.correct_answer}

Difficulty: ${question.difficulty}
Discrimination: ${question.discrimination}
Guessing: ${question.guessing}

${question.explanation ? `Explanation:\n${question.explanation}` : ''}
${question.tags && question.tags.length > 0 ? `\nTags: ${question.tags.join(', ')}` : ''}
    `.trim();

    const blob = new Blob([text], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `question-${question.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handlePrevious = () => {
    if (hasPrevious && onNavigate) {
      onNavigate(allQuestions[currentIndex - 1].id);
    }
  };

  const handleNext = () => {
    if (hasNext && onNavigate) {
      onNavigate(allQuestions[currentIndex + 1].id);
    }
  };

  // Close on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (imageZoom) {
          setImageZoom(null);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose, imageZoom]);

  // Arrow key navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (imageZoom) return;
      
      if (e.key === 'ArrowLeft' && hasPrevious) {
        handlePrevious();
      } else if (e.key === 'ArrowRight' && hasNext) {
        handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [hasPrevious, hasNext, imageZoom]);

  const getDifficultyLabel = (difficulty: number) => {
    if (difficulty < 0.33) return { label: 'Easy', color: 'bg-success-100 text-success-700' };
    if (difficulty < 0.67) return { label: 'Medium', color: 'bg-warning-100 text-warning-700' };
    return { label: 'Hard', color: 'bg-error-100 text-error-700' };
  };

  const difficultyInfo = getDifficultyLabel(question.difficulty);

  return (
    <>
      {/* Main Modal */}
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
        <div className="bg-white rounded-lg max-w-5xl w-full my-8">
          <Card className="border-0 shadow-2xl">
            {/* Header */}
            <div className="border-b p-4 flex items-center justify-between bg-gray-50 print:hidden">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-bold text-gray-900">Question Preview</h2>
                <span className={cn(
                  "px-3 py-1 rounded-full text-sm font-semibold",
                  difficultyInfo.color
                )}>
                  {difficultyInfo.label}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Navigation */}
                {allQuestions.length > 1 && (
                  <div className="flex items-center gap-1 mr-2 px-2 py-1 bg-gray-100 rounded-lg">
                    <button
                      onClick={handlePrevious}
                      disabled={!hasPrevious}
                      className="p-1 hover:bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="text-sm text-gray-600 px-2">
                      {currentIndex + 1} / {allQuestions.length}
                    </span>
                    <button
                      onClick={handleNext}
                      disabled={!hasNext}
                      className="p-1 hover:bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}

                {/* Actions */}
                <Button variant="outline" size="sm" onClick={handlePrint}>
                  <Printer className="w-4 h-4 mr-2" />
                  Print
                </Button>
                <Button variant="outline" size="sm" onClick={handleCopy}>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
                <Button variant="outline" size="sm" onClick={handleDownload}>
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                {onDuplicate && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => onDuplicate(question.id)}
                  >
                    Duplicate
                  </Button>
                )}
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            <CardContent className="pt-6 max-h-[75vh] overflow-y-auto">
              {/* Question Content */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Question:</h3>
                <p className="text-gray-800 leading-relaxed text-lg">
                  {question.content}
                </p>

                {/* Question Image */}
                {question.question_image_url && (
                  <div className="mt-4">
                    <div className="relative group inline-block">
                      <img
                        src={question.question_image_url}
                        alt="Question"
                        className="max-w-2xl rounded-lg border-2 border-gray-200 cursor-zoom-in"
                        onClick={() => setImageZoom(question.question_image_url!)}
                      />
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="p-2 bg-black bg-opacity-50 rounded-lg">
                          <Maximize2 className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Options */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Options:</h3>
                <div className="space-y-3">
                  {(['A', 'B', 'C', 'D'] as const).map((option) => {
                    const isCorrect = question.correct_answer === option;
                    const optionText = question[`option_${option.toLowerCase()}` as keyof Question] as string;
                    const optionImage = question[`option_${option.toLowerCase()}_image_url` as keyof Question] as string;

                    return (
                      <div
                        key={option}
                        className={cn(
                          "p-4 rounded-lg border-2 transition-all",
                          isCorrect
                            ? "border-success-500 bg-success-50"
                            : "border-gray-200 bg-gray-50"
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div className={cn(
                            "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
                            isCorrect
                              ? "bg-success-500 text-white"
                              : "bg-gray-300 text-gray-700"
                          )}>
                            {option}
                          </div>
                          <div className="flex-1">
                            <p className="text-gray-800 text-lg">{optionText}</p>
                            {optionImage && (
                              <div className="mt-2 relative group inline-block">
                                <img
                                  src={optionImage}
                                  alt={`Option ${option}`}
                                  className="max-w-md rounded border border-gray-200 cursor-zoom-in"
                                  onClick={() => setImageZoom(optionImage)}
                                />
                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <div className="p-1.5 bg-black bg-opacity-50 rounded">
                                    <Maximize2 className="w-4 h-4 text-white" />
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                          {isCorrect && (
                            <CheckCircle className="w-6 h-6 text-success-600 flex-shrink-0" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Correct Answer Highlight */}
              <div className="mb-6 p-4 bg-success-50 border-2 border-success-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-success-600" />
                  <p className="font-semibold text-success-900">
                    Correct Answer: Option {question.correct_answer}
                  </p>
                </div>
              </div>

              {/* 3PL Parameters */}
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-3">3PL Parameters:</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-blue-700">Difficulty</p>
                    <p className="text-xl font-bold text-blue-900">{question.difficulty.toFixed(2)}</p>
                    <p className="text-xs text-blue-600">{difficultyInfo.label}</p>
                  </div>
                  <div>
                    <p className="text-sm text-blue-700">Discrimination</p>
                    <p className="text-xl font-bold text-blue-900">{question.discrimination.toFixed(2)}</p>
                    <p className="text-xs text-blue-600">Ability to differentiate</p>
                  </div>
                  <div>
                    <p className="text-sm text-blue-700">Guessing</p>
                    <p className="text-xl font-bold text-blue-900">{question.guessing.toFixed(2)}</p>
                    <p className="text-xs text-blue-600">Probability of random correct</p>
                  </div>
                </div>
              </div>

              {/* Explanation */}
              {question.explanation && (
                <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Explanation:</h3>
                  <p className="text-gray-700 leading-relaxed">{question.explanation}</p>
                </div>
              )}

              {/* Tags */}
              {question.tags && question.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {question.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Image Zoom Modal */}
      {imageZoom && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-[60] p-4"
          onClick={() => setImageZoom(null)}
        >
          <div className="relative max-w-[90vw] max-h-[90vh]">
            <button
              onClick={() => setImageZoom(null)}
              className="absolute -top-12 right-0 p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
            <img
              src={imageZoom}
              alt="Zoomed"
              className="max-w-full max-h-[90vh] rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </>
  );
}