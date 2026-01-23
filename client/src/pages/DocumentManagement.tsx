import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Upload, Signature, Download, Share2, Lock, CheckCircle } from "lucide-react";

/**
 * Document Management - Contracts, signatures, templates, versioning
 */
export default function DocumentManagement() {
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);

  const documents = [
    {
      id: "doc_1",
      name: "Kitchen Renovation Contract",
      type: "contract",
      client: "John Anderson",
      status: "signed",
      createdDate: new Date(2026, 0, 10),
      signedDate: new Date(2026, 0, 12),
      version: 2,
    },
    {
      id: "doc_2",
      name: "Bathroom Remodel Agreement",
      type: "contract",
      client: "Sarah Mitchell",
      status: "pending-signature",
      createdDate: new Date(2026, 0, 15),
      signedDate: null,
      version: 1,
    },
    {
      id: "doc_3",
      name: "Change Order #1 - Kitchen",
      type: "change-order",
      client: "John Anderson",
      status: "signed",
      createdDate: new Date(2026, 0, 20),
      signedDate: new Date(2026, 0, 21),
      version: 1,
    },
    {
      id: "doc_4",
      name: "Deck Construction Proposal",
      type: "proposal",
      client: "Mike Brown",
      status: "draft",
      createdDate: new Date(2026, 0, 18),
      signedDate: null,
      version: 3,
    },
  ];

  const templates = [
    { id: "tmpl_1", name: "Standard Contract", category: "contract", fields: 12 },
    { id: "tmpl_2", name: "Change Order", category: "change-order", fields: 8 },
    { id: "tmpl_3", name: "Proposal Template", category: "proposal", fields: 15 },
    { id: "tmpl_4", name: "Warranty Agreement", category: "warranty", fields: 6 },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "signed":
        return "bg-green-100 text-green-800";
      case "pending-signature":
        return "bg-yellow-100 text-yellow-800";
      case "draft":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "signed":
        return <CheckCircle className="text-green-600" size={16} />;
      case "pending-signature":
        return <Signature className="text-yellow-600" size={16} />;
      default:
        return <FileText className="text-gray-600" size={16} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <FileText size={36} />
            Document Management
          </h1>
          <p className="text-gray-600">Manage contracts, proposals, and digital signatures</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Documents List */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Recent Documents</h2>
                <Button className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
                  <Upload size={16} />
                  Upload Document
                </Button>
              </div>

              <div className="space-y-3">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    onClick={() => setSelectedDoc(doc.id)}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(doc.status)}
                        <div>
                          <p className="font-medium text-gray-900">{doc.name}</p>
                          <p className="text-sm text-gray-600">{doc.client}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <Badge className={getStatusColor(doc.status)}>
                          {doc.status === "signed" && "Signed"}
                          {doc.status === "pending-signature" && "Pending"}
                          {doc.status === "draft" && "Draft"}
                        </Badge>
                        <p className="text-xs text-gray-600 mt-1">v{doc.version}</p>
                      </div>

                      <Button size="sm" variant="outline">
                        <Download size={16} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Document Details */}
            {selectedDoc && (
              <Card className="p-6 bg-blue-50 border-blue-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Document Actions</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Button variant="outline" className="flex items-center gap-2">
                    <Signature size={16} />
                    Request Signature
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Download size={16} />
                    Download
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Share2 size={16} />
                    Share
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Lock size={16} />
                    Archive
                  </Button>
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Templates */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Templates</h3>
              <div className="space-y-2">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 cursor-pointer transition-colors"
                  >
                    <p className="font-medium text-gray-900 text-sm">{template.name}</p>
                    <p className="text-xs text-gray-600">{template.fields} fields</p>
                  </div>
                ))}
              </div>
              <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700">
                Create from Template
              </Button>
            </Card>

            {/* Statistics */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Documents</span>
                  <span className="font-bold text-lg text-gray-900">24</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Signed</span>
                  <span className="font-bold text-lg text-green-600">18</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Pending</span>
                  <span className="font-bold text-lg text-yellow-600">4</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Drafts</span>
                  <span className="font-bold text-lg text-gray-600">2</span>
                </div>
              </div>
            </Card>

            {/* Security Notice */}
            <Card className="p-4 bg-green-50 border-green-200">
              <div className="flex items-start gap-3">
                <Lock className="text-green-600 mt-1" size={20} />
                <div>
                  <p className="font-medium text-green-900 text-sm">Secure & Encrypted</p>
                  <p className="text-xs text-green-800 mt-1">
                    All documents are encrypted and stored securely with audit trails.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
