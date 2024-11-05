'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from "next-auth/react"
import Head from 'next/head'
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bell, Calendar, FileText, Heart, Plus, Stethoscope, Users, Share2, MessageSquare, Trophy, ShoppingBag, CreditCard, Star, Utensils, Activity, Moon, Target, UserPlus, Shield, DollarSign, AlertTriangle, Menu, ChevronRight, Home, BookOpen, Bookmark, User, LogOut, PanelLeft } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarProvider,
  SidebarTrigger,
  useSidebar
} from "@/components/ui/sidebar"
import ManageDependentsScreen from './manage-dependents-screen'
import BookAppointmentScreen from './book-appointment-screen'
import ViewMedicalRecordsScreen from './view-medical-records-screen'
import JoinWellnessProgramScreen from './join-wellness-program-screen'
import JoinCommunityForumsScreen from './join-community-forums-screen'
import ShareHealthAchievementScreen from './share-health-achievement-screen'
import BrowseHealthServicesScreen from './browse-health-services-screen'
import ApplyForHealthcareLoanScreen from './apply-for-healthcare-loan-screen'
import MakePaymentScreen from './make-payment-screen'
import dynamic from 'next/dynamic'
const HealthStatusIcons = dynamic(() => import('./HealthStatusIcons'), { ssr: false })

import DashboardSkeleton from './dashboard-skeleton'
import { UserNameProps } from '@/lib/interfaces/meals/interfaces'
import axios from 'axios'
import AllAppointmentsView from './all-appointments-view'
import { Appointment } from '@/lib/interfaces/appointments/appointments'
import { Skeleton } from './ui/skeleton'
import ReusableSidebar from '@/app/NavBars/Reusable-Sidebar'

type BeforeInstallPromptEvent = Event & {
  prompt: () => void
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

const AppointmentSkeleton = () => (
  <div className="flex justify-between items-center relative animate-pulse">
    <div className="space-y-2">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-3 w-40" />
    </div>
    <Skeleton className="h-6 w-16 rounded-full" />
  </div>
)

async function keycloakSessionLogOut() {
  try {
    const response = await fetch(`/api/auth/signout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Logout error:", err);
    throw err;
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
  const [isHydrated, setIsHydrated] = useState(false)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const { open, setOpen, toggleSidebar } = useSidebar()

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
  
  useEffect(() => {
    setIsHydrated(true)
  }, [])

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

  const fetchAppointments = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/user/book-appointment`)
      if (!response.ok) {
        throw new Error('Failed to fetch appointments')
      }
      const data = await response.json()
      setAppointments(data.appointments)
    } catch (error) {
      console.error('Error fetching appointments:', error)
    } finally {
      setIsLoading(false)
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
    if (selectedAppointment) {
      console.log('Appointment rescheduled:', selectedAppointment)
    }
    setIsRescheduleModalOpen(false)
  }

  const handleNavigation = (href: string) => {
    router.push(href);
    setOpen(false);
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await keycloakSessionLogOut();
      await signOut({ callbackUrl: "/" });
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Logout failed. Please try again.");
    } finally {
      setIsLoggingOut(false);
      window.location.href = "/";
    }
  };

  const navItems = [
    { icon: User, label: 'Profile', href: '/profile' },
    { icon: BookOpen, label: 'Topics', href: '/topics' },
    { icon: MessageSquare, label: 'Messages', href: '/chat' },
    { icon: Bell, label: 'Notifications', href: '/notifications' },
    { icon: Bookmark, label: 'Bookmarks', href: '/bookmarks' },
  ]


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
        <DashboardSkeleton />
      ) : (
        <div className="mx-auto p-0">
          <div className="container mx-auto bg-white">
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
            <main className="w-auto p-4">
              <h3 className="text-lg font-semibold mb-2">Welcome, {name || "Guest"}</h3>
              <Card className="mb-4">
                <CardHeader>
                  <CardTitle className="text-lg mb-0 whitespace-nowrap overflow-hidden text-ellipsis">Personalized Health Insights & Score</CardTitle>
                </CardHeader>
                <CardContent className="flex py-0">
                  <HealthStatusIcons />
                </CardContent>
              </Card>

                     {/* Appointments and Tasks */}
                     <Card className='mb-4'>
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
          {isLoading ? (
            Array(3).fill(0).map((_, index) => (
              <li key={index} className="mb-4">
                <AppointmentSkeleton />
              </li>
            ))
          ) : appointments.length > 0 ? (
            appointments.map((appointment) => (
              <li key={appointment.id} className="flex justify-between items-center relative">
                <div>
                  <h3 className="font-semibold">Dr. {appointment.member.firstName} {appointment.member.lastName}</h3>
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

              <AllAppointmentsView 
                isOpen={isAllAppointmentsOpen} 
                onClose={() => setIsAllAppointmentsOpen(false)} 
              />

              <Card className='mb-20'>
                <CardHeader>
                  <CardTitle>Health and Wellness Tracking</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 p-2">
                  <Tabs defaultValue="metrics" className="w-full bg-custom-orange">
                    <TabsList className='flex items-center bg-transparent justify-center'>
                      <TabsTrigger value="metrics" className='rounded-full'>Daily Metrics</TabsTrigger>
                      <TabsTrigger value="goals" className='rounded-full'>Health Goals</TabsTrigger>
                      <TabsTrigger value="community" className='rounded-full'>Community</TabsTrigger>
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
                              className="mt-auto bg-custom-green text-white rounded-md h-8 flex items-center justify-center"
                            >
                              Log
                            </Link>
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
                        <Button className="w-full" onClick={() => setIsJoinCommunityForumsOpen(true)}>
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

      {/* Modals */}
     

      <Dialog open={isManageDependentsOpen} onOpenChange={setIsManageDependentsOpen}>
        <DialogContent className="sm:max-w-[90vw] sm:max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Manage Dependents</DialogTitle>
          </DialogHeader>
          <ManageDependentsScreen />
        </DialogContent>
      </Dialog>

      <Dialog open={isViewMedicalRecordsOpen} onOpenChange={setIsViewMedicalRecordsOpen}>
        <DialogContent className="sm:max-w-[90vw] sm:max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>View Medical Records</DialogTitle>
          </DialogHeader>
          <ViewMedicalRecordsScreen />
        </DialogContent>
      </Dialog>

      <Dialog open={isJoinWellnessProgramOpen} onOpenChange={setIsJoinWellnessProgramOpen}>
        <DialogContent className="sm:max-w-[90vw] sm:max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Join Wellness Program</DialogTitle>
          </DialogHeader>
          <JoinWellnessProgramScreen />
        </DialogContent>
      </Dialog>

      <Dialog open={isJoinCommunityForumsOpen} onOpenChange={setIsJoinCommunityForumsOpen}>
        <DialogContent className="sm:max-w-[90vw] sm:max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Join Community Forums</DialogTitle>
          </DialogHeader>
          <JoinCommunityForumsScreen />
        </DialogContent>
      </Dialog>

      <Dialog open={isShareHealthAchievementOpen} onOpenChange={setIsShareHealthAchievementOpen}>
        <DialogContent className="sm:max-w-[90vw] sm:max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Share Health Achievement</DialogTitle>
          </DialogHeader>
          <ShareHealthAchievementScreen />
        </DialogContent>
      </Dialog>

      <Dialog open={isBrowseHealthServicesOpen} onOpenChange={setIsBrowseHealthServicesOpen}>
        <DialogContent className="sm:max-w-[90vw] sm:max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Browse Health Services</DialogTitle>
          </DialogHeader>
          <BrowseHealthServicesScreen />
        </DialogContent>
      </Dialog>

      <Dialog open={isApplyForHealthcareLoanOpen} onOpenChange={setIsApplyForHealthcareLoanOpen}>
        <DialogContent className="sm:max-w-[90vw] sm:max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Apply for Healthcare Loan</DialogTitle>
          </DialogHeader>
          <ApplyForHealthcareLoanScreen />
        </DialogContent>
      </Dialog>

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