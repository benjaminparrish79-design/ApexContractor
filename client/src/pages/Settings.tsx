import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/_core/hooks/useAuth";
import { Settings as SettingsIcon, Bell, Lock, Palette } from "lucide-react";

/**
 * Settings - User preferences and account management
 */
export default function Settings() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"account" | "notifications" | "preferences">("account");
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    alert("Settings saved!");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">Manage your account and preferences</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200">
          {[
            { id: "account", label: "Account", icon: SettingsIcon },
            { id: "notifications", label: "Notifications", icon: Bell },
            { id: "preferences", label: "Preferences", icon: Palette },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 font-medium flex items-center gap-2 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Account Settings */}
        {activeTab === "account" && (
          <Card className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Account Information</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <Input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+1 (555) 000-0000"
                />
              </div>

              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Security</h3>
                <Button variant="outline" className="flex items-center gap-2">
                  <Lock size={18} />
                  Change Password
                </Button>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Two-Factor Authentication</h3>
                <p className="text-gray-600 mb-4">
                  Add an extra layer of security to your account
                </p>
                <Button variant="outline">Enable 2FA</Button>
              </div>

              <div className="flex gap-4 pt-6">
                <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
                  Save Changes
                </Button>
                <Button variant="outline">Cancel</Button>
              </div>
            </div>
          </Card>
        )}

        {/* Notification Settings */}
        {activeTab === "notifications" && (
          <Card className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Notification Preferences</h2>

            <div className="space-y-4">
              {[
                { label: "Invoice sent", description: "Get notified when you send an invoice" },
                { label: "Payment received", description: "Get notified when a payment is received" },
                { label: "Invoice overdue", description: "Get notified when an invoice is overdue" },
                { label: "Project update", description: "Get notified when a project is updated" },
                { label: "Team activity", description: "Get notified about team member activity" },
                { label: "Weekly summary", description: "Receive a weekly summary of your business" },
              ].map((notification, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{notification.label}</p>
                    <p className="text-sm text-gray-600">{notification.description}</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-5 h-5 rounded" />
                </div>
              ))}
            </div>

            <div className="flex gap-4 pt-6">
              <Button className="bg-blue-600 hover:bg-blue-700">Save Preferences</Button>
              <Button variant="outline">Cancel</Button>
            </div>
          </Card>
        )}

        {/* Preferences */}
        {activeTab === "preferences" && (
          <Card className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Preferences</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
                <div className="flex gap-4">
                  {["Light", "Dark", "Auto"].map((theme) => (
                    <button
                      key={theme}
                      className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                        theme === "Light"
                          ? "border-blue-600 bg-blue-50 text-blue-600"
                          : "border-gray-200 text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      {theme}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>USD ($)</option>
                  <option>EUR (€)</option>
                  <option>GBP (£)</option>
                  <option>CAD ($)</option>
                  <option>AUD ($)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>English</option>
                  <option>Spanish</option>
                  <option>French</option>
                  <option>German</option>
                  <option>Portuguese</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date Format</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>MM/DD/YYYY</option>
                  <option>DD/MM/YYYY</option>
                  <option>YYYY-MM-DD</option>
                </select>
              </div>

              <div className="flex gap-4 pt-6">
                <Button className="bg-blue-600 hover:bg-blue-700">Save Preferences</Button>
                <Button variant="outline">Cancel</Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
