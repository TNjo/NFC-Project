// Legacy Cardholder interface (keeping for compatibility)
export interface Cardholder {
  id: string;
  name: string;
  company: string;
  jobTitle: string;
  phone: string;
  email: string;
  address: string;
  profilePhoto?: string;
  backgroundImageUrl?: string;
  backgroundColors?: string;
  socialMedia: {
    linkedin?: string;
    instagram?: string;
    twitter?: string;
    website?: string;
  };
  qrCode?: string;
  publicUrl: string;
  totalViews?: number;
  lastViewedAt?: string;
  totalContactSaves?: number;
  lastContactSavedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Comprehensive User interface matching Firebase Cloud Function
export interface ComprehensiveUser {
  id: string; // Firebase document ID

  // Basic Information
  prefixes?: string;
  profilePicture?: string;
  backgroundImageUrl?: string;
  backgroundColors?: string; // JSON string of color array or single color
  fullName: string;
  displayName: string;
  cardPrintName: string;
  
  // Contact Information
  primaryContactNumber: string;
  secondaryContactNumber?: string;
  whatsappNumber?: string;
  emailAddress: string;
  
  // Professional Information
  designation?: string;
  companyName?: string;
  companyWebsiteUrl?: string;
  companyLocation?: string;
  
  // Social Media Profiles
  linkedinProfile?: string;
  instagramProfile?: string;
  facebookProfile?: string;
  twitterProfile?: string;
  personalWebsite?: string;
  
  // Business Information
  googleReviewLink?: string;
  businessContact?: string;
  businessEmailAddress?: string;
  
  // URL fields
  publicUrl?: string;
  urlSlug?: string;
  
  // Analytics fields
  totalViews?: number;
  lastViewedAt?: any; // Firebase Timestamp
  totalContactSaves?: number;
  lastContactSavedAt?: any; // Firebase Timestamp
  
  // System fields
  createdAt: any; // Firebase Timestamp
  updatedAt: any; // Firebase Timestamp
}

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'cardholder';
  cardholderId?: string;
}

export type Theme = 'light' | 'dark';

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T = any> extends ApiResponse<T[]> {
  users: T[];
  totalCount: number;
  hasMore: boolean;
  lastUserId?: string;
  pagination?: {
    limit: number;
    currentPage: string;
  };
  filters?: {
    search?: string;
    company?: string;
  };
}