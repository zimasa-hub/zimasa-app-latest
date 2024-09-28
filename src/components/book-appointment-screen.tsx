"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, Star, Calendar as CalendarIcon, Video, Users, CreditCard, FileText } from 'lucide-react'

type Provider = {
  id: string
  name: string
  specialty: string
  location: string
  rating: number
  nextAvailable: string
  avatar: string
}

type Appointment = {
  provider: Provider
  date: Date
  time: string
  type: 'in-person' | 'telehealth'
  patient: string
  paymentMethod: string
  notes: string
}

export default function BookAppointmentScreen() {
  const [step, setStep] = useState<'search' | 'profile' | 'form' | 'confirmation'>('search')
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [appointment, setAppointment] = useState<Appointment | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterSpecialty, setFilterSpecialty] = useState('')
  const [filterLocation, setFilterLocation] = useState('')
  const [filterInsurance, setFilterInsurance] = useState('')
  const [filterType, setFilterType] = useState<'in-person' | 'telehealth' | ''>('')

  const providers: Provider[] = [
    { id: '1', name: 'Dr. Sarah Johnson', specialty: 'General Practitioner', location: 'New York, NY', rating: 4.8, nextAvailable: 'Tomorrow', avatar: '/placeholder.svg?height=50&width=50' },
    { id: '2', name: 'Dr. Michael Lee', specialty: 'Pediatrician', location: 'Los Angeles, CA', rating: 4.9, nextAvailable: 'In 2 days', avatar: '/placeholder.svg?height=50&width=50' },
    { id: '3', name: 'Dr. Emily Chen', specialty: 'Dermatologist', location: 'Chicago, IL', rating: 4.7, nextAvailable: 'Next week', avatar: '/placeholder.svg?height=50&width=50' },
  ]

  const filteredProviders = providers.filter(provider => 
    provider.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterSpecialty === '' || provider.specialty === filterSpecialty) &&
    (filterLocation === '' || provider.location.includes(filterLocation)) &&
    (filterInsurance === '' || true) // Assuming all providers accept the selected insurance for this example
  )

  const handleProviderSelect = (provider: Provider) => {
    setSelectedProvider(provider)
    setStep('profile')
  }

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date)
  }

  const handleAppointmentSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    if (selectedProvider && selectedDate) {
      const newAppointment: Appointment = {
        provider: selectedProvider,
        date: selectedDate,
        time: formData.get('time') as string,
        type: formData.get('type') as 'in-person' | 'telehealth',
        patient: formData.get('patient') as string,
        paymentMethod: formData.get('paymentMethod') as string,
        notes: formData.get('notes') as string,
      }
      setAppointment(newAppointment)
      setStep('confirmation')
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Book Appointment</h1>
      
      {step === 'search' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Search and Filter</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="search">Search by Provider/Service</Label>
                <Input
                  id="search"
                  placeholder="e.g., Pediatrician, Telehealth"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="Enter city or zip code"
                  value={filterLocation}
                  onChange={(e) => setFilterLocation(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="specialty">Specialty</Label>
              <Select value={filterSpecialty} onValueChange={setFilterSpecialty}>
  <SelectTrigger>
    <SelectValue placeholder="Select specialty" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="all">All Specialties</SelectItem> {/* Use "all" or another non-empty value */}
    <SelectItem value="General Practitioner">General Practitioner</SelectItem>
    <SelectItem value="Pediatrician">Pediatrician</SelectItem>
    <SelectItem value="Dermatologist">Dermatologist</SelectItem>
  </SelectContent>
</Select>

              </div>
              <div>
                <Label htmlFor="insurance">Insurance</Label>
                <Select value={filterInsurance} onValueChange={setFilterInsurance}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select insurance" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Insurance</SelectItem>
                    <SelectItem value="BlueCross">BlueCross</SelectItem>
                    <SelectItem value="Aetna">Aetna</SelectItem>
                    <SelectItem value="UnitedHealthcare">UnitedHealthcare</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="type">Appointment Type</Label>
                <Select value={filterType} onValueChange={(value) => setFilterType(value as 'in-person' | 'telehealth' | '')}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="in-person">In-person</SelectItem>
                    <SelectItem value="telehealth">Telehealth</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Provider List</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                {filteredProviders.map((provider) => (
                  <div key={provider.id} className="flex items-center space-x-4 p-4 border-b last:border-b-0">
                    <Avatar>
                      <AvatarImage src={provider.avatar} alt={provider.name} />
                      <AvatarFallback>{provider.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold">{provider.name}</h3>
                      <p className="text-sm text-muted-foreground">{provider.specialty}</p>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4 mr-1" />
                        {provider.location}
                      </div>
                      <div className="flex items-center text-sm">
                        <Star className="w-4 h-4 mr-1 text-yellow-400" />
                        {provider.rating}
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary" className="mb-2">{provider.nextAvailable}</Badge>
                      <Button onClick={() => handleProviderSelect(provider)}>View Profile</Button>
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      )}

      {step === 'profile' && selectedProvider && (
        <Card>
          <CardHeader>
            <CardTitle>{selectedProvider.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <Avatar className="w-20 h-20">
                <AvatarImage src={selectedProvider.avatar} alt={selectedProvider.name} />
                <AvatarFallback>{selectedProvider.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold">{selectedProvider.name}</h2>
                <p className="text-muted-foreground">{selectedProvider.specialty}</p>
                <div className="flex items-center">
                  <Star className="w-4 h-4 mr-1 text-yellow-400" />
                  <span>{selectedProvider.rating}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{selectedProvider.location}</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">About</h3>
              <p>Dr. {selectedProvider.name.split(' ')[1]} is a highly experienced {selectedProvider.specialty.toLowerCase()} with over 10 years of practice. They specialize in providing comprehensive care for patients of all ages.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Select Appointment Date</h3>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                className="rounded-md border"
              />
            </div>
            {selectedDate && (
              <div>
                <h3 className="font-semibold mb-2">Available Time Slots</h3>
                <div className="grid grid-cols-3 gap-2">
                  {['9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM'].map((time) => (
                    <Button key={time} variant="outline" onClick={() => setStep('form')}>{time}</Button>
                  ))}
                </div>
              </div>
            )}
            <Button onClick={() => setStep('search')} variant="outline">Back to Search</Button>
          </CardContent>
        </Card>
      )}

      {step === 'form' && selectedProvider && selectedDate && (
        <Card>
          <CardHeader>
            <CardTitle>Confirm Appointment</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAppointmentSubmit} className="space-y-4">
              <div>
                <Label htmlFor="provider">Provider</Label>
                <Input id="provider" value={selectedProvider.name} readOnly />
              </div>
              <div>
                <Label htmlFor="date">Date</Label>
                <Input id="date" value={selectedDate.toDateString()} readOnly />
              </div>
              <div>
                <Label htmlFor="time">Time</Label>
                <Select name="time" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    {['9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM'].map((time) => (
                      <SelectItem key={time} value={time}>{time}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="type">Appointment Type</Label>
                <Select name="type" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="in-person">In-person</SelectItem>
                    <SelectItem value="telehealth">Telehealth</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="patient">Patient</Label>
                <Select name="patient" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select patient" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="self">Self</SelectItem>
                    <SelectItem value="Sarah">Sarah (Child)</SelectItem>
                    <SelectItem value="John">John (Spouse)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="paymentMethod">Payment Method</Label>
                <Select name="paymentMethod" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="credit-card">Credit Card</SelectItem>
                    <SelectItem value="insurance">Insurance</SelectItem>
                    <SelectItem value="healthcare-loan">Healthcare Loan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="notes">Notes/Concerns (Optional)</Label>
                <Textarea id="notes" name="notes" placeholder="Any additional information for the healthcare provider" />
              </div>
              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={() => setStep('profile')}>Back</Button>
                <Button type="submit">Confirm Appointment</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {step === 'confirmation' && appointment && (
        <Card>
          <CardHeader>
            <CardTitle>Appointment Confirmed</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-lg font-semibold">Your appointment has been successfully booked!</p>
            <div>
              <h3 className="font-semibold">Appointment Details:</h3>
              <p>Provider: {appointment.provider.name}</p>
              <p>Date: {appointment.date.toDateString()}</p>
              <p>Time: {appointment.time}</p>
              <p>Type: {appointment.type}</p>
              <p>Patient: {appointment.patient}</p>
            </div>
            <div className="flex space-x-4">
              <Button>
                <CalendarIcon className="w-4 h-4 mr-2" />
                Add to Calendar
              </Button>
              <Button variant="outline">
                <FileText className="w-4 h-4 mr-2" />
                View Receipt
              </Button>
            </div>
            <Button onClick={() => setStep('search')} className="w-full">Book Another Appointment</Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}