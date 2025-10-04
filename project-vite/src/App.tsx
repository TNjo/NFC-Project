import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AppProvider } from './contexts/AppContext';
import { ToastProvider } from './contexts/ToastContext';
import { useAuth } from './contexts/AuthContext';

// Lazy load pages for better performance
const HomePage = React.lazy(() => import('./pages/Home'));
const LoginPage = React.lazy(() => import('./pages/Login'));
const AdminDashboard = React.lazy(() => import('./pages/admin/Dashboard'));
const AdminCardholders = React.lazy(() => import('./pages/admin/Cardholders'));
const AdminAdd = React.lazy(() => import('./pages/admin/Add'));
const AdminSetup = React.lazy(() => import('./pages/AdminSetup'));
const ProfilePage = React.lazy(() => import('./pages/Profile'));
const CardPage = React.lazy(() => import('./pages/Card'));
const NotFoundPage = React.lazy(() => import('./pages/NotFound'));

// Loading component
function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-300">Loading...</p>
      </div>
    </div>
  );
}

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { state } = useAuth();

  if (!state.isInitialized) {
    return <LoadingFallback />;
  }

  if (!state.isAuthenticated || !state.user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

// Routes Component
function AppRoutes() {
  return (
    <React.Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin-setup" element={<AdminSetup />} />
        
        {/* Public Card Route - No Auth Required */}
        <Route path="/card/:cardId" element={<CardPage />} />
        
        {/* Protected Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/cardholders"
          element={
            <ProtectedRoute>
              <AdminCardholders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/add"
          element={
            <ProtectedRoute>
              <AdminAdd />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        
        {/* 404 Not Found */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </React.Suspense>
  );
}

// Main App Component
function App() {
  const location = useLocation();
  const isCardRoute = location.pathname.startsWith('/card/');

  // For card routes, skip Auth/App providers (public access)
  if (isCardRoute) {
    return (
      <ToastProvider>
        <AppRoutes />
      </ToastProvider>
    );
  }

  // For all other routes, use full providers
  return (
    <AuthProvider>
      <AppProvider>
        <ToastProvider>
          <AppRoutes />
        </ToastProvider>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;

