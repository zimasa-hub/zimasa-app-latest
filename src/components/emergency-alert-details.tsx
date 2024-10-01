"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { AlertCircle, ArrowLeft, Phone, Clock, FileText, Users, AlertTriangle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"


interface DetailedAnalyticsComponentProps {
  onClose: () => void; // Define the type of the onClose prop as a function with no arguments and no return value
}


export default function EmergencyAlertDetailsComponent({ onClose }: DetailedAnalyticsComponentProps) {
  const [activeTab, setActiveTab] = useState("'details'")
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)

  const handleAssignTask = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    // Here you would typically send the task data to your backend API
    console.log("'Task assigned'")
    setShowSuccessMessage(true)
    setTimeout(() => setShowSuccessMessage(false), 3000)
  }

  const handleDocumentFollowUp = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    // Here you would typically send the follow-up data to your backend API
    console.log("'Follow-up documented'")
    setShowSuccessMessage(true)
    setTimeout(() => setShowSuccessMessage(false), 3000)
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" onClick={onClose} className="mr-2">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <CardTitle>Emergency Alert Details</CardTitle>
          </div>
          <Badge variant="destructive" className="text-sm">Critical</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="medical">Medical Records</TabsTrigger>
            <TabsTrigger value="contacts">Emergency Contacts</TabsTrigger>
            <TabsTrigger value="tasks">Assign Tasks</TabsTrigger>
            <TabsTrigger value="followup">Follow-Up</TabsTrigger>
          </TabsList>

          <TabsContent value="details">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">Emergency Description</h3>
                <p>Client John Doe collapsed during therapy session. Reported difficulty breathing and chest pain.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Timestamp</h3>
                <p>Reported at: {new Date().toLocaleString()}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Client's Current Status</h3>
                <p>Critical - Awaiting emergency services</p>
              </div>
              <Button onClick={() => setActiveTab("'contacts'")}>
                Contact Emergency Services
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="medical">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">Allergies</h3>
                <ul className="list-disc list-inside">
                  <li>Penicillin</li>
                  <li>Peanuts</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Current Medications</h3>
                <ul className="list-disc list-inside">
                  <li>Lisinopril 10mg - Once daily</li>
                  <li>Metformin 500mg - Twice daily</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Health History</h3>
                <ul className="list-disc list-inside">
                  <li>Hypertension - Diagnosed 2018</li>
                  <li>Type 2 Diabetes - Diagnosed 2019</li>
                  <li>Recent knee surgery - 3 months ago</li>
                </ul>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="contacts">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">Primary Emergency Contact</h3>
                <p>Name: Jane Doe (Spouse)</p>
                <p>Phone: (555) 123-4567</p>
                <Button className="mt-2">
                  <Phone className="mr-2 h-4 w-4" /> Call Primary Contact
                </Button>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Secondary Emergency Contact</h3>
                <p>Name: Michael Doe (Son)</p>
                <p>Phone: (555) 987-6543</p>
                <Button className="mt-2">
                  <Phone className="mr-2 h-4 w-4" /> Call Secondary Contact
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="tasks">
            <form onSubmit={handleAssignTask} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="taskTitle">Task Title</Label>
                <Input id="taskTitle" placeholder="e.g., Call Ambulance" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="assignedTo">Assigned To</Label>
                <Select required>
                  <SelectTrigger id="assignedTo">
                    <SelectValue placeholder="Select team member" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nurse1">Nurse Johnson</SelectItem>
                    <SelectItem value="doctor1">Dr. Smith</SelectItem>
                    <SelectItem value="caregiver1">Caregiver Brown</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueTime">Due Time</Label>
                <Input id="dueTime" type="datetime-local" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="taskNotes">Task Notes</Label>
                <Textarea id="taskNotes" placeholder="Additional instructions or notes" />
              </div>
              <Button type="submit">Assign Task</Button>
            </form>
          </TabsContent>

          <TabsContent value="followup">
            <form onSubmit={handleDocumentFollowUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="actionsTaken">Actions Taken</Label>
                <Textarea id="actionsTaken" placeholder="Describe actions taken during the emergency" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="outcome">Outcome</Label>
                <Select required>
                  <SelectTrigger id="outcome">
                    <SelectValue placeholder="Select outcome" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="stabilized">Condition Stabilized</SelectItem>
                    <SelectItem value="hospitalized">Hospitalized</SelectItem>
                    <SelectItem value="resolved">Emergency Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="nextSteps">Next Steps</Label>
                <Textarea id="nextSteps" placeholder="Document follow-up actions needed" required />
              </div>
              <Button type="submit">Save Documentation</Button>
            </form>
          </TabsContent>
        </Tabs>

        {showSuccessMessage && (
          <Alert className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>
              Your action has been successfully recorded.
            </AlertDescription>
          </Alert>
        )}

        <div className="mt-6">
          <Button variant="outline" className="w-full" onClick={() => setActiveTab("'details'")}>
            <AlertTriangle className="mr-2 h-4 w-4" /> Return to Emergency Details
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}