import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Eye, TrendingUp, RefreshCw } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import { Header } from '../../components/Layout/Header';
import { Sidebar } from '../../components/Layout/Sidebar';
import { motion } from 'framer-motion';
import Head from 'next/head';
import { useRouter } from 'next/router';

export default function AdminDashboard() {
  const { state, fetchUsers, fetchAnalytics } = useApp();
  const { state: authState } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (authState.isInitialized && !authState.isAuthenticated) {
      router.push('/login');
    }
  }, [authState.isInitialized, authState.isAuthenticated, router]);

  // Show loading while checking authentication
  if (!authState.isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (!authState.isAuthenticated || !authState.user) {
    return null;
  }

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([fetchUsers(), fetchAnalytics()]);
    } finally {
      setRefreshing(false);
    }
  };

  // Build stats from analytics data or fallback to legacy data
  const analytics = state.analyticsData;
  const stats = [
    {
      label: 'Total Users',
      value: analytics?.totalUsers || state.cardholders.length,
      icon: Users,
      color: 'bg-blue-500',
      change: analytics?.growthRate || '+0%',
    },
    {
      label: 'Active Profiles',
      value: analytics?.activeUsers || state.cardholders.length,
      icon: UserPlus,
      color: 'bg-green-500',
      change: analytics?.activeUsers > 0 ? `${Math.round((analytics.activeUsers / analytics.totalUsers) * 100)}%` : '100%',
    },
    {
      label: 'Profile Views',
      value: analytics?.totalProfileViews || 0,
      icon: Eye,
      color: 'bg-purple-500',
      change: '+Live',
    },
    {
      label: 'Recent Users',
      value: analytics?.recentUsers || 0,
      icon: TrendingUp,
      color: 'bg-orange-500',
      change: 'Last 30 days',
    },
  ];

  return (
    <>
      <Head>
        <title>Admin Dashboard - NFC Digital Profile</title>
      </Head>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
          <Header onMenuClick={toggleSidebar} />
          <div className="pt-16 min-h-screen bg-gray-50 dark:bg-gray-900">
            <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
            
            <div className="lg:ml-64">
              <main className="p-3 sm:p-4 md:p-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="mb-6 md:mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div className="flex-1">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                          Admin Dashboard
                        </h1>
                        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-1">
                          Welcome back, <span className="font-semibold text-gray-900 dark:text-white">{authState.user.fullName}</span>!
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                          Manage your NFC digital profiles and track analytics
                        </p>
                        {state.isLoading && (
                          <p className="text-sm text-blue-600 dark:text-blue-400 mt-2">
                            Loading data...
                          </p>
                        )}
                      </div>
                      <button
                        onClick={handleRefresh}
                        disabled={refreshing}
                        className="flex items-center justify-center space-x-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors text-sm font-medium w-full sm:w-auto"
                      >
                        <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                        <span className="whitespace-nowrap">{refreshing ? 'Refreshing...' : 'Refresh Data'}</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
                    {stats.map((stat, index) => (
                      <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 md:p-6"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 font-medium truncate">
                              {stat.label}
                            </p>
                            <p className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mt-1">
                              {stat.value}
                            </p>
                            <p className="text-xs md:text-sm text-green-600 dark:text-green-400 mt-1 truncate">
                              {stat.change} from last month
                            </p>
                          </div>
                          <div className={`${stat.color} p-2.5 md:p-3 rounded-lg flex-shrink-0 ml-2`}>
                            <stat.icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 md:p-6"
                    >
                      <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white mb-3 md:mb-4">
                        Quick Actions
                      </h3>
                      <div className="space-y-2.5 md:space-y-3">
                        <button
                          onClick={() => router.push('/admin/add')}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 md:py-3 rounded-lg transition-colors font-medium text-sm md:text-base"
                        >
                          Add New Cardholder
                        </button>
                        <button
                          onClick={() => router.push('/admin/cardholders')}
                          className="w-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white px-4 py-2.5 md:py-3 rounded-lg transition-colors font-medium text-sm md:text-base"
                        >
                          View All Cardholders
                        </button>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 md:p-6"
                    >
                      <div className="flex items-center justify-between mb-3 md:mb-4">
                        <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white">
                          Top Viewed Cards
                        </h3>
                        <Eye className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                      </div>
                      <div className="space-y-3">
                        {analytics?.topViewedCards?.slice(0, 5).map((card: { id: string; fullName: string; companyName?: string; totalViews: number }) => (
                          <div key={card.id} className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                                {card.fullName.charAt(0)}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                  {card.fullName}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {card.companyName || 'Independent'}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="text-sm font-bold text-green-600 dark:text-green-400">
                                {card.totalViews}
                              </span>
                              <p className="text-xs text-gray-500 dark:text-gray-400">views</p>
                            </div>
                          </div>
                        )) || analytics?.recentRegistrations?.slice(0, 3).map((user: { id: string; fullName: string; emailAddress: string; companyName?: string; createdAt: { toDate: () => Date } }) => (
                          <div key={user.id} className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                                {user.fullName.charAt(0)}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                  {user.fullName}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {user.companyName || 'Independent'}
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => window.open(`/profile/${user.id}`, '_blank')}
                              className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-md hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                            >
                              View Profile
                            </button>
                          </div>
                        )) || state.cardholders.slice(0, 3).map((cardholder) => (
                          <div key={cardholder.id} className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                                {cardholder.name.charAt(0)}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                  {cardholder.name}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {cardholder.company}
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => window.open(cardholder.publicUrl, '_blank')}
                              className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-md hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                            >
                              View Card
                            </button>
                          </div>
                        ))}
                        
                        {/* View Analytics Summary */}
                        {analytics && (
                          <div className="pt-3 border-t border-gray-200 dark:border-gray-600">
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                              <strong>View Analytics:</strong>
                            </p>
                            <div className="text-xs text-gray-600 dark:text-gray-300 space-y-1">
                              <p>• {analytics.totalProfileViews} total card views</p>
                              <p>• {analytics.topViewedCards?.length || 0} cards with views</p>
                              <p>• {analytics.recentViews?.length || 0} recent views tracked</p>
                              <p>• Average: {analytics.totalUsers > 0 ? Math.round(analytics.totalProfileViews / analytics.totalUsers) : 0} views per card</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              </main>
            </div>
          </div>
        </div>
    </>
  );
}