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
exports.updateUser = void 0;
const admin = __importStar(require("firebase-admin"));
const cors_1 = __importDefault(require("cors"));
const corsHandler = (0, cors_1.default)({ origin: true });
const updateUser = (req, res) => {
    corsHandler(req, res, async () => {
        try {
            // 1) Get user ID from URL parameter or body
            const userId = req.params.userId || req.body.userId;
            if (!userId) {
                res.status(400).json({ error: 'Missing userId parameter' });
                return;
            }
            // 2) Validate that user exists
            const db = admin.firestore();
            const userRef = db.collection('users').doc(userId);
            const userDoc = await userRef.get();
            if (!userDoc.exists) {
                res.status(404).json({ error: 'User not found' });
                return;
            }
            // 3) Extract update fields from request body
            const { prefixes, profilePicture, backgroundImageUrl, backgroundColors, fullName, displayName, cardPrintName, primaryContactNumber, secondaryContactNumber, whatsappNumber, emailAddress, designation, companyName, companyWebsiteUrl, companyLocation, linkedinProfile, instagramProfile, facebookProfile, twitterProfile, personalWebsite, platforms, googleReviewLink, businessContact, businessEmailAddress } = req.body;
            // 4) Validate email formats if provided
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (emailAddress && !emailRegex.test(emailAddress)) {
                res.status(400).json({ error: 'Invalid email format' });
                return;
            }
            if (businessEmailAddress && !emailRegex.test(businessEmailAddress)) {
                res.status(400).json({ error: 'Invalid business email format' });
                return;
            }
            // 5) Build update object with only provided fields
            const updateData = {
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
            };
            // Only include fields that are provided in the request
            if (prefixes !== undefined)
                updateData.prefixes = prefixes;
            if (profilePicture !== undefined)
                updateData.profilePicture = profilePicture;
            if (backgroundImageUrl !== undefined)
                updateData.backgroundImageUrl = backgroundImageUrl;
            if (backgroundColors !== undefined)
                updateData.backgroundColors = backgroundColors;
            if (fullName !== undefined)
                updateData.fullName = fullName;
            if (displayName !== undefined)
                updateData.displayName = displayName;
            if (cardPrintName !== undefined)
                updateData.cardPrintName = cardPrintName;
            if (primaryContactNumber !== undefined)
                updateData.primaryContactNumber = primaryContactNumber;
            if (secondaryContactNumber !== undefined)
                updateData.secondaryContactNumber = secondaryContactNumber;
            if (whatsappNumber !== undefined)
                updateData.whatsappNumber = whatsappNumber;
            if (emailAddress !== undefined)
                updateData.emailAddress = emailAddress;
            if (designation !== undefined)
                updateData.designation = designation;
            if (companyName !== undefined)
                updateData.companyName = companyName;
            if (companyWebsiteUrl !== undefined)
                updateData.companyWebsiteUrl = companyWebsiteUrl;
            if (companyLocation !== undefined)
                updateData.companyLocation = companyLocation;
            if (linkedinProfile !== undefined)
                updateData.linkedinProfile = linkedinProfile;
            if (instagramProfile !== undefined)
                updateData.instagramProfile = instagramProfile;
            if (facebookProfile !== undefined)
                updateData.facebookProfile = facebookProfile;
            if (twitterProfile !== undefined)
                updateData.twitterProfile = twitterProfile;
            if (personalWebsite !== undefined)
                updateData.personalWebsite = personalWebsite;
            if (platforms !== undefined)
                updateData.platforms = platforms;
            if (googleReviewLink !== undefined)
                updateData.googleReviewLink = googleReviewLink;
            if (businessContact !== undefined)
                updateData.businessContact = businessContact;
            if (businessEmailAddress !== undefined)
                updateData.businessEmailAddress = businessEmailAddress;
            // 6) Check if there are any fields to update
            if (Object.keys(updateData).length <= 1) { // Only updatedAt
                res.status(400).json({ error: 'No fields provided for update' });
                return;
            }
            // 7) Update user document
            await userRef.update(updateData);
            // 8) Get updated document
            const updatedDoc = await userRef.get();
            const updatedData = updatedDoc.data();
            // 9) Send success response
            res.status(200).json({
                success: true,
                message: 'User updated successfully',
                userId: userId,
                updatedFields: Object.keys(updateData).filter(key => key !== 'updatedAt'),
                data: {
                    id: updatedDoc.id,
                    ...updatedData
                }
            });
        }
        catch (err) {
            console.error('updateUser error:', err);
            // Handle specific Firestore errors
            if (err instanceof Error) {
                if (err.message.includes('PERMISSION_DENIED')) {
                    res.status(403).json({ error: 'Permission denied to update user' });
                }
                else if (err.message.includes('INVALID_ARGUMENT')) {
                    res.status(400).json({ error: 'Invalid data format provided' });
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
exports.updateUser = updateUser;
//# sourceMappingURL=updateUser.js.map