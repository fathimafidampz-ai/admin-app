'use client';

import { AppLayout } from '@/components/layout/AppLayout';
import { TagManager } from '@/components/tags/TagManager';
import { AdvancedFilterBuilder } from '@/components/search/AdvancedFilterBuilder';
import { SavedSearches } from '@/components/search/SavedSearches';

export default function TagsPage() {
  return (
    <AppLayout
      title="Tags & Search"
      subtitle="Manage tags and create advanced search filters"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          <TagManager />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <AdvancedFilterBuilder />
          <SavedSearches />
        </div>
      </div>
    </AppLayout>
  );
}