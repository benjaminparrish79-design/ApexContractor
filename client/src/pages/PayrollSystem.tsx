import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, DollarSign, MapPin, Clock, TrendingUp, Download, CheckCircle, AlertCircle } from "lucide-react";

/**
 * Team Payroll System - GPS time tracking, payroll automation, performance metrics
 */
export default function PayrollSystem() {
  const [selectedPeriod, setSelectedPeriod] = useState<"weekly" | "biweekly" | "monthly">("weekly");

  const teamMembers = [
    {
      id: 1,
      name: "John Smith",
      role: "Lead Carpenter",
      hourlyRate: 45,
      hoursWorked: 40,
      overtimeHours: 5,
      gpsVerified: true,
      performance: 95,
      totalEarnings: 1912.5,
      status: "verified",
    },
    {
      id: 2,
      name: "Mike Johnson",
      role: "Electrician",
      hourlyRate: 50,
      hoursWorked: 38,
      overtimeHours: 2,
      gpsVerified: true,
      performance: 88,
      totalEarnings: 1950,
      status: "verified",
    },
    {
      id: 3,
      name: "Sarah Williams",
      role: "Project Manager",
      hourlyRate: 40,
      hoursWorked: 40,
      overtimeHours: 0,
      gpsVerified: true,
      performance: 92,
      totalEarnings: 1600,
      status: "verified",
    },
    {
      id: 4,
      name: "Tom Davis",
      role: "Helper",
      hourlyRate: 25,
      hoursWorked: 35,
      overtimeHours: 3,
      gpsVerified: false,
      performance: 75,
      totalEarnings: 962.5,
      status: "pending-verification",
    },
  ];

  const payrollSummary = {
    totalPayroll: 6425,
    totalHours: 153,
    totalOvertime: 10,
    taxesEstimated: 1070,
    netPayroll: 5355,
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <Users size={36} />
            Payroll Management
          </h1>
          <p className="text-gray-600">GPS-verified time tracking, payroll automation, performance metrics</p>
        </div>

        {/* Period Selection */}
        <Card className="p-4 mb-8">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="font-semibold text-gray-900">Pay Period:</span>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={selectedPeriod === "weekly" ? "default" : "outline"}
                onClick={() => setSelectedPeriod("weekly")}
              >
                Weekly
              </Button>
              <Button
                size="sm"
                variant={selectedPeriod === "biweekly" ? "default" : "outline"}
                onClick={() => setSelectedPeriod("biweekly")}
              >
                Bi-weekly
              </Button>
              <Button
                size="sm"
                variant={selectedPeriod === "monthly" ? "default" : "outline"}
                onClick={() => setSelectedPeriod("monthly")}
              >
                Monthly
              </Button>
            </div>
            <Button className="ml-auto bg-green-600 hover:bg-green-700 flex items-center gap-2">
              <Download size={16} />
              Export Payroll
            </Button>
          </div>
        </Card>

        {/* Payroll Summary */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <Card className="p-4">
            <p className="text-sm text-gray-600 mb-1">Total Payroll</p>
            <p className="text-2xl font-bold text-gray-900">${payrollSummary.totalPayroll.toFixed(2)}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-gray-600 mb-1">Total Hours</p>
            <p className="text-2xl font-bold text-gray-900">{payrollSummary.totalHours}h</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-gray-600 mb-1">Overtime</p>
            <p className="text-2xl font-bold text-gray-900">{payrollSummary.totalOvertime}h</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-gray-600 mb-1">Taxes (Est.)</p>
            <p className="text-2xl font-bold text-gray-900">${payrollSummary.taxesEstimated.toFixed(2)}</p>
          </Card>
          <Card className="p-4 bg-green-50">
            <p className="text-sm text-gray-600 mb-1">Net Payroll</p>
            <p className="text-2xl font-bold text-green-600">${payrollSummary.netPayroll.toFixed(2)}</p>
          </Card>
        </div>

        {/* Team Members Payroll */}
        <Card className="p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Team Members</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-200">
                <tr>
                  <th className="text-left py-2 px-3 font-semibold text-gray-900">Name</th>
                  <th className="text-left py-2 px-3 font-semibold text-gray-900">Role</th>
                  <th className="text-center py-2 px-3 font-semibold text-gray-900">Rate</th>
                  <th className="text-center py-2 px-3 font-semibold text-gray-900">Hours</th>
                  <th className="text-center py-2 px-3 font-semibold text-gray-900">OT</th>
                  <th className="text-center py-2 px-3 font-semibold text-gray-900">GPS</th>
                  <th className="text-center py-2 px-3 font-semibold text-gray-900">Performance</th>
                  <th className="text-right py-2 px-3 font-semibold text-gray-900">Earnings</th>
                  <th className="text-center py-2 px-3 font-semibold text-gray-900">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {teamMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50">
                    <td className="py-3 px-3">
                      <p className="font-medium text-gray-900">{member.name}</p>
                    </td>
                    <td className="py-3 px-3">{member.role}</td>
                    <td className="py-3 px-3 text-center">${member.hourlyRate}/hr</td>
                    <td className="py-3 px-3 text-center">{member.hoursWorked}h</td>
                    <td className="py-3 px-3 text-center text-orange-600 font-medium">
                      {member.overtimeHours}h
                    </td>
                    <td className="py-3 px-3 text-center">
                      {member.gpsVerified ? (
                        <div className="flex justify-center">
                          <MapPin className="text-green-600" size={16} />
                        </div>
                      ) : (
                        <div className="flex justify-center">
                          <AlertCircle className="text-yellow-600" size={16} />
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <TrendingUp size={14} className="text-blue-600" />
                        <span>{member.performance}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-gray-900">
                      ${member.totalEarnings.toFixed(2)}
                    </td>
                    <td className="py-3 px-3 text-center">
                      {member.status === "verified" ? (
                        <Badge className="bg-green-100 text-green-800">Verified</Badge>
                      ) : (
                        <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* GPS Verification & Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* GPS Tracking */}
          <Card className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin className="text-blue-600" size={20} />
              GPS Verification
            </h3>

            <div className="space-y-3">
              {teamMembers.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{member.name}</p>
                    <p className="text-xs text-gray-600">{member.role}</p>
                  </div>
                  {member.gpsVerified ? (
                    <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
                      <CheckCircle size={12} />
                      Verified
                    </Badge>
                  ) : (
                    <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* Performance Metrics */}
          <Card className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="text-green-600" size={20} />
              Performance Metrics
            </h3>

            <div className="space-y-3">
              {teamMembers.map((member) => (
                <div key={member.id}>
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium text-gray-900 text-sm">{member.name}</p>
                    <p className="text-sm font-bold text-gray-900">{member.performance}%</p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${member.performance}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

