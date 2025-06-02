// lib/user.ts
import type { User } from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { db } from './firebase'

/**
 * Create or update a Firestore user record.
 * - Merges on every call so existing profile fields stay intact.
 * - Sets role="user" and createdAt only when the doc is first created.
 * - Updates lastSeen timestamp on every call.
 */
export async function storeUser(u: User) {
  const ref  = doc(db, 'users', u.uid)
  const snap = await getDoc(ref)

  // Build up the fields to merge
  const updates: Record<string, any> = {
    displayName: u.displayName,
    email:       u.email,
    lastSeen:    Date.now(),
  }

  if (!snap.exists()) {
    // First time ever: set role + creation timestamp
    updates.role      = 'user'
    updates.createdAt = Date.now()
  } else if (!snap.data()?.role) {
    // Doc existed but no role field: give them a default role
    updates.role = 'user'
  }

  // Merge so we never delete the other profile fields
  await setDoc(ref, updates, { merge: true })
}
