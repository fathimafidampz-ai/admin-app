'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { hierarchyApi } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { ChevronRight, ChevronDown, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TreeNode } from '@/types';

// Icon mapping for different node types
const getNodeIcon = (type: string) => {
  const icons: Record<string, string> = {
    exam: '📚',
    class: '🎓',
    subject: '📖',
    chapter: '📑',
    topic: '📝',
    concept: '💡',
  };
  return icons[type] || '📄';
};

// Color mapping for different node types
const getNodeColor = (type: string) => {
  const colors: Record<string, string> = {
    exam: 'text-primary-700 dark:text-primary-300 bg-primary-50 dark:bg-primary-900/30',
    class: 'text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-900/30',
    subject: 'text-success-700 dark:text-success-300 bg-success-50 dark:bg-success-900/30',
    chapter: 'text-warning-700 dark:text-warning-300 bg-warning-50 dark:bg-warning-900/30',
    topic: 'text-error-700 dark:text-error-300 bg-error-50 dark:bg-error-900/30',
    concept: 'text-secondary-700 dark:text-secondary-300 bg-secondary-50 dark:bg-secondary-900/30',
  };
  return colors[type] || 'text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800';
};

interface TreeNodeComponentProps {
  node: TreeNode;
  level: number;
}

function TreeNodeComponent({ node, level }: TreeNodeComponentProps) {
  const [isExpanded, setIsExpanded] = useState(level < 2); // Auto-expand first 2 levels
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className="select-none">
      {/* Node Item */}
      <div
        className={cn(
          "flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer group",
          level === 0 && "font-semibold"
        )}
        style={{ marginLeft: `${level * 24}px` }}
        onClick={() => hasChildren && setIsExpanded(!isExpanded)}
      >
        {/* Expand/Collapse Icon */}
        {hasChildren ? (
          <button
            className="flex-shrink-0 w-5 h-5 flex items-center justify-center text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
          >
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
        ) : (
          <div className="w-5" />
        )}

        {/* Node Icon & Badge */}
        <div className={cn(
          "flex items-center justify-center w-8 h-8 rounded-lg text-lg flex-shrink-0",
          getNodeColor(node.type)
        )}>
          {getNodeIcon(node.type)}
        </div>

        {/* Node Name */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-gray-900 dark:text-gray-100 truncate">{node.name}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400 capitalize px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700">
              {node.type}
            </span>
          </div>
          {node.description && (
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-0.5">{node.description}</p>
          )}
        </div>

        {/* Children Count */}
        {hasChildren && (
          <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
            {node.children!.length}
          </span>
        )}
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div className="mt-1 border-l-2 border-gray-200 dark:border-gray-700 ml-3">
          {node.children!.map((child) => (
            <TreeNodeComponent key={child.id} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

interface HierarchyTreeProps {
  examId?: string;
}

export function HierarchyTree({ examId }: HierarchyTreeProps) {
  const { data: treeData, isLoading, error } = useQuery({
    queryKey: ['hierarchy-tree', examId],
    queryFn: () => hierarchyApi.getHierarchyTree(examId),
    refetchInterval: 5000, // Auto-refresh every 5 seconds
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
            <Loader2 className="w-12 h-12 animate-spin mb-4" />
            <p>Loading hierarchy tree...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center text-error-600 dark:text-error-400">
            <p>Error loading hierarchy tree</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Please try again</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!treeData || treeData.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center text-gray-400 dark:text-gray-500">
            <p className="text-lg font-medium mb-2">No hierarchy data yet</p>
            <p className="text-sm">Create exams and build your content structure</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hierarchy Tree View</CardTitle>
        <CardDescription>
          Expandable view of your content structure
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-1 max-h-[600px] overflow-y-auto bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          {treeData.map((node: TreeNode) => (
            <TreeNodeComponent key={node.id} node={node} level={0} />
          ))}
        </div>
        
        {/* Instructions */}
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
          <p className="text-xs text-blue-900 dark:text-blue-100 font-medium mb-1">
            💡 Tip:
          </p>
          <p className="text-xs text-blue-700 dark:text-blue-300">
            Click on nodes with arrows to expand/collapse their children. The tree auto-refreshes every 5 seconds.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
