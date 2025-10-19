import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { apiMethods } from '../../config/api';
import { motion } from 'framer-motion';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Download, 
  Share2, 
  Linkedin, 
  Instagram, 
  Twitter, 
  Globe,
  Loader2
} from 'lucide-react';
import { ComprehensiveUser } from '../../types';

interface ApiResponse {
  success: boolean;
  message?: string;
  slug?: string;
  data?: ComprehensiveUser;
  error?: string;
}

export default function BusinessCard() {
  const [user, setUser] = useState<ComprehensiveUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [showSavePrompt, setShowSavePrompt] = useState(false);
  const [cardId, setCardId] = useState<string | null>(null);

  // Get cardId from URL on client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const pathname = window.location.pathname;
      const matches = pathname.match(/\/card\/([^/]+)/);
      if (matches && matches[1]) {
        const extractedCardId = matches[1];
        setCardId(extractedCardId);
      }
    }
  }, []);

  useEffect(() => {
    if (cardId) {
      fetchUserData(cardId);
    }
  }, [cardId]);

  const fetchUserData = async (slug: string) => {
    try {
      setLoading(true);
      setError('');

      const response = await apiMethods.getUserBySlug(slug);
      const result: ApiResponse = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch user data');
      }

      if (result.success && result.data) {
        setUser(result.data);

        // Show save prompt on every visit after a short delay
        setTimeout(() => {
          setShowSavePrompt(true);
        }, 1000);
      } else {
        throw new Error('User not found');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  const generateVCard = () => {
    if (!user) return;

    // Ensure we have a proper full name
    const fullName = user.fullName || user.displayName || 'Unknown User';
    const cleanName = fullName.replace(/[^\w\s-]/g, '').trim(); // Remove special characters that might cause issues

    // Split name into first and last name for proper vCard formatting
    const nameParts = cleanName.split(' ');

    // Filter out single character words, common initials, and titles
    const filteredParts = nameParts.filter(part => {
      const lowerPart = part.toLowerCase();
      return part.length > 1 && // Remove single characters
             !['mr', 'mrs', 'ms', 'dr', 'prof', 'rev'].includes(lowerPart); // Remove common titles
    });

    const lastName = filteredParts[filteredParts.length - 1] || nameParts[nameParts.length - 1] || ''; // Last meaningful word as last name
    const firstNameParts = filteredParts.slice(0, -1);
    const firstName = firstNameParts.length > 0 ? firstNameParts.join(' ') : nameParts[0] || ''; // Everything except last meaningful word as first name

    // Helper function to extract base64 data from data URL or raw base64 string
    const extractBase64Data = (dataUrl: string): { data: string; type: string } | null => {
      if (!dataUrl) return null;

      // Check if it's a full data URL
      if (dataUrl.startsWith('data:')) {
        const matches = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
        if (!matches) return null;

        return {
          type: matches[1],
          data: matches[2]
        };
      }

      // Check if it's raw base64 data (starts with common base64 patterns)
      // JPEG: /9j/4AAQSkZJRgABAQE
      // PNG: iVBORw0KGgoAAAANSUhEUgAA
      // GIF: R0lGODlh
      // WebP: UklGR
      const isBase64 = /^[A-Za-z0-9+/=]+$/.test(dataUrl) && dataUrl.length > 10;

      if (isBase64) {
        // Determine MIME type based on base64 signature
        let mimeType = 'image/jpeg'; // default

        if (dataUrl.startsWith('iVBORw0KGgo')) {
          mimeType = 'image/png';
        } else if (dataUrl.startsWith('R0lGODlh')) {
          mimeType = 'image/gif';
        } else if (dataUrl.startsWith('UklGR')) {
          mimeType = 'image/webp';
        } else if (dataUrl.startsWith('/9j/4AAQSkZJRgABAQE') || dataUrl.startsWith('/9j/4AAQSkZJRgABAQEA')) {
          mimeType = 'image/jpeg';
        }

        return {
          type: mimeType,
          data: dataUrl
        };
      }

      return null;
    };

    // Process profile picture for VCF (only base64 can be embedded in VCF)
    let photoField = '';
    if (user.profilePictureBase64) {
      const base64Data = extractBase64Data(user.profilePictureBase64);
      if (base64Data) {
        // Determine MIME type for VCF
        const mimeType = base64Data.type.toUpperCase();
        photoField = `PHOTO;ENCODING=b;TYPE=${mimeType}:${base64Data.data}`;
      }
    }

    const vCard = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      // Use N (name components) and FN (formatted name) for better Apple compatibility
      // Format: N:LastName;FirstName;MiddleName;Title;Suffix
      `N:${lastName};${firstName};;;`,
      `FN:${cleanName}`,
      user.companyName ? `ORG:${user.companyName}` : '',
      user.designation ? `TITLE:${user.designation}` : '',
      photoField, // Add profile picture if available
      user.primaryContactNumber ? `TEL;TYPE=CELL:${user.primaryContactNumber}` : '',
      user.secondaryContactNumber ? `TEL;TYPE=HOME,VOICE:${user.secondaryContactNumber}` : '',
      user.whatsappNumber ? `TEL;TYPE=WORK:${user.whatsappNumber}` : '',
      user.businessContact ? `TEL;TYPE=MAIN:${user.businessContact}` : '',
      user.emailAddress ? `EMAIL;TYPE=WORK:${user.emailAddress}` : '',
      user.businessEmailAddress ? `EMAIL;TYPE=WORK:${user.businessEmailAddress}` : '',
      user.companyLocation ? `ADR;TYPE=WORK:;;${user.companyLocation};;;;` : '',
      user.personalWebsite ? `URL:${user.personalWebsite}` : '',
      user.companyWebsiteUrl ? `URL:${user.companyWebsiteUrl}` : '',
      'END:VCARD',
    ].filter(line => line !== '').join('\n');

    const blob = new Blob([vCard], { type: 'text/vcard' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(user.fullName || 'contact').replace(/\s+/g, '_')}.vcf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${user?.fullName || 'Business Card'}`,
          text: `Check out ${user?.fullName || 'this'}'s business card`,
          url: window.location.href,
        });
      } catch {
        // Fallback to copying to clipboard
        navigator.clipboard.writeText(window.location.href);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleAutoSave = async () => {
    generateVCard();
    setShowSavePrompt(false);
    
    // Track contact save analytics
    if (user?.id) {
      try {
        await apiMethods.trackContactSave(user.id);
      } catch (error) {
        // Don't block the save action if tracking fails
      }
    }
  };

  const handleDismissPrompt = () => {
    setShowSavePrompt(false);
  };

  if (loading) {
    return (
      <>
        <Head>
          <title>Loading Business Card...</title>
        </Head>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-300">Loading business card...</p>
          </div>
        </div>
      </>
    );
  }

  if (error || !user) {
    return (
      <>
        <Head>
          <title>Card Not Found - NFC Digital Profile</title>
        </Head>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Card Not Found
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {error || 'This business card could not be found.'}
            </p>
          </div>
        </div>
      </>
    );
  }

  const fullName = user.fullName || user.displayName || 'Unknown User';
  const socialLinks = [
    { icon: Linkedin, url: user.linkedinProfile, label: 'LinkedIn', color: 'bg-blue-600' },
    { icon: Instagram, url: user.instagramProfile, label: 'Instagram', color: 'bg-pink-600' },
    { icon: Twitter, url: user.twitterProfile, label: 'Twitter', color: 'bg-blue-400' },
    { icon: Globe, url: user.personalWebsite, label: 'Personal Website', color: 'bg-gray-600' },
  ].filter(link => link.url);
  
  return (
    <>
      <Head>
        <title>{fullName} - Business Card</title>
        <meta name="description" content={`${fullName} - ${user.designation || 'Professional'}${user.companyName ? ` at ${user.companyName}` : ''}`} />
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-md mx-auto"
          >
            {/* Business Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden mb-6">
              {/* Header Section */}
              <div
                className="px-6 py-8 text-center"
                style={user?.backgroundImageUrl ? {
                  backgroundImage: `url(${user.backgroundImageUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat'
                } : user?.backgroundColors ? {
                  background: user.backgroundColors.includes(',') ?
                    `linear-gradient(135deg, ${user.backgroundColors})` :
                    user.backgroundColors
                } : {
                  background: 'linear-gradient(to right, #2563eb, #3730a3)' // Default blue gradient as fallback
                }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className={`w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center overflow-hidden relative ${
                    user.backgroundImageUrl || user.backgroundColors ? 'bg-white/20 backdrop-blur-sm border-2 border-white/30' : 'bg-white'
                  }`}
                >
                  {user.profilePicture ? (
                    <img
                      src={user.profilePicture}
                      alt={fullName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                      {fullName.charAt(0)}
                    </div>
                  )}
                </motion.div>

                <h1 className={`text-2xl font-bold mb-1 ${
                  user.backgroundImageUrl || user.backgroundColors ? 'text-white drop-shadow-lg' : 'text-white'
                }`}>
                  {user.prefixes ? `${user.prefixes} ` : ''}{fullName}
                </h1>
                {user.cardPrintName && user.cardPrintName !== fullName && (
                  <p className={`text-sm mb-1 ${
                    user.backgroundImageUrl || user.backgroundColors ? 'text-white/90 drop-shadow-md' : 'text-blue-50'
                  }`}>
                    ({user.cardPrintName})
                  </p>
                )}
                {user.designation && (
                  <p className={`font-medium mb-1 ${
                    user.backgroundImageUrl || user.backgroundColors ? 'text-white/95 drop-shadow-md' : 'text-blue-100'
                  }`}>
                    {user.designation}
                  </p>
                )}
                {user.companyName && (
                  <p className={`${
                    user.backgroundImageUrl || user.backgroundColors ? 'text-white/90 drop-shadow-md' : 'text-blue-200'
                  }`}>
                    {user.companyName}
                  </p>
                )}
              </div>

              {/* Contact Actions */}
              <div className="p-6 space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="grid grid-cols-2 gap-3"
                >
                  {user.primaryContactNumber && (
                    <a
                      href={`tel:${user.primaryContactNumber}`}
                      className="flex items-center justify-center space-x-2 bg-green-50 dark:bg-green-900 text-green-700 dark:text-green-300 px-4 py-3 rounded-xl hover:bg-green-100 dark:hover:bg-green-800 transition-colors"
                    >
                      <Phone className="w-4 h-4" />
                      <span className="text-sm font-medium">Call</span>
                    </a>
                  )}

                  {user.emailAddress && (
                    <a
                      href={`mailto:${user.emailAddress}`}
                      className="flex items-center justify-center space-x-2 bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-4 py-3 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors"
                    >
                      <Mail className="w-4 h-4" />
                      <span className="text-sm font-medium">Email</span>
                    </a>
                  )}

                  {user.whatsappNumber && (
                    <a
                      href={`https://wa.me/${user.whatsappNumber.replace(/\D/g, '')}`}
                      className="flex items-center justify-center space-x-2 bg-emerald-50 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 px-4 py-3 rounded-xl hover:bg-emerald-100 dark:hover:bg-emerald-800 transition-colors"
                    >
                      <Phone className="w-4 h-4" />
                      <span className="text-sm font-medium">WhatsApp</span>
                    </a>
                  )}

                  {user.companyLocation && (
                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(user.companyLocation)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center space-x-2 bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-300 px-4 py-3 rounded-xl hover:bg-red-100 dark:hover:bg-red-800 transition-colors"
                    >
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm font-medium">Location</span>
                    </a>
                  )}

                  {user.secondaryContactNumber && (
                    <a
                      href={`tel:${user.secondaryContactNumber}`}
                      className="flex items-center justify-center space-x-2 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                    >
                      <Phone className="w-4 h-4" />
                      <span className="text-sm font-medium">Call 2nd</span>
                    </a>
                  )}

                  {user.businessContact && (
                    <a
                      href={`tel:${user.businessContact}`}
                      className="flex items-center justify-center space-x-2 bg-purple-50 dark:bg-purple-900 text-purple-700 dark:text-purple-300 px-4 py-3 rounded-xl hover:bg-purple-100 dark:hover:bg-purple-800 transition-colors"
                    >
                      <Phone className="w-4 h-4" />
                      <span className="text-sm font-medium">Business</span>
                    </a>
                  )}
                </motion.div>

                {/* Contact Info */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 space-y-3"
                >
                  {user.primaryContactNumber && (
                    <div className="flex items-center space-x-3">
                      <Phone className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      <div className="flex-1">
                        <span className="text-xs text-gray-500 dark:text-gray-400 block">Primary</span>
                        <span className="text-gray-900 dark:text-white text-sm font-medium">
                          {user.primaryContactNumber}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {user.secondaryContactNumber && (
                    <div className="flex items-center space-x-3">
                      <Phone className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      <div className="flex-1">
                        <span className="text-xs text-gray-500 dark:text-gray-400 block">Secondary</span>
                        <span className="text-gray-900 dark:text-white text-sm font-medium">
                          {user.secondaryContactNumber}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {user.whatsappNumber && (
                    <div className="flex items-center space-x-3">
                      <Phone className="w-4 h-4 text-green-500 dark:text-green-400" />
                      <div className="flex-1">
                        <span className="text-xs text-gray-500 dark:text-gray-400 block">WhatsApp</span>
                        <span className="text-gray-900 dark:text-white text-sm font-medium">
                          {user.whatsappNumber}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {user.emailAddress && (
                    <div className="flex items-center space-x-3">
                      <Mail className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                      <div className="flex-1">
                        <span className="text-xs text-gray-500 dark:text-gray-400 block">Email</span>
                        <span className="text-gray-900 dark:text-white text-sm font-medium">
                          {user.emailAddress}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {user.businessEmailAddress && (
                    <div className="flex items-center space-x-3">
                      <Mail className="w-4 h-4 text-purple-500 dark:text-purple-400" />
                      <div className="flex-1">
                        <span className="text-xs text-gray-500 dark:text-gray-400 block">Business Email</span>
                        <span className="text-gray-900 dark:text-white text-sm font-medium">
                          {user.businessEmailAddress}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {user.businessContact && (
                    <div className="flex items-center space-x-3">
                      <Phone className="w-4 h-4 text-purple-500 dark:text-purple-400" />
                      <div className="flex-1">
                        <span className="text-xs text-gray-500 dark:text-gray-400 block">Business Contact</span>
                        <span className="text-gray-900 dark:text-white text-sm font-medium">
                          {user.businessContact}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {user.companyLocation && (
                    <div className="flex items-start space-x-3">
                      <MapPin className="w-4 h-4 text-red-500 dark:text-red-400 mt-0.5" />
                      <div className="flex-1">
                        <span className="text-xs text-gray-500 dark:text-gray-400 block">Location</span>
                        <span className="text-gray-900 dark:text-white text-sm font-medium">
                          {user.companyLocation}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {user.companyWebsiteUrl && (
                    <div className="flex items-center space-x-3">
                      <Globe className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                      <div className="flex-1">
                        <span className="text-xs text-gray-500 dark:text-gray-400 block">Company Website</span>
                        <a 
                          href={user.companyWebsiteUrl.startsWith('http') ? user.companyWebsiteUrl : `https://${user.companyWebsiteUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline"
                        >
                          {user.companyWebsiteUrl}
                        </a>
                      </div>
                    </div>
                  )}
                </motion.div>

                {/* Social Media */}
                {(socialLinks.length > 0 || user.facebookProfile) && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                  >
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Connect with me
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {socialLinks.map(({ icon: Icon, url, label, color }) => (
                        <a
                          key={label}
                          href={url?.startsWith('http') ? url : `https://${url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`${color} p-3 rounded-xl text-white hover:opacity-90 transition-opacity flex items-center space-x-2`}
                        >
                          <Icon className="w-5 h-5" />
                          <span className="text-sm font-medium">{label}</span>
                        </a>
                      ))}
                      
                      {user.facebookProfile && (
                        <a
                          href={user.facebookProfile.startsWith('http') ? user.facebookProfile : `https://${user.facebookProfile}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-blue-700 p-3 rounded-xl text-white hover:opacity-90 transition-opacity flex items-center space-x-2"
                        >
                          <Globe className="w-5 h-5" />
                          <span className="text-sm font-medium">Facebook</span>
                        </a>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Google Reviews */}
                {user.googleReviewLink && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.55 }}
                  >
                    <a
                      href={user.googleReviewLink.startsWith('http') ? user.googleReviewLink : `https://${user.googleReviewLink}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center space-x-3 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 px-4 py-3 rounded-xl hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors w-full"
                    >
                      <div className="flex items-center space-x-1">
                        <Globe className="w-4 h-4" />
                        <span className="text-sm font-medium">⭐ Leave a Google Review</span>
                      </div>
                    </a>
                  </motion.div>
                )}

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="flex space-x-3 pt-4 border-t border-gray-200 dark:border-gray-600"
                >
                  <button
                    onClick={async () => {
                      generateVCard();
                      
                      // Track contact save
                      if (user?.id) {
                        try {
                          await apiMethods.trackContactSave(user.id);
                        } catch (error) {
                          // Silent fail
                        }
                      }
                    }}
                    className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-3 rounded-xl transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    <Download className="w-5 h-5" />
                    <span className="text-sm font-bold">Save Contact</span>
                  </button>

                  <button
                    onClick={handleShare}
                    className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-3 rounded-xl hover:bg-blue-700 transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </motion.div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="text-center"
            >
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Powered by BurjCode Technologies
              </p>
            </motion.div>
          </motion.div>

          {/* Auto-Save Contact Prompt Modal */}
          {showSavePrompt && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center z-50 p-4"
              onClick={handleDismissPrompt}
              style={{ pointerEvents: 'auto' }}
            >
              <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-sm w-full p-6"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Download className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Save Contact?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Would you like to save {user?.fullName || 'this contact'} to your phone&apos;s contacts?
                  </p>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handleAutoSave}
                    className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-3 rounded-xl transition-all transform hover:scale-105 shadow-lg hover:shadow-xl font-bold"
                  >
                    <Download className="w-5 h-5" />
                    <span>Save to Contacts</span>
                  </button>

                  <button
                    onClick={handleDismissPrompt}
                    className="w-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-xl transition-colors font-medium"
                  >
                    Maybe Later
                  </button>
                </div>

                <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
                  You can always save this contact using the button below
                </p>
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
}
