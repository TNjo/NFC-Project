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
exports.addUserDetails = void 0;
const admin = __importStar(require("firebase-admin"));
const cors_1 = __importDefault(require("cors"));
const corsHandler = (0, cors_1.default)({ origin: true });
const addUserDetails = (req, res) => {
    corsHandler(req, res, async () => {
        try {
            // 1) Verify ID token
            const authHeader = req.headers.authorization || '';
            const match = authHeader.match(/^Bearer (.*)$/);
            if (!match) {
                res.status(401).json({ error: 'Unauthorized: token missing' });
                return;
            }
            const decoded = await admin.auth().verifyIdToken(match[1]);
            const uid = decoded.uid;
            // 2) Validate input
            const { firstName, lastName, dob, phoneNumber, address, theme, profileImageUrl } = req.body;
            if (!firstName || !lastName || !dob || !phoneNumber || !address || !theme) {
                res.status(400).json({ error: 'Missing fields' });
                return;
            }
            // 3) Upsert under /users/{uid}
            const db = admin.firestore();
            const userRef = db.collection('users').doc(uid);
            await userRef.set({
                firstName,
                lastName,
                dob,
                phoneNumber,
                address,
                theme,
                profileImageUrl: profileImageUrl || null,
                updatedAt: admin.firestore.FieldValue.serverTimestamp(),
                createdAt: admin.firestore.FieldValue.serverTimestamp()
            }, { merge: true });
            // 4) Send response
            res.status(200).json({ userId: uid });
        }
        catch (err) {
            console.error('addUserDetails error:', err);
            res.status(500).json({ error: 'Server error' });
        }
    });
};
exports.addUserDetails = addUserDetails;
//# sourceMappingURL=addUserDetails.js.map