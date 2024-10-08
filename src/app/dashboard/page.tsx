import ComprehensivePatientHomeScreen from "@/components/ComprehensivePatientHomeScreen";
import ErrorBoundary from "@/components/ErrorBoundary"
import { ServiceProviderHomeScreenComponent } from "@/components/service-provider-home-screen";
import { getValidAccessToken, getServerSession } from '@/lib/utils/auth-utils';
import { SetDynamicRoute } from "@/lib/utils/setDynamicRoute";

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
      <SetDynamicRoute />
      <ErrorBoundary>
        <ComprehensivePatientHomeScreen name={name} />
        {/* <ServiceProviderHomeScreenComponent /> */}
      </ErrorBoundary>
    </main>
  );
}