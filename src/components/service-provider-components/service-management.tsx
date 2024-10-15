import { PlusCircle, Mail, Badge, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card"
import Link from "next/link"
import AddNewService from "./add-new-service"


export default function ServiceManagement()
{

    

    return(
        <>
         {/* Service Management and Client Interaction */}
         
      <div className="grid gap-4 md:grid-cols-2">
      {/* Service Management */}
      <Card>
        <CardHeader>
          <CardTitle>Service Management</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li className="flex items-center justify-between">
              <div>
                <p className="font-medium">Medical Consultation</p>
                <p className="text-sm text-gray-500">30 minutes - $100</p>
              </div>
              <Button variant="outline" size="sm">Edit</Button>
            </li>
            <li className="flex items-center justify-between">
              <div>
                <p className="font-medium">Wellness Session</p>
                <p className="text-sm text-gray-500">60 minutes - $150</p>
              </div>
              <Button variant="outline" size="sm">Edit</Button>
            </li>
          </ul>
          <Link href="/service-management" 
          className="w-full mt-4" 
            >
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Service
          </Link>
        </CardContent>
      </Card>

   
    </div>
        </>
        
    )
}