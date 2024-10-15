import { getValidAccessToken } from '@/lib/utils/auth-utils'
import { SetDynamicRoute } from '@/lib/utils/setDynamicRoute'
import ErrorBoundary from '@/components/ErrorBoundary'
import AddNewServiceComponent from '@/components/service-provider-components/add-new-service'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
import { PaymentMethod, PageableResponse, ServiceType } from '@/lib/interfaces/services/services'

interface DecodedToken {
  sub: string
  // Add other token claims as needed
}

async function getPaymentMethods(accessToken: string): Promise<PaymentMethod[]> {
  const url = process.env.NEXT_PUBLIC_GET_PAYMENT_METHODS
  if (!url) {
    throw new Error("NEXT_PUBLIC_API_URL environment variable is not set")
  }

  const resp = await axios.get<PaymentMethod[]>(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  })

  if (resp.status !== 200) {
    throw new Error(`Failed to fetch payment methods. Status: ${resp.status}`)
  }

  return resp.data
}

async function getServiceTypes(accessToken: string): Promise<PageableResponse<ServiceType>> {
  const url = process.env.NEXT_PUBLIC_GET_SERVICE_TYPES
  if (!url) {
    throw new Error("NEXT_PUBLIC_API_URL environment variable is not set")
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

export default async function Home() {
  let paymentMethods: PaymentMethod[] | null = null
  let serviceTypes: ServiceType[] | null = null
  let currentMemberId: string | null = null
  let error: string | null = null

  try {
    const accessToken = await getValidAccessToken()
    const decodedToken = jwtDecode<DecodedToken>(accessToken)
    currentMemberId = decodedToken.sub

    const [paymentMethodsData, serviceTypesData] = await Promise.all([
      getPaymentMethods(accessToken),
      getServiceTypes(accessToken)
    ])

    paymentMethods = paymentMethodsData
    serviceTypes = serviceTypesData.content
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

  if (!paymentMethods || !serviceTypes || !currentMemberId) {
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
        <AddNewServiceComponent 
          paymentMethods={paymentMethods}
          serviceTypes={serviceTypes}
          currentMemberId={currentMemberId}
        />
      </ErrorBoundary>
    </main>
  )
}