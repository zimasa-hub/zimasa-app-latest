export interface PaymentMethod {
    id: number
    method: string
    isGlobal: boolean
    createdAt: string | null
    updatedAt: string | null
  }
  
 export interface ServiceType {
    id: number
    name: string
    description: string
  }
  
 export interface ServiceCategory {
    id: number
    name: string
    description: string
    serviceType: ServiceType
  }
  
 export interface PageableResponse<T> {
    content: T[]
    pageable: {
      pageNumber: number
      pageSize: number
      sort: {
        empty: boolean
        unsorted: boolean
        sorted: boolean
      }
      offset: number
      paged: boolean
      unpaged: boolean
    }
    size: number
    number: number
    sort: {
      empty: boolean
      unsorted: boolean
      sorted: boolean
    }
    numberOfElements: number
    first: boolean
    last: boolean
    empty: boolean
  }

  export interface Service {
    id: number
    name: string | null
    description: string
    maximumCapacity: number
    price: number
    durationMins: number
    availability: string
    startDate: string
    endDate: string
    insuranceAccepted: boolean
    isActive: boolean
    tags: string[]
    location: string
    createdAt: string | null
    updatedAt: string | null
    serviceCategory: ServiceCategory
    providerUser: any | null
    providerServicePaymentMethods: Array<{
      id: number
      paymentMethod: PaymentMethod
    }>
    serviceInsurers: any[]
    serviceHandlers: Array<{
      id: number
      isAvailable: boolean
      providerUser: any
      serviceName: string | null
    }>
    serviceAvailability: Array<{
      id: number
      dayOfWeek: string
      startTime: string
      endTime: string
      serviceName: string | null
    }>
  }