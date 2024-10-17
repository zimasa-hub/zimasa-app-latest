import {FileText, DollarSign } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card"
import { Button } from "../ui/button"

const BillingandPayments = () => {


    return(
  <>
    {/* Billing and Payments */}
    <Card>
        <CardHeader>
          <CardTitle>Billing and Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="font-semibold mb-2">Payment Overview</h3>
              <p>Total Payments Received: $1,500</p>
              <p>Pending Payments: $500</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Recent Invoices</h3>
              <ul className="space-y-2">
                <li className="flex items-center justify-between">
                  <span>John Doe - Medical Consultation</span>
                  <Badge variant="secondary">$100</Badge>
                </li>
                <li className="flex items-center justify-between">
                  <span>Jane Smith - Wellness Session</span>
                  <Badge variant="secondary">$150</Badge>
                </li>
              </ul>
            </div>
          </div>
          <div className="flex justify-between mt-4">
            <Button variant="outline">
              <FileText className="mr-2 h-4 w-4" /> Generate Invoice
            </Button>
            <Button variant="outline">
              <DollarSign className="mr-2 h-4 w-4" /> Process Refund
            </Button>
          </div>
        </CardContent>
      </Card>

  </>
    )
}

export default BillingandPayments;