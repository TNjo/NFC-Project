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
exports.getUserByUrl = void 0;
const admin = __importStar(require("firebase-admin"));
const cors_1 = __importDefault(require("cors"));
const corsHandler = (0, cors_1.default)({ origin: true });
const getUserByUrl = (req, res) => {
    corsHandler(req, res, async () => {
        try {
            // Get slug from URL parameter or query
            const slug = req.params.slug || req.query.slug;
            if (!slug) {
                res.status(400).json({ error: 'Missing URL slug parameter' });
                return;
            }
            const db = admin.firestore();
            // First, get userId from URL mapping
            const urlMappingRef = db.collection('urlMappings').doc(slug);
            const urlMappingDoc = await urlMappingRef.get();
            if (!urlMappingDoc.exists) {
                res.status(404).json({ error: 'URL not found' });
                return;
            }
            const urlMappingData = urlMappingDoc.data();
            if (!urlMappingData?.isActive) {
                res.status(404).json({ error: 'URL is no longer active' });
                return;
            }
            const userId = urlMappingData.userId;
            // Get full user data
            const userRef = db.collection('users').doc(userId);
            const userDoc = await userRef.get();
            if (!userDoc.exists) {
                res.status(404).json({ error: 'User data not found' });
                return;
            }
            const userData = userDoc.data();
            // Prepare response data (exclude sensitive information if any)
            const publicUserData = {
                id: userDoc.id,
                // Basic Information
                prefixes: userData?.prefixes || null,
                profilePicture: userData?.profilePicture || null,
                backgroundImageUrl: userData?.backgroundImageUrl || null,
                backgroundColors: userData?.backgroundColors || null,
                fullName: userData?.fullName || '',
                displayName: userData?.displayName || '',
                cardPrintName: userData?.cardPrintName || '',
                // Contact Information
                primaryContactNumber: userData?.primaryContactNumber || '',
                secondaryContactNumber: userData?.secondaryContactNumber || null,
                whatsappNumber: userData?.whatsappNumber || null,
                emailAddress: userData?.emailAddress || '',
                // Professional Information
                designation: userData?.designation || null,
                companyName: userData?.companyName || null,
                companyWebsiteUrl: userData?.companyWebsiteUrl || null,
                companyLocation: userData?.companyLocation || null,
                // Social Media Profiles
                linkedinProfile: userData?.linkedinProfile || null,
                instagramProfile: userData?.instagramProfile || null,
                facebookProfile: userData?.facebookProfile || null,
                twitterProfile: userData?.twitterProfile || null,
                personalWebsite: userData?.personalWebsite || null,
                // Business Information
                googleReviewLink: userData?.googleReviewLink || null,
                businessContact: userData?.businessContact || null,
                businessEmailAddress: userData?.businessEmailAddress || null,
                // Public URL info
                publicUrl: userData?.publicUrl || null,
                urlSlug: userData?.urlSlug || null,
                // System fields (formatted for display)
                createdAt: userData?.createdAt ? userData.createdAt.toDate() : null,
                updatedAt: userData?.updatedAt ? userData.updatedAt.toDate() : null
            };
            // Track page view
            try {
                const now = admin.firestore.Timestamp.now();
                const batch = db.batch();
                // 1. Update user's total view count
                const userUpdateRef = db.collection('users').doc(userId);
                batch.update(userUpdateRef, {
                    totalViews: admin.firestore.FieldValue.increment(1),
                    lastViewedAt: now
                });
                // 2. Add to global analytics
                const analyticsRef = db.collection('analytics').doc('global');
                batch.set(analyticsRef, {
                    totalProfileViews: admin.firestore.FieldValue.increment(1),
                    lastUpdated: now
                }, { merge: true });
                // 3. Record individual view event (for detailed analytics)
                const viewEventRef = db.collection('viewEvents').doc();
                batch.set(viewEventRef, {
                    userId: userId,
                    slug: slug,
                    timestamp: now,
                    userAgent: req.headers['user-agent'] || null,
                    referer: req.headers.referer || null,
                    ip: req.ip || req.connection.remoteAddress || null
                });
                // Execute all updates
                await batch.commit();
                console.log(`Page view tracked for user ${userId} (${slug})`);
            }
            catch (viewError) {
                console.error('Error tracking page view:', viewError);
                // Don't fail the main request if view tracking fails
            }
            // Send success response
            res.status(200).json({
                success: true,
                message: 'User data retrieved successfully',
                slug: slug,
                data: publicUserData
            });
        }
        catch (err) {
            console.error('getUserByUrl error:', err);
            // Handle specific Firestore errors
            if (err instanceof Error) {
                if (err.message.includes('PERMISSION_DENIED')) {
                    res.status(403).json({ error: 'Permission denied to read user data' });
                }
                else if (err.message.includes('NOT_FOUND')) {
                    res.status(404).json({ error: 'URL or user not found' });
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
exports.getUserByUrl = getUserByUrl;
//# sourceMappingURL=getUserByUrl.js.map