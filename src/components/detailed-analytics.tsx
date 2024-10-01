"'use client'"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Download, TrendingUp, TrendingDown, DollarSign, Users, Star, Calendar, BarChart } from "lucide-react"

interface DetailedAnalyticsComponentProps {
  onClose: () => void; // Define the type of the onClose prop as a function with no arguments and no return value
}

export default function DetailedAnalyticsComponent({ onClose }: DetailedAnalyticsComponentProps) {
  const [timeFilter, setTimeFilter] = useState("'weekly'")

  const mockData = {
    serviceUsage: [
      { name: "'Medical Consultation'", bookings: 50 },
      { name: "'Wellness Session'", bookings: 30 },
      { name: "'Fitness Training'", bookings: 20 },
    ],
    financialPerformance: {
      totalRevenue: 5000,
      pendingPayments: 500,
      revenueByService: [
        { name: "'Medical Consultation'", revenue: 3000 },
        { name: "'Wellness Session'", revenue: 1500 },
        { name: "'Fitness Training'", revenue: 500 },
      ],
    },
    clientDemographics: {
      ageGroups: [
        { group: "'18-30'", percentage: 30 },
        { group: "'31-50'", percentage: 50 },
        { group: "'51+'", percentage: 20 },
      ],
      genderDistribution: { male: 45, female: 55 },
    },
    clientSatisfaction: {
      averageScore: 4.5,
      totalReviews: 100,
      recentReviews: [
        { client: "'John D.'", rating: 5, comment: "'Excellent service!'" },
        { client: "'Jane S.'", rating: 4, comment: "'Very helpful session.'" },
      ],
    },
    serviceCapacity: {
      bookedSlots: 80,
      totalSlots: 100,
    },
    historicalPerformance: {
      currentPeriod: { bookings: 100, revenue: 5000 },
      previousPeriod: { bookings: 90, revenue: 4500 },
    },
  }

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center">
          <Button variant="ghost" onClick={onClose} className="mr-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <CardTitle>Detailed Analytics</CardTitle>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={timeFilter} onValueChange={setTimeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" /> Export Report
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="serviceUsage" className="space-y-4">
          <TabsList>
            <TabsTrigger value="serviceUsage">Service Usage</TabsTrigger>
            <TabsTrigger value="financialPerformance">Financial Performance</TabsTrigger>
            <TabsTrigger value="clientDemographics">Client Demographics</TabsTrigger>
            <TabsTrigger value="clientSatisfaction">Client Satisfaction</TabsTrigger>
            <TabsTrigger value="serviceCapacity">Service Capacity</TabsTrigger>
            <TabsTrigger value="historicalPerformance">Historical Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="serviceUsage">
            <Card>
              <CardHeader>
                <CardTitle>Service Usage Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockData.serviceUsage.map((service, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span>{service.name}</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={service.bookings} max={100} className="w-[200px]" />
                        <span>{service.bookings} bookings</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="financialPerformance">
            <Card>
              <CardHeader>
                <CardTitle>Financial Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-lg font-semibold">Total Revenue</h3>
                    <p className="text-2xl font-bold">${mockData.financialPerformance.totalRevenue}</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Pending Payments</h3>
                    <p className="text-2xl font-bold">${mockData.financialPerformance.pendingPayments}</p>
                  </div>
                </div>
                <h3 className="text-lg font-semibold mt-4 mb-2">Revenue by Service</h3>
                <div className="space-y-2">
                  {mockData.financialPerformance.revenueByService.map((service, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span>{service.name}</span>
                      <span>${service.revenue}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="clientDemographics">
            <Card>
              <CardHeader>
                <CardTitle>Client Demographics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Age Distribution</h3>
                    <div className="space-y-2">
                      {mockData.clientDemographics.ageGroups.map((group, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span>{group.group}</span>
                          <div className="flex items-center space-x-2">
                            <Progress value={group.percentage} max={100} className="w-[200px]" />
                            <span>{group.percentage}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Gender Distribution</h3>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span>Male: {mockData.clientDemographics.genderDistribution.male}%</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
                        <span>Female: {mockData.clientDemographics.genderDistribution.female}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="clientSatisfaction">
            <Card>
              <CardHeader>
                <CardTitle>Client Satisfaction</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold">Average Satisfaction Score</h3>
                    <div className="flex items-center space-x-2">
                      <Star className="h-6 w-6 text-yellow-400 fill-current" />
                      <span className="text-2xl font-bold">{mockData.clientSatisfaction.averageScore}/5</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Total Reviews</h3>
                    <p className="text-2xl font-bold">{mockData.clientSatisfaction.totalReviews}</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Recent Reviews</h3>
                    <ul className="space-y-2">
                      {mockData.clientSatisfaction.recentReviews.map((review, index) => (
                        <li key={index} className="border-b pb-2">
                          <div className="flex items-center justify-between">
                            <span>{review.client}</span>
                            <Badge>{review.rating}/5</Badge>
                          </div>
                          <p className="text-sm text-gray-600">{review.comment}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="serviceCapacity">
            <Card>
              <CardHeader>
                <CardTitle>Service Capacity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Capacity Utilization</h3>
                    <div className="flex items-center space-x-4">
                      <Progress
                        value={(mockData.serviceCapacity.bookedSlots / mockData.serviceCapacity.totalSlots) * 100}
                        max={100}
                        className="w-[300px]"
                      />
                      <span>
                        {mockData.serviceCapacity.bookedSlots}/{mockData.serviceCapacity.totalSlots} slots booked
                      </span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Utilization Rate</h3>
                    <p className="text-2xl font-bold">
                      {((mockData.serviceCapacity.bookedSlots / mockData.serviceCapacity.totalSlots) * 100).toFixed(2)}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="historicalPerformance">
            <Card>
              <CardHeader>
                <CardTitle>Historical Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Bookings</h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold">{mockData.historicalPerformance.currentPeriod.bookings}</span>
                      <Badge variant={mockData.historicalPerformance.currentPeriod.bookings > mockData.historicalPerformance.previousPeriod.bookings ? "success" : "destructive"}>
                        {mockData.historicalPerformance.currentPeriod.bookings > mockData.historicalPerformance.previousPeriod.bookings ? (
                          <TrendingUp className="h-4 w-4" />
                        ) : (
                          <TrendingDown className="h-4 w-4" />
                        )}
                        {(((mockData.historicalPerformance.currentPeriod.bookings - mockData.historicalPerformance.previousPeriod.bookings) / mockData.historicalPerformance.previousPeriod.bookings) * 100).toFixed(2)}%
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">vs {mockData.historicalPerformance.previousPeriod.bookings} last period</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Revenue</h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold">${mockData.historicalPerformance.currentPeriod.revenue}</span>
                      <Badge variant={mockData.historicalPerformance.currentPeriod.revenue > mockData.historicalPerformance.previousPeriod.revenue ? "success" : "destructive"}>
                        {mockData.historicalPerformance.currentPeriod.revenue > mockData.historicalPerformance.previousPeriod.revenue ? (
                          <TrendingUp className="h-4 w-4" />
                        ) : (
                          <TrendingDown className="h-4 w-4" />
                        )}
                        {(((mockData.historicalPerformance.currentPeriod.revenue - mockData.historicalPerformance.previousPeriod.revenue) / mockData.historicalPerformance.previousPeriod.revenue) * 100).toFixed(2)}%
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">vs ${mockData.historicalPerformance.previousPeriod.revenue} last period</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-6 p-4 bg-neutral-100 rounded-lg dark:bg-neutral-800">
          <h3 className="text-lg font-semibold mb-2">Insights</h3>
          <ul className="space-y-2">
            <li className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span>Your Medical Consultation service has seen a 15% increase in bookings this week.</span>
            </li>
            <li className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-blue-500" />
              <span>Client demographics show a growing trend in the 31-50 age group.</span>
            </li>
            <li className="flex items-center space-x-2">
              <Star className="h-4 w-4 text-yellow-500" />
              <span>Your average satisfaction score has improved from 4.3 to 4.5 in the last month.</span>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}