import React from 'react'
import { Menu, Bell } from 'lucide-react'

export default function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gray-100 mb-10">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
          <Bell className="h-6 w-6 text-gray-300" />
            <div className="w-24 h-6 bg-gray-200 animate-pulse rounded ml-4">

            </div>
          </div>
          <Menu className="h-6 w-6 text-gray-300" />         
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="w-48 h-8 bg-gray-200 animate-pulse rounded mb-6"></div>

        <div className="bg-white shadow rounded-lg mb-8 p-6">
          <div className="w-64 h-6 bg-gray-200 animate-pulse rounded mb-4"></div>
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="w-56 h-4 bg-gray-200 animate-pulse rounded"></div>
              <div className="w-32 h-4 bg-gray-200 animate-pulse rounded"></div>
            </div>
            <div className="w-16 h-16 bg-gray-200 animate-pulse rounded-full"></div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="w-48 h-6 bg-gray-200 animate-pulse rounded mb-4"></div>
          <div className="space-y-4">
            {[1, 2].map((item) => (
              <div key={item} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-5 h-5 bg-gray-200 animate-pulse rounded-full mr-3"></div>
                  <div>
                    <div className="w-32 h-4 bg-gray-200 animate-pulse rounded mb-2"></div>
                    <div className="w-24 h-3 bg-gray-200 animate-pulse rounded"></div>
                  </div>
                </div>
                <div className="w-16 h-6 bg-gray-200 animate-pulse rounded-full"></div>
              </div>
            ))}
          </div>
          <div className="w-full h-10 bg-gray-200 animate-pulse rounded-md mt-6"></div>
        </div>

        <div className="bg-white shadow rounded-lg p-6 mt-4">
          <div className="w-48 h-6 bg-gray-200 animate-pulse rounded mb-4"></div>
          <div className="space-y-4">
            {[1, 2].map((item) => (
              <div key={item} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-5 h-5 bg-gray-200 animate-pulse rounded-full mr-3"></div>
                  <div>
                    <div className="w-32 h-4 bg-gray-200 animate-pulse rounded mb-2"></div>
                    <div className="w-24 h-3 bg-gray-200 animate-pulse rounded"></div>
                  </div>
                </div>
                <div className="w-16 h-6 bg-gray-200 animate-pulse rounded-full"></div>
              </div>
            ))}
          </div>
          <div className="w-full h-10 bg-gray-200 animate-pulse rounded-md mt-6"></div>
        </div>
      </main>
    </div>
  )
}