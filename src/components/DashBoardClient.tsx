"use client"

import { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import Sidebar from "../app/NavBars/consumer-sideBar"
import ComprehensivePatientHomeScreen from "@/components/ComprehensivePatientHomeScreen";
import ServiceProviderHomeScreenComponent from "@/components/service-provider-components/service-provider-home-screen";
import { SetDynamicRoute } from '@/lib/utils/setDynamicRoute';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface DashboardClientProps {
  name: string | null;
  isProvider: boolean;
  error: string | null;
  currentMemberId: string | null;
}

export default function DashboardClient({ name, isProvider: initialIsProvider, error,currentMemberId }: DashboardClientProps) {
  const [currentMode, setCurrentMode] = useState<'provider' | 'consumer'>(initialIsProvider ? 'provider' : 'consumer');
  const [showError, setShowError] = useState(!!error);

  const handleModeSwitch = () => {
    setCurrentMode(currentMode === 'provider' ? 'consumer' : 'provider');
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setShowError(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <div className="flex flex-col min-h-screen">
      {showError && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
        <main className="flex-grow bg-white">
          <SetDynamicRoute />
          {currentMode === 'provider' ? (
            <ServiceProviderHomeScreenComponent 
            isProvider={initialIsProvider} 
              name={name} 
              currentMode={currentMode} 
              onModeSwitch={handleModeSwitch}
              currentMemberId={currentMemberId}
            />
          ) : (
            <ComprehensivePatientHomeScreen 
            isProvider={initialIsProvider} 
              name={name} 
              currentMode={currentMode} 
              onModeSwitch={handleModeSwitch}
              currentMemberId={currentMemberId}
            />
          )}
        </main>
      </div>
   
  );
}