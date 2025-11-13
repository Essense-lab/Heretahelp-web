'use client'

import { useAuth } from '@/contexts/auth-context'
import { LandingPage } from '@/components/landing/landing-page'
import { DashboardRouter } from '@/components/dashboard/dashboard-router'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

export default function HomePage() {
  const { user, profile, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  // Show landing page if not authenticated
  if (!user || !profile) {
    return <LandingPage />
  }

  // Show appropriate dashboard based on user type
  return <DashboardRouter profile={profile} />
}
