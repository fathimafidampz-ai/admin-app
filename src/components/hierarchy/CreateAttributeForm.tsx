'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { hierarchyApi } from '@/lib/api';
import { cn } from '@/lib/utils';
import { Plus, Trash2 } from 'lucide-react';

interface CreateAttributeFormProps {
  topicId: string;
  topicName: string;
  onSuccess?: () => void;
}

interface Attribute {
  id: number;
  name: string;
  description: string;
}

export function CreateAttributeForm({ topicId, topicName, onSuccess }: CreateAttributeFormProps) {
  const [attributes, setAttributes] = useState<Attribute[]>([
    { id: Date.now(), name: '', description: '' }
  ]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: { topicId: string; attributes: { name: string; description: string }[] }) =>
      hierarchyApi.createAttributes(data.topicId, data.attributes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attributes', topicId] });
      queryClient.invalidateQueries({ queryKey: ['concepts', topicId] });
      queryClient.invalidateQueries({ queryKey: ['hierarchy'] });
      setAttributes([{ id: Date.now(), name: '', description: '' }]);
      setErrors({});
      onSuccess?.();
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || 'Failed to create attributes';
      setErrors({ submit: message });
    },
  });

  const addAttribute = () => {
    setAttributes([...attributes, { id: Date.now(), name: '', description: '' }]);
  };

  const removeAttribute = (id: number) => {
    if (attributes.length > 1) {
      setAttributes(attributes.filter(attr => attr.id !== id));
    }
  };

  const updateAttribute = (id: number, field: 'name' | 'description', value: string) => {
    setAttributes(attributes.map(attr => 
      attr.id === id ? { ...attr, [field]: value } : attr
    ));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    const validAttributes = attributes.filter(attr => attr.name.trim() !== '');
    
    if (validAttributes.length === 0) {
      newErrors.submit = 'Please add at least one attribute with a name';
    }

    // Check for duplicate names
    const names = validAttributes.map(attr => attr.name.trim().toLowerCase());
    const duplicates = names.filter((name, index) => names.indexOf(name) !== index);
    if (duplicates.length > 0) {
      newErrors.submit = 'Attribute names must be unique';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    // Filter out empty attributes
    const validAttributes = attributes
      .filter(attr => attr.name.trim() !== '')
      .map(({ name, description }) => ({ name: name.trim(), description: description.trim() }));
    
    createMutation.mutate({
      topicId,
      attributes: validAttributes,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Attributes</CardTitle>
        <CardDescription>
          Add attributes under <span className="font-semibold text-primary-700 dark:text-primary-300">{topicName}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Attributes List */}
          <div className="space-y-4">
            {attributes.map((attribute, index) => (
              <div 
                key={attribute.id} 
                className="p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50"
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    Attribute {index + 1}
                  </h4>
                  {attributes.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => removeAttribute(attribute.id)}
                      className="text-error-600 dark:text-error-400 border-error-200 dark:border-error-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                <div className="space-y-3">
                  <Input
                    label="Attribute Name"
                    placeholder="e.g., Chemical Formula Recognition, pH Understanding"
                    value={attribute.name}
                    onChange={(e) => updateAttribute(attribute.id, 'name', e.target.value)}
                    required
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Description
                    </label>
                    <textarea
                      value={attribute.description}
                      onChange={(e) => updateAttribute(attribute.id, 'description', e.target.value)}
                      placeholder="Brief description of the attribute..."
                      rows={2}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-800 transition-colors duration-200"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add Another Attribute Button */}
          <Button
            type="button"
            variant="outline"
            onClick={addAttribute}
            className="w-full border-dashed border-2 hover:bg-primary-50 dark:hover:bg-primary-900/20"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Another Attribute
          </Button>

          {/* Error Message */}
          {errors.submit && (
            <div className="p-3 rounded-lg bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800">
              <p className="text-sm text-error-700 dark:text-error-400">{errors.submit}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              variant="primary"
              isLoading={createMutation.isPending}
              className="flex-1"
            >
              {createMutation.isPending 
                ? 'Creating...' 
                : `Create ${attributes.length} Attribute${attributes.length > 1 ? 's' : ''}`}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setAttributes([{ id: Date.now(), name: '', description: '' }]);
                setErrors({});
              }}
            >
              Clear All
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

// Export as CreateConceptForm for backward compatibility
export { CreateAttributeForm as CreateConceptForm };