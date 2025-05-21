import { Request, Response } from 'express';
import * as admin from 'firebase-admin';
import cors from 'cors';

const corsHandler = cors({ origin: true }); // Allow all origins (you can customize this)

export const addUser = (req: Request, res: Response): void => {
  corsHandler(req, res, async () => {
    try {
      const {
        firstName,
        lastName,
        dob,
        phoneNumber,
        address,
        theme,
        profileImageUrl 
      } = req.body;

      // Validate required fields
      if (!firstName || !lastName || !dob || !phoneNumber || !address || !theme) {
        res.status(400).json({ error: "Missing fields" });
        return;
      }

      const docRef = await admin.firestore().collection("users").add({
        firstName,
        lastName,
        dob,
        phoneNumber,
        address,
        theme,
        profileImageUrl: profileImageUrl || null, 
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      // Return new document ID
      res.status(200).json({ userId: docRef.id });
    } catch (err) {
      console.error("addUser error:", err);
      res.status(500).json({ error: "Server error" });
    }
  });
};
