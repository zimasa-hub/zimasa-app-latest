"'use client'"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { AlertCircle, ArrowLeft } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function AddNewServiceComponent({ onClose }) {
  const [formData, setFormData] = useState({
    serviceName: "''",
    serviceType: "''",
    serviceDescription: "''",
    price: "''",
    duration: "''",
    paymentMethods: [],
    serviceCategory: "''",
    serviceLocation: "''",
    maxCapacity: "''",
    availability: [],
    availabilityTime: { hour: "'09'", minute: "'00'" }
  })

  const [showSuccessMessage, setShowSuccessMessage] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  const handleSelectChange = (name, value) => {
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  const handleCheckboxChange = (value) => {
    setFormData(prevState => ({
      ...prevState,
      paymentMethods: prevState.paymentMethods.includes(value)
        ? prevState.paymentMethods.filter(method => method !== value)
        : [...prevState.paymentMethods, value]
    }))
  }

  const handleAvailabilityChange = (dates) => {
    setFormData(prevState => ({
      ...prevState,
      availability: dates
    }))
  }

  const handleTimeChange = (type, value) => {
    setFormData(prevState => ({
      ...prevState,
      availabilityTime: {
        ...prevState.availabilityTime,
        [type]: value
      }
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Here you would typically send the formData to your backend API
    console.log("'Form submitted:'", formData)
    setShowSuccessMessage(true)
    // Reset form or redirect after successful submission
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
          <CardTitle>Add New Service</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="serviceName">Service Name</Label>
              <Input
                id="serviceName"
                name="serviceName"
                value={formData.serviceName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="serviceType">Service Type</Label>
              <Select
                name="serviceType"
                onValueChange={(value) => handleSelectChange("'serviceType'", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select service type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="wellness">Wellness</SelectItem>
                  <SelectItem value="fitness">Fitness</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="serviceDescription">Service Description</Label>
            <Textarea
              id="serviceDescription"
              name="serviceDescription"
              value={formData.serviceDescription}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duration</Label>
              <Select
                name="duration"
                onValueChange={(value) => handleSelectChange("'duration'", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="90">1.5 hours</SelectItem>
                  <SelectItem value="120">2 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxCapacity">Maximum Capacity</Label>
              <Input
                id="maxCapacity"
                name="maxCapacity"
                type="number"
                value={formData.maxCapacity}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Payment Methods</Label>
            <div className="flex space-x-4">
              <Checkbox
                id="creditCard"
                checked={formData.paymentMethods.includes("'creditCard'")}
                onCheckedChange={() => handleCheckboxChange("'creditCard'")}
              />
              <Label htmlFor="creditCard">Credit Card</Label>
              <Checkbox
                id="wellthPoints"
                checked={formData.paymentMethods.includes("'wellthPoints'")}
                onCheckedChange={() => handleCheckboxChange("'wellthPoints'")}
              />
              <Label htmlFor="wellthPoints">Wellth Points</Label>
              <Checkbox
                id="insurance"
                checked={formData.paymentMethods.includes("'insurance'")}
                onCheckedChange={() => handleCheckboxChange("'insurance'")}
              />
              <Label htmlFor="insurance">Insurance</Label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="serviceCategory">Service Category</Label>
              <Select
                name="serviceCategory"
                onValueChange={(value) => handleSelectChange("'serviceCategory'", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mentalHealth">Mental Health</SelectItem>
                  <SelectItem value="physicalTherapy">Physical Therapy</SelectItem>
                  <SelectItem value="generalWellness">General Wellness</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="serviceLocation">Service Location</Label>
              <Select
                name="serviceLocation"
                onValueChange={(value) => handleSelectChange("'serviceLocation'", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="inPerson">In-Person</SelectItem>
                  <SelectItem value="virtual">Virtual</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Availability</Label>
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
              <Calendar
                mode="multiple"
                selected={formData.availability}
                onSelect={handleAvailabilityChange}
                className="rounded-md border"
              />
              <div className="flex space-x-2">
                <Select
                  value={formData.availabilityTime.hour}
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
                  value={formData.availabilityTime.minute}
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

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">Save and Publish</Button>
          </div>
        </form>

        {showSuccessMessage && (
          <Alert className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>
              Your new service has been successfully created and published.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}