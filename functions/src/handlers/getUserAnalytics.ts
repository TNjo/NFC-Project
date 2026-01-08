import { Request, Response } from 'express';
import * as admin from 'firebase-admin';
import cors from 'cors';

const corsHandler = cors({ origin: true });

interface UserAnalyticsData {
  userId: string;
  profileInfo: {
    fullName: string;
    displayName: string;
    profilePicture: string | null;
    designation: string | null;
    companyName: string | null;
    urlSlug: string | null;
    publicUrl: string | null;
    backgroundColors: string | null;
    backgroundImageUrl: string | null;
  };
  statistics: {
    totalViews: number;
    totalContactSaves: number;
    conversionRate: string;
    lastViewedAt: any;
    lastContactSavedAt: any;
  };
  trends: {
    viewsLast7Days: number;
    viewsLast30Days: number;
    savesLast7Days: number;
    savesLast30Days: number;
    viewsChangePercent: string;
    savesChangePercent: string;
  };
  recentActivity: Array<{
    type: 'view' | 'save';
    timestamp: any;
    metadata?: any;
  }>;
  chartData: {
    daily: Array<{
      date: string;
      views: number;
      saves: number;
    }>;
    weekly: Array<{
      week: string;
      views: number;
      saves: number;
    }>;
    monthly: Array<{
      month: string;
      views: number;
      saves: number;
    }>;
  };
}

// Helper function to get date range
const getDateRange = (days: number): Date => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(0, 0, 0, 0);
  return date;
};

// Helper function to format date
const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

// Helper function to get week label
const getWeekLabel = (date: Date): string => {
  const month = date.toLocaleDateString('en-US', { month: 'short' });
  const day = date.getDate();
  return `${month} ${day}`;
};

export const getUserAnalytics = (req: Request, res: Response): void => {
  corsHandler(req, res, async (): Promise<void> => {
    try {
      console.log('getUserAnalytics called');
      // Get userId from query parameter or from authenticated token
      let userId = req.query.userId as string;
      console.log('UserId from query:', userId);

      // If no userId in query, try to get from auth token
      if (!userId) {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
          const token = authHeader.split('Bearer ')[1];
          try {
            const decodedToken = await admin.auth().verifyIdToken(token);
            userId = decodedToken.uid;
          } catch (error) {
            res.status(401).json({
              success: false,
              error: 'Invalid authentication token'
            });
            return;
          }
        }
      }

      if (!userId) {
        res.status(400).json({
          success: false,
          error: 'User ID is required'
        });
        return;
      }

      const db = admin.firestore();

      // Get user document
      const userDoc = await db.collection('users').doc(userId).get();

      if (!userDoc.exists) {
        res.status(404).json({
          success: false,
          error: 'User not found'
        });
        return;
      }

      const userData = userDoc.data();
      if (!userData) {
        console.log('User data not found for userId:', userId);
        res.status(404).json({
          success: false,
          error: 'User data not found'
        });
        return;
      }
      
      console.log('User found:', { 
        fullName: userData.fullName, 
        email: userData.emailAddress,
        lastViewedAt: userData.lastViewedAt,
        lastContactSavedAt: userData.lastContactSavedAt,
        totalViews: userData.totalViews,
        totalContactSaves: userData.totalContactSaves
      });

      // Calculate date ranges
      const now = new Date();
      const last7Days = getDateRange(7);
      const last14Days = getDateRange(14);
      const last30Days = getDateRange(30);
      const last60Days = getDateRange(60);

      // Get view events for this user
      let viewEvents: any[] = [];
      try {
        const viewEventsSnapshot = await db.collection('viewEvents')
          .where('userId', '==', userId)
          .orderBy('timestamp', 'desc')
          .limit(1000)
          .get();

        viewEvents = viewEventsSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            timestamp: data.timestamp,
            userId: data.userId,
            slug: data.slug,
            userAgent: data.userAgent,
            referer: data.referer,
            ip: data.ip,
            metadata: data.metadata
          };
        });
      } catch (error) {
        console.warn('Could not fetch view events (index may be missing):', error);
        // Try without orderBy if index doesn't exist
        try {
          const viewEventsSnapshot = await db.collection('viewEvents')
            .where('userId', '==', userId)
            .limit(1000)
            .get();

          viewEvents = viewEventsSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              timestamp: data.timestamp,
              userId: data.userId,
              slug: data.slug,
              userAgent: data.userAgent,
              referer: data.referer,
              ip: data.ip,
              metadata: data.metadata
            };
          }).sort((a, b) => {
            const timeA = a.timestamp?.toDate?.() || new Date(0);
            const timeB = b.timestamp?.toDate?.() || new Date(0);
            return timeB.getTime() - timeA.getTime();
          });
        } catch (err) {
          console.error('Failed to fetch view events:', err);
        }
      }

      // Get contact save events for this user
      let saveEvents: any[] = [];
      try {
        const saveEventsSnapshot = await db.collection('contactSaveEvents')
          .where('userId', '==', userId)
          .orderBy('timestamp', 'desc')
          .limit(1000)
          .get();

        saveEvents = saveEventsSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            timestamp: data.timestamp,
            userId: data.userId,
            userAgent: data.userAgent,
            referer: data.referer,
            ip: data.ip,
            metadata: data.metadata
          };
        });
      } catch (error) {
        console.warn('Could not fetch save events (index may be missing):', error);
        // Try without orderBy if index doesn't exist
        try {
          const saveEventsSnapshot = await db.collection('contactSaveEvents')
            .where('userId', '==', userId)
            .limit(1000)
            .get();

          saveEvents = saveEventsSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              timestamp: data.timestamp,
              userId: data.userId,
              userAgent: data.userAgent,
              referer: data.referer,
              ip: data.ip,
              metadata: data.metadata
            };
          }).sort((a, b) => {
            const timeA = a.timestamp?.toDate?.() || new Date(0);
            const timeB = b.timestamp?.toDate?.() || new Date(0);
            return timeB.getTime() - timeA.getTime();
          });
        } catch (err) {
          console.error('Failed to fetch save events:', err);
        }
      }

      // Calculate statistics for different time periods
      const viewsLast7Days = viewEvents.filter(event => {
        const eventDate = event.timestamp.toDate();
        return eventDate >= last7Days;
      }).length;

      const viewsLast14Days = viewEvents.filter(event => {
        const eventDate = event.timestamp.toDate();
        return eventDate >= last14Days && eventDate < last7Days;
      }).length;

      const viewsLast30Days = viewEvents.filter(event => {
        const eventDate = event.timestamp.toDate();
        return eventDate >= last30Days;
      }).length;

      const savesLast7Days = saveEvents.filter(event => {
        const eventDate = event.timestamp.toDate();
        return eventDate >= last7Days;
      }).length;

      const savesLast14Days = saveEvents.filter(event => {
        const eventDate = event.timestamp.toDate();
        return eventDate >= last14Days && eventDate < last7Days;
      }).length;

      const savesLast30Days = saveEvents.filter(event => {
        const eventDate = event.timestamp.toDate();
        return eventDate >= last30Days;
      }).length;

      // Calculate percentage changes
      const viewsChangePercent = viewsLast14Days > 0 
        ? (((viewsLast7Days - viewsLast14Days) / viewsLast14Days) * 100).toFixed(1)
        : viewsLast7Days > 0 ? '+100' : '0';

      const savesChangePercent = savesLast14Days > 0
        ? (((savesLast7Days - savesLast14Days) / savesLast14Days) * 100).toFixed(1)
        : savesLast7Days > 0 ? '+100' : '0';

      // Calculate conversion rate
      const totalViews = userData.totalViews || 0;
      const totalSaves = userData.totalContactSaves || 0;
      const conversionRate = totalViews > 0 
        ? ((totalSaves / totalViews) * 100).toFixed(1)
        : '0';

      // Prepare daily chart data (last 30 days)
      const dailyData: { [key: string]: { views: number; saves: number } } = {};
      for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        dailyData[formatDate(date)] = { views: 0, saves: 0 };
      }

      // Populate daily data with actual events
      viewEvents.forEach(event => {
        if (event.timestamp && event.timestamp.toDate) {
          const eventDate = event.timestamp.toDate();
          if (eventDate >= last30Days) {
            const dateKey = formatDate(eventDate);
            if (dailyData[dateKey]) {
              dailyData[dateKey].views++;
            }
          }
        }
      });

      saveEvents.forEach(event => {
        if (event.timestamp && event.timestamp.toDate) {
          const eventDate = event.timestamp.toDate();
          if (eventDate >= last30Days) {
            const dateKey = formatDate(eventDate);
            if (dailyData[dateKey]) {
              dailyData[dateKey].saves++;
            }
          }
        }
      });

      const dailyChartData = Object.entries(dailyData).map(([date, data]) => ({
        date,
        views: data.views,
        saves: data.saves
      }));

      // Prepare weekly chart data (last 12 weeks)
      const weeklyData: Array<{ week: string; views: number; saves: number }> = [];
      for (let i = 11; i >= 0; i--) {
        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - (i * 7));
        weekStart.setHours(0, 0, 0, 0);
        
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 7);

        const weekViews = viewEvents.filter(event => {
          if (!event.timestamp || !event.timestamp.toDate) return false;
          const eventDate = event.timestamp.toDate();
          return eventDate >= weekStart && eventDate < weekEnd;
        }).length;

        const weekSaves = saveEvents.filter(event => {
          if (!event.timestamp || !event.timestamp.toDate) return false;
          const eventDate = event.timestamp.toDate();
          return eventDate >= weekStart && eventDate < weekEnd;
        }).length;

        weeklyData.push({
          week: getWeekLabel(weekStart),
          views: weekViews,
          saves: weekSaves
        });
      }

      // Prepare monthly chart data (last 6 months)
      const monthlyData: Array<{ month: string; views: number; saves: number }> = [];
      for (let i = 5; i >= 0; i--) {
        const monthDate = new Date();
        monthDate.setMonth(monthDate.getMonth() - i);
        monthDate.setDate(1);
        monthDate.setHours(0, 0, 0, 0);

        const nextMonthDate = new Date(monthDate);
        nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);

        const monthViews = viewEvents.filter(event => {
          if (!event.timestamp || !event.timestamp.toDate) return false;
          const eventDate = event.timestamp.toDate();
          return eventDate >= monthDate && eventDate < nextMonthDate;
        }).length;

        const monthSaves = saveEvents.filter(event => {
          if (!event.timestamp || !event.timestamp.toDate) return false;
          const eventDate = event.timestamp.toDate();
          return eventDate >= monthDate && eventDate < nextMonthDate;
        }).length;

        monthlyData.push({
          month: monthDate.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
          views: monthViews,
          saves: monthSaves
        });
      }

      // Combine recent activity (last 20 events)
      const recentActivity = [
        ...viewEvents.slice(0, 10).map(event => ({
          type: 'view' as const,
          timestamp: event.timestamp,
          metadata: event.metadata || null
        })),
        ...saveEvents.slice(0, 10).map(event => ({
          type: 'save' as const,
          timestamp: event.timestamp,
          metadata: event.metadata || null
        }))
      ]
        .filter(activity => activity.timestamp && activity.timestamp.toDate)
        .sort((a, b) => {
          const timeA = a.timestamp?.toDate?.() || new Date(0);
          const timeB = b.timestamp?.toDate?.() || new Date(0);
          return timeB.getTime() - timeA.getTime();
        })
        .slice(0, 20);

      // Get most recent timestamps from events if not in user document
      const mostRecentView = viewEvents.length > 0 ? viewEvents[0].timestamp : null;
      const mostRecentSave = saveEvents.length > 0 ? saveEvents[0].timestamp : null;

      // Build response
      const analyticsData: UserAnalyticsData = {
        userId,
        profileInfo: {
          fullName: userData.fullName || '',
          displayName: userData.displayName || '',
          profilePicture: userData.profilePictureBase64 || userData.profilePicture || null,
          designation: userData.designation || null,
          companyName: userData.companyName || null,
          urlSlug: userData.urlSlug || null,
          publicUrl: userData.publicUrl || null,
          backgroundColors: userData.backgroundColors || null,
          backgroundImageUrl: userData.backgroundImageUrl || null
        },
        statistics: {
          totalViews,
          totalContactSaves: totalSaves,
          conversionRate: `${conversionRate}%`,
          lastViewedAt: userData.lastViewedAt || mostRecentView || null,
          lastContactSavedAt: userData.lastContactSavedAt || mostRecentSave || null
        },
        trends: {
          viewsLast7Days,
          viewsLast30Days,
          savesLast7Days,
          savesLast30Days,
          viewsChangePercent: `${viewsChangePercent}%`,
          savesChangePercent: `${savesChangePercent}%`
        },
        recentActivity,
        chartData: {
          daily: dailyChartData,
          weekly: weeklyData,
          monthly: monthlyData
        }
      };

      console.log('Analytics data prepared successfully', {
        totalViews: analyticsData.statistics.totalViews,
        totalSaves: analyticsData.statistics.totalContactSaves,
        recentActivityCount: analyticsData.recentActivity.length
      });

      res.status(200).json({
        success: true,
        data: analyticsData,
        generatedAt: new Date().toISOString()
      });

    } catch (error) {
      console.error('getUserAnalytics error:', error);
      console.error('Error stack:', error instanceof Error ? error.stack : 'No stack');
      res.status(500).json({
        success: false,
        error: 'Failed to fetch user analytics',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
};

