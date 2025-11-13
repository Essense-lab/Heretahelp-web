'use client'

import { UserProfile } from '@/types'
import { CustomerDashboard } from './customer-dashboard'
import { TechnicianDashboard } from './technician-dashboard'
import { LocksmithDashboard } from './locksmith-dashboard'
import { TowingDashboard } from './towing-dashboard'
import { AdminDashboard } from './admin-dashboard'

interface DashboardRouterProps {
  profile: UserProfile
}

export function DashboardRouter({ profile }: DashboardRouterProps) {
  switch (profile.userType) {
    case 'CUSTOMER':
      return <CustomerDashboard profile={profile} />
    
    case 'TECHNICIAN':
    case 'CAR_TECHNICIAN':
    case 'BOAT_TECHNICIAN':
    case 'DIESEL_TECHNICIAN':
    case 'TIRE_TECHNICIAN':
    case 'MOBILE_WASH_TECHNICIAN':
      return <TechnicianDashboard profile={profile} />
    
    case 'LOCKSMITH':
      return <LocksmithDashboard profile={profile} />
    
    case 'TOW_TRUCK_DRIVER':
      return <TowingDashboard profile={profile} />
    
    case 'ADMIN':
      return <AdminDashboard profile={profile} />
    
    default:
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Unknown User Type
            </h1>
            <p className="text-gray-600">
              We couldn't determine your account type. Please contact support.
            </p>
          </div>
        </div>
      )
  }
}
