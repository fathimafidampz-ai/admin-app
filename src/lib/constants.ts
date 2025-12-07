import { 
  LayoutDashboard, 
  Network, 
  Upload, 
  FileStack, 
  FolderOpen, 
  Search, 
  BarChart3, 
  Tags, 
  Settings,
  type LucideIcon
} from 'lucide-react';

interface NavigationItem {
  label: string;
  path: string;
  icon: LucideIcon;
  description: string;
}

export const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    label: 'Analytics',
    path: '/analytics',
    icon: BarChart3,
    description: 'Insights & metrics',
  },
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: LayoutDashboard,
    description: 'Overview and statistics',
  },
  {
    label: 'Create Hierarchy',
    path: '/hierarchy',
    icon: Network,
    description: 'Build content structure',
  },
  {
    label: 'Upload Questions',
    path: '/upload',
    icon: Upload,
    description: 'Add bank questions',
  },
  {
    label: 'Manage PYQ',
    path: '/pyq',
    icon: FileStack,
    description: 'Previous year questions',
  },
  {
    label: 'Upload Resources',
    path: '/resources',
    icon: FolderOpen,
    description: 'Learning materials',
  },
  {
    label: 'Browse Questions',
    path: '/browse',
    icon: Search,
    description: 'View Q-matrix',
  },
  
  {
    label: 'Tags & Search',
    path: '/tags',
    icon: Tags,
    description: 'Manage tags & filters',
  },
  {
    label: 'Settings',
    path: '/settings',
    icon: Settings,
    description: 'App preferences',
  },
];

export const EXAM_TYPES = [
  { 
    value: 'competitive', 
    label: 'Competitive Exam', 
    description: 'JEE, NEET, CAT, etc.' 
  },
  { 
    value: 'school', 
    label: 'School Exam', 
    description: 'CBSE, ICSE, State Board' 
  },
] as const;

export const RESOURCE_TYPES = [
  { value: 'video', label: 'Video', icon: '🎥' },
  { value: 'pdf', label: 'PDF Document', icon: '📄' },
  { value: 'virtual_lab', label: 'Virtual Lab', icon: '🧪' },
  { value: '3d_model', label: '3D Model', icon: '🎭' },
  { value: 'animation', label: 'Animation', icon: '✨' },
  { value: 'image', label: 'Image', icon: '🖼️' },
  { value: 'interactive', label: 'Interactive', icon: '🎮' },
  { value: 'article', label: 'Article', icon: '📰' },
  { value: 'simulation', label: 'Simulation', icon: '⚙️' },
] as const;

export const DIFFICULTY_LEVELS = [
  { value: 'easy', label: 'Easy', color: 'text-success-600' },
  { value: 'medium', label: 'Medium', color: 'text-warning-600' },
  { value: 'hard', label: 'Hard', color: 'text-error-600' },
] as const;

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5200/api';