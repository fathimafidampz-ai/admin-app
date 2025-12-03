'use client';

import { Button } from '@/components/ui/Button';
import { Trash2, Edit, Download, Tag, X } from 'lucide-react';

interface BatchActionsProps {
  selectedCount: number;
  onBulkDelete: () => void;
  onBulkEdit: () => void;
  onBulkExport: () => void;
  onBulkTag: () => void;
  onClearSelection: () => void;
}

export function BatchActions({
  selectedCount,
  onBulkDelete,
  onBulkEdit,
  onBulkExport,
  onBulkTag,
  onClearSelection,
}: BatchActionsProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="bg-white border-2 border-primary-500 rounded-lg shadow-2xl p-4">
        <div className="flex items-center gap-4">
          {/* Selection Count */}
          <div className="flex items-center gap-2 px-4 py-2 bg-primary-50 rounded-lg">
            <span className="text-sm font-semibold text-primary-900">
              {selectedCount} selected
            </span>
            <button
              onClick={onClearSelection}
              className="p-1 hover:bg-primary-100 rounded transition-colors"
            >
              <X className="w-4 h-4 text-primary-700" />
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onBulkEdit}
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={onBulkTag}
            >
              <Tag className="w-4 h-4 mr-2" />
              Tag
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={onBulkExport}
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={onBulkDelete}
              className="text-error-600 hover:bg-error-50 border-error-300"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}