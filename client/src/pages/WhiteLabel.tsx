import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Palette, Globe, Settings, Copy, Download, Check } from "lucide-react";

/**
 * White-Label Solution - Rebrand for reselling to other contractors
 */
export default function WhiteLabel() {
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const brandingOptions = [
    {
      id: 1,
      name: "Company Name",
      current: "ContractorPro",
      customizable: true,
    },
    {
      id: 2,
      name: "Logo",
      current: "Default Logo",
      customizable: true,
    },
    {
      id: 3,
      name: "Color Scheme",
      current: "Blue/Gray",
      customizable: true,
    },
    {
      id: 4,
      name: "Domain",
      current: "contractorpro.onrender.com",
      customizable: true,
    },
    {
      id: 5,
      name: "Email Branding",
      current: "noreply@contractorpro.com",
      customizable: true,
    },
    {
      id: 6,
      name: "Support Email",
      current: "support@contractorpro.com",
      customizable: true,
    },
  ];

  const resellPlans = [
    {
      id: 1,
      name: "Starter",
      price: "$99",
      period: "/month",
      features: [
        "Up to 10 clients",
        "Basic invoicing",
        "Email support",
        "Your branding",
        "Basic analytics",
      ],
      margin: "40%",
    },
    {
      id: 2,
      name: "Professional",
      price: "$199",
      period: "/month",
      features: [
        "Up to 50 clients",
        "Advanced invoicing",
        "Priority support",
        "Custom domain",
        "Advanced analytics",
        "Team management",
      ],
      margin: "45%",
      popular: true,
    },
    {
      id: 3,
      name: "Enterprise",
      price: "$499",
      period: "/month",
      features: [
        "Unlimited clients",
        "All features",
        "24/7 phone support",
        "Custom branding",
        "White-label API",
        "Dedicated account manager",
      ],
      margin: "50%",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <Palette size={36} />
            White-Label Solution
          </h1>
          <p className="text-gray-600">Rebrand and resell ContractorPro to your clients</p>
        </div>

        {/* Branding Configuration */}
        <Card className="p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Settings className="text-blue-600" size={24} />
            Branding Configuration
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {brandingOptions.map((option) => (
              <div key={option.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-gray-900">{option.name}</p>
                  {option.customizable && (
                    <Badge className="bg-blue-100 text-blue-800">Customizable</Badge>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-3">{option.current}</p>
                <Button size="sm" variant="outline" className="w-full">
                  Edit
                </Button>
              </div>
            ))}
          </div>
        </Card>

        {/* Resell Plans */}
        <Card className="p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Globe className="text-green-600" size={24} />
            Resell Plans & Pricing
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {resellPlans.map((plan) => (
              <div
                key={plan.id}
                className={`p-6 rounded-lg border-2 transition-all ${
                  plan.popular
                    ? "border-blue-600 bg-blue-50 shadow-lg scale-105"
                    : "border-gray-200 bg-white"
                }`}
              >
                {plan.popular && (
                  <Badge className="mb-3 bg-blue-600 text-white">Most Popular</Badge>
                )}

                <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>

                <div className="mb-4">
                  <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-600">{plan.period}</span>
                </div>

                <div className="mb-4 p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-600">Your Margin</p>
                  <p className="text-2xl font-bold text-green-600">{plan.margin}</p>
                </div>

                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                      <Check size={16} className="text-green-600" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button className={plan.popular ? "w-full bg-blue-600 hover:bg-blue-700" : "w-full"}>
                  Activate Plan
                </Button>
              </div>
            ))}
          </div>
        </Card>

        {/* API Keys & Integration */}
        <Card className="p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">API Keys & Integration</h2>

          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">API Key</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 p-2 bg-gray-900 text-green-400 rounded text-sm overflow-x-auto">
                  sk_live_51SpuMiFIg29c2FcX_abc123xyz789
                </code>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleCopy("sk_live_51SpuMiFIg29c2FcX_abc123xyz789")}
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                </Button>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Webhook URL</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 p-2 bg-gray-900 text-green-400 rounded text-sm overflow-x-auto">
                  https://your-domain.com/webhooks/contractor-pro
                </code>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleCopy("https://your-domain.com/webhooks/contractor-pro")}
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                </Button>
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-900">
                ✓ Full API documentation available at /api/documentation
                <br />✓ Webhook events for all business actions
                <br />✓ Custom branding via API parameters
              </p>
            </div>
          </div>
        </Card>

        {/* Export & Deployment */}
        <Card className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Export & Deployment</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button className="h-12 bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-2">
              <Download size={18} />
              Export Branding Config
            </Button>
            <Button className="h-12 bg-green-600 hover:bg-green-700 flex items-center justify-center gap-2">
              <Download size={18} />
              Export Docker Image
            </Button>
          </div>

          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-900 font-medium mb-2">Deployment Instructions:</p>
            <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
              <li>Export branding configuration</li>
              <li>Deploy to your server or cloud platform</li>
              <li>Configure custom domain</li>
              <li>Set up SSL certificate</li>
              <li>Start accepting clients</li>
            </ol>
          </div>
        </Card>
      </div>
    </div>
  );
}
