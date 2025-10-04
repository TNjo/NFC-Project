import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Users, UserPlus, BarChart3 } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
}

export function Sidebar({ isOpen }: SidebarProps) {
  const location = useLocation();
  const pathname = location.pathname;

  const navItems = [
    { icon: BarChart3, label: 'Dashboard', path: '/admin' },
    { icon: Users, label: 'Cardholders', path: '/admin/cardholders' },
    { icon: UserPlus, label: 'Add New', path: '/admin/add' },
  ];

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-200 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 lg:static`}
    >
      <div className="flex flex-col h-full pt-20 lg:pt-4">
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map(({ icon: Icon, label, path }) => (
            <Link
              key={path}
              href={path}
              className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                pathname === path
                  ? 'bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border-l-4 border-blue-700'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              <Icon className="w-5 h-5 mr-3" />
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
}