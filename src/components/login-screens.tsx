"use client"

import { useState } from "react"
import { Eye, EyeOff, ArrowLeft } from "lucide-react"
import Link from "next/link"
import SignIn from "./SignIn"
import SignUpForm from "./SignUp"
import ConfirmationCode from "./OTPScreen"

type ScreenType = "signin" | "signup" | "confirm"

export function LoginScreensComponent() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>("signin")
  const [showPassword, setShowPassword] = useState(false)

  const togglePasswordVisibility = () => setShowPassword(!showPassword)

  const renderScreen = () => {
    switch (currentScreen) {
      case "signin":
        return <SignIn setCurrentScreen={setCurrentScreen}  />
        case "signup":
          return <SignUpForm setCurrentScreen={setCurrentScreen} />
         case "confirm":
        return <ConfirmationCode setCurrentScreen={setCurrentScreen} />
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {renderScreen()}
    </div>
  )
}

