import { Metadata } from 'next';
import ErrorBoundary from '@/components/ErrorBoundary';
import { SetDynamicRoute } from '@/lib/utils/setDynamicRoute';
import { getValidAccessToken, getServerSession } from '@/lib/utils/auth-utils';
import LoginFunctionality from '@/components/LoginFunctionality';
import { LoginScreensComponent } from '@/components/login-screens';

export const metadata: Metadata = {
  title: 'Zimasa Health Platform',
  description: 'Manage your health and wellness with Zimasa',
}

export default async function Home() {
  let name: string | null = null;
  let error: string | null = null;
  let isValidSession = false;

  try {
    const session = await getServerSession();

    if (session) {
      name = session.user.name;
      try {
        const accessToken = await getValidAccessToken();
        isValidSession = true;
      } catch (tokenError) {
        console.error("Token refresh error:", tokenError);
        error = "Your session has expired. Please log in again.";
      }
    }
  } catch (authError) {
    console.error("Authentication error:", authError);
    error = "Authentication failed. Please log in again.";
  }

  if (!isValidSession) {
    return <LoginScreensComponent />;
  }

  return (
    <main className="min-h-screen bg-white">
      <SetDynamicRoute />
      <ErrorBoundary>
        {error ? (
          <div className="flex items-center justify-center h-screen">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">An error occurred</h1>
              <p className="text-red-500">{error}</p>
              <a href="/" className="mt-4 inline-block px-4 py-2 bg-[#008080] text-white rounded hover:bg-[#006666]">
                Return to Login
              </a>
            </div>
          </div>
        ) : (
          <LoginFunctionality name={name} currentMemberId={null}  />
        )}
      </ErrorBoundary>
    </main>
  );
}