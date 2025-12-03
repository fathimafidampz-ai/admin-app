'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ColumnMapping } from '@/types';
import { ArrowRight } from 'lucide-react';

interface ColumnMapperProps {
  fileColumns: string[];
  onMappingComplete: (mapping: ColumnMapping) => void;
  onBack: () => void;
}

const REQUIRED_FIELDS = [
  { key: 'exam_name', label: 'Exam Name', required: true },
  { key: 'subject_name', label: 'Subject Name', required: true },
  { key: 'chapter_name', label: 'Chapter Name', required: true },
  { key: 'topic_name', label: 'Topic Name', required: true },
  { key: 'concept_name', label: 'Concept Name', required: true },
  { key: 'year', label: 'Year', required: false },
  { key: 'question_content', label: 'Question Content', required: true },
  { key: 'option_a', label: 'Option A', required: true },
  { key: 'option_b', label: 'Option B', required: true },
  { key: 'option_c', label: 'Option C', required: true },
  { key: 'option_d', label: 'Option D', required: true },
  { key: 'correct_answer', label: 'Correct Answer (A/B/C/D)', required: true },
  { key: 'difficulty', label: 'Difficulty (0-1)', required: true },
  { key: 'discrimination', label: 'Discrimination (0-3)', required: true },
  { key: 'guessing', label: 'Guessing (0-0.5)', required: true },
  { key: 'explanation', label: 'Explanation', required: false },
  { key: 'tags', label: 'Tags (comma-separated)', required: false },
] as const;

export function ColumnMapper({ fileColumns, onMappingComplete, onBack }: ColumnMapperProps) {
  const [mapping, setMapping] = useState<Record<string, string>>(() => {
    const initialMapping: Record<string, string> = {};
    REQUIRED_FIELDS.forEach(field => {
      const matchingCol = fileColumns.find(col => 
        col.toLowerCase().replace(/[_\s]/g, '') === field.key.toLowerCase().replace(/[_\s]/g, '')
      );
      if (matchingCol) {
        initialMapping[field.key] = matchingCol;
      }
    });
    return initialMapping;
  });

  const handleMapping = (fieldKey: string, columnName: string) => {
    setMapping({ ...mapping, [fieldKey]: columnName });
  };

  const isValid = () => {
    return REQUIRED_FIELDS
      .filter(f => f.required)
      .every(f => mapping[f.key]);
  };

  const handleSubmit = () => {
    if (isValid()) {
      onMappingComplete(mapping as ColumnMapping);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Map Columns</CardTitle>
        <CardDescription>
          Match your file columns to the required fields
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {REQUIRED_FIELDS.map(field => (
            <div key={field.key} className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {field.label}
                {field.required && <span className="text-error-500 ml-1">*</span>}
              </label>
              <select
                value={mapping[field.key] || ''}
                onChange={(e) => handleMapping(field.key, e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-colors"
              >
                <option value="">-- Select Column --</option>
                {fileColumns.map(col => (
                  <option key={col} value={col}>{col}</option>
                ))}
              </select>
            </div>
          ))}
        </div>

        {/* Validation Message */}
        {!isValid() && (
          <div className="p-4 bg-warning-50 border border-warning-200 rounded-lg">
            <p className="text-sm text-warning-800">
              ⚠️ Please map all required fields (marked with *)
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button
            variant="outline"
            onClick={onBack}
            className="flex-1"
          >
            Back
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={!isValid()}
            className="flex-1"
          >
            Continue to Preview
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}