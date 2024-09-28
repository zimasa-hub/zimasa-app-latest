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
import { Search, MessageSquare, ThumbsUp, Flag, Bell, Plus, ArrowRight, Users } from 'lucide-react'

type ForumCategory = {
  id: string
  name: string
  description: string
  threads: number
  members: number
}

type ForumThread = {
  id: string
  title: string
  author: string
  date: string
  replies: number
  likes: number
  tags: string[]
}

type ForumPost = {
  id: string
  author: string
  content: string
  date: string
  likes: number
  replies: ForumPost[]
}

export default function JoinCommunityForumsScreen() {
  const [activeTab, setActiveTab] = useState<'directory' | 'myForums' | 'notifications'>('directory')
  const [selectedCategory, setSelectedCategory] = useState<ForumCategory | null>(null)
  const [selectedThread, setSelectedThread] = useState<ForumThread | null>(null)
  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false)
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const forumCategories: ForumCategory[] = [
    { id: '1', name: 'Fitness', description: 'Discuss exercise routines, workout tips, and fitness goals', threads: 150, members: 5000 },
    { id: '2', name: 'Nutrition', description: 'Share healthy recipes, diet plans, and nutritional advice', threads: 200, members: 7500 },
    { id: '3', name: 'Mental Health', description: 'Support and discussions about mental wellness and self-care', threads: 180, members: 6000 },
    { id: '4', name: 'Chronic Conditions', description: 'Connect with others managing long-term health conditions', threads: 120, members: 4000 },
  ]

  const forumThreads: ForumThread[] = [
    { id: '1', title: 'Best exercises for lower back pain', author: 'FitnessGuru', date: '2023-05-15', replies: 25, likes: 42, tags: ['Fitness', 'Pain Management'] },
    { id: '2', title: 'Meal prep ideas for busy professionals', author: 'HealthyEater', date: '2023-05-14', replies: 18, likes: 36, tags: ['Nutrition', 'Meal Planning'] },
    { id: '3', title: 'Coping strategies for anxiety', author: 'MindfulLiving', date: '2023-05-13', replies: 30, likes: 55, tags: ['Mental Health', 'Anxiety'] },
  ]

  const forumPosts: ForumPost[] = [
    {
      id: '1',
      author: 'FitnessGuru',
      content: "Lower back pain can be challenging, but there are several exercises that can help. Here are some of my favorites:\n\n1. Cat-Cow Stretch\n2. Bird Dog\n3. Pelvic Tilts\n4. Bridges\n5. Partial Crunches\n\nRemember to start slowly and consult with a physical therapist if you have severe pain.",
      date: '2023-05-15',
      likes: 42,
      replies: [
        {
          id: '2',
          author: 'BackPainSufferer',
          content: "Thank you for these suggestions! I've been struggling with lower back pain for months. How often should I do these exercises?",
          date: '2023-05-15',
          likes: 5,
          replies: []
        },
        {
          id: '3',
          author: 'FitnessGuru',
          content: "Great question! Start with 2-3 times a week, doing each exercise for 30 seconds to 1 minute. As you get stronger, you can increase the frequency and duration. Always listen to your body and stop if you feel any pain.",
          date: '2023-05-16',
          likes: 8,
          replies: []
        }
      ]
    }
  ]

  const handleCategoryClick = (category: ForumCategory) => {
    setSelectedCategory(category)
    setSelectedThread(null)
  }

  const handleThreadClick = (thread: ForumThread) => {
    setSelectedThread(thread)
  }

  const handleNewPost = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Handle new post submission logic here
    setIsNewPostModalOpen(false)
  }

  const handleReportSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Handle report submission logic here
    setIsReportModalOpen(false)
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">Community Forums</h1>
      
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as typeof activeTab)}>
        <TabsList>
          <TabsTrigger value="directory">Forum Directory</TabsTrigger>
          <TabsTrigger value="myForums">My Forums</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="directory">
          <Card>
            <CardHeader>
              <CardTitle>Forum Directory</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-4 mb-4">
                <div className="flex-1">
                  <Label htmlFor="search-forums" className="sr-only">Search forums</Label>
                  <Input
                    id="search-forums"
                    placeholder="Search forums..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                <Button>
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
              </div>
              <ScrollArea className="h-[600px]">
                {selectedCategory ? (
                  <div>
                    <Button variant="link" onClick={() => setSelectedCategory(null)} className="mb-4">
                      <ArrowRight className="w-4 h-4 mr-2" />
                      Back to Categories
                    </Button>
                    <h2 className="text-xl font-semibold mb-4">{selectedCategory.name} Threads</h2>
                    {selectedThread ? (
                      <div>
                        <Button variant="link" onClick={() => setSelectedThread(null)} className="mb-4">
                          <ArrowRight className="w-4 h-4 mr-2" />
                          Back to Threads
                        </Button>
                        <Card>
                          <CardHeader>
                            <CardTitle>{selectedThread.title}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            {forumPosts.map((post) => (
                              <div key={post.id} className="mb-4 pb-4 border-b">
                                <div className="flex items-center mb-2">
                                  <Avatar className="w-8 h-8 mr-2">
                                    <AvatarFallback>{post.author[0]}</AvatarFallback>
                                  </Avatar>
                                  <span className="font-semibold">{post.author}</span>
                                  <span className="text-muted-foreground ml-2">{post.date}</span>
                                </div>
                                <p className="mb-2">{post.content}</p>
                                <div className="flex items-center space-x-4">
                                  <Button variant="outline" size="sm">
                                    <ThumbsUp className="w-4 h-4 mr-2" />
                                    Like ({post.likes})
                                  </Button>
                                  <Button variant="outline" size="sm">
                                    <MessageSquare className="w-4 h-4 mr-2" />
                                    Reply
                                  </Button>
                                  <Button variant="outline" size="sm" onClick={() => setIsReportModalOpen(true)}>
                                    <Flag className="w-4 h-4 mr-2" />
                                    Report
                                  </Button>
                                </div>
                                {post.replies.map((reply) => (
                                  <div key={reply.id} className="ml-8 mt-4">
                                    <div className="flex items-center mb-2">
                                      <Avatar className="w-6 h-6 mr-2">
                                        <AvatarFallback>{reply.author[0]}</AvatarFallback>
                                      </Avatar>
                                      <span className="font-semibold">{reply.author}</span>
                                      <span className="text-muted-foreground ml-2">{reply.date}</span>
                                    </div>
                                    <p className="mb-2">{reply.content}</p>
                                    <div className="flex items-center space-x-4">
                                      <Button variant="outline" size="sm">
                                        <ThumbsUp className="w-4 h-4 mr-2" />
                                        Like ({reply.likes})
                                      </Button>
                                      <Button variant="outline" size="sm">
                                        <MessageSquare className="w-4 h-4 mr-2" />
                                        Reply
                                      </Button>
                                      <Button variant="outline" size="sm" onClick={() => setIsReportModalOpen(true)}>
                                        <Flag className="w-4 h-4 mr-2" />
                                        Report
                                      </Button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ))}
                          </CardContent>
                        </Card>
                      </div>
                    ) : (
                      forumThreads.map((thread) => (
                        <Card key={thread.id} className="mb-4 cursor-pointer" onClick={() => handleThreadClick(thread)}>
                          <CardHeader>
                            <CardTitle>{thread.title}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="text-sm text-muted-foreground">By {thread.author} on {thread.date}</p>
                                <div className="flex space-x-2 mt-2">
                                  {thread.tags.map((tag) => (
                                    <Badge key={tag} variant="secondary">{tag}</Badge>
                                  ))}
                                </div>
                              </div>
                              <div className="flex items-center space-x-4">
                                <div className="flex items-center">
                                  <MessageSquare className="w-4 h-4 mr-1" />
                                  <span className="text-sm">{thread.replies}</span>
                                </div>
                                <div className="flex items-center">
                                  <ThumbsUp className="w-4 h-4 mr-1" />
                                  <span className="text-sm">{thread.likes}</span>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                    <Button onClick={() => setIsNewPostModalOpen(true)} className="mt-4">
                      <Plus className="w-4 h-4 mr-2" />
                      Create New Post
                    </Button>
                  </div>
                ) : (
                  forumCategories.map((category) => (
                    <Card key={category.id} className="mb-4 cursor-pointer" onClick={() => handleCategoryClick(category)}>
                      <CardHeader>
                        <CardTitle>{category.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground mb-2">{category.description}</p>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <MessageSquare className="w-4 h-4 mr-1" />
                            <span className="text-sm">{category.threads} threads</span>
                          </div>
                          <div className="flex items-center">
                            <Users className="w-4 h-4 mr-1" />
                            <span className="text-sm">{category.members} members</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="myForums">
          <Card>
            <CardHeader>
              <CardTitle>My Forums</CardTitle>
            </CardHeader>
            <CardContent>
              <h2 className="text-xl font-semibold mb-4">Followed Forums</h2>
              <ScrollArea className="h-[400px]">
                {forumCategories.slice(0, 2).map((category) => (
                  <Card key={category.id} className="mb-4">
                    <CardHeader>
                      <CardTitle>{category.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-2">{category.description}</p>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <MessageSquare className="w-4 h-4 mr-1" />
                          <span className="text-sm">{category.threads} threads</span>
                        </div>
                        <Button variant="outline" size="sm">Unfollow</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Forum Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center space-x-4 mb-4 pb-4 border-b last:border-b-0">
                    <Bell className="w-6 h-6 text-blue-500" />
                    <div>
                      <p className="font-semibold">New reply to your post in "Fitness Tips"</p>
                      <p className="text-sm text-muted-foreground">2 hours ago</p>
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isNewPostModalOpen} onOpenChange={setIsNewPostModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Post</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleNewPost}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="post-title" className="text-right">
                  Title
                </Label>
                <Input id="post-title" className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="post-content" className="text-right">
                  Content
                </Label>
                <Textarea id="post-content" className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="post-tags" className="text-right">
                  Tags
                </Label>
                <Input id="post-tags" className="col-span-3" placeholder="Separate tags with commas" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Post</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isReportModalOpen} onOpenChange={setIsReportModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Report Content</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleReportSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="report-reason" className="text-right">
                  Reason
                </Label>
                <Select required>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a reason" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="spam">Spam</SelectItem>
                    <SelectItem value="offensive">Offensive Content</SelectItem>
                    <SelectItem value="misinformation">Misinformation</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="report-details" className="text-right">
                  Details
                </Label>
                <Textarea id="report-details" className="col-span-3" placeholder="Provide additional details" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Submit Report</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}