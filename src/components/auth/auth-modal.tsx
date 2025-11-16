'use client'

import { useState } from 'react'
import { X, Eye, EyeOff, Loader2 } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  mode: 'signin' | 'signup'
  onModeChange: (mode: 'signin' | 'signup') => void
}

export function AuthModal({ isOpen, onClose, mode, onModeChange }: AuthModalProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    userType: 'CUSTOMER',
  })

  const { signIn, signUp, resetPassword } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (mode === 'signin') {
        await signIn(formData.email, formData.password)
        toast.success('Welcome back!')
        onClose()
      } else {
        await signUp(formData.email, formData.password, {
          firstName: formData.firstName,
          lastName: formData.lastName,
          phoneNumber: formData.phoneNumber,
          userType: formData.userType,
        })
        toast.success('Account created successfully!')
        onClose()
      }
    } catch (error: any) {
      toast.error(error.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = async () => {
    if (!formData.email) {
      toast.error('Please enter your email address')
      return
    }

    try {
      await resetPassword(formData.email)
      toast.success('Password reset email sent!')
    } catch (error: any) {
      toast.error(error.message || 'Failed to send reset email')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />
        
        <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
          <div className="absolute right-0 top-0 pr-4 pt-4">
            <button
              type="button"
              className="rounded-md bg-white text-gray-400 hover:text-gray-500"
              onClick={onClose}
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="sm:flex sm:items-start">
            <div className="w-full">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  {mode === 'signin' ? 'Welcome Back' : 'Create Account'}
                </h3>
                <p className="mt-2 text-gray-600">
                  {mode === 'signin' 
                    ? 'Sign in to your Here Ta Help account' 
                    : 'Join thousands of satisfied customers and technicians'
                  }
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'signup' && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                          First Name
                        </label>
                        <input
                          id="firstName"
                          type="text"
                          required
                          value={formData.firstName}
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary"
                        />
                      </div>
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                          Last Name
                        </label>
                        <input
                          id="lastName"
                          type="text"
                          required
                          value={formData.lastName}
                          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="userType" className="block text-sm font-medium text-gray-700">
                        I am a...
                      </label>
                      <select
                        id="userType"
                        value={formData.userType}
                        onChange={(e) => setFormData({ ...formData, userType: e.target.value })}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary"
                      >
                        <option value="CUSTOMER">Customer (Need Services)</option>
                        <option value="TECHNICIAN">Car Technician</option>
                        <option value="BOAT_TECHNICIAN">Boat Technician</option>
                        <option value="DIESEL_TECHNICIAN">Diesel Technician</option>
                        <option value="TIRE_TECHNICIAN">Tire Technician</option>
                        <option value="LOCKSMITH">Locksmith</option>
                        <option value="TOW_TRUCK_DRIVER">Tow Truck Driver</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                        Phone Number (Optional)
                      </label>
                      <input
                        id="phoneNumber"
                        type="tel"
                        value={formData.phoneNumber}
                        onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary"
                        placeholder="(555) 123-4567"
                      />
                    </div>
                  </>
                )}

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="relative mt-1">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="block w-full rounded-md border border-gray-300 px-3 py-2 pr-10 shadow-sm focus:border-primary focus:outline-none focus:ring-primary"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center pr-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={cn(
                    "w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary",
                    loading && "opacity-50 cursor-not-allowed"
                  )}
                >
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    mode === 'signin' ? 'Sign In' : 'Create Account'
                  )}
                </button>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">
                      {mode === 'signin' ? 'New to Here Ta Help?' : 'Already have an account?'}
                    </span>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <button
                    type="button"
                    onClick={() => onModeChange(mode === 'signin' ? 'signup' : 'signin')}
                    className="text-primary hover:text-primary-700 font-medium"
                  >
                    {mode === 'signin' ? 'Create an account' : 'Sign in instead'}
                  </button>
                </div>

                {mode === 'signin' && (
                  <div className="mt-4 text-center">
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      className="text-sm text-gray-600 hover:text-gray-900"
                    >
                      Forgot your password?
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
