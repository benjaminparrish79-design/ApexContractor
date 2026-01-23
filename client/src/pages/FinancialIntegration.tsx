import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { Zap, Link as LinkIcon, Unlink, CheckCircle2, AlertCircle, Clock } from "lucide-react";
import { toast } from "sonner";

export default function FinancialIntegration() {
  const [selectedProvider, setSelectedProvider] = useState<"quickbooks" | "xero" | null>(null);
  const utils = trpc.useUtils();

  const { data: connectionStatus } = trpc.financialIntegration.getConnectionStatus.useQuery();
  const { data: syncHistory } = trpc.financialIntegration.getSyncHistory.useQuery({ limit: 20 });
  const { data: syncStats } = trpc.financialIntegration.getSyncStatistics.useQuery();

  // In a real app, these would be mutations or queries that return URLs
  // For this demo, we'll just simulate the connection
  const handleConnect = (provider: "quickbooks" | "xero") => {
    setSelectedProvider(provider);
    toast.info(`Connecting to ${provider}...`);
    // In production: window.location.href = authUrl;
  };

  const disconnectMutation = trpc.financialIntegration.disconnect.useMutation({
    onSuccess: () => {
      utils.financialIntegration.getConnectionStatus.invalidate();
      toast.success("Integration disconnected");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to disconnect");
    },
  });

  const testConnectionMutation = trpc.financialIntegration.testConnection.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.error);
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "Connection test failed");
    },
  });

  const handleDisconnect = (provider: "quickbooks" | "xero" | "stripe") => {
    if (confirm(`Are you sure you want to disconnect ${provider}?`)) {
      disconnectMutation.mutate({ provider });
    }
  };

  const handleTestConnection = (provider: "quickbooks" | "xero") => {
    testConnectionMutation.mutate({ provider });
  };

  const successRate = syncStats?.successRate || "0";
  const totalSyncs = syncStats?.totalSyncs || 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Financial Integration</h1>
            <p className="text-muted-foreground mt-2">Connect your accounting and payment platforms</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Syncs</CardTitle>
              <Zap className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalSyncs}</div>
              <p className="text-xs text-muted-foreground">All-time syncs</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{successRate}%</div>
              <p className="text-xs text-muted-foreground">Successful syncs</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{syncStats?.pending || 0}</div>
              <p className="text-xs text-muted-foreground">Awaiting sync</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="accounting" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="accounting">Accounting</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="history">Sync History</TabsTrigger>
          </TabsList>

          <TabsContent value="accounting" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>QuickBooks Online</CardTitle>
                      <CardDescription>Connect your QuickBooks account for automatic sync</CardDescription>
                    </div>
                    <div className="text-3xl font-bold text-blue-600">QB</div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {connectionStatus?.quickbooks?.connected ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="font-semibold text-green-900">Connected</p>
                          <p className="text-sm text-green-700">
                            Last sync: {connectionStatus.quickbooks.lastSync || "Never"}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => handleTestConnection("quickbooks")}
                          disabled={testConnectionMutation.isPending}
                        >
                          Test Connection
                        </Button>
                        <Button
                          variant="destructive"
                          className="w-full"
                          onClick={() => handleDisconnect("quickbooks")}
                        >
                          <Unlink className="mr-2 h-4 w-4" />
                          Disconnect
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground">
                        Automatically sync invoices and expenses to QuickBooks Online for seamless accounting.
                      </p>
                      <Button
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        onClick={() => handleConnect("quickbooks")}
                      >
                        <LinkIcon className="mr-2 h-4 w-4" />
                        Connect QuickBooks
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Xero</CardTitle>
                      <CardDescription>Connect your Xero account for automatic sync</CardDescription>
                    </div>
                    <div className="text-3xl font-bold text-orange-600">XE</div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {connectionStatus?.xero?.connected ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="font-semibold text-green-900">Connected</p>
                          <p className="text-sm text-green-700">
                            Last sync: {connectionStatus.xero.lastSync || "Never"}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => handleTestConnection("xero")}
                          disabled={testConnectionMutation.isPending}
                        >
                          Test Connection
                        </Button>
                        <Button
                          variant="destructive"
                          className="w-full"
                          onClick={() => handleDisconnect("xero")}
                        >
                          <Unlink className="mr-2 h-4 w-4" />
                          Disconnect
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground">
                        Automatically sync invoices and expenses to Xero for seamless accounting.
                      </p>
                      <Button
                        className="w-full bg-orange-600 hover:bg-orange-700"
                        onClick={() => handleConnect("xero")}
                      >
                        <LinkIcon className="mr-2 h-4 w-4" />
                        Connect Xero
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="payments" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Stripe Payment Gateway</CardTitle>
                    <CardDescription>Accept online payments from clients</CardDescription>
                  </div>
                  <div className="text-3xl font-bold text-purple-600">ST</div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {connectionStatus?.stripe?.connected ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-semibold text-green-900">Connected</p>
                        <p className="text-sm text-green-700">Ready to accept payments</p>
                      </div>
                    </div>
                    <Button
                      variant="destructive"
                      className="w-full"
                      onClick={() => handleDisconnect("stripe")}
                    >
                      <Unlink className="mr-2 h-4 w-4" />
                      Disconnect
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Enable clients to pay invoices directly through your portal using Stripe.
                    </p>
                    <Button className="w-full bg-purple-600 hover:bg-purple-700" disabled>
                      <LinkIcon className="mr-2 h-4 w-4" />
                      Connect Stripe (Coming Soon)
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Sync Activity</CardTitle>
                <CardDescription>Last 20 synchronization attempts</CardDescription>
              </CardHeader>
              <CardContent>
                {syncHistory && syncHistory.length > 0 ? (
                  <div className="space-y-3">
                    {syncHistory.map((log) => (
                      <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-semibold text-sm">
                              {log.integrationProvider.toUpperCase()} - {log.syncType.replace("_", " ")}
                            </p>
                            <Badge
                              variant={log.status === "success" ? "default" : log.status === "failed" ? "destructive" : "secondary"}
                            >
                              {log.status}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {log.recordType}: {log.recordId} | {new Date(log.createdAt).toLocaleString()}
                          </p>
                        </div>
                        {log.status === "failed" && log.errorMessage && (
                          <AlertCircle className="h-5 w-5 text-red-600" title={log.errorMessage} />
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">No sync history yet</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {syncStats && (
          <Card>
            <CardHeader>
              <CardTitle>Sync Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Successful</p>
                  <p className="text-2xl font-bold text-green-600">{syncStats.successful}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Failed</p>
                  <p className="text-2xl font-bold text-red-600">{syncStats.failed}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">{syncStats.pending}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Success Rate</p>
                  <p className="text-2xl font-bold text-blue-600">{syncStats.successRate}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
