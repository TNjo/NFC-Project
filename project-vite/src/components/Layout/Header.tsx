import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Moon, Sun, LogOut, Settings, Users, User } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import { AuthStatus } from '../Auth';

export function Header() {
  const { state: appState, toggleTheme } = useApp();
  const { state: authState, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isPublicCardView = pathname?.startsWith('/card/');

  if (isPublicCardView) {
    return null;
  }

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
            <Users className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            NFC Digital Profile
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          {/* Authentication Status */}
          <AuthStatus />
          
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            title={appState.theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          >
            {appState.theme === 'light' ? (
              <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            ) : (
              <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            )}
          </button>

          {/* Admin User Info & Actions */}
          {authState.isAuthenticated && authState.user && (
            <>
              {/* User Profile Display */}
              <div className="hidden md:flex items-center space-x-3 px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  {authState.user.profilePicture ? (
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
              <div className="md:hidden p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </div>

              {/* Settings Button (if needed) */}
              <button
                onClick={() => router.push('/admin/settings')}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                title="Admin Settings"
              >
                <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline text-sm font-medium">Sign Out</span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}