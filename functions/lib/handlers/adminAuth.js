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
exports.verifyAdminToken = exports.adminLogin = exports.createAdmin = exports.verifyToken = void 0;
const admin = __importStar(require("firebase-admin"));
const cors_1 = __importDefault(require("cors"));
const jwt = __importStar(require("jsonwebtoken"));
const bcrypt = __importStar(require("bcryptjs"));
// Configure CORS with explicit origins
const corsOptions = {
    origin: [
        'http://localhost:3000',
        'http://localhost:3001',
        'https://burjcode-profile-dev.web.app',
        'https://burjcode-profile-dev.firebaseapp.com',
        'https://nfc-project-opal.vercel.app',
        'https://digitalprofile.burjcodetech.com',
        'http://digitalprofile.burjcodetech.com',
        /https:\/\/nfc-project.*\.vercel\.app$/
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'Accept',
        'Origin'
    ],
    credentials: true
};
const corsHandler = (0, cors_1.default)(corsOptions);
// JWT Secret - In production, store this in environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
// Generate JWT token
function generateToken(userId, email, role) {
    return jwt.sign({
        userId,
        email,
        role,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
    }, JWT_SECRET);
}
// Verify JWT token
function verifyToken(token) {
    try {
        return jwt.verify(token, JWT_SECRET);
    }
    catch (error) {
        throw new Error('Invalid token');
    }
}
exports.verifyToken = verifyToken;
// Create first admin user (only if no admins exist)
const createAdmin = (req, res) => {
    corsHandler(req, res, async () => {
        if (req.method === 'OPTIONS') {
            res.status(200).end();
            return;
        }
        try {
            const { email, password, fullName } = req.body;
            // Validate required fields
            if (!email || !password || !fullName) {
                res.status(400).json({
                    error: 'Missing required fields: email, password, fullName'
                });
                return;
            }
            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                res.status(400).json({ error: 'Invalid email format' });
                return;
            }
            // Password strength validation
            if (password.length < 8) {
                res.status(400).json({ error: 'Password must be at least 8 characters long' });
                return;
            }
            const db = admin.firestore();
            // CRITICAL SECURITY: Check if ANY admin already exists
            const existingAdmins = await db.collection('admins').limit(1).get();
            if (!existingAdmins.empty) {
                res.status(403).json({
                    error: 'SECURITY: Admin account creation is disabled. Admin users already exist. Contact system administrator for access.',
                    code: 'ADMIN_CREATION_DISABLED'
                });
                return;
            }
            // ADDITIONAL SECURITY: Only allow specific authorized emails for first admin
            const authorizedFirstAdminEmails = [
                'admin@burjcode.com',
                'tharuka@burjcode.com',
                'contact@burjcode.com',
                // Add more authorized emails here
            ];
            if (!authorizedFirstAdminEmails.includes(email.toLowerCase())) {
                res.status(403).json({
                    error: 'SECURITY: Email not authorized for admin account creation. Contact system administrator.',
                    code: 'EMAIL_NOT_AUTHORIZED'
                });
                return;
            }
            // Check if email already exists
            const existingUser = await db.collection('admins')
                .where('email', '==', email.toLowerCase())
                .get();
            if (!existingUser.empty) {
                res.status(409).json({ error: 'Email already exists' });
                return;
            }
            // Hash password
            const hashedPassword = await bcrypt.hash(password, 12);
            // Create admin user data
            const adminData = {
                email: email.toLowerCase(),
                password: hashedPassword,
                role: 'admin',
                fullName,
                permissions: ['read', 'write', 'delete', 'admin'],
                isActive: true,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
            };
            // Save to Firestore
            const adminRef = await db.collection('admins').add(adminData);
            const adminId = adminRef.id;
            // Generate JWT token
            const token = generateToken(adminId, email.toLowerCase(), 'admin');
            // Update last login
            await adminRef.update({
                lastLogin: admin.firestore.FieldValue.serverTimestamp()
            });
            res.status(201).json({
                success: true,
                message: 'Admin user created successfully',
                data: {
                    adminId,
                    email: email.toLowerCase(),
                    fullName,
                    role: 'admin',
                    token,
                    permissions: adminData.permissions
                }
            });
        }
        catch (error) {
            console.error('createAdmin error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
};
exports.createAdmin = createAdmin;
// Admin login
const adminLogin = (req, res) => {
    corsHandler(req, res, async () => {
        if (req.method === 'OPTIONS') {
            res.status(200).end();
            return;
        }
        try {
            const { email, password } = req.body;
            // Validate required fields
            if (!email || !password) {
                res.status(400).json({
                    error: 'Missing required fields: email, password'
                });
                return;
            }
            const db = admin.firestore();
            // Find admin by email
            const adminQuery = await db.collection('admins')
                .where('email', '==', email.toLowerCase())
                .where('isActive', '==', true)
                .get();
            if (adminQuery.empty) {
                res.status(401).json({ error: 'Invalid credentials' });
                return;
            }
            const adminDoc = adminQuery.docs[0];
            const adminData = adminDoc.data();
            // Verify password
            const isPasswordValid = await bcrypt.compare(password, adminData.password);
            if (!isPasswordValid) {
                res.status(401).json({ error: 'Invalid credentials' });
                return;
            }
            // Generate JWT token
            const token = generateToken(adminDoc.id, adminData.email, adminData.role);
            // Update last login
            await adminDoc.ref.update({
                lastLogin: admin.firestore.FieldValue.serverTimestamp(),
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
            });
            res.status(200).json({
                success: true,
                message: 'Login successful',
                data: {
                    adminId: adminDoc.id,
                    email: adminData.email,
                    fullName: adminData.fullName,
                    role: adminData.role,
                    permissions: adminData.permissions,
                    token
                }
            });
        }
        catch (error) {
            console.error('adminLogin error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
};
exports.adminLogin = adminLogin;
// Verify admin token middleware
const verifyAdminToken = (req, res) => {
    corsHandler(req, res, async () => {
        if (req.method === 'OPTIONS') {
            res.status(200).end();
            return;
        }
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                res.status(401).json({ error: 'Authorization token required' });
                return;
            }
            const token = authHeader.substring(7);
            const decoded = verifyToken(token);
            const db = admin.firestore();
            const adminDoc = await db.collection('admins').doc(decoded.userId).get();
            if (!adminDoc.exists) {
                res.status(401).json({ error: 'Admin not found' });
                return;
            }
            const adminData = adminDoc.data();
            if (!adminData.isActive) {
                res.status(401).json({ error: 'Admin account is deactivated' });
                return;
            }
            res.status(200).json({
                success: true,
                valid: true,
                data: {
                    adminId: adminDoc.id,
                    email: adminData.email,
                    fullName: adminData.fullName,
                    role: adminData.role,
                    permissions: adminData.permissions
                }
            });
        }
        catch (error) {
            console.error('verifyAdminToken error:', error);
            if (error instanceof Error && error.message === 'Invalid token') {
                res.status(401).json({ error: 'Invalid or expired token' });
            }
            else {
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    });
};
exports.verifyAdminToken = verifyAdminToken;
//# sourceMappingURL=adminAuth.js.map