"use client"

import { useState, useEffect } from 'react'
import { useSession, signIn, signOut } from "next-auth/react";
import Head from 'next/head'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bell, Calendar, FileText, Heart, Plus, Stethoscope, Users, Share2, MessageSquare, Trophy, ShoppingBag, CreditCard, Star, Utensils, Activity, Moon, Target, UserPlus, Shield, DollarSign, AlertTriangle, Menu } from "lucide-react"
import ManageDependentsScreen from './manage-dependents-screen'
import BookAppointmentScreen from './book-appointment-screen'
import ViewMedicalRecordsScreen from './view-medical-records-screen'
import JoinWellnessProgramScreen from './join-wellness-program-screen'
import JoinCommunityForumsScreen from './join-community-forums-screen'
import ShareHealthAchievementScreen from './share-health-achievement-screen'
import BrowseHealthServicesScreen from './browse-health-services-screen'
import ApplyForHealthcareLoanScreen from './apply-for-healthcare-loan-screen'
import MakePaymentScreen from './make-payment-screen'
import dynamic from 'next/dynamic';
const HealthStatusIcons = dynamic(() => import('./HealthStatusIcons'), { ssr: false });

import Sidebar from '../app/NavBars/consumer-sideBar'
import DashboardSkeleton from './dashboard-skeleton'
import Link from 'next/link'
import { UserNameProps } from '@/lib/interfaces/meals/interfaces';
import axios from 'axios';
import AllAppointmentsView from './all-appointments-view';





// Custom type for beforeinstallprompt event
type BeforeInstallPromptEvent = Event & {
  prompt: () => void
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

// Type for Appointment (you can adjust fields as necessary)
type Appointment = {
  // id: string
  doctor: string
  type: string
  date: string
  time: string
  dependent?: string
  // add other appointment properties here
  id?: number
  service: {
    name: string
    providerUser: {
      member: {
        firstName: string
        lastName: string
        username:string
      }
    }
}

appointmentDate: string
  startTime: string
  scheduleType: {
    name: string
  }
}


const ComprehensivePatientHomeScreen: React.FC<UserNameProps> = ({ name }) => {

  const [healthScore, setHealthScore] = useState(75)
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isInstalled, setIsInstalled] = useState(false)
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [isManageDependentsOpen, setIsManageDependentsOpen] = useState(false)
  const [isBookAppointmentOpen, setIsBookAppointmentOpen] = useState(false)
  const [isViewMedicalRecordsOpen, setIsViewMedicalRecordsOpen] = useState(false)
  const [isJoinWellnessProgramOpen, setIsJoinWellnessProgramOpen] = useState(false)
  const [isJoinCommunityForumsOpen, setIsJoinCommunityForumsOpen] = useState(false)
  const [isShareHealthAchievementOpen, setIsShareHealthAchievementOpen] = useState(false)
  const [isBrowseHealthServicesOpen, setIsBrowseHealthServicesOpen] = useState(false)
  const [isApplyForHealthcareLoanOpen, setIsApplyForHealthcareLoanOpen] = useState(false)
  const [isMakePaymentOpen, setIsMakePaymentOpen] = useState(false)
  const [isAllAppointmentsOpen, setIsAllAppointmentsOpen] = useState(false)

  const [isHydrated, setIsHydrated] = useState(false); // Track hydration status

  // Set isHydrated to true once the component has hydrated
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    const beforeInstallPromptHandler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
    }

    const appInstalledHandler = () => {
      setIsInstalled(true)
    }

    window.addEventListener('beforeinstallprompt', beforeInstallPromptHandler)
    window.addEventListener('appinstalled', appInstalledHandler)

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', beforeInstallPromptHandler)
      window.removeEventListener('appinstalled', appInstalledHandler)
    }
  }, [])

  const [appointments, setAppointments] = useState<Appointment[]>([])

  
    const fetchAppointments = async () => {
      try {
        const currentDate = new Date().toISOString().split('T')[0]
        const response = await axios.get(`/api/user/book-appointment?localDate=${currentDate}`)
        setAppointments(response.data.slice(0, 2)) // Only take the first two appointments
      } catch (error) {
        console.error('Error fetching appointments:', error)
      }
    }
    useEffect(() => {

    fetchAppointments()
  }, [])

  const formatAppointmentDate = (dateString: string, timeString: string) => {
    const date = new Date(dateString + 'T' + timeString)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    if (date.toDateString() === today.toDateString()) {
      return `Today, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return `Tomorrow, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    } else {
      return `${date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    }
  }

  
  

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt')
        }
        setDeferredPrompt(null)
      })
    }
  }

  const handleRescheduleClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment)
    setIsRescheduleModalOpen(true)
  }

  const handleRescheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the new appointment data to your backend
    if (selectedAppointment) {
      console.log('Appointment rescheduled:', selectedAppointment)
    }
    setIsRescheduleModalOpen(false)
  }
  const handleManageDependentsClick = () => {
    setIsManageDependentsOpen(true)
  }

  const handleBookAppointmentClick = () => {
    setIsBookAppointmentOpen(true)
  }

  const handleViewMedicalRecordsClick = () => {
    setIsViewMedicalRecordsOpen(true)
  }

  const handleJoinWellnessProgramClick = () => {
    setIsJoinWellnessProgramOpen(true)
  }

  const handleJoinCommunityForumsClick = () => {
    setIsJoinCommunityForumsOpen(true)
  }

  const handleShareHealthAchievementClick = () => {
    setIsShareHealthAchievementOpen(true)
  }

  const handleBrowseHealthServicesClick = () => {
    setIsBrowseHealthServicesOpen(true)
  }

  const handleApplyForHealthcareLoanClick = () => {
    setIsApplyForHealthcareLoanOpen(true)
  }

  const handleMakePaymentClick = () => {
    setIsMakePaymentOpen(true)
  }

  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)



  return (
    <>
      <Head>
        <title>Zimasa Health Dashboard</title>
        <meta name="description" content="Manage your health and wellness with Zimasa" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="theme-color" content="#ffffff" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
      </Head>

      {!isHydrated ? (
          // <div className="flex justify-center items-center h-screen">
           
          //   <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-teal-500"></div>
          // </div>
          <DashboardSkeleton />
        ) : (
      <div className=" mx-auto p-0 ">
        {/* {!isInstalled && (
          <Button onClick={handleInstallClick} className="w-full mb-4">
            Install Zimasa Health App
          </Button>
        )} */}
        {/* Top Section - Health Overview */}
      

    <div className="container mx-auto  bg-white">
     


      <header className="flex justify-between items-center p-4 border-b bg-white">
        <Button variant="ghost" size="icon" onClick={toggleSidebar}>
          <Menu className="h-6 w-6" />
          <span className="sr-only">Menu</span>
        </Button>
        <h1 className="text-lg font-semibold">Dashboard</h1>
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
        </Button>
      </header>
      <Sidebar isOpen={isSidebarOpen} 
        name={name}/>
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    






      <main className="p-4">
      <h3 className="text-lg font-semibold mb-2">Welcome, {name || "Guest"}</h3>
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-lg mb-0 whitespace-nowrap overflow-hidden text-ellipsis">Personalized Health Insights & Score</CardTitle>
          </CardHeader>
          <CardContent className="flex py-0 ">
  {/* Main Content: Health Insights and Appointments */}

    <HealthStatusIcons />
 
    </CardContent>

    </Card>

    {/*  Appointments Section*/}

    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="text-lg">Upcoming Appointments</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 p-4 lg:p-8 grid-cols-1 lg:grid-cols-12 justify-center items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-start gap-4 w-full col-span-12">
          <ul className="space-y-4 lg:col-span-9">
            {appointments.map((appointment) => (
              <li key={appointment.id} className="grid grid-cols-12 items-center gap-4 mb-1">
                <div className="col-span-8 flex items-center gap-4">
                  <Calendar className="h-6 w-6 text-teal-600" />
                  <div className="flex flex-col">
                    <span className="font-medium">
                      Dr. {appointment.service.providerUser.member.username} 
                     
                    </span>
                    <p className="text-sm text-muted-foreground">
                      {formatAppointmentDate(appointment.appointmentDate, appointment.startTime)}
                    </p>
                  </div>
                </div>
                <Badge variant="secondary" className="col-span-4 ml-auto">
                  {appointment.scheduleType.name}
                </Badge>
              </li>
            ))}
            {appointments.length === 0 && (
              <li className="text-center text-muted-foreground">No upcoming appointments</li>
            )}
          </ul>
        </div>
        <div className="w-full col-span-12 flex justify-center items-center text-center lg:justify-start">
          <Button onClick={async () => {
    setIsAllAppointmentsOpen(true); // This sets the  component to open
    // await fetchAppointments();      // Call the function to fetch appointments
  }}
           className="w-full lg:w-auto h-10 items-center text-center justify-center rounded-md bg-teal-600 hover:bg-teal-700 text-white">
            View All Appointments
          </Button>
        </div>
      </CardContent>
    </Card>

    <AllAppointmentsView 
        isOpen={isAllAppointmentsOpen} 
        onClose={() => setIsAllAppointmentsOpen(false)} 
      />


        {/* Middle Section - Health and Wellness Tracking */}
        <Card className='mb-20'>
          <CardHeader>
            <CardTitle>Health and Wellness Tracking</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-2">
            <Tabs defaultValue="metrics" className="w-full bg-custom-orange">
              <TabsList className='flex items-center bg-transparent justify-center'>
                <TabsTrigger value="metrics" className='rounded-full '>Daily Metrics</TabsTrigger>
                <TabsTrigger value="goals" className='rounded-full  '>Health Goals</TabsTrigger>
                <TabsTrigger value="community" className='rounded-full  '>Community</TabsTrigger>
              </TabsList>
              <TabsContent value="metrics">
                <div className="space-y-4">
                  <div className="grid grid-cols-4 gap-4 p-2">
                  <div className="p-2 shadow-md rounded-md text-center bg-white flex flex-col justify-between">
  <div>
    <Utensils className="mx-auto h-6 w-6 mb-2" />
    <p className="font-semibold">1,800</p>
    <p className="text-sm text-muted-foreground">Calories</p>
  </div>
  <Link
   href="/nutrition"
   className="mt-auto bg-custom-green text-white rounded-md h-8 "
   >Log</Link>
</div>

<div className="p-2 shadow-md rounded-md text-center bg-white flex flex-col justify-between">
  <div>
    <Activity className="mx-auto h-6 w-6 mb-2" />
    <p className="font-semibold">8,234</p>
    <p className="text-sm text-muted-foreground">Steps</p>
  </div>
  <Button size="sm" className="mt-auto bg-custom-green">Log</Button>
</div>

<div className="p-2 shadow-md rounded-md text-center bg-white flex flex-col justify-between">
  <div>
    <Moon className="mx-auto h-6 w-6 mb-2" />
    <p className="font-semibold">7h 12m</p>
    <p className="text-sm text-muted-foreground">Sleep</p>
  </div>
  <Button size="sm" className="mt-auto bg-custom-green">Log</Button>
</div>

                    <div className="p-2 shadow-md rounded-md text-center bg-white">
                      <Heart className="mx-auto h-6 w-6 mb-2" />
                      <p className="font-semibold">72 bpm</p>
                      <p className="text-sm text-muted-foreground">Heart Rate</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="goals">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Weight Loss Goal</h3>
                    <Progress value={60} className="w-full" />
                    <p className="text-sm text-muted-foreground mt-1">6 / 10 lbs lost</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Daily Step Goal</h3>
                    <Progress value={80} className="w-full" />
                    <p className="text-sm text-muted-foreground mt-1">8,234 / 10,000 steps</p>
                  </div>
                  <Button className="w-full">
                    <Target className="mr-2 h-4 w-4" /> Set New Health Goal
                  </Button>
                </div>
              </TabsContent>
              <TabsContent value="community">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Active Challenges</h3>
                    <ul className="space-y-2">
                      <li>
                        <div className="flex justify-between items-center">
                          <span>30-Day Step Challenge</span>
                          <Badge>Rank: 5/50</Badge>
                        </div>
                        <Progress value={60} className="w-full mt-2" />
                        <p className="text-sm text-muted-foreground">18 days remaining</p>
                      </li>
                    </ul>
                  </div>
                  <Button className="w-full">
                    <Trophy className="mr-2 h-4 w-4" /> Join New Challenge
                  </Button>
                  <Button className="w-full" onClick={handleJoinCommunityForumsClick}>
                    <MessageSquare className="mr-2 h-4 w-4" /> Community Forums
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

     
      </main>
    </div>
  

      </div>
 )}


      {/* Reschedule Appointment Modal */}
      <Dialog open={isRescheduleModalOpen} onOpenChange={setIsRescheduleModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Reschedule Appointment</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleRescheduleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="doctor" className="text-right">
                  Doctor
                </Label>
                <Input id="doctor" value={selectedAppointment?.doctor || ''} className="col-span-3" readOnly />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">
                  Type
                </Label>
                <Input id="type" value={selectedAppointment?.type || ''} className="col-span-3" readOnly />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="date" className="text-right">
                  Date
                </Label>
                <Input id="date" type="date" className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="time" className="text-right">
                  Time
                </Label>
                <Select required>
                  <SelectTrigger className="col-span-3">
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
              {selectedAppointment?.dependent && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="dependent" className="text-right">
                    Dependent
                  </Label>
                  <Input id="dependent" value={selectedAppointment.dependent} className="col-span-3" readOnly />
                </div>
              )}
            </div>
            <DialogFooter>
              <Button type="submit">Reschedule Appointment</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Manage Dependents Modal */}
      <Dialog open={isManageDependentsOpen} onOpenChange={setIsManageDependentsOpen}>
        <DialogContent className="sm:max-w-[90vw] sm:max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Manage Dependents</DialogTitle>
          </DialogHeader>
          <ManageDependentsScreen />
        </DialogContent>
      </Dialog>

      {/* Book Appointment Modal */}
      {/* <Dialog open={isBookAppointmentOpen} onOpenChange={setIsBookAppointmentOpen}>
        <DialogContent className="sm:max-w-[90vw] sm:max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Book Appointment</DialogTitle>
          </DialogHeader>
          <BookAppointmentScreen />
        </DialogContent>
      </Dialog> */}

      {/* View Medical Records Modal */}
      <Dialog open={isViewMedicalRecordsOpen} onOpenChange={setIsViewMedicalRecordsOpen}>
        <DialogContent className="sm:max-w-[90vw] sm:max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>View Medical Records</DialogTitle>
          </DialogHeader>
          <ViewMedicalRecordsScreen />
        </DialogContent>
      </Dialog>

      {/* Join Wellness Program Modal */}
      <Dialog open={isJoinWellnessProgramOpen} onOpenChange={setIsJoinWellnessProgramOpen}>
        <DialogContent className="sm:max-w-[90vw] sm:max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Join Wellness Program</DialogTitle>
          </DialogHeader>
          <JoinWellnessProgramScreen />
        </DialogContent>
      </Dialog>

      {/* Join Community Forums Modal */}
      <Dialog open={isJoinCommunityForumsOpen} onOpenChange={setIsJoinCommunityForumsOpen}>
        <DialogContent className="sm:max-w-[90vw] sm:max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Join Community Forums</DialogTitle>
          </DialogHeader>
          <JoinCommunityForumsScreen />
        </DialogContent>
      </Dialog>

      {/* Share Health Achievement Modal */}
      <Dialog open={isShareHealthAchievementOpen} onOpenChange={setIsShareHealthAchievementOpen}>
        <DialogContent className="sm:max-w-[90vw] sm:max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Share Health Achievement</DialogTitle>
          </DialogHeader>
          <ShareHealthAchievementScreen />
        </DialogContent>
      </Dialog>

      {/* Browse Health Services Modal */}
      <Dialog open={isBrowseHealthServicesOpen} onOpenChange={setIsBrowseHealthServicesOpen}>
        <DialogContent className="sm:max-w-[90vw] sm:max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Browse Health Services</DialogTitle>
          </DialogHeader>
          <BrowseHealthServicesScreen />
        </DialogContent>
      </Dialog>

      {/* Apply for Healthcare Loan Modal */}
      <Dialog open={isApplyForHealthcareLoanOpen} onOpenChange={setIsApplyForHealthcareLoanOpen}>
        <DialogContent className="sm:max-w-[90vw] sm:max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Apply for Healthcare Loan</DialogTitle>
          </DialogHeader>
          <ApplyForHealthcareLoanScreen />
        </DialogContent>
      </Dialog>

      {/* Make Payment Modal */}
      <Dialog open={isMakePaymentOpen} onOpenChange={setIsMakePaymentOpen}>
        <DialogContent className="sm:max-w-[90vw] sm:max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Make Payment</DialogTitle>
          </DialogHeader>
          <MakePaymentScreen />
        </DialogContent>
      </Dialog>

    </>
  )

  

  


  
}

export default ComprehensivePatientHomeScreen