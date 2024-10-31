"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  MapPin,
  ChevronLeft,
  Filter,
  X,
  RefreshCw,
} from "lucide-react";
import axios from "axios";
import { Appointment } from "@/lib/interfaces/appointments/appointments";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

interface AllAppointmentsViewProps {
  isOpen: boolean;
  onClose: () => void;
}

const AppointmentSkeleton = () => (
  <div className="bg-white border rounded-lg p-4 space-y-2 border-b shadow-md animate-pulse">
    <div className="flex justify-between items-start">
      <div>
        <Skeleton className="h-5 w-40 mb-2" />
        <Skeleton className="h-4 w-32" />
      </div>
      <Skeleton className="h-6 w-20" />
    </div>
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-full" />
    <div className="flex justify-center mt-2 space-x-2">
      <Skeleton className="h-9 w-28" />
      <Skeleton className="h-9 w-28" />
    </div>
  </div>
);

export default function Component({
  isOpen,
  onClose,
}: AllAppointmentsViewProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [scheduleTypeFilter, setScheduleTypeFilter] = useState<string>("ALL");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAppointments = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get("/api/user/consumer-all-appointments");
      setAppointments(response.data.appointmentsResponse.content);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setError("Failed to load appointments. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchAppointments();
    }
  }, [isOpen]);

  useEffect(() => {
    applyFilters();
  }, [appointments, selectedDate, statusFilter, scheduleTypeFilter]);

  const applyFilters = () => {
    let filtered = appointments;

    // Apply date filter only if a date is selected
    if (selectedDate && selectedDate !== new Date().toISOString().split("T")[0]) {
      filtered = filtered.filter(
        (appointment) => appointment.appointmentDate.split('T')[0] === selectedDate
      );
    }

    // Apply status filter
    if (statusFilter && statusFilter !== "ALL") {
      filtered = filtered.filter(
        (appointment) => appointment.status === statusFilter
      );
    }

    // Apply schedule type filter
    if (scheduleTypeFilter && scheduleTypeFilter !== "ALL") {
      filtered = filtered.filter(
        (appointment) => appointment.service.location === scheduleTypeFilter
      );
    }

    setFilteredAppointments(filtered);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`1970-01-01T${timeString}`).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const clearFilters = () => {
    setStatusFilter("");
    setScheduleTypeFilter("");
    setSelectedDate("");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "REQUESTED":
        return "bg-yellow-100 text-yellow-800";
      case "SCHEDULED":
        return "bg-blue-100 text-blue-800";
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-hidden">
      <div className="flex flex-col h-full">
        <header className="flex items-center justify-between p-4 border-b bg-custom-green text-white">
          <Button
            variant="ghost"
            onClick={onClose}
            className="p-0 text-white hover:text-white/80"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-semibold">All Appointments</h1>
          <div className="w-6" /> {/* Spacer for alignment */}
          <button
            onClick={onClose}
            className="text-white hover:bg-teal-700 p-1 rounded"
          >
            <X className="h-6 w-6" />
          </button>
        </header>
        <div className="p-4 space-y-4">
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full border-custom-green"
            onKeyDown={(e) => {
              if (e.key === 'Backspace' || e.key === 'Delete') {
                e.preventDefault();
                setSelectedDate('');
              }
            }}
          />
          <div className="flex space-x-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="flex-1 border-custom-green">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Statuses</SelectItem>
                <SelectItem value="REQUESTED">Requested</SelectItem>
                <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={scheduleTypeFilter} onValueChange={setScheduleTypeFilter}>
              <SelectTrigger className="flex-1 border-custom-green">
                <SelectValue placeholder="Filter by schedule type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Types</SelectItem>
                <SelectItem value="INPERSON">In-person</SelectItem>
                <SelectItem value="VIRTUAL">Virtual</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            variant="outline"
            onClick={clearFilters}
            className="w-full border-custom-green text-custom-green"
          >
            Clear Filters
          </Button>
        </div>
        <ScrollArea className="flex-grow bg-gray-100 rounded-md">
          <div className="space-y-4 p-4">
            {isLoading ? (
              // Display skeleton loading while fetching appointments
              Array.from({ length: 5 }).map((_, index) => (
                <AppointmentSkeleton key={index} />
              ))
            ) : error ? (
              <div className="text-center text-red-500">{error}</div>
            ) : filteredAppointments.length === 0 ? (
              <div className="text-center text-gray-500">No appointments found matching the current filters.</div>
            ) : (
              filteredAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="bg-white border rounded-lg p-4 space-y-2 border-b shadow-md"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">
                        Dr.{" "}
                        {appointment.service.serviceHandlers[0]?.providerUser
                          .member.firstName || "Unknown"}{" "}
                        {appointment.service.serviceHandlers[0]?.providerUser
                          .member.lastName || ""}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {appointment.service.serviceCategory.name}
                      </p>
                    </div>
                    <Badge className={getStatusColor(appointment.status)}>
                      {appointment.status}
                    </Badge>
                  </div>
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 mr-2 text-custom-green" />
                    <span>{formatDate(appointment.appointmentDate)}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock className="h-4 w-4 mr-2 text-custom-green" />
                    <span>
                      {formatTime(appointment.startTime)} -{" "}
                      {formatTime(appointment.endTime)}
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <MapPin className="h-4 w-4 mr-2 text-custom-green" />
                    <span>{appointment.service.location}</span>
                  </div>
                  <div className="flex justify-center mt-2">
                    <Button
                      variant="ghost"
                      className="flex text-custom-green hover:bg-custom-green hover:text-white"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" /> Reschedule
                    </Button>
                    <Button
                      variant="ghost"
                      className="flex-1 border-red-500 text-end text-red-500 hover:bg-red-500 hover:text-white"
                    >
                      <X className="w-4 h-4 mr-2" /> Cancel
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}