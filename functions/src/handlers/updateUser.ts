// functions/src/handlers/updateUser.ts
import { Request, Response } from 'express';
import * as admin from 'firebase-admin';
import cors from 'cors';
import { ComprehensiveUser } from './addUser';

const corsHandler = cors({ origin: true });

export const updateUser = (req: Request, res: Response): void => {
  corsHandler(req, res, async (): Promise<void> => {
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
      const {
        prefixes,
        profilePicture,
        backgroundImageUrl,
        backgroundColors,
        fullName,
        displayName,
        cardPrintName,
        primaryContactNumber,
        secondaryContactNumber,
        whatsappNumber,
        emailAddress,
        designation,
        companyName,
        companyWebsiteUrl,
        companyLocation,
        linkedinProfile,
        instagramProfile,
        facebookProfile,
        twitterProfile,
        personalWebsite,
        googleReviewLink,
        businessContact,
        businessEmailAddress
      } = req.body;

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
      const updateData: Partial<ComprehensiveUser> = {
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      };

      // Only include fields that are provided in the request
      if (prefixes !== undefined) updateData.prefixes = prefixes;
      if (profilePicture !== undefined) updateData.profilePicture = profilePicture;
      if (backgroundImageUrl !== undefined) updateData.backgroundImageUrl = backgroundImageUrl;
      if (backgroundColors !== undefined) updateData.backgroundColors = backgroundColors;
      if (fullName !== undefined) updateData.fullName = fullName;
      if (displayName !== undefined) updateData.displayName = displayName;
      if (cardPrintName !== undefined) updateData.cardPrintName = cardPrintName;
      if (primaryContactNumber !== undefined) updateData.primaryContactNumber = primaryContactNumber;
      if (secondaryContactNumber !== undefined) updateData.secondaryContactNumber = secondaryContactNumber;
      if (whatsappNumber !== undefined) updateData.whatsappNumber = whatsappNumber;
      if (emailAddress !== undefined) updateData.emailAddress = emailAddress;
      if (designation !== undefined) updateData.designation = designation;
      if (companyName !== undefined) updateData.companyName = companyName;
      if (companyWebsiteUrl !== undefined) updateData.companyWebsiteUrl = companyWebsiteUrl;
      if (companyLocation !== undefined) updateData.companyLocation = companyLocation;
      if (linkedinProfile !== undefined) updateData.linkedinProfile = linkedinProfile;
      if (instagramProfile !== undefined) updateData.instagramProfile = instagramProfile;
      if (facebookProfile !== undefined) updateData.facebookProfile = facebookProfile;
      if (twitterProfile !== undefined) updateData.twitterProfile = twitterProfile;
      if (personalWebsite !== undefined) updateData.personalWebsite = personalWebsite;
      if (googleReviewLink !== undefined) updateData.googleReviewLink = googleReviewLink;
      if (businessContact !== undefined) updateData.businessContact = businessContact;
      if (businessEmailAddress !== undefined) updateData.businessEmailAddress = businessEmailAddress;

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

    } catch (err) {
      console.error('updateUser error:', err);
      
      // Handle specific Firestore errors
      if (err instanceof Error) {
        if (err.message.includes('PERMISSION_DENIED')) {
          res.status(403).json({ error: 'Permission denied to update user' });
        } else if (err.message.includes('INVALID_ARGUMENT')) {
          res.status(400).json({ error: 'Invalid data format provided' });
        } else {
          res.status(500).json({ error: 'Internal server error' });
        }
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  });
};
