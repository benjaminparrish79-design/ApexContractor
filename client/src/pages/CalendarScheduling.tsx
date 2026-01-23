import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Users, AlertCircle, CheckCircle, Plus } from "lucide-react";

/**
 * Calendar & Advanced Scheduling - Google Calendar sync, team scheduling, reminders
 */
export default function CalendarScheduling() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [view, setView] = useState<"month" | "week" | "day">("month");

  const events = [
    {
      id: 1,
      title: "Kitchen Renovation - Day 1",
      client: "John Anderson",
      date: new Date(2026, 0, 22),
      startTime: "08:00",
      endTime: "17:00",
      location: "123 Oak Street",
      team: ["John", "Mike"],
      status: "confirmed",
      type: "project",
    },
    {
      id: 2,
      title: "Bathroom Remodel - Inspection",
      client: "Sarah Mitchell",
      date: new Date(2026, 0, 23),
      startTime: "14:00",
      endTime: "15:30",
      location: "456 Maple Ave",
      team: ["Sarah"],
      status: "pending",
      type: "inspection",
    },
    {
      id: 3,
      title: "Team Meeting",
      client: "Internal",
      date: new Date(2026, 0, 24),
      startTime: "10:00",
      endTime: "11:00",
      location: "Office",
      team: ["John", "Mike", "Sarah"],
      status: "confirmed",
      type: "meeting",
    },
    {
      id: 4,
      title: "Deck Construction - Ongoing",
      client: "Mike Brown",
      date: new Date(2026, 0, 25),
      startTime: "09:00",
      endTime: "16:00",
      location: "789 Pine Road",
      team: ["John", "Mike"],
      status: "confirmed",
      type: "project",
    },
  ];

  const teamMembers = [
    { id: 1, name: "John", availability: "available", tasks: 3 },
    { id: 2, name: "Mike", availability: "available", tasks: 2 },
    { id: 3, name: "Sarah", availability: "busy", tasks: 1 },
  ];

  const getEventColor = (type: string) => {
    switch (type) {
      case "project":
        return "bg-blue-100 border-blue-300 text-blue-900";
      case "inspection":
        return "bg-green-100 border-green-300 text-green-900";
      case "meeting":
        return "bg-purple-100 border-purple-300 text-purple-900";
      default:
        return "bg-gray-100 border-gray-300 text-gray-900";
    }
  };

  const getStatusBadge = (status: string) => {
    return status === "confirmed" ? (
      <Badge className="bg-green-100 text-green-800">Confirmed</Badge>
    ) : (
      <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <Calendar size={36} />
              Calendar & Scheduling
            </h1>
            <p className="text-gray-600">Manage projects, team schedules, and integrations</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
            <Plus size={16} />
            New Event
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
          {/* View Controls */}
          <Card className="p-4 lg:col-span-4">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={view === "month" ? "default" : "outline"}
                  onClick={() => setView("month")}
                >
                  Month
                </Button>
                <Button
                  size="sm"
                  variant={view === "week" ? "default" : "outline"}
                  onClick={() => setView("week")}
                >
                  Week
                </Button>
                <Button
                  size="sm"
                  variant={view === "day" ? "default" : "outline"}
                  onClick={() => setView("day")}
                >
                  Day
                </Button>
              </div>

              <div className="flex gap-2 ml-auto">
                <Button size="sm" variant="outline">
                  ← Prev
                </Button>
                <Button size="sm" variant="outline">
                  Today
                </Button>
                <Button size="sm" variant="outline">
                  Next →
                </Button>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar/Events */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Upcoming Events</h2>

              <div className="space-y-3">
                {events.map((event) => (
                  <div
                    key={event.id}
                    className={`p-4 rounded-lg border-2 ${getEventColor(event.type)} cursor-pointer hover:shadow-md transition-shadow`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-bold text-lg">{event.title}</p>
                        <p className="text-sm opacity-75">{event.client}</p>
                      </div>
                      {getStatusBadge(event.status)}
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm mt-3">
                      <div className="flex items-center gap-2">
                        <Clock size={14} />
                        <span>
                          {event.startTime} - {event.endTime}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users size={14} />
                        <span>{event.team.join(", ")}</span>
                      </div>
                    </div>

                    <p className="text-sm mt-2 opacity-75">📍 {event.location}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Integrations */}
            <Card className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Calendar Integrations</h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div>
                    <p className="font-medium text-gray-900">Google Calendar</p>
                    <p className="text-sm text-gray-600">Sync projects and deadlines</p>
                  </div>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    Connect
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div>
                    <p className="font-medium text-gray-900">Outlook Calendar</p>
                    <p className="text-sm text-gray-600">Sync with Microsoft Outlook</p>
                  </div>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    Connect
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div>
                    <p className="font-medium text-gray-900">iCal Feed</p>
                    <p className="text-sm text-gray-600">Export calendar as iCal</p>
                  </div>
                  <Button size="sm" variant="outline">
                    Export
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Team & Reminders */}
          <div className="space-y-6">
            {/* Team Availability */}
            <Card className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Team Availability</h3>

              <div className="space-y-3">
                {teamMembers.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{member.name}</p>
                      <p className="text-xs text-gray-600">{member.tasks} tasks</p>
                    </div>
                    <div
                      className={`w-3 h-3 rounded-full ${
                        member.availability === "available" ? "bg-green-500" : "bg-yellow-500"
                      }`}
                    />
                  </div>
                ))}
              </div>
            </Card>

            {/* Reminders */}
            <Card className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <AlertCircle size={20} />
                Upcoming Reminders
              </h3>

              <div className="space-y-2">
                <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p className="text-sm font-medium text-yellow-900">Tomorrow 8:00 AM</p>
                  <p className="text-xs text-yellow-800">Kitchen Renovation starts</p>
                </div>

                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm font-medium text-blue-900">Jan 23, 2:00 PM</p>
                  <p className="text-xs text-blue-800">Bathroom inspection</p>
                </div>

                <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <p className="text-sm font-medium text-purple-900">Jan 24, 10:00 AM</p>
                  <p className="text-xs text-purple-800">Team meeting</p>
                </div>
              </div>
            </Card>

            {/* Notification Settings */}
            <Card className="p-4 bg-blue-50 border-blue-200">
              <div className="flex items-start gap-3">
                <CheckCircle className="text-blue-600 mt-1" size={20} />
                <div>
                  <p className="font-medium text-blue-900 text-sm">Smart Reminders</p>
                  <p className="text-xs text-blue-800 mt-1">
                    Get notified 24 hours before events and when team members are assigned.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
