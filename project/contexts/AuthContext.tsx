import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { apiMethods } from '../config/api';
import Cookies from 'js-cookie';
import { auth } from '../config/firebase';

// Enhanced user interface
export interface AdminUser {
  adminId: string;
  email: string;
  fullName: string;
  role: 'admin';
  profilePicture?: string;
  authProvider: 'email';
  permissions: string[];
  lastLogin?: string;
  token: string;
}

// Auth state interface
interface AuthState {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
}

// Auth actions
type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'LOGIN_SUCCESS'; payload: AdminUser }
  | { type: 'LOGOUT' }
  | { type: 'INITIALIZE'; payload: { user: AdminUser | null } }
  | { type: 'UPDATE_USER'; payload: Partial<AdminUser> };

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  isInitialized: false,
};

// Auth context interface
interface AuthContextType {
  state: AuthState;
  dispatch: React.Dispatch<AuthAction>;
  // Auth methods
  emailLogin: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  verifyToken: () => Promise<boolean>;
  // Utility methods
  isLoggedIn: () => boolean;
  getToken: () => string | null;
  hasPermission: (permission: string) => boolean;
}

// Auth reducer with better error handling and state consistency
function authReducer(state: AuthState, action: AuthAction): AuthState {
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
        error: null, // Clear any previous errors on initialization
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      };
    default:
      return state;
  }
}

// Create context
const AuthContext = createContext<AuthContextType | null>(null);

// Storage keys
const TOKEN_KEY = 'admin_token';
const USER_KEY = 'admin_user';

// AuthProvider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Store user data in localStorage and cookie with error handling
  const storeUserData = (userData: AdminUser) => {
    try {
      localStorage.setItem(USER_KEY, JSON.stringify(userData));
      Cookies.set(TOKEN_KEY, userData.token, { 
        expires: 1, // 1 day
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });
    } catch (error) {
      // Silent fail
    }
  };

  // Clear user data with error handling
  const clearUserData = () => {
    try {
      localStorage.removeItem(USER_KEY);
      Cookies.remove(TOKEN_KEY);
    } catch (error) {
      // Silent fail
    }
  };

  // Get token from cookie
  const getToken = (): string | null => {
    return Cookies.get(TOKEN_KEY) || null;
  };

  // Check if user is logged in
  const isLoggedIn = (): boolean => {
    return state.isAuthenticated && !!state.user && !!getToken();
  };

  // Check user permissions
  const hasPermission = (permission: string): boolean => {
    if (!state.user) return false;
    return state.user.permissions.includes(permission) || state.user.permissions.includes('admin');
  };

  // Verify token with backend with better error handling
  const verifyToken = async (): Promise<boolean> => {
    const token = getToken();
    if (!token) {
      return false;
    }

    try {
      const response = await apiMethods.verifyAdminToken(token);
      
      if (!response.ok) {
        clearUserData();
        dispatch({ type: 'LOGOUT' });
        return false;
      }

      const result = await response.json();

      if (result.success && result.valid) {
        const userData: AdminUser = {
          ...result.data,
          token,
          authProvider: result.data.authProvider || 'email'
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
      clearUserData();
      dispatch({ type: 'LOGOUT' });
      return false;
    }
  };

  // Email/password login with improved error handling
  const emailLogin = async (email: string, password: string): Promise<boolean> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const response = await apiMethods.adminLogin({ email, password });
      
      if (!response.ok) {
        dispatch({ type: 'SET_ERROR', payload: 'Login failed. Please check your credentials.' });
        return false;
      }

      const result = await response.json();

      if (result.success && result.data) {
        const userData: AdminUser = {
          ...result.data,
          authProvider: 'email' as const
        };
        
        dispatch({ type: 'LOGIN_SUCCESS', payload: userData });
        storeUserData(userData);
        return true;
      } else {
        dispatch({ type: 'SET_ERROR', payload: result.error || 'Login failed' });
        return false;
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Network error during login. Please try again.' });
      return false;
    }
  };


  // Create first admin (registration)
  const createFirstAdmin = async (adminData: { email: string; password: string; fullName: string }): Promise<boolean> => {
    // SECURITY: This function is now disabled for security reasons
    dispatch({ type: 'SET_ERROR', payload: 'Admin account creation is disabled for security. Contact system administrator.' });
    return false;
  };

  // Logout with complete cleanup
  const logout = () => {
    // Clear authentication state
    dispatch({ type: 'LOGOUT' });
    
    // Clear stored data
    clearUserData();
    
    // Sign out from Firebase (cleanup for any remaining sessions)
    if (auth.currentUser) {
      auth.signOut().catch(() => {
        // Silent fail
      });
    }
  };

  // Initialize auth state on mount with better error handling
  useEffect(() => {
    const initializeAuth = async () => {
      // Skip auth initialization for public routes (card pages)
      if (typeof window !== 'undefined') {
        const pathname = window.location.pathname;
        if (pathname.startsWith('/card/')) {
          dispatch({ type: 'INITIALIZE', payload: { user: null } });
          return;
        }
      }
      
      dispatch({ type: 'SET_LOADING', payload: true });

      try {
        const savedUser = localStorage.getItem(USER_KEY);
        const token = getToken();

        if (savedUser && token) {
          const userData: AdminUser = JSON.parse(savedUser);
          
          // Verify the token is still valid
          const isValid = await verifyToken();
          if (!isValid) {
            clearUserData();
            dispatch({ type: 'INITIALIZE', payload: { user: null } });
          }
        } else {
          dispatch({ type: 'INITIALIZE', payload: { user: null } });
        }
      } catch (error) {
        clearUserData();
        dispatch({ type: 'INITIALIZE', payload: { user: null } });
      }
    };

    initializeAuth();
  }, []);

  // Auto-refresh token before expiration
  useEffect(() => {
    if (state.isAuthenticated && state.user) {
      const interval = setInterval(async () => {
        await verifyToken();
      }, 15 * 60 * 1000); // Check every 15 minutes

      return () => clearInterval(interval);
    }
  }, [state.isAuthenticated, state.user]);

  const contextValue: AuthContextType = {
    state,
    dispatch,
    emailLogin,
    logout,
    verifyToken,
    isLoggedIn,
    getToken,
    hasPermission,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

// Higher-order component for protected routes
export function withAuth<T extends Record<string, unknown>>(
  Component: React.ComponentType<T>
) {
  const AuthenticatedComponent = (props: T) => {
    const { state, logout } = useAuth();

    // Show loading while initializing
    if (!state.isInitialized) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    // Redirect to login if not authenticated
    if (!state.isAuthenticated || !state.user) {
      // In a real app, you'd use Next.js router here
      window.location.href = '/login';
      return null;
    }

    return <Component {...props} />;
  };

  AuthenticatedComponent.displayName = `withAuth(${Component.displayName || Component.name})`;
  return AuthenticatedComponent;
}
