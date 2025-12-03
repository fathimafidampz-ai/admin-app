'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ExternalLink, Github, Mail, Globe } from 'lucide-react';

export function AboutSection() {
  const appInfo = {
    name: 'EduAdmin',
    version: '1.0.0',
    buildDate: '2024-11-30',
    description: 'Comprehensive Content Management System for Educational Technology',
    developer: 'ZYRA EduTech Pvt Ltd',
    website: 'https://zyra-edutech.com',
    email: 'support@zyra-edutech.com',
    github: 'https://github.com/zyra-edutech',
  };

  const features = [
    'Hierarchical content management',
    'Question bank with 3PL parameters',
    'Bulk question upload',
    'Resource management',
    'Advanced analytics',
    'Multi-language support',
    'Responsive design',
    'Export & import capabilities',
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>About EduAdmin</CardTitle>
        <CardDescription>Application information and resources</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* App Info */}
        <div>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-2xl">EA</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{appInfo.name}</h3>
              <p className="text-sm text-gray-600">Version {appInfo.version}</p>
            </div>
          </div>
          <p className="text-gray-700 mb-4">{appInfo.description}</p>
        </div>

        {/* Developer Info */}
<div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Developer</h4>
  <div className="space-y-2 text-sm">
    <div className="flex items-center gap-2">
      <Globe className="w-4 h-4 text-gray-500 dark:text-gray-400" />
      <span className="text-gray-700 dark:text-gray-300">{appInfo.developer}</span>
    </div>
    <div className="flex items-center gap-2">
      <Mail className="w-4 h-4 text-gray-500 dark:text-gray-400" />
      <a href={`mailto:${appInfo.email}`} className="text-primary-600 dark:text-primary-400 hover:underline">
        {appInfo.email}
      </a>
    </div>
    <div className="flex items-center gap-2">
      <ExternalLink className="w-4 h-4 text-gray-500 dark:text-gray-400" />
      <a href={appInfo.website} target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">
        {appInfo.website}
      </a>
    </div>
    <div className="flex items-center gap-2">
      <Github className="w-4 h-4 text-gray-500 dark:text-gray-400" />
      <a href={appInfo.github} target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">
        GitHub Repository
      </a>
    </div>
  </div>
</div>

       {/* Features */}
<div>
  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Key Features</h4>
  <div className="grid grid-cols-2 gap-2">
    {features.map((feature, index) => (
      <div key={index} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
        <div className="w-1.5 h-1.5 bg-primary-500 dark:bg-primary-400 rounded-full"></div>
        {feature}
      </div>
    ))}
  </div>
</div>

        {/* Build Info */}
<div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
  <div className="grid grid-cols-2 gap-4 text-sm">
    <div>
      <p className="text-blue-700 dark:text-blue-300 font-medium">Version</p>
      <p className="text-blue-900 dark:text-blue-100">{appInfo.version}</p>
    </div>
    <div>
      <p className="text-blue-700 dark:text-blue-300 font-medium">Build Date</p>
      <p className="text-blue-900 dark:text-blue-100">{appInfo.buildDate}</p>
    </div>
  </div>
</div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1">
            <ExternalLink className="w-4 h-4 mr-2" />
            Documentation
          </Button>
          <Button variant="outline" className="flex-1">
            <Github className="w-4 h-4 mr-2" />
            View on GitHub
          </Button>
        </div>

        {/* Legal */}
        <div className="text-center pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            © 2024 ZYRA EduTech Pvt Ltd. All rights reserved.
          </p>
          <div className="flex justify-center gap-4 mt-2">
            <a href="#" className="text-xs text-gray-500 hover:text-primary-600">Privacy Policy</a>
            <a href="#" className="text-xs text-gray-500 hover:text-primary-600">Terms of Service</a>
            <a href="#" className="text-xs text-gray-500 hover:text-primary-600">License</a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}