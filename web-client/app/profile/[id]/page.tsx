'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { 
  UserIcon, 
  Phone, 
  MapPin, 
  Calendar, 
  Globe,
  Heart,
  Star,
  Sparkles,
  CrownIcon,
  Sun,
  Zap,
  Gem,
  Diamond,
  Moon
} from 'lucide-react';

// Theme type matching dashboard
type ThemeType = 'Classic' | 'Modern' | 'Elegant' | 'Sunset' | 'Ocean' | 'Galaxy' | 'Forest' | 'Rose' | 'Neon' | 'Minimal';

export default function ProfilePage() {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `https://us-central1-burjcode-profile-dev.cloudfunctions.net/getUserDetailsFn?userId=${id}`
        );
        const json = await res.json();

        if (res.ok) {
          setData(json);
        } else {
          console.error('Fetch error:', json.error);
          setError(true);
        }
      } catch (err) {
        console.error('Request failed:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  // Enhanced theme styles matching dashboard
  const themeStyles: Record<ThemeType, any> = {
    Classic: {
      container: 'bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 shadow-2xl',
      background: 'bg-gradient-to-br from-gray-100 to-gray-200',
      text: 'text-gray-800',
      accent: 'text-gray-600',
      name: 'text-gray-900',
      decorative: 'bg-gray-200/50',
      badge: 'bg-gray-200/80'
    },
    Modern: {
      container: 'bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 border border-white/20 shadow-2xl',
      background: 'bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900',
      text: 'text-white',
      accent: 'text-blue-200',
      name: 'text-white',
      decorative: 'bg-white/10',
      badge: 'bg-white/20'
    },
    Elegant: {
      container: 'bg-gradient-to-br from-rose-100 via-white to-purple-100 border-2 border-purple-200 shadow-2xl',
      background: 'bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50',
      text: 'text-gray-800',
      accent: 'text-purple-600',
      name: 'text-purple-900',
      decorative: 'bg-purple-200/30',
      badge: 'bg-purple-200/80'
    },
    Sunset: {
      container: 'bg-gradient-to-br from-orange-400 via-red-500 to-pink-600 border border-orange-200/30 shadow-2xl',
      background: 'bg-gradient-to-br from-orange-200 via-red-200 to-pink-200',
      text: 'text-white',
      accent: 'text-orange-100',
      name: 'text-white',
      decorative: 'bg-white/15',
      badge: 'bg-white/25'
    },
    Ocean: {
      container: 'bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 border border-cyan-200/30 shadow-2xl',
      background: 'bg-gradient-to-br from-cyan-100 via-blue-100 to-indigo-100',
      text: 'text-white',
      accent: 'text-cyan-100',
      name: 'text-white',
      decorative: 'bg-white/15',
      badge: 'bg-white/25'
    },
    Galaxy: {
      container: 'bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 border border-purple-300/20 shadow-2xl',
      background: 'bg-gradient-to-br from-black via-purple-900 to-black',
      text: 'text-white',
      accent: 'text-purple-200',
      name: 'text-white',
      decorative: 'bg-white/10',
      badge: 'bg-white/20'
    },
    Forest: {
      container: 'bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700 border border-green-200/30 shadow-2xl',
      background: 'bg-gradient-to-br from-green-200 via-emerald-200 to-teal-200',
      text: 'text-white',
      accent: 'text-green-100',
      name: 'text-white',
      decorative: 'bg-white/15',
      badge: 'bg-white/25'
    },
    Rose: {
      container: 'bg-gradient-to-br from-pink-300 via-rose-400 to-red-400 border border-pink-200/30 shadow-2xl',
      background: 'bg-gradient-to-br from-pink-100 via-rose-100 to-red-100',
      text: 'text-white',
      accent: 'text-pink-100',
      name: 'text-white',
      decorative: 'bg-white/15',
      badge: 'bg-white/25'
    },
    Neon: {
      container: 'bg-gradient-to-br from-black via-gray-900 to-black border-2 border-cyan-400/50 shadow-2xl',
      background: 'bg-gradient-to-br from-gray-900 to-black',
      text: 'text-white',
      accent: 'text-cyan-300',
      name: 'text-white',
      decorative: 'bg-cyan-500/10',
      badge: 'bg-cyan-500/20'
    },
    Minimal: {
      container: 'bg-white border border-gray-200 shadow-lg',
      background: 'bg-gradient-to-br from-gray-50 to-white',
      text: 'text-gray-900',
      accent: 'text-gray-600',
      name: 'text-gray-900',
      decorative: 'bg-gray-100/50',
      badge: 'bg-gray-100'
    }
  };

  // Theme icons matching dashboard
  const ThemeIcons: Record<ThemeType, any> = {
    Classic: UserIcon,
    Modern: Sparkles,
    Elegant: CrownIcon,
    Sunset: Sun,
    Ocean: Zap,
    Galaxy: Star,
    Forest: Gem,
    Rose: Heart,
    Neon: Diamond,
    Minimal: Moon
  };

  const theme = (data?.theme as ThemeType) || 'Classic';
  const styles = themeStyles[theme];
  const ThemeIcon = ThemeIcons[theme];

  // Special effects for themes
  const getThemeEffects = (currentTheme: ThemeType) => {
    const effects = [];
    
    if (currentTheme === 'Galaxy') {
      effects.push(
        <div key="stars" className="absolute inset-0 opacity-30">
          <div className="absolute top-8 left-12 w-1 h-1 bg-white rounded-full animate-pulse"></div>
          <div className="absolute top-16 right-16 w-1 h-1 bg-white rounded-full animate-pulse delay-100"></div>
          <div className="absolute bottom-20 left-20 w-1 h-1 bg-white rounded-full animate-pulse delay-200"></div>
          <div className="absolute bottom-12 right-12 w-0.5 h-0.5 bg-white rounded-full animate-pulse delay-300"></div>
          <div className="absolute top-1/2 left-1/4 w-0.5 h-0.5 bg-white rounded-full animate-pulse delay-500"></div>
          <div className="absolute top-1/3 right-1/3 w-0.5 h-0.5 bg-white rounded-full animate-pulse delay-700"></div>
        </div>
      );
    }
    
    if (currentTheme === 'Neon') {
      effects.push(
        <div key="neon-glow" className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-purple-500/5 to-pink-500/5 animate-pulse"></div>
      );
    }
    
    if (currentTheme === 'Sunset') {
      effects.push(
        <div key="sunset-glow" className="absolute inset-0 bg-gradient-to-t from-yellow-500/10 to-transparent"></div>
      );
    }
    
    if (currentTheme === 'Ocean') {
      effects.push(
        <div key="ocean-wave" className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-r from-cyan-300/20 to-blue-300/20 animate-pulse"></div>
      );
    }
    
    return effects;
  };

  // Enhanced background decorations
  const getBackgroundDecorations = (currentTheme: ThemeType) => {
    switch (currentTheme) {
      case 'Modern':
        return (
          <>
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl"></div>
          </>
        );
      case 'Elegant':
        return (
          <>
            <div className="absolute top-20 right-20 w-32 h-32 bg-rose-300/20 rounded-full blur-2xl animate-pulse"></div>
            <div className="absolute bottom-20 left-20 w-32 h-32 bg-purple-300/20 rounded-full blur-2xl animate-pulse delay-500"></div>
            <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-pink-300/15 rounded-full blur-xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/3 right-1/3 w-20 h-20 bg-lavender-300/10 rounded-full blur-lg"></div>
          </>
        );
      case 'Sunset':
        return (
          <>
            <div className="absolute -top-32 -right-32 w-64 h-64 bg-orange-400/15 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-red-400/15 rounded-full blur-3xl"></div>
            <div className="absolute top-1/4 left-1/2 w-40 h-40 bg-yellow-400/10 rounded-full blur-2xl animate-pulse"></div>
          </>
        );
      case 'Ocean':
        return (
          <>
            <div className="absolute -top-32 -right-32 w-64 h-64 bg-cyan-400/15 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-blue-400/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/3 left-1/3 w-48 h-48 bg-indigo-400/10 rounded-full blur-2xl"></div>
          </>
        );
      case 'Galaxy':
        return (
          <>
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl"></div>
            <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-indigo-600/15 rounded-full blur-2xl animate-pulse"></div>
          </>
        );
      case 'Forest':
        return (
          <>
            <div className="absolute -top-32 -right-32 w-64 h-64 bg-green-500/15 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-emerald-500/15 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 right-1/2 w-40 h-40 bg-teal-500/10 rounded-full blur-2xl animate-pulse"></div>
          </>
        );
      case 'Rose':
        return (
          <>
            <div className="absolute -top-32 -right-32 w-64 h-64 bg-pink-400/15 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-rose-400/15 rounded-full blur-3xl animate-pulse delay-500"></div>
            <div className="absolute top-1/3 left-1/2 w-36 h-36 bg-red-400/10 rounded-full blur-2xl"></div>
          </>
        );
      case 'Neon':
        return (
          <>
            <div className="absolute top-20 right-20 w-40 h-40 bg-cyan-500/20 rounded-full blur-2xl animate-pulse"></div>
            <div className="absolute bottom-20 left-20 w-40 h-40 bg-purple-500/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-pink-500/15 rounded-full blur-xl animate-pulse delay-500"></div>
          </>
        );
      case 'Classic':
        return (
          <>
            <div className="absolute top-10 right-10 w-40 h-40 bg-gray-300/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-10 left-10 w-40 h-40 bg-gray-400/10 rounded-full blur-2xl"></div>
          </>
        );
      case 'Minimal':
        return (
          <>
            <div className="absolute top-20 right-20 w-32 h-32 bg-gray-200/30 rounded-full blur-2xl"></div>
            <div className="absolute bottom-20 left-20 w-32 h-32 bg-gray-300/20 rounded-full blur-2xl"></div>
          </>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto"></div>
            <Sparkles className="w-8 h-8 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-purple-500" />
          </div>
          <div className="space-y-2">
            <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Loading Profile
            </p>
            <p className="text-gray-600">Please wait while we fetch the profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100">
        <div className="text-center space-y-6 p-8">
          <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
            <UserIcon className="w-10 h-10 text-white" />
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-red-700">Profile Not Found</h2>
            <p className="text-red-600 max-w-md">
              The profile you're looking for doesn't exist or couldn't be loaded. Please check the URL and try again.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
        <div className="text-center space-y-6 p-8">
          <div className="w-20 h-20 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
            <UserIcon className="w-10 h-10 text-white" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-700">No Profile Data</h2>
            <p className="text-gray-600">No profile information is available to display.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${styles.background}`}>
      {/* Enhanced decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {getBackgroundDecorations(theme)}
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className={`rounded-3xl p-8 text-center transition-all duration-500 hover:scale-105 ${styles.container} relative overflow-hidden`}>
          {/* Theme-specific effects */}
          {getThemeEffects(theme)}
          
          <div className="relative z-10">
            {/* Profile Image Section */}
            <div className="relative mb-8">
              {data.profileImageUrl ? (
                <div className="relative group">
                  <img
                    src={data.profileImageUrl}
                    alt={`${data.firstName} ${data.lastName}`}
                    className="w-36 h-36 mx-auto rounded-full object-cover border-4 border-white/40 shadow-2xl transition-transform duration-300 group-hover:scale-105"
                  />
                  {/* Enhanced glow effects for different themes */}
                  <div className="absolute -inset-6 bg-gradient-to-r from-white/10 via-transparent to-white/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  {theme === 'Neon' && (
                    <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/30 to-purple-500/30 rounded-full blur-lg animate-pulse"></div>
                  )}
                </div>
              ) : (
                <div className={`w-36 h-36 mx-auto rounded-full flex items-center justify-center border-4 border-white/40 shadow-2xl ${styles.decorative} backdrop-blur-sm`}>
                  <UserIcon className={`w-16 h-16 ${styles.accent}`} />
                </div>
              )}
            </div>

            {/* Name Section */}
            <div className="mb-8">
              <h1 className={`text-3xl font-bold mb-4 tracking-wide ${styles.name}`}>
                {data.firstName && data.lastName 
                  ? `${data.firstName} ${data.lastName}`
                  : data.firstName || data.lastName || 'Profile User'
                }
              </h1>
              
              {/* Enhanced theme badge */}
              <div className={`inline-flex items-center space-x-3 px-4 py-2 rounded-full ${styles.badge} backdrop-blur-sm shadow-lg`}>
                <ThemeIcon className="w-5 h-5" />
                <span className={`text-sm font-semibold ${styles.text}`}>
                  {theme} Theme
                </span>
              </div>
            </div>

            {/* Contact Information with enhanced styling */}
            <div className="space-y-4">
              {data.dob && (
                <div className={`flex items-center space-x-4 p-4 rounded-xl ${styles.decorative} backdrop-blur-sm shadow-lg hover:scale-105 transition-transform duration-200`}>
                  <div className={`w-12 h-12 rounded-xl ${styles.badge} flex items-center justify-center flex-shrink-0`}>
                    <Calendar className={`w-6 h-6 ${styles.accent}`} />
                  </div>
                  <div className="text-left flex-1">
                    <p className={`text-sm font-medium ${styles.accent} mb-1`}>Date of Birth</p>
                    <p className={`font-bold ${styles.text}`}>
                      {new Date(data.dob).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              )}

              {data.phoneNumber && (
                <div className={`flex items-center space-x-4 p-4 rounded-xl ${styles.decorative} backdrop-blur-sm shadow-lg hover:scale-105 transition-transform duration-200`}>
                  <div className={`w-12 h-12 rounded-xl ${styles.badge} flex items-center justify-center flex-shrink-0`}>
                    <Phone className={`w-6 h-6 ${styles.accent}`} />
                  </div>
                  <div className="text-left flex-1">
                    <p className={`text-sm font-medium ${styles.accent} mb-1`}>Phone Number</p>
                    <p className={`font-bold ${styles.text}`}>{data.phoneNumber}</p>
                  </div>
                </div>
              )}

              {data.address && (
                <div className={`flex items-start space-x-4 p-4 rounded-xl ${styles.decorative} backdrop-blur-sm shadow-lg hover:scale-105 transition-transform duration-200`}>
                  <div className={`w-12 h-12 rounded-xl ${styles.badge} flex items-center justify-center flex-shrink-0`}>
                    <MapPin className={`w-6 h-6 ${styles.accent}`} />
                  </div>
                  <div className="text-left flex-1">
                    <p className={`text-sm font-medium ${styles.accent} mb-1`}>Address</p>
                    <p className={`font-bold ${styles.text}`}>{data.address}</p>
                  </div>
                </div>
              )}

              {/* Enhanced empty state */}
              {!data.dob && !data.phoneNumber && !data.address && (
                <div className={`p-6 rounded-xl ${styles.decorative} backdrop-blur-sm shadow-lg`}>
                  <div className={`w-16 h-16 rounded-full ${styles.badge} flex items-center justify-center mx-auto mb-4`}>
                    <Globe className={`w-8 h-8 ${styles.accent}`} />
                  </div>
                  <p className={`text-lg font-semibold ${styles.text} mb-2`}>
                    Digital Profile
                  </p>
                  <p className={`text-sm ${styles.accent}`}>
                    This profile was created using NFC technology
                  </p>
                </div>
              )}
            </div>

            {/* Enhanced Footer */}
            <div className="mt-8 pt-6 border-t border-white/20">
              <div className="flex items-center justify-center space-x-2">
                <Sparkles className={`w-4 h-4 ${styles.accent}`} />
                <p className={`text-sm font-medium ${styles.accent}`}>
                  Powered by NFC Digital Profile
                </p>
              </div>
            </div>
          </div>

          {/* Hover glow effect */}
          <div className="absolute -inset-4 bg-gradient-to-r from-white/5 via-transparent to-white/5 rounded-3xl blur-xl opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
        </div>
      </div>
    </div>
  );
}