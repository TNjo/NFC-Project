import React, { useState, useEffect } from 'react';
import { Save, ArrowLeft, Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { Header } from '../../components/Layout/Header';
import { Sidebar } from '../../components/Layout/Sidebar';
import { motion } from 'framer-motion';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { apiMethods } from '../../config/api';

// Standard prefix options following common business practices
const PREFIX_OPTIONS = [
  { value: '', label: 'Select prefix (optional)' },
  { value: 'Mr.', label: 'Mr.' },
  { value: 'Mrs.', label: 'Mrs.' },
  { value: 'Ms.', label: 'Ms.' },
  { value: 'Miss', label: 'Miss' },
  { value: 'Dr.', label: 'Dr.' },
  { value: 'Prof.', label: 'Prof.' },
  { value: 'Rev.', label: 'Rev.' },
  { value: 'Hon.', label: 'Hon.' },
  { value: 'Capt.', label: 'Capt.' },
  { value: 'Maj.', label: 'Maj.' },
  { value: 'Col.', label: 'Col.' },
  { value: 'Gen.', label: 'Gen.' },
] as const;

export default function AddCardholderForm() {
  const { state: authState } = useAuth();
  const { showSuccess, showError } = useToast();
  const router = useRouter();
  const [sidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Comprehensive form data matching Firebase function schema - moved before early returns
  const [formData, setFormData] = useState({
    // Basic Information
    prefixes: '',
    profilePicture: '',
    fullName: '',
    displayName: '',
    cardPrintName: '',
    
    // Contact Information
    primaryContactNumber: '',
    secondaryContactNumber: '',
    whatsappNumber: '',
    emailAddress: '',
    
    // Professional Information
    designation: '',
    companyName: '',
    companyWebsiteUrl: '',
    companyLocation: '',
    
    // Social Media Profiles
    linkedinProfile: '',
    instagramProfile: '',
    facebookProfile: '',
    twitterProfile: '',
    personalWebsite: '',
    
    // Business Information
    googleReviewLink: '',
    businessContact: '',
    businessEmailAddress: '',
  });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate required fields
      if (!formData.fullName || !formData.displayName || !formData.cardPrintName || 
          !formData.primaryContactNumber || !formData.emailAddress) {
        throw new Error('Please fill in all required fields');
      }

      // Call Firebase Cloud Function
      const response = await apiMethods.createUser(formData);

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create user');
      }

      const publicUrl = result.publicUrl || `${window.location.origin}/card/${result.slug}`;
      
      // Show success toast with card URL
      showSuccess(
        'User Created Successfully!', 
        `Cardholder has been created. Card URL: ${publicUrl}`
      );
      
      // Reset form
      setFormData({
        prefixes: '', profilePicture: '', fullName: '', displayName: '', cardPrintName: '',
        primaryContactNumber: '', secondaryContactNumber: '', whatsappNumber: '', emailAddress: '',
        designation: '', companyName: '', companyWebsiteUrl: '', companyLocation: '',
        linkedinProfile: '', instagramProfile: '', facebookProfile: '', twitterProfile: '', personalWebsite: '',
        googleReviewLink: '', businessContact: '', businessEmailAddress: '',
      });

      // Redirect after success
      setTimeout(() => {
        router.push('/admin/cardholders');
      }, 2000);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      showError('Failed to Create User', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <>
      <Head>
        <title>Add Cardholder - NFC Digital Profile</title>
      </Head>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
          <Header />
          <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
            <Sidebar isOpen={sidebarOpen} />
            
            <div className="flex-1 flex flex-col overflow-hidden lg:ml-5">
              <main className="flex-1 overflow-y-auto p-4 pl-2">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="max-w-4xl mx-auto"
                >
                  <div className="mb-6">
                    <button
                      onClick={() => router.back()}
                      className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-4"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back to Dashboard</span>
                    </button>
                    
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                      Add New Cardholder
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                      Create a new NFC business card profile
                    </p>
                  </div>

                  {/* Error and Success Messages */}
                  {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
                      <p className="text-red-800 dark:text-red-200">{error}</p>
                    </div>
                  )}
                  

                  <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Basic Information */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                        Basic Information
                      </h2>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label 
                            htmlFor="prefixes-select"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                          >
                            Prefix
                          </label>
                          <div className="relative">
                            <select
                              id="prefixes-select"
                              value={formData.prefixes}
                              onChange={(e) => handleInputChange('prefixes', e.target.value)}
                              className="w-full px-4 py-3 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white appearance-none cursor-pointer"
                              aria-describedby="prefixes-help"
                            >
                              {PREFIX_OPTIONS.map((option) => (
                                <option 
                                  key={option.value} 
                                  value={option.value}
                                  className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                >
                                  {option.label}
                                </option>
                              ))}
                            </select>
                            {/* Custom dropdown arrow */}
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                              <svg 
                                className="w-5 h-5 text-gray-400 dark:text-gray-500" 
                                xmlns="http://www.w3.org/2000/svg" 
                                viewBox="0 0 20 20" 
                                fill="currentColor"
                                aria-hidden="true"
                              >
                                <path 
                                  fillRule="evenodd" 
                                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" 
                                  clipRule="evenodd" 
                                />
                              </svg>
                            </div>
                          </div>
                          <p id="prefixes-help" className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            Choose an appropriate title/prefix for the business card
                          </p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Profile Picture URL
                          </label>
                          <input
                            type="url"
                            value={formData.profilePicture}
                            onChange={(e) => handleInputChange('profilePicture', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder="https://example.com/photo.jpg"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.fullName}
                            onChange={(e) => handleInputChange('fullName', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder="Enter full name"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Display Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.displayName}
                            onChange={(e) => handleInputChange('displayName', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder="Name to display in contact card"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Card Print Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.cardPrintName}
                            onChange={(e) => handleInputChange('cardPrintName', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder="Name to be printed on card"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                        Contact Information
                      </h2>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Primary Contact Number *
                          </label>
                          <input
                            type="tel"
                            required
                            value={formData.primaryContactNumber}
                            onChange={(e) => handleInputChange('primaryContactNumber', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder="+1234567890"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Secondary Contact Number
                          </label>
                          <input
                            type="tel"
                            value={formData.secondaryContactNumber}
                            onChange={(e) => handleInputChange('secondaryContactNumber', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder="+0987654321"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            WhatsApp Number
                          </label>
                          <input
                            type="tel"
                            value={formData.whatsappNumber}
                            onChange={(e) => handleInputChange('whatsappNumber', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder="+1234567890"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Email Address *
                          </label>
                          <input
                            type="email"
                            required
                            value={formData.emailAddress}
                            onChange={(e) => handleInputChange('emailAddress', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder="john.doe@example.com"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Professional Information */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                        Professional Information
                      </h2>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Designation
                          </label>
                          <input
                            type="text"
                            value={formData.designation}
                            onChange={(e) => handleInputChange('designation', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder="Software Engineer, Manager, etc."
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Company Name
                          </label>
                          <input
                            type="text"
                            value={formData.companyName}
                            onChange={(e) => handleInputChange('companyName', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder="Company name"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Company Website URL
                          </label>
                          <input
                            type="url"
                            value={formData.companyWebsiteUrl}
                            onChange={(e) => handleInputChange('companyWebsiteUrl', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder="https://company.com"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Company Location
                          </label>
                          <input
                            type="text"
                            value={formData.companyLocation}
                            onChange={(e) => handleInputChange('companyLocation', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder="City, Country"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Social Media Profiles */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                        Social Media Profiles
                      </h2>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            LinkedIn Profile
                          </label>
                          <input
                            type="url"
                            value={formData.linkedinProfile}
                            onChange={(e) => handleInputChange('linkedinProfile', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder="https://linkedin.com/in/username"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Instagram Profile
                          </label>
                          <input
                            type="url"
                            value={formData.instagramProfile}
                            onChange={(e) => handleInputChange('instagramProfile', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder="https://instagram.com/username"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Facebook Profile
                          </label>
                          <input
                            type="url"
                            value={formData.facebookProfile}
                            onChange={(e) => handleInputChange('facebookProfile', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder="https://facebook.com/username"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Twitter Profile
                          </label>
                          <input
                            type="url"
                            value={formData.twitterProfile}
                            onChange={(e) => handleInputChange('twitterProfile', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder="https://twitter.com/username"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Personal Website/Portfolio
                          </label>
                          <input
                            type="url"
                            value={formData.personalWebsite}
                            onChange={(e) => handleInputChange('personalWebsite', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder="https://yourwebsite.com"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Business Information */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                        Business Information
                      </h2>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Google Review Link
                          </label>
                          <input
                            type="url"
                            value={formData.googleReviewLink}
                            onChange={(e) => handleInputChange('googleReviewLink', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder="https://g.page/r/business123/review"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Business Contact
                          </label>
                          <input
                            type="tel"
                            value={formData.businessContact}
                            onChange={(e) => handleInputChange('businessContact', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder="+1122334455"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Business Email Address
                          </label>
                          <input
                            type="email"
                            value={formData.businessEmailAddress}
                            onChange={(e) => handleInputChange('businessEmailAddress', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder="business@company.com"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-4">
                      <button
                        type="button"
                        onClick={() => router.back()}
                        disabled={loading}
                        className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors font-medium flex items-center space-x-2 disabled:cursor-not-allowed"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Creating User...</span>
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4" />
                            <span>Create User</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </motion.div>
              </main>
            </div>
          </div>
        </div>
    </>
  );
}