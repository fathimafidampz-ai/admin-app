'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { AlertTriangle } from 'lucide-react';

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
  isDeleting 
}: DeleteConfirmDialogProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-md w-full shadow-2xl">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-error-100 rounded-full">
              <AlertTriangle className="w-6 h-6 text-error-600" />
            </div>
            <CardTitle>Delete Question?</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete this question? This action cannot be undone.
          </p>
          
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-700 line-clamp-3">
              {questionContent}
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={onCancel}
              disabled={isDeleting}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={onConfirm}
              isLoading={isDeleting}
              className="flex-1 bg-error-600 hover:bg-error-700"
            >
              {isDeleting ? 'Deleting...' : 'Delete Question'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}