import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { apiMethods } from '../config/api';
import Cookies from 'js-cookie';
import { RegularUser, UserAnalytics } from '../types';

// User Auth state interface
interface UserAuthState {
  user: RegularUser | null;
  analytics: UserAnalytics | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
}

// User Auth actions
type UserAuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'LOGIN_SUCCESS'; payload: RegularUser }
  | { type: 'LOGOUT' }
  | { type: 'INITIALIZE'; payload: { user: RegularUser | null } }
  | { type: 'UPDATE_USER'; payload: Partial<RegularUser> }
  | { type: 'SET_ANALYTICS'; payload: UserAnalytics };

const initialState: UserAuthState = {
  user: null,
  analytics: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  isInitialized: false,
};

// User Auth context interface
interface UserAuthContextType {
  state: UserAuthState;
  dispatch: React.Dispatch<UserAuthAction>;
  // Auth methods
  login: (credentials: { email?: string; urlSlug?: string }) => Promise<boolean>;
  logout: () => void;
  verifyToken: () => Promise<boolean>;
  fetchAnalytics: () => Promise<void>;
  refreshAnalytics: () => Promise<void>;
  updateProfilePicture: (newUrl: string) => void;
  // Utility methods
  isLoggedIn: () => boolean;
  getToken: () => string | null;
}

// User Auth reducer
function userAuthReducer(state: UserAuthState, action: UserAuthAction): UserAuthState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        isInitialized: true,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        analytics: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        isInitialized: true,
      };
    case 'INITIALIZE':
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: !!action.payload.user,
        isInitialized: true,
        isLoading: false,
        error: null,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      };
    case 'SET_ANALYTICS':
      return {
        ...state,
        analytics: action.payload,
      };
    default:
      return state;
  }
}

// Create context
const UserAuthContext = createContext<UserAuthContextType | null>(null);

// Storage keys
const USER_TOKEN_KEY = 'user_token';
const USER_DATA_KEY = 'user_data';

// UserAuthProvider component
export function UserAuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(userAuthReducer, initialState);

  // Store user data in localStorage and cookie
  const storeUserData = (userData: RegularUser) => {
    try {
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
      Cookies.set(USER_TOKEN_KEY, userData.token, {
        expires: 7, // 7 days
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });
    } catch (error) {
      console.error('Failed to store user data:', error);
    }
  };

  // Clear user data
  const clearUserData = () => {
    try {
      localStorage.removeItem(USER_DATA_KEY);
      localStorage.removeItem('user_analytics');
      Cookies.remove(USER_TOKEN_KEY);
    } catch (error) {
      console.error('Failed to clear user data:', error);
    }
  };

  // Get token from cookie
  const getToken = (): string | null => {
    return Cookies.get(USER_TOKEN_KEY) || null;
  };

  // Check if user is logged in
  const isLoggedIn = (): boolean => {
    return state.isAuthenticated && !!state.user && !!getToken();
  };

  // Verify token with backend
  const verifyToken = async (): Promise<boolean> => {
    const token = getToken();
    if (!token) {
      return false;
    }

    try {
      const response = await apiMethods.verifyUserToken(token);

      if (!response.ok) {
        clearUserData();
        dispatch({ type: 'LOGOUT' });
        return false;
      }

      const result = await response.json();

      if (result.success && result.valid) {
        const userData: RegularUser = {
          ...result.data,
          token,
        };
        dispatch({ type: 'LOGIN_SUCCESS', payload: userData });
        storeUserData(userData);
        return true;
      } else {
        clearUserData();
        dispatch({ type: 'LOGOUT' });
        return false;
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      clearUserData();
      dispatch({ type: 'LOGOUT' });
      return false;
    }
  };

  // Fetch user analytics
  const fetchAnalytics = async (): Promise<void> => {
    if (!state.user) {
      return;
    }

    const token = getToken();
    if (!token) {
      return;
    }

    try {
      // Add cache-busting timestamp to force fresh data
      const cacheBuster = new Date().getTime();
      const response = await apiMethods.getUserAnalytics(state.user.userId, token);

      if (!response.ok) {
        throw new Error('Failed to fetch analytics');
      }

      const result = await response.json();

      if (result.success && result.data) {
        // Add fetch timestamp to analytics data
        const analyticsWithTimestamp = {
          ...result.data,
          fetchedAt: cacheBuster
        };
        
        dispatch({ type: 'SET_ANALYTICS', payload: analyticsWithTimestamp });
        // Cache analytics in localStorage with timestamp
        localStorage.setItem('user_analytics', JSON.stringify(analyticsWithTimestamp));
        localStorage.setItem('user_analytics_timestamp', cacheBuster.toString());
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    }
  };

  // Refresh analytics (force reload)
  const refreshAnalytics = async (): Promise<void> => {
    localStorage.removeItem('user_analytics');
    await fetchAnalytics();
  };

  // Update profile picture immediately
  const updateProfilePicture = (newUrl: string): void => {
    if (state.analytics) {
      const updatedAnalytics = {
        ...state.analytics,
        profileInfo: {
          ...state.analytics.profileInfo,
          profilePicture: newUrl
        }
      };
      dispatch({ type: 'SET_ANALYTICS', payload: updatedAnalytics });
      localStorage.setItem('user_analytics', JSON.stringify(updatedAnalytics));
    }
  };

  // User login
  const login = async (credentials: { email?: string; urlSlug?: string }): Promise<boolean> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const response = await apiMethods.userLogin(credentials);

      if (!response.ok) {
        const errorData = await response.json();
        dispatch({ type: 'SET_ERROR', payload: errorData.error || 'Login failed' });
        return false;
      }

      const result = await response.json();

      if (result.success && result.data) {
        const userData: RegularUser = result.data;

        dispatch({ type: 'LOGIN_SUCCESS', payload: userData });
        storeUserData(userData);

        // Fetch analytics after successful login
        setTimeout(() => {
          fetchAnalytics();
        }, 500);

        return true;
      } else {
        dispatch({ type: 'SET_ERROR', payload: result.error || 'Login failed' });
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Network error during login. Please try again.' });
      return false;
    }
  };

  // Logout
  const logout = () => {
    dispatch({ type: 'LOGOUT' });
    clearUserData();
  };

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      // Skip for public routes
      if (typeof window !== 'undefined') {
        const pathname = window.location.pathname;
        if (pathname.startsWith('/card/') || pathname === '/user-login' || pathname === '/') {
          dispatch({ type: 'INITIALIZE', payload: { user: null } });
          return;
        }
      }

      dispatch({ type: 'SET_LOADING', payload: true });

      try {
        const savedUser = localStorage.getItem(USER_DATA_KEY);
        const token = getToken();

        if (savedUser && token) {
          const userData: RegularUser = JSON.parse(savedUser);

          // Verify the token is still valid
          const isValid = await verifyToken();
          if (!isValid) {
            clearUserData();
            dispatch({ type: 'INITIALIZE', payload: { user: null } });
          } else {
            // Check if cached analytics are stale (older than 5 minutes)
            const cachedAnalytics = localStorage.getItem('user_analytics');
            const cachedTimestamp = localStorage.getItem('user_analytics_timestamp');
            const now = new Date().getTime();
            const fiveMinutes = 5 * 60 * 1000;
            
            if (cachedAnalytics && cachedTimestamp) {
              const cacheAge = now - parseInt(cachedTimestamp);
              if (cacheAge < fiveMinutes) {
                try {
                  const analyticsData = JSON.parse(cachedAnalytics);
                  dispatch({ type: 'SET_ANALYTICS', payload: analyticsData });
                } catch (error) {
                  console.error('Failed to parse cached analytics:', error);
                }
              } else {
                console.log('Cached analytics are stale, fetching fresh data');
                localStorage.removeItem('user_analytics');
                localStorage.removeItem('user_analytics_timestamp');
              }
            }
            
            // Always fetch fresh analytics in background
            fetchAnalytics();
          }
        } else {
          dispatch({ type: 'INITIALIZE', payload: { user: null } });
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        clearUserData();
        dispatch({ type: 'INITIALIZE', payload: { user: null } });
      }
    };

    initializeAuth();
  }, []);

  // Auto-refresh analytics every 2 minutes (to catch admin changes faster)
  useEffect(() => {
    if (state.isAuthenticated && state.user) {
      const interval = setInterval(() => {
        console.log('Auto-refreshing analytics...');
        fetchAnalytics();
      }, 2 * 60 * 1000); // 2 minutes

      return () => clearInterval(interval);
    }
  }, [state.isAuthenticated, state.user]);

  const contextValue: UserAuthContextType = {
    state,
    dispatch,
    login,
    logout,
    verifyToken,
    fetchAnalytics,
    refreshAnalytics,
    updateProfilePicture,
    isLoggedIn,
    getToken,
  };

  return (
    <UserAuthContext.Provider value={contextValue}>
      {children}
    </UserAuthContext.Provider>
  );
}

// Custom hook to use user auth context
export function useUserAuth() {
  const context = useContext(UserAuthContext);
  if (!context) {
    throw new Error('useUserAuth must be used within UserAuthProvider');
  }
  return context;
}

// Higher-order component for protected user routes
export function withUserAuth<T extends Record<string, unknown>>(
  Component: React.ComponentType<T>
) {
  const AuthenticatedComponent = (props: T) => {
    const { state } = useUserAuth();

    // Show loading while initializing
    if (!state.isInitialized) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    // Redirect to login if not authenticated
    if (!state.isAuthenticated || !state.user) {
      if (typeof window !== 'undefined') {
        window.location.href = '/user-login';
      }
      return null;
    }

    return <Component {...props} />;
  };

  AuthenticatedComponent.displayName = `withUserAuth(${Component.displayName || Component.name})`;
  return AuthenticatedComponent;
}




