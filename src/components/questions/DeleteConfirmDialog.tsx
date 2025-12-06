'use client';

import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface DeleteConfirmDialogProps {
  questionContent: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting?: boolean;
}

export function DeleteConfirmDialog({
  questionContent,
  onConfirm,
  onCancel,
  isDeleting = false,
}: DeleteConfirmDialogProps) {
  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-error-100 dark:bg-error-900/30 rounded-full">
              <AlertTriangle className="w-6 h-6 text-error-600 dark:text-error-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Delete Question</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                This action cannot be undone
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-gray-700 dark:text-gray-300">
            Are you sure you want to delete this question?
          </p>

          {/* Question Preview */}
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <p className="text-sm font-medium text-gray-900 dark:text-white leading-relaxed">
              {questionContent}
            </p>
          </div>

          <div className="p-3 bg-error-50 dark:bg-error-900/20 border-l-4 border-error-500 dark:border-error-600 rounded-r-lg">
            <p className="text-sm text-error-800 dark:text-error-300">
              <strong className="font-semibold">Warning:</strong> This will permanently delete the question and all associated data.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex items-center justify-end gap-3">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={onConfirm}
            isLoading={isDeleting}
            className="bg-error-600 hover:bg-error-700 dark:bg-error-600 dark:hover:bg-error-700 text-white"
          >
            {isDeleting ? 'Deleting...' : 'Delete Question'}
          </Button>
        </div>
      </div>
    </div>
  );
}