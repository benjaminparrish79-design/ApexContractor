import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, Zap, AlertCircle, CheckCircle } from "lucide-react";

/**
 * Advanced Scheduling - Resource optimization, capacity planning, team scheduling
 */
export default function AdvancedScheduling() {
  const [viewMode, setViewMode] = useState<"calendar" | "resources" | "capacity">("calendar");

  const scheduledProjects = [
    {
      id: 1,
      name: "Kitchen Remodel - Smith Residence",
      startDate: new Date(2026, 0, 22),
      endDate: new Date(2026, 0, 29),
      team: ["John Smith", "Sarah Johnson"],
      status: "scheduled",
      progress: 0,
    },
    {
      id: 2,
      name: "Bathroom Renovation - Johnson Office",
      startDate: new Date(2026, 0, 25),
      endDate: new Date(2026, 1, 5),
      team: ["Mike Davis", "Lisa Anderson"],
      status: "scheduled",
      progress: 0,
    },
    {
      id: 3,
      name: "Deck Installation - Williams Home",
      startDate: new Date(2026, 1, 1),
      endDate: new Date(2026, 1, 8),
      team: ["John Smith", "Tom Davis"],
      status: "scheduled",
      progress: 0,
    },
  ];

  const teamAvailability = [
    {
      id: 1,
      name: "John Smith",
      role: "Lead Carpenter",
      availability: "Mon-Fri, 8am-5pm",
      utilization: 85,
      projects: 2,
      capacity: "High",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      role: "Electrician",
      availability: "Mon-Fri, 9am-6pm",
      utilization: 60,
      projects: 1,
      capacity: "Medium",
    },
    {
      id: 3,
      name: "Mike Davis",
      role: "Plumber",
      availability: "Mon-Sat, 7am-4pm",
      utilization: 75,
      projects: 1,
      capacity: "High",
    },
    {
      id: 4,
      name: "Lisa Anderson",
      role: "General Contractor",
      availability: "Mon-Fri, 8am-5pm",
      utilization: 40,
      projects: 1,
      capacity: "Low",
    },
  ];

  const capacityMetrics = {
    totalCapacity: 100,
    utilized: 65,
    available: 35,
    bottlenecks: [
      {
        name: "Electrical Work",
        utilization: 95,
        recommendation: "Consider hiring additional electrician",
      },
      {
        name: "Carpentry",
        utilization: 88,
        recommendation: "Schedule lighter projects for Q2",
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <Calendar size={36} />
            Advanced Scheduling
          </h1>
          <p className="text-gray-600">Resource optimization, capacity planning, team scheduling</p>
        </div>

        {/* View Mode Tabs */}
        <Card className="p-4 mb-8">
          <div className="flex gap-2 flex-wrap">
            <Button
              size="sm"
              variant={viewMode === "calendar" ? "default" : "outline"}
              onClick={() => setViewMode("calendar")}
              className="flex items-center gap-2"
            >
              <Calendar size={16} />
              Calendar
            </Button>
            <Button
              size="sm"
              variant={viewMode === "resources" ? "default" : "outline"}
              onClick={() => setViewMode("resources")}
              className="flex items-center gap-2"
            >
              <Users size={16} />
              Resources
            </Button>
            <Button
              size="sm"
              variant={viewMode === "capacity" ? "default" : "outline"}
              onClick={() => setViewMode("capacity")}
              className="flex items-center gap-2"
            >
              <Zap size={16} />
              Capacity
            </Button>
          </div>
        </Card>

        {/* Calendar View */}
        {viewMode === "calendar" && (
          <div className="space-y-4">
            <Card className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Project Schedule</h2>

              <div className="space-y-3">
                {scheduledProjects.map((project) => (
                  <div key={project.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-bold text-gray-900">{project.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {project.startDate.toLocaleDateString()} - {project.endDate.toLocaleDateString()}
                        </p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Scheduled</Badge>
                    </div>

                    <div className="mb-3">
                      <p className="text-sm font-medium text-gray-700 mb-1">Team</p>
                      <div className="flex flex-wrap gap-2">
                        {project.team.map((member, idx) => (
                          <Badge key={idx} className="bg-blue-100 text-blue-800">
                            {member}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Button variant="outline" className="w-full">
                      View Details
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Resources View */}
        {viewMode === "resources" && (
          <Card className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Team Availability</h2>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-gray-200">
                  <tr>
                    <th className="text-left py-2 px-3 font-semibold text-gray-900">Name</th>
                    <th className="text-left py-2 px-3 font-semibold text-gray-900">Role</th>
                    <th className="text-left py-2 px-3 font-semibold text-gray-900">Availability</th>
                    <th className="text-center py-2 px-3 font-semibold text-gray-900">Utilization</th>
                    <th className="text-center py-2 px-3 font-semibold text-gray-900">Projects</th>
                    <th className="text-center py-2 px-3 font-semibold text-gray-900">Capacity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {teamAvailability.map((member) => (
                    <tr key={member.id} className="hover:bg-gray-50">
                      <td className="py-3 px-3 font-medium text-gray-900">{member.name}</td>
                      <td className="py-3 px-3 text-gray-600">{member.role}</td>
                      <td className="py-3 px-3 text-gray-600">{member.availability}</td>
                      <td className="py-3 px-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${member.utilization}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{member.utilization}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-center font-medium">{member.projects}</td>
                      <td className="py-3 px-3 text-center">
                        <Badge
                          className={
                            member.capacity === "High"
                              ? "bg-red-100 text-red-800"
                              : member.capacity === "Medium"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                          }
                        >
                          {member.capacity}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Capacity View */}
        {viewMode === "capacity" && (
          <div className="space-y-6">
            {/* Overall Capacity */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Overall Capacity</h2>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600">Total Capacity</p>
                  <p className="text-3xl font-bold text-blue-600">{capacityMetrics.totalCapacity}%</p>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg">
                  <p className="text-sm text-gray-600">Utilized</p>
                  <p className="text-3xl font-bold text-orange-600">{capacityMetrics.utilized}%</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-600">Available</p>
                  <p className="text-3xl font-bold text-green-600">{capacityMetrics.available}%</p>
                </div>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="bg-orange-500 h-4 rounded-full"
                  style={{ width: `${capacityMetrics.utilized}%` }}
                />
              </div>
            </Card>

            {/* Bottlenecks */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <AlertCircle className="text-red-600" size={24} />
                Capacity Bottlenecks
              </h2>

              <div className="space-y-3">
                {capacityMetrics.bottlenecks.map((bottleneck, idx) => (
                  <div key={idx} className="p-4 bg-red-50 rounded-lg border border-red-200">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-red-900">{bottleneck.name}</h3>
                      <Badge className="bg-red-100 text-red-800">{bottleneck.utilization}%</Badge>
                    </div>
                    <p className="text-sm text-red-800">{bottleneck.recommendation}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Recommendations */}
            <Card className="p-6 bg-green-50 border border-green-200">
              <div className="flex items-start gap-4">
                <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={24} />
                <div>
                  <h3 className="font-bold text-green-900 mb-2">Optimization Recommendations</h3>
                  <ul className="text-sm text-green-800 space-y-1 list-disc list-inside">
                    <li>Hire 1 additional electrician to handle peak demand</li>
                    <li>Stagger project start dates to balance team workload</li>
                    <li>Consider outsourcing non-core tasks during high-utilization periods</li>
                    <li>Implement flexible scheduling for seasonal projects</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
