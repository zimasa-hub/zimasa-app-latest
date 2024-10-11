"use client"

import { useState, useEffect } from 'react'
import { Bell, Calendar, CheckCircle, Clock, DollarSign, FileText, HelpCircle, Mail, MessageCircle, Phone, PlusCircle, Settings, User, AlertTriangle, BarChart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import AddNewService from "./add-new-service"
import ComposeNewMessage from "./compose-new-message"
import DetailedAnalytics from "./detailed-analytics"
// import AddNewAppointmentTask from "./add-new-appointment-task"
import EmergencyAlertDetails from "./emergency-alert-details"

export function ServiceProviderHomeScreenComponent() {
  const [showEmergencyAlert, setShowEmergencyAlert] = useState(true)
  const [showAddNewService, setShowAddNewService] = useState(false)
  const [showComposeNewMessage, setShowComposeNewMessage] = useState(false)
  const [showDetailedAnalytics, setShowDetailedAnalytics] = useState(false)
  const [showAddNewAppointmentTask, setShowAddNewAppointmentTask] = useState(false)
  const [showEmergencyAlertDetails, setShowEmergencyAlertDetails] = useState(false)

  // if (showAddNewService) {
  //   return <AddNewService onClose={() => setShowAddNewService(false)} />
  // }

  // if (showAddNewAppointmentTask) {
  //   return <AddNewAppointmentTask onClose={() => setShowAddNewAppointmentTask(false)} />
  // }

  if (showComposeNewMessage) {
    return <ComposeNewMessage onClose={() => setShowComposeNewMessage(false)} />
  }

  if (showDetailedAnalytics) {
    return <DetailedAnalytics onClose={() => setShowDetailedAnalytics(false)} />
  }

  

  if (showEmergencyAlertDetails) {
    return <EmergencyAlertDetails onClose={() => setShowEmergencyAlertDetails(false)} />
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Emergency Alert */}
      {showEmergencyAlert && (
        <div className="bg-red-500 text-white p-4 rounded-lg flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-6 w-6" />
            <span className="font-bold">Emergency Alert:</span>
            <span>Patient John Doe requires immediate attention.</span>
          </div>
          <Button variant="outline" className="text-white border-white hover:bg-red-600" onClick={() => setShowEmergencyAlertDetails(true)}>
            View Details
          </Button>
        </div>
      )}

      {/* Top Bar */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Service Provider Dashboard</h1>
        <div className="flex items-center space-x-4">
          <Bell className="h-6 w-6 text-gray-500" />
          <Avatar>
            <AvatarImage src="/placeholder-user.jpg" alt="Service Provider" />
            <AvatarFallback>SP</AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Dashboard Overview */}
      <section className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Today's Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-center justify-between">
                <div>
                  <p className="font-medium">John Doe</p>
                  <p className="text-sm text-gray-500">Medical Consultation</p>
                </div>
                <Badge>10:00 AM</Badge>
              </li>
              <li className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Jane Smith</p>
                  <p className="text-sm text-gray-500">Wellness Session</p>
                </div>
                <Badge variant="secondary">2:00 PM</Badge>
              </li>
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Pending Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Follow-up Call</p>
                  <p className="text-sm text-gray-500">John Doe</p>
                </div>
                <Badge variant="destructive">Overdue</Badge>
              </li>
              <li className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Session Notes</p>
                  <p className="text-sm text-gray-500">Jane Smith</p>
                </div>
                <Badge variant="outline">Due Today</Badge>
              </li>
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Revenue Snapshot</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p>Total Earnings Today: $500</p>
              <p>Outstanding Payments: $200</p>
              <Progress value={60} className="mt-2" />
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Appointments and Tasks Management */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle>Appointments and Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="appointments">
              <TabsList>
                <TabsTrigger value="appointments">Appointments</TabsTrigger>
                <TabsTrigger value="tasks">Tasks</TabsTrigger>
              </TabsList>
              <TabsContent value="appointments">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Select>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="medical">Medical Consultation</SelectItem>
                        <SelectItem value="wellness">Wellness Session</SelectItem>
                        <SelectItem value="fitness">Fitness Training</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button>
                      <Calendar className="mr-2 h-4 w-4" /> View Calendar
                    </Button>
                  </div>
                  <ul className="space-y-2">
                    <li className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">John Doe - Medical Consultation</p>
                        <p className="text-sm text-gray-500">10:00 AM - Confirmed</p>
                      </div>
                      <Button variant="outline" size="sm">Reschedule</Button>
                    </li>
                    <li className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Jane Smith - Wellness Session</p>
                        <p className="text-sm text-gray-500">2:00 PM - Pending</p>
                      </div>
                      <Button variant="outline" size="sm">Confirm</Button>
                    </li>
                  </ul>
                </div>
              </TabsContent>
              <TabsContent value="tasks">
                <ul className="space-y-2">
                  <li className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Follow-up Call - John Doe</p>
                      <p className="text-sm text-gray-500">Due: Today</p>
                    </div>
                    <Button size="sm">Complete</Button>
                  </li>
                  <li className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Session Notes - Jane Smith</p>
                      <p className="text-sm text-gray-500">Due: Tomorrow</p>
                    </div>
                    <Button size="sm">Complete</Button>
                  </li>
                </ul>
              </TabsContent>
            </Tabs>
            <Button className="w-full mt-4" onClick={() => setShowAddNewAppointmentTask(true)}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Appointment/Task
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Service Management and Client Interaction */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Service Management */}
        <Card>
          <CardHeader>
            <CardTitle>Service Management</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Medical Consultation</p>
                  <p className="text-sm text-gray-500">30 minutes - $100</p>
                </div>
                <Button variant="outline" size="sm">Edit</Button>
              </li>
              <li className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Wellness Session</p>
                  <p className="text-sm text-gray-500">60 minutes - $150</p>
                </div>
                <Button variant="outline" size="sm">Edit</Button>
              </li>
            </ul>
            <Button className="w-full mt-4" onClick={() => setShowAddNewService(true)}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Service
            </Button>
          </CardContent>
        </Card>

        {/* Client Interaction Hub */}
        <Card>
          <CardHeader>
            <CardTitle>Client Interaction Hub</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>John Doe - Care Plan Update</span>
                </div>
                <Badge>New</Badge>
              </li>
              <li className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MessageCircle className="h-4 w-4" />
                  <span>Jane Smith - Feedback Request</span>
                </div>
                <Badge variant="secondary">Pending</Badge>
              </li>
            </ul>
            <Button className="w-full mt-4" onClick={() => setShowComposeNewMessage(true)}>
              <MessageCircle className="mr-2 h-4 w-4" /> Compose New Message
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Billing and Payments */}
      <Card>
        <CardHeader>
          <CardTitle>Billing and Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="font-semibold mb-2">Payment Overview</h3>
              <p>Total Payments Received: $1,500</p>
              <p>Pending Payments: $500</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Recent Invoices</h3>
              <ul className="space-y-2">
                <li className="flex items-center justify-between">
                  <span>John Doe - Medical Consultation</span>
                  <Badge variant="secondary">$100</Badge>
                </li>
                <li className="flex items-center justify-between">
                  <span>Jane Smith - Wellness Session</span>
                  <Badge variant="secondary">$150</Badge>
                </li>
              </ul>
            </div>
          </div>
          <div className="flex justify-between mt-4">
            <Button variant="outline">
              <FileText className="mr-2 h-4 w-4" /> Generate Invoice
            </Button>
            <Button variant="outline">
              <DollarSign className="mr-2 h-4 w-4" /> Process Refund
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Performance and Analytics */}
      <Card>
        <CardHeader>
          <CardTitle>Performance and Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <h3 className="font-semibold mb-2">Bookings Summary</h3>
              <p>Medical Consultations: 20</p>
              <p>Wellness Sessions: 15</p>
              <p>Fitness Training: 10</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Client Feedback</h3>
              <p>Average Rating: 4.8/5</p>
              <Progress value={96} className="mt-2" />
            </div>
            <div>
              <h3 className="font-semibold mb-2">Revenue Overview</h3>
              <p>Total Revenue: $5,000</p>
              <p>Wellth Points Redeemed: 1,000</p>
            </div>
          </div>
          <Button className="w-full mt-4" onClick={() => setShowDetailedAnalytics(true)}>
            <BarChart className="mr-2 h-4 w-4" /> View Detailed Analytics
          </Button>
        </CardContent>
      </Card>

      {/* Footer - Profile Settings and Help */}
      <footer className="flex justify-between items-center mt-8">
        <Button variant="ghost">
          <Settings className="mr-2 h-4 w-4" /> Profile Settings
        </Button>
        <Button variant="ghost">
          <HelpCircle className="mr-2 h-4 w-4" /> Help & Support
        </Button>
      </footer>
    </div>
  )
}