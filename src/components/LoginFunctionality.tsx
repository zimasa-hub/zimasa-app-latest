"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { LoginScreensComponent } from "./login-screens"
import { UserNameProps } from "@/lib/interfaces/meals/interfaces"

interface LoginFunctionalityProps extends UserNameProps {
  name: string | null
  currentMemberId: string | null;
}

const LoginFunctionality: React.FC<LoginFunctionalityProps> = ({ name }) => {
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (name) {
      router.push("/dashboard")
    } else {
      setIsLoading(false)
    }
  }, [name, router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return <LoginScreensComponent />
}

export default LoginFunctionality