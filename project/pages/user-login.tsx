import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { Mail, Link as LinkIcon, Loader2, LogIn, ArrowRight, Nfc } from 'lucide-react';
import { useUserAuth } from '../contexts/UserAuthContext';

// Type definitions for Web NFC API
interface NDEFReader {
  scan: () => Promise<void>;
  addEventListener: (type: string, listener: (event: NDEFReadingEvent) => void) => void;
}

interface NDEFReadingEvent {
  message: {
    records: NDEFRecord[];
  };
  serialNumber: string;
}

interface NDEFRecord {
  recordType: string;
  data: string;
  encoding?: string;
}

declare global {
  interface Window {
    NDEFReader?: new () => NDEFReader;
  }
}

export default function UserLogin() {
  const router = useRouter();
  const { state, login } = useUserAuth();
  const [loginMethod, setLoginMethod] = useState<'email' | 'url' | 'nfc'>('email');
  const [email, setEmail] = useState('');
  const [urlSlug, setUrlSlug] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [nfcSupported, setNfcSupported] = useState(false);
  const [nfcReading, setNfcReading] = useState(false);
  const [nfcDebugInfo, setNfcDebugInfo] = useState('');

  // Check NFC support
  useEffect(() => {
    const isSecureContext = window.isSecureContext;
    const hasNDEFReader = 'NDEFReader' in window;
    const protocol = window.location.protocol;
    const userAgent = navigator.userAgent.toLowerCase();
    const isChrome = /chrome|crios|crmo/.test(userAgent) && !/edge|edg/.test(userAgent);
    const isEdge = /edge|edg/.test(userAgent);
    const isAndroid = /android/.test(userAgent);

    // Debug info
    const debugInfo = [
      `Protocol: ${protocol}`,
      `Secure Context: ${isSecureContext}`,
      `NDEFReader: ${hasNDEFReader}`,
      `Browser: ${isChrome ? 'Chrome' : isEdge ? 'Edge' : 'Other'}`,
      `Platform: ${isAndroid ? 'Android' : 'Other'}`,
    ].join(' | ');
    
    setNfcDebugInfo(debugInfo);
    console.log('NFC Check:', debugInfo);

    // NFC is supported if:
    // 1. NDEFReader API exists
    // 2. In secure context (HTTPS or localhost)
    // 3. Chrome/Edge on Android
    if (hasNDEFReader && isSecureContext) {
      setNfcSupported(true);
    } else {
      setNfcSupported(false);
    }
  }, []);

  // Redirect if already authenticated
  useEffect(() => {
    if (state.isAuthenticated && state.user) {
      router.push('/dashboard');
    }
  }, [state.isAuthenticated, state.user, router]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const success = await login({ email });

      if (success) {
        router.push('/dashboard');
      } else {
        setError(state.error || 'Login failed. Please try again.');
      }
    } catch {
      setError('An error occurred during login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUrlLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const success = await login({ urlSlug });

      if (success) {
        router.push('/dashboard');
      } else {
        setError(state.error || 'Invalid URL. Please check and try again.');
      }
    } catch {
      setError('An error occurred during login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Extract slug from profile URL
  const extractSlugFromUrl = (url: string): string | null => {
    try {
      // Pattern: https://digitalprofile.burjcodetech.com/card/slug
      // Or: /card/slug
      const match = url.match(/\/card\/([^\/\s?#]+)/);
      return match ? match[1] : null;
    } catch (error) {
      console.error('Error extracting slug:', error);
      return null;
    }
  };

  // Handle NFC tap
  const handleNfcTap = async () => {
    if (!('NDEFReader' in window)) {
      setError('NFC is not supported on this device/browser. Please use Chrome on Android.');
      return;
    }

    setNfcReading(true);
    setError('');
    setLoading(true);

    try {
      if (!window.NDEFReader) {
        throw new Error('NDEFReader not available');
      }
      
      const ndef = new window.NDEFReader();
      
      // Request permission and start reading
      await ndef.scan();
      
      console.log('NFC scan started. Please tap your card...');

      ndef.addEventListener('reading', async ({ message, serialNumber }: NDEFReadingEvent) => {
        console.log('NFC tag detected!', serialNumber);
        
        for (const record of message.records) {
          console.log('Record type:', record.recordType);
          console.log('Record data:', record.data);
          
          if (record.recordType === 'url' || record.recordType === 'text') {
            let profileUrl = '';
            
            if (record.recordType === 'url') {
              profileUrl = record.data;
            } else if (record.recordType === 'text') {
              const textDecoder = new TextDecoder(record.encoding || 'utf-8');
              profileUrl = textDecoder.decode(record.data);
            }

            console.log('Profile URL from NFC:', profileUrl);

            // Extract slug from URL
            const extractedSlug = extractSlugFromUrl(profileUrl);
            
            if (extractedSlug) {
              console.log('Extracted slug:', extractedSlug);
              setUrlSlug(extractedSlug);
              
              // Auto-login with extracted slug
              setNfcReading(false);
              const success = await login({ urlSlug: extractedSlug });
              
              if (success) {
                router.push('/dashboard');
              } else {
                setError('Could not login with this card. Please try again.');
                setLoading(false);
              }
              return;
            } else {
              setError('Could not extract profile information from the card.');
              setNfcReading(false);
              setLoading(false);
            }
          }
        }
        
        // If no valid record found
        if (!urlSlug) {
          setError('No profile URL found on this card.');
          setNfcReading(false);
          setLoading(false);
        }
      });

      ndef.addEventListener('readingerror', () => {
        setError('Error reading NFC card. Please try again.');
        setNfcReading(false);
        setLoading(false);
      });

    } catch (error) {
      console.error('NFC Error:', error);
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          setError('NFC permission denied. Please allow NFC access and try again.');
        } else if (error.name === 'NotSupportedError') {
          setError('NFC is not supported on this device.');
        } else {
          setError('Error accessing NFC. Please try again.');
        }
      } else {
        setError('Error accessing NFC. Please try again.');
      }
      setNfcReading(false);
      setLoading(false);
    }
  };

  const cancelNfcReading = () => {
    setNfcReading(false);
    setLoading(false);
    setError('');
  };

  if (state.isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>User Login - NFC Digital Profile</title>
        <meta name="description" content="Login to view your profile analytics" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Logo/Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              className="inline-block p-4 bg-blue-600 rounded-full mb-4"
            >
              <LogIn className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Login to view your profile analytics
            </p>
          </div>

          {/* Login Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Method Selector */}
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setLoginMethod('email')}
                className={`flex-1 py-4 px-3 font-medium transition-colors ${
                  loginMethod === 'email'
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                }`}
              >
                <Mail className="w-5 h-5 inline-block mr-1" />
                <span className="text-sm">Email</span>
              </button>
              <button
                onClick={() => setLoginMethod('url')}
                className={`flex-1 py-4 px-3 font-medium transition-colors ${
                  loginMethod === 'url'
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                }`}
              >
                <LinkIcon className="w-5 h-5 inline-block mr-1" />
                <span className="text-sm">URL</span>
              </button>
              <button
                onClick={() => setLoginMethod('nfc')}
                className={`flex-1 py-4 px-3 font-medium transition-colors ${
                  loginMethod === 'nfc'
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                }`}
              >
                <Nfc className="w-5 h-5 inline-block mr-1" />
                <span className="text-sm">Tap Me</span>
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mx-6 mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
              >
                <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
              </motion.div>
            )}

            {/* Login Forms */}
            <div className="p-6">
              {loginMethod === 'nfc' ? (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="mb-4">
                      <motion.div
                        animate={nfcReading ? { scale: [1, 1.1, 1] } : {}}
                        transition={{ repeat: nfcReading ? Infinity : 0, duration: 1.5 }}
                        className={`inline-flex items-center justify-center w-24 h-24 rounded-full ${
                          nfcReading
                            ? 'bg-blue-100 dark:bg-blue-900/30'
                            : 'bg-gray-100 dark:bg-gray-700'
                        }`}
                      >
                        <Nfc
                          className={`w-12 h-12 ${
                            nfcReading
                              ? 'text-blue-600 dark:text-blue-400'
                              : 'text-gray-400'
                          }`}
                        />
                      </motion.div>
                    </div>
                    
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {nfcReading ? 'Ready to Scan' : 'Tap Your NFC Card'}
                    </h3>
                    
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      {nfcReading
                        ? 'Hold your NFC card near your device to login automatically'
                        : 'Tap your digital business card to login instantly'}
                    </p>

                    {!nfcReading ? (
                      <button
                        onClick={handleNfcTap}
                        disabled={loading}
                        className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-blue-400 disabled:to-purple-400 text-white font-bold text-lg rounded-lg transition-colors flex items-center justify-center space-x-3 disabled:cursor-not-allowed shadow-lg"
                      >
                        <Nfc className="w-6 h-6" />
                        <span>TAP ME</span>
                      </button>
                    ) : (
                      <button
                        onClick={cancelNfcReading}
                        className="w-full py-3 px-4 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                    )}

                    {!nfcSupported && (
                      <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                        <p className="text-sm text-yellow-800 dark:text-yellow-200 mb-2">
                          ⚠️ <strong>NFC Not Available</strong><br />
                          {window.location.protocol === 'http:' && window.location.hostname !== 'localhost' && (
                            <span className="block mt-2">
                              <strong>Issue:</strong> NFC requires HTTPS (secure connection).
                              <br />
                              <strong>Solution:</strong> Deploy your app with HTTPS to use NFC login.
                            </span>
                          )}
                          {window.location.protocol === 'http:' && window.location.hostname === 'localhost' && (
                            <span className="block mt-2">
                              <strong>Issue:</strong> Your browser doesn&apos;t support Web NFC API.
                              <br />
                              <strong>Solution:</strong> Use Chrome or Edge on Android, or try Email/URL login.
                            </span>
                          )}
                          {window.location.protocol === 'https:' && !('NDEFReader' in window) && (
                            <span className="block mt-2">
                              <strong>Issue:</strong> Web NFC API not available.
                              <br />
                              <strong>Solution:</strong> Use Chrome or Edge on Android device.
                            </span>
                          )}
                        </p>
                        <details className="mt-2">
                          <summary className="text-xs cursor-pointer hover:underline">Debug Info</summary>
                          <pre className="text-xs mt-1 bg-white dark:bg-gray-800 p-2 rounded overflow-x-auto">
                            {nfcDebugInfo}
                          </pre>
                        </details>
                      </div>
                    )}
                    
                    {nfcSupported && (
                      <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <p className="text-sm text-blue-800 dark:text-blue-200">
                          💡 <strong>Tips:</strong>
                          <br />• Make sure NFC is enabled in your phone settings
                          <br />• Using Chrome or Edge browser on Android
                          <br />• Hold the card close to the back of your phone
                          <br />• Remove any thick phone case if needed
                        </p>
                      </div>
                    )}
                    
                    <div className="mt-4 text-center">
                      <button
                        onClick={() => setLoginMethod('url')}
                        className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        Can&apos;t scan? Use URL login instead →
                      </button>
                    </div>
                  </div>
                </div>
              ) : loginMethod === 'email' ? (
                <form onSubmit={handleEmailLogin} className="space-y-6">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="your.email@example.com"
                        disabled={loading}
                      />
                    </div>
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      Enter the email address associated with your profile
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !email}
                    className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors flex items-center justify-center space-x-2 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Logging in...</span>
                      </>
                    ) : (
                      <>
                        <span>Continue with Email</span>
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleUrlLogin} className="space-y-6">
                  <div>
                    <label
                      htmlFor="urlSlug"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Your Profile URL Slug
                    </label>
                    <div className="relative">
                      <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        id="urlSlug"
                        value={urlSlug}
                        onChange={(e) => setUrlSlug(e.target.value)}
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="your-unique-slug"
                        disabled={loading}
                      />
                    </div>
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      Enter your unique profile URL identifier
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !urlSlug}
                    className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors flex items-center justify-center space-x-2 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Logging in...</span>
                      </>
                    ) : (
                      <>
                        <span>Continue with URL</span>
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 pb-6 pt-2">
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Don&apos;t have access?{' '}
                  <a
                    href="mailto:support@example.com"
                    className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                  >
                    Contact Support
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Admin Login Link */}
          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Admin? Login here →
            </Link>
          </div>
        </motion.div>
      </div>
    </>
  );
}

