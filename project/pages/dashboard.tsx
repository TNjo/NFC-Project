import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import {
  Eye,
  Save,
  TrendingUp,
  LogOut,
  RefreshCw,
  Share2,
} from 'lucide-react';
import { useUserAuth, withUserAuth } from '../contexts/UserAuthContext';
import { useToast } from '../contexts/ToastContext';
import {
  StatsCard,
  ProfileHeader,
  ActivityChart,
} from '../components/Dashboard';

function Dashboard() {
  const router = useRouter();
  const { state, logout, refreshAnalytics } = useUserAuth();
  const { showSuccess, showError } = useToast();
  const [refreshing, setRefreshing] = useState(false);

  const { user, analytics } = state;

  // Helper function to format Firestore timestamps
  const formatTimestamp = (timestamp: Date | { _seconds?: number; seconds?: number } | string | number | null | undefined): string => {
    if (!timestamp) return 'Never';
    
    try {
      let date: Date;
      
      // Check if it's an object (not string or number)
      if (typeof timestamp === 'object' && timestamp !== null && !(timestamp instanceof Date)) {
        // Handle Firestore Timestamp object with _seconds (serialized format)
        if ('_seconds' in timestamp && timestamp._seconds) {
          date = new Date(timestamp._seconds * 1000);
        }
        // Handle Firestore Timestamp object with seconds (standard format)
        else if ('seconds' in timestamp && timestamp.seconds) {
          date = new Date(timestamp.seconds * 1000);
        } 
        // Handle Firestore Timestamp with toDate method
        else if ('toDate' in timestamp && typeof timestamp.toDate === 'function') {
          date = timestamp.toDate();
        } else {
          date = new Date();
        }
      }
      // Handle Date object
      else if (timestamp instanceof Date) {
        date = timestamp;
      }
      // Handle ISO string or number
      else {
        date = new Date(timestamp as string | number);
      }

      // Check if date is valid
      if (isNaN(date.getTime())) {
        return 'Never';
      }

      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (error) {
      console.error('Error formatting timestamp:', error, timestamp);
      return 'Never';
    }
  };

  // Fetch analytics on mount if not already loaded
  useEffect(() => {
    if (user && !analytics) {
      refreshAnalytics();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleLogout = () => {
    logout();
    showSuccess('Logged Out', 'You have been successfully logged out.');
    router.push('/user-login');
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshAnalytics();
      showSuccess('Refreshed', 'Analytics data has been updated.');
    } catch {
      showError('Refresh Failed', 'Could not refresh analytics data.');
    } finally {
      setRefreshing(false);
    }
  };

  const handleCopyUrl = () => {
    if (analytics?.profileInfo.publicUrl) {
      navigator.clipboard.writeText(analytics.profileInfo.publicUrl);
      showSuccess('Copied!', 'Profile URL copied to clipboard.');
    }
  };

  const handleShare = async () => {
    if (analytics?.profileInfo.publicUrl) {
      if (navigator.share) {
        try {
          await navigator.share({
            title: `${analytics.profileInfo.displayName}'s Profile`,
            text: 'Check out my digital business card!',
            url: analytics.profileInfo.publicUrl,
          });
        } catch {
          // User cancelled share
        }
      } else {
        handleCopyUrl();
      }
    }
  };

  if (!analytics) {
    return (
      <>
        <Head>
          <title>Loading Dashboard - NFC Digital Profile</title>
        </Head>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Loading Your Dashboard
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Please wait while we fetch your analytics...
            </p>
          </div>
        </div>
      </>
    );
  }

  // Parse trend percentages
  const viewsTrend = parseFloat(analytics.trends.viewsChangePercent);
  const savesTrend = parseFloat(analytics.trends.savesChangePercent);
  const conversionRate = parseFloat(analytics.statistics.conversionRate);

  return (
    <>
      <Head>
        <title>Dashboard - {analytics.profileInfo.displayName}</title>
        <meta name="description" content="View your profile analytics and engagement" />
      </Head>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Top Navigation */}
        <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  My Dashboard
                </h1>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  title="Refresh analytics"
                >
                  <RefreshCw
                    className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`}
                  />
                </button>
                <button
                  onClick={handleShare}
                  className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  title="Share profile"
                >
                  <Share2 className="w-5 h-5" />
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-8">
            {/* Profile Header */}
            <ProfileHeader
              fullName={analytics.profileInfo.fullName}
              displayName={analytics.profileInfo.displayName}
              profilePicture={analytics.profileInfo.profilePicture}
              designation={analytics.profileInfo.designation}
              companyName={analytics.profileInfo.companyName}
              email={user?.email}
              publicUrl={analytics.profileInfo.publicUrl}
              urlSlug={analytics.profileInfo.urlSlug}
              backgroundColors={analytics.profileInfo.backgroundColors}
              backgroundImageUrl={analytics.profileInfo.backgroundImageUrl}
              onCopyUrl={handleCopyUrl}
            />

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatsCard
                title="Total Profile Views"
                value={analytics.statistics.totalViews.toLocaleString()}
                icon={Eye}
                trend={`${Math.abs(viewsTrend)}%`}
                trendUp={viewsTrend >= 0}
                subtitle="All time views"
                iconColor="text-blue-600 dark:text-blue-400"
                iconBgColor="bg-blue-100 dark:bg-blue-900/30"
              />

              <StatsCard
                title="Contact Saves"
                value={analytics.statistics.totalContactSaves.toLocaleString()}
                icon={Save}
                trend={`${Math.abs(savesTrend)}%`}
                trendUp={savesTrend >= 0}
                subtitle="Total saves"
                iconColor="text-green-600 dark:text-green-400"
                iconBgColor="bg-green-100 dark:bg-green-900/30"
              />

              <StatsCard
                title="Conversion Rate"
                value={`${conversionRate.toFixed(1)}%`}
                icon={TrendingUp}
                subtitle="Saves per view"
                iconColor="text-purple-600 dark:text-purple-400"
                iconBgColor="bg-purple-100 dark:bg-purple-900/30"
              />

              <StatsCard
                title="Views (7 Days)"
                value={analytics.trends.viewsLast7Days.toLocaleString()}
                icon={Eye}
                subtitle="Recent activity"
                iconColor="text-orange-600 dark:text-orange-400"
                iconBgColor="bg-orange-100 dark:bg-orange-900/30"
              />
            </div>

            {/* Activity Chart */}
            <ActivityChart
              dailyData={analytics.chartData.daily}
              weeklyData={analytics.chartData.weekly}
              monthlyData={analytics.chartData.monthly}
            />

            {/* Additional Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Quick Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  30-Day Summary
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">
                      Profile Views
                    </span>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      {analytics.trends.viewsLast30Days}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">
                      Contact Saves
                    </span>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      {analytics.trends.savesLast30Days}
                    </span>
                  </div>
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">
                        Engagement Rate
                      </span>
                      <span className="text-lg font-bold text-green-600 dark:text-green-400">
                        {analytics.trends.viewsLast30Days > 0
                          ? (
                              (analytics.trends.savesLast30Days /
                                analytics.trends.viewsLast30Days) *
                              100
                            ).toFixed(1)
                          : '0'}
                        %
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Last Activity */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Profile Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Last Viewed
                    </span>
                    <p className="text-base font-medium text-gray-900 dark:text-white mt-1">
                      {formatTimestamp(analytics.statistics.lastViewedAt)}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Last Contact Saved
                    </span>
                    <p className="text-base font-medium text-gray-900 dark:text-white mt-1">
                      {formatTimestamp(analytics.statistics.lastContactSavedAt)}
                    </p>
                  </div>
                  {analytics.profileInfo.urlSlug && (
                    <div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Profile URL
                      </span>
                      <p className="text-base font-medium text-blue-600 dark:text-blue-400 mt-1 break-all">
                        {analytics.profileInfo.urlSlug}
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-12">
          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            <p>
              © {new Date().getFullYear()} NFC Digital Profile. All rights
              reserved.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}

export default withUserAuth(Dashboard);

