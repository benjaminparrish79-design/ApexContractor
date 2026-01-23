import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Loader2, Sparkles, Download } from "lucide-react";
import { trpc } from "@/lib/trpc";

/**
 * AI Invoice Assistant - Generate invoices using AI
 */
export default function AIInvoiceAssistant() {
  const [step, setStep] = useState<"input" | "preview" | "complete">("input");
  const [projectDescription, setProjectDescription] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedInvoice, setGeneratedInvoice] = useState<any>(null);

  const generateInvoice = async () => {
    if (!projectDescription.trim()) {
      alert("Please describe your project");
      return;
    }

    setIsGenerating(true);
    try {
      // Call AI assistant to generate invoice
      const response = await fetch("/api/trpc/ai.generateInvoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: projectDescription }),
      });

      const data = await response.json();
      if (data.result?.data) {
        setGeneratedInvoice(data.result.data);
        setStep("preview");
      }
    } catch (error) {
      console.error("Error generating invoice:", error);
      alert("Failed to generate invoice");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    // Generate PDF and download
    alert("Downloading invoice PDF...");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="text-blue-600" size={32} />
            <h1 className="text-4xl font-bold text-gray-900">AI Invoice Assistant</h1>
          </div>
          <p className="text-gray-600">Generate professional invoices in seconds using AI</p>
        </div>

        {/* Step 1: Input */}
        {step === "input" && (
          <Card className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Describe Your Project</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Description
                </label>
                <Textarea
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  placeholder="Example: Kitchen renovation project for residential client. Includes demolition, new cabinets, countertops, flooring, and painting. Project duration: 3 weeks. Materials cost: $5,000. Labor: 120 hours at $75/hour."
                  className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                  💡 <strong>Tip:</strong> The more details you provide, the better the AI can generate line items, pricing, and tax calculations.
                </p>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={generateInvoice}
                  disabled={isGenerating || !projectDescription.trim()}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-2"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles size={18} />
                      Generate Invoice with AI
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Step 2: Preview */}
        {step === "preview" && generatedInvoice && (
          <Card className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Review Generated Invoice</h2>

            <div className="bg-gray-50 p-6 rounded-lg mb-6 border border-gray-200">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-xs text-gray-600 uppercase">Invoice Number</p>
                  <p className="text-lg font-bold text-gray-900">{generatedInvoice.invoiceNumber}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 uppercase">Date</p>
                  <p className="text-lg font-bold text-gray-900">
                    {new Date().toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Line Items</h3>
                <div className="space-y-2">
                  {generatedInvoice.lineItems?.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between text-gray-700">
                      <span>{item.description}</span>
                      <span className="font-medium">${item.amount.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-300 pt-4 space-y-2">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal:</span>
                  <span>${generatedInvoice.subtotal?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Tax ({generatedInvoice.taxRate}%):</span>
                  <span>${generatedInvoice.taxAmount?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-gray-900">
                  <span>Total:</span>
                  <span>${generatedInvoice.total?.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                onClick={handleDownload}
                className="flex-1 bg-green-600 hover:bg-green-700 flex items-center justify-center gap-2"
              >
                <Download size={18} />
                Download PDF
              </Button>
              <Button
                onClick={() => setStep("input")}
                variant="outline"
                className="flex-1"
              >
                Generate Another
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
