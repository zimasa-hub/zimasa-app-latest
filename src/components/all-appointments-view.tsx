import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MapPin, X } from "lucide-react"
import axios from 'axios'

type Appointment = {
  id: number
  service: {
    name: string
    providerUser: {
      member: {
        firstName: string
        lastName: string
      }
    }
    location: string
  }
  appointmentDate: string
  startTime: string
  endTime: string
  scheduleType: {
    name: string
  }
  status: string
  notes: string
}

interface AllAppointmentsViewProps {
  isOpen: boolean
  onClose: () => void
}

export default function AllAppointmentsView({ isOpen, onClose }: AllAppointmentsViewProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([])

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const currentDate = new Date().toISOString().split('T')[0]
        const response = await axios.get(`/api/user/book-appointment?localDate=${currentDate}`)
        setAppointments(response.data)
      } catch (error) {
        console.error('Error fetching appointments:', error)
      }
    }

    if (isOpen) {
      fetchAppointments()
    }
  }, [isOpen])

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] w-[95vw] rounded-lg p-0 bg-gray-100 overflow-hidden">
        <DialogHeader className="p-4 sm:p-6 bg-white border-b">
          <div className="flex justify-between items-center">
            <DialogTitle className="text-xl font-semibold">All Appointments</DialogTitle>
            <DialogClose asChild>
              <Button variant="ghost" className="p-1 h-auto">
                {/* <X className="h-4 w-4" /> */}
                <span className="sr-only">Close</span>
              </Button>
            </DialogClose>
          </div>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] sm:max-h-[60vh] p-4 sm:p-6">
          {appointments.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">No appointments scheduled for today.</p>
          ) : (
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <div key={appointment.id} className="p-4 border rounded-lg shadow-sm bg-white relative">
                  <Badge 
                    variant={appointment.status === 'Requested' ? 'secondary' : 'default'} 
                    className="absolute top-2 right-2 text-xs"
                  >
                    {appointment.status}
                  </Badge>
                  <h3 className="text-base sm:text-lg font-semibold mb-1">
                    Dr. {appointment.service.providerUser.member.firstName} {appointment.service.providerUser.member.lastName}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">{appointment.service.name}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span>{formatDate(appointment.appointmentDate)}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span>{formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span className="truncate">{appointment.service.location}</span>
                    </div>
                    <div className="flex items-center">
                      <Badge variant="outline" className="text-xs">{appointment.scheduleType.name}</Badge>
                    </div>
                  </div>
                  {appointment.notes && (
                    <div className="mt-3 pt-3 border-t">
                      <p className="text-sm font-semibold mb-1">Notes:</p>
                      <p className="text-sm text-muted-foreground">{appointment.notes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}