'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, Calendar, Clock, MapPin, RefreshCw, Check } from 'lucide-react'
import { Appointment } from '@/lib/interfaces/appointments/appointments'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import axios from 'axios'
import { Label } from '../ui/label'

interface AllAppointmentsViewProps {
  isOpen: boolean
  onClose: () => void
  currentMemberId: string | null;
}

export default function AllAppointmentsView({ isOpen, onClose, currentMemberId }: AllAppointmentsViewProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([])
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [scheduleTypeFilter, setScheduleTypeFilter] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false)
  const [isRescheduleDialogOpen, setIsRescheduleDialogOpen] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<number | null>(null)
  const [rescheduleDate, setRescheduleDate] = useState('')
  const [rescheduleTime, setRescheduleTime] = useState('')

  useEffect(() => {
    if (isOpen) {
      fetchAppointments()
    }
  }, [isOpen])

  useEffect(() => {
    filterAppointments()
  }, [appointments, startDate, endDate, statusFilter, scheduleTypeFilter])

  const fetchAppointments = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await axios.get('/api/user/doc-all-appointments')
      setAppointments(response.data.appointmentsResponse.content)
    } catch (error) {
      console.error('Error fetching appointments:', error)
      setError('Failed to load appointments. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const filterAppointments = () => {
    const filtered = appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.appointmentDate)
      const isAfterStartDate = !startDate || appointmentDate >= new Date(startDate)
      const isBeforeEndDate = !endDate || appointmentDate <= new Date(endDate)
      const matchesStatus = !statusFilter || appointment.status === statusFilter
      const matchesScheduleType = !scheduleTypeFilter || appointment.scheduleType.name === scheduleTypeFilter

      return isAfterStartDate && isBeforeEndDate && matchesStatus && matchesScheduleType
    })
    setFilteredAppointments(filtered)
  }

  const formatAppointmentDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatAppointmentTime = (startTime: string, endTime: string) => {
    const formatTime = (time: string) => {
      return new Date(`1970-01-01T${time}`).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
      })
    }
    return `${formatTime(startTime)} - ${formatTime(endTime)}`
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'REQUESTED':
        return 'bg-yellow-100 text-yellow-800';
      case 'SCHEDULED':
        return 'bg-blue-100 text-blue-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAppointmentAction = async (appointmentId: number, action: string, reason: string='' ) => {

    console.log("APPOINTMENTS : ", appointments)
    try {
      const response = await axios.put(`/api/user/appointment-action`, {
        appointmentId,
        action,
        reason: reason || 'Slot time available',
        userEntityId: currentMemberId
      })

      console.log("RESPONSE : ", response)

      if (response.status === 200) {
        setAppointments(appointments.map(appointment => 
          appointment.id === appointmentId 
            ? { ...appointment, status: action === 'REJECT' ? 'CANCELLED' : action } 
            : appointment
        ))
      }
    } catch (error) {
      console.error(`Error ${action.toLowerCase()}ing appointment:`, error)
      setError(`Failed to ${action.toLowerCase()} appointment. Please try again.`)
    }
  }

  const handleReschedule = (appointmentId: number) => {
    const appointment = appointments.find(a => a.id === appointmentId)
    if (appointment) {
      setSelectedAppointmentId(appointmentId)
      setRescheduleDate(appointment.appointmentDate.split('T')[0])
      setRescheduleTime(appointment.startTime.slice(0, 5))
      setIsRescheduleDialogOpen(true)
    } else {
      console.error('Appointment not found')
      setError('Unable to reschedule. Appointment not found.')
    }
  }

  const confirmReschedule = async () => {
    if (selectedAppointmentId === null) {
      console.error('No appointment selected for rescheduling')
      setError('No appointment selected for rescheduling')
      return
    }
  
    try {
      const appointment = appointments.find(a => a.id === selectedAppointmentId)
      if (!appointment) {
        throw new Error('Appointment not found')
      }
  
      // Ensure duration is a number and has a default value
      const duration = typeof appointment.service.durationMins === 'number' ? appointment.service.durationMins : 30 // Default to 30 minutes if not set
  
      const reschedulePayload = {
        id: selectedAppointmentId,
        notes: appointment.notes || '',
        appointmentDate: `${rescheduleDate}T${rescheduleTime}:00`,
        startTime: `${rescheduleTime}:00`,
        duration: duration,
        endTime: calculateEndTime(rescheduleTime, duration),
        scheduleType: appointment.scheduleType?.id || 1,
        communicationPreference: appointment.service.serviceAvailability || 'SMS',  //change here NOW ASAP
        location: appointment.service.location || 'INPERSON'
      }

      console.log("SCHEDULE ", reschedulePayload)
  
      console.log('Reschedule payload:', JSON.stringify(reschedulePayload, null, 2))
  
      const response = await axios.post('/api/user/reschedule-appointment', reschedulePayload)
      if (response.status === 200) {
        setAppointments(appointments.map(a => 
          a.id === selectedAppointmentId 
            ? { ...a, appointmentDate: rescheduleDate, startTime: rescheduleTime, endTime: reschedulePayload.endTime, duration: duration } 
            : a
        ))
        setIsRescheduleDialogOpen(false)
        setRescheduleDate('')
        setRescheduleTime('')
        setSelectedAppointmentId(null)
      } else {
        throw new Error('Failed to reschedule appointment')
      }
    } catch (error) {
      console.error('Error rescheduling appointment:', error)
      setError('Failed to reschedule appointment. Please try again.')
    }
  }
  
  const calculateEndTime = (startTime: string, durationMinutes: number): string => {
    const [hours, minutes] = startTime.split(':').map(Number)
    const endDate = new Date(0, 0, 0, hours, minutes + durationMinutes)
    return endDate.toTimeString().slice(0, 8) // Returns in format HH:MM:SS
  }
  
 




  const handleReject = (appointmentId: number) => {
    setSelectedAppointmentId(appointmentId)
    setIsRejectDialogOpen(true)
  }

  const confirmReject = () => {
    if (selectedAppointmentId !== null) {
      handleAppointmentAction(selectedAppointmentId, 'REJECT', rejectReason)
      setIsRejectDialogOpen(false)
      setRejectReason('')
      setSelectedAppointmentId(null)
    }
  }

  const handleConfirm = (appointmentId: number) => {
    console.log("SCHEDULE")
    handleAppointmentAction(appointmentId, 'SCHEDULE')

  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-hidden flex flex-col">
      <div className="bg-teal-600 text-white p-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold">All Appointments</h2>
        <button onClick={onClose} className="text-white hover:bg-teal-700 p-1 rounded">
          <X className="h-6 w-6" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <div className="mb-4">
         
          <div className="flex space-x-2">
         
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="flex-1"
            />
          </div>
        </div>
        <div className="mb-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Statuses</SelectItem>
              <SelectItem value="REQUESTED">Requested</SelectItem>
              <SelectItem value="SCHEDULED">Scheduled</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="mb-4">
          <Select value={scheduleTypeFilter} onValueChange={setScheduleTypeFilter}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filter by schedule type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Types</SelectItem>
              <SelectItem value="Basic Consultation">Basic Consultation</SelectItem>
              <SelectItem value="Follow-up">Follow-up</SelectItem>
              <SelectItem value="Specialist Consultation">Specialist Consultation</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button 
          variant="outline" 
          className="w-full mb-4 text-teal-600 border-teal-600 hover:bg-teal-50"
          onClick={() => {
            setStartDate('')
            setEndDate('')
            setStatusFilter('')
            setScheduleTypeFilter('')
          }}
        >
          Clear Filters
        </Button>
        {isLoading ? (
          <div className="text-center py-4">Loading appointments...</div>
        ) : error ? (
          <div className="text-center py-4 text-red-600">{error}</div>
        ) : filteredAppointments.length === 0 ? (
          <div className="text-center py-4">No appointments found.</div>
        ) : (
          <div className="space-y-4">
            {filteredAppointments.map((appointment) => (
              <div key={appointment.id} className="border rounded-lg p-4 relative">
                <h3 className="font-semibold">{appointment.member.firstName} {appointment.member.lastName}</h3>
                <p className="text-sm text-gray-600">{appointment.service.serviceCategory.name}</p>
                <span className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(appointment.status)}`}>
                  {appointment.status}
                </span>
                <div className="flex items-center space-x-2 text-gray-600 text-sm">
                  <Calendar className="h-4 w-4" />
                  <span>{formatAppointmentDate(appointment.appointmentDate)}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600 text-sm">
                  <Clock className="h-4 w-4" />
                  <span>{formatAppointmentTime(appointment.startTime, appointment.endTime)}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600 text-sm">
                  <MapPin className="h-4 w-4" />
                  <span>Main Clinic</span>
                </div>
                {appointment.status === 'REQUESTED' && (
                  <div className="flex space-x-2 mt-4 bg-gray-50 p-2 rounded-md">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1 text-teal-600 hover:bg-teal-50 hover:text-teal-700"
                      onClick={() => handleReschedule(appointment.id)}
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Reschedule
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1 text-red-600 hover:bg-red-50 hover:text-red-700"
                      onClick={() => handleReject(appointment.id)}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Reject
                    </Button>

                    <Button
                        variant="ghost"
                        size="sm"
                        className="flex-1 text-green-600 hover:bg-green-50 hover:text-green-700"
                        onClick={() => handleConfirm(appointment.id)}
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Confirm
                      </Button>

                 

                     
                    
                  </div>
                )}

{appointment.status === 'SCHEDULED' && (
  <div className="flex space-x-2 mt-4 bg-gray-50 p-2 rounded-md">
                       <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1 text-teal-600 hover:bg-teal-50 hover:text-teal-700"
                      onClick={() => handleReschedule(appointment.id)}
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Reschedule
                    </Button>
                      </div>
                    )}

              </div>
            ))}
          </div>
        )}
      </div>
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Appointment</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this appointment.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Rejection reason"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>Cancel</Button>
            <Button onClick={confirmReject}>Reject</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={isRescheduleDialogOpen} onOpenChange={setIsRescheduleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reschedule Appointment</DialogTitle>
            <DialogDescription>
              Select a new date and time for the appointment.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="rescheduleDate">New Date</Label>
              <Input
                id="rescheduleDate"
                type="date"
                value={rescheduleDate}
                onChange={(e) => setRescheduleDate(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="rescheduleTime">New Time</Label>
              <Input
                id="rescheduleTime"
                type="time"
                value={rescheduleTime}
                onChange={(e) => setRescheduleTime(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRescheduleDialogOpen(false)}>Cancel</Button>
            <Button onClick={confirmReschedule}>Reschedule</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}