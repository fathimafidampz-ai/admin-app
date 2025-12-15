'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Plus, X, Save, Filter, Trash2 } from 'lucide-react';

interface FilterRule {
  id: string;
  field: string;
  operator: string;
  value: string;
}

interface SavedFilter {
  id: string;
  name: string;
  rules: FilterRule[];
}

export function AdvancedFilterBuilder() {
  const [rules, setRules] = useState<FilterRule[]>([
    { id: '1', field: 'difficulty', operator: 'equals', value: '0.5' },
  ]);

  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([
    { id: '1', name: 'Easy Questions', rules: [{ id: '1', field: 'difficulty', operator: 'less_than', value: '0.33' }] },
    { id: '2', name: 'Recent 2023', rules: [{ id: '1', field: 'tags', operator: 'contains', value: '2023' }] },
  ]);

  const [filterName, setFilterName] = useState('');

  const fields = [
    { value: 'difficulty', label: 'Difficulty' },
    { value: 'discrimination', label: 'Discrimination' },
    { value: 'guessing', label: 'Guessing' },
    { value: 'tags', label: 'Tags' },
    { value: 'content', label: 'Question Content' },
    { value: 'created_at', label: 'Created Date' },
  ];

  const operators = [
    { value: 'equals', label: 'Equals' },
    { value: 'not_equals', label: 'Not Equals' },
    { value: 'greater_than', label: 'Greater Than' },
    { value: 'less_than', label: 'Less Than' },
    { value: 'contains', label: 'Contains' },
    { value: 'not_contains', label: 'Does Not Contain' },
  ];

  const addRule = () => {
    const newRule: FilterRule = {
      id: Date.now().toString(),
      field: 'difficulty',
      operator: 'equals',
      value: '',
    };
    setRules([...rules, newRule]);
  };

  const removeRule = (id: string) => {
    setRules(rules.filter((r) => r.id !== id));
  };

  const updateRule = (id: string, field: keyof FilterRule, value: string) => {
    setRules(rules.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  };

  const saveFilter = () => {
    if (!filterName.trim()) {
      alert('Please enter a filter name');
      return;
    }

    const newFilter: SavedFilter = {
      id: Date.now().toString(),
      name: filterName,
      rules: [...rules],
    };

    setSavedFilters([...savedFilters, newFilter]);
    setFilterName('');
    alert('Filter saved successfully!');
  };

  const loadFilter = (filter: SavedFilter) => {
    setRules([...filter.rules]);
    setFilterName(filter.name);
  };

  const deleteFilter = (id: string) => {
    if (confirm('Delete this saved filter?')) {
      setSavedFilters(savedFilters.filter((f) => f.id !== id));
    }
  };

  const applyFilters = () => {
    console.log('Applying filters:', rules);
    alert('Filters applied! (This will filter questions in Browse page)');
  };

  return (
    <div className="space-y-6">
      {/* Filter Builder */}
      <Card>
        <CardHeader>
          <CardTitle>Advanced Filter Builder</CardTitle>
          <CardDescription>Create complex filters to find exactly what you need</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Rules */}
          <div className="space-y-3">
            {rules.map((rule, index) => (
              <div
                key={rule.id}
                className="
                  flex flex-col gap-2
                  md:flex-row md:items-center md:gap-2
                "
              >
                {index > 0 && (
                  <span className="text-xs font-medium text-gray-600 md:text-sm md:w-12">
                    AND
                  </span>
                )}

                {/* Field */}
                <select
                  value={rule.field}
                  onChange={(e) => updateRule(rule.id, 'field', e.target.value)}
                  className="
                    w-full md:w-auto
                    px-3 py-2 border border-gray-300 rounded-lg
                    focus:ring-2 focus:ring-primary-500 focus:border-primary-500
                    bg-white dark:bg-slate-900 dark:border-slate-700 dark:text-gray-100
                  "
                >
                  {fields.map((f) => (
                    <option key={f.value} value={f.value}>
                      {f.label}
                    </option>
                  ))}
                </select>

                {/* Operator */}
                <select
                  value={rule.operator}
                  onChange={(e) => updateRule(rule.id, 'operator', e.target.value)}
                  className="
                    w-full md:w-auto
                    px-3 py-2 border border-gray-300 rounded-lg
                    focus:ring-2 focus:ring-primary-500 focus:border-primary-500
                    bg-white dark:bg-slate-900 dark:border-slate-700 dark:text-gray-100
                  "
                >
                  {operators.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>

                {/* Value */}
                <input
                  type="text"
                  value={rule.value}
                  onChange={(e) => updateRule(rule.id, 'value', e.target.value)}
                  placeholder="Enter value..."
                  className="
                    w-full flex-1
                    px-3 py-2 border border-gray-300 rounded-lg
                    focus:ring-2 focus:ring-primary-500 focus:border-primary-500
                    bg-white dark:bg-slate-900 dark:border-slate-700 dark:text-gray-100
                  "
                />

                {/* Remove */}
                <button
                  onClick={() => removeRule(rule.id)}
                  className="
                    self-end md:self-auto
                    p-2 rounded-lg transition-colors
                    hover:bg-error-50 text-error-600
                    dark:hover:bg-error-500/10 dark:text-error-400
                  "
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Add Rule Button */}
          <Button variant="outline" onClick={addRule} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Add Rule
          </Button>

          {/* Save Filter */}
          <div
            className="
              flex flex-col gap-2 pt-4 border-t border-gray-200
              sm:flex-row sm:items-center
            "
          >
            <Input
              placeholder="Filter name..."
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
              className="w-full sm:flex-1"
            />
            <div className="flex flex-col gap-2 sm:flex-row sm:gap-2 sm:justify-end">
              <Button variant="outline" onClick={saveFilter} className="w-full sm:w-auto">
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button variant="primary" onClick={applyFilters} className="w-full sm:w-auto">
                <Filter className="w-4 h-4 mr-2" />
                Apply
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Saved Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Saved Filters</CardTitle>
          <CardDescription>Quick access to your saved filter presets</CardDescription>
        </CardHeader>
        <CardContent>
          {savedFilters.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400 py-8">
              No saved filters yet
            </p>
          ) : (
            <div className="space-y-2">
              {savedFilters.map((filter) => (
                <div
                  key={filter.id}
                  className="
                    flex flex-col gap-3
                    sm:flex-row sm:items-center sm:justify-between
                    p-3 rounded-lg border
                    bg-white border-gray-200
                    hover:bg-sky-100
                    dark:bg-slate-900 dark:border-slate-700
                    dark:hover:bg-sky-500/20
                    transition-colors
                  "
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {filter.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {filter.rules.length} rule
                      {filter.rules.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="flex gap-2 sm:justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadFilter(filter)}
                      className="w-full sm:w-auto"
                    >
                      Load
                    </Button>
                    <button
                      onClick={() => deleteFilter(filter.id)}
                      className="
                        p-2 rounded-lg transition-colors
                        hover:bg-error-50 text-error-600
                        dark:hover:bg-error-500/10 dark:text-error-400
                      "
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
