"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, MessageCircle, Bell, User, BarChart, Grid } from "lucide-react";
import Popup from "@/components/service-provider-components/service-provider-popup";

export default function BottomNav() {
  const pathname = usePathname();
  const [isPopupVisible, setPopupVisible] = useState(false);

  const linkStyle = (path: string) =>
    pathname === path ? "text-custom-green" : "text-gray-400";

  const handleDashboardClick = () => {
    setPopupVisible(true);
  };

  const handleClosePopup = () => {
    setPopupVisible(false);
  };

  return (
    <nav
      className="fixed bottom-0 mx-4 my-2 w-[calc(100%-2rem)] bg-white border border-gray-200 rounded-lg shadow-lg"
      style={{
        boxShadow: "0 8px 20px rgba(0, 255, 255, 0.4)",
      }}
    >
      <ul className="grid grid-cols-5 justify-items-center items-center py-2 relative px-4">
        <li className="col-span-1">
          <Link
            href="/dashboard"
            className={`flex flex-col items-center ${linkStyle("/dashboard")}`}
          >
            <Home className="w-5 h-5" />
            <span className="text-xs">Home</span>
          </Link>
        </li>

        <li className="col-span-1">
          <Link
            href="/chat"
            className={`flex flex-col items-center ${linkStyle("/chat")}`}
          >
            <MessageCircle className="w-5 h-5" />
            <span className="text-xs">Chat</span>
          </Link>
        </li>

        <li className="col-span-1 relative">
          <div
            className={`flex flex-col items-center justify-center h-auto w-auto p-2 ${linkStyle(
              ""
            )}`}
            onClick={handleDashboardClick}
          >
            {/* <div className="absolute -top-3 transform -translate-y-2/3 shadow-md rounded-md bg-white p-2" style={{ boxShadow: "0px 5px 15px rgba(0, 128, 128, 0.5)" }}> */}
            <div   className={`flex flex-col items-center`}>
              <div className="flex items-center justify-center">
                <Grid className="w-8 h-6 hover:text-custom-green" />
              </div>
              <span className="text-xs mt-1 text-center hover:text-custom-green">Services</span>
            </div>
          </div>
        </li>

        <li className="col-span-1">
          <Link
            href="/profile"
            className={`flex flex-col items-center ${linkStyle(
              "/profile"
            )}`}
          >
            <User className="w-5 h-5" />
            <span className="text-xs">Profile</span>
          </Link>
        </li>

        <li className="col-span-1">
          <Link
            href="/analytics"
            className={`flex flex-col items-center ${linkStyle(
              "/analytics"
            )}`}
          >
            <BarChart className="w-5 h-5" />
            <span className="text-xs">Analytics</span>
          </Link>
        </li>
      </ul>

      {isPopupVisible && <Popup onClose={handleClosePopup} />}
    </nav>
  );
}