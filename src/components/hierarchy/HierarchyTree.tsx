'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { hierarchyApi } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Loader2, ChevronRight, ChevronDown, FileText, BookOpen, Layers, List, Target, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HierarchyTreeProps {
  examId?: string;
}

export function HierarchyTree({ examId }: HierarchyTreeProps) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  const { data: hierarchyData, isLoading, error } = useQuery({
    queryKey: ['hierarchy-tree', examId],
    queryFn: () => hierarchyApi.getHierarchyTree(examId),
    retry: false,
  });

  const toggleNode = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'exam':
        return FileText;
      case 'class':
        return BookOpen;
      case 'subject':
        return Layers;
      case 'chapter':
        return List;
      case 'topic':
        return Target;
      case 'concept':
        return Lightbulb;
      default:
        return FileText;
    }
  };

  const getNodeColor = (type: string) => {
    switch (type) {
      case 'exam':
        return 'text-primary-600 dark:text-primary-400 bg-primary-100 dark:bg-primary-900/30';
      case 'class':
        return 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30';
      case 'subject':
        return 'text-success-600 dark:text-success-400 bg-success-100 dark:bg-success-900/30';
      case 'chapter':
        return 'text-warning-600 dark:text-warning-400 bg-warning-100 dark:bg-warning-900/30';
      case 'topic':
        return 'text-error-600 dark:text-error-400 bg-error-100 dark:bg-error-900/30';
      case 'concept':
        return 'text-secondary-600 dark:text-secondary-400 bg-secondary-100 dark:bg-secondary-900/30';
      default:
        return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800';
    }
  };

  const renderNode = (node: any, type: string, level: number = 0) => {
    if (!node) return null;

    const nodeId = `${type}-${node.id}`;
    const Icon = getNodeIcon(type);
    const colorClass = getNodeColor(type);
    
    // Determine children based on node type
    let children: any[] = [];
    let childType = '';
    
    if (type === 'exam') {
      children = node.classes || node.subjects || [];
      childType = node.classes?.length > 0 ? 'class' : 'subject';
    } else if (type === 'class') {
      children = node.subjects || [];
      childType = 'subject';
    } else if (type === 'subject') {
      children = node.chapters || [];
      childType = 'chapter';
    } else if (type === 'chapter') {
      children = node.topics || [];
      childType = 'topic';
    } else if (type === 'topic') {
      children = node.concepts || [];
      childType = 'concept';
    }

    const hasChildren = children && children.length > 0;
    const isExpanded = expandedNodes.has(nodeId);

    return (
      <div key={nodeId} className="select-none">
        {/* Node */}
        <div
          onClick={() => hasChildren && toggleNode(nodeId)}
          className={cn(
            "flex items-center gap-2 p-2 rounded-lg transition-colors",
            hasChildren ? "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800" : "cursor-default"
          )}
          style={{ marginLeft: `${level * 24}px` }}
        >
          {/* Expand/Collapse Icon */}
          <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
            {hasChildren ? (
              isExpanded ? (
                <ChevronDown className="w-4 h-4 text-gray-400 dark:text-gray-500" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500" />
              )
            ) : (
              <div className="w-4 h-4" />
            )}
          </div>

          {/* Node Icon */}
          <div className={cn("p-1.5 rounded-md flex-shrink-0", colorClass)}>
            <Icon className="w-4 h-4" />
          </div>

          {/* Node Name */}
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100 flex-1">
            {node.name}
          </span>

          {/* Type Badge */}
          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 flex-shrink-0 capitalize">
            {type}
          </span>

          {/* Children Count */}
          {hasChildren && (
            <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
              ({children.length})
            </span>
          )}
        </div>

        {/* Children */}
        {isExpanded && hasChildren && (
          <div className="mt-1">
            {children.map((child: any) => renderNode(child, childType, level + 1))}
          </div>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Hierarchy Tree</CardTitle>
          <CardDescription>Visual representation of your content structure</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 mb-2">Error loading hierarchy tree</p>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              {(error as Error).message || 'Please try again'}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!hierarchyData || hierarchyData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Hierarchy Tree</CardTitle>
          <CardDescription>Visual representation of your content structure</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <FileText className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
            <p className="text-gray-500 dark:text-gray-400 mb-2">No hierarchy data available</p>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              Create an exam to get started
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hierarchy Tree</CardTitle>
        <CardDescription>
          Expand nodes to view the complete structure • {hierarchyData.length} exam(s)
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Legend */}
        <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Legend:</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
            {[
              { type: 'Exam', color: getNodeColor('exam') },
              { type: 'Class', color: getNodeColor('class') },
              { type: 'Subject', color: getNodeColor('subject') },
              { type: 'Chapter', color: getNodeColor('chapter') },
              { type: 'Topic', color: getNodeColor('topic') },
              { type: 'Concept', color: getNodeColor('concept') },
            ].map(({ type, color }) => (
              <div key={type} className="flex items-center gap-1.5">
                <div className={cn("w-3 h-3 rounded-sm", color)} />
                <span className="text-xs text-gray-600 dark:text-gray-400">{type}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tree */}
        <div className="space-y-1 max-h-[600px] overflow-y-auto">
          {hierarchyData.map((exam: any) => renderNode(exam, 'exam', 0))}
        </div>
      </CardContent>
    </Card>
  );
}

