'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { createSupabaseClient } from '@/lib/supabase'
import { Loader2, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'

const BRAND_BACKGROUND = 'bg-[#0D1B2A]'
const BRAND_LIGHT_TEXT = 'text-[#B3D4FC]'
const BRAND_PRIMARY = 'bg-[#0D1B2A]'

const manIconSrc = '/branding/manicon.png'

export default function SignInPage() {
  const router = useRouter()
  const supabase = useMemo(() => createSupabaseClient(), [])

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [showReset, setShowReset] = useState(false)
  const [resetEmail, setResetEmail] = useState('')

  // Load stored credentials on mount
  useEffect(() => {
    const stored = window.localStorage.getItem('heretahelp_credentials')
    if (stored) {
      const parsed = JSON.parse(stored)
      setEmail(parsed.email ?? '')
      setPassword(parsed.password ?? '')
      setRememberMe(parsed.rememberMe ?? false)
    }
  }, [])

  const handleRemember = (next: boolean, currentEmail = email, currentPassword = password) => {
    setRememberMe(next)
    if (next) {
      window.localStorage.setItem(
        'heretahelp_credentials',
        JSON.stringify({ email: currentEmail, password: currentPassword, rememberMe: next })
      )
    } else {
      window.localStorage.removeItem('heretahelp_credentials')
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!email || !password) {
      setErrorMessage('Please fill in all fields')
      return
    }

    setIsLoading(true)
    setErrorMessage('')

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setErrorMessage(error.message ?? 'Sign in failed')
        return
      }

      if (rememberMe) {
        handleRemember(true, email, password)
      }

      toast.success('Welcome back!')
      router.push('/dashboard')
    } catch (error: any) {
      setErrorMessage(error?.message ?? 'Sign in failed')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordReset = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!resetEmail) {
      toast.error('Please enter an email to reset your password')
      return
    }

    setIsLoading(true)
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail)
      if (error) {
        toast.error(error.message ?? 'Failed to send reset email')
      } else {
        toast.success('Reset email sent! Check your inbox.')
        setShowReset(false)
        setResetEmail('')
      }
    } catch (error: any) {
      toast.error(error?.message ?? 'Failed to send reset email')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={`min-h-screen ${BRAND_BACKGROUND} flex flex-col items-center justify-center px-4 py-10 text-white`}>
      <div className="w-full max-w-xl space-y-6">
        <header className="flex flex-col items-center space-y-4">
          <div className="relative h-16 w-40">
            <Image
              src={manIconSrc}
              alt="HereTaHelp logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="flex items-center text-sm font-semibold text-white">
            <button
              className="px-4 py-1 rounded-full bg-white/10 hover:bg-white/15 transition"
              onClick={() => router.replace('/auth/sign-in')}
            >
              Sign In
            </button>
            <span className={`${BRAND_LIGHT_TEXT} px-3`}>|</span>
            <button
              className="px-4 py-1 rounded-full hover:bg-white/10 transition"
              onClick={() => router.push('/auth/sign-up')}
            >
              Sign Up
            </button>
          </div>
        </header>

        <main>
          <div className="rounded-2xl bg-white text-left text-gray-900 shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-6 px-8 py-10">
              <div>
                <h1 className="text-2xl font-bold text-[#0D1B2A]">Welcome Back!</h1>
                <p className="mt-1 text-sm text-gray-600">
                  Sign in to continue scheduling services, tracking requests, and managing your account.
                </p>
              </div>

              <label className="block space-y-1">
                <span className="text-sm font-medium text-gray-700">Email</span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-[#0D1B2A] focus:outline-none focus:ring-2 focus:ring-[#0D1B2A]/20"
                  placeholder="john@example.com"
                  required
                />
              </label>

              <label className="block space-y-1">
                <span className="text-sm font-medium text-gray-700">Password</span>
                <div className="relative">
                  <input
                    type={passwordVisible ? 'text' : 'password'}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 pr-10 focus:border-[#0D1B2A] focus:outline-none focus:ring-2 focus:ring-[#0D1B2A]/20"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setPasswordVisible((prev) => !prev)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                    aria-label={passwordVisible ? 'Hide password' : 'Show password'}
                  >
                    {passwordVisible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </label>

              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(event) => handleRemember(event.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-[#0D1B2A] focus:ring-[#0D1B2A]"
                  />
                  <span>Remember me</span>
                </label>
                <button
                  type="button"
                  className="text-sm font-medium text-[#0D1B2A] hover:text-[#093864]"
                  onClick={() => {
                    setResetEmail(email)
                    setShowReset(true)
                  }}
                >
                  Forgot password?
                </button>
              </div>

              {errorMessage && (
                <p className="text-sm font-medium text-red-600">{errorMessage}</p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full items-center justify-center rounded-lg bg-[#0D1B2A] py-2 text-sm font-semibold text-white shadow-md transition hover:bg-[#0A1625] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Sign In'}
              </button>
            </form>
          </div>

          <div className="mt-6 text-center text-sm text-white">
            New to HereTaHelp?{' '}
            <Link href="/auth/sign-up" className="font-semibold text-[#B3D4FC] hover:underline">
              Create an account
            </Link>
          </div>
        </main>
      </div>

      {showReset && (
        <section className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <form
            onSubmit={handlePasswordReset}
            className="w-full max-w-md space-y-4 rounded-xl bg-white p-6 text-left text-gray-900 shadow-xl"
          >
            <h2 className="text-lg font-semibold text-[#0D1B2A]">Reset password</h2>
            <p className="text-sm text-gray-600">
              Enter the email associated with your account and well send you a reset link.
            </p>
            <input
              type="email"
              value={resetEmail}
              onChange={(event) => setResetEmail(event.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-[#0D1B2A] focus:outline-none focus:ring-2 focus:ring-[#0D1B2A]/20"
              required
            />
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
                onClick={() => setShowReset(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-[#0D1B2A] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0A1625]"
              >
                Send reset link
              </button>
            </div>
          </form>
        </section>
      )}
    </div>
  )
}
