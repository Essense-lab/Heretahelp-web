'use client'

import { UserProfile } from '@/types'
import { DashboardLayout } from './dashboard-layout'

interface LocksmithDashboardProps {
  profile: UserProfile
}

export function LocksmithDashboard({ profile }: LocksmithDashboardProps) {
  return (
    <DashboardLayout profile={profile} userType="locksmith">
      <div className="space-y-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome, {profile.firstName}!
          </h1>
          <p className="text-gray-600">
            Your locksmith dashboard is coming soon. You'll be able to view available locksmith jobs, manage bids, and track earnings.
          </p>
        </div>
      </div>
    </DashboardLayout>
  )
}
