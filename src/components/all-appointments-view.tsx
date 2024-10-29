"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, ChevronLeft, Filter } from "lucide-react"
import axios from 'axios'
import { Appointment } from '@/lib/interfaces/appointments/appointments'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"

interface AllAppointmentsViewProps {
  isOpen: boolean
  onClose: () => void
}

export default function Component({ isOpen, onClose }: AllAppointmentsViewProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [dateType, setDateType] = useState<'single' | 'range'>('single')
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0])
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [scheduleTypeFilter, setScheduleTypeFilter] = useState<string>('')

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(`/api/user/book-appointment?localDate=${selectedDate}`)
        setAppointments(response.data)

        console.log("APPOINTMENTS :", response)
      } catch (error) {
        console.error('Error fetching appointments:', error)
      }
    }

    if (isOpen) {
      fetchAppointments()
    }
  }, [isOpen, selectedDate])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatTime = (timeString: string) => {
    return new Date(`1970-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const clearFilters = () => {
    setStatusFilter('')
    setScheduleTypeFilter('')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Requested':
        return 'bg-yellow-500 text-white'
      case 'Confirmed':
        return 'bg-custom-green text-white'
      case 'Completed':
        return 'bg-blue-500 text-white'
      default:
        return 'bg-gray-500 text-white'
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-hidden">
      <div className="flex flex-col h-full">
        <header className="flex items-center justify-between p-4 border-b bg-custom-green text-white">
          <Button variant="ghost" onClick={onClose} className="p-0 text-white hover:text-white/80">
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-semibold">All Appointments</h1>
          <div className="w-6" /> {/* Spacer for alignment */}
        </header>
        <div className="p-4 space-y-4">
        
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full border-custom-green"
          />
          <div className="flex space-x-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="flex-1 border-custom-green">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Requested">Requested</SelectItem>
                <SelectItem value="Confirmed">Confirmed</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={scheduleTypeFilter} onValueChange={setScheduleTypeFilter}>
              <SelectTrigger className="flex-1 border-custom-green">
                <SelectValue placeholder="Filter by schedule type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="In-person">In-person</SelectItem>
                <SelectItem value="Virtual">Virtual</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline" onClick={clearFilters} className="w-full border-custom-green text-custom-green">
            Clear Filters
          </Button>
        </div>
        <ScrollArea className="flex-grow">
          <div className="space-y-4 p-4">
            {appointments.map((appointment) => (
              <div key={appointment.id} className="bg-white border  rounded-lg p-4 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">
                      Dr. {appointment.service.serviceHandlers[0]?.providerUser.member.firstName || 'Unknown'} {appointment.service.serviceHandlers[0]?.providerUser.member.lastName || ''}
                    </h3>
                    <p className="text-sm text-muted-foreground">{appointment.service.serviceCategory.name}</p>
                  </div>
                  <Badge className={getStatusColor(appointment.status)}>
                    {appointment.status}
                  </Badge>
                </div>
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-2 text-custom-green" />
                  <span>{formatDate(appointment.appointmentDate)}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Clock className="h-4 w-4 mr-2 text-custom-green" />
                  <span>{formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}</span>
                </div>
                <div className="flex items-center text-sm">
                  <MapPin className="h-4 w-4 mr-2 text-custom-green" />
                  <span>{appointment.service.location}</span>
                </div>
                <div className="flex space-x-2 mt-2">
                  <Button variant="outline" className="flex-1 border-custom-green text-custom-green hover:bg-custom-green hover:text-white">Reschedule</Button>
                  <Button variant="outline" className="flex-1 border-red-500 text-red-500 hover:bg-red-500 hover:text-white">Cancel</Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}