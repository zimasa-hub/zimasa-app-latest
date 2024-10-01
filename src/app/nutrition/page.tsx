import ComprehensivePatientHomeScreen from "@/components/ComprehensivePatientHomeScreen";
import ErrorBoundary from "@/components/ErrorBoundary";
import CalorieTracker from "@/components/nutrition";

export default function Dashboard ()
{


   return (
    <div className="">
      <ErrorBoundary>
        <CalorieTracker />
      </ErrorBoundary>
    </div>
   )
    
}