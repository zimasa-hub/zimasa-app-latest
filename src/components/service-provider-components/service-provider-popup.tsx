"use client";

import React, { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  X,
  Calendar,
  MessageSquare,
  CreditCard,
  Settings
} from "lucide-react";

interface PopupProps {
  onClose: () => void;
}

const Popup: React.FC<PopupProps> = ({ onClose }) => {
  const popupRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    document.body.style.overflow = "hidden";

    const handleOutsideClick = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.body.style.overflow = "auto";
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [onClose]);

  const services = [
    { name: "Book Appointment", icon: Calendar, description: "Schedule your next visit" },
    { name: "Client Interaction Hub", icon: MessageSquare, description: "Manage client communications" },
    { name: "Billing and Payments", icon: CreditCard, description: "Handle financial transactions" },
    { name: "Service Management", icon: Settings, description: "Manage and customize services" },
  ];

  const handleServiceClick = (serviceName: string) => {
    switch (serviceName) {
      case "Book Appointment":
        router.push("/appointments");
        break;
      case "Client Interaction Hub":
        router.push("/client-interaction");
        break;
      case "Billing and Payments":
        router.push("/billing");
        break;
      case "Service Management":
        router.push("/service-management");
        break;
      default:
        console.log("Service not implemented yet");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        ref={popupRef}
        className="bg-white rounded-lg shadow-lg p-6 w-[84%] max-w-6xl max-h-[90%] overflow-hidden"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Application Services</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-2 gap-4 overflow-y-auto max-h-[70vh] w-[75vw] lg:w-auto p-2">
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
              <div className="flex-grow">
                <service.icon className="text-custom-green mb-2" size={24} />
                <h3 className="text-lg font-medium mb-2">{service.name}</h3>
                <p className="text-sm text-gray-600">{service.description}</p>
              </div>
              <button 
                className="mt-4 bg-custom-green text-white rounded px-4 py-2 text-sm hover:bg-custom-orange hover:text-custom-green transition-colors duration-200"
                onClick={() => handleServiceClick(service.name)}
              >
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