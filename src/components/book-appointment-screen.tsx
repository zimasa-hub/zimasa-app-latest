"use client"

import { useState, useMemo } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, Calendar as CalendarIcon, FileText, ChevronDown, ChevronUp, Search, Filter, Clock, User, CreditCard, Stethoscope, Star } from 'lucide-react'
import { DoctorData, DoctorsDataResponse } from '@/lib/interfaces/providers/doctors'
import axios from 'axios'

type Appointment = {
  providerService: number
  scheduleType: number
  member?: string
  appointmentDate: string
  duration: number
  startTime: string
  endTime: string
  notes: string
  communicationPreference: string
  type: 'in-person' | 'telehealth'
}

interface ScheduleType {
  id: number
  name: string
  description: string
  slotDurationMinutes: number
  breakDurationMinutes: number
}

interface BookAppointmentScreenProps {
  doctors: DoctorsDataResponse
  scheduleTypes: ScheduleType[]
  currentMemberId: string
}

export default function BookAppointmentScreen({ doctors, scheduleTypes, currentMemberId }: BookAppointmentScreenProps) {
  console.log("DOC DATA : ", doctors)
  console.log("SCHEDULE TYPES : ", scheduleTypes)
  const [step, setStep] = useState<'search' | 'profile' | 'form' | 'confirmation'>('search')
  const [selectedProvider, setSelectedProvider] = useState<DoctorData | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [appointment, setAppointment] = useState<Appointment | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterSpecialty, setFilterSpecialty] = useState('all')
  const [filterLocation, setFilterLocation] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const doctorsList = useMemo(() => {
    const uniqueDoctors = new Map<string, DoctorData>();
    doctors?.content?.forEach(doctor => {
      if (!uniqueDoctors.has(doctor.member.id.toString())) {
        uniqueDoctors.set(doctor.member.id.toString(), doctor);
      }
    });
    return Array.from(uniqueDoctors.values());
  }, [doctors]);

  const specialties = useMemo(() => {
    const specialtiesSet = new Set<string>()
    doctorsList.forEach(doctor => {
      doctor.providerUserSpecialists.forEach(specialist => {
        specialtiesSet.add(specialist.specialist.name)
      })
    })
    return Array.from(specialtiesSet)
  }, [doctorsList])

  const filteredDoctors = useMemo(() => {
    return doctorsList.filter(doctor => 
      (doctor.member.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       doctor.provider.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterSpecialty === 'all' || doctor.providerUserSpecialists.some(s => s.specialist.name === filterSpecialty)) &&
      (filterLocation === '' || doctor.provider.address.toLowerCase().includes(filterLocation.toLowerCase()))
    )
  }, [doctorsList, searchTerm, filterSpecialty, filterLocation])

  const handleProviderSelect = (doctor: DoctorData) => {
    setSelectedProvider(doctor)
    setStep('profile')
  }

 
  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date)
  }

  const handleAppointmentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    if (selectedProvider && selectedDate) {
      const startTime = formData.get('time') as string
      const [hours, minutes] = startTime.split(':')
      const appointmentDate = new Date(selectedDate)
      appointmentDate.setHours(parseInt(hours), parseInt(minutes), 0, 0)
  
      const endTime = new Date(appointmentDate)
      endTime.setMinutes(endTime.getMinutes() + 30) // Assuming 30-minute appointments
  
      const newAppointment: Appointment = {
        providerService: selectedProvider.id,
        scheduleType: parseInt(formData.get('scheduleType') as string),
        appointmentDate: appointmentDate.toISOString(),
        duration: 30,
        startTime: `${startTime}:00`, // Add seconds for consistency
        endTime: `${endTime.getHours().toString().padStart(2, '0')}:${endTime.getMinutes().toString().padStart(2, '0')}:00`,
        notes: formData.get('notes') as string,
        communicationPreference: formData.get('communicationPreference') as string,
        type: formData.get('type') as 'in-person' | 'telehealth'
      }
  
      try {
        // Convert the appointment object to a properly formatted JSON string
        const appointmentPayload = JSON.stringify(newAppointment)
        console.log("APPOINTMENT TO SEND : ", appointmentPayload)
  
        const response = await axios.post('/api/user/book-appointment', appointmentPayload, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
  
        if (response.status === 200) {
          setAppointment(newAppointment)
          setStep('confirmation')
        } else {
          console.error('Failed to book appointment')
        }
      } catch (error) {
        console.error('Error booking appointment:', error)
      }
    }
  }

  

  

  const getDummyRating = () => (Math.random() * (5 - 4) + 4).toFixed(1)

  return (
    <div className="container mx-auto p-4 mb-14 font-poppins" style={{ '--primary': '#008080' } as React.CSSProperties}>
      <h1 className="text-xl font-bold mb-6 text-primary">Book Appointment</h1>
      
      {step === 'search' && (
        <div className="space-y-6">
          <Card className="rounded-[5px] shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-primary flex items-center">
                <Search className="w-6 h-6 mr-2" />
                Search and Filter
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Input
                  placeholder="Search by Provider/Service"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 rounded-[5px]"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
              <Button 
                onClick={() => setShowFilters(!showFilters)} 
                variant="outline" 
                className="w-full flex justify-between items-center rounded-[5px]"
              >
                <span className="flex items-center">
                  <Filter className="w-5 h-5 mr-2" />
                  {showFilters ? 'Hide Filters' : 'Show Filters'}
                </span>
                {showFilters ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </Button>
              {showFilters && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="location" className="text-primary">Location</Label>
                    <Input
                      id="location"
                      placeholder="Enter city or zip code"
                      value={filterLocation}
                      onChange={(e) => setFilterLocation(e.target.value)}
                      className="rounded-[5px]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="specialty" className="text-primary">Specialty</Label>
                    <Select value={filterSpecialty} onValueChange={setFilterSpecialty}>
                      <SelectTrigger className="rounded-[5px]">
                        <SelectValue placeholder="Select specialty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Specialties</SelectItem>
                        {specialties.map((specialty) => (
                          <SelectItem key={specialty} value={specialty}>{specialty}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          <Card className="rounded-[5px] shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-primary flex items-center">
                <User className="w-6 h-6 mr-2" />
                Provider List
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                {filteredDoctors.map((doctor) => (
                  <div key={doctor.id} className="flex flex-col space-y-3 p-4 border-b last:border-b-0 hover:bg-gray-50 transition-colors duration-200">
                    <div className="flex items-center space-x-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src="/male_doc.png?height=50&width=50" alt={`Dr. ${doctor.member.username}`} />
                        <AvatarFallback>{doctor.member.username?.[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-lg text-primary">Dr. {doctor.member.username}</h3>
                        <p className="text-sm text-gray-600">{doctor.provider.name}</p>
                        <div className="flex items-center mt-1">
                          <Star className="w-4 h-4 text-yellow-400 mr-1" />
                          <span className="text-sm text-gray-600">{getDummyRating()} (50+ reviews)</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-1 text-primary" />
                      {doctor.provider.address || doctor.member.address || "Address not available"}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {doctor.providerUserSpecialists.map((specialist) => (
                        <Badge key={specialist.id} variant="secondary" className="rounded-full px-3 py-1 bg-primary/10 text-primary">
                          {specialist.specialist.name}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex justify-between items-center">
                      <Button onClick={() => handleProviderSelect(doctor)} className="bg-[#008080] rounded-[5px]">View Profile</Button>
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      )}

      {step === 'profile' && selectedProvider && (
        <Card className="rounded-[5px] shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-primary">Dr. {selectedProvider.member.username}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="w-24 h-24">
                <AvatarImage src="/male_doc.png?height=100&width=100" alt={`Dr. ${selectedProvider.member.username}`} />
                <AvatarFallback>{selectedProvider.member.username?.[0]}</AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h2 className="text-xl font-semibold text-primary">Dr. {selectedProvider.member.username}</h2>
                <p className="text-gray-600">{selectedProvider.provider.name}</p>
                <div className="flex items-center justify-center mt-1">
                  <Star className="w-5 h-5 text-yellow-400 mr-1" />
                  <span className="text-gray-600">{getDummyRating()} (50+ reviews)</span>
                </div>
                <div className="flex items-center justify-center mt-1 text-gray-600">
                  <MapPin className="w-5 h-5 mr-1 text-primary" />
                  <span>{selectedProvider.provider.address || selectedProvider.member.address || "Address not available"}</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-primary mb-2">Specialties</h3>
              <div className="flex flex-wrap gap-2">
                {selectedProvider.providerUserSpecialists.map((specialist) => (
                  <Badge key={specialist.id} variant="secondary" className="rounded-full px-3 py-1 bg-primary/10 text-primary">
                    {specialist.specialist.name}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-primary mb-2">Contact Information</h3>
              <p><span className="font-semibold">Email:</span> {selectedProvider.provider.contactEmail}</p>
              <p><span className="font-semibold">Phone:</span> {selectedProvider.provider.contactPhone}</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-primary mb-2">Select Appointment Date</h3>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                className="rounded-[5px] border border-gray-200 p-3"
              />
            </div>
            {selectedDate && (
              <div>
                <h3 className="font-semibold text-lg text-primary mb-2">Available Time Slots</h3>
                <div className="grid grid-cols-2 gap-2">
                  {['9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM'].map((time) => (
                    <Button key={time} variant="outline" onClick={() => setStep('form')} className="rounded-[5px]">
                      <Clock className="w-4 h-4 mr-2" />
                      {time}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            <Button onClick={() => setStep('search')} variant="outline" className="w-full rounded-[5px]">
              <ChevronDown className="w-4 h-4 mr-2" />
              Back to Search
            </Button>
          </CardContent>
        </Card>
      )}

{/* appointment details to send to API */}
{step === 'form' && selectedProvider && selectedDate && (
        <Card className="rounded-[5px] shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-primary flex items-center">
              <FileText className="w-6 h-6 mr-2" />
              Confirm Appointment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAppointmentSubmit} className="space-y-4">
              <div>
                <Label htmlFor="provider" className="text-primary">Provider</Label>
                <Input id="provider" value={`Dr. ${selectedProvider.member.username}`} readOnly className="rounded-[5px]" />
              </div>
              <div>
                <Label htmlFor="date" className="text-primary">Date</Label>
                <Input id="date" value={selectedDate.toDateString()} readOnly className="rounded-[5px]" />
              </div>
              <div>
                <Label htmlFor="time" className="text-primary">Time</Label>
                <Select name="time" required>
                  <SelectTrigger className="rounded-[5px]">
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    {['09:00', '10:00', '11:00', '13:00', '14:00', '15:00'].map((time) => (
                      <SelectItem key={time} value={time}>{time}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="scheduleType" className="text-primary">Appointment Type</Label>
                <Select name="scheduleType" required>
                  <SelectTrigger className="rounded-[5px]">
                    <SelectValue placeholder="Select appointment type" />
                  </SelectTrigger>
                  <SelectContent>
                    {scheduleTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id.toString()}>{type.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="type" className="text-primary">Appointment Mode</Label>
                <Select name="type" required>
                  <SelectTrigger className="rounded-[5px]">
                    <SelectValue placeholder="Select mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="in-person">In-person</SelectItem>
                    <SelectItem value="telehealth">Telehealth</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="communicationPreference" className="text-primary">Communication Preference</Label>
                <Select name="communicationPreference" required>
                  <SelectTrigger className="rounded-[5px]">
                    <SelectValue placeholder="Select preference" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SMS">SMS</SelectItem>
                    <SelectItem value="EMAIL">Email</SelectItem>
                    {/* <SelectItem value="WEEKLY">Phone</SelectItem> */}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="notes" className="text-primary">Notes/Concerns</Label>
                <Textarea id="notes" name="notes" placeholder="Any additional information for the healthcare provider" className="rounded-[5px]" />
              </div>
              <div className="space-y-2">
                <Button type="button" variant="outline" onClick={() => setStep('profile')} className="w-full rounded-[5px]">
                  <ChevronDown className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button type="submit" className="w-full rounded-[5px] bg-custom-green">
                  <Stethoscope className="w-4 h-4 mr-2" />
                  Confirm Appointment
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

{/* Appointment confirmation */}
{step === 'confirmation' && appointment && (
  <Card className="rounded-[5px] shadow-lg">
    <CardHeader>
      <CardTitle className="text-2xl font-semibold text-primary flex items-center">
        <Stethoscope className="w-6 h-6 mr-2" />
        Appointment Confirmed
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-6">
      <p className="text-lg font-semibold text-green-600">Your appointment has been successfully booked!</p>
      <div className="bg-gray-50 p-4 rounded-[5px]">
        <h3 className="font-semibold text-lg text-primary mb-2">Appointment Details:</h3>
        <p><span className="font-semibold">Provider:</span> Dr. {selectedProvider?.member.username}</p>
        <p><span className="font-semibold">Date:</span> {new Date(appointment.appointmentDate).toDateString()}</p>
        <p><span className="font-semibold">Time:</span> {appointment.startTime} - {appointment.endTime}</p>
        <p><span className="font-semibold">Duration:</span> {appointment.duration} minutes</p>
        <p><span className="font-semibold">Appointment Type:</span> {scheduleTypes.find(type => type.id === appointment.scheduleType)?.name}</p>
        <p><span className="font-semibold">Mode:</span> {appointment.type}</p>
        <p><span className="font-semibold">Communication Preference:</span> {appointment.communicationPreference}</p>
        <p><span className="font-semibold">Notes:</span> {appointment.notes || 'No additional notes'}</p>
      </div>
      <div className="space-y-2">
        <Button className="w-full rounded-[5px] bg-custom-green hover:bg-custom-green">
          <CalendarIcon className="w-4 h-4 mr-2" />
          Add to Calendar
        </Button>
        <Button variant="outline" className="w-full rounded-[5px]">
          <FileText className="w-4 h-4 mr-2" />
          View Receipt
        </Button>
      </div>
      <Button onClick={() => setStep('search')} className="w-full rounded-[5px] bg-custom-green">
        <Stethoscope className="w-4 h-4 mr-2" />
        Book Another Appointment
      </Button>
    </CardContent>
  </Card>
)}
    </div>
  )
}