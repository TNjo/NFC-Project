'use client'

import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  User
} from 'firebase/auth'
import {
  doc,
  getDoc,
  setDoc
} from 'firebase/firestore'
import { auth, db } from '../lib/firebase'
import { useAuth } from '../context/AuthContext'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function AuthButtons() {
  const { user } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const login = async () => {
    setIsLoading(true)
    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      const u = result.user as User
      const ref = doc(db, 'users', u.uid)
      const snap = await getDoc(ref)

      // Determine whether they already have a role
      const existingRole = snap.exists() ? (snap.data()?.role as string) : undefined
      const roleToSet = existingRole || 'user'

      // Upsert their basic profile + role, but MERGE so you keep all other fields
      await setDoc(
        ref,
        {
          displayName: u.displayName,
          email: u.email,
          role: roleToSet
        },
        { merge: true }
      )

      // Now read back the (possibly new) role:
      const updatedSnap = await getDoc(ref)
      const role = (updatedSnap.data()?.role as string) || 'user'

      // Redirect based on role
      router.push(role === 'admin' ? '/admin' : '/dashboard')
    } catch (err) {
      console.error('Login error:', err)
      // TODO: show friendly toast/UI message
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    setIsLoading(true)
    try {
      await signOut(auth)
      router.push('/')
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return (
      <button
        onClick={login}
        disabled={isLoading}
        className="group relative flex items-center justify-center px-6 py-3 bg-white border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 ease-in-out hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed min-w-[240px]"
      >
        {isLoading ? (
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-300 border-t-blue-600"></div>
            <span className="text-gray-700 font-medium">Signing in...</span>
          </div>
        ) : (
          <div className="flex items-center space-x-3">
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span className="text-gray-700 font-medium text-sm">
              Continue with Google
            </span>
          </div>
        )}
      </button>
    )
  }

  return (
    <div className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-4 py-3 shadow-sm min-w-[320px]">
      {/* User Profile Section */}
      <div className="flex items-center space-x-3">
        {/* Profile Picture with Default Avatar */}
        <div className="relative">
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt="Profile"
              className="w-10 h-10 rounded-full border-2 border-gray-200"
            />
          ) : (
            <div className="w-10 h-10 rounded-full border-2 border-gray-200 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          )}
        </div>
        
        {/* User Info */}
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-900">
            {user.displayName || 'User'}
          </span>
          <span className="text-xs text-gray-500 truncate max-w-[150px]">
            {user.email}
          </span>
        </div>
      </div>

      {/* Sign Out Button */}
      <button
        onClick={logout}
        disabled={isLoading}
        className="flex items-center justify-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium text-sm rounded-lg transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <div className="flex items-center space-x-1">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
            <span className="hidden sm:inline ml-1">Signing out...</span>
          </div>
        ) : (
          <div className="flex items-center space-x-1">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            <span className="hidden sm:inline ml-1">Sign out</span>
          </div>
        )}
      </button>
    </div>
  )
}