import React from 'react';
import { Users, UserPlus, BarChart3 } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { icon: BarChart3, label: 'Dashboard', path: '/admin' },
    { icon: Users, label: 'Cardholders', path: '/admin/cardholders' },
    { icon: UserPlus, label: 'Add New', path: '/admin/add' },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside
        className={`fixed left-0 z-30 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 top-16 bottom-0 overflow-y-auto`}
      >
        <div className="flex flex-col min-h-full">
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navItems.map(({ icon: Icon, label, path }) => (
              <Link
                key={path}
                href={path}
                onClick={() => onClose?.()}
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
    </>
  );
}