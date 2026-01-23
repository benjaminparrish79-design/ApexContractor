import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { trpc } from '../lib/trpc';
import { Phone, AlertTriangle, CheckCircle, Clock, TrendingUp } from 'lucide-react';

export function AIReceptionist() {
  const { data: leads, isLoading, refetch } = useQuery({
    queryKey: ['aiLeads'],
    queryFn: () => trpc.aiReceptionist.listLeads.query(),
  });

  const { data: stats } = useQuery({
    queryKey: ['aiReceptionistStats'],
    queryFn: () => trpc.aiReceptionist.getStats.query(),
  });

  const updateStatusMutation = useMutation({
    mutationFn: (data: { id: number; status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost' }) =>
      trpc.aiReceptionist.updateLeadStatus.mutate(data),
    onSuccess: () => refetch(),
  });

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'emergency':
        return 'bg-red-100 text-red-800';
      case 'urgent':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'converted':
        return <CheckCircle className="text-green-600" size={20} />;
      case 'lost':
        return <AlertTriangle className="text-red-600" size={20} />;
      case 'contacted':
        return <Phone className="text-blue-600" size={20} />;
      default:
        return <Clock className="text-gray-600" size={20} />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">AI Receptionist Dashboard</h1>
        <div className="flex gap-2">
          <a
            href="https://voiceflow.com"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Configure Voice AI
          </a>
        </div>
      </div>

      {/* Performance Stats */}
      {stats && (
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-gray-600 text-sm">Total Leads</p>
            <p className="text-2xl font-bold text-blue-600">{stats.totalLeads}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-gray-600 text-sm">Urgent/Emergency</p>
            <p className="text-2xl font-bold text-red-600">{stats.urgentLeads}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-gray-600 text-sm">Converted</p>
            <p className="text-2xl font-bold text-green-600">{stats.convertedLeads}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-gray-600 text-sm">Conversion Rate</p>
            <p className="text-2xl font-bold text-purple-600">{stats.conversionRate}%</p>
          </div>
        </div>
      )}

      {/* How It Works */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg shadow-md border-l-4 border-blue-600">
        <h2 className="text-xl font-semibold mb-4">How AI Receptionist Works</h2>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <h3 className="font-semibold text-blue-600 mb-2">1. 24/7 Call Handling</h3>
            <p className="text-sm text-gray-700">AI answers calls and qualifies leads automatically, even after hours.</p>
          </div>
          <div>
            <h3 className="font-semibold text-purple-600 mb-2">2. Lead Capture</h3>
            <p className="text-sm text-gray-700">Extracts customer info, project details, and urgency level from conversations.</p>
          </div>
          <div>
            <h3 className="font-semibold text-green-600 mb-2">3. Smart Routing</h3>
            <p className="text-sm text-gray-700">Routes emergencies immediately, schedules estimates, logs routine requests.</p>
          </div>
        </div>
      </div>

      {/* Leads List */}
      {isLoading ? (
        <div className="bg-white p-6 rounded-lg shadow-md text-center">Loading leads...</div>
      ) : (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Recent Leads</h2>
          {leads && leads.length > 0 ? (
            leads.map((lead) => (
              <div key={lead.id} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      {getStatusIcon(lead.status)}
                      <h3 className="text-lg font-semibold">{lead.customerName || 'Unknown Caller'}</h3>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getUrgencyColor(lead.urgency)}`}>
                        {lead.urgency}
                      </span>
                    </div>
                    <p className="text-gray-600">{lead.phoneNumber || 'No phone'}</p>
                    {lead.email && <p className="text-gray-600">{lead.email}</p>}
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">
                      {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : 'Unknown date'}
                    </p>
                  </div>
                </div>

                {lead.serviceType && (
                  <div className="mb-3">
                    <p className="text-sm font-semibold text-gray-700">Service Type: {lead.serviceType}</p>
                  </div>
                )}

                {lead.projectDescription && (
                  <div className="mb-3 p-3 bg-gray-50 rounded">
                    <p className="text-sm text-gray-700">{lead.projectDescription}</p>
                  </div>
                )}

                {lead.aiSummary && (
                  <div className="mb-3 p-3 bg-blue-50 rounded border-l-2 border-blue-600">
                    <p className="text-sm font-semibold text-blue-900 mb-1">AI Summary:</p>
                    <p className="text-sm text-blue-800">{lead.aiSummary}</p>
                  </div>
                )}

                <div className="flex gap-2 mt-4">
                  <select
                    value={lead.status}
                    onChange={(e) =>
                      updateStatusMutation.mutate({
                        id: lead.id,
                        status: e.target.value as any,
                      })
                    }
                    className="border rounded px-3 py-2 text-sm"
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="qualified">Qualified</option>
                    <option value="converted">Converted</option>
                    <option value="lost">Lost</option>
                  </select>
                  {lead.phoneNumber && (
                    <a
                      href={`tel:${lead.phoneNumber}`}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
                    >
                      Call
                    </a>
                  )}
                  {lead.email && (
                    <a
                      href={`mailto:${lead.email}`}
                      className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 text-sm"
                    >
                      Email
                    </a>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white p-6 rounded-lg shadow-md text-center text-gray-500">
              No leads captured yet. Set up your AI Receptionist to start capturing leads!
            </div>
          )}
        </div>
      )}

      {/* Setup Guide */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Quick Setup Guide</h2>
        <ol className="space-y-3 text-sm">
          <li className="flex gap-3">
            <span className="font-bold text-blue-600">1.</span>
            <span>Sign up for <a href="https://voiceflow.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Voiceflow</a> or <a href="https://vapi.ai" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Vapi.ai</a></span>
          </li>
          <li className="flex gap-3">
            <span className="font-bold text-blue-600">2.</span>
            <span>Create an AI voice agent with your business details and services</span>
          </li>
          <li className="flex gap-3">
            <span className="font-bold text-blue-600">3.</span>
            <span>Configure the webhook to send leads to: <code className="bg-gray-100 px-2 py-1 rounded text-xs">/api/trpc/aiReceptionist.createLead</code></span>
          </li>
          <li className="flex gap-3">
            <span className="font-bold text-blue-600">4.</span>
            <span>Set your business phone number to route through the AI system</span>
          </li>
          <li className="flex gap-3">
            <span className="font-bold text-blue-600">5.</span>
            <span>Monitor leads here and follow up with qualified prospects</span>
          </li>
        </ol>
      </div>
    </div>
  );
}
