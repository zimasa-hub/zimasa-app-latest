"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Filter, MapPin, Calendar as CalendarIcon, Star, DollarSign, Clock, Video, Users, Heart, Dumbbell, Award } from 'lucide-react'

type Service = {
  id: string
  name: string
  provider: string
  type: 'medical' | 'wellness' | 'fitness'
  format: 'telehealth' | 'in-person'
  price: number
  rating: number
  location?: string
  nextAvailable: string
  acceptsWellthPoints: boolean
  wellthPointsCost?: number
}

type Provider = {
  id: string
  name: string
  specialty: string
  rating: number
  services: string[]
  qualifications: string[]
  image: string
}

export default function BrowseHealthServicesScreen() {
  const [activeTab, setActiveTab] = useState<'browse' | 'compare'>('browse')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'medical' | 'wellness' | 'fitness'>('all')
  const [selectedFormat, setSelectedFormat] = useState<'all' | 'telehealth' | 'in-person'>('all')
  const [maxDistance, setMaxDistance] = useState<number>(50)
  const [showWellthPointsOnly, setShowWellthPointsOnly] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [isProviderModalOpen, setIsProviderModalOpen] = useState(false)
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null)
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const [selectedService, setSelectedService] = useState<Service | null>(null)

  const services: Service[] = [
    { id: '1', name: 'General Consultation', provider: 'Dr. Smith', type: 'medical', format: 'telehealth', price: 50, rating: 4.8, nextAvailable: '2023-05-20', acceptsWellthPoints: true, wellthPointsCost: 500 },
    { id: '2', name: 'Nutritional Counseling', provider: 'Jane Doe', type: 'wellness', format: 'in-person', price: 75, rating: 4.5, location: 'Health Center A', nextAvailable: '2023-05-22', acceptsWellthPoints: false },
    { id: '3', name: 'Personal Training Session', provider: 'Mike Fit', type: 'fitness', format: 'in-person', price: 60, rating: 4.9, location: 'Gym X', nextAvailable: '2023-05-21', acceptsWellthPoints: true, wellthPointsCost: 600 },
    { id: '4', name: 'Mental Health Consultation', provider: 'Dr. Johnson', type: 'medical', format: 'telehealth', price: 80, rating: 4.7, nextAvailable: '2023-05-23', acceptsWellthPoints: false },
    { id: '5', name: 'Yoga Class', provider: 'Sarah Zen', type: 'fitness', format: 'in-person', price: 20, rating: 4.6, location: 'Yoga Studio Y', nextAvailable: '2023-05-20', acceptsWellthPoints: true, wellthPointsCost: 200 },
  ]

  const providers: Provider[] = [
    { id: '1', name: 'Dr. Smith', specialty: 'General Practitioner', rating: 4.8, services: ['General Consultation', 'Telehealth'], qualifications: ['MD', 'Board Certified'], image: '/placeholder.svg?height=100&width=100' },
    { id: '2', name: 'Jane Doe', specialty: 'Nutritionist', rating: 4.5, services: ['Nutritional Counseling'], qualifications: ['Registered Dietitian', 'Certified Nutritionist'], image: '/placeholder.svg?height=100&width=100' },
    { id: '3', name: 'Mike Fit', specialty: 'Personal Trainer', rating: 4.9, services: ['Personal Training', 'Fitness Assessment'], qualifications: ['Certified Personal Trainer', 'Exercise Physiologist'], image: '/placeholder.svg?height=100&width=100' },
  ]

  const filteredServices = services.filter(service => 
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedCategory === 'all' || service.type === selectedCategory) &&
    (selectedFormat === 'all' || service.format === selectedFormat) &&
    (!showWellthPointsOnly || service.acceptsWellthPoints)
  )

  const handleProviderClick = (providerId: string) => {
    const provider = providers.find(p => p.id === providerId)
    if (provider) {
      setSelectedProvider(provider)
      setIsProviderModalOpen(true)
    }
  }

  const handleBookService = (service: Service) => {
    setSelectedService(service)
    setIsBookingModalOpen(true)
  }

  const handleBookingConfirm = () => {
    // Here you would typically send the booking data to your backend
    console.log('Booking confirmed:', selectedService)
    setIsBookingModalOpen(false)
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">Browse Health Services</h1>
      
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'browse' | 'compare')}>
        <TabsList>
          <TabsTrigger value="browse">Browse Services</TabsTrigger>
          <TabsTrigger value="compare">Compare Services</TabsTrigger>
        </TabsList>

        <TabsContent value="browse">
          <Card>
            <CardHeader>
              <CardTitle>Health Services Marketplace</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-4">
                <div className="flex-1">
                  <Label htmlFor="search-services" className="sr-only">Search services</Label>
                  <Input
                    id="search-services"
                    placeholder="Search services..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                <Select value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as 'all' | 'medical' | 'wellness' | 'fitness')}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="medical">Medical</SelectItem>
                    <SelectItem value="wellness">Wellness</SelectItem>
                    <SelectItem value="fitness">Fitness</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedFormat} onValueChange={(value) => setSelectedFormat(value as 'all' | 'telehealth' | 'in-person')}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Formats</SelectItem>
                    <SelectItem value="telehealth">Telehealth</SelectItem>
                    <SelectItem value="in-person">In-Person</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-4 mb-4">
                <div>
                  <Label htmlFor="max-distance">Max Distance (km)</Label>
                  <Slider
                    id="max-distance"
                    min={0}
                    max={100}
                    step={10}
                    value={[maxDistance]}
                    onValueChange={(value) => setMaxDistance(value[0])}
                  />
                  <p className="text-sm text-muted-foreground mt-1">{maxDistance} km</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="wellth-points"
                    checked={showWellthPointsOnly}
                    onCheckedChange={(checked) => setShowWellthPointsOnly(checked as boolean)}
                  />
                  <Label htmlFor="wellth-points">Show services accepting Wellth Points only</Label>
                </div>
                <div>
                  <Label>Availability</Label>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border"
                  />
                </div>
              </div>
              <ScrollArea className="h-[400px]">
                {filteredServices.map((service) => (
                  <Card key={service.id} className="mb-4">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{service.name}</span>
                        <Badge>{service.type}</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center">
                          <Avatar className="h-8 w-8 mr-2">
                            <AvatarImage src="/placeholder.svg?height=32&width=32" alt={service.provider} />
                            <AvatarFallback>{service.provider[0]}</AvatarFallback>
                          </Avatar>
                          <span className="font-semibold cursor-pointer" onClick={() => handleProviderClick(service.id)}>{service.provider}</span>
                        </div>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 mr-1" />
                          <span>{service.rating}</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center">
                          {service.format === 'telehealth' ? (
                            <Video className="h-4 w-4 mr-1" />
                          ) : (
                            <MapPin className="h-4 w-4 mr-1" />
                          )}
                          <span>{service.format === 'telehealth' ? 'Telehealth' : service.location}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>Next available: {service.nextAvailable}</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-1" />
                          <span>${service.price}</span>
                        </div>
                        {service.acceptsWellthPoints && (
                          <div className="flex items-center">
                            <Award className="h-4 w-4 mr-1" />
                            <span>{service.wellthPointsCost} Wellth Points</span>
                          </div>
                        )}
                      </div>
                      <Button className="w-full mt-4" onClick={() => handleBookService(service)}>Book Service</Button>
                    </CardContent>
                  </Card>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compare">
          <Card>
            <CardHeader>
              <CardTitle>Compare Services</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service</TableHead>
                    <TableHead>Provider</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Next Available</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredServices.map((service) => (
                    <TableRow key={service.id}>
                      <TableCell>{service.name}</TableCell>
                      <TableCell>{service.provider}</TableCell>
                      <TableCell>${service.price}</TableCell>
                      <TableCell>{service.rating}</TableCell>
                      <TableCell>{service.nextAvailable}</TableCell>
                      <TableCell>
                        <Button size="sm" onClick={() => handleBookService(service)}>Book</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isProviderModalOpen} onOpenChange={setIsProviderModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Provider Profile</DialogTitle>
          </DialogHeader>
          {selectedProvider && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedProvider.image} alt={selectedProvider.name} />
                  <AvatarFallback>{selectedProvider.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{selectedProvider.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedProvider.specialty}</p>
                </div>
              </div>
              <div>
                <h4 className="font-sem ibold mb-2">Services</h4>
                <ul className="list-disc list-inside">
                  {selectedProvider.services.map((service, index) => (
                    <li key={index}>{service}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Qualifications</h4>
                <ul className="list-disc list-inside">
                  {selectedProvider.qualifications.map((qualification, index) => (
                    <li key={index}>{qualification}</li>
                  ))}
                </ul>
              </div>
              <div className="flex items-center">
                <Star className="h-5 w-5 text-yellow-400 mr-1" />
                <span className="font-semibold">{selectedProvider.rating}</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isBookingModalOpen} onOpenChange={setIsBookingModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Book Service</DialogTitle>
          </DialogHeader>
          {selectedService && (
            <div className="space-y-4">
              <div>
                <Label className="font-semibold">Service</Label>
                <p>{selectedService.name}</p>
              </div>
              <div>
                <Label className="font-semibold">Provider</Label>
                <p>{selectedService.provider}</p>
              </div>
              <div>
                <Label className="font-semibold">Date</Label>
                <Input type="date" defaultValue={selectedService.nextAvailable} />
              </div>
              <div>
                <Label className="font-semibold">Time</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="09:00">09:00 AM</SelectItem>
                    <SelectItem value="10:00">10:00 AM</SelectItem>
                    <SelectItem value="11:00">11:00 AM</SelectItem>
                    <SelectItem value="14:00">02:00 PM</SelectItem>
                    <SelectItem value="15:00">03:00 PM</SelectItem>
                    <SelectItem value="16:00">04:00 PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="font-semibold">Payment Method</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="credit_card">Credit Card</SelectItem>
                    <SelectItem value="insurance">Insurance</SelectItem>
                    {selectedService.acceptsWellthPoints && (
                      <SelectItem value="wellth_points">Wellth Points</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <Button onClick={handleBookingConfirm}>Confirm Booking</Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}