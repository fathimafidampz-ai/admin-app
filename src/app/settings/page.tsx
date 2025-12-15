'use client';

import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/Button';
import {
  ProfileSection,
  AppearanceSection,
  PreferencesSection,
  DataManagementSection,
  AboutSection,
} from '@/components/settings';
import {
  User,
  Palette,
  Settings as SettingsIcon,
  Database,
  Info,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type Tab = 'profile' | 'appearance' | 'preferences' | 'data' | 'about';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('profile');

  const tabs = [
    { id: 'profile' as Tab, label: 'Profile', icon: User },
    { id: 'appearance' as Tab, label: 'Appearance', icon: Palette },
    { id: 'preferences' as Tab, label: 'Preferences', icon: SettingsIcon },
    { id: 'data' as Tab, label: 'Data Management', icon: Database },
    { id: 'about' as Tab, label: 'About', icon: Info },
  ];

  return (
    <AppLayout
      title="Settings"
      subtitle="Manage your account and preferences"
    >
      {/* flex-col on mobile, row from md up */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full md:w-64 md:flex-shrink-0">
          {/* sticky only on md+ so it doesn’t eat space on small screens */}
          <div className="md:sticky md:top-6 space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left',
                    isActive
                      ? 'bg-primary-100 text-primary-700 font-medium shadow-sm dark:bg-primary-500/15 dark:text-primary-100'
                      : 'text-gray-700 hover:bg-sky-100 dark:text-gray-300 dark:hover:bg-sky-500/20'
                  )}
                >
                  <Icon
                    className={cn(
                      'w-5 h-5',
                      isActive
                        ? 'text-primary-600 dark:text-primary-300'
                        : 'text-gray-500 dark:text-gray-400'
                    )}
                  />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-6 mt-4 md:mt-0">
          {activeTab === 'profile' && <ProfileSection />}
          {activeTab === 'appearance' && <AppearanceSection />}
          {activeTab === 'preferences' && <PreferencesSection />}
          {activeTab === 'data' && <DataManagementSection />}
          {activeTab === 'about' && <AboutSection />}
        </div>
      </div>
    </AppLayout>
  );
}
