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
exports.deleteUser = void 0;
const admin = __importStar(require("firebase-admin"));
const cors_1 = __importDefault(require("cors"));
const corsHandler = (0, cors_1.default)({ origin: true });
const deleteUser = (req, res) => {
    corsHandler(req, res, async () => {
        try {
            // 1) Get user ID from URL parameter or body
            const userId = req.params.userId || req.body.userId || req.query.userId;
            if (!userId) {
                res.status(400).json({ error: 'Missing userId parameter' });
                return;
            }
            // 2) Validate that user exists and get user data before deletion
            const db = admin.firestore();
            const userRef = db.collection('users').doc(userId);
            const userDoc = await userRef.get();
            if (!userDoc.exists) {
                res.status(404).json({ error: 'User not found' });
                return;
            }
            // 3) Store user data for response (optional, for logging/audit purposes)
            const userData = userDoc.data();
            const userInfo = {
                fullName: userData?.fullName || 'Unknown',
                emailAddress: userData?.emailAddress || 'Unknown',
                displayName: userData?.displayName || 'Unknown'
            };
            // 4) Delete the user document
            await userRef.delete();
            // 5) Send success response
            res.status(200).json({
                success: true,
                message: 'User deleted successfully',
                userId: userId,
                deletedUser: userInfo
            });
        }
        catch (err) {
            console.error('deleteUser error:', err);
            // Handle specific Firestore errors
            if (err instanceof Error) {
                if (err.message.includes('PERMISSION_DENIED')) {
                    res.status(403).json({ error: 'Permission denied to delete user' });
                }
                else if (err.message.includes('NOT_FOUND')) {
                    res.status(404).json({ error: 'User not found' });
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
exports.deleteUser = deleteUser;
//# sourceMappingURL=deleteUser.js.map