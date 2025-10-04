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
exports.getUserViewAnalytics = void 0;
const admin = __importStar(require("firebase-admin"));
const cors_1 = __importDefault(require("cors"));
const corsHandler = (0, cors_1.default)({ origin: true });
const getUserViewAnalytics = (req, res) => {
    corsHandler(req, res, async () => {
        try {
            const { limit = 20, sortBy = 'totalViews', // 'totalViews', 'recentViews', 'lastViewedAt'
            userId, includeDaily = false } = req.query;
            const db = admin.firestore();
            if (userId) {
                // Get specific user analytics
                const userDoc = await db.collection('users').doc(userId).get();
                if (!userDoc.exists) {
                    res.status(404).json({
                        success: false,
                        error: 'User not found'
                    });
                    return;
                }
                const userData = userDoc.data();
                const userAnalytics = {
                    userId: userDoc.id,
                    fullName: userData?.fullName || userData?.displayName || 'Unknown User',
                    companyName: userData?.companyName,
                    profilePicture: userData?.profilePicture,
                    totalViews: userData?.totalViews || 0,
                    lastViewedAt: userData?.lastViewedAt,
                    recentViews: 0,
                    dailyViews: []
                };
                // Get recent views (last 7 days) if requested
                if (includeDaily === 'true') {
                    const sevenDaysAgo = new Date();
                    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
                    const dailyViewsSnapshot = await db.collection('userDailyViews')
                        .where('userId', '==', userId)
                        .where('date', '>=', sevenDaysAgo.toISOString().split('T')[0])
                        .orderBy('date', 'desc')
                        .get();
                    userAnalytics.dailyViews = dailyViewsSnapshot.docs.map(doc => ({
                        date: doc.data().date,
                        views: doc.data().viewCount || 0
                    }));
                    userAnalytics.recentViews = userAnalytics.dailyViews.reduce((sum, day) => sum + day.views, 0);
                }
                res.status(200).json({
                    success: true,
                    data: userAnalytics
                });
                return;
            }
            // Get all users with view analytics
            let query = db.collection('users').where('totalViews', '>', 0);
            if (sortBy === 'totalViews') {
                query = query.orderBy('totalViews', 'desc');
            }
            else if (sortBy === 'lastViewedAt') {
                query = query.orderBy('lastViewedAt', 'desc');
            }
            query = query.limit(parseInt(limit));
            const usersSnapshot = await query.get();
            if (usersSnapshot.empty) {
                res.status(200).json({
                    success: true,
                    data: [],
                    message: 'No users with profile views found'
                });
                return;
            }
            const userAnalytics = [];
            for (const userDoc of usersSnapshot.docs) {
                const userData = userDoc.data();
                const analytics = {
                    userId: userDoc.id,
                    fullName: userData.fullName || userData.displayName || 'Unknown User',
                    companyName: userData.companyName,
                    profilePicture: userData.profilePicture,
                    totalViews: userData.totalViews || 0,
                    lastViewedAt: userData.lastViewedAt,
                    recentViews: 0,
                    dailyViews: []
                };
                // Get recent views for sorting by recent activity
                if (sortBy === 'recentViews' || includeDaily === 'true') {
                    const sevenDaysAgo = new Date();
                    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
                    const dailyViewsSnapshot = await db.collection('userDailyViews')
                        .where('userId', '==', userDoc.id)
                        .where('date', '>=', sevenDaysAgo.toISOString().split('T')[0])
                        .get();
                    const dailyViews = dailyViewsSnapshot.docs.map(doc => ({
                        date: doc.data().date,
                        views: doc.data().viewCount || 0
                    }));
                    analytics.dailyViews = dailyViews;
                    analytics.recentViews = dailyViews.reduce((sum, day) => sum + day.views, 0);
                }
                userAnalytics.push(analytics);
            }
            // Sort by recent views if requested
            if (sortBy === 'recentViews') {
                userAnalytics.sort((a, b) => b.recentViews - a.recentViews);
            }
            res.status(200).json({
                success: true,
                data: userAnalytics,
                totalCount: userAnalytics.length,
                query: {
                    limit: parseInt(limit),
                    sortBy,
                    includeDaily
                }
            });
        }
        catch (error) {
            console.error('getUserViewAnalytics error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to get user view analytics',
                details: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    });
};
exports.getUserViewAnalytics = getUserViewAnalytics;
//# sourceMappingURL=getUserViewAnalytics.js.map