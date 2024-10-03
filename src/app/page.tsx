import { Metadata } from 'next';
import ComprehensivePatientHomeScreen from '@/components/ComprehensivePatientHomeScreen';
import ErrorBoundary from '@/components/ErrorBoundary';
import { ServiceProviderHomeScreenComponent } from '@/components/service-provider-home-screen';
import { LoginScreensComponent } from '@/components/login-screens';

export const metadata: Metadata = {
  title: 'Zimasa Health Platform',
  description: 'Manage your health and wellness with Zimasa',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  themeColor: '#ffffff',
  icons: {
    icon: '/favicon.ico',
    apple: '/icon-192x192.png',
  },
  manifest: '/manifest.json',
};

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <ErrorBoundary>
        {/* <ComprehensivePatientHomeScreen /> */}
        {/* <ServiceProviderHomeScreenComponent /> */}
        <LoginScreensComponent />
      </ErrorBoundary>
    </main>
  );
}
