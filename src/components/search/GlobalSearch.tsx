'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X, Clock, TrendingUp } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface SearchResult {
  id: string;
  type: 'question' | 'exam' | 'subject' | 'chapter';
  title: string;
  subtitle?: string;
  url: string;
}

export function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'Linear equations',
    'JEE Main 2023',
    'Calculus derivatives',
  ]);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Keyboard shortcut: Ctrl+K or Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
        setTimeout(() => inputRef.current?.focus(), 100);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Mock search function
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    // Simulate search delay
    const timeout = setTimeout(() => {
      const mockResults: SearchResult[] = [
        {
          id: '1',
          type: 'question',
          title: 'Solve: 2x + 3y = 12',
          subtitle: 'JEE Main → Mathematics → Algebra',
          url: '/browse',
        },
        {
          id: '2',
          type: 'exam',
          title: 'JEE Main',
          subtitle: 'Competitive Exam',
          url: '/hierarchy',
        },
        {
          id: '3',
          type: 'subject',
          title: 'Mathematics',
          subtitle: '125 questions',
          url: '/browse',
        },
      ];

      setResults(
        mockResults.filter(r => 
          r.title.toLowerCase().includes(query.toLowerCase()) ||
          r.subtitle?.toLowerCase().includes(query.toLowerCase())
        )
      );
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  const handleSelect = (result: SearchResult) => {
    // Add to recent searches
    const newRecent = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
    setRecentSearches(newRecent);
    
    router.push(result.url);
    setIsOpen(false);
    setQuery('');
  };

  const handleRecentClick = (search: string) => {
    setQuery(search);
  };

  const clearRecent = () => {
    setRecentSearches([]);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-gray-600"
      >
        <Search className="w-4 h-4" />
        <span className="text-sm">Search...</span>
        <kbd className="px-2 py-1 text-xs bg-white border border-gray-300 rounded">
          ⌘K
        </kbd>
      </button>
    );
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={() => setIsOpen(false)}
      />

      {/* Search Modal */}
      <div className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-2xl z-50 px-4">
        <div className="bg-white rounded-lg shadow-2xl border-2 border-gray-200">
          {/* Search Input */}
          <div className="flex items-center gap-3 p-4 border-b border-gray-200">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search questions, exams, topics..."
              className="flex-1 outline-none text-gray-900 placeholder-gray-400"
              autoFocus
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            )}
            <kbd className="px-2 py-1 text-xs bg-gray-100 border border-gray-300 rounded">
              ESC
            </kbd>
          </div>

          {/* Results */}
          <div className="max-h-96 overflow-y-auto">
            {query.trim().length < 2 ? (
              // Recent Searches
              recentSearches.length > 0 && (
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Clock className="w-4 h-4" />
                      Recent Searches
                    </div>
                    <button
                      onClick={clearRecent}
                      className="text-xs text-gray-500 hover:text-gray-700"
                    >
                      Clear
                    </button>
                  </div>
                  <div className="space-y-1">
                    {recentSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => handleRecentClick(search)}
                        className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-lg text-sm text-gray-700 transition-colors"
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              )
            ) : results.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <p>No results found for "{query}"</p>
                <p className="text-sm mt-1">Try different keywords</p>
              </div>
            ) : (
              <div className="p-2">
                {results.map((result) => (
                  <button
                    key={result.id}
                    onClick={() => handleSelect(result)}
                    className="w-full flex items-start gap-3 p-3 hover:bg-gray-100 rounded-lg transition-colors text-left"
                  >
                    <div className={cn(
                      "w-8 h-8 rounded flex items-center justify-center flex-shrink-0",
                      result.type === 'question' && "bg-primary-100",
                      result.type === 'exam' && "bg-success-100",
                      result.type === 'subject' && "bg-warning-100",
                      result.type === 'chapter' && "bg-blue-100"
                    )}>
                      <TrendingUp className={cn(
                        "w-4 h-4",
                        result.type === 'question' && "text-primary-600",
                        result.type === 'exam' && "text-success-600",
                        result.type === 'subject' && "text-warning-600",
                        result.type === 'chapter' && "text-blue-600"
                      )} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">
                        {result.title}
                      </p>
                      {result.subtitle && (
                        <p className="text-sm text-gray-500 truncate">
                          {result.subtitle}
                        </p>
                      )}
                    </div>
                    <span className="text-xs text-gray-400 uppercase">
                      {result.type}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-gray-200 bg-gray-50 flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded">↑</kbd>
                <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded">↓</kbd>
                navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded">↵</kbd>
                select
              </span>
            </div>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded">ESC</kbd>
              close
            </span>
          </div>
        </div>
      </div>
    </>
  );
}