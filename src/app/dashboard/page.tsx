import ComprehensivePatientHomeScreen from "@/components/ComprehensivePatientHomeScreen";
import ErrorBoundary from "@/components/ErrorBoundary"
import { getValidAccessToken, getServerSession } from '@/lib/utils/auth-utils';

export default async function Dashboard() {
  let name: string | null = null;
  let error: string | null = null;
  try {
    const session = await getServerSession();

    if (session) {
      name = session.user.name;

      console.log("SESSION : ",session)

    }
  } catch (authError) {
    console.error("Authentication error:", authError);
    error = "Authentication failed. Please log in again.";
  }

  return (
    <main className="min-h-screen bg-white">
      <ErrorBoundary>
        <ComprehensivePatientHomeScreen name={name} />
      </ErrorBoundary>
    </main>
  );
}