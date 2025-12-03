export const NAVIGATION_ITEMS = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: 'LayoutDashboard',
    description: 'Overview and statistics',
  },
  {
    id: 'hierarchy',
    label: 'Create Hierarchy',
    path: '/hierarchy',
    icon: 'Network',
    description: 'Build content structure',
  },
  {
    id: 'questions',
    label: 'Upload Questions',
    path: '/questions',
    icon: 'FileQuestion',
    description: 'Add bank questions',
  },
  {
    id: 'pyq',  // Add this entire block
    label: 'Manage PYQ',
    path: '/pyq',
    icon: 'FileText',
    description: 'Previous year questions',
  },
  {
    id: 'resources',
    label: 'Upload Resources',
    path: '/resources',
    icon: 'FolderOpen',
    description: 'Learning materials',
  },
  {
    id: 'browse',
    label: 'Browse Questions',
    path: '/browse',
    icon: 'Search',
    description: 'View Q-matrix',
  },

  {
    id: 'analytics',  // ADD THIS
    label: 'Analytics',
    path: '/analytics',
    icon: 'BarChart3',
    description: 'Insights & metrics',
  },
  {
    id: 'tags',  // ADD THIS
    label: 'Tags & Search',
    path: '/tags',
    icon: 'Tag',
    description: 'Manage tags & filters',
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