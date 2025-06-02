// app/admin/page.tsx
'use client'

import React, { useEffect, useState } from 'react'
import { collection, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import { useAuth } from '../../context/AuthContext'
import { useRouter } from 'next/navigation'
import { UserIcon, CrownIcon, SparklesIcon, ExternalLinkIcon, EditIcon, SaveIcon, XIcon, UsersIcon, TrendingUpIcon, EyeIcon } from 'lucide-react'

interface UserRecord {
  id: string
  displayName: string
  email: string
  role: string
  firstName?: string
  lastName?: string
  phoneNumber?: string
  address?: string
  dob?: string
  profileImageUrl?: string
  theme?: 'Classic' | 'Modern' | 'Elegant'
  createdAt?: any
  lastLogin?: any
}

export default function AdminPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [users, setUsers] = useState<UserRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<UserRecord | null>(null)
  const [editingUser, setEditingUser] = useState<UserRecord | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')

  useEffect(() => {
    if (!user) return

    const load = async () => {
      try {
        // check current user's role
        const meSnap = await getDoc(doc(db, 'users', user.uid))
        const role = meSnap.data()?.role
        if (role !== 'admin') {
          return router.push('/')
        }

        // fetch all users
        const col = collection(db, 'users')
        const snaps = await getDocs(col)
        const usersData = snaps.docs.map(d => ({ 
          id: d.id, 
          ...(d.data() as any),
          createdAt: d.data().createdAt?.toDate?.() || null,
          lastLogin: d.data().lastLogin?.toDate?.() || null
        }))
        
        // Sort by creation date (newest first)
        usersData.sort((a, b) => {
          if (!a.createdAt && !b.createdAt) return 0
          if (!a.createdAt) return 1
          if (!b.createdAt) return -1
          return b.createdAt.getTime() - a.createdAt.getTime()
        })
        
        setUsers(usersData)
        setLoading(false)
      } catch (error) {
        console.error('Error loading users:', error)
        setLoading(false)
      }
    }

    load()
  }, [user, router])

  const handleUpdateUser = async (updatedUser: UserRecord) => {
    try {
      await updateDoc(doc(db, 'users', updatedUser.id), {
        displayName: updatedUser.displayName,
        email: updatedUser.email,
        role: updatedUser.role,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        phoneNumber: updatedUser.phoneNumber,
        address: updatedUser.address,
        dob: updatedUser.dob,
        theme: updatedUser.theme
      })
      
      setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u))
      setEditingUser(null)
      alert('User updated successfully!')
    } catch (error) {
      console.error('Error updating user:', error)
      alert('Failed to update user')
    }
  }

  const generateNfcUrl = (userId: string) => {
    return `${window.location.origin}/profile/${userId}`
  }

  const openNfcProfile = (userId: string) => {
    window.open(generateNfcUrl(userId), '_blank')
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    
    return matchesSearch && matchesRole
  })

  const userStats = {
    total: users.length,
    admins: users.filter(u => u.role === 'admin').length,
    users: users.filter(u => u.role === 'user' || !u.role).length,
    withProfiles: users.filter(u => u.firstName && u.lastName).length
  }

  if (!user || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-cyan-400 rounded-full animate-spin animate-reverse"></div>
          <p className="text-center mt-6 text-gray-300 animate-pulse">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  const themeStyles = {
    Classic: "bg-white border border-gray-200 text-black",
    Modern: "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-xl",
    Elegant: "bg-gradient-to-br from-purple-200 via-white to-pink-200 border text-black"
  }

  const ThemeIcon = { Classic: UserIcon, Modern: SparklesIcon, Elegant: CrownIcon }

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-xl flex items-center justify-center">
            <CrownIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Admin Panel
            </h1>
            <p className="text-gray-400">Manage users and NFC profiles</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Users</p>
                <p className="text-2xl font-bold text-white">{userStats.total}</p>
              </div>
              <UsersIcon className="w-8 h-8 text-purple-400" />
            </div>
          </div>
          
          <div className="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Admins</p>
                <p className="text-2xl font-bold text-white">{userStats.admins}</p>
              </div>
              <CrownIcon className="w-8 h-8 text-yellow-400" />
            </div>
          </div>
          
          <div className="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Regular Users</p>
                <p className="text-2xl font-bold text-white">{userStats.users}</p>
              </div>
              <UserIcon className="w-8 h-8 text-cyan-400" />
            </div>
          </div>
          
          <div className="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Complete Profiles</p>
                <p className="text-2xl font-bold text-white">{userStats.withProfiles}</p>
              </div>
              <TrendingUpIcon className="w-8 h-8 text-green-400" />
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search users by name, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-all"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-400 transition-all"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admins</option>
            <option value="user">Users</option>
          </select>
        </div>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredUsers.map(user => (
          <div key={user.id} className="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 p-6 hover:bg-white/15 transition-all duration-300">
            {/* User Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                {user.profileImageUrl ? (
                  <img
                    src={user.profileImageUrl}
                    alt={user.displayName}
                    className="w-12 h-12 rounded-full object-cover border-2 border-white/20"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center">
                    <UserIcon className="w-6 h-6 text-white" />
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-white">
                    {user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.displayName}
                  </h3>
                  <p className="text-sm text-gray-400">{user.email}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  user.role === 'admin' 
                    ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' 
                    : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                }`}>
                  {user.role === 'admin' ? 'Admin' : 'User'}
                </span>
              </div>
            </div>

            {/* User Details */}
            <div className="space-y-2 mb-4">
              {user.phoneNumber && (
                <p className="text-sm text-gray-300">📞 {user.phoneNumber}</p>
              )}
              {user.address && (
                <p className="text-sm text-gray-300">📍 {user.address}</p>
              )}
              {user.dob && (
                <p className="text-sm text-gray-300">🎂 {new Date(user.dob).toLocaleDateString()}</p>
              )}
              {user.theme && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-300">🎨 Theme:</span>
                  <div className="flex items-center space-x-1">
                    {React.createElement(ThemeIcon[user.theme], { className: "w-4 h-4 text-gray-300" })}
                    <span className="text-sm text-gray-300">{user.theme}</span>
                  </div>
                </div>
              )}
            </div>

            {/* NFC Profile Preview */}
            {user.firstName && user.lastName && (
              <div className="mb-4">
                <p className="text-xs text-gray-400 mb-2">Profile Preview:</p>
                <div className={`rounded-lg p-3 text-center text-sm ${themeStyles[user.theme || 'Modern']}`}>
                  {user.profileImageUrl ? (
                    <img
                      src={user.profileImageUrl}
                      alt="Profile"
                      className="w-8 h-8 mx-auto rounded-full object-cover mb-1 border"
                    />
                  ) : (
                    <div className="w-8 h-8 mx-auto rounded-full bg-white/20 flex items-center justify-center mb-1">
                      <UserIcon className="w-4 h-4 opacity-70" />
                    </div>
                  )}
                  <p className="font-semibold text-xs">{user.firstName} {user.lastName}</p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-2">
              <button
                onClick={() => openNfcProfile(user.id)}
                className="flex-1 bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center space-x-1"
              >
                <EyeIcon className="w-4 h-4" />
                <span>View Profile</span>
              </button>
              
              <button
                onClick={() => setEditingUser(user)}
                className="bg-white/20 hover:bg-white/30 text-white px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center"
              >
                <EditIcon className="w-4 h-4" />
              </button>
            </div>

            {/* NFC URL */}
            <div className="mt-3 pt-3 border-t border-white/10">
              <p className="text-xs text-gray-400 mb-1">NFC Profile URL:</p>
              <div className="flex items-center space-x-2">
                <code className="text-xs text-cyan-300 bg-black/20 px-2 py-1 rounded flex-1 truncate">
                  /profile/{user.id}
                </code>
                <button
                  onClick={() => navigator.clipboard.writeText(generateNfcUrl(user.id))}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  📋
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Edit User</h3>
              <button
                onClick={() => setEditingUser(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <XIcon className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Display Name"
                value={editingUser.displayName || ''}
                onChange={(e) => setEditingUser({...editingUser, displayName: e.target.value})}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
              />
              
              <input
                type="email"
                placeholder="Email"
                value={editingUser.email || ''}
                onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
              />
              
              <select
                value={editingUser.role || ''}
                onChange={(e) => setEditingUser({...editingUser, role: e.target.value})}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-400"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              
              <input
                type="text"
                placeholder="First Name"
                value={editingUser.firstName || ''}
                onChange={(e) => setEditingUser({...editingUser, firstName: e.target.value})}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
              />
              
              <input
                type="text"
                placeholder="Last Name"
                value={editingUser.lastName || ''}
                onChange={(e) => setEditingUser({...editingUser, lastName: e.target.value})}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
              />
              
              <input
                type="tel"
                placeholder="Phone Number"
                value={editingUser.phoneNumber || ''}
                onChange={(e) => setEditingUser({...editingUser, phoneNumber: e.target.value})}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
              />
              
              <textarea
                placeholder="Address"
                value={editingUser.address || ''}
                onChange={(e) => setEditingUser({...editingUser, address: e.target.value})}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                rows={3}
              />
              
              <input
                type="date"
                value={editingUser.dob || ''}
                onChange={(e) => setEditingUser({...editingUser, dob: e.target.value})}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-400"
              />
              
              <select
                value={editingUser.theme || 'Modern'}
                onChange={(e) => setEditingUser({...editingUser, theme: e.target.value as any})}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-400"
              >
                <option value="Classic">Classic</option>
                <option value="Modern">Modern</option>
                <option value="Elegant">Elegant</option>
                <option value="Sunset">Sunset</option>
                <option value="Ocean">Ocean</option>
                <option value="Galaxy">Galaxy</option> 
                <option value="Forest">Forest</option>
                <option value="Rose">Rose</option>
                <option value="Neon">Neon</option>
                <option value="Minimal">Minimal</option> 
              </select>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => handleUpdateUser(editingUser)}
                className="flex-1 bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <SaveIcon className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
              
              <button
                onClick={() => setEditingUser(null)}
                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}