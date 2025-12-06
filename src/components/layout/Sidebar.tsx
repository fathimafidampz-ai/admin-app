'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { GraduationCap, ChevronUp, User, LogOut } from 'lucide-react';
import { NAVIGATION_ITEMS } from '@/lib/constants';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [user, setUser] = useState({ name: 'User', email: 'user@example.com' });

  // Get user from localStorage on mount
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        setUser({
          name: userData.name || 'User',
          email: userData.email || 'user@example.com'
        });
      } catch (error) {
        console.error('Error parsing user:', error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-72 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col z-30">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">EduAdmin</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Content Management</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
<nav className="flex-1 p-4 overflow-y-auto">
  <div className="space-y-1">
    {NAVIGATION_ITEMS.map((item) => {
      const isActive = pathname === item.path;

      return (
        <Link
          key={item.path}
          href={item.path}
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
            isActive
              ? "bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-medium shadow-sm"
              : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-primary-600 dark:hover:text-primary-400"
          )}
        >
          {/* Render icon directly */}
          <item.icon 
            className={
              isActive 
                ? "w-5 h-5 text-primary-600 dark:text-primary-400" 
                : "w-5 h-5 text-gray-400 dark:text-gray-500"
            }
          />
          <div className="flex-1">
            <div className="text-sm font-medium">{item.label}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{item.description}</div>
          </div>
        </Link>
      );
    })}
  </div>
</nav>

      {/* User Section */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4">
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-secondary-400 to-secondary-600 rounded-full flex items-center justify-center shadow-md">
              <span className="text-white font-semibold text-sm">
                {getInitials(user.name)}
              </span>
            </div>
            <div className="flex-1 min-w-0 text-left">
              <div className="font-medium text-gray-900 dark:text-white truncate">
                {user.name}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                {user.email}
              </div>
            </div>
            <ChevronUp className={cn(
              "w-4 h-4 text-gray-400 dark:text-gray-500 transition-transform",
              showUserMenu && "rotate-180"
            )} />
          </button>

          {/* Dropdown Menu */}
          {showUserMenu && (
            <div className="absolute bottom-full left-0 right-0 mb-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden">
              <Link
                href="/settings"
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                onClick={() => setShowUserMenu(false)}
              >
                <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <span className="text-sm text-gray-700 dark:text-gray-300">Profile Settings</span>
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-error-50 dark:hover:bg-error-900/20 transition-colors text-left"
              >
                <LogOut className="w-4 h-4 text-error-600 dark:text-error-400" />
                <span className="text-sm text-error-600 dark:text-error-400 font-medium">Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}