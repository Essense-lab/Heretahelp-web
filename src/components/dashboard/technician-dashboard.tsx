'use client'

import { UserProfile } from '@/types'
import { DashboardLayout } from './dashboard-layout'

interface TechnicianDashboardProps {
  profile: UserProfile
}

export function TechnicianDashboard({ profile }: TechnicianDashboardProps) {
  return (
    <DashboardLayout profile={profile} userType="technician">
      <div className="space-y-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome, {profile.firstName}!
          </h1>
          <p className="text-gray-600">
            Your technician dashboard is coming soon. You'll be able to view available jobs, manage bids, and track earnings.
          </p>
        </div>
      </div>
    </DashboardLayout>
  )
}
