import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Flag, Users, AlertCircle } from "lucide-react";

/**
 * Project Timeline - Gantt chart and milestone tracking
 */
export default function ProjectTimeline() {
  const [selectedProject, setSelectedProject] = useState<number | null>(null);

  // Sample project data
  const projects = [
    {
      id: 1,
      name: "Kitchen Renovation",
      startDate: new Date(2026, 0, 15),
      endDate: new Date(2026, 1, 28),
      progress: 45,
      milestones: [
        { id: 1, name: "Demolition", date: new Date(2026, 0, 20), status: "completed" },
        { id: 2, name: "Framing", date: new Date(2026, 0, 27), status: "in-progress" },
        { id: 3, name: "Electrical", date: new Date(2026, 1, 3), status: "pending" },
        { id: 4, name: "Plumbing", date: new Date(2026, 1, 10), status: "pending" },
        { id: 5, name: "Finishes", date: new Date(2026, 1, 20), status: "pending" },
      ],
      team: [
        { id: 1, name: "John Smith", role: "Lead Contractor", allocation: 100 },
        { id: 2, name: "Mike Johnson", role: "Electrician", allocation: 60 },
        { id: 3, name: "Sarah Davis", role: "Plumber", allocation: 40 },
      ],
    },
    {
      id: 2,
      name: "Bathroom Remodel",
      startDate: new Date(2026, 1, 1),
      endDate: new Date(2026, 2, 15),
      progress: 20,
      milestones: [
        { id: 1, name: "Planning", date: new Date(2026, 1, 5), status: "completed" },
        { id: 2, name: "Demolition", date: new Date(2026, 1, 12), status: "in-progress" },
        { id: 3, name: "Installation", date: new Date(2026, 2, 1), status: "pending" },
      ],
      team: [
        { id: 1, name: "John Smith", role: "Lead Contractor", allocation: 50 },
      ],
    },
  ];

  const currentProject = projects.find((p) => p.id === selectedProject) || projects[0];

  const getDaysInProject = (start: Date, end: Date) => {
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  };

  const getMilestonePosition = (milestone: any) => {
    const totalDays = getDaysInProject(currentProject.startDate, currentProject.endDate);
    const daysSinceStart = getDaysInProject(currentProject.startDate, milestone.date);
    return (daysSinceStart / totalDays) * 100;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500";
      case "in-progress":
        return "bg-blue-500";
      case "pending":
        return "bg-gray-300";
      default:
        return "bg-gray-300";
    }
  };

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Project Timeline</h1>
          <p className="text-gray-600">Visualize project schedules and milestones</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Project Selection */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Projects</h2>
              <div className="space-y-2">
                {projects.map((project) => (
                  <button
                    key={project.id}
                    onClick={() => setSelectedProject(project.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                      selectedProject === project.id || (selectedProject === null && project.id === projects[0].id)
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                    }`}
                  >
                    <p className="font-medium truncate">{project.name}</p>
                    <p className="text-xs opacity-75">{project.progress}% complete</p>
                  </button>
                ))}
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Project Overview */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{currentProject.name}</h2>

              <div className="space-y-4">
                {/* Progress Bar */}
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Progress</span>
                    <span className="text-sm font-bold text-gray-900">{currentProject.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-blue-600 h-3 rounded-full transition-all"
                      style={{ width: `${currentProject.progress}%` }}
                    />
                  </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar size={18} className="text-gray-600" />
                    <div>
                      <p className="text-xs text-gray-600">Start Date</p>
                      <p className="font-medium text-gray-900">{currentProject.startDate.toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Flag size={18} className="text-gray-600" />
                    <div>
                      <p className="text-xs text-gray-600">End Date</p>
                      <p className="font-medium text-gray-900">{currentProject.endDate.toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Gantt Chart */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Milestones</h3>

              <div className="space-y-4">
                {currentProject.milestones.map((milestone) => (
                  <div key={milestone.id}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Flag size={16} className="text-gray-600" />
                        <span className="font-medium text-gray-900">{milestone.name}</span>
                      </div>
                      <Badge
                        variant="outline"
                        className={`${getStatusColor(milestone.status)} text-white border-0`}
                      >
                        {getStatusLabel(milestone.status)}
                      </Badge>
                    </div>

                    {/* Gantt Bar */}
                    <div className="relative h-8 bg-gray-100 rounded-lg overflow-hidden">
                      <div
                        className={`absolute h-full ${getStatusColor(milestone.status)} opacity-80 rounded-lg`}
                        style={{
                          left: `${getMilestonePosition(milestone)}%`,
                          width: "8px",
                        }}
                      />
                      <div className="absolute inset-0 flex items-center px-2 text-xs text-gray-600">
                        {milestone.date.toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Team Allocation */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Users size={20} />
                Team Allocation
              </h3>

              <div className="space-y-4">
                {currentProject.team.map((member) => (
                  <div key={member.id}>
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-medium text-gray-900">{member.name}</p>
                        <p className="text-sm text-gray-600">{member.role}</p>
                      </div>
                      <span className="text-sm font-bold text-gray-900">{member.allocation}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${member.allocation}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Alerts */}
            <Card className="p-6 border-yellow-200 bg-yellow-50">
              <div className="flex items-start gap-3">
                <AlertCircle size={20} className="text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-yellow-900">Upcoming Milestone</h4>
                  <p className="text-sm text-yellow-800">
                    "Electrical" milestone is due in 3 days. Ensure electrician is scheduled.
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
