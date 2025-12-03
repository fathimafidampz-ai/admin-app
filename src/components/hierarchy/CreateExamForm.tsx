'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { hierarchyApi } from '@/lib/api';
import { EXAM_TYPES } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface CreateExamFormProps {
  onSuccess?: () => void;
}

export function CreateExamForm({ onSuccess }: CreateExamFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    exam_type: 'competitive',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: hierarchyApi.createExam,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exams'] });
      setFormData({ name: '', description: '', exam_type: 'competitive' });
      setErrors({});
      onSuccess?.();
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || 'Failed to create exam';
      setErrors({ submit: message });
    },
  });

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Exam name is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    createMutation.mutate(formData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Exam</CardTitle>
        <CardDescription>Add a new exam to your hierarchy</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Exam Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Exam Type <span className="text-error-500 dark:text-error-400">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              {EXAM_TYPES.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, exam_type: type.value })}
                  className={cn(
                    "p-4 rounded-lg border-2 transition-all text-left",
                    formData.exam_type === type.value
                      ? "border-primary-500 dark:border-primary-400 bg-primary-50 dark:bg-primary-900/30"
                      : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800"
                  )}
                >
                  <div className={cn(
                    "font-semibold",
                    formData.exam_type === type.value
                      ? "text-primary-900 dark:text-primary-100"
                      : "text-gray-900 dark:text-gray-100"
                  )}>
                    {type.label}
                  </div>
                  <div className={cn(
                    "text-sm mt-1",
                    formData.exam_type === type.value
                      ? "text-primary-700 dark:text-primary-300"
                      : "text-gray-600 dark:text-gray-400"
                  )}>
                    {type.description}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Name */}
          <Input
            label="Exam Name"
            placeholder="e.g., JEE Main, NEET, CAT"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={errors.name}
            required
          />

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Description <span className="text-error-500 dark:text-error-400">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of the exam..."
              rows={3}
              className={cn(
                "w-full px-4 py-2.5 rounded-lg border transition-colors duration-200",
                "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100",
                "placeholder-gray-400 dark:placeholder-gray-500",
                errors.description 
                  ? "border-error-500 dark:border-error-400 focus:border-error-500 dark:focus:border-error-400 focus:ring-2 focus:ring-error-200 dark:focus:ring-error-800" 
                  : "border-gray-300 dark:border-gray-600 focus:border-primary-500 dark:focus:border-primary-400 focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-800"
              )}
            />
            {errors.description && (
              <p className="mt-1.5 text-sm text-error-600 dark:text-error-400 flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.description}
              </p>
            )}
          </div>

          {/* Error Message */}
          {errors.submit && (
            <div className="p-3 rounded-lg bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-700">
              <p className="text-sm text-error-700 dark:text-error-300">{errors.submit}</p>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex gap-3">
            <Button
              type="submit"
              variant="primary"
              isLoading={createMutation.isPending}
              className="flex-1"
            >
              {createMutation.isPending ? 'Creating...' : 'Create Exam'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setFormData({ name: '', description: '', exam_type: 'competitive' });
                setErrors({});
              }}
            >
              Clear
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}