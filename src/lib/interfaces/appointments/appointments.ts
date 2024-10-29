import { Member } from "../member/member";
import { ProviderService } from "../provider-services/provider-service";
import { Service } from "../services/services";


interface ScheduleType {
  id: number;
  name: string;
  description: string;
  slotDurationMinutes: number;
  breakDurationMinutes: number;
}

export interface Appointment {
  id: number;
  startTime: string;
  endTime: string;
  appointmentDate: string;
  notes: string;
  status: string;
  actionReason: string | null;
  member: Member;
  
  service: Service;
  scheduleType: ScheduleType;
  createdAt: string;
  updatedAt: string;
}



export interface AvailableSlot {
  date: string;
  timeSlots: TimeSlot[] | [];
}

export interface TimeSlot {
  startTime: string;
  endTime: string;
  booked: boolean;
}

// The API response will be an array of AvailableSlot
export type AvailableSlotsResponse = AvailableSlot[];

export type ProviderInfo = {
  id: number
  name: string
  address: string
  member: Member
  serviceCategories: Set<string>
  services: ProviderService[]
}

