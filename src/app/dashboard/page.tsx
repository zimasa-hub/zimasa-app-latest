import { Suspense } from 'react';
import ErrorBoundary from "@/components/ErrorBoundary"
import { getValidAccessToken, getServerSession, hasRole } from '@/lib/utils/auth-utils';
import DashboardClient from '@/components/DashBoardClient';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  sub: string
  // Add other token claims as needed
}

export default async function Dashboard() {
  let name: string | null = null;
  let error: string | null = null;
  let isProvider = false;
  
  let currentMemberId: string | null = null


  try {
    const session = await getServerSession();
    const accessToken = await getValidAccessToken()
    const decodedToken = jwtDecode<DecodedToken>(accessToken)
    currentMemberId = decodedToken.sub

    if (session) {
      name = session.user.name;
      console.log("SESSION : ", session);
      
      // Check if the user has the provider role
      isProvider = await hasRole("provider");
    }
  } catch (authError) {
    console.error("Authentication error:", authError);
    error = "Authentication failed. Please log in again.";
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ErrorBoundary>
     
        <DashboardClient 
          name={name} 
          isProvider={isProvider} 
          error={error}
          currentMemberId={currentMemberId}
        >
       
        </DashboardClient>
      </ErrorBoundary>
    </Suspense>
  );
}