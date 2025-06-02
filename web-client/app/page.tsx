// app/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../context/AuthContext'
import AuthButtons from '../components/AuthButtons'

export default function Home() {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // when auth state stabilizes…
    if (user !== undefined) {
      if (user) {
        // fetch role from token or Firestore
        user.getIdTokenResult()
          .then(({ claims }) => {
            const role = claims.role || 'user'
            router.replace(role === 'admin' ? '/admin' : '/dashboard')
          })
          .catch(() => {
            // fallback: normal user
            router.replace('/dashboard')
          })
      } else {
        // no user → stop loading and show login
        setLoading(false)
      }
    }
  }, [user, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="relative">
          {/* Animated loading spinner */}
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-cyan-400 rounded-full animate-spin animate-reverse"></div>

          {/* Loading text */}
          <p className="text-center mt-6 text-gray-300 animate-pulse">
            Checking session...
          </p>

          {/* Floating dots */}
          <div className="flex justify-center mt-4 space-x-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce delay-150"></div>
            <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce delay-300"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Main content container */}
      <div className="relative z-10 w-full max-w-md">
        {/* Welcome card */}
        <div className="backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl p-8 hover:bg-white/15 transition-all duration-500">
          {/* Header section */}
          <div className="text-center mb-8">
            {/* Logo/Icon */}
            <div className="relative mx-auto mb-6 w-20 h-20">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-2xl">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                </svg>
              </div>
              {/* Animated rings */}
              <div className="absolute -inset-3 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-2xl opacity-20 animate-ping"></div>
              <div className="absolute -inset-6 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-2xl opacity-10 animate-ping delay-1000"></div>
            </div>

            {/* Welcome text */}
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
              Welcome to NFC Digital Profile
            </h1>
            <p className="text-gray-300 text-lg mb-2">
              Create your digital NFC profile
            </p>
            <p className="text-gray-400 text-sm">
              Connect, share, and showcase your professional identity
            </p>
          </div>

          {/* Features highlights */}
          <div className="mb-8 space-y-3">
            <div className="flex items-center space-x-3 text-gray-300">
              <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-sm">Instant profile sharing with NFC</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-300">
              <div className="w-6 h-6 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-sm">Customizable digital business cards</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-300">
              <div className="w-6 h-6 bg-gradient-to-r from-pink-500 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-sm">Real-time analytics and insights</span>
            </div>
          </div>

          {/* Auth buttons with enhanced styling */}
          <div className="space-y-4">
            <div className="relative z-20 w-full flex justify-center items-center h-full">
              <AuthButtons />
            </div>

            {/* Social proof */}
            <div className="text-center pt-4">
              <p className="text-xs text-gray-400 mb-2">Trusted by professionals worldwide</p>
              <div className="flex justify-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer text */}
        <div className="text-center mt-8">
          <p className="text-gray-400 text-xs">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>

      {/* Floating elements */}
      <div className="fixed bottom-8 left-8 pointer-events-none">
        <div className="relative">
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
          <div className="w-1 h-1 bg-cyan-500 rounded-full absolute -top-3 -left-1 animate-bounce delay-300"></div>
        </div>
      </div>

      <div className="fixed top-8 right-8 pointer-events-none">
        <div className="relative">
          <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce delay-700"></div>
          <div className="w-1 h-1 bg-purple-500 rounded-full absolute -bottom-3 -right-1 animate-bounce delay-1000"></div>
        </div>
      </div>
    </div>
  )
}