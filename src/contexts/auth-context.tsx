'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { createSupabaseClient } from '@/lib/supabase'
import { UserRepository } from '@/lib/repositories/user-repository'
import type { UserProfile } from '@/types'

interface AuthContextType {
  user: User | null
  profile: UserProfile | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<UserProfile>
  signUp: (email: string, password: string, userData: {
    firstName: string
    lastName: string
    userType: string
    phoneNumber?: string
  }) => Promise<UserProfile>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  updateProfile: (updates: Partial<UserProfile>) => Promise<UserProfile>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  
  const supabase = createSupabaseClient()
  const userRepository = new UserRepository()

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session?.user) {
          setUser(session.user)
          const userProfile = await userRepository.getCurrentUserProfile()
          setProfile(userProfile)
        }
      } catch (error) {
        console.error('Error getting initial session:', error)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id)
        
        if (session?.user) {
          setUser(session.user)
          
          // Get user profile
          try {
            const userProfile = await userRepository.getCurrentUserProfile()
            setProfile(userProfile)
          } catch (error) {
            console.error('Error fetching user profile:', error)
            setProfile(null)
          }
        } else {
          setUser(null)
          setProfile(null)
        }
        
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string): Promise<UserProfile> => {
    setLoading(true)
    try {
      const profile = await userRepository.signIn(email, password)
      return profile
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (
    email: string, 
    password: string, 
    userData: {
      firstName: string
      lastName: string
      userType: string
      phoneNumber?: string
    }
  ): Promise<UserProfile> => {
    setLoading(true)
    try {
      const profile = await userRepository.signUp(email, password, {
        ...userData,
        userType: userData.userType as any
      })
      return profile
    } finally {
      setLoading(false)
    }
  }

  const signOut = async (): Promise<void> => {
    setLoading(true)
    try {
      await userRepository.signOut()
    } finally {
      setLoading(false)
    }
  }

  const resetPassword = async (email: string): Promise<void> => {
    await userRepository.resetPassword(email)
  }

  const updateProfile = async (updates: Partial<UserProfile>): Promise<UserProfile> => {
    if (!user) throw new Error('No user logged in')
    
    const updatedProfile = await userRepository.updateUserProfile(user.id, updates)
    setProfile(updatedProfile)
    return updatedProfile
  }

  const refreshProfile = async (): Promise<void> => {
    if (!user) return
    
    try {
      const userProfile = await userRepository.getCurrentUserProfile()
      setProfile(userProfile)
    } catch (error) {
      console.error('Error refreshing profile:', error)
    }
  }

  const value: AuthContextType = {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateProfile,
    refreshProfile,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
