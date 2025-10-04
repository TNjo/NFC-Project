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
exports.getAnalytics = void 0;
const admin = __importStar(require("firebase-admin"));
const cors_1 = __importDefault(require("cors"));
const corsHandler = (0, cors_1.default)({ origin: true });
const getAnalytics = (req, res) => {
    corsHandler(req, res, async () => {
        try {
            const db = admin.firestore();
            const now = new Date();
            const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
            const sixtyDaysAgo = new Date(now.getTime() - (60 * 24 * 60 * 60 * 1000));
            // Get all users
            const usersSnapshot = await db.collection('users').get();
            const users = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            // Calculate total users
            const totalUsers = users.length;
            // Calculate active users (users with required fields)
            const activeUsers = users.filter(user => user.fullName &&
                user.emailAddress &&
                (user.primaryContactNumber || user.phoneNumber)).length;
            // Calculate recent users (last 30 days)
            const recentUsers = users.filter(user => {
                const createdAt = user.createdAt?.toDate ? user.createdAt.toDate() : new Date(user.createdAt);
                return createdAt >= thirtyDaysAgo;
            }).length;
            // Calculate previous month users for growth rate
            const previousMonthUsers = users.filter(user => {
                const createdAt = user.createdAt?.toDate ? user.createdAt.toDate() : new Date(user.createdAt);
                return createdAt >= sixtyDaysAgo && createdAt < thirtyDaysAgo;
            }).length;
            // Calculate growth rate
            let growthRate = '0%';
            if (previousMonthUsers > 0) {
                const growth = ((recentUsers - previousMonthUsers) / previousMonthUsers) * 100;
                growthRate = `${Math.round(growth)}%`;
            }
            else if (recentUsers > 0) {
                growthRate = '100%'; // First month with users
            }
            // Get profile views from global analytics collection
            let totalProfileViews = 0;
            try {
                const globalAnalyticsSnapshot = await db.collection('analytics').doc('global').get();
                if (globalAnalyticsSnapshot.exists) {
                    totalProfileViews = globalAnalyticsSnapshot.data()?.totalProfileViews || 0;
                }
                else {
                    // Sum up individual user views if global count doesn't exist
                    const userViewsTotal = users.reduce((sum, user) => {
                        return sum + (user.totalViews || 0);
                    }, 0);
                    totalProfileViews = userViewsTotal;
                }
            }
            catch (error) {
                console.error('Error fetching profile views:', error);
                // Fallback: sum user views
                totalProfileViews = users.reduce((sum, user) => sum + (user.totalViews || 0), 0);
            }
            // Get top companies
            const companyCount = {};
            users.forEach(user => {
                const company = user.companyName || 'Independent';
                companyCount[company] = (companyCount[company] || 0) + 1;
            });
            const topCompanies = Object.entries(companyCount)
                .map(([name, count]) => ({ name, count }))
                .sort((a, b) => b.count - a.count)
                .slice(0, 5);
            // Get recent registrations (last 10)
            const recentRegistrations = users
                .filter(user => user.createdAt)
                .sort((a, b) => {
                const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
                const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
                return dateB.getTime() - dateA.getTime();
            })
                .slice(0, 10)
                .map(user => ({
                id: user.id,
                fullName: user.fullName || user.displayName || 'Unknown User',
                companyName: user.companyName,
                createdAt: user.createdAt
            }));
            // Generate monthly stats for the last 6 months
            const monthlyStats = [];
            for (let i = 5; i >= 0; i--) {
                const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
                const nextMonthDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
                const monthName = monthDate.toLocaleDateString('en-US', {
                    month: 'short',
                    year: '2-digit'
                });
                const monthRegistrations = users.filter(user => {
                    const createdAt = user.createdAt?.toDate ? user.createdAt.toDate() : new Date(user.createdAt);
                    return createdAt >= monthDate && createdAt < nextMonthDate;
                }).length;
                monthlyStats.push({
                    month: monthName,
                    registrations: monthRegistrations
                });
            }
            // Get top viewed cards
            const topViewedCards = users
                .filter(user => user.totalViews > 0)
                .sort((a, b) => (b.totalViews || 0) - (a.totalViews || 0))
                .slice(0, 10)
                .map(user => ({
                id: user.id,
                fullName: user.fullName || user.displayName || 'Unknown User',
                companyName: user.companyName,
                totalViews: user.totalViews || 0,
                lastViewedAt: user.lastViewedAt
            }));
            // Get recent view events (last 20)
            let recentViews = [];
            try {
                const recentViewsSnapshot = await db.collection('viewEvents')
                    .orderBy('timestamp', 'desc')
                    .limit(20)
                    .get();
                recentViews = await Promise.all(recentViewsSnapshot.docs.map(async (doc) => {
                    const viewData = doc.data();
                    const user = users.find(u => u.id === viewData.userId);
                    return {
                        userId: viewData.userId,
                        fullName: user?.fullName || user?.displayName || 'Unknown User',
                        viewedAt: viewData.timestamp,
                        slug: viewData.slug
                    };
                }));
            }
            catch (error) {
                console.error('Error fetching recent views:', error);
                recentViews = [];
            }
            const analyticsData = {
                totalUsers,
                activeUsers,
                totalProfileViews,
                recentUsers,
                growthRate,
                topCompanies,
                recentRegistrations,
                monthlyStats,
                topViewedCards,
                recentViews
            };
            res.status(200).json({
                success: true,
                data: analyticsData,
                generatedAt: new Date().toISOString()
            });
        }
        catch (error) {
            console.error('getAnalytics error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to fetch analytics data',
                details: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    });
};
exports.getAnalytics = getAnalytics;
//# sourceMappingURL=getAnalytics.js.map