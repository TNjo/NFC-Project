import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { AppProvider } from '../contexts/AppContext';
import { AuthProvider } from '../contexts/AuthContext';
import { ToastProvider } from '../contexts/ToastContext';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Check pathname from both router and window location
  const pathname = mounted && typeof window !== 'undefined' 
    ? window.location.pathname 
    : router.pathname;
  
  // Check if current route is a public card page
  const isPublicCardRoute = pathname.startsWith('/card/') || pathname === '/card/[cardId]';
  
  // For public card routes - completely standalone, no providers at all
  if (isPublicCardRoute) {
    return (
      <>
        <Component {...pageProps} />
      </>
    );
  }
  
  // For admin routes, wrap with full auth and app context
  return (
    <AuthProvider>
      <AppProvider>
        <ToastProvider>
          <Component {...pageProps} />
        </ToastProvider>
      </AppProvider>
    </AuthProvider>
  );
}