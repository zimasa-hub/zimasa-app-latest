"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Trophy, Share2, ThumbsUp, MessageSquare, Image as ImageIcon, Smile, Facebook, Twitter, Instagram, Linkedin, ArrowLeft } from 'lucide-react'

type Achievement = {
  id: string
  title: string
  description: string
  date: string
  wellthPoints: number
  type: 'wellness' | 'fitness' | 'nutrition'
}

type SharedAchievement = {
  id: string
  achievementId: string
  message: string
  template: string
  image?: string
  platform: 'facebook' | 'twitter' | 'instagram' | 'linkedin' | 'zimasa'
  date: string
  likes: number
  comments: number
}

export default function ShareHealthAchievementScreen() {
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null)
  const [customMessage, setCustomMessage] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState('progress')
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [isCustomizing, setIsCustomizing] = useState(false)
  const [isSocialShareModalOpen, setIsSocialShareModalOpen] = useState(false)
  const [isZimasaShareModalOpen, setIsZimasaShareModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'recent' | 'history'>('recent')

  const achievements: Achievement[] = [
    { id: '1', title: '30-Day Fitness Challenge', description: 'Completed the 30-day fitness program', date: '2023-05-15', wellthPoints: 500, type: 'fitness' },
    { id: '2', title: '10,000 Steps Goal', description: 'Reached 10,000 steps for 7 consecutive days', date: '2023-05-10', wellthPoints: 200, type: 'fitness' },
    { id: '3', title: 'Nutrition Plan', description: 'Followed the nutrition plan for 2 weeks', date: '2023-05-05', wellthPoints: 300, type: 'nutrition' },
  ]

  const sharedAchievements: SharedAchievement[] = [
    { id: '1', achievementId: '1', message: 'Just completed my 30-day fitness challenge!', template: 'badge', platform: 'facebook', date: '2023-05-15', likes: 25, comments: 8 },
    { id: '2', achievementId: '2', message: 'Reached my step goal for a week straight!', template: 'progress', platform: 'zimasa', date: '2023-05-11', likes: 15, comments: 5 },
  ]

  const handleAchievementSelect = (achievement: Achievement) => {
    setSelectedAchievement(achievement)
    setIsCustomizing(true)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0])
    }
  }

  const handleSocialShare = (platform: 'facebook' | 'twitter' | 'instagram' | 'linkedin') => {
    // Implement social media sharing logic here
    console.log(`Sharing to ${platform}`)
    setIsSocialShareModalOpen(false)
  }

  const handleZimasaShare = () => {
    // Implement Zimasa community sharing logic here
    console.log('Sharing to Zimasa community')
    setIsZimasaShareModalOpen(false)
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">Share Health Achievement</h1>
      
      {!isCustomizing ? (
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'recent' | 'history')}>
          <TabsList>
            <TabsTrigger value="recent">Recent Achievements</TabsTrigger>
            <TabsTrigger value="history">Sharing History</TabsTrigger>
          </TabsList>
          <TabsContent value="recent">
            <ScrollArea className="h-[400px]">
              {achievements.map((achievement) => (
                <Card key={achievement.id} className="mb-4 cursor-pointer" onClick={() => handleAchievementSelect(achievement)}>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Trophy className="w-6 h-6 mr-2" />
                      {achievement.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{achievement.description}</p>
                    <div className="flex justify-between items-center mt-2">
                      <Badge>{achievement.type}</Badge>
                      <span className="text-sm text-muted-foreground">{achievement.date}</span>
                    </div>
                    <div className="mt-2">
                      <span className="font-semibold">{achievement.wellthPoints} Wellth Points</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </ScrollArea>
          </TabsContent>
          <TabsContent value="history">
            <ScrollArea className="h-[400px]">
              {sharedAchievements.map((shared) => (
                <Card key={shared.id} className="mb-4">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Share2 className="w-6 h-6 mr-2" />
                      {achievements.find(a => a.id === shared.achievementId)?.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{shared.message}</p>
                    <div className="flex justify-between items-center mt-2">
                      <Badge>{shared.platform}</Badge>
                      <span className="text-sm text-muted-foreground">{shared.date}</span>
                    </div>
                    <div className="flex items-center space-x-4 mt-2">
                      <div className="flex items-center">
                        <ThumbsUp className="w-4 h-4 mr-1" />
                        <span>{shared.likes}</span>
                      </div>
                      <div className="flex items-center">
                        <MessageSquare className="w-4 h-4 mr-1" />
                        <span>{shared.comments}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      ) : (
        <div className="space-y-6">
          <Button variant="outline" onClick={() => setIsCustomizing(false)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Achievements
          </Button>
          <Card>
            <CardHeader>
              <CardTitle>Customize Your Achievement</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="custom-message">Add a personal message</Label>
                <Textarea
                  id="custom-message"
                  placeholder="I'm proud of this achievement because..."
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                />
              </div>
              <div>
                <Label>Choose a template</Label>
                <RadioGroup value={selectedTemplate} onValueChange={setSelectedTemplate}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="progress" id="progress" />
                    <Label htmlFor="progress">Progress Bar</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="badge" id="badge" />
                    <Label htmlFor="badge">Achievement Badge</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="points" id="points" />
                    <Label htmlFor="points">Wellth Points</Label>
                  </div>
                </RadioGroup>
              </div>
              <div>
                <Label htmlFor="image-upload">Upload an image</Label>
                <Input id="image-upload" type="file" onChange={handleImageUpload} />
              </div>
              <div className="flex justify-between">
                <Button onClick={() => setIsSocialShareModalOpen(true)}>
                  <Share2 className="w-4 h-4 mr-2" />
                  Share to Social Media
                </Button>
                <Button onClick={() => setIsZimasaShareModalOpen(true)}>
                  <Share2 className="w-4 h-4 mr-2" />
                  Share to Zimasa Community
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Dialog open={isSocialShareModalOpen} onOpenChange={setIsSocialShareModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share to Social Media</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <Button onClick={() => handleSocialShare('facebook')}>
              <Facebook className="w-4 h-4 mr-2" />
              Facebook
            </Button>
            <Button onClick={() => handleSocialShare('twitter')}>
              <Twitter className="w-4 h-4 mr-2" />
              Twitter
            </Button>
            <Button onClick={() => handleSocialShare('instagram')}>
              <Instagram className="w-4 h-4 mr-2" />
              Instagram
            </Button>
            <Button onClick={() => handleSocialShare('linkedin')}>
              <Linkedin className="w-4 h-4 mr-2" />
              LinkedIn
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isZimasaShareModalOpen} onOpenChange={setIsZimasaShareModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share to Zimasa Community</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="community-forum">Select Community Forum</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a forum" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fitness">Fitness Enthusiasts</SelectItem>
                  <SelectItem value="nutrition">Healthy Eating</SelectItem>
                  <SelectItem value="wellness">General Wellness</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="notify-followers" />
              <Label htmlFor="notify-followers">Notify my followers</Label>
            </div>
            <Button onClick={handleZimasaShare} className="w-full">
              Share to Zimasa Community
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}