'use client'

import { useState } from 'react'
import { Hero } from './hero'
import { Services } from './services'
import { HowItWorks } from './how-it-works'
import { Features } from './features'
import { Testimonials } from './testimonials'
import { CTA } from './cta'
import { Footer } from './footer'
import { Header } from './header'
import { AuthModal } from '@/components/auth/auth-modal'

export function LandingPage() {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin')

  const handleGetStarted = () => {
    setAuthMode('signup')
    setShowAuthModal(true)
  }

  const handleSignIn = () => {
    setAuthMode('signin')
    setShowAuthModal(true)
  }

  return (
    <div className="min-h-screen bg-white">
      <Header onSignIn={handleSignIn} onGetStarted={handleGetStarted} />
      
      <main>
        <Hero onGetStarted={handleGetStarted} />
        <Services />
        <HowItWorks />
        <Features />
        <Testimonials />
        <CTA onGetStarted={handleGetStarted} />
      </main>
      
      <Footer />

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
        onModeChange={setAuthMode}
      />
    </div>
  )
}
