import { getValidAccessToken } from '@/lib/utils/auth-utils'
import { SetDynamicRoute } from '@/lib/utils/setDynamicRoute'
import ErrorBoundary from '@/components/ErrorBoundary'
import ServiceManagement from '@/components/service-provider-components/service-management'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
import { PaymentMethod, ServiceType, Service } from '@/lib/interfaces/services/services'
import UserProfile from '@/components/profile'
import { PageableResponse } from '@/lib/interfaces/Pageable/pagination'
import { ChatInterface } from '@/components/chat-interface'


export default async function Home() {

  return (
    <main className="min-h-screen bg-white">

      <ErrorBoundary>
       <ChatInterface />
      </ErrorBoundary>
    </main>
  )
}