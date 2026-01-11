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
exports.registerGoogleUser = void 0;
const admin = __importStar(require("firebase-admin"));
const cors_1 = __importDefault(require("cors"));
const corsHandler = (0, cors_1.default)({ origin: true });
// Register Google account with existing user
const registerGoogleUser = (req, res) => {
    corsHandler(req, res, async () => {
        try {
            console.log('Google user registration attempt:', {
                userId: req.body.userId,
                slug: req.body.slug,
                email: req.body.email
            });
            const { userId, slug, googleUid, email, displayName, photoURL, idToken } = req.body;
            // Validate required fields
            if (!userId || !slug || !googleUid || !email || !idToken) {
                res.status(400).json({
                    success: false,
                    error: 'Missing required fields: userId, slug, googleUid, email, idToken'
                });
                return;
            }
            // Verify the Firebase ID token
            let decodedToken;
            try {
                decodedToken = await admin.auth().verifyIdToken(idToken);
                // Ensure the token matches the provided googleUid
                if (decodedToken.uid !== googleUid) {
                    res.status(403).json({
                        success: false,
                        error: 'Token does not match provided Google UID'
                    });
                    return;
                }
            }
            catch (error) {
                console.error('Token verification failed:', error);
                res.status(401).json({
                    success: false,
                    error: 'Invalid or expired token'
                });
                return;
            }
            const db = admin.firestore();
            // 1. Verify the user exists and slug matches
            const userDoc = await db.collection('users').doc(userId).get();
            if (!userDoc.exists) {
                res.status(404).json({
                    success: false,
                    error: 'User not found'
                });
                return;
            }
            const userData = userDoc.data();
            // Verify slug matches (security check)
            if (userData?.urlSlug !== slug) {
                res.status(403).json({
                    success: false,
                    error: 'Invalid registration link'
                });
                return;
            }
            // Check if already registered with Google
            if (userData?.googleUid) {
                res.status(400).json({
                    success: false,
                    error: 'This account is already registered with Google. Please login instead.'
                });
                return;
            }
            // Check if this Google account is already linked to another user
            const existingGoogleUser = await db.collection('users')
                .where('googleUid', '==', googleUid)
                .limit(1)
                .get();
            if (!existingGoogleUser.empty) {
                res.status(400).json({
                    success: false,
                    error: 'This Google account is already registered with another user'
                });
                return;
            }
            // 2. Link Google account to user
            await userDoc.ref.update({
                googleUid: googleUid,
                googleEmail: email,
                googleDisplayName: displayName,
                googlePhotoURL: photoURL,
                isGoogleLinked: true,
                registeredAt: admin.firestore.Timestamp.now(),
                updatedAt: admin.firestore.Timestamp.now()
            });
            // 3. Create a mapping document for quick Google UID lookups
            await db.collection('googleUserMappings').doc(googleUid).set({
                userId: userId,
                email: email,
                urlSlug: slug,
                linkedAt: admin.firestore.Timestamp.now()
            });
            console.log('Successfully registered Google user:', {
                userId: userId,
                googleUid: googleUid,
                email: email
            });
            // 4. Return success response
            res.status(200).json({
                success: true,
                message: 'Google account successfully linked',
                data: {
                    userId: userId,
                    urlSlug: slug,
                    googleEmail: email,
                    isGoogleLinked: true
                }
            });
        }
        catch (error) {
            console.error('registerGoogleUser error:', error);
            console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
            res.status(500).json({
                success: false,
                error: 'Failed to register Google account',
                details: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    });
};
exports.registerGoogleUser = registerGoogleUser;
//# sourceMappingURL=registerGoogleUser.js.map