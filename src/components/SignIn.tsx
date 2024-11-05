"use client";

import { useState } from "react";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";


interface SignInResponse {
  message: string;
  user: {
    name: string;
    email: string;
    roles: string[];
  };
}

const formSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type ScreenType = "signin" | "signup" | "confirm";

export default function SignIn({
  setCurrentScreen,
}: {
  setCurrentScreen: (screen: ScreenType) => void;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data: SignInResponse = await response.json();
      if (response.ok) {
        // Save roles to localStorage
        localStorage.setItem("roles", JSON.stringify(data.user.roles));

        router.push("/dashboard");
      } else {
        setErrorMessage(data.message || "Sign-in failed. Please try again.");
      }
    } catch (error) {
      console.error("Sign-in error:", error);
      setErrorMessage("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 bg-teal-500 clip-diagonal"></div>
      <div className="relative z-10 flex flex-col h-full p-6">
        <button className="text-white" onClick={() => {}}>
          <ArrowLeft size={24} />
        </button>
        <div className="flex-grow flex flex-col justify-center">
          <h1 className="text-3xl font-bold text-white mb-8">Sign in</h1>
          <p className="text-white mb-8">Welcome back</p>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <input
                {...form.register("username")}
                type="text"
                placeholder="Username"
                className="w-full bg-white bg-opacity-20 text-white placeholder-white placeholder-opacity-80 rounded-full py-3 px-4"
              />
              {form.formState.errors.username && (
                <p className="mt-1 text-red-300 text-sm">
                  {form.formState.errors.username.message}
                </p>
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
                <p className="mt-1 text-red-300 text-sm">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>
            <a href="#" className="block text-white text-right mt-2">
              Forgot Password?
            </a>
            <button
              type="submit"
              className="w-full bg-white text-teal-500 rounded-full py-3 font-bold disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </button>
          </form>
          {errorMessage && (
            <p className="mt-4 text-red-300 text-center">{errorMessage}</p>
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
            <img
              src="/facebook_svg.svg"
              alt="Facebook"
              className="w-6 h-6 mr-2"
            />
            Login with Facebook
          </button>
        </div>
        <p className="text-white text-center mt-6">
          New member?{" "}
          <button className="font-bold" onClick={() => setCurrentScreen("signup")}>
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}
