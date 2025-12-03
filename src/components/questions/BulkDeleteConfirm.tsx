'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { AlertTriangle } from 'lucide-react';

interface BulkDeleteConfirmProps {
  selectedCount: number;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting?: boolean;
}

export function BulkDeleteConfirm({ 
  selectedCount, 
  onConfirm, 
  onCancel,
  isDeleting 
}: BulkDeleteConfirmProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-md w-full shadow-2xl">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-error-100 rounded-full">
              <AlertTriangle className="w-6 h-6 text-error-600" />
            </div>
            <CardTitle>Delete {selectedCount} Questions?</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete <strong>{selectedCount}</strong> selected questions? 
            This action cannot be undone.
          </p>

          <div className="p-4 bg-warning-50 border border-warning-200 rounded-lg">
            <p className="text-sm text-warning-800">
              ⚠️ <strong>Warning:</strong> All selected questions, including their images and metadata, will be permanently deleted.
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
              {isDeleting ? 'Deleting...' : `Delete ${selectedCount} Questions`}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}