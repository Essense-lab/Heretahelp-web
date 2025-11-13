import { BaseRepository } from './base-repository'
import type { UserProfile, UserType } from '@/types'

export class UserRepository extends BaseRepository {
  // ==================== USER PROFILE MANAGEMENT ====================
  
  async getCurrentUserProfile(): Promise<UserProfile | null> {
    try {
      const user = await this.getCurrentUser()
      
      const { data, error } = await this.supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          // No profile found
          return null
        }
        throw error
      }

      return this.dtoToProfile(data)
    } catch (error) {
      console.error('Error getting current user profile:', error)
      return null
    }
  }

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await this.supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          return null
        }
        throw error
      }

      return this.dtoToProfile(data)
    } catch (error) {
      console.error('Error getting user profile:', error)
      return null
    }
  }

  async createUserProfile(profileData: Omit<UserProfile, 'createdAt' | 'updatedAt'>): Promise<UserProfile> {
    try {
      const timestamp = this.formatTimestamp()
      const profileDto = {
        id: profileData.id,
        email: profileData.email,
        first_name: profileData.firstName,
        last_name: profileData.lastName,
        phone_number: profileData.phoneNumber,
        address: profileData.address,
        city: profileData.city,
        state: profileData.state,
        zip_code: profileData.zipCode,
        role: profileData.userType,
        profile_picture_url: profileData.profilePictureUrl,
        onboarding_completed: profileData.onboardingCompleted,
        created_at: timestamp,
        updated_at: timestamp,
      }

      const { data, error } = await this.supabase
        .from('profiles')
        .insert(profileDto as never)
        .select()
        .single()

      if (error) throw error
      return this.dtoToProfile(data)
    } catch (error) {
      this.handleError(error, 'create user profile')
    }
  }

  async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile> {
    try {
      const updateData: any = {
        updated_at: this.formatTimestamp(),
      }

      if (updates.firstName !== undefined) updateData.first_name = updates.firstName
      if (updates.lastName !== undefined) updateData.last_name = updates.lastName
      if (updates.phoneNumber !== undefined) updateData.phone_number = updates.phoneNumber
      if (updates.address !== undefined) updateData.address = updates.address
      if (updates.city !== undefined) updateData.city = updates.city
      if (updates.state !== undefined) updateData.state = updates.state
      if (updates.zipCode !== undefined) updateData.zip_code = updates.zipCode
      if (updates.profilePictureUrl !== undefined) updateData.profile_picture_url = updates.profilePictureUrl
      if (updates.onboardingCompleted !== undefined) updateData.onboarding_completed = updates.onboardingCompleted

      const { data, error } = await this.supabase
        .from('profiles')
        .update(updateData as never)
        .eq('id', userId)
        .select()
        .single()

      if (error) throw error
      return this.dtoToProfile(data)
    } catch (error) {
      this.handleError(error, 'update user profile')
    }
  }

  async deleteUserProfile(userId: string): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('profiles')
        .delete()
        .eq('id', userId)

      if (error) throw error
    } catch (error) {
      this.handleError(error, 'delete user profile')
    }
  }

  // ==================== USER SEARCH AND FILTERING ====================

  async searchUsers(query: string, userType?: UserType): Promise<UserProfile[]> {
    try {
      let queryBuilder = this.supabase
        .from('profiles')
        .select('*')

      if (userType) {
        queryBuilder = queryBuilder.eq('role', userType)
      }

      // Search in first name, last name, and email
      queryBuilder = queryBuilder.or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%,email.ilike.%${query}%`)

      const { data, error } = await queryBuilder
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) throw error
      return (data || []).map(this.dtoToProfile)
    } catch (error) {
      this.handleError(error, 'search users')
    }
  }

  async getUsersByType(userType: UserType): Promise<UserProfile[]> {
    try {
      const { data, error } = await this.supabase
        .from('profiles')
        .select('*')
        .eq('role', userType)
        .order('created_at', { ascending: false })

      if (error) throw error
      return (data || []).map(this.dtoToProfile)
    } catch (error) {
      this.handleError(error, 'get users by type')
    }
  }

  async getUsersByLocation(city: string, state: string): Promise<UserProfile[]> {
    try {
      const { data, error } = await this.supabase
        .from('profiles')
        .select('*')
        .eq('city', city)
        .eq('state', state)
        .order('created_at', { ascending: false })

      if (error) throw error
      return (data || []).map(this.dtoToProfile)
    } catch (error) {
      this.handleError(error, 'get users by location')
    }
  }

  // ==================== PROFILE PICTURE MANAGEMENT ====================

  async uploadProfilePicture(userId: string, file: File): Promise<string> {
    try {
      const fileName = `profile_${userId}_${Date.now()}.${file.name.split('.').pop()}`
      
      const { data, error } = await this.supabase.storage
        .from('profile-pictures')
        .upload(fileName, file)

      if (error) throw error

      const { data: { publicUrl } } = this.supabase.storage
        .from('profile-pictures')
        .getPublicUrl(fileName)

      // Update user profile with new picture URL
      await this.updateUserProfile(userId, { profilePictureUrl: publicUrl })

      return publicUrl
    } catch (error) {
      this.handleError(error, 'upload profile picture')
    }
  }

  async deleteProfilePicture(userId: string, pictureUrl: string): Promise<void> {
    try {
      // Extract file name from URL
      const fileName = pictureUrl.split('/').pop()
      if (!fileName) throw new Error('Invalid picture URL')

      const { error } = await this.supabase.storage
        .from('profile-pictures')
        .remove([fileName])

      if (error) throw error

      // Update user profile to remove picture URL
      await this.updateUserProfile(userId, { profilePictureUrl: undefined })
    } catch (error) {
      this.handleError(error, 'delete profile picture')
    }
  }

  // ==================== AUTHENTICATION HELPERS ====================

  async signUp(email: string, password: string, userData: {
    firstName: string
    lastName: string
    userType: UserType
    phoneNumber?: string
  }): Promise<UserProfile> {
    try {
      const { data, error } = await this.supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: userData.firstName,
            last_name: userData.lastName,
            user_type: userData.userType,
            phone_number: userData.phoneNumber,
          }
        }
      })

      if (error) throw error
      if (!data.user) throw new Error('Failed to create user')

      // Create profile record
      const profile = await this.createUserProfile({
        id: data.user.id,
        email: data.user.email!,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phoneNumber: userData.phoneNumber,
        userType: userData.userType,
        onboardingCompleted: false,
      })

      return profile
    } catch (error) {
      this.handleError(error, 'sign up user')
    }
  }

  async signIn(email: string, password: string): Promise<UserProfile> {
    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error
      if (!data.user) throw new Error('Failed to sign in')

      const profile = await this.getCurrentUserProfile()
      if (!profile) throw new Error('User profile not found')

      return profile
    } catch (error) {
      this.handleError(error, 'sign in user')
    }
  }

  async signOut(): Promise<void> {
    try {
      const { error } = await this.supabase.auth.signOut()
      if (error) throw error
    } catch (error) {
      this.handleError(error, 'sign out user')
    }
  }

  async resetPassword(email: string): Promise<void> {
    try {
      const { error } = await this.supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })
      if (error) throw error
    } catch (error) {
      this.handleError(error, 'reset password')
    }
  }

  async updatePassword(newPassword: string): Promise<void> {
    try {
      const { error } = await this.supabase.auth.updateUser({
        password: newPassword
      })
      if (error) throw error
    } catch (error) {
      this.handleError(error, 'update password')
    }
  }

  // ==================== HELPER METHODS ====================

  private dtoToProfile(dto: any): UserProfile {
    return {
      id: dto.id,
      email: dto.email,
      firstName: dto.first_name,
      lastName: dto.last_name,
      phoneNumber: dto.phone_number,
      address: dto.address,
      city: dto.city,
      state: dto.state,
      zipCode: dto.zip_code,
      userType: dto.role as UserType,
      profilePictureUrl: dto.profile_picture_url,
      onboardingCompleted: dto.onboarding_completed,
      createdAt: dto.created_at,
      updatedAt: dto.updated_at,
    }
  }

  private profileToDto(profile: UserProfile): any {
    return {
      id: profile.id,
      email: profile.email,
      first_name: profile.firstName,
      last_name: profile.lastName,
      phone_number: profile.phoneNumber,
      address: profile.address,
      city: profile.city,
      state: profile.state,
      zip_code: profile.zipCode,
      role: profile.userType,
      profile_picture_url: profile.profilePictureUrl,
      onboarding_completed: profile.onboardingCompleted,
      created_at: profile.createdAt,
      updated_at: profile.updatedAt,
    }
  }
}
