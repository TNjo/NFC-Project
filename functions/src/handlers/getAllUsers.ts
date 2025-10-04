// functions/src/handlers/getAllUsers.ts
import { Request, Response } from 'express';
import * as admin from 'firebase-admin';
import cors from 'cors';

const corsHandler = cors({ origin: true });

export const getAllUsers = (req: Request, res: Response): void => {
  corsHandler(req, res, async (): Promise<void> => {
    try {
      // 1) Get query parameters for pagination and filtering
      const limit = parseInt(req.query.limit as string) || 50; // Default 50 users per page
      const lastUserId = req.query.lastUserId as string;
      const searchTerm = req.query.search as string;
      const companyFilter = req.query.company as string;

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
      })) as Array<{
        id: string;
        fullName?: string;
        displayName?: string;
        emailAddress?: string;
        companyName?: string;
        designation?: string;
        [key: string]: any;
      }>;

      // 5) Apply client-side filtering if needed (for complex searches)
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        users = users.filter(user => 
          user.fullName?.toLowerCase().includes(searchLower) ||
          user.displayName?.toLowerCase().includes(searchLower) ||
          user.emailAddress?.toLowerCase().includes(searchLower) ||
          user.companyName?.toLowerCase().includes(searchLower) ||
          user.designation?.toLowerCase().includes(searchLower)
        );
      }

      if (companyFilter) {
        const companyLower = companyFilter.toLowerCase();
        users = users.filter(user => 
          user.companyName?.toLowerCase().includes(companyLower)
        );
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

    } catch (err) {
      console.error('getAllUsers error:', err);
      
      // Handle specific Firestore errors
      if (err instanceof Error) {
        if (err.message.includes('PERMISSION_DENIED')) {
          res.status(403).json({ error: 'Permission denied to read users' });
        } else if (err.message.includes('INVALID_ARGUMENT')) {
          res.status(400).json({ error: 'Invalid query parameters' });
        } else {
          res.status(500).json({ error: 'Internal server error' });
        }
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  });
};
