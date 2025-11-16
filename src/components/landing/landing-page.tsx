'use client'

import { useRouter } from 'next/navigation'
import { Hero } from './hero'
import { Services } from './services'
import { HowItWorks } from './how-it-works'
import { Features } from './features'
import { Testimonials } from './testimonials'
import { CTA } from './cta'
import { Footer } from './footer'
import { Header } from './header'

export function LandingPage() {
  const router = useRouter()

  const handleGetStarted = () => {
    router.push('/auth/sign-up')
  }

  const handleSignIn = () => {
    router.push('/auth/sign-in')
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
    </div>
  )
}
