// context/AuthContext.tsx
'use client'

import React, {
  createContext, useContext, useEffect, useState
} from 'react'
import { onAuthStateChanged, User } from 'firebase/auth'
import { auth } from '../lib/firebase'

interface AuthContextValue { user: User | null }
const AuthContext = createContext<AuthContextValue>({ user: null })

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, u => setUser(u))
    return unsubscribe
  }, [])

  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
