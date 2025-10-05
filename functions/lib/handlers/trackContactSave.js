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
exports.trackContactSave = void 0;
const admin = __importStar(require("firebase-admin"));
const cors_1 = __importDefault(require("cors"));
const corsHandler = (0, cors_1.default)({ origin: true });
const trackContactSave = (req, res) => {
    corsHandler(req, res, async () => {
        try {
            const { userId, metadata } = req.body;
            if (!userId) {
                res.status(400).json({ error: 'Missing userId parameter' });
                return;
            }
            const db = admin.firestore();
            const now = admin.firestore.Timestamp.now();
            const batch = db.batch();
            // 1. Update user's total contact saves count
            const userRef = db.collection('users').doc(userId);
            batch.update(userRef, {
                totalContactSaves: admin.firestore.FieldValue.increment(1),
                lastContactSavedAt: now
            });
            // 2. Update global analytics
            const analyticsRef = db.collection('analytics').doc('global');
            batch.set(analyticsRef, {
                totalContactSaves: admin.firestore.FieldValue.increment(1),
                lastUpdated: now
            }, { merge: true });
            // 3. Record individual contact save event (for detailed analytics)
            const contactSaveEventRef = db.collection('contactSaveEvents').doc();
            batch.set(contactSaveEventRef, {
                userId: userId,
                timestamp: now,
                userAgent: req.headers['user-agent'] || null,
                referer: req.headers.referer || null,
                ip: req.ip || req.connection.remoteAddress || null,
                metadata: metadata || null
            });
            // Execute all updates
            await batch.commit();
            res.status(200).json({
                success: true,
                message: 'Contact save tracked successfully',
                timestamp: now
            });
        }
        catch (error) {
            console.error('trackContactSave error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to track contact save',
                details: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    });
};
exports.trackContactSave = trackContactSave;
//# sourceMappingURL=trackContactSave.js.map