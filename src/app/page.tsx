import { Metadata } from 'next';
import ErrorBoundary from '@/components/ErrorBoundary';
import { SetDynamicRoute } from '@/lib/utils/setDynamicRoute';
import { getValidAccessToken, getServerSession } from '@/lib/utils/auth-utils';
import LoginFunctionality from '@/components/LoginFunctionality';

export const metadata: Metadata = {
  title: 'Zimasa Health Platform',
  description: 'Manage your health and wellness with Zimasa',
}



export default async function Home() {
  let name: string | null = null;
  let error: string | null = null;

  try {
    const session = await getServerSession();

    if (session) {
      name = session.user.name;
      const accessToken = await getValidAccessToken();

      
    }
  } catch (authError) {
    console.error("Authentication error:", authError);
    error = "Authentication failed. Please log in again.";
  }

  return (
    <main className="min-h-screen bg-white">
      <SetDynamicRoute />
      <ErrorBoundary>
       
            <LoginFunctionality name={name} />
          
        
      </ErrorBoundary>
    </main>
  );
}