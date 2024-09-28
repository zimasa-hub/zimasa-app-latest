//    {/* Dependent Management Section */}
//    <Card className='mb-4'>
//    <CardHeader>
//      <CardTitle>Dependent Management</CardTitle>
//    </CardHeader>
//    <CardContent>
//      <ul className="space-y-2">
//        <li className="flex justify-between items-center">
//          <div>
//            <span className="font-medium">Sarah (Child)</span>
//            <p className="text-sm text-muted-foreground">Next appointment: Dental Cleaning</p>
//          </div>
//          <Button size="sm">Manage</Button>
//        </li>
//        <li className="flex justify-between items-center">
//          <div>
//            <span className="font-medium">John (Spouse)</span>
//            <p className="text-sm text-muted-foreground">Access granted</p>
//          </div>
//          <Button size="sm">Manage</Button>
//        </li>
//      </ul>
//      <Button className="w-full mt-4" onClick={handleManageDependentsClick}>
//        <UserPlus className="mr-2 h-4 w-4" /> Manage Dependents
//      </Button>
//    </CardContent>
//  </Card>

//  {/* Insurance and Financial Management Section */}
//  <Card className='mb-4'>
//    <CardHeader>
//      <CardTitle>Insurance and Financial Overview</CardTitle>
//    </CardHeader>
//    <CardContent className="space-y-4">
//      <div>
//        <h3 className="text-lg font-semibold mb-2">Current Policy</h3>
//        <p className="text-sm text-muted-foreground">Family Health Plan - Premium</p>
//        <Button size="sm" className="mt-2">View Details</Button>
//      </div>
//      <div>
//        <h3 className="text-lg font-semibold mb-2">Out-of-Pocket Expenses</h3>
//        <p className="text-xl font-bold">$750 / $2000</p>
//        <p className="text-sm text-muted-foreground">Annual deductible</p>
//      </div>
//      <div className="grid grid-cols-2 gap-4">
//        <Button className="w-full">
//          <Shield className="mr-2 h-4 w-4" /> Manage Policies
//        </Button>
//        <Button className="w-full">
//          <FileText className="mr-2 h-4 w-4" /> Submit Claim
//        </Button>
//      </div>
//    </CardContent>
//  </Card>

//  {/* Loan Management Section */}
//  <Card className='mb-4'>
//    <CardHeader>
//      <CardTitle>Loan Management</CardTitle>
//    </CardHeader>
//    <CardContent className="space-y-4">
//      <div>
//        <h3 className="text-lg font-semibold mb-2">Current Loan</h3>
//        <p className="text-xl font-bold">$5,000</p>
//        <p className="text-sm text-muted-foreground">Next payment: $250 due in 7 days</p>
//      </div>
//      <div className="grid grid-cols-2 gap-4">
//        <Button className="w-full" onClick={handleMakePaymentClick}>
//          <DollarSign className="mr-2 h-4 w-4" /> Make Payment
//        </Button>
//        <Button className="w-full">
//          <FileText className="mr-2 h-4 w-4" /> View Loan Details
//        </Button>
//      </div>
//    </CardContent>
//  </Card>

//  {/* Bottom Section - Quick Actions and Updates */}
//  <Card className='mb-4'>
//    <CardHeader>
//      <CardTitle>Quick Actions and Updates</CardTitle>
//    </CardHeader>
//    <CardContent className="space-y-4">
//      <div className="grid grid-cols-2 gap-4">
//        <Button className="flex items-center justify-center" onClick={handleBookAppointmentClick}>
//          <Calendar className="mr-2 h-4 w-4" /> Book Appointment
//        </Button>
//        <Button className="flex items-center justify-center" onClick={handleJoinWellnessProgramClick}>
//          <Heart className="mr-2 h-4 w-4" /> Join Wellness Program
//        </Button>
//        <Button className="flex items-center justify-center" onClick={handleViewMedicalRecordsClick}>
//          <FileText className="mr-2 h-4 w-4" /> View Medical Records
//        </Button>
//        <Button className="flex items-center justify-center" onClick={handleJoinCommunityForumsClick}>
//          <Users className="mr-2 h-4 w-4" /> Join Community Forums
//        </Button>
//        <Button className="flex items-center justify-center" onClick={handleShareHealthAchievementClick}>
//          <Share2 className="mr-2 h-4 w-4" /> Share Health Achievement
//        </Button>
//        <Button className="flex items-center justify-center" onClick={handleApplyForHealthcareLoanClick}>
//          <Plus className="mr-2 h-4 w-4" /> Apply for Healthcare Loan
//        </Button>
//        <Button className="flex items-center justify-center" onClick={handleBrowseHealthServicesClick}>
//          <ShoppingBag className="mr-2 h-4 w-4" /> Browse Health Services
//        </Button>
//        <Button className="flex items-center justify-center" onClick={handleMakePaymentClick}>
//          <CreditCard className="mr-2 h-4 w-4" /> Make Payment
//        </Button>
//        <Button className="flex items-center justify-center col-span-2">
//          <AlertTriangle className="mr-2 h-4 w-4" /> Manage Emergency Contacts
//        </Button>
//      </div>
//      <div>
//        <h3 className="text-lg font-semibold mb-2">Notifications</h3>
//        <ScrollArea className="h-[200px]">
//          <ul className="space-y-2">
//            <li className="flex items-center">
//              <Bell className="mr-2 h-4 w-4" />
//              <span className="text-sm">Telehealth appointment reminder: Dr. Smith tomorrow at 10 AM</span>
//            </li>
//            <li className="flex items-center">
//              <Stethoscope className="mr-2 h-4 w-4" />
//              <span className="text-sm">New health tip: 5 ways to improve your posture</span>
//            </li>
//            <li className="flex items-center">
//              <Heart className="mr-2 h-4 w-4" />
//              <span className="text-sm">New wellness challenge available: 30-day meditation</span>
//            </li>
//            <li className="flex items-center">
//              <FileText className="mr-2 h-4 w-4" />
//              <span className="text-sm">Telehealth consultation summary available</span>
//            </li>
//            <li className="flex items-center">
//              <MessageSquare className="mr-2 h-4 w-4" />
//              <span className="text-sm">New reply to your community forum post</span>
//            </li>
//            <li className="flex items-center">
//              <ShoppingBag className="mr-2 h-4 w-4" />
//              <span className="text-sm">New highly-rated mental health counselor available in your area</span>
//            </li>
//            <li className="flex items-center">
//              <CreditCard className="mr-2 h-4 w-4" />
//              <span className="text-sm">Payment due for upcoming dental appointment</span>
//            </li>
//            <li className="flex items-center">
//              <Star className="mr-2 h-4 w-4" />
//              <span className="text-sm">Please rate your recent appointment with Dr. Johnson</span>
//            </li>
//            <li className="flex items-center">
//              <AlertTriangle className="mr-2 h-4 w-4" />
//              <span className="text-sm">Please update your emergency contact information</span>
//            </li>
//            <li className="flex items-center">
//              <UserPlus className="mr-2 h-4 w-4" />
//              <span className="text-sm">Reminder: Schedule annual checkup for dependent Sarah</span>
//            </li>
//          </ul>
//        </ScrollArea>
//      </div>
//    </CardContent>
//  </Card>
