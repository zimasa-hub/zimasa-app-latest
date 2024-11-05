"use client"

import React, { useState, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Camera, X } from 'lucide-react'

interface UserData {
  username: string
  email: string
  phoneNumber: string
  password: string
  gender: string
  dateOfBirth: string
  profilePicture: string
}

export default function UserProfile({ initialUserData = {} as UserData }) {
  const [userData, setUserData] = useState<UserData>(initialUserData)
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setUserData(prevData => ({ ...prevData, [name]: value }))
  }

  const handleSelectChange = (value: string) => {
    setUserData(prevData => ({ ...prevData, gender: value }))
  }

  const handleSave = () => {
    // Implement save functionality here
    console.log('Saving user data:', userData)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setUserData(prevData => ({ ...prevData, profilePicture: reader.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="max-w-md mx-auto p-6 min-h-screen bg-white rounded-lg shadow-md my-10">
      <div className="flex flex-col items-center mb-6">
        <Dialog open={isImageModalOpen} onOpenChange={setIsImageModalOpen}>
          <DialogTrigger asChild>
            <button className="relative group">
              <Avatar className="w-24 h-24 cursor-pointer">
                <AvatarImage src={userData.profilePicture || '/placeholder.svg?height=96&width=96'} alt="Profile picture" />
                <AvatarFallback>{userData.username?.[0] || 'U'}</AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-8 h-8 text-white" />
              </div>
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <div className="flex flex-col items-center">
              <img src={userData.profilePicture || '/placeholder.svg?height=300&width=300'} alt="Profile picture" className="w-64 h-64 object-cover rounded-lg mb-4" />
              <Button onClick={triggerFileInput} className="mb-2">Update Photo</Button>
              <Button variant="outline" onClick={() => setIsImageModalOpen(false)}>Close</Button>
            </div>
          </DialogContent>
        </Dialog>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="username">Username</Label>
          <Input id="username" name="username" value={userData.username} onChange={handleInputChange} />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" value={userData.email} onChange={handleInputChange} />
        </div>
        <div>
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <Input id="phoneNumber" name="phoneNumber" value={userData.phoneNumber} onChange={handleInputChange} />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" value={userData.password} onChange={handleInputChange} />
        </div>
        <div>
          <Label htmlFor="gender">Gender</Label>
          <Select onValueChange={handleSelectChange} value={userData.gender}>
            <SelectTrigger>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="dateOfBirth">Date of Birth</Label>
          <Input id="dateOfBirth" name="dateOfBirth" type="date" value={userData.dateOfBirth} onChange={handleInputChange} />
        </div>
      </div>

      <Button className="w-full mt-6 bg-teal-600 hover:bg-teal-700" onClick={handleSave}>Save</Button>
      <Button variant="link" className="w-full mt-2 text-red-600">Sign out</Button>
    </div>
  )
}