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