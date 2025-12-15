'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

export function PreferencesSection() {
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: false,
    weeklyReport: true,
    soundEffects: true,
    autoSave: true,
    compactView: false,
  });

  const togglePreference = (key: keyof typeof preferences) => {
    setPreferences({
      ...preferences,
      [key]: !preferences[key],
    });
    console.log('Preference updated:', key, !preferences[key]);
  };

  const preferenceItems = [
    {
      key: 'emailNotifications' as const,
      label: 'Email Notifications',
      description: 'Receive email updates about important events',
    },
    {
      key: 'pushNotifications' as const,
      label: 'Push Notifications',
      description: 'Get browser notifications for new updates',
    },
    {
      key: 'weeklyReport' as const,
      label: 'Weekly Report',
      description: 'Receive weekly summary of activities',
    },
    {
      key: 'soundEffects' as const,
      label: 'Sound Effects',
      description: 'Play sounds for actions and notifications',
    },
    {
      key: 'autoSave' as const,
      label: 'Auto Save',
      description: 'Automatically save changes while editing',
    },
    {
      key: 'compactView' as const,
      label: 'Compact View',
      description: 'Use condensed layout for better space usage',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Preferences</CardTitle>
        <CardDescription>Manage your app preferences</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {preferenceItems.map((item) => (
            <div
            
              key={item.key}
              className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-blue-900 transition-colors"
            >
              <div className="flex-1">
                <p className="font-medium text-gray-900">{item.label}</p>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>

              {/* Toggle Switch */}
              <button
                onClick={() => togglePreference(item.key)}
                className={cn(
                  "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
                  preferences[item.key] ? "bg-primary-600" : "bg-gray-200"
                )}
              >
                <span
                  className={cn(
                    "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                    preferences[item.key] ? "translate-x-6" : "translate-x-1"
                  )}
                />
              </button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}