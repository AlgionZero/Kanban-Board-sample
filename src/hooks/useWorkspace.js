import { useState, useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { loadWorkspace, saveWorkspace, loadInvites, saveInvites, loadAuth, saveAuth } from '../utils/localStorage.js'

export const AVATAR_COLORS = [
  '#7C5CFC', '#3B82F6', '#22C55E', '#F59E0B', '#EC4899', '#EF4444', '#06B6D4',
]

export function getInitials(name) {
  if (!name?.trim()) return '?'
  const words = name.trim().split(/\s+/)
  return words.length >= 2
    ? (words[0][0] + words[words.length - 1][0]).toUpperCase()
    : name.trim().slice(0, 2).toUpperCase()
}

const DEFAULT_PROFILE = {
  name: '',
  role: 'Content Creator',
  email: '',
  bio: '',
  avatarColor: '#7C5CFC',
}

export function useWorkspace() {
  const [profile, setProfile]         = useState(() => loadWorkspace() ?? DEFAULT_PROFILE)
  const [invites, setInvites]         = useState(loadInvites)
  const [isSignedIn, setIsSignedIn]   = useState(() => loadAuth().isSignedIn ?? false)
  const [hasAccount, setHasAccount]   = useState(() => !!(loadAuth().password && loadWorkspace()?.name))
  const [activeModal, setActiveModal] = useState(null)

  const updateProfile = useCallback((patch) => {
    setProfile(prev => {
      const next = { ...prev, ...patch }
      saveWorkspace(next)
      return next
    })
  }, [])

  const addInvite = useCallback((email, role) => {
    setInvites(prev => {
      const next = [{ id: uuidv4(), email, role, invitedAt: new Date().toISOString() }, ...prev]
      saveInvites(next)
      return next
    })
  }, [])

  const removeInvite = useCallback((id) => {
    setInvites(prev => {
      const next = prev.filter(i => i.id !== id)
      saveInvites(next)
      return next
    })
  }, [])

  // New user registration
  const signUp = useCallback((profileData, password) => {
    const merged = { ...DEFAULT_PROFILE, ...profileData }
    saveWorkspace(merged)
    saveAuth({ isSignedIn: true, password })
    setProfile(merged)
    setIsSignedIn(true)
    setHasAccount(true)
  }, [])

  // Returning user login — returns error string or null on success
  const login = useCallback((name, password) => {
    const savedProfile = loadWorkspace()
    const auth = loadAuth()

    if (!savedProfile?.name || savedProfile.name.toLowerCase() !== name.toLowerCase().trim()) {
      return 'No account found with that name.'
    }
    if (auth.password !== password) {
      return 'Incorrect password.'
    }

    setProfile(savedProfile)
    saveAuth({ ...auth, isSignedIn: true })
    setIsSignedIn(true)
    return null
  }, [])

  // Sign out — preserves profile and password so login works next time
  const signOut = useCallback(() => {
    const auth = loadAuth()
    saveAuth({ ...auth, isSignedIn: false })
    setIsSignedIn(false)
  }, [])

  const openModal  = useCallback((name) => setActiveModal(name), [])
  const closeModal = useCallback(() => setActiveModal(null), [])

  return {
    profile, updateProfile,
    invites, addInvite, removeInvite,
    isSignedIn, hasAccount, signUp, login, signOut,
    activeModal, openModal, closeModal,
  }
}
