"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { CreditCard, DollarSign, FileText, Calendar as CalendarIcon, Bell, Download } from 'lucide-react'

type Payment = {
  id: string
  serviceName: string
  amount: number
  dueDate: string
  status: 'Pending' | 'Paid'
  type: 'Service' | 'Loan'
}

export default function MakePaymentScreen() {
  const [activeTab, setActiveTab] = useState<'pending' | 'history' | 'reminders'>('pending')
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'bank_transfer' | 'insurance' | 'wellth_points'>('credit_card')
  const [reminderDays, setReminderDays] = useState(3)
  const [notificationMethod, setNotificationMethod] = useState<'email' | 'in_app'>('email')

  const pendingPayments: Payment[] = [
    { id: '1', serviceName: 'Telehealth Consultation with Dr. Smith', amount: 50, dueDate: '2023-05-25', status: 'Pending', type: 'Service' },
    { id: '2', serviceName: 'Healthcare Loan Installment', amount: 250, dueDate: '2023-06-01', status: 'Pending', type: 'Loan' },
    { id: '3', serviceName: 'Fitness Program Subscription', amount: 30, dueDate: '2023-05-30', status: 'Pending', type: 'Service' },
  ]

  const paymentHistory: Payment[] = [
    { id: '4', serviceName: 'Dental Cleaning', amount: 75, dueDate: '2023-05-10', status: 'Paid', type: 'Service' },
    { id: '5', serviceName: 'Healthcare Loan Installment', amount: 250, dueDate: '2023-05-01', status: 'Paid', type: 'Loan' },
  ]

  const handlePaymentClick = (payment: Payment) => {
    setSelectedPayment(payment)
    setIsPaymentModalOpen(true)
  }

  const handlePaymentSubmit = () => {
    setIsPaymentModalOpen(false)
    setIsConfirmationModalOpen(true)
  }

  const handleConfirmationClose = () => {
    setIsConfirmationModalOpen(false)
    setSelectedPayment(null)
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">Make Payment</h1>
      
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as typeof activeTab)}>
        <TabsList>
          <TabsTrigger value="pending">Pending Payments</TabsTrigger>
          <TabsTrigger value="history">Payment History</TabsTrigger>
          <TabsTrigger value="reminders">Payment Reminders</TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle>Pending Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>{payment.serviceName}</TableCell>
                      <TableCell>${payment.amount}</TableCell>
                      <TableCell>{payment.dueDate}</TableCell>
                      <TableCell>
                        <Button onClick={() => handlePaymentClick(payment)}>Pay Now</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paymentHistory.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>{payment.serviceName}</TableCell>
                      <TableCell>${payment.amount}</TableCell>
                      <TableCell>{payment.dueDate}</TableCell>
                      <TableCell>
                        <Badge variant={payment.status === 'Paid' ? 'default' : 'secondary'}>
                          {payment.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          <Download className="mr-2 h-4 w-4" />
                          Receipt
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reminders">
          <Card>
            <CardHeader>
              <CardTitle>Payment Reminders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="reminder-days">Remind me</Label>
                  <Select value={reminderDays.toString()} onValueChange={(value) => setReminderDays(parseInt(value))}>
                    <SelectTrigger id="reminder-days">
                      <SelectValue placeholder="Select days before due date" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 day before</SelectItem>
                      <SelectItem value="3">3 days before</SelectItem>
                      <SelectItem value="7">1 week before</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="notification-method"
                    checked={notificationMethod === 'email'}
                    onCheckedChange={(checked) => setNotificationMethod(checked ? 'email' : 'in_app')}
                  />
                  <Label htmlFor="notification-method">
                    {notificationMethod === 'email' ? 'Email notifications' : 'In-app notifications'}
                  </Label>
                </div>
                <Button>Save Reminder Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Make Payment</DialogTitle>
          </DialogHeader>
          {selectedPayment && (
            <div className="space-y-4">
              <div>
                <Label className="font-semibold">Service</Label>
                <p>{selectedPayment.serviceName}</p>
              </div>
              <div>
                <Label className="font-semibold">Amount Due</Label>
                <p>${selectedPayment.amount}</p>
              </div>
              <div>
                <Label className="font-semibold">Due Date</Label>
                <p>{selectedPayment.dueDate}</p>
              </div>
              <div>
                <Label className="font-semibold">Payment Method</Label>
                <Select value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as typeof paymentMethod)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="credit_card">Credit Card</SelectItem>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                    <SelectItem value="insurance">Insurance</SelectItem>
                    <SelectItem value="wellth_points">Wellth Points</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {paymentMethod === 'credit_card' && (
                <div className="space-y-2">
                  <Input placeholder="Card Number" />
                  <div className="flex space-x-2">
                    <Input placeholder="MM/YY" className="w-1/2" />
                    <Input placeholder="CVC" className="w-1/2" />
                  </div>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <Checkbox id="save-payment-method" />
                <Label htmlFor="save-payment-method">Save payment method for future transactions</Label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={handlePaymentSubmit}>Submit Payment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isConfirmationModalOpen} onOpenChange={handleConfirmationClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Payment Confirmation</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-center text-green-600 font-semibold">Your payment was successful!</p>
            {selectedPayment && (
              <>
                <div>
                  <Label className="font-semibold">Amount Paid</Label>
                  <p>${selectedPayment.amount}</p>
                </div>
                <div>
                  <Label className="font-semibold">Transaction ID</Label>
                  <p>{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                </div>
              </>
            )}
            <Button className="w-full" onClick={handleConfirmationClose}>
              <Download className="mr-2 h-4 w-4" />
              Download Receipt
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}