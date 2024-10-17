'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Pencil, Calendar, Clock, Users, MapPin, Tag, ArrowLeft } from "lucide-react"
import AddNewServiceComponent from '@/components/service-provider-components/add-new-service'
import { Service } from '@/lib/interfaces/services/services'
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import Link from 'next/link'

interface ServiceManagementProps {
  services: Service[]
  paymentMethods: any[]
  serviceTypes: any[]
  providerUserId: string | null
  
}

export default function ServiceManagement({ services, paymentMethods, serviceTypes, providerUserId }: ServiceManagementProps) {
 console.log("SERVICES : ",services,providerUserId)


 
    const [showAddNewService, setShowAddNewService] = useState(false)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  }

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':')
    return new Date(0, 0, 0, parseInt(hours), parseInt(minutes)).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const getPaymentMethods = (service: Service) => {
    return service.providerServicePaymentMethods.map(pspm => pspm.paymentMethod.method).join(', ') || 'N/A'
  }

  if (showAddNewService) {
    return (
      <AddNewServiceComponent
        paymentMethods={paymentMethods}
        serviceTypes={serviceTypes}
        providerUserId={providerUserId}
        services={services}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 ">
    <header className="bg-teal-600 text-white p-4 flex items-center">
      <Link href="/dashboard" className="mr-4">
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <h1 className="text-xl font-semibold">Service Management</h1>
      </header>
      <div className=" p-4">
      <ScrollArea className="h-[calc(100vh-200px)] pr-4">
        <div className="space-y-6 mb-20">
          {services.length === 0 ? (
            <Card>
              <CardContent className="flex items-center justify-center h-40">
                <p className="text-center text-gray-500">No services available. Add a new service to get started.</p>
              </CardContent>
            </Card>
          ) : (
            services.map((service) => (
              <Card key={service.id} className="w-full">
                <CardHeader>
                  <div className="flex justify-between items-start">
                  <CardTitle className="text-xl font-semibold">{service.serviceCategory.serviceType.toString()}</CardTitle>  <Button variant="outline" size="icon">
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Edit service</span>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span>{service.durationMins} minutes</span>
                    </div>
                    <span className="text-lg font-bold text-teal-600">${service.price}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span>{formatDate(service.startDate)} - {formatDate(service.endDate)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span>Max Capacity: {service.maximumCapacity}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span>{service.location}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {service.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="availability">
                      <AccordionTrigger>Availability</AccordionTrigger>
                      <AccordionContent>
                        <ul className="space-y-2">
                          {service.serviceAvailability.map((availability, index) => (
                            <li key={index} className="flex justify-between">
                              <span>{availability.dayOfWeek}</span>
                              <span>{formatTime(availability.startTime)} - {formatTime(availability.endTime)}</span>
                            </li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="payment-methods">
                      <AccordionTrigger>Payment Methods</AccordionTrigger>
                      <AccordionContent>
                        <p>{getPaymentMethods(service)}</p>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="category">
                      <AccordionTrigger>Category</AccordionTrigger>
                      <AccordionContent>
                        <p>{service.serviceCategory.name}</p>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>
      <div className="fixed bottom-4 right-4 left-4 max-w-3xl mx-auto">
        <Button 
          className="w-full bg-teal-600 hover:bg-teal-700 text-white" 
          onClick={() => setShowAddNewService(true)}
        >
          + Add New Service
        </Button>
      </div>
   </div>
    </div>
  )
}