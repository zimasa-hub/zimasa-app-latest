import { Member } from "../member/member"
import { ProviderUserSpecialist } from "../providers/providers"
import { ServiceAvailability, ServiceCategory, ServiceHandler, ServiceType } from "../services/services"

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
  serviceCategory: ServiceCategory
  serviceHandlers: ServiceHandler[]
  serviceAvailability: ServiceAvailability[]
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

export interface ScheduleType {
  id: number
  name: string
  description: string
  slotDurationMinutes: number
  breakDurationMinutes: number
}

export interface BookAppointmentScreenProps {
  scheduleTypes: ScheduleType[]
  currentMemberId: string
  serviceTypes: ServiceType[]
  providerServices: ProviderService[]
}

export type Book_Appointment = {
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