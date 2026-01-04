"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addUser = void 0;
const admin = __importStar(require("firebase-admin"));
const cors_1 = __importDefault(require("cors"));
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
const corsHandler = (0, cors_1.default)(corsOptions);
// Function to generate a URL-friendly slug from user name
function generateSlug(fullName, userId) {
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
const addUser = (req, res) => {
    corsHandler(req, res, async () => {
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
            const { prefixes, profilePicture, profilePictureBase64, backgroundImageUrl, backgroundColors, fullName, displayName, cardPrintName, primaryContactNumber, secondaryContactNumber, whatsappNumber, emailAddress, designation, companyName, companyWebsiteUrl, companyLocation, linkedinProfile, instagramProfile, facebookProfile, twitterProfile, personalWebsite, googleReviewLink, businessContact, businessEmailAddress } = req.body;
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
            const userData = {
                // Basic Information
                prefixes: prefixes || null,
                profilePicture: profilePicture || null,
                profilePictureBase64: profilePictureBase64 || null,
                backgroundImageUrl: backgroundImageUrl || null,
                backgroundColors: backgroundColors || null,
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
                // Platforms
                platforms: platforms || [],
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
                }
                else {
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
        }
        catch (err) {
            console.error('addUser error:', err);
            // Handle specific Firestore errors
            if (err instanceof Error) {
                if (err.message.includes('PERMISSION_DENIED')) {
                    res.status(403).json({ error: 'Permission denied to write to database' });
                }
                else if (err.message.includes('INVALID_ARGUMENT')) {
                    res.status(400).json({ error: 'Invalid data format provided' });
                }
                else {
                    res.status(500).json({ error: 'Internal server error' });
                }
            }
            else {
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    });
};
exports.addUser = addUser;
//# sourceMappingURL=addUser.js.map