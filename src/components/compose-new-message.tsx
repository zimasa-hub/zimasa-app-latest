"'use client'"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { AlertCircle, ArrowLeft, Paperclip, X } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface DetailedAnalyticsComponentProps {
  onClose: () => void; // Define the type of the onClose prop as a function with no arguments and no return value
}

interface FormData {
  recipientType: string;
  recipient: string;
  subject: string;
  messageBody: string;
  attachments: File[];
  scheduleMessage: boolean;
  scheduledDate: Date | null;
  scheduledTime: {
    hour: string;
    minute: string;
  };
}



export default function ComposeNewMessageComponent({ onClose }: DetailedAnalyticsComponentProps) {
  const [formData, setFormData] = useState<FormData>({
    recipientType: '',
    recipient: '',
    subject: '',
    messageBody: '',
    attachments: [],
    scheduleMessage: false,
    scheduledDate: null,
    scheduledTime: { hour: '09', minute: '00' },
  });
  

  const [showSuccessMessage, setShowSuccessMessage] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };
  

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setFormData(prevState => ({
      ...prevState,
      attachments: [...prevState.attachments, ...files]
    }))
  }

  const handleRemoveAttachment = (index: number) => {
    setFormData(prevState => ({
      ...prevState,
      attachments: prevState.attachments.filter((_, i) => i !== index)
    }))
  }

  const handleScheduleToggle = (checked: boolean) => {
    setFormData(prevState => ({
      ...prevState,
      scheduleMessage: checked
    }))
  }

  
  const handleDateChange = (date: Date | undefined) => {
    setFormData(prevState => ({
      ...prevState,
      scheduledDate: date ?? null, // Fallback to null if date is undefined
    }));
  };
  
  

  const handleTimeChange = (type: string, value: string) => {
    setFormData(prevState => ({
      ...prevState,
      scheduledTime: {
        ...prevState.scheduledTime,
        [type]: value
      }
    }))
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    // Here you would typically send the formData to your backend API
    console.log("'Message submitted:'", formData)
    setShowSuccessMessage(true)
    // Reset form or close after successful submission
    setTimeout(() => {
      setShowSuccessMessage(false)
      onClose()
    }, 3000)
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center">
          <Button variant="ghost" onClick={onClose} className="mr-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <CardTitle>Compose New Message</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="recipientType">Recipient Type</Label>
            <Select
              name="recipientType"
              onValueChange={(value) => handleSelectChange("'recipientType'", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select recipient type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="clients">Clients</SelectItem>
                <SelectItem value="careTeam">Care Team Members</SelectItem>
                <SelectItem value="otherProviders">Other Providers</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="recipient">Recipient</Label>
            <Select
              name="recipient"
              onValueChange={(value) => handleSelectChange("'recipient'", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select recipient" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="johnDoe">John Doe</SelectItem>
                <SelectItem value="janeSmith">Jane Smith</SelectItem>
                <SelectItem value="drJohnson">Dr. Johnson</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Subject (Optional)</Label>
            <Input
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="messageBody">Message</Label>
            <Textarea
              id="messageBody"
              name="messageBody"
              value={formData.messageBody}
              onChange={handleInputChange}
              rows={6}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Attachments</Label>
            <div className="flex items-center space-x-2">
              <Input
                type="file"
                onChange={handleFileUpload}
                multiple
                className="hidden"
                id="file-upload"
              />
              <Label htmlFor="file-upload" className="cursor-pointer">
                <div className="flex items-center space-x-2 bg-neutral-100 text-neutral-900 hover:bg-neutral-100/80 h-10 px-4 py-2 rounded-md dark:bg-neutral-800 dark:text-neutral-50 dark:hover:bg-neutral-800/80">
                  <Paperclip className="h-4 w-4" />
                  <span>Attach Files</span>
                </div>
              </Label>
            </div>
            {formData.attachments.length > 0 && (
              <ul className="mt-2 space-y-1">
                {formData.attachments.map((file, index) => (
                  <li key={index} className="flex items-center justify-between bg-neutral-100/50 p-2 rounded-md dark:bg-neutral-800/50">
                    <span>{file.name}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveAttachment(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="scheduleMessage"
              checked={formData.scheduleMessage}
              onCheckedChange={handleScheduleToggle}
            />
            <Label htmlFor="scheduleMessage">Schedule message for later</Label>
          </div>

          {formData.scheduleMessage && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Select Date</Label>
                <Calendar
                  mode="single"
                  selected={formData.scheduledDate ?? undefined} // Fallback to undefined
                  onSelect={handleDateChange}
                  className="rounded-md border"
                />
              </div>
              <div className="space-y-2">
                <Label>Select Time</Label>
                <div className="flex space-x-2">
                  <Select
                    value={formData.scheduledTime.hour}
                    onValueChange={(value) => handleTimeChange("'hour'", value)}
                  >
                    <SelectTrigger className="w-[100px]">
                      <SelectValue placeholder="Hour" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
                        <SelectItem key={hour} value={hour.toString().padStart(2, "'0'")}>
                          {hour.toString().padStart(2, "'0'")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={formData.scheduledTime.minute}
                    onValueChange={(value) => handleTimeChange("'minute'", value)}
                  >
                    <SelectTrigger className="w-[100px]">
                      <SelectValue placeholder="Minute" />
                    </SelectTrigger>
                    <SelectContent>
                      {["'00'", "'15'", "'30'", "'45'"].map((minute) => (
                        <SelectItem key={minute} value={minute}>
                          {minute}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">Send Message</Button>
          </div>
        </form>

        {showSuccessMessage && (
          <Alert className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>
              Your message has been successfully sent.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}