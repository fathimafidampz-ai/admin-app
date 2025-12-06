'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Tag, Plus, Search, Edit, Trash2, Hash } from 'lucide-react';

interface TagData {
  id: string;
  name: string;
  count: number;
  color: string;
}

export function TagManager() {
  const [newTag, setNewTag] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [tags, setTags] = useState<TagData[]>([
    { id: '1', name: 'algebra', count: 15, color: 'blue' },
    { id: '2', name: 'geometry', count: 8, color: 'green' },
    { id: '3', name: 'calculus', count: 12, color: 'purple' },
    { id: '4', name: 'easy', count: 20, color: 'green' },
    { id: '5', name: 'medium', count: 18, color: 'yellow' },
    { id: '6', name: 'hard', count: 10, color: 'red' },
    { id: '7', name: 'physics', count: 25, color: 'blue' },
    { id: '8', name: 'chemistry', count: 22, color: 'purple' },
  ]);

  const handleAddTag = () => {
    if (newTag.trim()) {
      const newTagData: TagData = {
        id: Date.now().toString(),
        name: newTag.toLowerCase().trim(),
        count: 0,
        color: ['blue', 'green', 'purple', 'yellow', 'red'][Math.floor(Math.random() * 5)],
      };
      setTags([...tags, newTagData]);
      setNewTag('');
    }
  };

  const handleDeleteTag = (id: string) => {
    if (confirm('Are you sure you want to delete this tag?')) {
      setTags(tags.filter(tag => tag.id !== id));
    }
  };

  const filteredTags = tags.filter(tag =>
    tag.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalTags = tags.length;
  const totalTaggedQuestions = tags.reduce((sum, tag) => sum + tag.count, 0);
  const avgPerTag = totalTags > 0 ? (totalTaggedQuestions / totalTags).toFixed(1) : '0';

  const getTagColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300';
      case 'green':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300';
      case 'purple':
        return 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300';
      case 'yellow':
        return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-300';
      case 'red':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300';
      default:
        return 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300';
    }
  };

  const getIconColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return 'text-blue-600 dark:text-blue-400';
      case 'green':
        return 'text-green-600 dark:text-green-400';
      case 'purple':
        return 'text-purple-600 dark:text-purple-400';
      case 'yellow':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'red':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Tag Manager</CardTitle>
            <CardDescription>Manage tags for better organization</CardDescription>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalTags}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Tags</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Add New Tag */}
        <div className="flex gap-3 mb-6">
          <Input
            placeholder="Enter new tag name..."
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
            className="flex-1"
          />
          <Button onClick={handleAddTag} variant="primary">
            <Plus className="w-4 h-4 mr-2" />
            Add Tag
          </Button>
        </div>

        {/* Search Tags */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Search tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:border-primary-500 dark:focus:border-primary-400 focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-800 transition-colors"
            />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="p-4 rounded-lg bg-success-50 dark:bg-success-900/20 border border-success-200 dark:border-success-800">
            <p className="text-2xl font-bold text-success-700 dark:text-success-300">{totalTags}</p>
            <p className="text-sm text-success-600 dark:text-success-400">Total Tags</p>
          </div>
          <div className="p-4 rounded-lg bg-warning-50 dark:bg-warning-900/20 border border-warning-200 dark:border-warning-800">
            <p className="text-2xl font-bold text-warning-700 dark:text-warning-300">{totalTaggedQuestions}</p>
            <p className="text-sm text-warning-600 dark:text-warning-400">Tagged Questions</p>
          </div>
          <div className="p-4 rounded-lg bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800">
            <p className="text-2xl font-bold text-primary-700 dark:text-primary-300">{avgPerTag}</p>
            <p className="text-sm text-primary-600 dark:text-primary-400">Avg per Tag</p>
          </div>
        </div>

        {/* Tags List */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {filteredTags.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No tags found
            </div>
          ) : (
            filteredTags.map((tag) => (
              <div
                key={tag.id}
                className={`flex items-center justify-between p-4 rounded-lg border transition-all hover:shadow-md ${getTagColorClasses(tag.color)}`}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Hash className={`w-5 h-5 flex-shrink-0 ${getIconColorClasses(tag.color)}`} />
                  <span className="font-medium truncate">#{tag.name}</span>
                  <span className="px-2 py-0.5 rounded-full text-xs bg-white/50 dark:bg-black/20 flex-shrink-0">
                    {tag.count}
                  </span>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <button
                    className="p-2 hover:bg-white/50 dark:hover:bg-black/20 rounded-lg transition-colors"
                    onClick={() => alert(`Edit tag: ${tag.name}`)}
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    className="p-2 hover:bg-white/50 dark:hover:bg-black/20 rounded-lg transition-colors"
                    onClick={() => handleDeleteTag(tag.id)}
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