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
exports.deleteUserAnalytics = void 0;
const admin = __importStar(require("firebase-admin"));
const cors_1 = __importDefault(require("cors"));
const corsHandler = (0, cors_1.default)({ origin: true });
// Delete user analytics data within a date range
const deleteUserAnalytics = (req, res) => {
    corsHandler(req, res, async () => {
        try {
            console.log('Delete analytics request:', req.body);
            const { userId, startDate, endDate, deleteViews, deleteSaves } = req.body;
            // Validate required fields
            if (!userId || !startDate || !endDate) {
                res.status(400).json({
                    success: false,
                    error: 'Missing required fields: userId, startDate, endDate'
                });
                return;
            }
            // Validate at least one action is selected
            if (!deleteViews && !deleteSaves) {
                res.status(400).json({
                    success: false,
                    error: 'At least one action must be selected (deleteViews or deleteSaves)'
                });
                return;
            }
            const db = admin.firestore();
            // Convert dates to Firestore timestamps
            // Set start time to beginning of day (00:00:00)
            const startDate_obj = new Date(startDate);
            startDate_obj.setHours(0, 0, 0, 0);
            // Set end time to end of day (23:59:59.999)
            const endDate_obj = new Date(endDate);
            endDate_obj.setHours(23, 59, 59, 999);
            const startTimestamp = admin.firestore.Timestamp.fromDate(startDate_obj);
            const endTimestamp = admin.firestore.Timestamp.fromDate(endDate_obj);
            console.log('Date range:', {
                startDate,
                endDate,
                startTimestamp: startTimestamp.toDate().toISOString(),
                endTimestamp: endTimestamp.toDate().toISOString()
            });
            let deletedViewsCount = 0;
            let deletedSavesCount = 0;
            // Delete profile views
            if (deleteViews) {
                // Query all views for this user from BOTH collections
                const viewsQuery = db.collection('viewEvents')
                    .where('userId', '==', userId);
                const viewsSnapshot = await viewsQuery.get();
                console.log(`=== DELETE VIEWS DEBUG ===`);
                console.log(`Total views found: ${viewsSnapshot.size}`);
                console.log(`Date range: ${startDate} (${startTimestamp.toDate().toISOString()}) to ${endDate} (${endTimestamp.toDate().toISOString()})`);
                // Filter by date range in memory and log details
                const viewsToDelete = viewsSnapshot.docs.filter((doc) => {
                    const data = doc.data();
                    const timestamp = data.timestamp;
                    if (!timestamp) {
                        console.log(`⚠️ View ${doc.id} has NO timestamp`);
                        return false;
                    }
                    const docDate = timestamp.toDate();
                    const timestampMillis = timestamp.toMillis();
                    const startMillis = startTimestamp.toMillis();
                    const endMillis = endTimestamp.toMillis();
                    const inRange = timestampMillis >= startMillis && timestampMillis <= endMillis;
                    console.log(`View ${doc.id}: ${docDate.toISOString()} - ${inRange ? '✓ DELETE' : '✗ KEEP'}`);
                    return inRange;
                });
                console.log(`📊 Result: ${viewsToDelete.length} views will be DELETED`);
                if (viewsToDelete.length === 0) {
                    console.log('⚠️ NO VIEWS TO DELETE - check your date range!');
                }
                // Delete in batches
                const batchSize = 500;
                const batches = [];
                let batch = db.batch();
                let operationCount = 0;
                viewsToDelete.forEach((doc) => {
                    console.log(`Deleting view: ${doc.id}`);
                    batch.delete(doc.ref);
                    operationCount++;
                    if (operationCount === batchSize) {
                        batches.push(batch.commit());
                        batch = db.batch();
                        operationCount = 0;
                    }
                });
                if (operationCount > 0) {
                    batches.push(batch.commit());
                }
                await Promise.all(batches);
                deletedViewsCount = viewsToDelete.length;
                console.log(`✅ Deleted ${deletedViewsCount} views`);
            }
            // Delete contact saves
            if (deleteSaves) {
                // Query all saves for this user from BOTH collections
                const savesQuery = db.collection('contactSaveEvents')
                    .where('userId', '==', userId);
                const savesSnapshot = await savesQuery.get();
                console.log(`=== DELETE SAVES DEBUG ===`);
                console.log(`Total saves found: ${savesSnapshot.size}`);
                console.log(`Date range: ${startDate} (${startTimestamp.toDate().toISOString()}) to ${endDate} (${endTimestamp.toDate().toISOString()})`);
                // Filter by date range in memory and log details
                const savesToDelete = savesSnapshot.docs.filter((doc) => {
                    const data = doc.data();
                    const timestamp = data.timestamp;
                    if (!timestamp) {
                        console.log(`⚠️ Save ${doc.id} has NO timestamp`);
                        return false;
                    }
                    const docDate = timestamp.toDate();
                    const timestampMillis = timestamp.toMillis();
                    const startMillis = startTimestamp.toMillis();
                    const endMillis = endTimestamp.toMillis();
                    const inRange = timestampMillis >= startMillis && timestampMillis <= endMillis;
                    console.log(`Save ${doc.id}: ${docDate.toISOString()} - ${inRange ? '✓ DELETE' : '✗ KEEP'}`);
                    return inRange;
                });
                console.log(`📊 Result: ${savesToDelete.length} saves will be DELETED`);
                if (savesToDelete.length === 0) {
                    console.log('⚠️ NO SAVES TO DELETE - check your date range!');
                }
                // Delete in batches
                const batchSize = 500;
                const batches = [];
                let batch = db.batch();
                let operationCount = 0;
                savesToDelete.forEach((doc) => {
                    console.log(`Deleting save: ${doc.id}`);
                    batch.delete(doc.ref);
                    operationCount++;
                    if (operationCount === batchSize) {
                        batches.push(batch.commit());
                        batch = db.batch();
                        operationCount = 0;
                    }
                });
                if (operationCount > 0) {
                    batches.push(batch.commit());
                }
                await Promise.all(batches);
                deletedSavesCount = savesToDelete.length;
                console.log(`✅ Deleted ${deletedSavesCount} saves`);
            }
            // Recalculate totals for the user
            const viewsQuery = db.collection('viewEvents').where('userId', '==', userId);
            const savesQuery = db.collection('contactSaveEvents').where('userId', '==', userId);
            const [viewsCount, savesCount] = await Promise.all([
                viewsQuery.count().get(),
                savesQuery.count().get()
            ]);
            const totalViews = viewsCount.data().count;
            const totalSaves = savesCount.data().count;
            // Get last view and save timestamps (fetch all and find latest in memory to avoid index)
            const allViewsSnapshot = await db.collection('viewEvents')
                .where('userId', '==', userId)
                .get();
            const allSavesSnapshot = await db.collection('contactSaveEvents')
                .where('userId', '==', userId)
                .get();
            // Find the latest timestamps by sorting in memory
            let lastViewedAt = null;
            if (!allViewsSnapshot.empty) {
                const sortedViews = allViewsSnapshot.docs
                    .map(doc => doc.data().timestamp)
                    .filter(ts => ts !== null && ts !== undefined)
                    .sort((a, b) => b.toMillis() - a.toMillis());
                lastViewedAt = sortedViews.length > 0 ? sortedViews[0] : null;
            }
            let lastContactSavedAt = null;
            if (!allSavesSnapshot.empty) {
                const sortedSaves = allSavesSnapshot.docs
                    .map(doc => doc.data().timestamp)
                    .filter(ts => ts !== null && ts !== undefined)
                    .sort((a, b) => b.toMillis() - a.toMillis());
                lastContactSavedAt = sortedSaves.length > 0 ? sortedSaves[0] : null;
            }
            // Update user document with new totals
            await db.collection('users').doc(userId).update({
                totalViews: totalViews,
                totalContactSaves: totalSaves,
                lastViewedAt: lastViewedAt,
                lastContactSavedAt: lastContactSavedAt,
                updatedAt: admin.firestore.Timestamp.now()
            });
            console.log('Analytics deletion completed:', {
                deletedViewsCount,
                deletedSavesCount,
                newTotalViews: totalViews,
                newTotalSaves: totalSaves
            });
            // Return success response
            res.status(200).json({
                success: true,
                message: 'Analytics data deleted successfully',
                data: {
                    deletedViewsCount,
                    deletedSavesCount,
                    newTotalViews: totalViews,
                    newTotalSaves: totalSaves,
                    lastViewedAt: lastViewedAt,
                    lastContactSavedAt: lastContactSavedAt
                }
            });
        }
        catch (error) {
            console.error('deleteUserAnalytics error:', error);
            console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
            res.status(500).json({
                success: false,
                error: 'Failed to delete analytics data',
                details: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    });
};
exports.deleteUserAnalytics = deleteUserAnalytics;
//# sourceMappingURL=deleteUserAnalytics.js.map