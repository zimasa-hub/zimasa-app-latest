"use client"

import { useState, useEffect } from "react";
import { LoginScreensComponent } from "./login-screens";
import AuthStatus from "./AuthStatus";
import ErrorBoundary from "./ErrorBoundary";
import { ServiceProviderHomeScreenComponent } from "./service-provider-components/service-provider-home-screen";
import ComprehensivePatientHomeScreen from "./ComprehensivePatientHomeScreen";
import { UserNameProps } from "@/lib/interfaces/meals/interfaces";

interface LoginFunctionalityProps extends UserNameProps {
  name: string | null;
}

const LoginFunctionality: React.FC<LoginFunctionalityProps> = ({ name }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (name) {
      setIsLoggedIn(true);
    }
    setIsLoading(false);
  }, [name]);



  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  //change this so that when session expires user gets logged out
  if (isLoggedIn && name) {
    return (
      <ErrorBoundary>
        {/* <AuthStatus name={name} onLogout={handleLogout} /> */}
        {/* <ComprehensivePatientHomeScreen name={name} /> */}
        <ServiceProviderHomeScreenComponent />
      </ErrorBoundary>
    );
  }

  return <LoginScreensComponent />;
}

export default LoginFunctionality;