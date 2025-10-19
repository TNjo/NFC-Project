import React, { useState, useEffect } from 'react';
import { Save, Eye, ArrowLeft, Loader2 } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useToast } from '../contexts/ToastContext';
import { Header } from '../components/Layout/Header';
import { Sidebar } from '../components/Layout/Sidebar';
import { Cardholder } from '../types';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import Head from 'next/head';

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

export default function ProfileSettings() {
  const { state, updateCardholder } = useApp();
  const { showSuccess, showError } = useToast();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cardholder, setCardholder] = useState<Cardholder | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);
  
  // Comprehensive form data matching add page
  const [formData, setFormData] = useState({
    // Basic Information
    prefixes: '',
    profilePicture: '',
    profilePictureBase64: '',
    backgroundImageUrl: '',
    backgroundColors: '',
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

  useEffect(() => {
    // Get cardholder ID from URL query parameter or current user
    const cardholderId = router.query.id as string || state.currentUser?.cardholderId;
    
    if (cardholderId) {
      // Try to find comprehensive user data first
      const comprehensiveUser = state.comprehensiveUsers.find(u => u.id === cardholderId);
      const userCardholder = state.cardholders.find(ch => ch.id === cardholderId);
      
      if (userCardholder) {
        setCardholder(userCardholder);
        
        // Populate form with comprehensive data if available, else fall back to legacy
        if (comprehensiveUser) {
          setFormData({
            prefixes: comprehensiveUser.prefixes || '',
            profilePicture: comprehensiveUser.profilePicture || '',
            profilePictureBase64: comprehensiveUser.profilePictureBase64 || '',
            backgroundImageUrl: comprehensiveUser.backgroundImageUrl || '',
            backgroundColors: comprehensiveUser.backgroundColors || '',
            fullName: comprehensiveUser.fullName || '',
            displayName: comprehensiveUser.displayName || '',
            cardPrintName: comprehensiveUser.cardPrintName || '',
            primaryContactNumber: comprehensiveUser.primaryContactNumber || '',
            secondaryContactNumber: comprehensiveUser.secondaryContactNumber || '',
            whatsappNumber: comprehensiveUser.whatsappNumber || '',
            emailAddress: comprehensiveUser.emailAddress || '',
            designation: comprehensiveUser.designation || '',
            companyName: comprehensiveUser.companyName || '',
            companyWebsiteUrl: comprehensiveUser.companyWebsiteUrl || '',
            companyLocation: comprehensiveUser.companyLocation || '',
            linkedinProfile: comprehensiveUser.linkedinProfile || '',
            instagramProfile: comprehensiveUser.instagramProfile || '',
            facebookProfile: comprehensiveUser.facebookProfile || '',
            twitterProfile: comprehensiveUser.twitterProfile || '',
            personalWebsite: comprehensiveUser.personalWebsite || '',
            googleReviewLink: comprehensiveUser.googleReviewLink || '',
            businessContact: comprehensiveUser.businessContact || '',
            businessEmailAddress: comprehensiveUser.businessEmailAddress || '',
          });
        }
      }
    }
  }, [router.query.id, state.currentUser, state.cardholders, state.comprehensiveUsers, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardholder) return;
    
    setLoading(true);
    setError('');

    try {
      // Validate required fields
      if (!formData.fullName || !formData.displayName || !formData.cardPrintName || 
          !formData.primaryContactNumber || !formData.emailAddress) {
        throw new Error('Please fill in all required fields');
      }

      // Call update function which now properly updates the database
      await updateCardholder(cardholder.id, formData);
      
      showSuccess(
        'Profile Updated Successfully!', 
        'Cardholder information has been updated.'
      );
      
      // Navigate back to cardholders page after a short delay
      setTimeout(() => {
        router.push('/admin/cardholders');
      }, 1500);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      showError('Failed to Update Profile', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePreview = () => {
    if (cardholder) {
      window.open(cardholder.publicUrl, '_blank');
    }
  };

  if (!cardholder) {
    return (
      <>
        <Head>
          <title>Profile Not Found - NFC Digital Profile</title>
        </Head>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Loading Profile...
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Please wait while we load the profile information.
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Edit Cardholder - NFC Digital Profile</title>
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
                  className="max-w-4xl mx-auto"
                >
                  <div className="mb-6">
                    <button
                      onClick={() => router.push('/admin/cardholders')}
                      className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-4"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back to Cardholders</span>
                    </button>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                          Edit Cardholder
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                          Update cardholder business card information
                        </p>
                      </div>
                      
                      <button
                        onClick={handlePreview}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        <span>Preview Card</span>
                      </button>
                    </div>
                  </div>

                  {/* Error Messages */}
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
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                              <svg 
                                className="w-5 h-5 text-gray-400 dark:text-gray-500" 
                                xmlns="http://www.w3.org/2000/svg" 
                                viewBox="0 0 20 20" 
                                fill="currentColor"
                              >
                                <path 
                                  fillRule="evenodd" 
                                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" 
                                  clipRule="evenodd" 
                                />
                              </svg>
                            </div>
                          </div>
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
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Optional: External image URL for profile picture
                          </p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Profile Picture (Base64)
                          </label>
                          <textarea
                            value={formData.profilePictureBase64}
                            onChange={(e) => handleInputChange('profilePictureBase64', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm"
                            placeholder="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ..."
                            rows={3}
                          />
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Optional: Base64 encoded image data (e.g., data:image/jpeg;base64,...). Base64 takes precedence over URL if both are provided.
                          </p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Background Image URL
                          </label>
                          <input
                            type="url"
                            value={formData.backgroundImageUrl}
                            onChange={(e) => handleInputChange('backgroundImageUrl', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder="https://example.com/background.jpg"
                          />
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Optional: Image to display behind profile picture
                          </p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Background Colors
                          </label>
                          <input
                            type="text"
                            value={formData.backgroundColors}
                            onChange={(e) => handleInputChange('backgroundColors', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder="#ff0000,#00ff00,#0000ff or #ff0000"
                          />
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Optional: Hex colors (single or comma-separated for gradient)
                          </p>
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
                        onClick={() => router.push('/admin/cardholders')}
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
                            <span>Updating...</span>
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4" />
                            <span>Update Cardholder</span>
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