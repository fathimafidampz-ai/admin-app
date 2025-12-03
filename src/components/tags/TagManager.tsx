'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Tag, X, Plus, Edit2, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TagItem {
  id: string;
  name: string;
  count: number;
  color: string;
}

export function TagManager() {
  const [tags, setTags] = useState<TagItem[]>([
    { id: '1', name: 'algebra', count: 15, color: 'blue' },
    { id: '2', name: 'geometry', count: 8, color: 'green' },
    { id: '3', name: 'calculus', count: 12, color: 'purple' },
    { id: '4', name: 'easy', count: 20, color: 'success' },
    { id: '5', name: 'medium', count: 18, color: 'warning' },
    { id: '6', name: 'hard', count: 10, color: 'error' },
    { id: '7', name: '2023', count: 25, color: 'gray' },
    { id: '8', name: 'practice', count: 30, color: 'indigo' },
  ]);

  const [newTagName, setNewTagName] = useState('');
  const [editingTag, setEditingTag] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const colorClasses = {
    blue: 'bg-blue-100 text-blue-700 border-blue-200',
    green: 'bg-green-100 text-green-700 border-green-200',
    purple: 'bg-purple-100 text-purple-700 border-purple-200',
    success: 'bg-success-100 text-success-700 border-success-200',
    warning: 'bg-warning-100 text-warning-700 border-warning-200',
    error: 'bg-error-100 text-error-700 border-error-200',
    gray: 'bg-gray-100 text-gray-700 border-gray-200',
    indigo: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  };

  const handleCreateTag = () => {
    if (!newTagName.trim()) return;

    const newTag: TagItem = {
      id: Date.now().toString(),
      name: newTagName.toLowerCase(),
      count: 0,
      color: 'blue',
    };

    setTags([...tags, newTag]);
    setNewTagName('');
  };

  const handleDeleteTag = (id: string) => {
    if (confirm('Delete this tag? This will remove it from all questions.')) {
      setTags(tags.filter(t => t.id !== id));
    }
  };

  const handleRenameTag = (id: string, newName: string) => {
    setTags(tags.map(t => t.id === id ? { ...t, name: newName } : t));
    setEditingTag(null);
  };

  const filteredTags = tags.filter(tag => 
    tag.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalQuestions = tags.reduce((sum, tag) => sum + tag.count, 0);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Tag Manager</CardTitle>
            <CardDescription>Manage tags for better organization</CardDescription>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-primary-600">{tags.length}</p>
            <p className="text-sm text-gray-600">Total Tags</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Create New Tag */}
        <div className="flex gap-2">
          <Input
            placeholder="Enter new tag name..."
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleCreateTag()}
          />
          <Button variant="primary" onClick={handleCreateTag}>
            <Plus className="w-4 h-4 mr-2" />
            Add Tag
          </Button>
        </div>

        {/* Search Tags */}
        <Input
          placeholder="Search tags..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Statistics */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 bg-gradient-to-br from-green-400 to-green-600 dark:from-green-500 dark:to-green-700 border-2 border-green-500 dark:border-green-600 rounded-lg text-center shadow-md hover:shadow-lg transition-all">
            <p className="text-2xl font-bold text-white drop-shadow-md">{tags.length}</p>
            <p className="text-xs font-semibold text-green-50 dark:text-green-100">Total Tags</p>
          </div>
          <div className="p-3 bg-gradient-to-br from-yellow-400 to-orange-500 dark:from-yellow-500 dark:to-orange-600 border-2 border-orange-500 dark:border-orange-600 rounded-lg text-center shadow-md hover:shadow-lg transition-all">
            <p className="text-2xl font-bold text-white drop-shadow-md">{totalQuestions}</p>
            <p className="text-xs font-semibold text-orange-50 dark:text-orange-100">Tagged Questions</p>
          </div>
          <div className="p-3 bg-gradient-to-br from-blue-400 to-blue-600 dark:from-blue-500 dark:to-blue-700 border-2 border-blue-500 dark:border-blue-600 rounded-lg text-center shadow-md hover:shadow-lg transition-all">
            <p className="text-2xl font-bold text-white drop-shadow-md">
              {tags.length > 0 ? (totalQuestions / tags.length).toFixed(1) : 0}
            </p>
            <p className="text-xs font-semibold text-blue-50 dark:text-blue-100">Avg per Tag</p>
          </div>
        </div>

        {/* Tags List */}
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {filteredTags.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No tags found</p>
          ) : (
            filteredTags.map((tag) => (
              <div
                key={tag.id}
                className={cn(
                  "flex items-center justify-between p-3 rounded-lg border-2 transition-all hover:shadow-md",
                  colorClasses[tag.color as keyof typeof colorClasses]
                )}
              >
                {editingTag === tag.id ? (
                  <input
                    type="text"
                    defaultValue={tag.name}
                    autoFocus
                    onBlur={(e) => handleRenameTag(tag.id, e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleRenameTag(tag.id, e.currentTarget.value);
                      }
                    }}
                    className="flex-1 px-2 py-1 border border-gray-300 rounded"
                  />
                ) : (
                  <div className="flex items-center gap-3 flex-1">
                    <Tag className="w-4 h-4" />
                    <span className="font-medium">#{tag.name}</span>
                    <span className="px-2 py-0.5 bg-white bg-opacity-50 rounded-full text-xs font-semibold">
                      {tag.count}
                    </span>
                  </div>
                )}

                <div className="flex gap-1">
                  <button
                    onClick={() => setEditingTag(tag.id)}
                    className="p-1.5 hover:bg-white hover:bg-opacity-50 rounded transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteTag(tag.id)}
                    className="p-1.5 hover:bg-white hover:bg-opacity-50 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}