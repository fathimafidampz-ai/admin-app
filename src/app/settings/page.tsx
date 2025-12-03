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
  Info 
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
      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="w-64 flex-shrink-0">
          <div className="sticky top-6 space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left",
                    isActive
                      ? "bg-primary-100 text-primary-700 font-medium shadow-sm"
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                >
                  <Icon className={cn(
                    "w-5 h-5",
                    isActive ? "text-primary-600" : "text-gray-500"
                  )} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-6">
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
