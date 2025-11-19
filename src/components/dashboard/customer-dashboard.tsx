'use client'

import { useState } from 'react'
import { UserProfile } from '@/types'
import { DashboardLayout } from './dashboard-layout'
import { Plus, Car, Anchor, Truck, CircleDot, Key, TruckIcon, Clock, MapPin } from 'lucide-react'
import { SupportChatButton } from '@/components/support-chat-button'

interface CustomerDashboardProps {
  profile: UserProfile
}

const serviceTypes = [
  { name: 'Car Repair', icon: Car, color: 'bg-blue-500', description: 'Engine, brakes, diagnostics' },
  { name: 'Boat Repair', icon: Anchor, color: 'bg-cyan-500', description: 'Marine engine, hull repair' },
  { name: 'Diesel Truck', icon: Truck, color: 'bg-orange-500', description: 'Heavy duty repairs' },
  { name: 'Tire Services', icon: CircleDot, color: 'bg-gray-600', description: 'Repair, replacement' },
  { name: 'Locksmith', icon: Key, color: 'bg-yellow-500', description: 'Lockouts, key replacement' },
  { name: 'Towing', icon: TruckIcon, color: 'bg-red-500', description: 'Emergency & scheduled' },
]

const recentRequests = [
  {
    id: '1',
    service: 'Car Repair',
    issue: 'Engine diagnostic',
    status: 'In Progress',
    technician: 'Mike Johnson',
    date: '2024-01-15',
    location: 'Downtown Office',
  },
  {
    id: '2',
    service: 'Tire Services',
    issue: 'Flat tire replacement',
    status: 'Completed',
    technician: 'Sarah Wilson',
    date: '2024-01-12',
    location: 'Home',
  },
]

export function CustomerDashboard({ profile }: CustomerDashboardProps) {
  const [selectedService, setSelectedService] = useState<string | null>(null)

  const handleServiceSelect = (serviceName: string) => {
    setSelectedService(serviceName)
    // TODO: Navigate to service request form
    console.log('Selected service:', serviceName)
  }

  return (
    <DashboardLayout profile={profile} userType="customer">
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome back, {profile.firstName}!
          </h1>
          <p className="text-gray-600">
            What can we help you with today? Choose a service below to get started.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Request a Service</h2>
            <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center">
              <Plus className="h-5 w-5 mr-2" />
              Emergency Service
            </button>
          </div>

          <div className="mx-auto grid w-full max-w-5xl grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 place-items-center">
            {serviceTypes.map((service) => (
              <button
                key={service.name}
                onClick={() => handleServiceSelect(service.name)}
                className="w-full max-w-xs p-4 border border-gray-200 rounded-lg hover:border-primary hover:shadow-md transition-all text-left"
              >
                <div className="flex items-center mb-3">
                  <div className={`p-2 rounded-lg ${service.color} mr-3`}>
                    <service.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-medium text-gray-900">{service.name}</h3>
                </div>
                <p className="text-sm text-gray-600">{service.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Requests */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Requests</h2>
          
          {recentRequests.length > 0 ? (
            <div className="space-y-4">
              {recentRequests.map((request) => (
                <div key={request.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <h3 className="font-medium text-gray-900">{request.service}</h3>
                      <span className={`ml-3 px-2 py-1 text-xs rounded-full ${
                        request.status === 'Completed' 
                          ? 'bg-green-100 text-green-800'
                          : request.status === 'In Progress'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {request.status}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">{request.date}</span>
                  </div>
                  
                  <p className="text-gray-600 mb-2">{request.issue}</p>
                  
                  <div className="flex items-center text-sm text-gray-500 space-x-4">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {request.location}
                    </div>
                    {request.technician && (
                      <div>
                        Technician: {request.technician}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No recent requests</h3>
              <p className="text-gray-600">
                When you request services, they'll appear here for easy tracking.
              </p>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-2xl font-bold text-primary mb-2">12</div>
            <div className="text-gray-600">Services Completed</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-2xl font-bold text-primary mb-2">4.8</div>
            <div className="text-gray-600">Average Rating Given</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-2xl font-bold text-primary mb-2">$1,240</div>
            <div className="text-gray-600">Total Saved</div>
          </div>
        </div>
      </div>
      <SupportChatButton href="/contact" />
    </DashboardLayout>
  )
}
