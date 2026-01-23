import { useMemo } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { trpc } from "@/lib/trpc";
import { DollarSign, TrendingUp, Users, FileText, Percent, Calculator } from "lucide-react";

export default function Analytics() {
  const { data: stats, isLoading } = trpc.dashboard.stats.useQuery();
  const { data: invoices } = trpc.invoices.list.useQuery();
  const { data: expenses } = trpc.jobCosts.list.useQuery();

  // Generate real data for charts based on invoices and expenses
  const monthlyData = useMemo(() => {
    if (!invoices && !expenses) return [];
    
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currentYear = new Date().getFullYear();
    const data: Record<string, { month: string, revenue: number, expenses: number }> = {};
    
    // Initialize last 6 months
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const monthName = months[d.getMonth()];
      data[monthName] = { month: monthName, revenue: 0, expenses: 0 };
    }

    // Aggregate revenue
    invoices?.forEach(inv => {
      if (inv.status === "paid" && inv.createdAt) {
        const date = new Date(inv.createdAt);
        if (date.getFullYear() === currentYear) {
          const monthName = months[date.getMonth()];
          if (data[monthName]) {
            data[monthName].revenue += parseFloat(inv.total as any) || 0;
          }
        }
      }
    });

    // Aggregate expenses
    expenses?.forEach(exp => {
      if (exp.costDate) {
        const date = new Date(exp.costDate);
        if (date.getFullYear() === currentYear) {
          const monthName = months[date.getMonth()];
          if (data[monthName]) {
            data[monthName].expenses += parseFloat(exp.amount as any) || 0;
          }
        }
      }
    });

    return Object.values(data);
  }, [invoices, expenses]);

  const invoiceStatusData = useMemo(() => {
    if (!invoices) return [];
    const statusCounts: Record<string, number> = {};
    invoices.forEach((inv) => {
      const status = inv.status || 'unknown';
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });
    return Object.entries(statusCounts).map(([status, count]) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' '),
      value: count,
    }));
  }, [invoices]);

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#6366f1", "#ec4899"];

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">Loading analytics...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Analytics & Reports</h1>
          <p className="text-muted-foreground mt-2">Track your business performance and metrics</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats?.totalRevenue.toFixed(2) || "0.00"}</div>
              <p className="text-xs text-muted-foreground">From paid invoices</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
              <Calculator className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats?.totalExpenses.toFixed(2) || "0.00"}</div>
              <p className="text-xs text-muted-foreground">All recorded costs</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.activeProjects || 0}</div>
              <p className="text-xs text-muted-foreground">Projects in progress</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalClients || 0}</div>
              <p className="text-xs text-muted-foreground">Unique clients</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Financial Trend</CardTitle>
              <CardDescription>Monthly revenue vs expenses (Last 6 Months)</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" name="Revenue" stroke="#3b82f6" strokeWidth={2} />
                  <Line type="monotone" dataKey="expenses" name="Expenses" stroke="#ef4444" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Invoice Status Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Invoice Status</CardTitle>
              <CardDescription>Distribution of all invoices</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={invoiceStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {invoiceStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Average Invoice Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats?.avgInvoiceValue.toFixed(2) || "0.00"}</div>
              <p className="text-xs text-muted-foreground mt-2">Based on paid invoices</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Bid Conversion Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.bidConversionRate.toFixed(1) || "0"}%</div>
              <p className="text-xs text-muted-foreground mt-2">Bids to accepted projects</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Pending Invoices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.pendingInvoices || 0}</div>
              <p className="text-xs text-muted-foreground mt-2">Awaiting payment</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
