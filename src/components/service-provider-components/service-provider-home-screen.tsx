"use client"

import { useState, useEffect } from 'react'
import { Bell, Calendar, CheckCircle, Clock, DollarSign, FileText, HelpCircle, Mail, MessageCircle, Phone, PlusCircle, Settings, User, AlertTriangle, BarChart, ChevronRight, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import ComposeNewMessage from "../compose-new-message"
import DetailedAnalytics from "../detailed-analytics"
// import AddNewAppointmentTask from "./add-new-appointment-task"
import EmergencyAlertDetails from "../emergency-alert-details"
import AddNewService from './add-new-service'
import { UserNameProps } from '@/lib/interfaces/meals/interfaces'
import Sidebar from '@/app/NavBars/consumer-sideBar'
import { Appointment } from '@/lib/interfaces/appointments/appointments'
import { DoctorsDataResponse } from '@/lib/interfaces/providers/providers'
import AllAppointmentsView from './all-appointments-view'
import { SidebarTrigger } from '../ui/sidebar'
import ReusableSidebar from '@/app/NavBars/Reusable-Sidebar'

const ServiceProviderHomeScreenComponent: React.FC<UserNameProps> = ({ name, currentMemberId }) => {
  
  console.log("SUB : ", currentMemberId)

  const [showEmergencyAlert, setShowEmergencyAlert] = useState(true)
  const [showAddNewService, setShowAddNewService] = useState(false)
  const [showComposeNewMessage, setShowComposeNewMessage] = useState(false)
  const [isAllAppointmentsOpen, setIsAllAppointmentsOpen] = useState(false)
  const [showAddNewAppointmentTask, setShowAddNewAppointmentTask] = useState(false)
  const [showEmergencyAlertDetails, setShowEmergencyAlertDetails] = useState(false)
  const [activeTab, setActiveTab] = useState("appointments")
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const totalEarnings = 500
  const outstandingPayments = 1200
  const progressPercentage = (totalEarnings / (totalEarnings + outstandingPayments)) * 100

 


  // if (showAddNewService) {
  //   return <AddNewService onClose={() => setShowAddNewService(false)} />
  // }

  // if (showAddNewAppointmentTask) {
  //   return <AddNewAppointmentTask onClose={() => setShowAddNewAppointmentTask(false)} />
  // }

  if (showComposeNewMessage) {
    return <ComposeNewMessage onClose={() => setShowComposeNewMessage(false)} />
  }

  

  if (showEmergencyAlertDetails) {
    return <EmergencyAlertDetails onClose={() => setShowEmergencyAlertDetails(false)} />
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

  const fetchAppointments = async () => {
    try {
      const response = await fetch('/api/user/doc-appointments')
      if (!response.ok) {
        throw new Error('Failed to fetch appointments')
      }
      const data = await response.json()
      setAppointments(data.appointments)
    } catch (error) {
      console.error('Error fetching appointments:', error)
    }
  }

  useEffect(() => {

    fetchAppointments()
  }, [])



  return (
    <div className="container mx-auto flex flex-col min-h-screen">


            <div className="container mx-auto p-4 space-y-4">
 {/* Top Bar */}
 <header className="flex justify-between items-center p-2 border-b bg-white">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
                <span className="sr-only">Notifications</span>
              </Button>
              <h1 className="text-lg font-semibold">Dashboard</h1>
              <SidebarTrigger />
            </header>

            <ReusableSidebar
          name={name}
          
        />
     

      <h1 className="text-xl font-semibold">Hello, Dr. {name}</h1>
      
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

         {/* Appointments and Tasks */}
         <section>
  <Card>
    <CardHeader>
      <CardTitle className="text-xl font-semibold">Appointments and Tasks</CardTitle>
    </CardHeader>
    <CardContent>
      <Tabs defaultValue="appointments" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger 
            value="appointments" 
            className="data-[state=active]:bg-custom-green data-[state=active]:text-white"
          >
            Appointments
          </TabsTrigger>
          <TabsTrigger 
            value="tasks"
            className="data-[state=active]:bg-custom-green data-[state=active]:text-white"
          >
            Tasks
          </TabsTrigger>
        </TabsList>
        <TabsContent value="appointments">
        <ul className="space-y-4 lg:col-span-9">
            {appointments.length > 0 ? (
              appointments.map((appointment) => (
                <li key={appointment.id} className="flex justify-between items-center relative">
                  <div>
                  <h3 className="font-semibold"> {appointment.member.firstName}  {appointment.member.lastName}</h3>
           
                    <p className="text-sm text-gray-500">{appointment.service.description}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(appointment.appointmentDate).toLocaleDateString()} - {appointment.startTime}
                    </p>
                    <span className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(appointment.status)}`}>
                      {appointment.status}
                    </span>
                  </div>
                </li>
              ))
            ) : (
              <li>No upcoming appointments</li>
            )}
          </ul>
          <Button 
            variant="outline" 
            className="w-full mt-4 text-custom-green border-custom-green hover:bg-custom-green/10"
            onClick={() => setIsAllAppointmentsOpen(true)}
          >
            View All Appointments <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </TabsContent>
        <TabsContent value="tasks">
          <ul className="space-y-4 mt-4">
            <li className="flex justify-between items-center">
              <div>
                <p className="font-normal">Follow-up Call with John Doe</p>
              </div>
              <Button className="bg-custom-green hover:bg-custom-green/90 text-white">Complete</Button>
            </li>
            <li className="flex justify-between items-center">
              <div>
                <p className="font-normal">Update Session Notes for Jane Smith</p>
              </div>
              <Button className="bg-custom-green hover:bg-custom-green/90 text-white">Complete</Button>
            </li>
          </ul>
          <Button variant="outline" className="w-full mt-4 text-custom-green border-custom-green hover:bg-custom-green/10">
            View All Tasks <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </TabsContent>
      </Tabs>
    </CardContent>
  </Card>
</section>

        {/* Revenue Snapshot */}
         <section>
         <Card className="w-full mb-8 ">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-900">Revenue Snapshot</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Total Earnings Today</span>
          <span className="text-lg font-semibold text-gray-900">${totalEarnings}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Outstanding Payments</span>
          <span className="text-lg font-semibold text-gray-900">${outstandingPayments}</span>
        </div>
        <div className="relative pt-1">
          <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
            <div 
              style={{ width: `${progressPercentage}%` }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
            ></div>
          </div>
        </div>
        <div className="text-xs text-gray-500">
          Total Earnings vs Outstanding Payments
        </div>
      </CardContent>
    </Card>
         </section>

      {/* Footer - Profile Settings and Help */}
      <footer className="flex justify-between items-center mt-4">
        <Button variant="ghost">
          <Settings className="mr-2 h-4 w-4" /> Profile Settings
        </Button>
        <Button variant="ghost">
          <HelpCircle className="mr-2 h-4 w-4" /> Help & Support
        </Button>
      </footer>
            </div>

            <AllAppointmentsView 
        isOpen={isAllAppointmentsOpen} 
        onClose={() => setIsAllAppointmentsOpen(false)} 
        currentMemberId={currentMemberId}
      />
 
    </div>

  )
}

export default ServiceProviderHomeScreenComponent;