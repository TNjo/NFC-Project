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
exports.getAllUsers = void 0;
const admin = __importStar(require("firebase-admin"));
const cors_1 = __importDefault(require("cors"));
const corsHandler = (0, cors_1.default)({ origin: true });
const getAllUsers = (req, res) => {
    corsHandler(req, res, async () => {
        try {
            // 1) Get query parameters for pagination and filtering
            const limit = parseInt(req.query.limit) || 50; // Default 50 users per page
            const lastUserId = req.query.lastUserId;
            const searchTerm = req.query.search;
            const companyFilter = req.query.company;
            // Validate limit
            if (limit > 100) {
                res.status(400).json({ error: 'Limit cannot exceed 100 users per request' });
                return;
            }
            // 2) Build Firestore query
            const db = admin.firestore();
            let query = db.collection('users').orderBy('createdAt', 'desc');
            // Apply limit
            query = query.limit(limit);
            // Handle pagination
            if (lastUserId) {
                const lastUserDoc = await db.collection('users').doc(lastUserId).get();
                if (lastUserDoc.exists) {
                    query = query.startAfter(lastUserDoc);
                }
            }
            // 3) Execute query
            const snapshot = await query.get();
            if (snapshot.empty) {
                res.status(200).json({
                    success: true,
                    users: [],
                    totalCount: 0,
                    hasMore: false,
                    message: 'No users found'
                });
                return;
            }
            // 4) Process results
            let users = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            // 5) Apply client-side filtering if needed (for complex searches)
            if (searchTerm) {
                const searchLower = searchTerm.toLowerCase();
                users = users.filter(user => user.fullName?.toLowerCase().includes(searchLower) ||
                    user.displayName?.toLowerCase().includes(searchLower) ||
                    user.emailAddress?.toLowerCase().includes(searchLower) ||
                    user.companyName?.toLowerCase().includes(searchLower) ||
                    user.designation?.toLowerCase().includes(searchLower));
            }
            if (companyFilter) {
                const companyLower = companyFilter.toLowerCase();
                users = users.filter(user => user.companyName?.toLowerCase().includes(companyLower));
            }
            // 6) Determine if there are more results
            const hasMore = snapshot.docs.length === limit;
            const lastVisible = snapshot.docs[snapshot.docs.length - 1];
            // 7) Send response
            res.status(200).json({
                success: true,
                users: users,
                totalCount: users.length,
                hasMore: hasMore,
                lastUserId: lastVisible?.id || null,
                pagination: {
                    limit: limit,
                    currentPage: lastUserId ? 'next' : 'first'
                },
                filters: {
                    search: searchTerm || null,
                    company: companyFilter || null
                }
            });
        }
        catch (err) {
            console.error('getAllUsers error:', err);
            // Handle specific Firestore errors
            if (err instanceof Error) {
                if (err.message.includes('PERMISSION_DENIED')) {
                    res.status(403).json({ error: 'Permission denied to read users' });
                }
                else if (err.message.includes('INVALID_ARGUMENT')) {
                    res.status(400).json({ error: 'Invalid query parameters' });
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
exports.getAllUsers = getAllUsers;
//# sourceMappingURL=getAllUsers.js.map