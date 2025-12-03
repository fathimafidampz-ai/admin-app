'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Clock, Star, Trash2 } from 'lucide-react';

interface SavedSearch {
  id: string;
  name: string;
  query: string;
  filters: any;
  createdAt: string;
  isFavorite: boolean;
}

export function SavedSearches() {
  const [searches, setSearches] = useState<SavedSearch[]>([
    {
      id: '1',
      name: 'Easy Algebra Questions',
      query: 'algebra',
      filters: { difficulty: 'easy' },
      createdAt: '2024-11-28',
      isFavorite: true,
    },
    {
      id: '2',
      name: 'JEE Main 2023',
      query: 'JEE',
      filters: { year: '2023' },
      createdAt: '2024-11-27',
      isFavorite: false,
    },
    {
      id: '3',
      name: 'Hard Calculus',
      query: 'calculus',
      filters: { difficulty: 'hard' },
      createdAt: '2024-11-25',
      isFavorite: true,
    },
  ]);

  const toggleFavorite = (id: string) => {
    setSearches(searches.map(s => 
      s.id === id ? { ...s, isFavorite: !s.isFavorite } : s
    ));
  };

  const deleteSearch = (id: string) => {
    if (confirm('Delete this saved search?')) {
      setSearches(searches.filter(s => s.id !== id));
    }
  };

  const loadSearch = (search: SavedSearch) => {
    console.log('Loading search:', search);
    alert(`Loading search: ${search.name}`);
  };

  const favorites = searches.filter(s => s.isFavorite);
  const recent = searches.filter(s => !s.isFavorite);

  return (
    <div className="space-y-6">
      {/* Favorites */}
      {favorites.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-warning-500" />
              Favorite Searches
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {favorites.map((search) => (
              <div
                key={search.id}
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <button
                  onClick={() => loadSearch(search)}
                  className="flex-1 text-left"
                >
                  <p className="font-medium text-gray-900">{search.name}</p>
                  <p className="text-sm text-gray-500">"{search.query}"</p>
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleFavorite(search.id)}
                    className="p-2 hover:bg-warning-50 rounded-lg transition-colors"
                  >
                    <Star className="w-4 h-4 text-warning-500 fill-warning-500" />
                  </button>
                  <button
                    onClick={() => deleteSearch(search.id)}
                    className="p-2 hover:bg-error-50 text-error-600 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Recent */}
      {recent.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-gray-500" />
              Recent Searches
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {recent.map((search) => (
              <div
                key={search.id}
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <button
                  onClick={() => loadSearch(search)}
                  className="flex-1 text-left"
                >
                  <p className="font-medium text-gray-900">{search.name}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>"{search.query}"</span>
                    <span>•</span>
                    <span>{search.createdAt}</span>
                  </div>
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleFavorite(search.id)}
                    className="p-2 hover:bg-warning-50 rounded-lg transition-colors"
                  >
                    <Star className="w-4 h-4 text-gray-400" />
                  </button>
                  <button
                    onClick={() => deleteSearch(search.id)}
                    className="p-2 hover:bg-error-50 text-error-600 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}