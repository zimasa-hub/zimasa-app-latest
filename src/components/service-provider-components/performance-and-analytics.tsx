import {FileText, DollarSign, BarChart } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card"
import { Button } from "../ui/button"
import { Progress } from "../ui/progress"
import { useState } from "react"
import DetailedAnalytics from "../detailed-analytics"



const PerformanceandAnalytics = () => {

    const [showDetailedAnalytics, setShowDetailedAnalytics] = useState(false)
    if (showDetailedAnalytics) {
        return <DetailedAnalytics onClose={() => setShowDetailedAnalytics(false)} />
      }

    return(
        <>
         {/* Performance and Analytics */}
      <Card>
        <CardHeader>
          <CardTitle>Performance and Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <h3 className="font-semibold mb-2">Bookings Summary</h3>
              <p>Medical Consultations: 20</p>
              <p>Wellness Sessions: 15</p>
              <p>Fitness Training: 10</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Client Feedback</h3>
              <p>Average Rating: 4.8/5</p>
              <Progress value={96} className="mt-2" />
            </div>
            <div>
              <h3 className="font-semibold mb-2">Revenue Overview</h3>
              <p>Total Revenue: $5,000</p>
              <p>Wellth Points Redeemed: 1,000</p>
            </div>
          </div>
          <Button className="w-full mt-4" onClick={() => setShowDetailedAnalytics(true)}>
            <BarChart className="mr-2 h-4 w-4" /> View Detailed Analytics
          </Button>
        </CardContent>
      </Card>
        </>

    )
}