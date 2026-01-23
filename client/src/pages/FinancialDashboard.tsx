import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card } from "@/components/ui/card";
import { TrendingUp, DollarSign, AlertCircle, Target } from "lucide-react";

/**
 * Financial Dashboard - Cash flow, profitability, and tax tracking
 */
export default function FinancialDashboard() {
  // Sample financial data
  const cashFlowData = [
    { month: "Jan", income: 12000, expenses: 8000, profit: 4000 },
    { month: "Feb", income: 15000, expenses: 9000, profit: 6000 },
    { month: "Mar", income: 18000, expenses: 10000, profit: 8000 },
    { month: "Apr", income: 16000, expenses: 9500, profit: 6500 },
    { month: "May", income: 20000, expenses: 11000, profit: 9000 },
    { month: "Jun", income: 22000, expenses: 12000, profit: 10000 },
  ];

  const profitabilityData = [
    { project: "Kitchen Reno", revenue: 25000, expenses: 15000, profit: 10000 },
    { project: "Bathroom Reno", revenue: 12000, expenses: 8000, profit: 4000 },
    { project: "Deck Build", revenue: 8000, expenses: 5000, profit: 3000 },
    { project: "Roof Repair", revenue: 6000, expenses: 4000, profit: 2000 },
  ];

  const expenseBreakdown = [
    { name: "Materials", value: 45, color: "#3b82f6" },
    { name: "Labor", value: 35, color: "#10b981" },
    { name: "Equipment", value: 12, color: "#f59e0b" },
    { name: "Other", value: 8, color: "#6b7280" },
  ];

  const metrics = [
    {
      label: "Monthly Revenue",
      value: "$22,000",
      change: "+12%",
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      label: "Monthly Expenses",
      value: "$12,000",
      change: "+5%",
      icon: AlertCircle,
      color: "text-red-600",
    },
    {
      label: "Net Profit",
      value: "$10,000",
      change: "+18%",
      icon: TrendingUp,
      color: "text-blue-600",
    },
    {
      label: "Profit Margin",
      value: "45%",
      change: "+3%",
      icon: Target,
      color: "text-purple-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Financial Dashboard</h1>
          <p className="text-gray-600">Monitor cash flow, profitability, and financial health</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {metrics.map((metric, idx) => {
            const Icon = metric.icon;
            return (
              <Card key={idx} className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{metric.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                    <p className="text-xs text-green-600 mt-2">{metric.change} from last month</p>
                  </div>
                  <Icon className={`${metric.color}`} size={32} />
                </div>
              </Card>
            );
          })}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Cash Flow Chart */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Cash Flow Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={cashFlowData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2} />
                <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} />
                <Line type="monotone" dataKey="profit" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Expense Breakdown */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Expense Breakdown</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={expenseBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {expenseBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Project Profitability */}
        <Card className="p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Profitability</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={profitabilityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="project" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue" fill="#3b82f6" />
              <Bar dataKey="expenses" fill="#ef4444" />
              <Bar dataKey="profit" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Tax Estimation */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tax Estimation</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border-l-4 border-blue-600 pl-4">
              <p className="text-sm text-gray-600">Estimated Annual Income</p>
              <p className="text-2xl font-bold text-gray-900">$264,000</p>
            </div>
            <div className="border-l-4 border-red-600 pl-4">
              <p className="text-sm text-gray-600">Estimated Tax Liability</p>
              <p className="text-2xl font-bold text-gray-900">$52,800</p>
              <p className="text-xs text-gray-600 mt-1">20% effective rate</p>
            </div>
            <div className="border-l-4 border-green-600 pl-4">
              <p className="text-sm text-gray-600">Deductible Expenses</p>
              <p className="text-2xl font-bold text-gray-900">$144,000</p>
              <p className="text-xs text-gray-600 mt-1">54.5% of revenue</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
