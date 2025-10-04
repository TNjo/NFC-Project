import React, { useState, useEffect } from 'react';
import { LogIn, Users, KeyRound } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import Head from 'next/head';

export default function Login() {
  const { emailLogin, state } = useAuth();
  const { showError, showSuccess } = useToast();
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (state.isInitialized && state.isAuthenticated) {
      router.push('/admin');
    }
  }, [state.isInitialized, state.isAuthenticated, router]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await emailLogin(formData.email, formData.password);
      if (success) {
        showSuccess('Login Successful', 'Welcome to NFC Digital Profile Admin');
        router.push('/admin');
      } else {
        showError('Login Failed', state.error || 'Invalid email or password');
      }
    } catch {
      showError('Login Error', 'An unexpected error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading while initializing
  if (!state.isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Admin Login - NFC Digital Profile</title>
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-md w-full"
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center mx-auto mb-4"
              >
                {<Users className="w-8 h-8 text-white" />}
              </motion.div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Admin Login
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Sign in to manage your NFC digital profiles
              </p>
            </div>


            {/* Email/Password Form */}
            <form onSubmit={handleEmailLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter your password"
                />
              </div>

              {state.error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg"
                >
                  <p className="text-sm text-red-600 dark:text-red-400">{state.error}</p>
                </motion.div>
              )}

              <button
                type="submit"
                disabled={isLoading || state.isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded-lg transition-colors font-medium flex items-center justify-center space-x-2"
              >
                <LogIn className="w-4 h-4" />
                <span>
                  {(isLoading || state.isLoading) ? 'Signing in...' : 'Sign In'}
                </span>
              </button>
            </form>

            {(
              <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <KeyRound className="w-4 h-4 inline mr-2" />
                  Authentication Methods:
                </h3>
                <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                    <div>
                      <p className="font-medium">Email & Password</p>
                      <p className="text-xs">Secure login with email and password</p>
                    </div>
                  </div>
                </div>
                <div className="mt-3 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded border border-yellow-200 dark:border-yellow-700">
                  <p className="text-xs font-medium text-yellow-800 dark:text-yellow-200 mb-1">
                    🔒 Admin Access Only
                  </p>
                  <p className="text-xs text-yellow-700 dark:text-yellow-300">
                    Only authorized administrators can access this system. Contact your system administrator for access.
                  </p>
                </div>
              </div>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-center mt-6"
          >
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Powered by Burj Code Technologies
            </p>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}