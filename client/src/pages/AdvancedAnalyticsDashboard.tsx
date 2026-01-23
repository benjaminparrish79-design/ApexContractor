import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { trpc } from '../lib/trpc';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, AlertTriangle, DollarSign, Users } from 'lucide-react';

export function AdvancedAnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState<'month' | 'quarter' | 'year'>('month');

  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ['advancedAnalytics', timeRange],
    queryFn: () => trpc.snowflakeSync.getAdvancedAnalytics.query({}),
  });

  const { data: insights, isLoading: insightsLoading } = useQuery({
    queryKey: ['predictiveInsights'],
    queryFn: () => trpc.snowflakeSync.getPredictiveInsights.query(),
  });

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Advanced Analytics Dashboard</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setTimeRange('month')}
            className={`px-4 py-2 rounded ${timeRange === 'month' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Month
          </button>
          <button
            onClick={() => setTimeRange('quarter')}
            className={`px-4 py-2 rounded ${timeRange === 'quarter' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Quarter
          </button>
          <button
            onClick={() => setTimeRange('year')}
            className={`px-4 py-2 rounded ${timeRange === 'year' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Year
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Revenue</p>
              <p className="text-2xl font-bold text-blue-600">$125,430</p>
            </div>
            <DollarSign size={32} className="text-blue-600 opacity-20" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Profit Margin</p>
              <p className="text-2xl font-bold text-green-600">34.2%</p>
            </div>
            <TrendingUp size={32} className="text-green-600 opacity-20" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Active Projects</p>
              <p className="text-2xl font-bold text-purple-600">12</p>
            </div>
            <Users size={32} className="text-purple-600 opacity-20" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Cash Flow Risk</p>
              <p className="text-2xl font-bold text-orange-600">Medium</p>
            </div>
            <AlertTriangle size={32} className="text-orange-600 opacity-20" />
          </div>
        </div>
      </div>

      {/* Revenue Trends */}
      {analyticsLoading ? (
        <div className="bg-white p-6 rounded-lg shadow-md">Loading revenue data...</div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Revenue Trends</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics?.revenueByMonth || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Project Profitability */}
      {analyticsLoading ? (
        <div className="bg-white p-6 rounded-lg shadow-md">Loading project data...</div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Project Profitability</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics?.projectProfitability || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="NAME" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue" fill="#10b981" />
              <Bar dataKey="expenses" fill="#ef4444" />
              <Bar dataKey="profit" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Team Productivity */}
      {analyticsLoading ? (
        <div className="bg-white p-6 rounded-lg shadow-md">Loading team data...</div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Team Productivity</h2>
          <div className="space-y-4">
            {analytics?.teamProductivity?.map((member: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded">
                <div>
                  <p className="font-semibold">{member.NAME}</p>
                  <p className="text-sm text-gray-600">{member.hours_worked} hours worked</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">${member.total_earned}</p>
                  <p className="text-sm text-gray-600">{member.total_hours} billable hours</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Predictive Insights */}
      {insightsLoading ? (
        <div className="bg-white p-6 rounded-lg shadow-md">Loading insights...</div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Revenue Forecast</h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={insights?.revenueForecast || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="avg_invoice_value" stroke="#8b5cf6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Cash Flow Risk Analysis</h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={insights?.cashFlowRisk || []}
                  dataKey="amount"
                  nameKey="STATUS"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                >
                  {insights?.cashFlowRisk?.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
