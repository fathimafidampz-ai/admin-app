'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ImageUpload } from './ImageUpload';
import { HierarchyPath } from './HierarchyPath';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { questionsApi } from '@/lib/api';
import { QuestionFormData } from '@/types';
import { cn } from '@/lib/utils';
import { Info } from 'lucide-react';

export function SingleQuestionForm() {
  const [formData, setFormData] = useState<QuestionFormData>({
    concept_id: '',
    content: '',
    option_a: '',
    option_b: '',
    option_c: '',
    option_d: '',
    correct_answer: 'A',
    difficulty: 0.5,
    discrimination: 1.5,
    guessing: 0.25,
    explanation: '',
    tags: '',
  });

  const [images, setImages] = useState<{
    question?: File;
    option_a?: File;
    option_b?: File;
    option_c?: File;
    option_d?: File;
  }>({});

  const [hierarchyPath, setHierarchyPath] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: FormData) => questionsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
      // Reset form
      setFormData({
        concept_id: '',
        content: '',
        option_a: '',
        option_b: '',
        option_c: '',
        option_d: '',
        correct_answer: 'A',
        difficulty: 0.5,
        discrimination: 1.5,
        guessing: 0.25,
        explanation: '',
        tags: '',
      });
      setImages({});
      setHierarchyPath('');
      setErrors({});
      alert('Question created successfully!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || 'Failed to create question';
      setErrors({ submit: message });
    },
  });

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.concept_id) {
      newErrors.concept_id = 'Please select a concept from the hierarchy';
    }

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

    // Create FormData
    const data = new FormData();
    data.append('concept_id', formData.concept_id);
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

    // Append images if present
    if (images.question) data.append('question_image', images.question);
    if (images.option_a) data.append('option_a_image', images.option_a);
    if (images.option_b) data.append('option_b_image', images.option_b);
    if (images.option_c) data.append('option_c_image', images.option_c);
    if (images.option_d) data.append('option_d_image', images.option_d);

    createMutation.mutate(data);
  };

  const handleConceptSelect = (conceptId: string, path: string) => {
    setFormData({ ...formData, concept_id: conceptId });
    setHierarchyPath(path);
    if (errors.concept_id) {
      setErrors({ ...errors, concept_id: '' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Hierarchy Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Concept</CardTitle>
          <CardDescription>Choose where this question belongs in your content hierarchy</CardDescription>
        </CardHeader>
        <CardContent>
          <HierarchyPath 
            onConceptSelect={handleConceptSelect}
            selectedConceptId={formData.concept_id}
          />
          {errors.concept_id && (
            <p className="mt-2 text-sm text-error-600">{errors.concept_id}</p>
          )}
        </CardContent>
      </Card>

      {/* Question Content */}
      <Card>
        <CardHeader>
          <CardTitle>Question Details</CardTitle>
          <CardDescription>Enter the question text and optional image</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Question Text */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Question Content <span className="text-error-500">*</span>
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Enter the question text..."
              rows={4}
              className={cn(
                "w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-colors",
                errors.content && "border-error-500"
              )}
            />
            {errors.content && (
              <p className="mt-1.5 text-sm text-error-600">{errors.content}</p>
            )}
          </div>

          {/* Question Image */}
          <ImageUpload
            label="Question Image (Optional)"
            onImageSelect={(file) => setImages({ ...images, question: file || undefined })}
            helperText="Upload an image if the question contains diagrams, graphs, or visual elements"
          />
        </CardContent>
      </Card>

      {/* Options */}
      <Card>
        <CardHeader>
          <CardTitle>Answer Options</CardTitle>
          <CardDescription>Provide four options and mark the correct answer</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Option A */}
          <div className="p-4 border-2 border-gray-200 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <input
                type="radio"
                name="correct_answer"
                value="A"
                checked={formData.correct_answer === 'A'}
                onChange={(e) => setFormData({ ...formData, correct_answer: e.target.value as any })}
                className="w-4 h-4 text-primary-600 focus:ring-primary-500"
              />
              <label className="text-sm font-semibold text-gray-900">Option A (Correct Answer?)</label>
            </div>
            <Input
              placeholder="Enter option A text..."
              value={formData.option_a}
              onChange={(e) => setFormData({ ...formData, option_a: e.target.value })}
              error={errors.option_a}
            />
            <div className="mt-3">
              <ImageUpload
                label="Option A Image (Optional)"
                onImageSelect={(file) => setImages({ ...images, option_a: file || undefined })}
              />
            </div>
          </div>

          {/* Option B */}
          <div className="p-4 border-2 border-gray-200 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <input
                type="radio"
                name="correct_answer"
                value="B"
                checked={formData.correct_answer === 'B'}
                onChange={(e) => setFormData({ ...formData, correct_answer: e.target.value as any })}
                className="w-4 h-4 text-primary-600 focus:ring-primary-500"
              />
              <label className="text-sm font-semibold text-gray-900">Option B (Correct Answer?)</label>
            </div>
            <Input
              placeholder="Enter option B text..."
              value={formData.option_b}
              onChange={(e) => setFormData({ ...formData, option_b: e.target.value })}
              error={errors.option_b}
            />
            <div className="mt-3">
              <ImageUpload
                label="Option B Image (Optional)"
                onImageSelect={(file) => setImages({ ...images, option_b: file || undefined })}
              />
            </div>
          </div>

          {/* Option C */}
          <div className="p-4 border-2 border-gray-200 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <input
                type="radio"
                name="correct_answer"
                value="C"
                checked={formData.correct_answer === 'C'}
                onChange={(e) => setFormData({ ...formData, correct_answer: e.target.value as any })}
                className="w-4 h-4 text-primary-600 focus:ring-primary-500"
              />
              <label className="text-sm font-semibold text-gray-900">Option C (Correct Answer?)</label>
            </div>
            <Input
              placeholder="Enter option C text..."
              value={formData.option_c}
              onChange={(e) => setFormData({ ...formData, option_c: e.target.value })}
              error={errors.option_c}
            />
            <div className="mt-3">
              <ImageUpload
                label="Option C Image (Optional)"
                onImageSelect={(file) => setImages({ ...images, option_c: file || undefined })}
              />
            </div>
          </div>

          {/* Option D */}
          <div className="p-4 border-2 border-gray-200 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <input
                type="radio"
                name="correct_answer"
                value="D"
                checked={formData.correct_answer === 'D'}
                onChange={(e) => setFormData({ ...formData, correct_answer: e.target.value as any })}
                className="w-4 h-4 text-primary-600 focus:ring-primary-500"
              />
              <label className="text-sm font-semibold text-gray-900">Option D (Correct Answer?)</label>
            </div>
            <Input
              placeholder="Enter option D text..."
              value={formData.option_d}
              onChange={(e) => setFormData({ ...formData, option_d: e.target.value })}
              error={errors.option_d}
            />
            <div className="mt-3">
              <ImageUpload
                label="Option D Image (Optional)"
                onImageSelect={(file) => setImages({ ...images, option_d: file || undefined })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3PL Parameters */}
      <Card>
        <CardHeader>
          <div className="flex items-start gap-3">
            <div>
              <CardTitle>3PL Parameters</CardTitle>
              <CardDescription>Item Response Theory parameters for adaptive testing</CardDescription>
            </div>
            <div className="ml-auto">
              <Info className="w-5 h-5 text-gray-400" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Difficulty */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty (0-1) <span className="text-error-500">*</span>
              </label>
              <Input
                type="number"
                step="0.01"
                min="0"
                max="1"
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: parseFloat(e.target.value) })}
                error={errors.difficulty}
                helperText="0 = Very Easy, 1 = Very Hard"
              />
            </div>

            {/* Discrimination */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Discrimination (0-3) <span className="text-error-500">*</span>
              </label>
              <Input
                type="number"
                step="0.1"
                min="0"
                max="3"
                value={formData.discrimination}
                onChange={(e) => setFormData({ ...formData, discrimination: parseFloat(e.target.value) })}
                error={errors.discrimination}
                helperText="How well question differentiates ability"
              />
            </div>

            {/* Guessing */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Guessing (0-0.5) <span className="text-error-500">*</span>
              </label>
              <Input
                type="number"
                step="0.01"
                min="0"
                max="0.5"
                value={formData.guessing}
                onChange={(e) => setFormData({ ...formData, guessing: parseFloat(e.target.value) })}
                error={errors.guessing}
                helperText="Probability of random correct answer"
              />
            </div>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Tip:</strong> For multiple choice with 4 options, guessing parameter is typically 0.25 (25% chance)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Additional Information */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Information</CardTitle>
          <CardDescription>Optional explanation and tags</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Explanation */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Explanation (Optional)
            </label>
            <textarea
              value={formData.explanation}
              onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
              placeholder="Provide a detailed explanation of the correct answer..."
              rows={4}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-colors"
            />
          </div>

          {/* Tags */}
          <Input
            label="Tags (Optional)"
            placeholder="e.g., algebra, equations, intermediate"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            helperText="Comma-separated tags for easy searching"
          />
        </CardContent>
      </Card>

      {/* Error Message */}
      {errors.submit && (
        <div className="p-4 bg-error-50 border border-error-200 rounded-lg">
          <p className="text-sm text-error-700">{errors.submit}</p>
        </div>
      )}

      {/* Submit Button */}
      <div className="flex gap-4">
        <Button
          type="submit"
          variant="primary"
          isLoading={createMutation.isPending}
          className="flex-1"
        >
          {createMutation.isPending ? 'Creating Question...' : 'Create Question'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setFormData({
              concept_id: '',
              content: '',
              option_a: '',
              option_b: '',
              option_c: '',
              option_d: '',
              correct_answer: 'A',
              difficulty: 0.5,
              discrimination: 1.5,
              guessing: 0.25,
              explanation: '',
              tags: '',
            });
            setImages({});
            setHierarchyPath('');
            setErrors({});
          }}
        >
          Clear Form
        </Button>
      </div>
    </form>
  );
}