import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, BarChart3 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

/**
 * Reports - Advanced reporting and data export
 */
export default function Reports() {
  const [reportType, setReportType] = useState<"revenue" | "profitability" | "tax">("revenue");
  const [dateRange, setDateRange] = useState<"month" | "quarter" | "year">("month");

  // Note: Analytics data can be fetched from dashboard.stats when needed

  // Sample data for demonstration
  const revenueData = [
    { month: "Jan", revenue: 4000, expenses: 2400 },
    { month: "Feb", revenue: 3000, expenses: 1398 },
    { month: "Mar", revenue: 2000, expenses: 9800 },
    { month: "Apr", revenue: 2780, expenses: 3908 },
    { month: "May", revenue: 1890, expenses: 4800 },
    { month: "Jun", revenue: 2390, expenses: 3800 },
  ];

  const profitabilityData = [
    { name: "Profitable", value: 65 },
    { name: "Break-even", value: 20 },
    { name: "Loss", value: 15 },
  ];

  const COLORS = ["#10b981", "#f59e0b", "#ef4444"];

  const handleExportCSV = () => {
    // Generate CSV data
    const csv = "Date,Revenue,Expenses,Profit\n" + revenueData.map((d) => `${d.month},${d.revenue},${d.expenses},${d.revenue - d.expenses}`).join("\n");

    // Download
    const element = document.createElement("a");
    element.setAttribute("href", "data:text/csv;charset=utf-8," + encodeURIComponent(csv));
    element.setAttribute("download", `report-${new Date().toISOString().split("T")[0]}.csv`);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleExportPDF = () => {
    alert("PDF export coming soon!");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Reports & Analytics</h1>
          <p className="text-gray-600">View detailed reports and export your business data</p>
        </div>

        {/* Report Controls */}
        <Card className="p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Report Type
              </label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="revenue">Revenue Report</option>
                <option value="profitability">Profitability Report</option>
                <option value="tax">Tax Summary</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date Range
              </label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
                <option value="year">This Year</option>
              </select>
            </div>

            <div className="flex items-end gap-2">
              <Button
                onClick={handleExportCSV}
                variant="outline"
                className="flex-1 flex items-center justify-center gap-2"
              >
                <Download size={16} />
                CSV
              </Button>
              <Button
                onClick={handleExportPDF}
                variant="outline"
                className="flex-1 flex items-center justify-center gap-2"
              >
                <FileText size={16} />
                PDF
              </Button>
            </div>
          </div>
        </Card>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue Chart */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <BarChart3 size={20} />
              Revenue vs Expenses
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="revenue" fill="#3b82f6" />
                <Bar dataKey="expenses" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Profitability Chart */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <BarChart3 size={20} />
              Project Profitability
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={profitabilityData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {profitabilityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-6">
            <p className="text-sm text-gray-600 mb-2">Total Revenue</p>
            <p className="text-3xl font-bold text-gray-900">$18,070</p>
            <p className="text-xs text-green-600 mt-2">+12% from last month</p>
          </Card>

          <Card className="p-6">
            <p className="text-sm text-gray-600 mb-2">Total Expenses</p>
            <p className="text-3xl font-bold text-gray-900">$9,306</p>
            <p className="text-xs text-red-600 mt-2">+5% from last month</p>
          </Card>

          <Card className="p-6">
            <p className="text-sm text-gray-600 mb-2">Net Profit</p>
            <p className="text-3xl font-bold text-green-600">$8,764</p>
            <p className="text-xs text-green-600 mt-2">48.5% profit margin</p>
          </Card>

          <Card className="p-6">
            <p className="text-sm text-gray-600 mb-2">Tax Estimate</p>
            <p className="text-3xl font-bold text-gray-900">$2,191</p>
            <p className="text-xs text-gray-600 mt-2">25% of profit</p>
          </Card>
        </div>

        {/* Export Options */}
        <Card className="p-6 mt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Export Options</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              onClick={handleExportCSV}
              variant="outline"
              className="h-24 flex flex-col items-center justify-center gap-2"
            >
              <FileText size={24} />
              <span>Export as CSV</span>
            </Button>
            <Button
              onClick={handleExportPDF}
              variant="outline"
              className="h-24 flex flex-col items-center justify-center gap-2"
            >
              <FileText size={24} />
              <span>Export as PDF</span>
            </Button>
            <Button
              variant="outline"
              className="h-24 flex flex-col items-center justify-center gap-2"
            >
              <Download size={24} />
              <span>Email Report</span>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
