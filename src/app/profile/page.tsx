import { getValidAccessToken } from '@/lib/utils/auth-utils'
import { SetDynamicRoute } from '@/lib/utils/setDynamicRoute'
import ErrorBoundary from '@/components/ErrorBoundary'
import ServiceManagement from '@/components/service-provider-components/service-management'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
import { PaymentMethod, PageableResponse, ServiceType, Service } from '@/lib/interfaces/services/services'
import UserProfile from '@/components/profile'



export default async function Home() {

  return (
    <main className="min-h-screen bg-white">
      <SetDynamicRoute />
      <ErrorBoundary>
        <UserProfile />
      </ErrorBoundary>
    </main>
  )
}