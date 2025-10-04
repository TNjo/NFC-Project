/**
 * Example Usage of Auto-Save Contact Utilities
 * 
 * This file demonstrates different ways to implement auto-save contact functionality
 * in your business card page.
 */

import { useEffect } from 'react';
import { 
  autoSaveContact, 
  smartDownloadVCard, 
  shareVCard,
  hasBeenPrompted,
  markAsPrompted 
} from './autoSaveContact';
import type { ComprehensiveUser } from '../types';

// ============================================================================
// EXAMPLE 1: Pure Auto-Download (No Prompt)
// ============================================================================
// This will automatically download the vCard after 2 seconds on first visit

export const Example1_AutoDownload = ({ user, cardId }: { user: ComprehensiveUser; cardId: string }) => {
  useEffect(() => {
    if (user) {
      // Auto-save contact after 2 seconds (only once per session)
      autoSaveContact(user, cardId, 2000);
    }
  }, [user, cardId]);

  return <div>Card content here...</div>;
};

// ============================================================================
// EXAMPLE 2: Smart Download (Device-Optimized)
// ============================================================================
// Uses the best download method for the device (iOS vs Android vs Desktop)

export const Example2_SmartDownload = ({ user }: { user: ComprehensiveUser }) => {
  const handleSaveContact = () => {
    smartDownloadVCard(user);
  };

  return (
    <button onClick={handleSaveContact}>
      Save Contact (Smart)
    </button>
  );
};

// ============================================================================
// EXAMPLE 3: Share via Web Share API
// ============================================================================
// Uses native share dialog if available, falls back to download

export const Example3_ShareContact = ({ user }: { user: ComprehensiveUser }) => {
  const handleShare = async () => {
    const shared = await shareVCard(user);
    if (!shared) {
      // Fallback to download if sharing not supported
      smartDownloadVCard(user);
    }
  };

  return (
    <button onClick={handleShare}>
      Share Contact
    </button>
  );
};

// ============================================================================
// EXAMPLE 4: Conditional Auto-Save with Prompt
// ============================================================================
// Show prompt first time, auto-download if user previously saved

export const Example4_ConditionalAutoSave = ({ 
  user, 
  cardId 
}: { 
  user: ComprehensiveUser; 
  cardId: string;
}) => {
  useEffect(() => {
    if (user && cardId) {
      // Check if user has saved a contact before from this device
      const previouslySaved = hasBeenPrompted(cardId);
      
      if (previouslySaved) {
        // Auto-download for returning users
        setTimeout(() => {
          smartDownloadVCard(user);
        }, 1500);
      } else {
        // Show prompt for first-time users (already implemented in main file)
        // setShowSavePrompt(true);
      }
    }
  }, [user, cardId]);

  return <div>Card content here...</div>;
};

// ============================================================================
// EXAMPLE 5: Track Analytics with Auto-Save
// ============================================================================
// Track when users save contacts

export const Example5_AnalyticsTracking = ({ user, cardId }: { user: ComprehensiveUser; cardId: string }) => {
  const handleSaveWithAnalytics = () => {
    // Download the vCard
    smartDownloadVCard(user);
    
    // Mark as saved
    markAsPrompted(cardId);
    
    // Track in analytics (pseudo-code)
    // analytics.track('contact_saved', {
    //   cardId: cardId,
    //   userName: user.fullName,
    //   timestamp: new Date().toISOString()
    // });
    
    console.log('Contact saved and tracked!');
  };

  return (
    <button onClick={handleSaveWithAnalytics}>
      Save Contact
    </button>
  );
};

// ============================================================================
// EXAMPLE 6: Progressive Enhancement
// ============================================================================
// Try native share first, then download, with fallback

export const Example6_ProgressiveEnhancement = ({ user }: { user: ComprehensiveUser }) => {
  const handleSaveContact = async () => {
    // Try 1: Web Share API (mobile-friendly)
    const shared = await shareVCard(user);
    
    if (shared) {
      console.log('Shared via native dialog');
      return;
    }
    
    // Try 2: Smart download (device-optimized)
    smartDownloadVCard(user);
    console.log('Downloaded as vCard file');
  };

  return (
    <button onClick={handleSaveContact}>
      Save to Contacts
    </button>
  );
};

// ============================================================================
// EXAMPLE 7: Auto-Save with Toast Notification
// ============================================================================
// Show a toast notification after auto-saving

export const Example7_AutoSaveWithToast = ({ 
  user, 
  cardId,
  showToast 
}: { 
  user: ComprehensiveUser; 
  cardId: string;
  showToast: (message: string) => void;
}) => {
  useEffect(() => {
    if (user && cardId) {
      const triggered = autoSaveContact(user, cardId, 2000);
      
      if (triggered) {
        setTimeout(() => {
          showToast('Contact saved! Check your downloads folder.');
        }, 2100);
      }
    }
  }, [user, cardId, showToast]);

  return <div>Card content here...</div>;
};

// ============================================================================
// INTEGRATION EXAMPLE: How to use in your [cardId].tsx
// ============================================================================

/*
import { smartDownloadVCard, hasBeenPrompted, markAsPrompted } from '../../utils/autoSaveContact';

// In your component:
const generateVCard = () => {
  if (!user) return;
  smartDownloadVCard(user); // Use this instead of manual implementation
};

// For auto-save on load:
useEffect(() => {
  if (user && cardId && typeof cardId === 'string') {
    const prompted = hasBeenPrompted(cardId);
    if (!prompted) {
      setTimeout(() => {
        setShowSavePrompt(true);
      }, 1000);
    }
  }
}, [user, cardId]);
*/

// ============================================================================
// TESTING: How to reset auto-save status for testing
// ============================================================================

/*
// Run this in browser console to test again:
import { resetAutoSaveStatus } from './utils/autoSaveContact';
resetAutoSaveStatus('your-card-id');

// Or manually:
sessionStorage.clear();
localStorage.clear();
*/

