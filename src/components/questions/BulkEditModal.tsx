'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { X } from 'lucide-react';

interface BulkEditModalProps {
  selectedCount: number;
  onClose: () => void;
  onSave: (updates: BulkEditData) => void;
}

interface BulkEditData {
  difficulty?: number;
  discrimination?: number;
  guessing?: number;
  addTags?: string;
  removeTags?: string;
}

export function BulkEditModal({ selectedCount, onClose, onSave }: BulkEditModalProps) {
  const [updates, setUpdates] = useState<BulkEditData>({});
  const [editMode, setEditMode] = useState({
    difficulty: false,
    discrimination: false,
    guessing: false,
    tags: false,
  });

  const handleSave = () => {
    const filteredUpdates: BulkEditData = {};
    
    if (editMode.difficulty && updates.difficulty !== undefined) {
      filteredUpdates.difficulty = updates.difficulty;
    }
    if (editMode.discrimination && updates.discrimination !== undefined) {
      filteredUpdates.discrimination = updates.discrimination;
    }
    if (editMode.guessing && updates.guessing !== undefined) {
      filteredUpdates.guessing = updates.guessing;
    }
    if (editMode.tags) {
      if (updates.addTags) filteredUpdates.addTags = updates.addTags;
      if (updates.removeTags) filteredUpdates.removeTags = updates.removeTags;
    }

    onSave(filteredUpdates);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-2xl w-full shadow-2xl">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle>Bulk Edit {selectedCount} Questions</CardTitle>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <p className="text-sm text-gray-600">
            Select which fields you want to update for all {selectedCount} selected questions.
          </p>

          {/* 3PL Parameters */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">3PL Parameters</h3>

            {/* Difficulty */}
            <div className="flex items-center gap-4">
              <input
                type="checkbox"
                id="edit-difficulty"
                checked={editMode.difficulty}
                onChange={(e) => setEditMode({ ...editMode, difficulty: e.target.checked })}
                className="w-4 h-4 text-primary-600 rounded"
              />
              <label htmlFor="edit-difficulty" className="flex-1">
                <Input
                  label="Difficulty (0-1)"
                  type="number"
                  step="0.01"
                  min="0"
                  max="1"
                  value={updates.difficulty || ''}
                  onChange={(e) => setUpdates({ ...updates, difficulty: parseFloat(e.target.value) })}
                  disabled={!editMode.difficulty}
                />
              </label>
            </div>

            {/* Discrimination */}
            <div className="flex items-center gap-4">
              <input
                type="checkbox"
                id="edit-discrimination"
                checked={editMode.discrimination}
                onChange={(e) => setEditMode({ ...editMode, discrimination: e.target.checked })}
                className="w-4 h-4 text-primary-600 rounded"
              />
              <label htmlFor="edit-discrimination" className="flex-1">
                <Input
                  label="Discrimination (0-3)"
                  type="number"
                  step="0.1"
                  min="0"
                  max="3"
                  value={updates.discrimination || ''}
                  onChange={(e) => setUpdates({ ...updates, discrimination: parseFloat(e.target.value) })}
                  disabled={!editMode.discrimination}
                />
              </label>
            </div>

            {/* Guessing */}
            <div className="flex items-center gap-4">
              <input
                type="checkbox"
                id="edit-guessing"
                checked={editMode.guessing}
                onChange={(e) => setEditMode({ ...editMode, guessing: e.target.checked })}
                className="w-4 h-4 text-primary-600 rounded"
              />
              <label htmlFor="edit-guessing" className="flex-1">
                <Input
                  label="Guessing (0-0.5)"
                  type="number"
                  step="0.01"
                  min="0"
                  max="0.5"
                  value={updates.guessing || ''}
                  onChange={(e) => setUpdates({ ...updates, guessing: parseFloat(e.target.value) })}
                  disabled={!editMode.guessing}
                />
              </label>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="edit-tags"
                checked={editMode.tags}
                onChange={(e) => setEditMode({ ...editMode, tags: e.target.checked })}
                className="w-4 h-4 text-primary-600 rounded"
              />
              <h3 className="font-semibold text-gray-900">Tags</h3>
            </div>

            <Input
              label="Add Tags (comma-separated)"
              placeholder="tag1, tag2, tag3"
              value={updates.addTags || ''}
              onChange={(e) => setUpdates({ ...updates, addTags: e.target.value })}
              disabled={!editMode.tags}
            />

            <Input
              label="Remove Tags (comma-separated)"
              placeholder="tag1, tag2"
              value={updates.removeTags || ''}
              onChange={(e) => setUpdates({ ...updates, removeTags: e.target.value })}
              disabled={!editMode.tags}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSave}
              className="flex-1"
            >
              Update {selectedCount} Questions
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}