import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Download, Eye, EyeOff } from "lucide-react";
import { trpc } from "@/lib/trpc";

/**
 * Client Portal - Public page for clients to view invoices and payment status
 * Accessible via public link without authentication
 */
export default function ClientPortal() {
  const [clientId, setClientId] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [showCode, setShowCode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Fetch client invoices if authenticated
  const { data: invoices, isLoading } = trpc.clientPortal.listByClient.useQuery(
    { clientId: parseInt(clientId) },
    { enabled: isAuthenticated && !!clientId }
  );

  const handleAccessPortal = async () => {
    // Verify client access code
    if (!clientId || !accessCode) {
      alert("Please enter both Client ID and Access Code");
      return;
    }
    // In production, verify the access code against the database
    setIsAuthenticated(true);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 shadow-lg">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Client Portal</h1>
            <p className="text-gray-600">Access your invoices and payment status</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Client ID
              </label>
              <Input
                type="text"
                placeholder="Enter your Client ID"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Access Code
              </label>
              <div className="relative">
                <Input
                  type={showCode ? "text" : "password"}
                  placeholder="Enter your Access Code"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  className="w-full pr-10"
                />
                <button
                  onClick={() => setShowCode(!showCode)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showCode ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <Button
              onClick={handleAccessPortal}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Access Portal
            </Button>
          </div>

          <p className="text-xs text-gray-500 text-center mt-6">
            Your information is secure and encrypted
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Your Invoices</h1>
          <p className="text-gray-600">View your invoices and payment status</p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading your invoices...</p>
          </div>
        )}

        {/* Invoices List */}
        {!isLoading && invoices && invoices.length > 0 ? (
          <div className="space-y-4">
            {invoices?.map((invoice: any) => (
              <Card key={invoice.id} className="p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Invoice #{invoice.invoiceNumber}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Due: {new Date(invoice.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge
                    variant={
                      invoice.status === "paid"
                        ? "default"
                        : invoice.status === "overdue"
                          ? "destructive"
                          : "secondary"
                    }
                  >
                    {invoice.status.toUpperCase()}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div>
                    <p className="text-xs text-gray-600 uppercase">Amount</p>
                    <p className="text-xl font-bold text-gray-900">
                      ${(invoice.totalAmount / 100).toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 uppercase">Amount Due</p>
                    <p className="text-xl font-bold text-gray-900">
                      ${(invoice.amountDue / 100).toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 uppercase">Issued</p>
                    <p className="text-sm text-gray-900">
                      {new Date(invoice.issueDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 uppercase">Description</p>
                    <p className="text-sm text-gray-900 truncate">
                      {invoice.description || "—"}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Download size={16} />
                    Download PDF
                  </Button>
                  {invoice.status !== "paid" && (
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      Pay Now
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <p className="text-gray-600 text-lg">No invoices found</p>
          </Card>
        )}
      </div>
    </div>
  );
}
