import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Code, Copy, ExternalLink, Lock, Globe } from "lucide-react";

/**
 * API Documentation - RESTful API and webhooks for integrations
 */
export default function APIDocumentation() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const apiKeys = [
    {
      id: "key_1",
      name: "Production API Key",
      key: "sk_live_51SpuMiFIg29c2FcX...",
      created: new Date(Date.now() - 86400000 * 30),
      lastUsed: new Date(Date.now() - 3600000),
      status: "active",
    },
    {
      id: "key_2",
      name: "Development API Key",
      key: "sk_test_51SpuMiFIg29c2FcX...",
      created: new Date(Date.now() - 86400000 * 60),
      lastUsed: new Date(Date.now() - 86400000),
      status: "active",
    },
  ];

  const endpoints = [
    {
      method: "GET",
      path: "/api/invoices",
      description: "List all invoices",
      auth: true,
    },
    {
      method: "POST",
      path: "/api/invoices",
      description: "Create a new invoice",
      auth: true,
    },
    {
      method: "GET",
      path: "/api/invoices/:id",
      description: "Get invoice details",
      auth: true,
    },
    {
      method: "PUT",
      path: "/api/invoices/:id",
      description: "Update invoice",
      auth: true,
    },
    {
      method: "GET",
      path: "/api/clients",
      description: "List all clients",
      auth: true,
    },
    {
      method: "POST",
      path: "/api/payments",
      description: "Record a payment",
      auth: true,
    },
  ];

  const webhooks = [
    {
      event: "invoice.created",
      description: "Triggered when a new invoice is created",
      active: true,
    },
    {
      event: "invoice.paid",
      description: "Triggered when an invoice is marked as paid",
      active: true,
    },
    {
      event: "payment.received",
      description: "Triggered when a payment is received",
      active: true,
    },
    {
      event: "project.completed",
      description: "Triggered when a project is completed",
      active: false,
    },
  ];

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case "GET":
        return "bg-blue-100 text-blue-800";
      case "POST":
        return "bg-green-100 text-green-800";
      case "PUT":
        return "bg-yellow-100 text-yellow-800";
      case "DELETE":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <Code size={36} />
            API Documentation
          </h1>
          <p className="text-gray-600">Integrate ContractorPro with your applications</p>
        </div>

        {/* API Keys */}
        <Card className="p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Lock size={24} />
            API Keys
          </h2>

          <div className="space-y-4">
            {apiKeys.map((apiKey) => (
              <div key={apiKey.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{apiKey.name}</p>
                  <p className="text-sm text-gray-600 font-mono">{apiKey.key}</p>
                  <div className="flex gap-4 mt-2 text-xs text-gray-600">
                    <span>Created: {apiKey.created.toLocaleDateString()}</span>
                    <span>Last used: {apiKey.lastUsed.toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge className={apiKey.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                    {apiKey.status}
                  </Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCopyKey(apiKey.key)}
                  >
                    {copiedKey === apiKey.key ? "Copied!" : <Copy size={16} />}
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <Button className="mt-4 bg-blue-600 hover:bg-blue-700">Generate New API Key</Button>
        </Card>

        {/* Endpoints */}
        <Card className="p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Globe size={24} />
            REST Endpoints
          </h2>

          <div className="space-y-3">
            {endpoints.map((endpoint, idx) => (
              <div key={idx} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
                <Badge className={getMethodColor(endpoint.method)}>{endpoint.method}</Badge>
                <code className="flex-1 text-sm text-gray-900 font-mono">{endpoint.path}</code>
                <p className="text-sm text-gray-600 hidden md:block">{endpoint.description}</p>
                {endpoint.auth && <Lock size={16} className="text-gray-600" />}
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-900">
              📚 <strong>Full API Reference:</strong> Visit our <a href="#" className="underline font-semibold">complete API documentation</a> for detailed request/response examples.
            </p>
          </div>
        </Card>

        {/* Webhooks */}
        <Card className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Webhooks</h2>

          <div className="space-y-3">
            {webhooks.map((webhook, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex-1">
                  <p className="font-medium text-gray-900 font-mono text-sm">{webhook.event}</p>
                  <p className="text-sm text-gray-600">{webhook.description}</p>
                </div>

                <div className="flex items-center gap-3">
                  <Badge className={webhook.active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                    {webhook.active ? "Active" : "Inactive"}
                  </Badge>
                  <Button size="sm" variant="outline">
                    Configure
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-900">
              ⚡ <strong>Webhook URL:</strong> Configure your webhook endpoint in Settings → Integrations
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
