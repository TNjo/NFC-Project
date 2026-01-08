import React from 'react';
import { Moon, Sun, LogOut, Users, User, Menu } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import { AuthStatus } from '../Auth';
import { useRouter, usePathname } from 'next/navigation';

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { state: appState, toggleTheme } = useApp();
  const { state: authState, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const isPublicCardView = pathname?.startsWith('/card/');

  if (isPublicCardView) {
    return null;
  }

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-3 sm:px-4 py-3 sm:py-4 fixed top-0 left-0 right-0 z-40">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Mobile Menu Button */}
          {onMenuClick && (
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title="Toggle menu"
            >
              <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          )}
          
          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center flex-shrink-0">
            <Users className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <h1 className="text-base sm:text-xl font-bold text-gray-900 dark:text-white truncate">
            NFC Digital Profile
          </h1>
        </div>

        <div className="flex items-center space-x-1.5 sm:space-x-2 md:space-x-4">
          {/* Authentication Status - Hidden on mobile */}
          <div className="hidden md:block">
            <AuthStatus />
          </div>
          
          {/* Theme Toggle - Always visible */}
          <button
            onClick={toggleTheme}
            className="p-1.5 sm:p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex-shrink-0"
            title={appState.theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          >
            {appState.theme === 'light' ? (
              <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400" />
            ) : (
              <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400" />
            )}
          </button>

          {/* Admin User Info & Actions */}
          {authState.isAuthenticated && authState.user && (
            <>
              {/* User Profile Display - Desktop only */}
              <div className="hidden md:flex items-center space-x-3 px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  {authState.user.profilePicture ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img 
                      src={authState.user.profilePicture} 
                      alt={authState.user.fullName}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-white text-sm font-bold">
                      {authState.user.fullName.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {authState.user.fullName}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {authState.user.role} • {authState.user.authProvider}
                  </p>
                </div>
              </div>

              {/* Mobile User Icon */}
              <div className="md:hidden p-1.5 sm:p-2 bg-gray-50 dark:bg-gray-800 rounded-lg flex-shrink-0">
                <User className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400" />
              </div>

              {/* Logout Button - Always visible with icon only on mobile */}
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors flex-shrink-0"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline text-xs sm:text-sm font-medium">Sign Out</span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}