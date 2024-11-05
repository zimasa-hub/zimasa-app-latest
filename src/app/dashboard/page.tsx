import { Suspense } from 'react';
import ErrorBoundary from "@/components/ErrorBoundary"
import { getValidAccessToken, getServerSession, hasRole } from '@/lib/utils/auth-utils';
import DashboardClient from '@/components/DashBoardClient';
import { jwtDecode } from 'jwt-decode';
import DashboardSkeleton from '@/components/dashboard-skeleton';
import { LoginScreensComponent } from '@/components/login-screens';
import { redirect } from 'next/navigation';
 

interface DecodedToken {
  sub: string
  // Add other token claims as needed
}

export default async function Dashboard() {
  let name: string | null = null;
  let error: string | null = null;
  let isProvider = false;
  let isValidSession = false;
  let currentMemberId: string | null = null

  try {
    const session = await getServerSession();
    const accessToken = await getValidAccessToken()
    const decodedToken = jwtDecode<DecodedToken>(accessToken)
    currentMemberId = decodedToken.sub
    isValidSession = true;

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

 // Redirect if the session is invalid
 if (!isValidSession) {
  redirect('/');
}

  return (
    <Suspense fallback={ <DashboardSkeleton />}>
      <ErrorBoundary>
     
        <DashboardClient 
          name={name} 
          error={error}
          currentMemberId={currentMemberId}
        >
       
        </DashboardClient>
      </ErrorBoundary>
    </Suspense>
  );
}