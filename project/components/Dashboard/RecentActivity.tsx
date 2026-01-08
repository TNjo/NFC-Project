import React from 'react';
import { motion } from 'framer-motion';
import { Eye, Save, Clock } from 'lucide-react';

interface ActivityItem {
  type: 'view' | 'save';
  timestamp: Date | { seconds: number; _seconds?: number } | string | number;
  metadata?: Record<string, unknown>;
}

interface RecentActivityProps {
  activities: ActivityItem[];
}

export const RecentActivity: React.FC<RecentActivityProps> = ({ activities }) => {
  const formatTimestamp = (timestamp: ActivityItem['timestamp']): string => {
    try {
      let date: Date;
      
      if (timestamp && typeof timestamp === 'object' && 'toDate' in timestamp) {
        date = (timestamp as { toDate: () => Date }).toDate();
      } else if (timestamp && typeof timestamp === 'object' && ('seconds' in timestamp || '_seconds' in timestamp)) {
        const seconds = (timestamp as { seconds?: number; _seconds?: number }).seconds || (timestamp as { seconds?: number; _seconds?: number })._seconds || 0;
        date = new Date(seconds * 1000);
      } else {
        date = new Date(timestamp as string | number | Date);
      }

      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;
      
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch {
      return 'Recently';
    }
  };

  if (!activities || activities.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
          <Clock className="w-5 h-5" />
          <span>Recent Activity</span>
        </h3>
        <div className="text-center py-8">
          <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 dark:text-gray-400">No recent activity yet</p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
            Activities will appear here when people view or save your profile
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
    >
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
        <Clock className="w-5 h-5" />
        <span>Recent Activity</span>
      </h3>

      <div className="space-y-3">
        {activities.map((activity, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
          >
            {/* Icon */}
            <div
              className={`flex-shrink-0 p-2 rounded-lg ${
                activity.type === 'view'
                  ? 'bg-blue-100 dark:bg-blue-900/30'
                  : 'bg-green-100 dark:bg-green-900/30'
              }`}
            >
              {activity.type === 'view' ? (
                <Eye
                  className={`w-4 h-4 ${
                    activity.type === 'view'
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-green-600 dark:text-green-400'
                  }`}
                />
              ) : (
                <Save
                  className={`w-4 h-4 ${
                    activity.type === 'save'
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-blue-600 dark:text-blue-400'
                  }`}
                />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900 dark:text-white">
                {activity.type === 'view' ? (
                  <span>
                    Someone <strong>viewed</strong> your profile
                  </span>
                ) : (
                  <span>
                    Someone <strong>saved</strong> your contact
                  </span>
                )}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {formatTimestamp(activity.timestamp)}
              </p>
            </div>

            {/* Badge */}
            <div
              className={`flex-shrink-0 px-2 py-1 rounded text-xs font-medium ${
                activity.type === 'view'
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                  : 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
              }`}
            >
              {activity.type === 'view' ? 'View' : 'Save'}
            </div>
          </motion.div>
        ))}
      </div>

      {activities.length >= 20 && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Showing last 20 activities
          </p>
        </div>
      )}
    </motion.div>
  );
};

