import { useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { trpc } from "@/lib/trpc";
import { formatCurrency } from "@/lib/validation";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { DollarSign, FileText, Briefcase, Clock, AlertCircle, Zap } from "lucide-react";
import { useLocation } from "wouter";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const navigate = (path: string) => setLocation(path);
  const { user } = useAuth();
  const { data: stats, isLoading, refetch: refetchStats } = trpc.dashboard.stats.useQuery();
  const { data: invoices, isLoading: invoicesLoading } = trpc.invoices.list.useQuery();
  const { data: projects, isLoading: projectsLoading } = trpc.projects.list.useQuery();

  // Auto-refresh stats every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refetchStats();
    }, 30000);
    return () => clearInterval(interval);
  }, [refetchStats]);

  const overdueInvoices = invoices?.filter(inv => inv.status === "overdue") || [];

  if (isLoading || invoicesLoading || projectsLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground mt-2">Welcome back! Here's your business overview.</p>
          </div>
          <LoadingSkeleton count={4} type="card" />
        </div>
      </DashboardLayout>
    );
  }

  const invoiceStatusData = [
    { name: "Draft", value: invoices?.filter(i => i.status === "draft").length || 0 },
    { name: "Sent", value: invoices?.filter(i => i.status === "sent").length || 0 },
    { name: "Paid", value: invoices?.filter(i => i.status === "paid").length || 0 },
    { name: "Overdue", value: invoices?.filter(i => i.status === "overdue").length || 0 },
  ];

  const projectStatusData = [
    { name: "Planning", value: projects?.filter(p => p.status === "planning").length || 0 },
    { name: "In Progress", value: projects?.filter(p => p.status === "in_progress").length || 0 },
    { name: "Completed", value: projects?.filter(p => p.status === "completed").length || 0 },
  ];

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Welcome, {user?.name || "Contractor"}!</h1>
            <p className="text-muted-foreground mt-2">Here's your business overview</p>
          </div>
          <Button onClick={() => refetchStats()} variant="outline">
            <Zap className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>

        {/* Alert for overdue invoices */}
        {overdueInvoices.length > 0 && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6 flex items-center gap-4">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-semibold text-red-900">{overdueInvoices.length} overdue invoice(s)</p>
                <p className="text-sm text-red-700">Total: {formatCurrency(overdueInvoices.reduce((sum, inv) => sum + (parseFloat(inv.total as any) || 0), 0))}</p>
              </div>
              <Button size="sm" onClick={() => navigate("/invoices")}>
                View Invoices
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats?.totalRevenue || 0)}</div>
              <p className="text-xs text-muted-foreground">From paid invoices</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Invoices</CardTitle>
              <FileText className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.pendingInvoices || 0}</div>
              <p className="text-xs text-muted-foreground">Awaiting payment</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
              <Briefcase className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.activeProjects || 0}</div>
              <p className="text-xs text-muted-foreground">In progress</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
              <Clock className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalClients || 0}</div>
              <p className="text-xs text-muted-foreground">Unique clients</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Invoice Status Distribution</CardTitle>
              <CardDescription>Overview of your invoices</CardDescription>
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

          <Card>
            <CardHeader>
              <CardTitle>Project Status Distribution</CardTitle>
              <CardDescription>Overview of your projects</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={projectStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {projectStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
