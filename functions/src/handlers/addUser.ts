// functions/src/handlers/addUser.ts
import { Request, Response } from 'express';
import * as admin from 'firebase-admin';
import cors from 'cors';

// Configure CORS with explicit origins
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:3001', 
    'https://burjcode-profile-dev.web.app',
    'https://burjcode-profile-dev.firebaseapp.com',
    'https://nfc-project-opal.vercel.app',
    'https://digitalprofile.burjcodetech.com',
    'http://digitalprofile.burjcodetech.com',
    /https:\/\/nfc-project.*\.vercel\.app$/
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With', 
    'Accept', 
    'Origin'
  ],
  credentials: true
};

const corsHandler = cors(corsOptions);

// Function to generate a URL-friendly slug from user name
function generateSlug(fullName: string, userId: string): string {
  // Remove special characters and convert to lowercase
  const baseSlug = fullName
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
  
  // Add first 6 characters of userId to ensure uniqueness
  const uniqueSuffix = userId.substring(0, 6);
  
  return `${baseSlug}-${uniqueSuffix}`;
}

// Comprehensive User Interface
export interface ComprehensiveUser {
  // Basic Information
  prefixes?: string;
  profilePicture?: string;
  fullName: string;
  displayName: string; // Name to be displayed in contact card
  cardPrintName: string; // Name to be printed in the card
  
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
  
  // System fields
  createdAt?: admin.firestore.FieldValue;
  updatedAt?: admin.firestore.FieldValue;
}

export const addUser = (req: Request, res: Response): Promise<void> | void => {
  corsHandler(req, res, async (): Promise<void> => {
    // Handle preflight OPTIONS request
    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }

    try {
      // 1) Verify ID token (optional - uncomment if auth required)
      /*
      const authHeader = req.headers.authorization || '';
      const match = authHeader.match(/^Bearer (.*)$/);
      if (!match) {
        res.status(401).json({ error: 'Unauthorized: token missing' });
        return;
      }
      const decoded = await admin.auth().verifyIdToken(match[1]);
      const uid = decoded.uid;
      */

      // 2) Validate required input fields
      const {
        prefixes,
        profilePicture,
        fullName,
        displayName,
        cardPrintName,
        primaryContactNumber,
        secondaryContactNumber,
        whatsappNumber,
        emailAddress,
        designation,
        companyName,
        companyWebsiteUrl,
        companyLocation,
        linkedinProfile,
        instagramProfile,
        facebookProfile,
        twitterProfile,
        personalWebsite,
        googleReviewLink,
        businessContact,
        businessEmailAddress
      } = req.body;

      // Validate required fields
      if (!fullName || !displayName || !cardPrintName || !primaryContactNumber || !emailAddress) {
        res.status(400).json({ 
          error: 'Missing required fields. Required: fullName, displayName, cardPrintName, primaryContactNumber, emailAddress' 
        });
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailAddress)) {
        res.status(400).json({ error: 'Invalid email format' });
        return;
      }

      // Validate business email if provided
      if (businessEmailAddress && !emailRegex.test(businessEmailAddress)) {
        res.status(400).json({ error: 'Invalid business email format' });
        return;
      }

      // 3) Create user data object
      const userData: ComprehensiveUser = {
        // Basic Information
        prefixes: prefixes || null,
        profilePicture: profilePicture || null,
        fullName,
        displayName,
        cardPrintName,
        
        // Contact Information
        primaryContactNumber,
        secondaryContactNumber: secondaryContactNumber || null,
        whatsappNumber: whatsappNumber || null,
        emailAddress,
        
        // Professional Information
        designation: designation || null,
        companyName: companyName || null,
        companyWebsiteUrl: companyWebsiteUrl || null,
        companyLocation: companyLocation || null,
        
        // Social Media Profiles
        linkedinProfile: linkedinProfile || null,
        instagramProfile: instagramProfile || null,
        facebookProfile: facebookProfile || null,
        twitterProfile: twitterProfile || null,
        personalWebsite: personalWebsite || null,
        
        // Business Information
        googleReviewLink: googleReviewLink || null,
        businessContact: businessContact || null,
        businessEmailAddress: businessEmailAddress || null,
        
        // System fields
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      };

      // 4) Save to Firestore
      const db = admin.firestore();
      const userRef = await db.collection('users').add(userData);
      const userId = userRef.id;
      
      // 5) Generate public URL for the user
      const slug = generateSlug(fullName, userId);
      
      // Get base URL dynamically from request or environment
      let baseUrl = process.env.PUBLIC_URL;
      if (!baseUrl) {
        const origin = req.get('origin') || req.get('referer');
        if (origin) {
          // Extract base URL from origin/referer
          baseUrl = origin.replace(/\/$/, ''); // Remove trailing slash
        } else {
          // Fallback to production URL
          baseUrl = 'https://burjcode-profile-dev.web.app';
        }
      }
      
      const publicUrl = `${baseUrl}/card/${slug}`;

      // 6) Update user document with public URL and slug
      await userRef.update({
        publicUrl: publicUrl,
        urlSlug: slug,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      // 7) Create URL mapping document for quick lookups
      const urlMappingRef = db.collection('urlMappings').doc(slug);
      await urlMappingRef.set({
        userId: userId,
        slug: slug,
        fullName: fullName,
        isActive: true,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
      
      // 8) Send success response with user ID and public URL
      res.status(201).json({ 
        success: true,
        userId: userId,
        publicUrl: publicUrl,
        slug: slug,
        message: 'User created successfully with public URL',
        data: {
          fullName,
          displayName,
          emailAddress,
          primaryContactNumber,
          publicUrl,
          slug
        }
      });

    } catch (err) {
      console.error('addUser error:', err);
      
      // Handle specific Firestore errors
      if (err instanceof Error) {
        if (err.message.includes('PERMISSION_DENIED')) {
          res.status(403).json({ error: 'Permission denied to write to database' });
        } else if (err.message.includes('INVALID_ARGUMENT')) {
          res.status(400).json({ error: 'Invalid data format provided' });
        } else {
          res.status(500).json({ error: 'Internal server error' });
        }
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  });
};
