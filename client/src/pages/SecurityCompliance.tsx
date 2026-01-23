import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Lock, Eye, AlertTriangle, CheckCircle, Key, FileText, Activity } from "lucide-react";

/**
 * Advanced Security & Compliance - 2FA, RBAC, audit logging, GDPR/CCPA compliance
 */
export default function SecurityCompliance() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [selectedTab, setSelectedTab] = useState<"security" | "compliance" | "audit">("security");

  const users = [
    {
      id: 1,
      name: "John Smith",
      email: "john@contractorpro.com",
      role: "admin",
      twoFactorEnabled: true,
      lastLogin: new Date(2026, 0, 21, 9, 30),
      status: "active",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah@contractorpro.com",
      role: "manager",
      twoFactorEnabled: true,
      lastLogin: new Date(2026, 0, 20, 14, 15),
      status: "active",
    },
    {
      id: 3,
      name: "Mike Davis",
      email: "mike@contractorpro.com",
      role: "user",
      twoFactorEnabled: false,
      lastLogin: new Date(2026, 0, 19, 10, 45),
      status: "active",
    },
  ];

  const auditLogs = [
    {
      id: 1,
      user: "John Smith",
      action: "Created invoice #INV-001",
      timestamp: new Date(2026, 0, 21, 10, 30),
      status: "success",
    },
    {
      id: 2,
      user: "Sarah Johnson",
      action: "Updated project status",
      timestamp: new Date(2026, 0, 21, 9, 15),
      status: "success",
    },
    {
      id: 3,
      user: "Mike Davis",
      action: "Failed login attempt",
      timestamp: new Date(2026, 0, 20, 15, 45),
      status: "failure",
    },
    {
      id: 4,
      user: "John Smith",
      action: "Exported financial report",
      timestamp: new Date(2026, 0, 20, 14, 20),
      status: "success",
    },
  ];

  const complianceItems = [
    {
      id: 1,
      name: "GDPR Compliance",
      description: "General Data Protection Regulation (EU)",
      status: "compliant",
      lastAudit: new Date(2026, 0, 15),
    },
    {
      id: 2,
      name: "CCPA Compliance",
      description: "California Consumer Privacy Act",
      status: "compliant",
      lastAudit: new Date(2026, 0, 15),
    },
    {
      id: 3,
      name: "Data Encryption",
      description: "AES-256 encryption for sensitive data",
      status: "compliant",
      lastAudit: new Date(2026, 0, 10),
    },
    {
      id: 4,
      name: "Backup & Disaster Recovery",
      description: "Daily automated backups with 30-day retention",
      status: "compliant",
      lastAudit: new Date(2026, 0, 5),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <Shield size={36} />
            Security & Compliance
          </h1>
          <p className="text-gray-600">
            Two-factor authentication, role-based access, audit logging, and regulatory compliance
          </p>
        </div>

        {/* Tab Navigation */}
        <Card className="p-4 mb-8">
          <div className="flex gap-2 flex-wrap">
            <Button
              size="sm"
              variant={selectedTab === "security" ? "default" : "outline"}
              onClick={() => setSelectedTab("security")}
              className="flex items-center gap-2"
            >
              <Lock size={16} />
              Security
            </Button>
            <Button
              size="sm"
              variant={selectedTab === "compliance" ? "default" : "outline"}
              onClick={() => setSelectedTab("compliance")}
              className="flex items-center gap-2"
            >
              <FileText size={16} />
              Compliance
            </Button>
            <Button
              size="sm"
              variant={selectedTab === "audit" ? "default" : "outline"}
              onClick={() => setSelectedTab("audit")}
              className="flex items-center gap-2"
            >
              <Activity size={16} />
              Audit Logs
            </Button>
          </div>
        </Card>

        {/* Security Tab */}
        {selectedTab === "security" && (
          <div className="space-y-6">
            {/* 2FA Settings */}
            <Card className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <Key className="text-blue-600" size={24} />
                    Two-Factor Authentication
                  </h2>
                  <p className="text-gray-600 mt-1">Require 2FA for all user accounts</p>
                </div>
                <Button
                  className={twoFactorEnabled ? "bg-green-600 hover:bg-green-700" : "bg-gray-600 hover:bg-gray-700"}
                  onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                >
                  {twoFactorEnabled ? "Enabled" : "Disabled"}
                </Button>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mt-4">
                <p className="text-sm text-blue-900">
                  ✓ Supports authenticator apps (Google Authenticator, Microsoft Authenticator)
                  <br />✓ SMS backup codes available
                  <br />✓ Hardware security key support
                </p>
              </div>
            </Card>

            {/* User Management */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Eye className="text-purple-600" size={24} />
                User Access Control
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-gray-200">
                    <tr>
                      <th className="text-left py-2 px-3 font-semibold text-gray-900">User</th>
                      <th className="text-left py-2 px-3 font-semibold text-gray-900">Role</th>
                      <th className="text-center py-2 px-3 font-semibold text-gray-900">2FA</th>
                      <th className="text-left py-2 px-3 font-semibold text-gray-900">Last Login</th>
                      <th className="text-center py-2 px-3 font-semibold text-gray-900">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="py-3 px-3">
                          <p className="font-medium text-gray-900">{user.name}</p>
                          <p className="text-xs text-gray-600">{user.email}</p>
                        </td>
                        <td className="py-3 px-3">
                          <Badge className="bg-blue-100 text-blue-800 capitalize">{user.role}</Badge>
                        </td>
                        <td className="py-3 px-3 text-center">
                          {user.twoFactorEnabled ? (
                            <CheckCircle className="text-green-600 mx-auto" size={16} />
                          ) : (
                            <AlertTriangle className="text-yellow-600 mx-auto" size={16} />
                          )}
                        </td>
                        <td className="py-3 px-3 text-xs text-gray-600">
                          {user.lastLogin.toLocaleDateString()} {user.lastLogin.toLocaleTimeString()}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <Badge className="bg-green-100 text-green-800">{user.status}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Password Policy */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Lock className="text-red-600" size={24} />
                Password Policy
              </h2>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-900">Minimum password length</span>
                  <Badge className="bg-blue-100 text-blue-800">12 characters</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-900">Require special characters</span>
                  <CheckCircle className="text-green-600" size={16} />
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-900">Password expiration</span>
                  <Badge className="bg-blue-100 text-blue-800">90 days</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-900">Failed login attempts before lockout</span>
                  <Badge className="bg-blue-100 text-blue-800">5 attempts</Badge>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Compliance Tab */}
        {selectedTab === "compliance" && (
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="text-green-600" size={24} />
                Regulatory Compliance
              </h2>

              <div className="space-y-3">
                {complianceItems.map((item) => (
                  <div key={item.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-600">{item.description}</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Compliant</Badge>
                    </div>
                    <p className="text-xs text-gray-600">
                      Last audit: {item.lastAudit.toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Data Rights */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Subject Rights</h2>

              <div className="space-y-3">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="font-medium text-blue-900 mb-1">Right to Access</p>
                  <p className="text-sm text-blue-800">Users can download their personal data in machine-readable format</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="font-medium text-blue-900 mb-1">Right to Deletion</p>
                  <p className="text-sm text-blue-800">Users can request complete deletion of their account and data</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="font-medium text-blue-900 mb-1">Right to Portability</p>
                  <p className="text-sm text-blue-800">Users can export their data to transfer to another service</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Audit Logs Tab */}
        {selectedTab === "audit" && (
          <Card className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Activity className="text-orange-600" size={24} />
              Audit Log
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-gray-200">
                  <tr>
                    <th className="text-left py-2 px-3 font-semibold text-gray-900">User</th>
                    <th className="text-left py-2 px-3 font-semibold text-gray-900">Action</th>
                    <th className="text-left py-2 px-3 font-semibold text-gray-900">Timestamp</th>
                    <th className="text-center py-2 px-3 font-semibold text-gray-900">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50">
                      <td className="py-3 px-3 font-medium text-gray-900">{log.user}</td>
                      <td className="py-3 px-3 text-gray-600">{log.action}</td>
                      <td className="py-3 px-3 text-xs text-gray-600">
                        {log.timestamp.toLocaleDateString()} {log.timestamp.toLocaleTimeString()}
                      </td>
                      <td className="py-3 px-3 text-center">
                        {log.status === "success" ? (
                          <Badge className="bg-green-100 text-green-800">Success</Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-800">Failed</Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
