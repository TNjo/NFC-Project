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
exports.trackProfileView = void 0;
const admin = __importStar(require("firebase-admin"));
const cors_1 = __importDefault(require("cors"));
const corsHandler = (0, cors_1.default)({ origin: true });
const trackProfileView = (req, res) => {
    corsHandler(req, res, async () => {
        try {
            const { userId, viewerInfo } = req.body;
            if (!userId) {
                res.status(400).json({
                    success: false,
                    error: 'userId is required'
                });
                return;
            }
            const db = admin.firestore();
            const batch = db.batch();
            // Create view record with timestamp and optional viewer info
            const viewData = {
                userId,
                timestamp: admin.firestore.FieldValue.serverTimestamp(),
                viewerInfo: viewerInfo || {},
                date: new Date().toISOString().split('T')[0], // For daily aggregation
            };
            // Add to profile views collection
            const viewRef = db.collection('profileViews').doc();
            batch.set(viewRef, viewData);
            // Update user document with view count
            const userRef = db.collection('users').doc(userId);
            batch.update(userRef, {
                totalViews: admin.firestore.FieldValue.increment(1),
                lastViewedAt: admin.firestore.FieldValue.serverTimestamp(),
            });
            // Update daily view count for the user
            const todayDate = new Date().toISOString().split('T')[0];
            const dailyViewRef = db.collection('userDailyViews').doc(`${userId}_${todayDate}`);
            batch.set(dailyViewRef, {
                userId,
                date: todayDate,
                viewCount: admin.firestore.FieldValue.increment(1),
                lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
            }, { merge: true });
            // Update global analytics
            const globalAnalyticsRef = db.collection('analytics').doc('global');
            batch.set(globalAnalyticsRef, {
                totalProfileViews: admin.firestore.FieldValue.increment(1),
                lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
            }, { merge: true });
            // Execute all updates atomically
            await batch.commit();
            res.status(200).json({
                success: true,
                message: 'Profile view tracked successfully',
                data: {
                    userId,
                    timestamp: new Date().toISOString(),
                }
            });
        }
        catch (error) {
            console.error('trackProfileView error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to track profile view',
                details: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    });
};
exports.trackProfileView = trackProfileView;
//# sourceMappingURL=trackProfileView.js.map