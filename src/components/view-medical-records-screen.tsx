"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { FileUp, Search, Share2, Download, Printer, Edit, Clock, User, AlertTriangle } from 'lucide-react'

type MedicalRecord = {
  id: string
  type: 'Lab Result' | 'Prescription' | 'Diagnosis' | 'Immunization' | 'Allergy'
  title: string
  date: string
  provider: string
  details: string
  document?: string
}

type Dependent = {
  id: string
  name: string
  relation: string
  avatar: string
}

export default function ViewMedicalRecordsScreen() {
  const [activeTab, setActiveTab] = useState<'overview' | 'lab-results' | 'prescriptions' | 'allergies' | 'immunizations' | 'medical-history'>('overview')
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null)
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [selectedDependent, setSelectedDependent] = useState<Dependent | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined)

  const medicalRecords: MedicalRecord[] = [
    { id: '1', type: 'Lab Result', title: 'Blood Test', date: '2023-05-15', provider: 'Dr. Smith', details: 'Cholesterol: 180mg/dL, Blood Sugar: 95mg/dL' },
    { id: '2', type: 'Prescription', title: 'Lisinopril', date: '2023-06-01', provider: 'Dr. Johnson', details: '10mg, once daily' },
    { id: '3', type: 'Diagnosis', title: 'Hypertension', date: '2023-04-20', provider: 'Dr. Williams', details: 'Stage 1 Hypertension diagnosed' },
    { id: '4', type: 'Immunization', title: 'Flu Shot', date: '2023-10-10', provider: 'Nurse Davis', details: 'Annual influenza vaccination' },
    { id: '5', type: 'Allergy', title: 'Peanut Allergy', date: '2023-03-05', provider: 'Dr. Brown', details: 'Severe allergy to peanuts' },
  ]

  const dependents: Dependent[] = [
    { id: '1', name: 'Sarah Johnson', relation: 'Daughter', avatar: '/placeholder.svg?height=50&width=50' },
    { id: '2', name: 'John Smith', relation: 'Spouse', avatar: '/placeholder.svg?height=50&width=50' },
  ]

  const filteredRecords = medicalRecords.filter(record => 
    record.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (!dateFilter || new Date(record.date) >= dateFilter)
  )

  const handleRecordClick = (record: MedicalRecord) => {
    setSelectedRecord(record)
  }

  const handleUpload = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Handle file upload logic here
    setIsUploadModalOpen(false)
  }

  const handleShare = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Handle sharing logic here
    setIsShareModalOpen(false)
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Medical Records</h1>
        <Select value={selectedDependent ? selectedDependent.id : ''} onValueChange={(value) => setSelectedDependent(dependents.find(d => d.id === value) || null)}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select Patient" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Self</SelectItem>
            {dependents.map((dependent) => (
              <SelectItem key={dependent.id} value={dependent.id}>{dependent.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Health Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <h3 className="font-semibold">Recent Lab Results</h3>
              <p className="text-sm text-muted-foreground">Blood Test (2023-05-15)</p>
            </div>
            <div className="text-center">
              <h3 className="font-semibold">Current Prescriptions</h3>
              <p className="text-sm text-muted-foreground">Lisinopril (10mg daily)</p>
            </div>
            <div className="text-center">
              <h3 className="font-semibold">Recent Diagnoses</h3>
              <p className="text-sm text-muted-foreground">Hypertension (2023-04-20)</p>
            </div>
            <div className="text-center">
              <h3 className="font-semibold">Upcoming Immunizations</h3>
              <p className="text-sm text-muted-foreground">Flu Shot (Due: 2024-10)</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex space-x-4">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Search records..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <div>
          <Label htmlFor="date-filter" className="sr-only">Filter by date</Label>
          <Calendar
            mode="single"
            selected={dateFilter}
            onSelect={setDateFilter}
            className="rounded-md border"
          />
        </div>
        <Button onClick={() => setIsUploadModalOpen(true)}>
          <FileUp className="mr-2 h-4 w-4" /> Upload Record
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as typeof activeTab)}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="lab-results">Lab Results</TabsTrigger>
          <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
          <TabsTrigger value="allergies">Allergies</TabsTrigger>
          <TabsTrigger value="immunizations">Immunizations</TabsTrigger>
          <TabsTrigger value="medical-history">Medical History</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <ScrollArea className="h-[400px]">
            {filteredRecords.map((record) => (
              <Card key={record.id} className="mb-4 cursor-pointer" onClick={() => handleRecordClick(record)}>
                <CardHeader>
                  <CardTitle>{record.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p><strong>Type:</strong> {record.type}</p>
                  <p><strong>Date:</strong> {record.date}</p>
                  <p><strong>Provider:</strong> {record.provider}</p>
                  <p>{record.details}</p>
                </CardContent>
              </Card>
            ))}
          </ScrollArea>
        </TabsContent>
        <TabsContent value="lab-results">
          <ScrollArea className="h-[400px]">
            {filteredRecords.filter(record => record.type === 'Lab Result').map((record) => (
              <Card key={record.id} className="mb-4 cursor-pointer" onClick={() => handleRecordClick(record)}>
                <CardHeader>
                  <CardTitle>{record.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p><strong>Date:</strong> {record.date}</p>
                  <p><strong>Provider:</strong> {record.provider}</p>
                  <p>{record.details}</p>
                </CardContent>
              </Card>
            ))}
          </ScrollArea>
        </TabsContent>
        {/* Similar TabsContent for prescriptions, allergies, immunizations, and medical-history */}
      </Tabs>

      {selectedRecord && (
        <Dialog open={!!selectedRecord} onOpenChange={() => setSelectedRecord(null)}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{selectedRecord.title}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="record-type" className="text-right">Type</Label>
                <Input id="record-type" value={selectedRecord.type} className="col-span-3" readOnly />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="record-date" className="text-right">Date</Label>
                <Input id="record-date" value={selectedRecord.date} className="col-span-3" readOnly />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="record-provider" className="text-right">Provider</Label>
                <Input id="record-provider" value={selectedRecord.provider} className="col-span-3" readOnly />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="record-details" className="text-right">Details</Label>
                <Textarea id="record-details" value={selectedRecord.details} className="col-span-3" readOnly />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => setIsShareModalOpen(true)}>
                <Share2 className="mr-2 h-4 w-4" /> Share
              </Button>
              <Button>
                <Download className="mr-2 h-4 w-4" /> Download
              </Button>
              <Button>
                <Printer className="mr-2 h-4 w-4" /> Print
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Upload New Record</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpload}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="upload-type" className="text-right">Record Type</Label>
                <Select required>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select record type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lab-result">Lab Result</SelectItem>
                    <SelectItem value="prescription">Prescription</SelectItem>
                    <SelectItem value="diagnosis">Diagnosis</SelectItem>
                    <SelectItem value="immunization">Immunization</SelectItem>
                    <SelectItem value="allergy">Allergy</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="upload-date" className="text-right">Date</Label>
                <Input id="upload-date" type="date" className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="upload-provider" className="text-right">Provider</Label>
                <Input id="upload-provider" className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="upload-file" className="text-right">File</Label>
                <Input id="upload-file" type="file" className="col-span-3" required />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Upload</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isShareModalOpen} onOpenChange={setIsShareModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Share Medical Record</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleShare}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="share-method" className="text-right">Share Method</Label>
                <Select required>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select share method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="link">Secure Link</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="share-recipient" className="text-right">Recipient</Label>
                <Input id="share-recipient" className="col-span-3" required />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Share</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader>
          <CardTitle>Medical Records History</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[200px]">
            <ul className="space-y-2">
              <li className="flex items-center">
                <Clock className="mr-2 h-4 w-4" />
                <span className="text-sm">Lab Result uploaded on 2023-05-15 by Dr. Smith</span>
              </li>
              <li className="flex items-center">
                <User className="mr-2 h-4 w-4" />
                <span className="text-sm">Prescription added on 2023-06-01 by Dr. Johnson</span>
              </li>
              <li className="flex items-center">
                <Share2 className="mr-2 h-4 w-4" />
                <span className="text-sm">Records shared with Dr. Williams on 2023-04-20</span>
              </li>
              <li className="flex items-center">
                <Edit className="mr-2 h-4 w-4" />
                <span className="text-sm">Allergy information updated on 2023-03-05</span>
              </li>
              <li className="flex items-center">
                <AlertTriangle className="mr-2 h-4 w-4" />
                <span className="text-sm">Unauthorized access attempt detected on 2023-07-01</span>
              </li>
            </ul>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}