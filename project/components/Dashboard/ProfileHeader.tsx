import React from 'react';
import { motion } from 'framer-motion';
import { User, Briefcase, Mail, Link as LinkIcon, Copy, ExternalLink } from 'lucide-react';

interface ProfileHeaderProps {
  fullName: string;
  displayName: string;
  profilePicture: string | null;
  designation?: string | null;
  companyName?: string | null;
  email?: string;
  publicUrl?: string | null;
  urlSlug?: string | null;
  backgroundColors?: string | null;
  backgroundImageUrl?: string | null;
  onCopyUrl?: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  fullName,
  profilePicture,
  designation,
  companyName,
  email,
  publicUrl,
  urlSlug,
  backgroundColors,
  backgroundImageUrl,
  onCopyUrl,
}) => {
  // Parse background colors
  const getBackgroundStyle = () => {
    const baseStyle: React.CSSProperties = {};

    // Handle background image
    if (backgroundImageUrl) {
      baseStyle.backgroundImage = `url(${backgroundImageUrl})`;
      baseStyle.backgroundSize = 'cover';
      baseStyle.backgroundPosition = 'center';
    }

    // Handle background colors
    if (backgroundColors) {
      const colors = backgroundColors.split(',').map(c => c.trim());
      
      if (colors.length > 1) {
        // Multiple colors - create gradient
        baseStyle.backgroundImage = `linear-gradient(to bottom right, ${colors.join(', ')})`;
      } else if (colors.length === 1 && colors[0]) {
        // Single color
        baseStyle.backgroundColor = colors[0];
      }
    }

    return baseStyle;
  };

  const customStyle = getBackgroundStyle();
  const hasCustomBackground = backgroundColors || backgroundImageUrl;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl shadow-lg p-8 text-white ${
        !hasCustomBackground
          ? 'bg-gradient-to-br from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-700'
          : ''
      }`}
      style={hasCustomBackground ? customStyle : undefined}
    >
      <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
        {/* Profile Picture */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
          className="relative"
        >
          {profilePicture && profilePicture.trim() !== '' ? (
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white dark:border-gray-800 overflow-hidden shadow-lg bg-gray-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={
                  profilePicture.startsWith('data:') 
                    ? profilePicture 
                    : profilePicture.startsWith('http') 
                    ? profilePicture 
                    : `data:image/jpeg;base64,${profilePicture}`
                }
                alt={fullName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Hide image and show fallback
                  const parent = e.currentTarget.parentElement;
                  if (parent) {
                    parent.innerHTML = `
                      <div class="w-full h-full bg-white/20 flex items-center justify-center">
                        <svg class="w-12 h-12 md:w-16 md:h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                        </svg>
                      </div>
                    `;
                  }
                }}
              />
            </div>
          ) : (
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white dark:border-gray-800 bg-white/20 flex items-center justify-center shadow-lg">
              <User className="w-12 h-12 md:w-16 md:h-16 text-white" />
            </div>
          )}
        </motion.div>

        {/* Profile Info */}
        <div className="flex-1 text-center md:text-left">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl md:text-3xl font-bold mb-2"
          >
            {fullName}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-2"
          >
            {designation && (
              <div className="flex items-center justify-center md:justify-start space-x-2 text-blue-100">
                <Briefcase className="w-4 h-4" />
                <span className="text-sm">
                  {designation}
                  {companyName && ` at ${companyName}`}
                </span>
              </div>
            )}

            {email && (
              <div className="flex items-center justify-center md:justify-start space-x-2 text-blue-100">
                <Mail className="w-4 h-4" />
                <span className="text-sm">{email}</span>
              </div>
            )}

            {urlSlug && (
              <div className="flex items-center justify-center md:justify-start space-x-2 text-blue-100">
                <LinkIcon className="w-4 h-4" />
                <span className="text-sm font-mono">{urlSlug}</span>
              </div>
            )}
          </motion.div>

          {/* Action Buttons */}
          {publicUrl && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap gap-3 mt-4 justify-center md:justify-start"
            >
              <button
                onClick={onCopyUrl}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg transition-colors text-sm font-medium"
              >
                <Copy className="w-4 h-4" />
                <span>Copy Profile URL</span>
              </button>
              <a
                href={publicUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg transition-colors text-sm font-medium"
              >
                <ExternalLink className="w-4 h-4" />
                <span>View Public Profile</span>
              </a>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

