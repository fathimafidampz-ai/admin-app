'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ImageUpload } from './ImageUpload';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { questionsApi } from '@/lib/api';
import { Question } from '@/types';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

interface EditQuestionModalProps {
  question: Question;
  onClose: () => void;
}

export function EditQuestionModal({ question, onClose }: EditQuestionModalProps) {
  const [formData, setFormData] = useState({
    content: question.content,
    option_a: question.option_a,
    option_b: question.option_b,
    option_c: question.option_c,
    option_d: question.option_d,
    correct_answer: question.correct_answer,
    difficulty: question.difficulty,
    discrimination: question.discrimination,
    guessing: question.guessing,
    explanation: question.explanation || '',
    tags: question.tags?.join(', ') || '',
  });

  const [images, setImages] = useState<{
    question?: File;
    option_a?: File;
    option_b?: File;
    option_c?: File;
    option_d?: File;
  }>({});

  const [errors, setErrors] = useState<Record<string, string>>({});

  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: (data: FormData) => questionsApi.update(question.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
      alert('Question updated successfully!');
      onClose();
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || 'Failed to update question';
      setErrors({ submit: message });
    },
  });

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.content.trim()) {
      newErrors.content = 'Question content is required';
    }

    if (!formData.option_a.trim()) newErrors.option_a = 'Option A is required';
    if (!formData.option_b.trim()) newErrors.option_b = 'Option B is required';
    if (!formData.option_c.trim()) newErrors.option_c = 'Option C is required';
    if (!formData.option_d.trim()) newErrors.option_d = 'Option D is required';

    if (formData.difficulty < 0 || formData.difficulty > 1) {
      newErrors.difficulty = 'Difficulty must be between 0 and 1';
    }

    if (formData.discrimination < 0 || formData.discrimination > 3) {
      newErrors.discrimination = 'Discrimination must be between 0 and 3';
    }

    if (formData.guessing < 0 || formData.guessing > 0.5) {
      newErrors.guessing = 'Guessing must be between 0 and 0.5';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    const data = new FormData();
    data.append('content', formData.content);
    data.append('option_a', formData.option_a);
    data.append('option_b', formData.option_b);
    data.append('option_c', formData.option_c);
    data.append('option_d', formData.option_d);
    data.append('correct_answer', formData.correct_answer);
    data.append('difficulty', formData.difficulty.toString());
    data.append('discrimination', formData.discrimination.toString());
    data.append('guessing', formData.guessing.toString());
    
    if (formData.explanation) {
      data.append('explanation', formData.explanation);
    }
    
    if (formData.tags) {
      data.append('tags', formData.tags);
    }

    if (images.question) data.append('question_image', images.question);
    if (images.option_a) data.append('option_a_image', images.option_a);
    if (images.option_b) data.append('option_b_image', images.option_b);
    if (images.option_c) data.append('option_c_image', images.option_c);
    if (images.option_d) data.append('option_d_image', images.option_d);

    updateMutation.mutate(data);
  };

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-4xl w-full my-8">
        <Card className="border-0 shadow-2xl">
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <CardTitle>Edit Question</CardTitle>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </CardHeader>
          <CardContent className="pt-6 max-h-[70vh] overflow-y-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Question Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Question Content <span className="text-error-500">*</span>
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={3}
                  className={cn(
                    "w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200",
                    errors.content && "border-error-500"
                  )}
                />
                {errors.content && (
                  <p className="mt-1 text-sm text-error-600">{errors.content}</p>
                )}
              </div>

              {/* Question Image */}
              <ImageUpload
                label="Question Image"
                onImageSelect={(file) => setImages({ ...images, question: file || undefined })}
                currentImage={question.question_image_url}
              />

              {/* Options */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Answer Options</h3>
                
                {(['A', 'B', 'C', 'D'] as const).map((option) => (
                  <div key={option} className="p-4 border-2 border-gray-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <input
                        type="radio"
                        name="correct_answer"
                        value={option}
                        checked={formData.correct_answer === option}
                        onChange={(e) => setFormData({ ...formData, correct_answer: e.target.value as any })}
                        className="w-4 h-4 text-primary-600"
                      />
                      <label className="font-semibold">Option {option}</label>
                    </div>
                    <Input
                      value={formData[`option_${option.toLowerCase()}` as keyof typeof formData] as string}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        [`option_${option.toLowerCase()}`]: e.target.value 
                      })}
                      error={errors[`option_${option.toLowerCase()}`]}
                    />
                    <div className="mt-3">
                      <ImageUpload
                        label={`Option ${option} Image`}
                        onImageSelect={(file) => setImages({ 
                          ...images, 
                          [`option_${option.toLowerCase()}`]: file || undefined 
                        })}
                        currentImage={question[`option_${option.toLowerCase()}_image_url` as keyof Question] as string}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* 3PL Parameters */}
              <div className="grid grid-cols-3 gap-4">
                <Input
                  label="Difficulty (0-1)"
                  type="number"
                  step="0.01"
                  min="0"
                  max="1"
                  value={formData.difficulty}
                  onChange={(e) => setFormData({ ...formData, difficulty: parseFloat(e.target.value) })}
                  error={errors.difficulty}
                />
                <Input
                  label="Discrimination (0-3)"
                  type="number"
                  step="0.1"
                  min="0"
                  max="3"
                  value={formData.discrimination}
                  onChange={(e) => setFormData({ ...formData, discrimination: parseFloat(e.target.value) })}
                  error={errors.discrimination}
                />
                <Input
                  label="Guessing (0-0.5)"
                  type="number"
                  step="0.01"
                  min="0"
                  max="0.5"
                  value={formData.guessing}
                  onChange={(e) => setFormData({ ...formData, guessing: parseFloat(e.target.value) })}
                  error={errors.guessing}
                />
              </div>

              {/* Explanation */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Explanation
                </label>
                <textarea
                  value={formData.explanation}
                  onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                />
              </div>

              {/* Tags */}
              <Input
                label="Tags (comma-separated)"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              />

              {/* Error */}
              {errors.submit && (
                <div className="p-3 bg-error-50 border border-error-200 rounded-lg">
                  <p className="text-sm text-error-700">{errors.submit}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={updateMutation.isPending}
                  className="flex-1"
                >
                  {updateMutation.isPending ? 'Updating...' : 'Update Question'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}