"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, FileText, UserPlus, Users, Search, Edit, Trash2 } from "lucide-react"

type Dependent = {
  id: string
  name: string
  relationship: string
  avatar: string
  lastAppointment: string
  gender: string
}

export default function ManageDependentsScreen() {
  const [dependents, setDependents] = useState<Dependent[]>([
    { id: '1', name: 'Sarah Johnson', relationship: 'Child', avatar: '/placeholder.svg?height=40&width=40', lastAppointment: 'Feb 10, 2024', gender: 'Female' },
    { id: '2', name: 'John Smith', relationship: 'Spouse', avatar: '/placeholder.svg?height=40&width=40', lastAppointment: 'Jan 15, 2024', gender: 'Male' },
    { id: '3', name: 'Emma Davis', relationship: 'Parent', avatar: '/placeholder.svg?height=40&width=40', lastAppointment: 'Mar 5, 2024', gender: 'Female' },
  ])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDependent, setSelectedDependent] = useState<Dependent | null>(null)
  const [isAddDependentModalOpen, setIsAddDependentModalOpen] = useState(false)

  const filteredDependents = dependents.filter(dependent =>
    dependent.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDependentClick = (dependent: Dependent) => {
    setSelectedDependent(dependent)
  }

  const handleAddDependent = () => {
    setIsAddDependentModalOpen(true)
  }

  const handleAddDependentSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)
    const newDependent: Dependent = {
      id: (dependents.length + 1).toString(),
      name: formData.get('name') as string,
      relationship: formData.get('relationship') as string,
      gender: formData.get('gender') as string,
      avatar: '/placeholder.svg?height=40&width=40',
      lastAppointment: 'Not scheduled'
    }
    setDependents([...dependents, newDependent])
    setIsAddDependentModalOpen(false)
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">Manage Dependents</CardTitle>
          <Button onClick={handleAddDependent}>
            <UserPlus className="mr-2 h-4 w-4" /> Add Dependent
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Search className="h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search dependents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
          </div>
          <ScrollArea className="h-[400px]">
            <ul className="space-y-4">
              {filteredDependents.map((dependent) => (
                <li key={dependent.id} className="flex items-center space-x-4 p-2 hover:bg-accent rounded-lg cursor-pointer" onClick={() => handleDependentClick(dependent)}>
                  <Avatar>
                    <AvatarImage src={dependent.avatar} alt={dependent.name} />
                    <AvatarFallback>{dependent.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold">{dependent.name}</h3>
                    <p className="text-sm text-muted-foreground">{dependent.relationship}</p>
                    <p className="text-sm text-muted-foreground">Last appointment: {dependent.lastAppointment}</p>
                  </div>
                  <div className="space-x-2">
                    <Button variant="outline" size="sm">
                      <FileText className="mr-2 h-4 w-4" /> Records
                    </Button>
                    <Button variant="outline" size="sm">
                      <Calendar className="mr-2 h-4 w-4" /> Appointments
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </ScrollArea>
        </CardContent>
      </Card>

      {selectedDependent && (
        <Card>
          <CardHeader>
            <CardTitle>{selectedDependent.name}'s Health Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="health-records">
              <TabsList>
                <TabsTrigger value="health-records">Health Records</TabsTrigger>
                <TabsTrigger value="appointments">Appointments</TabsTrigger>
                <TabsTrigger value="care-services">Care Services</TabsTrigger>
                <TabsTrigger value="access-control">Access Control</TabsTrigger>
              </TabsList>
              <TabsContent value="health-records">
                <h3 className="text-lg font-semibold mb-2">Medical History</h3>
                <p>No medical history recorded.</p>
                <Button className="mt-4">
                  <FileText className="mr-2 h-4 w-4" /> Upload Medical Records
                </Button>
              </TabsContent>
              <TabsContent value="appointments">
                <h3 className="text-lg font-semibold mb-2">Upcoming Appointments</h3>
                <p>No upcoming appointments.</p>
                <Button className="mt-4">
                  <Calendar className="mr-2 h-4 w-4" /> Schedule Appointment
                </Button>
              </TabsContent>
              <TabsContent value="care-services">
                <h3 className="text-lg font-semibold mb-2">Available Care Services</h3>
                <p>Search for healthcare providers or services for {selectedDependent.name}.</p>
                <Button className="mt-4">
                  <Search className="mr-2 h-4 w-4" /> Find Care Services
                </Button>
              </TabsContent>
              <TabsContent value="access-control">
                <h3 className="text-lg font-semibold mb-2">Access Control</h3>
                <p>Manage access permissions for {selectedDependent.name}.</p>
                <Button className="mt-4">
                  <Users className="mr-2 h-4 w-4" /> Grant Access
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      <Dialog open={isAddDependentModalOpen} onOpenChange={setIsAddDependentModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Dependent</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddDependentSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input id="name" name="name" className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="relationship" className="text-right">
                  Relationship
                </Label>
                <Input id="relationship" name="relationship" className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="gender" className="text-right">
                  Gender
                </Label>
                <Select name="gender" required>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                    <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="dob" className="text-right">
                  Date of Birth
                </Label>
                <Input id="dob" name="dob" type="date" className="col-span-3" required />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Add Dependent</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}