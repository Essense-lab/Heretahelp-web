'use client'

import { UserProfile } from '@/types'
import { DashboardLayout } from './dashboard-layout'

interface AdminDashboardProps {
  profile: UserProfile
}

export function AdminDashboard({ profile }: AdminDashboardProps) {
  return (
    <DashboardLayout profile={profile} userType="admin">
      <div className="space-y-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome, {profile.firstName}!
          </h1>
          <p className="text-gray-600">
            Your admin dashboard is coming soon. You'll be able to manage users, services, and view analytics.
          </p>
        </div>
      </div>
    </DashboardLayout>
  )
}
