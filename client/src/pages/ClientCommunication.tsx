import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Send, Paperclip, Phone, Video, MoreVertical } from "lucide-react";

/**
 * Client Communication Hub - Centralized messaging with clients
 */
export default function ClientCommunication() {
  const [selectedClient, setSelectedClient] = useState<number>(1);
  const [messageText, setMessageText] = useState("");

  const clients = [
    {
      id: 1,
      name: "John Anderson",
      company: "Anderson Homes",
      avatar: "JA",
      lastMessage: "Looks great! When can you start?",
      unread: 2,
      status: "online",
    },
    {
      id: 2,
      name: "Sarah Mitchell",
      company: "Mitchell Properties",
      avatar: "SM",
      lastMessage: "Thanks for the update",
      unread: 0,
      status: "offline",
    },
    {
      id: 3,
      name: "Michael Brown",
      company: "Brown Construction",
      avatar: "MB",
      lastMessage: "Can we schedule a call?",
      unread: 1,
      status: "online",
    },
  ];

  const messages = [
    {
      id: 1,
      sender: "client",
      text: "Hi! I'm interested in your kitchen renovation services.",
      timestamp: new Date(Date.now() - 3600000),
    },
    {
      id: 2,
      sender: "user",
      text: "Great! I'd love to help with your kitchen. Can you tell me more about your vision?",
      timestamp: new Date(Date.now() - 3300000),
    },
    {
      id: 3,
      sender: "client",
      text: "We want modern design with stainless steel appliances and granite countertops.",
      timestamp: new Date(Date.now() - 3000000),
    },
    {
      id: 4,
      sender: "user",
      text: "Perfect! I have some great references for similar projects. Can I send you a proposal?",
      timestamp: new Date(Date.now() - 2700000),
    },
    {
      id: 5,
      sender: "client",
      text: "Looks great! When can you start?",
      timestamp: new Date(Date.now() - 1800000),
    },
  ];

  const currentClient = clients.find((c) => c.id === selectedClient) || clients[0];

  const handleSendMessage = () => {
    if (messageText.trim()) {
      console.log("Sending message:", messageText);
      setMessageText("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Client Communication</h1>
          <p className="text-gray-600">Centralized messaging and file sharing with clients</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-[600px]">
          {/* Sidebar - Clients List */}
          <div className="lg:col-span-1 bg-white rounded-lg shadow overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <Input placeholder="Search clients..." className="w-full" />
            </div>

            <div className="flex-1 overflow-y-auto">
              {clients.map((client) => (
                <button
                  key={client.id}
                  onClick={() => setSelectedClient(client.id)}
                  className={`w-full text-left px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                    selectedClient === client.id ? "bg-blue-50 border-l-4 border-l-blue-600" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {client.avatar}
                      </div>
                      <div
                        className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                          client.status === "online" ? "bg-green-500" : "bg-gray-300"
                        }`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{client.name}</p>
                      <p className="text-xs text-gray-600 truncate">{client.company}</p>
                    </div>
                    {client.unread > 0 && (
                      <Badge className="bg-red-600">{client.unread}</Badge>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-3 bg-white rounded-lg shadow flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  {currentClient.avatar}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{currentClient.name}</p>
                  <p className="text-xs text-gray-600">{currentClient.company}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button size="icon" variant="ghost">
                  <Phone size={18} />
                </Button>
                <Button size="icon" variant="ghost">
                  <Video size={18} />
                </Button>
                <Button size="icon" variant="ghost">
                  <MoreVertical size={18} />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      message.sender === "user"
                        ? "bg-blue-600 text-white rounded-br-none"
                        : "bg-gray-100 text-gray-900 rounded-bl-none"
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p
                      className={`text-xs mt-1 ${
                        message.sender === "user" ? "text-blue-100" : "text-gray-600"
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-end gap-2">
                <Button size="icon" variant="ghost">
                  <Paperclip size={18} />
                </Button>

                <Textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 resize-none max-h-24"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && e.ctrlKey) {
                      handleSendMessage();
                    }
                  }}
                />

                <Button
                  onClick={handleSendMessage}
                  disabled={!messageText.trim()}
                  className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
                >
                  <Send size={18} />
                </Button>
              </div>
              <p className="text-xs text-gray-600 mt-2">Press Ctrl+Enter to send</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
