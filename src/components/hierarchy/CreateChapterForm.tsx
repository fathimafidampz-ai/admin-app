'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { hierarchyApi } from '@/lib/api';
import { cn } from '@/lib/utils';

interface CreateChapterFormProps {
  subjectId: string;
  subjectName: string;
  onSuccess?: () => void;
}

export function CreateChapterForm({ subjectId, subjectName, onSuccess }: CreateChapterFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: { subject_id: string; name: string; description: string }) =>
      hierarchyApi.createChapter(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chapters', subjectId] });
      setFormData({ name: '', description: '' });
      setErrors({});
      onSuccess?.();
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || 'Failed to create chapter';
      setErrors({ submit: message });
    },
  });

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Chapter name is required';
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
      subject_id: subjectId,
      ...formData,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Chapter</CardTitle>
        <CardDescription>
          Add a chapter under <span className=" focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-colors duration-200">{subjectName}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Chapter Name"
            placeholder="e.g., Algebra, Thermodynamics"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={errors.name}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Description <span className="text-error-500">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of the chapter..."
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

          {errors.submit && (
            <div className="p-3 rounded-lg bg-error-50 border border-error-200">
              <p className="text-sm text-error-700">{errors.submit}</p>
            </div>
          )}

          <div className="flex gap-3">
            <Button
              type="submit"
              variant="primary"
              isLoading={createMutation.isPending}
              className="flex-1"
            >
              {createMutation.isPending ? 'Creating...' : 'Create Chapter'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setFormData({ name: '', description: '' });
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