import { getValidAccessToken } from "@/lib/utils/auth-utils";
import ErrorBoundary from "@/components/ErrorBoundary";
import CalorieTracker from "@/components/nutrition";
import { SetDynamicRoute } from "@/lib/utils/setDynamicRoute";
import { MealTiming } from "@/lib/interfaces/meals/interfaces";

async function getMealTimingIds(accessToken: string): Promise<MealTiming[]> {
  const url = process.env.NEXT_PUBLIC_ZIMASA_MEAL_TIMINGS;
  
  if (!url) {
    throw new Error("ZIMASA_MEAL_TIMINGS environment variable is not set");
  }

  const resp = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (resp.ok) {
    return resp.json();
  }

  throw new Error(`Failed to fetch data. Status: ${resp.status}`);
}

export default async function Dashboard() {
  let mealTimingData: MealTiming[] | null = null;
  let error: string | null = null;

  try {
    const accessToken = await getValidAccessToken();
    mealTimingData = await getMealTimingIds(accessToken);
  } catch (err) {
    console.error("Error in Dashboard component:", err);
    error = err instanceof Error ? err.message : String(err);
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">An error occurred</h1>
          <p className="text-red-500">{error}</p>
          <a href="/" className="mt-4 inline-block px-4 py-2 bg-[#008080] text-white rounded hover:bg-[#008080]">
            Return to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <SetDynamicRoute />
      <ErrorBoundary>
        <CalorieTracker data={mealTimingData} />
      </ErrorBoundary>
    </div>
  );
}