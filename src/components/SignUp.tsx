"use client"

import { useState } from "react"
import { Eye, EyeOff, ArrowLeft } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

const formSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  mobileNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid mobile number"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

type ScreenType = "signin" | "signup" | "confirm"

export default function SignUpForm({ setCurrentScreen }: {
  setCurrentScreen: (screen: ScreenType) => void
}) {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [registrationMessage, setRegistrationMessage] = useState("")

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      firstName: "",
      lastName: "",
      mobileNumber: "",
      email: "",
      password: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      const data = await response.json()
      if (response.ok) {
        setRegistrationMessage(data.message)
        if (data.emailSent) {
          setCurrentScreen("confirm")
        } else {
          setTimeout(() => setCurrentScreen("signin"), 5000)
        }
      } else {
        setRegistrationMessage(data.message || 'Registration failed. Please try again.')
      }
    } catch (error) {
      console.error('Registration error:', error)
      setRegistrationMessage('An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen ">
      <div className="absolute inset-0 bg-teal-500 clip-diagonal"></div>
      <div className="relative z-10 flex flex-col h-full p-6">
        <button className="text-white" onClick={() => setCurrentScreen("signin")}>
          <ArrowLeft size={24} />
        </button>
        <div className="flex-grow flex flex-col justify-center">
          <h1 className="text-3xl font-bold text-white mb-8">Sign up</h1>
          <p className="text-white mb-8">Create an account here</p>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <input
                {...form.register("username")}
                placeholder="Username"
                className="w-full bg-white bg-opacity-20 text-white placeholder-white placeholder-opacity-80 rounded-full py-3 px-4"
              />
              {form.formState.errors.username && (
                <p className="mt-1 text-red-300 text-sm">{form.formState.errors.username.message}</p>
              )}
            </div>
            <div>
              <input
                {...form.register("firstName")}
                placeholder="First Name"
                className="w-full bg-white bg-opacity-20 text-white placeholder-white placeholder-opacity-80 rounded-full py-3 px-4"
              />
              {form.formState.errors.firstName && (
                <p className="mt-1 text-red-300 text-sm">{form.formState.errors.firstName.message}</p>
              )}
            </div>
            <div>
              <input
                {...form.register("lastName")}
                placeholder="Last Name"
                className="w-full bg-white bg-opacity-20 text-white placeholder-white placeholder-opacity-80 rounded-full py-3 px-4"
              />
              {form.formState.errors.lastName && (
                <p className="mt-1 text-red-300 text-sm">{form.formState.errors.lastName.message}</p>
              )}
            </div>
            <div>
              <input
                {...form.register("mobileNumber")}
                placeholder="Mobile Number"
                className="w-full bg-white bg-opacity-20 text-white placeholder-white placeholder-opacity-80 rounded-full py-3 px-4"
              />
              {form.formState.errors.mobileNumber && (
                <p className="mt-1 text-red-300 text-sm">{form.formState.errors.mobileNumber.message}</p>
              )}
            </div>
            <div>
              <input
                {...form.register("email")}
                placeholder="Email address"
                className="w-full bg-white bg-opacity-20 text-white placeholder-white placeholder-opacity-80 rounded-full py-3 px-4"
              />
              {form.formState.errors.email && (
                <p className="mt-1 text-red-300 text-sm">{form.formState.errors.email.message}</p>
              )}
            </div>
            <div className="relative">
              <input
                {...form.register("password")}
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full bg-white bg-opacity-20 text-white placeholder-white placeholder-opacity-80 rounded-full py-3 px-4"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              {form.formState.errors.password && (
                <p className="mt-1 text-red-300 text-sm">{form.formState.errors.password.message}</p>
              )}
            </div>
            <p className="text-white text-sm">
              By signing up you agree with our Terms of Use
            </p>
            <button
              type="submit"
              className="w-full bg-white text-teal-500 rounded-full py-3 font-bold disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? "Signing Up..." : "Sign Up"}
            </button>
          </form>
          {registrationMessage && (
            <p className="mt-4 text-white text-center">{registrationMessage}</p>
          )}
          <div className="flex items-center my-6">
            <div className="flex-grow h-px bg-white opacity-20"></div>
            <span className="px-4 text-white">OR</span>
            <div className="flex-grow h-px bg-white opacity-20"></div>
          </div>
          <button className="w-full bg-white text-gray-700 rounded-full py-3 font-bold mb-4 flex items-center justify-center">
            <img src="/google_svg.svg" alt="Google" className="w-6 h-6 mr-2" />
            Login with Gmail
          </button>
          <button className="w-full bg-white text-gray-700 rounded-full py-3 font-bold flex items-center justify-center">
            <img src="/facebook_svg.svg" alt="Facebook" className="w-6 h-6 mr-2" />
            Login with Facebook
          </button>
        </div>
        <p className="text-white text-center mt-6">
          Already a member? <button className="font-bold" onClick={() => setCurrentScreen("signin")}>Sign in</button>
        </p>
      </div>
    </div>
  )
}