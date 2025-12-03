'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { hierarchyApi } from '@/lib/api';
import { cn } from '@/lib/utils';

interface CreateClassFormProps {
  examId: string;
  examName: string;
  onSuccess?: () => void;
}

export function CreateClassForm({ examId, examName, onSuccess }: CreateClassFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    class_number: '',
    section: '',
    description: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: { exam_id: string; name: string; class_number: number; section?: string; description: string }) =>
      hierarchyApi.createClass(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes', examId] });
      setFormData({ name: '', class_number: '', section: '', description: '' });
      setErrors({});
      onSuccess?.();
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || 'Failed to create class';
      setErrors({ submit: message });
    },
  });

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Class name is required';
    }
    
    if (!formData.class_number.trim()) {
      newErrors.class_number = 'Class number is required';
    } else if (isNaN(Number(formData.class_number)) || Number(formData.class_number) < 1 || Number(formData.class_number) > 12) {
      newErrors.class_number = 'Class number must be between 1 and 12';
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
    
    createMutation.mutate({
      exam_id: examId,
      name: formData.name,
      class_number: Number(formData.class_number),
      section: formData.section || undefined,
      description: formData.description,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Class</CardTitle>
        <CardDescription>
          Add a class under <span className="font-semibold text-gray-900">{examName}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Class Number */}
          <Input
            label="Class Number"
            type="number"
            placeholder="e.g., 10"
            min="1"
            max="12"
            value={formData.class_number}
            onChange={(e) => setFormData({ ...formData, class_number: e.target.value })}
            error={errors.class_number}
            required
            helperText="Enter class number (1-12)"
          />

          {/* Section (Optional) */}
          <Input
            label="Section"
            placeholder="e.g., A, B, C (optional)"
            value={formData.section}
            onChange={(e) => setFormData({ ...formData, section: e.target.value })}
            helperText="Optional: Specify section if applicable"
          />

          {/* Name */}
          <Input
            label="Class Name"
            placeholder="e.g., Class 10-A"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={errors.name}
            required
            helperText="Display name for this class"
          />

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Description <span className="text-error-500">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of the class..."
              rows={3}
              className={cn(
                "w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-colors duration-200",
                errors.description && "border-error-500 focus:border-error-500 focus:ring-error-200"
              )}
            />
            {errors.description && (
              <p className="mt-1.5 text-sm text-error-600">{errors.description}</p>
            )}
          </div>

          {/* Error Message */}
          {errors.submit && (
            <div className="p-3 rounded-lg bg-error-50 border border-error-200">
              <p className="text-sm text-error-700">{errors.submit}</p>
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
              {createMutation.isPending ? 'Creating...' : 'Create Class'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setFormData({ name: '', class_number: '', section: '', description: '' });
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