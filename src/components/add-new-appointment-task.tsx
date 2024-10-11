// "use client"

// import React, { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Textarea } from "@/components/ui/textarea"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Checkbox } from "@/components/ui/checkbox"
// import { Label } from "@/components/ui/label"
// import { Calendar } from "@/components/ui/calendar"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
// import { AlertCircle, ArrowLeft, Calendar as CalendarIcon, Clock } from "lucide-react"
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
// import { format } from "date-fns"

// export default function AddNewAppointmentTaskComponent({ onClose }) {
//   const [formType, setFormType] = useState("'appointment'")
//   const [formData, setFormData] = useState({
//     clientName: "''",
//     serviceType: "''",
//     appointmentDate: new Date(),
//     appointmentTime: "''",
//     duration: "''",
//     appointmentNotes: "''",
//     communicationPreferences: [],
//     taskTitle: "''",
//     taskDueDate: new Date(),
//     taskDueTime: "''",
//     taskPriority: "''",
//     taskNotes: "''",
//   })
//   const [showSuccessMessage, setShowSuccessMessage] = useState(false)

//   const handleInputChange = (e) => {
//     const { name, value } = e.target
//     setFormData(prevState => ({
//       ...prevState,
//       [name]: value
//     }))
//   }

//   const handleSelectChange = (name, value) => {
//     setFormData(prevState => ({
//       ...prevState,
//       [name]: value
//     }))
//   }

//   const handleCheckboxChange = (value) => {
//     setFormData(prevState => ({
//       ...prevState,
//       communicationPreferences: prevState.communicationPreferences.includes(value)
//         ? prevState.communicationPreferences.filter(pref => pref !== value)
//         : [...prevState.communicationPreferences, value]
//     }))
//   }

//   const handleDateChange = (date, type) => {
//     setFormData(prevState => ({
//       ...prevState,
//       [type]: date
//     }))
//   }

//   const handleSubmit = (e) => {
//     e.preventDefault()
//     // Here you would typically send the formData to your backend API
//     console.log("'Form submitted:'", formData)
//     setShowSuccessMessage(true)
//     // Reset form or redirect after successful submission
//     setTimeout(() => {
//       setShowSuccessMessage(false)
//       onClose()
//     }, 3000)
//   }

//   return (
//     <Card className="w-full max-w-4xl mx-auto">
//       <CardHeader>
//         <div className="flex items-center">
//           <Button variant="ghost" onClick={onClose} className="mr-2">
//             <ArrowLeft className="h-4 w-4" />
//           </Button>
//           <CardTitle>Add New Appointment/Task</CardTitle>
//         </div>
//       </CardHeader>
//       <CardContent>
//         <Tabs value={formType} onValueChange={setFormType}>
//           <TabsList className="grid w-full grid-cols-2">
//             <TabsTrigger value="appointment">Appointment</TabsTrigger>
//             <TabsTrigger value="task">Task</TabsTrigger>
//           </TabsList>
//           <TabsContent value="appointment">
//             <form onSubmit={handleSubmit} className="space-y-6">
//               <div className="space-y-2">
//                 <Label htmlFor="clientName">Client Name</Label>
//                 <Select name="clientName" onValueChange={(value) => handleSelectChange("'clientName'", value)}>
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select client" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="johnDoe">John Doe</SelectItem>
//                     <SelectItem value="janeSmith">Jane Smith</SelectItem>
//                     <SelectItem value="bobJohnson">Bob Johnson</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="serviceType">Service Type</Label>
//                 <Select name="serviceType" onValueChange={(value) => handleSelectChange("'serviceType'", value)}>
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select service type" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="telehealth">Telehealth Consultation</SelectItem>
//                     <SelectItem value="fitness">Fitness Session</SelectItem>
//                     <SelectItem value="wellness">Wellness Coaching</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div className="space-y-2">
//                 <Label>Appointment Date and Time</Label>
//                 <div className="flex space-x-4">
//                   <div className="flex-1">
//                     <Calendar
//                       mode="single"
//                       selected={formData.appointmentDate}
//                       onSelect={(date) => handleDateChange(date, "'appointmentDate'")}
//                       className="rounded-md border"
//                     />
//                   </div>
//                   <div className="flex-1">
//                     <Select name="appointmentTime" onValueChange={(value) => handleSelectChange("'appointmentTime'", value)}>
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select time" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
//                           <SelectItem key={hour} value={`${hour.toString().padStart(2, "'0'")}:00`}>
//                             {`${hour.toString().padStart(2, "'0'")}:00`}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </div>
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="duration">Duration</Label>
//                 <Select name="duration" onValueChange={(value) => handleSelectChange("'duration'", value)}>
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select duration" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="30">30 minutes</SelectItem>
//                     <SelectItem value="60">1 hour</SelectItem>
//                     <SelectItem value="90">1.5 hours</SelectItem>
//                     <SelectItem value="120">2 hours</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="appointmentNotes">Appointment Notes</Label>
//                 <Textarea
//                   id="appointmentNotes"
//                   name="appointmentNotes"
//                   value={formData.appointmentNotes}
//                   onChange={handleInputChange}
//                   placeholder="Add any relevant notes for the appointment"
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label>Communication Preferences</Label>
//                 <div className="flex space-x-4">
//                   <Checkbox
//                     id="emailPref"
//                     checked={formData.communicationPreferences.includes("'email'")}
//                     onCheckedChange={() => handleCheckboxChange("'email'")}
//                   />
//                   <Label htmlFor="emailPref">Email</Label>
//                   <Checkbox
//                     id="smsPref"
//                     checked={formData.communicationPreferences.includes("'sms'")}
//                     onCheckedChange={() => handleCheckboxChange("'sms'")}
//                   />
//                   <Label htmlFor="smsPref">SMS</Label>
//                   <Checkbox
//                     id="pushPref"
//                     checked={formData.communicationPreferences.includes("'push'")}
//                     onCheckedChange={() => handleCheckboxChange("'push'")}
//                   />
//                   <Label htmlFor="pushPref">Push Notification</Label>
//                 </div>
//               </div>

//               <div className="flex justify-end space-x-4">
//                 <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
//                 <Button type="submit">Schedule Appointment</Button>
//               </div>
//             </form>
//           </TabsContent>
//           <TabsContent value="task">
//             <form onSubmit={handleSubmit} className="space-y-6">
//               <div className="space-y-2">
//                 <Label htmlFor="taskTitle">Task Title</Label>
//                 <Input
//                   id="taskTitle"
//                   name="taskTitle"
//                   value={formData.taskTitle}
//                   onChange={handleInputChange}
//                   placeholder="Enter task title"
//                   required
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="clientName">Associated Client (Optional)</Label>
//                 <Select name="clientName" onValueChange={(value) => handleSelectChange("'clientName'", value)}>
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select client" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="johnDoe">John Doe</SelectItem>
//                     <SelectItem value="janeSmith">Jane Smith</SelectItem>
//                     <SelectItem value="bobJohnson">Bob Johnson</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div className="space-y-2">
//                 <Label>Task Due Date and Time</Label>
//                 <div className="flex space-x-4">
//                   <div className="flex-1">
//                     <Calendar
//                       mode="single"
//                       selected={formData.taskDueDate}
//                       onSelect={(date) => handleDateChange(date, "'taskDueDate'")}
//                       className="rounded-md border"
//                     />
//                   </div>
//                   <div className="flex-1">
//                     <Select name="taskDueTime" onValueChange={(value) => handleSelectChange("'taskDueTime'", value)}>
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select time" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
//                           <SelectItem key={hour} value={`${hour.toString().padStart(2, "'0'")}:00`}>
//                             {`${hour.toString().padStart(2, "'0'")}:00`}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </div>
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="taskPriority">Priority Level</Label>
//                 <RadioGroup
//                   name="taskPriority"
//                   value={formData.taskPriority}
//                   onValueChange={(value) => handleSelectChange("'taskPriority'", value)}
//                 >
//                   <div className="flex items-center space-x-2">
//                     <RadioGroupItem value="high" id="high" />
//                     <Label htmlFor="high">High</Label>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <RadioGroupItem value="medium" id="medium" />
//                     <Label htmlFor="medium">Medium</Label>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <RadioGroupItem value="low" id="low" />
//                     <Label htmlFor="low">Low</Label>
//                   </div>
//                 </RadioGroup>
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="taskNotes">Task Notes</Label>
//                 <Textarea
//                   id="taskNotes"
//                   name="taskNotes"
//                   value={formData.taskNotes}
//                   onChange={handleInputChange}
//                   placeholder="Add any additional details about the task"
//                 />
//               </div>

//               <div className="flex justify-end space-x-4">
//                 <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
//                 <Button type="submit">Save Task</Button>
//               </div>
//             </form>
//           </TabsContent>
//         </Tabs>

//         {showSuccessMessage && (
//           <Alert className="mt-4">
//             <AlertCircle className="h-4 w-4" />
//             <AlertTitle>Success</AlertTitle>
//             <AlertDescription>
//               Your {formType} has been successfully created.
//             </AlertDescription>
//           </Alert>
//         )}
//       </CardContent>
//     </Card>
//   )
// }