'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Sun, Moon, Monitor, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

type Theme = 'light' | 'dark' | 'system';

export function AppearanceSection() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const themes = [
    {
      value: 'light' as Theme,
      label: 'Light',
      description: 'Clean and bright interface',
      icon: Sun,
    },
    {
      value: 'dark' as Theme,
      label: 'Dark',
      description: 'Easy on the eyes',
      icon: Moon,
    },
    {
      value: 'system' as Theme,
      label: 'System',
      description: 'Matches your device',
      icon: Monitor,
    },
  ];

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appearance</CardTitle>
        <CardDescription>Customize how the app looks</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Theme
          </label>
          
          {themes.map((themeOption) => {
            const Icon = themeOption.icon;
            const isSelected = theme === themeOption.value;

            return (
              <button
                key={themeOption.value}
                onClick={() => handleThemeChange(themeOption.value)}
                className={cn(
                  "w-full p-4 rounded-lg border-2 transition-all text-left",
                  isSelected
                    ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                    : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
                )}
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "p-2 rounded-lg",
                    isSelected ? "bg-primary-100 dark:bg-primary-800" : "bg-gray-100 dark:bg-gray-800"
                  )}>
                    <Icon className={cn(
                      "w-5 h-5",
                      isSelected ? "text-primary-600 dark:text-primary-400" : "text-gray-600 dark:text-gray-400"
                    )} />
                  </div>
                  
                  <div className="flex-1">
                    <p className={cn(
                      "font-medium",
                      isSelected ? "text-primary-900 dark:text-primary-100" : "text-gray-900 dark:text-gray-100"
                    )}>
                      {themeOption.label}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {themeOption.description}
                    </p>
                  </div>

                  {isSelected && (
                    <Check className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Color Scheme Preview */}
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Preview</p>
          <div className="grid grid-cols-5 gap-2">
            <div className="h-12 bg-primary-500 rounded"></div>
            <div className="h-12 bg-success-500 rounded"></div>
            <div className="h-12 bg-warning-500 rounded"></div>
            <div className="h-12 bg-error-500 rounded"></div>
            <div className="h-12 bg-secondary-500 rounded"></div>
          </div>
        </div>

        {/* Current Theme Display */}
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-sm text-blue-900 dark:text-blue-100">
            <strong>Current theme:</strong> {theme?.charAt(0).toUpperCase()}{theme?.slice(1)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}