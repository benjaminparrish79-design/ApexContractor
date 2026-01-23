import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Toggle } from "@/components/ui/toggle";
import { ExternalLink, CheckCircle, AlertCircle } from "lucide-react";

/**
 * Integrations - Manage third-party service connections
 */
export default function Integrations() {
  const [integrations, setIntegrations] = useState([
    {
      id: "slack",
      name: "Slack",
      description: "Get notifications in Slack when invoices are sent or payments received",
      icon: "🔔",
      status: "disconnected",
      features: ["Invoice notifications", "Payment alerts", "Project updates"],
    },
    {
      id: "google-calendar",
      name: "Google Calendar",
      description: "Sync project deadlines and milestones to your Google Calendar",
      icon: "📅",
      status: "disconnected",
      features: ["Project deadlines", "Milestones", "Team events"],
    },
    {
      id: "quickbooks",
      name: "QuickBooks",
      description: "Sync invoices and payments to QuickBooks for accounting",
      icon: "💼",
      status: "disconnected",
      features: ["Invoice sync", "Payment sync", "Expense tracking"],
    },
    {
      id: "zapier",
      name: "Zapier",
      description: "Connect ContractorPro to 1000+ apps with Zapier",
      icon: "⚡",
      status: "disconnected",
      features: ["Custom workflows", "App automation", "Data sync"],
    },
    {
      id: "twilio",
      name: "Twilio (SMS)",
      description: "Send SMS notifications for payment reminders and updates",
      icon: "📱",
      status: "disconnected",
      features: ["Payment reminders", "Invoice alerts", "Team notifications"],
    },
    {
      id: "stripe",
      name: "Stripe",
      description: "Accept online payments directly in ContractorPro",
      icon: "💳",
      status: "connected",
      features: ["Online payments", "Payment tracking", "Automatic invoicing"],
    },
  ]);

  const handleConnect = (id: string) => {
    setIntegrations((prev) =>
      prev.map((int) =>
        int.id === id ? { ...int, status: int.status === "connected" ? "disconnected" : "connected" } : int
      )
    );
  };

  const connected = integrations.filter((i) => i.status === "connected").length;
  const disconnected = integrations.filter((i) => i.status === "disconnected").length;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Integrations</h1>
          <p className="text-gray-600">Connect ContractorPro with your favorite tools</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Connected Services</p>
                <p className="text-3xl font-bold text-green-600">{connected}</p>
              </div>
              <CheckCircle size={40} className="text-green-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Available to Connect</p>
                <p className="text-3xl font-bold text-gray-900">{disconnected}</p>
              </div>
              <AlertCircle size={40} className="text-gray-400" />
            </div>
          </Card>
        </div>

        {/* Integrations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {integrations.map((integration) => (
            <Card key={integration.id} className="p-6 flex flex-col">
              <div className="flex items-start justify-between mb-4">
                <div className="text-4xl">{integration.icon}</div>
                <Badge
                  variant={integration.status === "connected" ? "default" : "secondary"}
                  className={integration.status === "connected" ? "bg-green-600" : ""}
                >
                  {integration.status === "connected" ? "Connected" : "Disconnected"}
                </Badge>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">{integration.name}</h3>
              <p className="text-sm text-gray-600 mb-4 flex-1">{integration.description}</p>

              <div className="mb-6">
                <p className="text-xs font-medium text-gray-700 mb-2">Features:</p>
                <ul className="space-y-1">
                  {integration.features.map((feature, idx) => (
                    <li key={idx} className="text-xs text-gray-600 flex items-center gap-2">
                      <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => handleConnect(integration.id)}
                  className={`flex-1 ${
                    integration.status === "connected"
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {integration.status === "connected" ? "Disconnect" : "Connect"}
                </Button>
                <Button variant="outline" size="icon">
                  <ExternalLink size={18} />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Additional Info */}
        <Card className="p-6 mt-8 bg-blue-50 border-blue-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Need More Integrations?</h3>
          <p className="text-gray-700 mb-4">
            We're constantly adding new integrations. Can't find what you need? Contact our team or suggest an integration.
          </p>
          <Button variant="outline">Request Integration</Button>
        </Card>
      </div>
    </div>
  );
}
