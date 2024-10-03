import ComprehensivePatientHomeScreen from "@/components/ComprehensivePatientHomeScreen";
import ErrorBoundary from "@/components/ErrorBoundary";
import CalorieTracker from "@/components/nutrition";
import {SetDynamicRoute } from "@/lib/utils/setDynamicRoute"


export default function Dashboard ()
{


   return (
    <div className="">
      <SetDynamicRoute/>
      <ErrorBoundary>
        <CalorieTracker />
      </ErrorBoundary>
    </div>
   )
    
}