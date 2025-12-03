'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { hierarchyApi, questionsApi } from '@/lib/api';
import { ColumnMapping, PYQQuestion } from '@/types';
import { CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';

interface BulkPreviewProps {
  data: any[];
  mapping: ColumnMapping;
  onBack: () => void;
  onComplete: (result: any) => void;
}

export function BulkPreview({ data, mapping, onBack, onComplete }: BulkPreviewProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const queryClient = useQueryClient();

  // Process and validate data
  const processedData = useMemo(() => {
    return data.map((row, index) => {
      const question: any = {
        rowNumber: index + 1,
        exam_name: row[mapping.exam_name],
        subject_name: row[mapping.subject_name],
        chapter_name: row[mapping.chapter_name],
        topic_name: row[mapping.topic_name],
        concept_name: row[mapping.concept_name],
        year: row[mapping.year] ? parseInt(row[mapping.year]) : undefined,
        content: row[mapping.question_content],
        option_a: row[mapping.option_a],
        option_b: row[mapping.option_b],
        option_c: row[mapping.option_c],
        option_d: row[mapping.option_d],
        correct_answer: row[mapping.correct_answer]?.toUpperCase(),
        difficulty: parseFloat(row[mapping.difficulty]),
        discrimination: parseFloat(row[mapping.discrimination]),
        guessing: parseFloat(row[mapping.guessing]),
        explanation: row[mapping.explanation],
        tags: row[mapping.tags]?.split(',').map((t: string) => t.trim()) || [],
      };

      // Validation
      const errors: string[] = [];
      
      if (!question.content) errors.push('Missing question content');
      if (!question.option_a) errors.push('Missing option A');
      if (!question.option_b) errors.push('Missing option B');
      if (!question.option_c) errors.push('Missing option C');
      if (!question.option_d) errors.push('Missing option D');
      if (!['A', 'B', 'C', 'D'].includes(question.correct_answer)) {
        errors.push('Invalid correct answer (must be A, B, C, or D)');
      }
      if (isNaN(question.difficulty) || question.difficulty < 0 || question.difficulty > 1) {
        errors.push('Invalid difficulty (must be 0-1)');
      }
      if (isNaN(question.discrimination) || question.discrimination < 0 || question.discrimination > 3) {
        errors.push('Invalid discrimination (must be 0-3)');
      }
      if (isNaN(question.guessing) || question.guessing < 0 || question.guessing > 0.5) {
        errors.push('Invalid guessing (must be 0-0.5)');
      }

      question.isValid = errors.length === 0;
      question.errors = errors;

      return question;
    });
  }, [data, mapping]);

  const stats = useMemo(() => {
    const valid = processedData.filter(q => q.isValid).length;
    const invalid = processedData.filter(q => !q.isValid).length;
    return { valid, invalid, total: processedData.length };
  }, [processedData]);

  const handleImport = async () => {
    setIsProcessing(true);
    setProgress(0);

    const validQuestions = processedData.filter(q => q.isValid);
    const questionsToCreate: any[] = [];

    try {
      // For each valid question, find or create the hierarchy
      for (let i = 0; i < validQuestions.length; i++) {
        const q = validQuestions[i];
        setProgress(((i + 1) / validQuestions.length) * 100);

        // In a real implementation, you would:
        // 1. Find or create Exam
        // 2. Find or create Subject
        // 3. Find or create Chapter
        // 4. Find or create Topic
        // 5. Find or create Concept
        // 6. Then create the question linked to that concept

        // For now with mock data, we'll create a dummy concept_id
        questionsToCreate.push({
          concept_id: 'mock-concept-id', // In real app, this would be the found/created concept ID
          content: q.content,
          option_a: q.option_a,
          option_b: q.option_b,
          option_c: q.option_c,
          option_d: q.option_d,
          correct_answer: q.correct_answer,
          difficulty: q.difficulty,
          discrimination: q.discrimination,
          guessing: q.guessing,
          explanation: q.explanation,
          tags: q.tags,
        });
      }

      // Bulk create questions
      const result = await questionsApi.bulkCreate(questionsToCreate);
      
      queryClient.invalidateQueries({ queryKey: ['questions'] });
      
      onComplete(result);
    } catch (error) {
      alert('Error importing questions');
      setIsProcessing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Preview & Import</CardTitle>
        <CardDescription>
          Review questions before importing
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Statistics */}
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg text-center">
            <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{stats.total}</p>
            <p className="text-sm text-blue-700 dark:text-blue-300">Total Questions</p>
          </div>
          <div className="p-4 bg-success-50 dark:bg-success-900/20 border border-success-200 dark:border-success-700 rounded-lg text-center">
            <p className="text-2xl font-bold text-success-900 dark:text-success-100">{stats.valid}</p>
            <p className="text-sm text-success-700 dark:text-success-300">Valid</p>
          </div>
          <div className="p-4 bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-700 rounded-lg text-center">
            <p className="text-2xl font-bold text-error-900 dark:text-error-100">{stats.invalid}</p>
            <p className="text-sm text-error-700 dark:text-error-300">Invalid</p>
          </div>
        </div>

        {/* Preview List */}
        <div className="max-h-96 overflow-y-auto space-y-3">
          {processedData.slice(0, 10).map((question, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border-2 ${
                question.isValid
                  ? 'border-success-200 dark:border-success-700 bg-success-50 dark:bg-success-900/20'
                  : 'border-error-200 dark:border-error-700 bg-error-50 dark:bg-error-900/20'
              }`}
            >
              <div className="flex items-start gap-3">
                {question.isValid ? (
                  <CheckCircle className="w-5 h-5 text-success-600 dark:text-success-400 flex-shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 text-error-600 dark:text-error-400 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                    Row {question.rowNumber}: {question.content?.substring(0, 80)}...
                  </p>
                  {!question.isValid && (
                    <ul className="text-sm text-error-700 dark:text-error-300 space-y-1">
                      {question.errors.map((error: string, i: number) => (
                        <li key={i}>• {error}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {processedData.length > 10 && (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-2">
              ... and {processedData.length - 10} more questions
            </p>
          )}
        </div>

        {/* Warning for Invalid Questions */}
        {stats.invalid > 0 && (
          <div className="p-4 bg-warning-50 dark:bg-warning-900/20 border border-warning-200 dark:border-warning-700 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-warning-600 dark:text-warning-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-warning-900 dark:text-warning-100">
                {stats.invalid} question(s) have errors and will be skipped
              </p>
              <p className="text-sm text-warning-700 dark:text-warning-300 mt-1">
                Only valid questions will be imported
              </p>
            </div>
          </div>
        )}

        {/* Progress Bar */}
        {isProcessing && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>Importing questions...</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-primary-600 dark:bg-primary-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onBack}
            disabled={isProcessing}
            className="flex-1"
          >
            Back
          </Button>
          <Button
            variant="primary"
            onClick={handleImport}
            disabled={stats.valid === 0 || isProcessing}
            isLoading={isProcessing}
            className="flex-1"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Importing...
              </>
            ) : (
              `Import ${stats.valid} Question${stats.valid !== 1 ? 's' : ''}`
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}