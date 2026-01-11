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
exports.updateProfilePicture = void 0;
const admin = __importStar(require("firebase-admin"));
const multer_1 = __importDefault(require("multer"));
const path = __importStar(require("path"));
// Configure multer for memory storage
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        // Accept images only
        if (!file.mimetype.startsWith('image/')) {
            cb(new Error('Only image files are allowed'));
            return;
        }
        cb(null, true);
    },
}).single('profilePicture');
// Helper function to convert buffer to base64
const bufferToBase64 = (buffer, mimeType) => {
    const base64 = buffer.toString('base64');
    return `data:${mimeType};base64,${base64}`;
};
// Helper function to get image MIME type
const getImageMimeType = (filename) => {
    const ext = path.extname(filename).toLowerCase();
    const mimeTypes = {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.gif': 'image/gif',
        '.webp': 'image/webp'
    };
    return mimeTypes[ext] || 'image/jpeg';
};
const updateProfilePicture = (req, res) => {
    // Handle CORS
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Credentials', 'true');
    if (req.method === 'OPTIONS') {
        res.set('Access-Control-Allow-Methods', 'POST');
        res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        res.set('Access-Control-Max-Age', '3600');
        res.status(204).send('');
        return;
    }
    // Handle file upload with multer
    upload(req, res, async (err) => {
        try {
            console.log('updateProfilePicture: Starting...');
            console.log('Request method:', req.method);
            console.log('Content-Type:', req.headers['content-type']);
            // Check for multer errors
            if (err) {
                console.error('Multer error:', err);
                if (err instanceof multer_1.default.MulterError) {
                    if (err.code === 'LIMIT_FILE_SIZE') {
                        res.status(400).json({ error: 'File size must be less than 5MB' });
                        return;
                    }
                }
                res.status(400).json({
                    error: 'File upload error',
                    details: err.message
                });
                return;
            }
            // Get userId from query parameter
            const userId = req.query.userId;
            if (!userId) {
                console.error('Missing userId');
                res.status(400).json({ error: 'Missing userId parameter' });
                return;
            }
            console.log('Processing for userId:', userId);
            // Check if file was uploaded
            if (!req.file) {
                console.error('No file uploaded');
                res.status(400).json({ error: 'No file uploaded' });
                return;
            }
            console.log('File received:', req.file.originalname, 'Size:', req.file.size, 'Type:', req.file.mimetype);
            // Validate that user exists
            const db = admin.firestore();
            const userRef = db.collection('users').doc(userId);
            const userDoc = await userRef.get();
            if (!userDoc.exists) {
                console.error('User not found:', userId);
                res.status(404).json({ error: 'User not found' });
                return;
            }
            // Generate unique filename
            const timestamp = Date.now();
            const ext = path.extname(req.file.originalname);
            const basename = path.basename(req.file.originalname, ext);
            const newFilename = `${basename}_${timestamp}${ext}`;
            console.log('Uploading to Firebase Storage...');
            // Upload to Firebase Storage
            const bucket = admin.storage().bucket();
            const storageFilePath = `profile-pictures/${userId}/${newFilename}`;
            const file = bucket.file(storageFilePath);
            // Upload the buffer to Storage
            await file.save(req.file.buffer, {
                metadata: {
                    contentType: req.file.mimetype,
                    metadata: {
                        userId: userId,
                        uploadedAt: new Date().toISOString()
                    }
                }
            });
            console.log('File uploaded to Storage');
            // Make the file publicly accessible
            await file.makePublic();
            const publicUrl = `https://storage.googleapis.com/${bucket.name}/${storageFilePath}`;
            console.log('Public URL:', publicUrl);
            // Convert to base64
            console.log('Converting to base64...');
            const base64WithPrefix = bufferToBase64(req.file.buffer, req.file.mimetype);
            console.log('Base64 conversion complete (length:', req.file.buffer.length, ')');
            // Update user document
            console.log('Updating user document...');
            await userRef.update({
                profilePicture: publicUrl,
                profilePhoto: base64WithPrefix,
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
            });
            console.log('User document updated successfully');
            // Get updated user data
            const updatedDoc = await userRef.get();
            const updatedData = updatedDoc.data();
            res.status(200).json({
                success: true,
                message: 'Profile picture updated successfully',
                userId: userId,
                data: {
                    profilePicture: publicUrl,
                    profilePhoto: base64WithPrefix,
                    fullName: updatedData?.fullName,
                    displayName: updatedData?.displayName
                }
            });
        }
        catch (error) {
            console.error('updateProfilePicture error:', error);
            if (!res.headersSent) {
                if (error instanceof Error) {
                    res.status(500).json({
                        error: 'Internal server error',
                        details: error.message
                    });
                }
                else {
                    res.status(500).json({ error: 'Internal server error' });
                }
            }
        }
    });
};
exports.updateProfilePicture = updateProfilePicture;
//# sourceMappingURL=updateProfilePicture.js.map