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
exports.requestUserAccess = exports.verifyUserToken = exports.userLogin = void 0;
const admin = __importStar(require("firebase-admin"));
const cors_1 = __importDefault(require("cors"));
const corsHandler = (0, cors_1.default)({ origin: true });
// Helper function to generate simple token for users (not Firebase Auth token)
const generateUserToken = (userId, email) => {
    // Create a simple base64 token with user info
    // In production, you should use JWT with proper signing
    const tokenData = {
        userId: userId,
        email: email,
        role: 'user',
        type: 'cardholder',
        timestamp: Date.now()
    };
    return Buffer.from(JSON.stringify(tokenData)).toString('base64');
};
// User login handler
const userLogin = (req, res) => {
    corsHandler(req, res, async () => {
        try {
            console.log('User login attempt:', { email: req.body.email, urlSlug: req.body.urlSlug });
            const { email, password, urlSlug } = req.body;
            if (!email && !urlSlug) {
                console.log('Missing email and urlSlug');
                res.status(400).json({
                    success: false,
                    error: 'Email or URL slug is required'
                });
                return;
            }
            const db = admin.firestore();
            let userDoc;
            // Login by email
            if (email) {
                console.log('Searching by email:', email);
                // Find user by email
                const usersSnapshot = await db.collection('users')
                    .where('emailAddress', '==', email)
                    .limit(1)
                    .get();
                console.log('Email search result:', usersSnapshot.empty ? 'empty' : 'found');
                if (usersSnapshot.empty) {
                    res.status(404).json({
                        success: false,
                        error: 'User not found'
                    });
                    return;
                }
                userDoc = usersSnapshot.docs[0];
            }
            // Login by URL slug (passwordless for users with unique URLs)
            else if (urlSlug) {
                console.log('Searching by urlSlug:', urlSlug);
                const usersSnapshot = await db.collection('users')
                    .where('urlSlug', '==', urlSlug)
                    .limit(1)
                    .get();
                console.log('URL slug search result:', usersSnapshot.empty ? 'empty' : 'found');
                if (usersSnapshot.empty) {
                    res.status(404).json({
                        success: false,
                        error: 'User not found with this URL'
                    });
                    return;
                }
                userDoc = usersSnapshot.docs[0];
            }
            if (!userDoc) {
                res.status(404).json({
                    success: false,
                    error: 'User not found'
                });
                return;
            }
            const userData = userDoc.data();
            const userId = userDoc.id;
            // Generate token for the user
            const token = generateUserToken(userId, userData.emailAddress);
            // Update last login timestamp
            await userDoc.ref.update({
                lastLoginAt: admin.firestore.Timestamp.now(),
                updatedAt: admin.firestore.Timestamp.now()
            });
            // Return user data with token
            res.status(200).json({
                success: true,
                message: 'Login successful',
                data: {
                    userId: userId,
                    token: token,
                    email: userData.emailAddress,
                    fullName: userData.fullName,
                    displayName: userData.displayName,
                    profilePicture: userData.profilePictureBase64 || userData.profilePicture || null,
                    designation: userData.designation || null,
                    companyName: userData.companyName || null,
                    urlSlug: userData.urlSlug || null,
                    publicUrl: userData.publicUrl || null,
                    role: 'user'
                }
            });
        }
        catch (error) {
            console.error('userLogin error:', error);
            console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
            res.status(500).json({
                success: false,
                error: 'Failed to login',
                details: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    });
};
exports.userLogin = userLogin;
// Verify user token
const verifyUserToken = (req, res) => {
    corsHandler(req, res, async () => {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                res.status(401).json({
                    success: false,
                    error: 'No token provided'
                });
                return;
            }
            const token = authHeader.split('Bearer ')[1];
            // Decode the simple token
            let decodedToken;
            try {
                const tokenString = Buffer.from(token, 'base64').toString('utf-8');
                decodedToken = JSON.parse(tokenString);
            }
            catch (error) {
                res.status(401).json({
                    success: false,
                    error: 'Invalid token format'
                });
                return;
            }
            if (!decodedToken || decodedToken.type !== 'cardholder') {
                res.status(403).json({
                    success: false,
                    error: 'Invalid token or insufficient permissions'
                });
                return;
            }
            // Check if token is not too old (7 days)
            const tokenAge = Date.now() - decodedToken.timestamp;
            if (tokenAge > 7 * 24 * 60 * 60 * 1000) {
                res.status(401).json({
                    success: false,
                    valid: false,
                    error: 'Token expired'
                });
                return;
            }
            const userId = decodedToken.userId;
            // Fetch user data
            const db = admin.firestore();
            const userDoc = await db.collection('users').doc(userId).get();
            if (!userDoc.exists) {
                res.status(404).json({
                    success: false,
                    error: 'User not found'
                });
                return;
            }
            const userData = userDoc.data();
            res.status(200).json({
                success: true,
                valid: true,
                data: {
                    userId: userId,
                    email: userData?.emailAddress,
                    fullName: userData?.fullName,
                    displayName: userData?.displayName,
                    profilePicture: userData?.profilePictureBase64 || userData?.profilePicture || null,
                    designation: userData?.designation || null,
                    companyName: userData?.companyName || null,
                    urlSlug: userData?.urlSlug || null,
                    publicUrl: userData?.publicUrl || null,
                    role: 'user'
                }
            });
        }
        catch (error) {
            console.error('verifyUserToken error:', error);
            res.status(401).json({
                success: false,
                valid: false,
                error: 'Token verification failed',
                details: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    });
};
exports.verifyUserToken = verifyUserToken;
// Request password reset / magic link
const requestUserAccess = (req, res) => {
    corsHandler(req, res, async () => {
        try {
            const { email } = req.body;
            if (!email) {
                res.status(400).json({
                    success: false,
                    error: 'Email is required'
                });
                return;
            }
            const db = admin.firestore();
            // Find user by email
            const usersSnapshot = await db.collection('users')
                .where('emailAddress', '==', email)
                .limit(1)
                .get();
            if (usersSnapshot.empty) {
                // Don't reveal if user exists or not for security
                res.status(200).json({
                    success: true,
                    message: 'If an account exists with this email, you will receive access instructions'
                });
                return;
            }
            const userDoc = usersSnapshot.docs[0];
            const userData = userDoc.data();
            // In a real implementation, you would:
            // 1. Generate a magic link token
            // 2. Send email with the magic link
            // For now, we'll return the URL slug for access
            res.status(200).json({
                success: true,
                message: 'Access link sent to your email',
                data: {
                    urlSlug: userData.urlSlug,
                    publicUrl: userData.publicUrl
                }
            });
        }
        catch (error) {
            console.error('requestUserAccess error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to process request',
                details: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    });
};
exports.requestUserAccess = requestUserAccess;
//# sourceMappingURL=userAuth.js.map