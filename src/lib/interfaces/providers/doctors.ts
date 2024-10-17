import { Member } from "../member/member"

// Interfaces based on the provided payload
interface Specialist {
    id: number
    name: string
    description: string
  }
  
  interface ProviderType {
    id: number
    providerType: string
  }
  
  interface Provider {
    id: number
    name: string
    providerType: ProviderType
    description: string
    contactEmail: string
    contactPhone: string
    address: string
    createdAt: string
    updatedAt: string
    blacklisted: boolean
    accredited: number
    capitation: boolean
    discount: number
    effectiveDate: string
    licenceNumber: string
    nhifRate: number
    specialistType: Specialist
    wef: string
    wet: string | null
  }
  

  
  interface ProviderUserSpecialist {
    id: number
    specialist: Specialist
  }
  
 export interface DoctorData {
    id: number
    provider: Provider
    member: Member
    role: string | null
    status: string
    providerType: ProviderType
    providerUserSpecialists: ProviderUserSpecialist[]
    createdAt: string | null
    updatedAt: string | null
  }
  
  interface PaginationInfo {
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

  interface Sort {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  }
  
 export interface DoctorsDataResponse {
    content: DoctorData[]
    pageable: PaginationInfo
    size: number
    number: number
    sort:Sort
    numberOfElements: number
    first: boolean
    last: boolean
    empty: boolean
  }


