'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { hierarchyApi } from '@/lib/api';

interface CreateClassFormProps {
  examId: string;
  onSuccess?: () => void;
}

export function CreateClassForm({ examId, onSuccess }: CreateClassFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    class_number: '',
  });

  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: { exam_id: string; name: string; class_number: string }) => 
      hierarchyApi.createClass(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hierarchy'] });
      queryClient.invalidateQueries({ queryKey: ['exams'] });
      setFormData({ name: '', class_number: '' });
      onSuccess?.();
      alert('Class created successfully!');
    },
    onError: (error) => {
      console.error('Error creating class:', error);
      alert('Failed to create class. Please try again.');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.class_number) {
      alert('Please fill in all fields');
      return;
    }

    createMutation.mutate({
      exam_id: examId,
      name: formData.name,
      class_number: formData.class_number,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Class Name *
        </label>
        <Input
          placeholder="e.g., Class 10"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Class Number *
        </label>
        <Input
          type="number"
          placeholder="e.g., 10"
          value={formData.class_number}
          onChange={(e) => setFormData({ ...formData, class_number: e.target.value })}
          required
        />
      </div>

      <div className="flex gap-3">
        <Button
          type="submit"
          variant="primary"
          disabled={createMutation.isPending}
          className="flex-1"
        >
          {createMutation.isPending ? 'Creating...' : 'Create Class'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => setFormData({ name: '', class_number: '' })}
        >
          Reset
        </Button>
      </div>
    </form>
  );
}