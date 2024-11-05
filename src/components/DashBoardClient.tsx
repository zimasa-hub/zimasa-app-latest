'use client';

import { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import Sidebar from "../app/NavBars/consumer-sideBar";
import ComprehensivePatientHomeScreen from "@/components/ComprehensivePatientHomeScreen";
import ServiceProviderHomeScreenComponent from "@/components/service-provider-components/service-provider-home-screen";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { SidebarProvider } from './ui/sidebar';

interface DashboardClientProps {
  name: string | null;
  error: string | null;
  currentMemberId: string | null;
}

export default function DashboardClient({ name, error, currentMemberId }: DashboardClientProps) {
  const [currentMode, setCurrentMode] = useState<'provider' | 'consumer'>('consumer');
  const [showError, setShowError] = useState(!!error);

  useEffect(() => {
    // Function to update currentMode based on localStorage
    const updateModeFromStorage = () => {
      const storedRoles = localStorage.getItem('roles');
      if (storedRoles) {
        const roles = JSON.parse(storedRoles);
        setCurrentMode(roles.includes('provider') ? 'provider' : 'consumer');
      }
    };

    // Check the role when component mounts
    updateModeFromStorage();

    // Listen for the roleSwitched event
    window.addEventListener('roleSwitched', updateModeFromStorage);

    // Cleanup the event listener on unmount
    return () => {
      window.removeEventListener('roleSwitched', updateModeFromStorage);
    };
  }, []);

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
      <SidebarProvider>
        {showError && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <main className="flex-grow bg-white">
          {currentMode === 'provider' ? (
            <ServiceProviderHomeScreenComponent 
              name={name} 
              currentMemberId={currentMemberId}
            />
          ) : (
            <ComprehensivePatientHomeScreen 
              name={name} 
              currentMemberId={currentMemberId}
            />
          )}
        </main>
      </SidebarProvider>
    </div>
  );
}
