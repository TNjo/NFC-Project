import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { Cardholder, ComprehensiveUser, User, Theme } from '../types';
import { apiMethods } from '../config/api';

interface AppState {
  cardholders: Cardholder[];
  comprehensiveUsers: ComprehensiveUser[];
  currentUser: User | null;
  theme: Theme;
  isLoading: boolean;
  analyticsData: any;
}

type AppAction =
  | { type: 'SET_CARDHOLDERS'; payload: Cardholder[] }
  | { type: 'SET_COMPREHENSIVE_USERS'; payload: ComprehensiveUser[] }
  | { type: 'ADD_CARDHOLDER'; payload: Cardholder }
  | { type: 'UPDATE_CARDHOLDER'; payload: Cardholder }
  | { type: 'DELETE_CARDHOLDER'; payload: string }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_THEME'; payload: Theme }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ANALYTICS'; payload: any };

const initialState: AppState = {
  cardholders: [], // Legacy format for compatibility
  comprehensiveUsers: [], // New comprehensive user data from API
  currentUser: null,
  theme: 'light',
  isLoading: false,
  analyticsData: null,
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  addCardholder: (cardholder: Omit<Cardholder, 'id' | 'createdAt' | 'updatedAt' | 'publicUrl'>) => void;
  updateCardholder: (id: string, userData: any) => Promise<void>;
  deleteCardholder: (id: string) => Promise<void>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  toggleTheme: () => void;
  fetchUsers: () => Promise<void>;
  fetchAnalytics: () => Promise<void>;
} | null>(null);

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_CARDHOLDERS':
      return { ...state, cardholders: action.payload };
    case 'SET_COMPREHENSIVE_USERS':
      return { ...state, comprehensiveUsers: action.payload };
    case 'ADD_CARDHOLDER':
      return { ...state, cardholders: [...state.cardholders, action.payload] };
    case 'UPDATE_CARDHOLDER':
      return {
        ...state,
        cardholders: state.cardholders.map(ch =>
          ch.id === action.payload.id ? action.payload : ch
        ),
      };
    case 'DELETE_CARDHOLDER':
      return {
        ...state,
        cardholders: state.cardholders.filter(ch => ch.id !== action.payload),
      };
    case 'SET_USER':
      return { ...state, currentUser: action.payload };
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ANALYTICS':
      return { ...state, analyticsData: action.payload };
    default:
      return state;
  }
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Convert ComprehensiveUser to legacy Cardholder format for compatibility
  const convertToCardholder = (user: ComprehensiveUser): Cardholder => {
    return {
      id: user.id,
      name: user.fullName || user.displayName || 'Unknown User',
      company: user.companyName || 'Independent',
      jobTitle: user.designation || 'Professional',
      phone: user.primaryContactNumber || user.whatsappNumber || '',
      email: user.emailAddress || '',
      address: user.companyLocation || '',
      profilePhoto: user.profilePicture || '',
      socialMedia: {
        linkedin: user.linkedinProfile,
        instagram: user.instagramProfile,
        twitter: user.twitterProfile,
        website: user.personalWebsite || user.companyWebsiteUrl,
      },
      publicUrl: user.publicUrl || `/profile/${user.id}`,
      totalViews: user.totalViews || 0,
      lastViewedAt: user.lastViewedAt?.toDate ? user.lastViewedAt.toDate().toISOString() : undefined,
      createdAt: user.createdAt?.toDate ? user.createdAt.toDate().toISOString() : new Date().toISOString(),
      updatedAt: user.updatedAt?.toDate ? user.updatedAt.toDate().toISOString() : new Date().toISOString(),
    };
  };

  const fetchUsers = useCallback(async (): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await apiMethods.getAllUsers();
      
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.users) {
          // Store comprehensive users
          dispatch({ type: 'SET_COMPREHENSIVE_USERS', payload: result.users });
          
          // Convert and store as legacy cardholders for compatibility
          const legacyCardholders = result.users.map(convertToCardholder);
          dispatch({ type: 'SET_CARDHOLDERS', payload: legacyCardholders });
        }
      } else {
        console.error('Failed to fetch users:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const fetchAnalytics = useCallback(async (): Promise<void> => {
    try {
      const response = await apiMethods.getAnalytics();
      
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          dispatch({ type: 'SET_ANALYTICS', payload: result.data });
        }
      } else {
        console.error('Failed to fetch analytics:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  }, []);

  useEffect(() => {
    // Load user and theme from localStorage
    const savedUser = localStorage.getItem('currentUser');
    const savedTheme = localStorage.getItem('theme');

    if (savedUser) {
      dispatch({ type: 'SET_USER', payload: JSON.parse(savedUser) });
    }

    if (savedTheme) {
      dispatch({ type: 'SET_THEME', payload: savedTheme as Theme });
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      dispatch({ type: 'SET_THEME', payload: prefersDark ? 'dark' : 'light' });
    }

    // Fetch users and analytics data on initial load
    fetchUsers();
    fetchAnalytics();
  }, [fetchUsers, fetchAnalytics]);

  useEffect(() => {
    if (state.currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(state.currentUser));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [state.currentUser]);

  useEffect(() => {
    localStorage.setItem('theme', state.theme);
    document.documentElement.classList.toggle('dark', state.theme === 'dark');
  }, [state.theme]);

  const addCardholder = (cardholderData: Omit<Cardholder, 'id' | 'createdAt' | 'updatedAt' | 'publicUrl'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const now = new Date().toISOString();
    const cardholder: Cardholder = {
      ...cardholderData,
      id,

      publicUrl: `${window.location.origin}/card/${id}`,
      createdAt: now,
      updatedAt: now,
    };
    dispatch({ type: 'ADD_CARDHOLDER', payload: cardholder });
  };

  const updateCardholder = useCallback(async (id: string, userData: any) => {
    try {
      // Call API to update user
      const response = await apiMethods.updateUser(id, userData);
      
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          // Refresh users to get updated data
          await fetchUsers();
        } else {
          throw new Error(result.error || 'Failed to update user');
        }
      } else {
        throw new Error('Failed to update user');
      }
    } catch (error) {
      console.error('Error updating cardholder:', error);
      throw error; // Re-throw so the component can handle it
    }
  }, [fetchUsers]);

  const deleteCardholder = useCallback(async (id: string) => {
    try {
      // Call API to delete user
      const response = await apiMethods.deleteUser(id);
      
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          // Remove from local state
          dispatch({ type: 'DELETE_CARDHOLDER', payload: id });
        } else {
          throw new Error(result.error || 'Failed to delete user');
        }
      } else {
        throw new Error('Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting cardholder:', error);
      throw error; // Re-throw so the component can handle it
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate admin login - in production, this would be a proper API call
    if (email === 'admin@nfccards.com' && password === 'admin123') {
      const user: User = { id: '1', email, role: 'admin' };
      dispatch({ type: 'SET_USER', payload: user });
      return true;
    }
    
    // In production, implement proper authentication with your Cloud Functions
    // For now, only admin login is supported
    return false;
  };

  const logout = () => {
    dispatch({ type: 'SET_USER', payload: null });
  };

  const toggleTheme = () => {
    dispatch({ type: 'SET_THEME', payload: state.theme === 'light' ? 'dark' : 'light' });
  };

  return (
    <AppContext.Provider value={{
      state,
      dispatch,
      addCardholder,
      updateCardholder,
      deleteCardholder,
      login,
      logout,
      toggleTheme,
      fetchUsers,
      fetchAnalytics,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}