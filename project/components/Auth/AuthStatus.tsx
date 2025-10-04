import React from 'react';
import { CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function AuthStatus() {
  const { state } = useAuth();

  if (!state.isInitialized) {
    return (
      <div className="flex items-center space-x-2 px-3 py-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
        <Clock className="w-4 h-4 text-yellow-600 dark:text-yellow-400 animate-spin" />
        <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
          Initializing...
        </span>
      </div>
    );
  }

  if (state.isLoading) {
    return (
      <div className="flex items-center space-x-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400 animate-spin" />
        <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
          Authenticating...
        </span>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="flex items-center space-x-2 px-3 py-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
        <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
        <span className="text-sm font-medium text-red-800 dark:text-red-200">
          Auth Error
        </span>
      </div>
    );
  }

  if (state.isAuthenticated && state.user) {
    return (
      <div className="flex items-center space-x-2 px-3 py-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
        <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
        <span className="text-sm font-medium text-green-800 dark:text-green-200">
          Authenticated
        </span>
        <span className="text-xs text-green-600 dark:text-green-400">
          ({state.user.authProvider})
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2 px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
      <XCircle className="w-4 h-4 text-gray-600 dark:text-gray-400" />
      <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
        Not Authenticated
      </span>
    </div>
  );
}
