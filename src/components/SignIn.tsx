"use client"

import { useState } from "react"
import { Eye, EyeOff, ArrowLeft } from "lucide-react"
import Link from "next/link"

type ScreenType = "signin" | "signup" | "confirm"



export default function SignIn({ setCurrentScreen, showPassword, togglePasswordVisibility }: {
    setCurrentScreen: (screen: ScreenType) => void
    showPassword: boolean
    togglePasswordVisibility: () => void
  }) {
    return (
      <div className="relative h-screen">
        <div className="absolute inset-0 bg-teal-500 clip-diagonal"></div>
        <div className="relative z-10 flex flex-col h-full p-6">
          <button className="text-white" onClick={() => {}}>
            <ArrowLeft size={24} />
          </button>
          <div className="flex-grow flex flex-col justify-center">
            <h1 className="text-3xl font-bold text-white mb-8">Sign in</h1>
            <p className="text-white mb-8">Welcome back</p>
            <input
              type="email"
              placeholder="Email address"
              className="bg-white bg-opacity-20 text-white placeholder-white placeholder-opacity-80 rounded-full py-3 px-4 mb-4"
            />
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="bg-white bg-opacity-20 text-white placeholder-white placeholder-opacity-80 rounded-full py-3 px-4 w-full"
              />
              <button
                onClick={togglePasswordVisibility}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <a href="#" className="text-white text-right mt-2 mb-6">Forgot Password?</a>
            <Link className="bg-white text-center justify-center text-teal-500 rounded-full py-3 font-bold mb-6"
            href="/dashboard">
              Sign in
            </Link>
            <div className="flex items-center mb-6">
              <div className="flex-grow h-px bg-white opacity-20"></div>
              <span className="px-4 text-white">OR</span>
              <div className="flex-grow h-px bg-white opacity-20"></div>
            </div>
            <button className="bg-white text-gray-700 rounded-full py-3 font-bold mb-4 flex items-center justify-center">
              <img src="/google_svg.svg" alt="Google" className="w-6 h-6 mr-2" />
              Login with Gmail
            </button>
            <button className="bg-white text-gray-700 rounded-full py-3 font-bold flex items-center justify-center">
              <img src="/facebook_svg.svg" alt="Facebook" className="w-6 h-6 mr-2" />
              Login with Facebook
            </button>
          </div>
          <p className="text-white text-center mt-6">
            New member? <button className="font-bold" onClick={() => setCurrentScreen("signup")}>Sign up</button>
          </p>
        </div>
      </div>
    )
  }