'use client'

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Calendar as CalendarIcon, Clock } from "lucide-react"
import Link from "next/link"
import axios from 'axios'
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"

interface FormData {
  serviceType: number
  serviceDescription: string
  price: string
  duration: string
  maxCapacity: string
  paymentMethods: string[]
  serviceCategory: string
  serviceLocation: string
  startDate: Date | undefined
  endDate: Date | undefined
  availableDays: AvailableDay[]
}

interface AvailableDay {
  day: string
  startTime: string
  endTime: string
}

interface ServiceType {
  id: number
  name: string
}

interface ServiceCategory {
  id: number
  name: string
}

interface AddNewServiceComponentProps {
  serviceTypes: ServiceType[]
  paymentMethods: { id: number; method: string }[]
  currentMemberId: string | null 
}

export default function AddNewServiceComponent({ serviceTypes, paymentMethods, currentMemberId }: AddNewServiceComponentProps) {
  const [formData, setFormData] = useState<FormData>({
    serviceType: 0,
    serviceDescription: "",
    price: "",
    duration: "",
    maxCapacity: "",
    paymentMethods: [],
    serviceCategory: "",
    serviceLocation: "",
    startDate: undefined,
    endDate: undefined,
    availableDays: []
  })

  const [serviceCategories, setServiceCategories] = useState<ServiceCategory[]>([])
  const [selectedDay, setSelectedDay] = useState<string | null>(null)
  const [startTime, setStartTime] = useState("09:00")
  const [endTime, setEndTime] = useState("17:00")

  useEffect(() => {
    if (formData.serviceType) {
      fetchServiceCategories(formData.serviceType)
    }
  }, [formData.serviceType])

  const fetchServiceCategories = async (serviceTypeId: number) => {
    try {
      const response = await axios.get(`/api/user/service-categories?serviceTypeId=${serviceTypeId}&cursorId=0&limit=50&sortBy=id&sortDirection=asc`)
      setServiceCategories(response.data.content)
    } catch (error) {
      console.error('Error fetching service categories:', error)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  const handleSelectChange = (name: keyof FormData, value: string) => {
    setFormData(prevState => ({
      ...prevState,
      [name]: name === 'serviceType' ? parseInt(value, 10) : value
    }))
  }

  const handleCheckboxChange = (value: string) => {
    setFormData(prevState => ({
      ...prevState,
      paymentMethods: prevState.paymentMethods.includes(value)
        ? prevState.paymentMethods.filter(method => method !== value)
        : [...prevState.paymentMethods, value]
    }))
  }

  const handleDaySelect = (day: string) => {
    setSelectedDay(day === selectedDay ? null : day)
  }

  const handleDateChange = (date: Date | undefined, field: 'startDate' | 'endDate') => {
    setFormData(prevState => ({
      ...prevState,
      [field]: date
    }))
  }

  const handleAddAvailability = () => {
    if (selectedDay && startTime && endTime) {
      setFormData(prevState => ({
        ...prevState,
        availableDays: [
          ...prevState.availableDays,
          { day: selectedDay, startTime, endTime }
        ]
      }))
      setSelectedDay(null)
      setStartTime("09:00")
      setEndTime("17:00")
    }
  }

  const handleRemoveAvailability = (index: number) => {
    setFormData(prevState => ({
      ...prevState,
      availableDays: prevState.availableDays.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    // Add your form submission logic here
  }

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  return (
    <div className="bg-white min-h-screen">
      <header className="bg-teal-600 text-white p-4 flex items-center">
        <Link href="/dashboard" className="mr-4">
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <h1 className="text-xl font-semibold">Add New Service</h1>
      </header>
      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="serviceType">Service Type</Label>
          <Select
            name="serviceType"
            onValueChange={(value) => handleSelectChange("serviceType", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select service type" />
            </SelectTrigger>
            <SelectContent>
              {serviceTypes.map((type) => (
                <SelectItem key={type.id} value={type.id.toString()}>{type.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="serviceDescription">Service Description</Label>
          <Textarea
            id="serviceDescription"
            name="serviceDescription"
            value={formData.serviceDescription}
            onChange={handleInputChange}
            placeholder="Describe the service..."
            className="h-24"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="0.00"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="duration">Duration</Label>
            <Select
              name="duration"
              onValueChange={(value) => handleSelectChange("duration", value)}
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
        </div>

        <div className="space-y-2">
          <Label htmlFor="maxCapacity">Maximum Capacity</Label>
          <Input
            id="maxCapacity"
            name="maxCapacity"
            type="number"
            value={formData.maxCapacity}
            onChange={handleInputChange}
            placeholder="Enter max capacity"
          />
        </div>

        <div className="space-y-2">
          <Label>Payment Methods</Label>
          <div className="grid grid-cols-3 gap-2">
            {paymentMethods.map((method) => (
              <div key={method.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`paymentMethod-${method.id}`}
                  checked={formData.paymentMethods.includes(method.id.toString())}
                  onCheckedChange={() => handleCheckboxChange(method.id.toString())}
                />
                <Label htmlFor={`paymentMethod-${method.id}`}>{method.method}</Label>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="serviceCategory">Service Category</Label>
            <Select
              name="serviceCategory"
              onValueChange={(value) => handleSelectChange("serviceCategory", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {serviceCategories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>{category.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="serviceLocation">Service Location</Label>
            <Select
              name="serviceLocation"
              onValueChange={(value) => handleSelectChange("serviceLocation", value)}
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
          <Label>Service Period</Label>
          <div className="flex space-x-4">
            <div className="flex-1">
              <Label htmlFor="startDate">Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full justify-start text-left font-normal ${!formData.startDate && "text-muted-foreground"}`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.startDate ? format(formData.startDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.startDate}
                    onSelect={(date) => handleDateChange(date, 'startDate')}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex-1">
              <Label htmlFor="endDate">End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full justify-start text-left font-normal ${!formData.endDate && "text-muted-foreground"}`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.endDate ? format(formData.endDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.endDate}
                    onSelect={(date) => handleDateChange(date, 'endDate')}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Available Days</Label>
          <div className="flex space-x-2">
            {days.map((day) => (
              <Button
                key={day}
                onClick={() => handleDaySelect(day)}
                variant={selectedDay === day ? "default" : "outline"}
                className="w-10 h-10 p-0 bg-cust"
              >
                {day}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Available Time</Label>
          <div className="flex space-x-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <Input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-24"
              />
            </div>
            <span>to</span>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <Input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-24"
              />
            </div>
          </div>
        </div>

        <Button type="button" className="bg-custom-green" onClick={handleAddAvailability}>
          Add Availability
        </Button>

        {formData.availableDays.length > 0 && (
          <div className="space-y-2">
            <Label>Set Availabilities</Label>
            <ul className="space-y-2">
              {formData.availableDays.map((availableDay, index) => (
                <li key={index} className="flex justify-between items-center">
                  <span>{`${availableDay.day}: ${availableDay.startTime} - ${availableDay.endTime}`}</span>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemoveAvailability(index)}
                  >
                    Remove
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700">
          Save and Publish
        </Button>
      </form>
    </div>
  )
}