import { DoctorsDataResponse } from "../providers/doctors"
import { ServiceType } from "../services/services"

export interface ProviderService {
    id: number
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
    serviceCategory: {
      id: number
      name: string
      description: string
      serviceType: string
    }
    serviceHandlers: Array<{
      id: number
      isAvailable: boolean
      providerUser: {
        id: number
        provider: {
          id: number
          name: string
          description: string
          contactEmail: string
          contactPhone: string
          address: string
        }
        member: {
          id: number
          username: string
          email: string
          firstName: string | null
          lastName: string | null
          phone: string | null
        }
        providerUserSpecialists: Array<{
          id: number
          specialist: {
            id: number
            name: string
            description: string
          }
        }>
      }
    }>
    serviceAvailability: Array<{
      id: number
      dayOfWeek: string
      startTime: string
      endTime: string
    }>
  }
  
   export interface FilteredProvidersResponse {
    content: ProviderService[]
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
  
  interface ScheduleType {
    id: number
    name: string
    description: string
    slotDurationMinutes: number
    breakDurationMinutes: number
  }
  
 export interface BookAppointmentScreenProps {
    doctors: FilteredProvidersResponse
    scheduleTypes: ScheduleType[]
    currentMemberId: string
    serviceTypes: ServiceType[]
  }
  
  export type Appointment = {
    providerService: number
    scheduleType: number
    appointmentDate: string
    duration: number
    startTime: string
    endTime: string
    notes: string
    communicationPreference: string
    location: "INPERSON" | "TELEHEALTH"
  }