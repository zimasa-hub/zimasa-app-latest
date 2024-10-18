import { Member } from "../member/member"
import { Service } from "../services/services"


interface ScheduleType {
  id: number;
  name: string;
  description: string;
  slotDurationMinutes: number;
  breakDurationMinutes: number;
}


export interface Appointment {
    id: number
    member: Member
    service: Service
    scheduleType: ScheduleType
    startTime: string
    endTime: string
    appointmentDate: string
    status: string
    notes: string
    createdAt: string
    updatedAt: string
  }

  