"use client"

import { useState } from "react"
import { Eye, EyeOff, ArrowLeft } from "lucide-react"
import Link from "next/link"

type ScreenType = "signin" | "signup" | "confirm"



export default function ConfirmationCode({ setCurrentScreen }: { setCurrentScreen: (screen: ScreenType) => void }) {
    const [code, setCode] = useState(["''", "''", "''", "''"])
  
    const handleCodeChange = (index: number, value: string) => {
      if (value.length <= 1) {
        const newCode = [...code]
        newCode[index] = value
        setCode(newCode)
        if (value && index < 3) {
          document.getElementById(`code-${index + 1}`)?.focus()
        }
      }
    }
  
    return (
      <div className="relative h-screen">
        <div className="absolute inset-0 bg-teal-500 clip-diagonal"></div>
        <div className="relative z-10 flex flex-col h-full p-6">
          <button className="text-white" onClick={() => setCurrentScreen("signup")}>
            <ArrowLeft size={24} />
          </button>
          <div className="flex-grow flex flex-col justify-center items-center">
            <h1 className="text-3xl font-bold text-white mb-8">Confirmation code</h1>
            <p className="text-white mb-8 text-center">
              Please enter verification code you've received
            </p>
            <p className="text-white mb-8">street@gmail.com</p>
            <div className="flex justify-center space-x-4 mb-8">
              {code.map((digit, index) => (
                <input
                  key={index}
                  id={`code-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                  className="w-12 h-12 text-center text-2xl bg-white bg-opacity-20 text-white rounded-lg"
                />
              ))}
            </div>
            <button className="bg-white text-teal-500 rounded-full py-3 px-12 font-bold mb-6">
              Confirm
            </button>
            <button className="text-white underline">
              Resend Code
            </button>
          </div>
        </div>
      </div>
    )
  }