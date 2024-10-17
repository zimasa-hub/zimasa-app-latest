"use client"

import { useState, useMemo, useEffect } from 'react'
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
import axios from 'axios'
import { ServiceCategory, ServiceType } from '@/lib/interfaces/services/services'
import { DoctorData, DoctorsDataResponse } from '@/lib/interfaces/providers/doctors'
import { format, parse, addMinutes, isSameDay } from 'date-fns'


interface ProviderService {
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

interface FilteredProvidersResponse {
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

interface BookAppointmentScreenProps {
  doctors: DoctorsDataResponse
  scheduleTypes: ScheduleType[]
  currentMemberId: string
  serviceTypes: ServiceType[]
}

type Appointment = {
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

export default function BookAppointmentScreen({ doctors, scheduleTypes, currentMemberId, serviceTypes }: BookAppointmentScreenProps) {
  const [step, setStep] = useState<'search' | 'profile' | 'form' | 'confirmation'>('search')
  const [selectedProvider, setSelectedProvider] = useState<DoctorData | ProviderService | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [appointment, setAppointment] = useState<Appointment | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterLocation, setFilterLocation] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedServiceType, setSelectedServiceType] = useState<string>('')
  const [selectedServiceCategory, setSelectedServiceCategory] = useState<string>('')
  const [filteredProviders, setFilteredProviders] = useState<ProviderService[]>([])
  const [serviceCategories, setServiceCategories] = useState<ServiceCategory[]>([])
  const [isFiltered, setIsFiltered] = useState(false)

  const doctorsList = useMemo(() => {
    const uniqueDoctors = new Map<string, DoctorData>();
    doctors?.content?.forEach(doctor => {
      if (!uniqueDoctors.has(doctor.member.id.toString())) {
        uniqueDoctors.set(doctor.member.id.toString(), doctor);
      }
    });
    return Array.from(uniqueDoctors.values());
  }, [doctors]);
  const handleProviderSelect = (provider: DoctorData | ProviderService) => {
    setSelectedProvider(provider)
    setStep('profile')
  }



  const handleSelectChange = async (selectName: string, value: string) => {
    if (selectName === "serviceType") {
      setSelectedServiceType(value)
      setSelectedServiceCategory('')
      fetchServiceCategories(parseInt(value))
    } else if (selectName === "serviceCategory") {
      setSelectedServiceCategory(value)
      await fetchFilteredProviders(parseInt(value))
    }
  }


  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([])

  const availableDays = useMemo(() => {
    if (selectedProvider && 'serviceAvailability' in selectedProvider) {
      return selectedProvider.serviceAvailability.map(availability => availability.dayOfWeek.toLowerCase())
    }
    return ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'] // Default to weekdays if no specific availability
  }, [selectedProvider])

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date)
    if (date) {
      const dayOfWeek = format(date, 'EEEE').toLowerCase()
      if (availableDays.includes(dayOfWeek)) {
        generateTimeSlots(date)
      } else {
        setAvailableTimeSlots([])
      }
    }
  }

  const generateTimeSlots = (date: Date) => {
    if (selectedProvider && 'serviceAvailability' in selectedProvider) {
      const dayOfWeek = format(date, 'EEEE').toLowerCase()
      const availability = selectedProvider.serviceAvailability.find(a => a.dayOfWeek.toLowerCase() === dayOfWeek)
      
      if (availability) {
        const startTime = parse(availability.startTime, 'HH:mm:ss', date)
        const endTime = parse(availability.endTime, 'HH:mm:ss', date)
        const slots = []
        let currentSlot = startTime

        while (currentSlot < endTime) {
          slots.push(format(currentSlot, 'HH:mm'))
          currentSlot = addMinutes(currentSlot, selectedProvider.durationMins)
        }

        setAvailableTimeSlots(slots)
      } else {
        setAvailableTimeSlots([])
      }
    } else {
      // Fallback to default time slots if no specific availability
      setAvailableTimeSlots(['09:00', '10:00', '11:00', '13:00', '14:00', '15:00'])
    }
  }


  const fetchServiceCategories = async (serviceTypeId: number) => {
    try {
      const response = await axios.get<{ content: ServiceCategory[] }>('/api/user/service-categories', {
        params: {
          serviceTypeId,
          cursorId: 0,
          limit: 50,
          sortBy: 'id',
          sortDirection: 'asc'
        }
      })
      setServiceCategories(response.data.content)
    } catch (error) {
      console.error('Error fetching service categories:', error)
    }
  }

  const fetchFilteredProviders = async (serviceCategoryId: number) => {
    try {
      const response = await axios.get<FilteredProvidersResponse>('/api/user/filter-providers', {
        params: {
          serviceCategoryId,
          cursorId: 0,
          limit: 50,
          sortBy: 'id',
          sortDirection: 'asc'
        }
      })
      setFilteredProviders(response.data.content)
      setIsFiltered(true)
    } catch (error) {
      console.error('Error fetching filtered providers:', error)
      setFilteredProviders([])
    }
  }

  useEffect(() => {
    if (serviceTypes.length > 0) {
      setSelectedServiceType(serviceTypes[0].id.toString())
      fetchServiceCategories(serviceTypes[0].id)
    }
  }, [serviceTypes])

  const displayedProviders = useMemo(() => {
    if (isFiltered) {
      return filteredProviders.filter(provider => 
        provider.serviceHandlers.some(handler => 
          handler.providerUser.provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          handler.providerUser.member.username.toLowerCase().includes(searchTerm.toLowerCase())
        ) &&
        (filterLocation === '' || provider.serviceHandlers.some(handler => 
          handler.providerUser.provider.address.toLowerCase().includes(filterLocation.toLowerCase())
        ))
      )
    } else {
      return doctorsList.filter(doctor => 
        (doctor.member.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         doctor.provider.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (filterLocation === '' || doctor.provider.address.toLowerCase().includes(filterLocation.toLowerCase()))
      )
    }
  }, [isFiltered, filteredProviders, doctorsList, searchTerm, filterLocation])

  const handleAppointmentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    if (selectedProvider && selectedDate) {
      const startTime = formData.get('time') as string
      const [hours, minutes] = startTime.split(':')
      const appointmentDate = new Date(selectedDate)
      appointmentDate.setHours(parseInt(hours), parseInt(minutes), 0, 0)

      const endTime = new Date(appointmentDate)
      endTime.setMinutes(endTime.getMinutes() + ('durationMins' in selectedProvider ? selectedProvider.durationMins : 30))

      const appointmentType = formData.get('type') as string
      const location: "INPERSON" | "TELEHEALTH" = appointmentType.toUpperCase() === 'IN-PERSON' ? 'INPERSON' : 'TELEHEALTH'

      const newAppointment: Appointment = {
        providerService: selectedProvider.id,
        scheduleType: parseInt(formData.get('scheduleType') as string),
        appointmentDate: appointmentDate.toISOString(),
        duration: 'durationMins' in selectedProvider ? selectedProvider.durationMins : 30,
        startTime: `${startTime}:00`,
        endTime: `${endTime.getHours().toString().padStart(2, '0')}:${endTime.getMinutes().toString().padStart(2, '0')}:00`,
        notes: formData.get('notes') as string,
        communicationPreference: formData.get('communicationPreference') as string,
        location: location
      }

      try {
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

                  <div className="space-y-2">
                    <Label htmlFor="serviceType">Service Type</Label>
                    <Select
                      name="serviceType"
                      value={selectedServiceType}
                      onValueChange={(value) => handleSelectChange("serviceType", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select service type" />
                      </SelectTrigger>
                      <SelectContent>
                        {serviceTypes.map((type) => (
                          <SelectItem key={type.id} value={type.id.toString()}>{type.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="serviceCategory">Service Category</Label>
                    <Select
                      name="serviceCategory"
                      value={selectedServiceCategory}
                      onValueChange={(value) => handleSelectChange("serviceCategory", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {serviceCategories.map((category) => (
                          <SelectItem key={category.id} value={category.id.toString()}>{category.name}</SelectItem>
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
                {displayedProviders.map((provider) => (
                  <div key={provider.id} className="flex flex-col space-y-3 p-4 border-b last:border-b-0 hover:bg-gray-50 transition-colors duration-200">
                    {'serviceHandlers' in provider ? (
                      provider.serviceHandlers.map((handler) => (
                        <div key={handler.id} className="flex items-center space-x-4">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src="/male_doc.png?height=50&width=50" alt={`Dr. ${handler.providerUser.member.username}`} />
                            
                            <AvatarFallback>{handler.providerUser.member.username[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold text-lg text-primary">Dr. {handler.providerUser.member.username}</h3>
                            <p className="text-sm text-gray-600">{handler.providerUser.provider.name}</p>
                            <div className="flex flex-wrap gap-2 mt-1">
                              <Badge variant="secondary" className="rounded-full px-3 py-1 bg-primary/10 text-primary">
                                {provider.serviceCategory.name}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex items-center space-x-4">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src="/male_doc.png?height=50&width=50" alt={`Dr. ${provider.member.username}`} />
                          <AvatarFallback>{provider.member.username?.[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-lg text-primary">Dr. {provider.member.username}</h3>
                          <p className="text-sm text-gray-600">{provider.provider.name}</p>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {provider.providerUserSpecialists.map((specialist) => (
                              <Badge key={specialist.id} variant="secondary" className="rounded-full px-3 py-1 bg-primary/10 text-primary">
                                {specialist.specialist.name}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-1 text-primary" />
                      {'serviceHandlers' in provider
                        ? provider.serviceHandlers[0]?.providerUser.provider.address || "Address not available"
                        : provider.provider.address || provider.member.address || "Address not available"
                      }
                    </div>
                    <div className="flex justify-between items-center">
                      <Button onClick={() => handleProviderSelect(provider)} className="bg-[#008080] rounded-[5px]">View Profile</Button>
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
            <CardTitle className="text-2xl font-semibold text-primary">
              {'serviceHandlers' in selectedProvider
                ? `Dr. ${selectedProvider.serviceHandlers[0]?.providerUser.member.username}`
                : `Dr. ${selectedProvider.member.username}`
              }
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="w-24 h-24">
                <AvatarImage 
                  src="/male_doc.png?height=100&width=100" 
                  alt={'serviceHandlers' in selectedProvider
                    ? `Dr. ${selectedProvider.serviceHandlers[0]?.providerUser.member.username}`
                    : `Dr. ${selectedProvider.member.username}`
                  } 
                />
                <AvatarFallback>
                  {'serviceHandlers' in selectedProvider
                    ? selectedProvider.serviceHandlers[0]?.providerUser.member.username[0]
                    : selectedProvider.member.username?.[0]
                  }
                </AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h2 className="text-xl font-semibold text-primary">
                  {'serviceHandlers' in selectedProvider
                    ? `Dr. ${selectedProvider.serviceHandlers[0]?.providerUser.member.username}`
                    : `Dr. ${selectedProvider.member.username}`
                  }
                </h2>
                <p className="text-gray-600">
                  {'serviceHandlers' in selectedProvider
                    ? selectedProvider.serviceHandlers[0]?.providerUser.provider.name
                    : selectedProvider.provider.name
                  }
                </p>
                <div className="flex items-center justify-center mt-1">
                  {'serviceCategory' in selectedProvider ? (
                    <Badge variant="secondary" className="rounded-full px-3 py-1 bg-primary/10 text-primary">
                      {selectedProvider.serviceCategory.name}
                    </Badge>
                  ) : (
                    selectedProvider.providerUserSpecialists.map((specialist) => (
                      <Badge key={specialist.id} variant="secondary" className="rounded-full px-3 py-1 bg-primary/10 text-primary">
                        {specialist.specialist.name}
                      </Badge>
                    ))
                  )}
                </div>
                <div className="flex items-center justify-center mt-1 text-gray-600">
                  <MapPin className="w-5 h-5 mr-1 text-primary" />
                  <span>
                    {'serviceHandlers' in selectedProvider
                      ? selectedProvider.serviceHandlers[0]?.providerUser.provider.address || "Address not available"
                      : selectedProvider.provider.address || selectedProvider.member.address || "Address not available"
                    }
                  </span>
                </div>
              </div>
            </div>
            {'description' in selectedProvider && (
              <div>
                <h3 className="font-semibold text-lg text-primary mb-2">Service Description</h3>
                <p>{selectedProvider.description}</p>
              </div>
            )}
            <div>
              <h3 className="font-semibold text-lg text-primary mb-2">Contact Information</h3>
              <p><span className="font-semibold">Email:</span> {
                'serviceHandlers' in selectedProvider
                  ? selectedProvider.serviceHandlers[0]?.providerUser.provider.contactEmail
                  : selectedProvider.provider.contactEmail
              }</p>
              <p><span className="font-semibold">Phone:</span> {
                'serviceHandlers' in selectedProvider
                  ? selectedProvider.serviceHandlers[0]?.providerUser.provider.contactPhone
                  : selectedProvider.provider.contactPhone
              }</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-primary mb-2">Select Appointment Date</h3>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                className="rounded-[5px] border border-gray-200 p-3"
                modifiers={{
                  available: (date) => availableDays.includes(format(date, 'EEEE').toLowerCase())
                }}
                modifiersStyles={{
                  available: { backgroundColor: 'rgba(0, 255, 0, 0.1)' }
                }}
              />
            </div>
            {selectedDate && (
              <div>
                <h3 className="font-semibold text-lg text-primary mb-2">Available Time Slots</h3>
                {availableTimeSlots.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2">
                    {availableTimeSlots.map((time) => (
                      <Button key={time} variant="outline" onClick={() => setStep('form')} className="rounded-[5px]">
                        <Clock className="w-4 h-4 mr-2" />
                        {time}
                      </Button>
                    ))}
                  </div>
                ) : (
                  <p className="text-red-500">No available time slots for the selected date.</p>
                )}
              </div>
            )}
            <Button onClick={() => setStep('search')} variant="outline" className="w-full rounded-[5px]">
              <ChevronDown className="w-4 h-4 mr-2" />
              Back to Search
            </Button>
          </CardContent>
        </Card>
      )}

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
                <Input 
                  id="provider" 
                  value={
                    'serviceHandlers' in selectedProvider
                      ? `Dr. ${selectedProvider.serviceHandlers[0]?.providerUser.member.username}`
                      : `Dr. ${selectedProvider.member.username}`
                  } 
                  readOnly 
                  className="rounded-[5px]" 
                />
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
                    {availableTimeSlots.map((time, index) => (
                      <SelectItem key={`${time}-${index}`} value={time}>{time}</SelectItem>
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
              <p><span className="font-semibold">Provider:</span> Dr. {
                'serviceHandlers' in selectedProvider!
                  ? selectedProvider!.serviceHandlers[0]?.providerUser.member.username
                  : selectedProvider!.member.username
              }</p>
              <p><span className="font-semibold">Date:</span> {new Date(appointment.appointmentDate).toDateString()}</p>
              <p><span className="font-semibold">Time:</span> {appointment.startTime} - {appointment.endTime}</p>
              <p><span className="font-semibold">Duration:</span> {appointment.duration} minutes</p>
              <p><span className="font-semibold">Appointment Type:</span> {scheduleTypes.find(type => type.id === appointment.scheduleType)?.name}</p>
              <p><span className="font-semibold">Mode:</span> {appointment.location}</p>
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