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
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Calendar } from "@/components/ui/calendar"
import { Search, Filter, Award, Target, Users, Gift, ArrowRight, Clock, Dumbbell, Utensils, Brain } from 'lucide-react'

type WellnessProgram = {
  id: string
  title: string
  description: string
  type: 'fitness' | 'nutrition' | 'mindfulness'
  duration: number
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  rewards: number
  participants: number
}

type Challenge = {
  id: string
  title: string
  description: string
  participants: number
  duration: number
  reward: number
}

export default function JoinWellnessProgramScreen() {
  const [activeTab, setActiveTab] = useState<'marketplace' | 'dashboard' | 'challenges' | 'rewards'>('marketplace')
  const [selectedProgram, setSelectedProgram] = useState<WellnessProgram | null>(null)
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'fitness' | 'nutrition' | 'mindfulness'>('all')
  const [filterDuration, setFilterDuration] = useState<number>(0)
  const [filterDifficulty, setFilterDifficulty] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all')

  const wellnessPrograms: WellnessProgram[] = [
    { id: '1', title: 'Step Challenge', description: 'Increase your daily steps', type: 'fitness', duration: 4, difficulty: 'beginner', rewards: 500, participants: 1500 },
    { id: '2', title: 'Mindful Eating', description: 'Learn to eat mindfully', type: 'nutrition', duration: 6, difficulty: 'intermediate', rewards: 750, participants: 1200 },
    { id: '3', title: 'Meditation Mastery', description: 'Daily meditation practice', type: 'mindfulness', duration: 8, difficulty: 'advanced', rewards: 1000, participants: 800 },
    { id: '4', title: 'Couch to 5K', description: 'Start running with ease', type: 'fitness', duration: 12, difficulty: 'beginner', rewards: 1500, participants: 2000 },
    { id: '5', title: 'Plant-Based Diet', description: 'Transition to plant-based eating', type: 'nutrition', duration: 8, difficulty: 'intermediate', rewards: 1000, participants: 1000 },
  ]

  const challenges: Challenge[] = [
    { id: '1', title: '10K Steps Daily', description: 'Walk 10,000 steps every day for a week', participants: 500, duration: 7, reward: 200 },
    { id: '2', title: 'Veggie Challenge', description: 'Eat 5 servings of vegetables daily for 5 days', participants: 300, duration: 5, reward: 150 },
    { id: '3', title: 'Mindfulness Minutes', description: 'Meditate for 10 minutes daily for 10 days', participants: 400, duration: 10, reward: 250 },
  ]

  const filteredPrograms = wellnessPrograms.filter(program => 
    program.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterType === 'all' || program.type === filterType) &&
    (filterDuration === 0 || program.duration <= filterDuration) &&
    (filterDifficulty === 'all' || program.difficulty === filterDifficulty)
  )

  const handleProgramClick = (program: WellnessProgram) => {
    setSelectedProgram(program)
    setIsJoinModalOpen(true)
  }

  const handleJoinProgram = () => {
    // Handle joining program logic here
    setIsJoinModalOpen(false)
    setActiveTab('dashboard')
  }

  const renderProgramIcon = (type: 'fitness' | 'nutrition' | 'mindfulness') => {
    switch (type) {
      case 'fitness':
        return <Dumbbell className="h-6 w-6" />
      case 'nutrition':
        return <Utensils className="h-6 w-6" />
      case 'mindfulness':
        return <Brain className="h-6 w-6" />
    }
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">Wellness Programs</h1>
      
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as typeof activeTab)}>
        <TabsList>
          <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
          <TabsTrigger value="dashboard">My Programs</TabsTrigger>
          <TabsTrigger value="challenges">Group Challenges</TabsTrigger>
          <TabsTrigger value="rewards">Rewards</TabsTrigger>
        </TabsList>

        <TabsContent value="marketplace">
          <Card>
            <CardHeader>
              <CardTitle>Wellness Program Marketplace</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-4 mb-4">
                <div className="flex-1">
                  <Label htmlFor="search-programs" className="sr-only">Search programs</Label>
                  <Input
                    id="search-programs"
                    placeholder="Search programs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                <Select value={filterType} onValueChange={(value) => setFilterType(value as typeof filterType)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Program Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="fitness">Fitness</SelectItem>
                    <SelectItem value="nutrition">Nutrition</SelectItem>
                    <SelectItem value="mindfulness">Mindfulness</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterDifficulty} onValueChange={(value) => setFilterDifficulty(value as typeof filterDifficulty)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="mb-4">
                <Label htmlFor="duration-filter">Max Duration (weeks)</Label>
                <Slider
                  id="duration-filter"
                  min={0}
                  max={12}
                  step={1}
                  value={[filterDuration]}
                  onValueChange={(value) => setFilterDuration(value[0])}
                />
                <p className="text-sm text-muted-foreground mt-1">{filterDuration === 0 ? 'Any duration' : `${filterDuration} weeks or less`}</p>
              </div>
              <ScrollArea className="h-[400px]">
                {filteredPrograms.map((program) => (
                  <Card key={program.id} className="mb-4 cursor-pointer" onClick={() => handleProgramClick(program)}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center">
                          {renderProgramIcon(program.type)}
                          <span className="ml-2">{program.title}</span>
                        </CardTitle>
                        <Badge>{program.difficulty}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-2">{program.description}</p>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          <span className="text-sm">{program.duration} weeks</span>
                        </div>
                        <div className="flex items-center">
                          <Award className="h-4 w-4 mr-1" />
                          <span className="text-sm">{program.rewards} Wellth Points</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          <span className="text-sm">{program.participants} participants</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dashboard">
          <Card>
            <CardHeader>
              <CardTitle>My Wellness Programs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Active Programs</h3>
                  <Card>
                    <CardHeader>
                      <CardTitle>Step Challenge</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-2">Increase your daily steps</p>
                      <Progress value={60} className="mb-2" />
                      <p className="text-sm text-muted-foreground">60% complete - 2 weeks remaining</p>
                      <div className="mt-4">
                        <h4 className="font-semibold mb-2">Today's Goal</h4>
                        <p>10,000 steps</p>
                        <Progress value={80} className="mt-2" />
                        <p className="text-sm text-muted-foreground mt-1">8,000 / 10,000 steps</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Completed Programs</h3>
                  <Card>
                    <CardHeader>
                      <CardTitle>Mindful Eating</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-2">Learned to eat mindfully</p>
                      <Badge>Completed</Badge>
                      <p className="mt-2">Wellth Points Earned: 750</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="challenges">
          <Card>
            <CardHeader>
              <CardTitle>Group Challenges</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                {challenges.map((challenge) => (
                  <Card key={challenge.id} className="mb-4">
                    <CardHeader>
                      <CardTitle>{challenge.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-2">{challenge.description}</p>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          <span className="text-sm">{challenge.participants} participants</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          <span className="text-sm">{challenge.duration} days</span>
                        </div>
                        <div className="flex items-center">
                          <Award className="h-4 w-4 mr-1" />
                          <span className="text-sm">{challenge.reward} Wellth Points</span>
                        </div>
                      </div>
                      <Button className="w-full mt-4">Join Challenge</Button>
                    </CardContent>
                  </Card>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rewards">
          <Card>
            <CardHeader>
              <CardTitle>Rewards</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <h3 className="text-lg font-semibold">Your Wellth Points</h3>
                <p className="text-3xl font-bold">2,500</p>
              </div>
              <h3 className="text-lg font-semibold mb-2">Available Rewards</h3>
              <ScrollArea className="h-[400px]">
                <Card className="mb-4">
                  <CardHeader>
                    <CardTitle>$10 Health Store Voucher</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-2">Redeem for a $10 voucher at our health store</p>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Gift className="h-4 w-4 mr-1" />
                        <span className="text-sm">1,000 Wellth Points</span>
                      </div>
                      <Button>Redeem</Button>
                    </div>
                  </CardContent>
                </Card>
                <Card className="mb-4">
                  <CardHeader>
                    <CardTitle>30-Day Gym Pass</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-mute d-foreground mb-2">Get a 30-day pass to a local gym</p>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Gift className="h-4 w-4 mr-1" />
                        <span className="text-sm">2,500 Wellth Points</span>
                      </div>
                      <Button>Redeem</Button>
                    </div>
                  </CardContent>
                </Card>
                <Card className="mb-4">
                  <CardHeader>
                    <CardTitle>Wellness Consultation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-2">One-on-one wellness consultation with a health coach</p>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Gift className="h-4 w-4 mr-1" />
                        <span className="text-sm">3,000 Wellth Points</span>
                      </div>
                      <Button>Redeem</Button>
                    </div>
                  </CardContent>
                </Card>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isJoinModalOpen} onOpenChange={setIsJoinModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Join {selectedProgram?.title}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <p>{selectedProgram?.description}</p>
            <div>
              <Label htmlFor="program-duration" className="mb-2 block">Duration</Label>
              <p id="program-duration">{selectedProgram?.duration} weeks</p>
            </div>
            <div>
              <Label htmlFor="program-difficulty" className="mb-2 block">Difficulty</Label>
              <p id="program-difficulty">{selectedProgram?.difficulty}</p>
            </div>
            <div>
              <Label htmlFor="program-rewards" className="mb-2 block">Rewards</Label>
              <p id="program-rewards">{selectedProgram?.rewards} Wellth Points</p>
            </div>
            <div>
              <Label htmlFor="daily-reminder" className="mb-2 block">Set Daily Reminder</Label>
              <div className="flex items-center space-x-2">
                <Switch id="daily-reminder" />
                <Label htmlFor="daily-reminder">Receive daily reminders</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleJoinProgram}>Join Program</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}