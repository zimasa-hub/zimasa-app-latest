"use client"

import { useState } from "react"
import { Eye, EyeOff, ArrowLeft } from "lucide-react"
import Link from "next/link"

type ScreenType = "signin" | "signup" | "confirm"


export default function SignUp({ setCurrentScreen, showPassword, togglePasswordVisibility }: {
    setCurrentScreen: (screen: ScreenType) => void
    showPassword: boolean
    togglePasswordVisibility: () => void
  }) {
    return (
      <div className="relative h-screen">
        <div className="absolute inset-0 bg-teal-500 clip-diagonal"></div>
        <div className="relative z-10 flex flex-col h-full p-6">
          <button className="text-white" onClick={() => setCurrentScreen("signin")}>
            <ArrowLeft size={24} />
          </button>
          <div className="flex-grow flex flex-col justify-center">
            <h1 className="text-3xl font-bold text-white mb-8">Sign up</h1>
            <p className="text-white mb-8">Create an account here</p>
            <input
              type="text"
              placeholder="Username"
              className="bg-white bg-opacity-20 text-white placeholder-white placeholder-opacity-80 rounded-full py-3 px-4 mb-4"
            />
            <input
              type="tel"
              placeholder="Mobile Number"
              className="bg-white bg-opacity-20 text-white placeholder-white placeholder-opacity-80 rounded-full py-3 px-4 mb-4"
            />
            <input
              type="email"
              placeholder="Email address"
              className="bg-white bg-opacity-20 text-white placeholder-white placeholder-opacity-80 rounded-full py-3 px-4 mb-4"
            />
            <div className="relative mb-4">
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
            <p className="text-white text-sm mb-6">
              By signing up you agree with our Terms of Use
            </p>
            <button className="bg-white text-teal-500 rounded-full py-3 font-bold mb-6" onClick={() => setCurrentScreen("confirm")}>
              Sign Up
            </button>
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
            Already a member? <button className="font-bold" onClick={() => setCurrentScreen("signin")}>Sign in</button>
          </p>
        </div>
      </div>
    )
  }