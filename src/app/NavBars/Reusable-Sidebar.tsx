'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bell, BookOpen, Bookmark, User, LogOut, MessageSquare } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  useSidebar
} from "@/components/ui/sidebar";

interface ReusableSidebarProps {
  name: string | null;
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

const ReusableSidebar: React.FC<ReusableSidebarProps> = ({ name }) => {
  const router = useRouter();
  const { open, setOpen } = useSidebar();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [currentMode, setCurrentMode] = useState<'provider' | 'consumer'>('consumer');

  const navItems = [
    { icon: User, label: 'Profile', href: '/profile' },
    { icon: BookOpen, label: 'Topics', href: '/topics' },
    { icon: MessageSquare, label: 'Messages', href: '/chat' },
    { icon: Bell, label: 'Notifications', href: '/notifications' },
    { icon: Bookmark, label: 'Bookmarks', href: '/bookmarks' },
  ];

  useEffect(() => {
    // Retrieve the initial mode from localStorage
    const storedRoles = localStorage.getItem('roles');
    if (storedRoles) {
      const roles = JSON.parse(storedRoles);
      // Check if the role is 'provider'
      setCurrentMode(roles.includes('provider') ? 'provider' : 'consumer');
    }
  }, []);

  const handleNavigation = (href: string) => {
    router.push(href);
    setOpen(false);
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

  const handleModeSwitch = () => {
    // Toggle role between 'provider' and 'consumer'
    const newRole = currentMode === 'provider' ? 'consumer' : 'provider';
    
    // Update localStorage with the new role
    localStorage.setItem('roles', JSON.stringify([newRole]));
    
    // Update the currentMode state
    setCurrentMode(newRole as 'provider' | 'consumer');

    // Dispatch the custom event to notify components of the role change
    window.dispatchEvent(new Event('roleSwitched'));
  };

  return (
    <Sidebar side="right">
      <SidebarHeader className="p-4 border-b">
        <div className="flex items-center">
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
      </SidebarHeader>
      <SidebarContent>
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
      </SidebarContent>
      <SidebarFooter>
        <div className="p-4 border-t">
          <Button
            onClick={handleModeSwitch}
            className="w-full bg-white border-[0.1rem] border-primary text-primary hover:bg-primary/10 rounded-md h-8 flex items-center justify-center"
          >
            Switch to {currentMode === 'provider' ? 'Consumer' : 'Provider'} Mode 
          </Button>
        </div>
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
      </SidebarFooter>
    </Sidebar>
  );
};

export default ReusableSidebar;
