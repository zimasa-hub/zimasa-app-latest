"use client";

import React, { useEffect, useRef } from "react";
import {
  X,
  Calendar,
  Stethoscope,
  Banknote,
  FileText,
  Wrench,
  Package,
  Rocket,
  Briefcase,
  BarChart,
  Search,
  Smartphone,
  Bell,
} from "lucide-react";

interface PopupProps {
  onClose: () => void;
}

const Popup: React.FC<PopupProps> = ({ onClose }) => {
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Disable background scrolling
    document.body.style.overflow = "hidden";

    const handleOutsideClick = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [onClose]);

  const services = [
    { name: "Book appointment", icon: Calendar, description: "Schedule your next visit" },
    { name: "Health Services", icon: Stethoscope, description: "Access medical assistance" },
    { name: "Loans", icon: Banknote, description: "Apply for financial aid" },
    { name: "Medical Records", icon: FileText, description: "View your health history" },
    // { name: "Service 5", icon: Wrench, description: "Maintenance and repairs" },
    // { name: "Service 6", icon: Package, description: "Shipping and delivery" },
    // { name: "Service 7", icon: Rocket, description: "Fast-track services" },
    // { name: "Service 8", icon: Briefcase, description: "Business solutions" },
    // { name: "Service 9", icon: BarChart, description: "Data analytics" },
    // { name: "Service 10", icon: Search, description: "Find what you need" },
    // { name: "Service 11", icon: Smartphone, description: "Mobile services" },
    // { name: "Service 12", icon: Bell, description: "Notifications" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        ref={popupRef}
        className="bg-white rounded-lg shadow-lg p-6 w-[84%]  max-w-6xl max-h-[90%] overflow-hidden"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Application Services</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        {/* Added max-h for popup content to ensure scroll works */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto max-h-[70vh] w-[75vw] p-2">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200 flex flex-col justify-between"
              style={{
                boxShadow: "0 8px 20px rgba(0, 255, 255, 0.2)",
                borderLeft: "2px solid #008080",
                borderBottom: "2px solid #008080",
              }}
            >
              {/* Service Icon and Details */}
              <div className="flex-grow">
                <service.icon className="text-custom-green mb-2" size={24} />
                <h3 className="text-lg font-medium mb-2">{service.name}</h3>
                <p className="text-sm text-gray-600">{service.description}</p>
              </div>
              {/* Button should be placed at the bottom of each card */}
              <button className="mt-4 bg-custom-green text-white rounded px-4 py-2 text-sm hover:bg-custom-orange hover:text-custom-green transition-colors duration-200">
                Select
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Popup;
