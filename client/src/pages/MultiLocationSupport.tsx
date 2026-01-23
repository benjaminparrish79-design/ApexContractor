import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, MapPin, Users, DollarSign, TrendingUp, Plus, Settings } from "lucide-react";

/**
 * Multi-Location/Multi-Company Support - Manage multiple business entities, branches, consolidated reporting
 */
export default function MultiLocationSupport() {
  const [selectedLocation, setSelectedLocation] = useState<string>("main");

  const locations = [
    {
      id: "main",
      name: "Main Office",
      type: "headquarters",
      address: "123 Business Ave, New York, NY 10001",
      phone: "(555) 123-4567",
      email: "main@contractorpro.com",
      manager: "John Smith",
      employees: 12,
      monthlyRevenue: 45000,
      status: "active",
    },
    {
      id: "branch1",
      name: "Brooklyn Branch",
      type: "branch",
      address: "456 Park Street, Brooklyn, NY 11201",
      phone: "(555) 234-5678",
      email: "brooklyn@contractorpro.com",
      manager: "Sarah Johnson",
      employees: 8,
      monthlyRevenue: 28000,
      status: "active",
    },
    {
      id: "branch2",
      name: "Queens Branch",
      type: "branch",
      address: "789 Queens Blvd, Queens, NY 11375",
      phone: "(555) 345-6789",
      email: "queens@contractorpro.com",
      manager: "Mike Davis",
      employees: 6,
      monthlyRevenue: 18000,
      status: "active",
    },
    {
      id: "branch3",
      name: "New Jersey Office",
      type: "branch",
      address: "321 Jersey Drive, Newark, NJ 07101",
      phone: "(555) 456-7890",
      email: "nj@contractorpro.com",
      manager: "Lisa Anderson",
      employees: 5,
      monthlyRevenue: 12000,
      status: "planning",
    },
  ];

  const selectedLocationData = locations.find((l) => l.id === selectedLocation);

  const consolidatedMetrics = {
    totalLocations: locations.length,
    totalEmployees: locations.reduce((sum, l) => sum + l.employees, 0),
    totalRevenue: locations.reduce((sum, l) => sum + l.monthlyRevenue, 0),
    activeLocations: locations.filter((l) => l.status === "active").length,
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <Building2 size={36} />
            Multi-Location Management
          </h1>
          <p className="text-gray-600">Manage multiple business entities with consolidated reporting</p>
        </div>

        {/* Consolidated Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4">
            <p className="text-sm text-gray-600 mb-1">Total Locations</p>
            <p className="text-2xl font-bold text-gray-900">{consolidatedMetrics.totalLocations}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-gray-600 mb-1">Total Employees</p>
            <p className="text-2xl font-bold text-gray-900">{consolidatedMetrics.totalEmployees}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-gray-600 mb-1">Active Locations</p>
            <p className="text-2xl font-bold text-green-600">{consolidatedMetrics.activeLocations}</p>
          </Card>
          <Card className="p-4 bg-blue-50">
            <p className="text-sm text-gray-600 mb-1">Monthly Revenue</p>
            <p className="text-2xl font-bold text-blue-600">
              ${(consolidatedMetrics.totalRevenue / 1000).toFixed(0)}K
            </p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Locations List */}
          <div className="lg:col-span-1">
            <Card className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900">Locations</h3>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  <Plus size={14} />
                </Button>
              </div>

              <div className="space-y-2">
                {locations.map((location) => (
                  <button
                    key={location.id}
                    onClick={() => setSelectedLocation(location.id)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedLocation === location.id
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                    }`}
                  >
                    <p className="font-medium text-sm">{location.name}</p>
                    <p className="text-xs opacity-75">{location.employees} employees</p>
                  </button>
                ))}
              </div>
            </Card>
          </div>

          {/* Location Details */}
          <div className="lg:col-span-2 space-y-6">
            {selectedLocationData && (
              <>
                {/* Location Info */}
                <Card className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{selectedLocationData.name}</h2>
                      <p className="text-gray-600 flex items-center gap-2 mt-1">
                        <MapPin size={16} />
                        {selectedLocationData.address}
                      </p>
                    </div>
                    <Badge
                      className={
                        selectedLocationData.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }
                    >
                      {selectedLocationData.status === "active" ? "Active" : "Planning"}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-600">Manager</p>
                      <p className="font-medium text-gray-900">{selectedLocationData.manager}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-600">Phone</p>
                      <p className="font-medium text-gray-900">{selectedLocationData.phone}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-600">Email</p>
                      <p className="font-medium text-gray-900 text-sm">{selectedLocationData.email}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-600">Type</p>
                      <p className="font-medium text-gray-900 capitalize">{selectedLocationData.type}</p>
                    </div>
                  </div>
                </Card>

                {/* Location Metrics */}
                <Card className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Metrics</h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="text-blue-600" size={20} />
                        <p className="text-sm text-gray-600">Employees</p>
                      </div>
                      <p className="text-2xl font-bold text-blue-600">{selectedLocationData.employees}</p>
                    </div>

                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="text-green-600" size={20} />
                        <p className="text-sm text-gray-600">Monthly Revenue</p>
                      </div>
                      <p className="text-2xl font-bold text-green-600">
                        ${(selectedLocationData.monthlyRevenue / 1000).toFixed(0)}K
                      </p>
                    </div>
                  </div>
                </Card>

                {/* Actions */}
                <Card className="p-4">
                  <div className="flex gap-2">
                    <Button className="flex-1 bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-2">
                      <Settings size={16} />
                      Configure
                    </Button>
                    <Button variant="outline" className="flex-1">
                      View Reports
                    </Button>
                  </div>
                </Card>
              </>
            )}
          </div>
        </div>

        {/* Consolidated Reporting */}
        <Card className="p-6 mt-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="text-blue-600" size={20} />
            Consolidated Reporting
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-200">
                <tr>
                  <th className="text-left py-2 px-3 font-semibold text-gray-900">Location</th>
                  <th className="text-center py-2 px-3 font-semibold text-gray-900">Employees</th>
                  <th className="text-center py-2 px-3 font-semibold text-gray-900">Revenue</th>
                  <th className="text-center py-2 px-3 font-semibold text-gray-900">Status</th>
                  <th className="text-center py-2 px-3 font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {locations.map((location) => (
                  <tr key={location.id} className="hover:bg-gray-50">
                    <td className="py-3 px-3">
                      <p className="font-medium text-gray-900">{location.name}</p>
                    </td>
                    <td className="py-3 px-3 text-center">{location.employees}</td>
                    <td className="py-3 px-3 text-center font-medium text-gray-900">
                      ${location.monthlyRevenue.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <Badge
                        className={
                          location.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }
                      >
                        {location.status === "active" ? "Active" : "Planning"}
                      </Badge>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <Button size="sm" variant="outline">
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
