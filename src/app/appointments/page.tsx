import BookAppointmentScreen from '@/components/book-appointment-screen'
import { getValidAccessToken } from '@/lib/utils/auth-utils'
import { SetDynamicRoute } from '@/lib/utils/setDynamicRoute'
import ErrorBoundary from '@/components/ErrorBoundary'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode';
import { PageableResponse, ServiceType } from '@/lib/interfaces/services/services'
import { FilteredProvidersResponse, ProviderService, ScheduleType } from '@/lib/interfaces/provider-services/provider-service'



interface DecodedToken {
  sub: string
  // Add other token claims as needed
}


async function getScheduleTypes(accessToken: string): Promise<ScheduleType[]> {
  const url = process.env.NEXT_PUBLIC_SCHEDULE_TYPES

  if (!url) {
    throw new Error("NEXT_PUBLIC_SCHEDULE_TYPES environment variable is not set")
  }

  const resp = await axios.get<{ content: ScheduleType[] }>(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
  })

  if (resp.status !== 200) {
    throw new Error(`Failed to fetch schedule types. Status: ${resp.status}`)
  }

  return resp.data.content
}

async function getServiceTypes(accessToken: string): Promise<PageableResponse<ServiceType>> {
  const url = process.env.NEXT_PUBLIC_GET_SERVICE_TYPES
  if (!url) {
    throw new Error("NEXT_PUBLIC_GET_SERVICE_TYPES environment variable is not set")
  }

  const resp = await axios.get<PageableResponse<ServiceType>>(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  })

  if (resp.status !== 200) {
    throw new Error(`Failed to fetch service types. Status: ${resp.status}`)
  }

  return resp.data
}

async function getProviderServices(accessToken: string): Promise<FilteredProvidersResponse> {
  const url = process.env.NEXT_PUBLIC_PROVIDER_GET_SERVICES
  if (!url) {
    throw new Error("NEXT_PUBLIC_PROVIDER_GET_SERVICES environment variable is not set")
  }

  const resp = await axios.get<FilteredProvidersResponse>(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    params: {
      cursorId: 0,
      limit: 50,
      sortBy: 'id',
      sortDirection: 'asc'
    }
  })

  if (resp.status !== 200) {
    throw new Error(`Failed to fetch provider services. Status: ${resp.status}`)
  }

  

  return resp.data
}

export default async function Home() {
  let providerServices: ProviderService[] | null = null
  let scheduleTypes: ScheduleType[] | null = null
  let currentMemberId: string | null = null
  let error: string | null = null
  let serviceTypes: ServiceType[] | null = null

  try {
    const accessToken = await getValidAccessToken()
    const decodedToken = jwtDecode<DecodedToken>(accessToken)
    currentMemberId = decodedToken.sub

    const [services, types, serviceTypesData] = await Promise.all([
      getProviderServices(accessToken),
      getScheduleTypes(accessToken),
      getServiceTypes(accessToken),
    ])

    providerServices = services.content
    serviceTypes = serviceTypesData.content
    scheduleTypes = types
  } catch (err) {
    console.error("Error in Home component:", err)
    error = err instanceof Error ? err.message : String(err)
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">An error occurred</h1>
          <p className="text-red-500">{error}</p>
          <a href="/" className="mt-4 inline-block px-4 py-2 bg-[#008080] text-white rounded hover:bg-[#008080]">
           Refresh
          </a>
        </div>
      </div>
    )
  }

  if (!providerServices || !scheduleTypes || !serviceTypes || !currentMemberId) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Loading...</h1>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-white">
      <SetDynamicRoute />
      <ErrorBoundary>
        <BookAppointmentScreen 
          serviceTypes={serviceTypes}
          providerServices={providerServices} 
          scheduleTypes={scheduleTypes} 
          currentMemberId={currentMemberId}
        />
      </ErrorBoundary>
    </main>
  )
}