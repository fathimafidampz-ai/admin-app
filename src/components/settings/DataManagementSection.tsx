'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Download, Upload, Trash2, Database } from 'lucide-react';

export function DataManagementSection() {
  const handleExport = () => {
    // Mock export
    const data = {
      exams: [],
      questions: [],
      resources: [],
      exportDate: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `eduadmin-backup-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const data = JSON.parse(event.target?.result as string);
            console.log('Imported data:', data);
            alert('Data imported successfully!');
          } catch (error) {
            alert('Invalid file format');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleClearCache = () => {
    if (confirm('Are you sure you want to clear all cached data?')) {
      localStorage.clear();
      sessionStorage.clear();
      alert('Cache cleared successfully!');
      window.location.reload();
    }
  };

  const handleDeleteAll = () => {
    if (confirm('⚠️ WARNING: This will delete ALL your data. This action cannot be undone. Are you absolutely sure?')) {
      if (confirm('This is your final warning. All exams, questions, and resources will be permanently deleted. Continue?')) {
        console.log('Deleting all data...');
        alert('All data has been deleted.');
        window.location.reload();
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Management</CardTitle>
        <CardDescription>Export, import, and manage your data</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Export */}
        <div className="p-4 border border-gray-200 rounded-lg">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Download className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-900 mb-1">Export Data</h4>
              <p className="text-sm text-gray-600 mb-3">
                Download all your data as a backup file
              </p>
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="w-4 h-4 mr-2" />
                Export to JSON
              </Button>
            </div>
          </div>
        </div>

        {/* Import */}
        <div className="p-4 border border-gray-200 rounded-lg">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-success-100 rounded-lg">
              <Upload className="w-5 h-5 text-success-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-900 mb-1">Import Data</h4>
              <p className="text-sm text-gray-600 mb-3">
                Restore data from a backup file
              </p>
              <Button variant="outline" size="sm" onClick={handleImport}>
                <Upload className="w-4 h-4 mr-2" />
                Import from JSON
              </Button>
            </div>
          </div>
        </div>

        {/* Clear Cache */}
        <div className="p-4 border border-gray-200 rounded-lg">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-warning-100 rounded-lg">
              <Database className="w-5 h-5 text-warning-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-900 mb-1">Clear Cache</h4>
              <p className="text-sm text-gray-600 mb-3">
                Clear temporary data and refresh the app
              </p>
              <Button variant="outline" size="sm" onClick={handleClearCache}>
                <Database className="w-4 h-4 mr-2" />
                Clear Cache
              </Button>
            </div>
          </div>
        </div>

        {/* Delete All */}
<div className="p-4 border-2 border-error-200 dark:border-error-700 bg-error-50 dark:bg-error-900/20 rounded-lg">
  <div className="flex items-start gap-4">
    <div className="p-2 bg-error-100 dark:bg-error-800/50 rounded-lg">
      <Trash2 className="w-5 h-5 text-error-600 dark:text-error-400" />
    </div>
    <div className="flex-1">
      <h4 className="font-medium text-error-900 dark:text-error-100 mb-1">Danger Zone</h4>
      <p className="text-sm text-error-700 dark:text-error-300 mb-3">
        Permanently delete all data. This action cannot be undone.
      </p>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleDeleteAll}
        className="border-error-600 dark:border-error-500 text-error-600 dark:text-error-400 hover:bg-error-100 dark:hover:bg-error-900/30"
      >
        <Trash2 className="w-4 h-4 mr-2" />
        Delete All Data
      </Button>
    </div>
  </div>
</div>
      </CardContent>
    </Card>
  );
}