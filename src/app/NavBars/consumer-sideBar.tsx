"use client"

import { Button } from "@/components/ui/button"
import { Home, BookOpen, MessageSquare, Bell, Bookmark, User, LogOut } from 'lucide-react'
import { ScrollArea } from "@/components/ui/scroll-area"
import { signOut } from "next-auth/react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface SidebarProps {
  isOpen: boolean
  name: string | null;
  isProvider?: boolean | null;
  currentMode?: string | null;
  onModeSwitch?: () => void;
  onClose?: () => void;
}

async function keycloakSessionLogOut() {
  try {
    const response = await fetch(`/api/auth/signout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Logout error:", err);
    throw err;
  }
}

export default function Component({ isOpen, name, currentMode, isProvider: initialIsProvider, onModeSwitch, onClose }: SidebarProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const navItems = [
    { icon: User, label: 'Profile', href: '/profile' },
    { icon: BookOpen, label: 'Topics', href: '/topics' },
    { icon: MessageSquare, label: 'Messages', href: '/messages' },
    { icon: Bell, label: 'Notifications', href: '/notifications' },
    { icon: Bookmark, label: 'Bookmarks', href: '/bookmarks' },
  ]

  const handleNavigation = (href: string) => {
    router.push(href);
    if (onClose) {
      onClose();
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await keycloakSessionLogOut();
      await signOut({ callbackUrl: "/" });
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Logout failed. Please try again.");
    } finally {
      setIsLoggingOut(false);
      window.location.href = "/";
    }
  };

  const oppositeMode = currentMode === 'provider' ? 'Consumer' : 'Provider';

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <aside
        className={`fixed top-0 right-0 h-full w-72 bg-white border-l shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center p-6 border-b">
            <div className="relative">
              <img
                src="/male_doc.png?height=48&width=48"
                alt="User avatar"
                className="w-12 h-12 rounded-full border-2 border-primary"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
            </div>
            <div className="ml-4">
              <h2 className="font-semibold text-lg">{name || "Guest"}</h2>
              <p className="text-sm text-muted-foreground">Zimasa Member</p>
            </div>
          </div>
          <ScrollArea className="flex-grow">
            <nav className="p-4">
              <ul className="space-y-2">
                {navItems.map((item, index) => (
                  <li key={index}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-base font-medium"
                      onClick={() => handleNavigation(item.href)}
                    >
                      <item.icon className="mr-3 h-5 w-5" />
                      {item.label}
                    </Button>
                  </li>
                ))}
              </ul>
            </nav>
          </ScrollArea>

          {initialIsProvider && (
            <div className="p-4 border-t">
              <Button
                onClick={onModeSwitch}
                className="w-full bg-white border-[0.1rem] border-primary text-primary hover:bg-primary/10 rounded-md h-8 flex items-center justify-center"
              >
                Switch to {oppositeMode} Mode 
              </Button>
            </div>
          )}

          <div className="p-4 border-t">
            <Button 
              variant="outline"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full justify-start text-base font-medium"
            >
              <LogOut className="mr-3 h-5 w-5" />
              {isLoggingOut ? 'Logging out...' : 'Log out'}
            </Button>
          </div>
        </div>
      </aside>
    </>
  )
}