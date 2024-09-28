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
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { DollarSign, Calendar, Upload, CheckCircle, XCircle, AlertCircle, Clock, ArrowRight } from 'lucide-react'

type LoanProvider = {
  id: string
  name: string
  minAmount: number
  maxAmount: number
  interestRate: number
  repaymentTerms: number[]
  eligibilityRequirements: string[]
}

type LoanApplication = {
  id: string
  providerId: string
  amount: number
  purpose: string
  repaymentTerm: number
  status: 'Pending' | 'Under Review' | 'Approved' | 'Rejected'
  submissionDate: string
}

type Loan = {
  id: string
  amount: number
  provider: string
  interestRate: number
  repaymentTerm: number
  startDate: string
  nextPaymentDate: string
  nextPaymentAmount: number
  remainingBalance: number
  status: 'Active' | 'Completed' | 'Defaulted'
}

export default function ApplyForHealthcareLoanScreen() {
  const [activeTab, setActiveTab] = useState<'options' | 'application' | 'dashboard' | 'history'>('options')
  const [selectedProvider, setSelectedProvider] = useState<LoanProvider | null>(null)
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false)
  const [selectedProviders, setSelectedProviders] = useState<string[]>([])
  const [loanAmount, setLoanAmount] = useState(1000)
  const [loanPurpose, setLoanPurpose] = useState('')
  const [repaymentTerm, setRepaymentTerm] = useState(6)
  const [isDocumentUploadModalOpen, setIsDocumentUploadModalOpen] = useState(false)
  const [uploadedDocuments, setUploadedDocuments] = useState<string[]>([])
  const [currentApplication, setCurrentApplication] = useState<LoanApplication | null>(null)
  const [activeLoan, setActiveLoan] = useState<Loan | null>(null)

  const loanProviders: LoanProvider[] = [
    { id: '1', name: 'HealthCare Finance', minAmount: 500, maxAmount: 10000, interestRate: 5.5, repaymentTerms: [6, 12, 24], eligibilityRequirements: ['Minimum income of $2000/month', 'Credit score above 650'] },
    { id: '2', name: 'MedLoan Express', minAmount: 1000, maxAmount: 15000, interestRate: 6.0, repaymentTerms: [12, 24, 36], eligibilityRequirements: ['Minimum income of $2500/month', 'No active bankruptcies'] },
    { id: '3', name: 'WellnessCare Credit', minAmount: 250, maxAmount: 5000, interestRate: 4.5, repaymentTerms: [3, 6, 12], eligibilityRequirements: ['Minimum income of $1500/month', 'Employed for at least 6 months'] },
  ]

  const handleProviderSelect = (provider: LoanProvider) => {
    setSelectedProvider(provider)
    setActiveTab('application')
  }

  const handleCompareToggle = (providerId: string) => {
    setSelectedProviders(prev => 
      prev.includes(providerId) 
        ? prev.filter(id => id !== providerId)
        : [...prev, providerId]
    )
  }

  const handleDocumentUpload = (documentType: string) => {
    // Simulating document upload
    setUploadedDocuments(prev => [...prev, documentType])
  }

  const handleApplicationSubmit = () => {
    if (selectedProvider) {
      const newApplication: LoanApplication = {
        id: Math.random().toString(36).substr(2, 9),
        providerId: selectedProvider.id,
        amount: loanAmount,
        purpose: loanPurpose,
        repaymentTerm: repaymentTerm,
        status: 'Pending',
        submissionDate: new Date().toISOString(),
      }
      setCurrentApplication(newApplication)
      setActiveTab('dashboard')
    }
  }

  const simulatePayment = () => {
    if (activeLoan) {
      const updatedLoan = {
        ...activeLoan,
        remainingBalance: Math.max(0, activeLoan.remainingBalance - activeLoan.nextPaymentAmount),
        nextPaymentDate: new Date(new Date(activeLoan.nextPaymentDate).getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      }
      setActiveLoan(updatedLoan)
    }
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">Apply for Healthcare Loan</h1>
      
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as typeof activeTab)}>
        <TabsList>
          <TabsTrigger value="options">Loan Options</TabsTrigger>
          <TabsTrigger value="application">Application</TabsTrigger>
          <TabsTrigger value="dashboard">Loan Dashboard</TabsTrigger>
          <TabsTrigger value="history">Loan History</TabsTrigger>
        </TabsList>

        <TabsContent value="options">
          <Card>
            <CardHeader>
              <CardTitle>Healthcare Loan Options</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loanProviders.map((provider) => (
                  <Card key={provider.id}>
                    <CardHeader>
                      <CardTitle className="flex justify-between items-center">
                        <span>{provider.name}</span>
                        <Checkbox
                          checked={selectedProviders.includes(provider.id)}
                          onCheckedChange={() => handleCompareToggle(provider.id)}
                        />
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p>Loan Amount: ${provider.minAmount} - ${provider.maxAmount}</p>
                        <p>Interest Rate: {provider.interestRate}%</p>
                        <p>Repayment Terms: {provider.repaymentTerms.join(', ')} months</p>
                        <div>
                          <p className="font-semibold">Eligibility Requirements:</p>
                          <ul className="list-disc list-inside">
                            {provider.eligibilityRequirements.map((req, index) => (
                              <li key={index}>{req}</li>
                            ))}
                          </ul>
                        </div>
                        <Button onClick={() => handleProviderSelect(provider)}>Apply Now</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="mt-4 flex justify-between">
                <Button onClick={() => setIsCompareModalOpen(true)} disabled={selectedProviders.length < 2}>
                  Compare Selected
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="application">
          <Card>
            <CardHeader>
              <CardTitle>Loan Application</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedProvider && (
                <form onSubmit={(e) => { e.preventDefault(); setIsDocumentUploadModalOpen(true); }} className="space-y-4">
                  <div>
                    <Label htmlFor="loan-amount">Loan Amount</Label>
                    <Slider
                      id="loan-amount"
                      min={selectedProvider.minAmount}
                      max={selectedProvider.maxAmount}
                      step={100}
                      value={[loanAmount]}
                      onValueChange={(value) => setLoanAmount(value[0])}
                    />
                    <p className="text-sm text-muted-foreground mt-1">${loanAmount}</p>
                  </div>
                  <div>
                    <Label htmlFor="loan-purpose">Loan Purpose</Label>
                    <Select value={loanPurpose} onValueChange={setLoanPurpose}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select loan purpose" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="medical-procedure">Medical Procedure</SelectItem>
                        <SelectItem value="ongoing-treatment">Ongoing Treatment</SelectItem>
                        <SelectItem value="wellness-services">Wellness Services</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="repayment-term">Repayment Term</Label>
                    <Select value={repaymentTerm.toString()} onValueChange={(value) => setRepaymentTerm(parseInt(value))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select repayment term" />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedProvider.repaymentTerms.map((term) => (
                          <SelectItem key={term} value={term.toString()}>{term} months</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="full-name">Full Name</Label>
                    <Input id="full-name" placeholder="John Doe" required />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="john@example.com" required />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" placeholder="+1 (555) 123-4567" required />
                  </div>
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Textarea id="address" placeholder="123 Main St, City, State, ZIP" required />
                  </div>
                  <div>
                    <Label htmlFor="employer">Employer Name</Label>
                    <Input id="employer" placeholder="Company Inc." required />
                  </div>
                  <div>
                    <Label htmlFor="job-title">Job Title</Label>
                    <Input id="job-title" placeholder="Software Engineer" required />
                  </div>
                  <div>
                    <Label htmlFor="monthly-income">Monthly Income</Label>
                    <Input id="monthly-income" type="number" placeholder="5000" required />
                  </div>
                  <Button type="submit">Next: Upload Documents</Button>
                </form>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dashboard">
          <Card>
            <CardHeader>
              <CardTitle>Loan Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              {currentApplication && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Current Application</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="font-semibold">Status</p>
                      <Badge variant={currentApplication.status === 'Approved' ? 'default' : 'secondary'}>
                        {currentApplication.status}
                      </Badge>
                    </div>
                    <div>
                      <p className="font-semibold">Submission Date</p>
                      <p>{new Date(currentApplication.submissionDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Loan Amount</p>
                      <p>${currentApplication.amount}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Repayment Term</p>
                      <p>{currentApplication.repaymentTerm} months</p>
                    </div>
                  </div>
                </div>
              )}
              {activeLoan && (
                <div className="space-y-4 mt-8">
                  <h2 className="text-xl font-semibold">Active Loan</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="font-semibold">Loan Amount</p>
                      <p>${activeLoan.amount}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Provider</p>
                      <p>{activeLoan.provider}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Interest Rate</p>
                      <p>{activeLoan.interestRate}%</p>
                    </div>
                    <div>
                      <p className="font-semibold">Repayment Term</p>
                      <p>{activeLoan.repaymentTerm} months</p>
                    </div>
                    <div>
                      <p className="font-semibold">Start Date</p>
                      <p>{new Date(activeLoan.startDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Next Payment Date</p>
                      <p>{new Date(activeLoan.nextPaymentDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Next Payment Amount</p>
                      <p>${activeLoan.nextPaymentAmount}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Remaining Balance</p>
                      <p>${activeLoan.remainingBalance}</p>
                    </div>
                  </div>
                  <Progress value={(activeLoan.amount - activeLoan.remainingBalance) / activeLoan.amount * 100} className="w-full" />
                  <Button onClick={simulatePayment}>Make Payment</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Loan History</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Loan ID</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Provider</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>LOAN-001</TableCell>
                    <TableCell>$5,000</TableCell>
                    <TableCell>HealthCare Finance</TableCell>
                    <TableCell>01/15/2023</TableCell>
                    <TableCell>
                      <Badge>Completed</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">View Details</Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>LOAN-002</TableCell>
                    <TableCell>$2,500</TableCell>
                    <TableCell>MedLoan Express</TableCell>
                    <TableCell>06/01/2023</TableCell>
                    <TableCell>
                      <Badge variant="secondary">Active</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">View Details</Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isCompareModalOpen} onOpenChange={setIsCompareModalOpen}>
        <DialogContent className="sm:max-w-[900px]">
          <DialogHeader>
            <DialogTitle>Compare Loan Providers</DialogTitle>
          </DialogHeader>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Provider</TableHead>
                <TableHead>Loan Amount</TableHead>
                <TableHead>Interest Rate</TableHead>
                <TableHead>Repayment Terms</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loanProviders.filter(provider => selectedProviders.includes(provider.id)).map((provider) => (
                <TableRow key={provider.id}>
                  <TableCell>{provider.name}</TableCell>
                  <TableCell>${provider.minAmount} - ${provider.maxAmount}</TableCell>
                  <TableCell>{provider.interestRate}%</TableCell>
                  <TableCell>{provider.repaymentTerms.join(', ')} months</TableCell>
                  <TableCell>
                    <Button onClick={() => { handleProviderSelect(provider); setIsCompareModalOpen(false); }}>
                      Select
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DialogContent>
      </Dialog>

      <Dialog open={isDocumentUploadModalOpen} onOpenChange={setIsDocumentUploadModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Required Documents</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Medical Bills/Invoices</span>
              {uploadedDocuments.includes('medical-bills') ? (
                <CheckCircle className="text-green-500" />
              ) : (
                <Button onClick={() => handleDocumentUpload('medical-bills')}>
                  <Upload className="mr-2 h-4 w-4" /> Upload
                </Button>
              )}
            </div>
            <div className="flex items-center justify-between">
              <span>Proof of Income</span>
              {uploadedDocuments.includes('proof-of-income') ? (
                <CheckCircle className="text-green-500" />
              ) : (
                <Button onClick={() => handleDocumentUpload('proof-of-income')}>
                  <Upload className="mr-2 h-4 w-4" /> Upload
                </Button>
              )}
            </div>
            <div className="flex items-center justify-between">
              <span>Proof of Identity</span>
              {uploadedDocuments.includes('proof-of-identity') ? (
                <CheckCircle className="text-green-500" />
              ) : (
                <Button onClick={() => handleDocumentUpload('proof-of-identity')}>
                  <Upload className="mr-2 h-4 w-4" /> Upload
                </Button>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleApplicationSubmit} disabled={uploadedDocuments.length < 3}>
              Submit Application
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}