import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { trpc } from '../lib/trpc';
import { AlertCircle, Plus, Trash2, TrendingDown } from 'lucide-react';

export function CarbonAccounting() {
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    projectId: 0,
    materialName: '',
    quantity: 0,
    unit: 'kg',
    carbonEmissionsPerUnit: 0,
    category: 'Concrete',
    supplier: '',
    certificationLevel: '',
    notes: '',
  });

  const { data: records, isLoading, refetch } = useQuery({
    queryKey: ['carbonAccounting'],
    queryFn: () => trpc.carbonAccounting.list.query(),
  });

  const { data: projectSummary } = useQuery({
    queryKey: ['carbonSummary', selectedProject],
    queryFn: () => selectedProject ? trpc.carbonAccounting.getProjectCarbonSummary.query({ projectId: selectedProject }) : null,
    enabled: !!selectedProject,
  });

  const { data: complianceReport } = useQuery({
    queryKey: ['complianceReport', selectedProject],
    queryFn: () => selectedProject ? trpc.carbonAccounting.getComplianceReport.query({ projectId: selectedProject }) : null,
    enabled: !!selectedProject,
  });

  const createMutation = useMutation({
    mutationFn: (data: typeof formData) => trpc.carbonAccounting.create.mutate(data),
    onSuccess: () => {
      refetch();
      setShowForm(false);
      setFormData({
        projectId: 0,
        materialName: '',
        quantity: 0,
        unit: 'kg',
        carbonEmissionsPerUnit: 0,
        category: 'Concrete',
        supplier: '',
        certificationLevel: '',
        notes: '',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => trpc.carbonAccounting.delete.mutate({ id }),
    onSuccess: () => refetch(),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Carbon Accounting</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          <Plus size={20} />
          Add Material
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Record Material Carbon Footprint</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Material Name"
                value={formData.materialName}
                onChange={(e) => setFormData({ ...formData, materialName: e.target.value })}
                className="border rounded px-3 py-2"
                required
              />
              <select
                value={formData.projectId}
                onChange={(e) => setFormData({ ...formData, projectId: parseInt(e.target.value) })}
                className="border rounded px-3 py-2"
                required
              >
                <option value="">Select Project</option>
                {/* Projects would be fetched here */}
              </select>
              <input
                type="number"
                placeholder="Quantity"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseFloat(e.target.value) })}
                className="border rounded px-3 py-2"
                required
              />
              <input
                type="text"
                placeholder="Unit (kg, ton, m3)"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="border rounded px-3 py-2"
              />
              <input
                type="number"
                placeholder="Carbon Emissions per Unit (kg CO2e)"
                value={formData.carbonEmissionsPerUnit}
                onChange={(e) => setFormData({ ...formData, carbonEmissionsPerUnit: parseFloat(e.target.value) })}
                className="border rounded px-3 py-2"
                required
              />
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="border rounded px-3 py-2"
              >
                <option>Concrete</option>
                <option>Steel</option>
                <option>Wood</option>
                <option>Insulation</option>
                <option>Other</option>
              </select>
              <input
                type="text"
                placeholder="Supplier"
                value={formData.supplier}
                onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                className="border rounded px-3 py-2"
              />
              <input
                type="text"
                placeholder="Certification Level (e.g., LEED)"
                value={formData.certificationLevel}
                onChange={(e) => setFormData({ ...formData, certificationLevel: e.target.value })}
                className="border rounded px-3 py-2"
              />
            </div>
            <textarea
              placeholder="Notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="border rounded px-3 py-2 w-full"
              rows={3}
            />
            <div className="flex gap-2">
              <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                Save Material
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {complianceReport && (
        <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg shadow-md border-l-4 border-green-600">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">ESG Compliance Report</h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-gray-600">Project</p>
              <p className="text-xl font-semibold">{complianceReport.projectName}</p>
            </div>
            <div>
              <p className="text-gray-600">Total Carbon Emissions</p>
              <p className="text-xl font-semibold text-red-600">{complianceReport.totalCarbonEmissions} kg CO2e</p>
            </div>
            <div>
              <p className="text-gray-600">Certified Materials</p>
              <p className="text-xl font-semibold text-green-600">{complianceReport.certifiedMaterials} / {complianceReport.totalMaterials}</p>
            </div>
            <div>
              <p className="text-gray-600">Compliance Score</p>
              <p className="text-xl font-semibold text-blue-600">{complianceReport.complianceScore}%</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded">
            <h3 className="font-semibold mb-2">Recommendations</h3>
            <ul className="space-y-2">
              {complianceReport.recommendations.map((rec, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <TrendingDown size={16} className="text-green-600 mt-1 flex-shrink-0" />
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-12">Loading carbon accounting data...</div>
      ) : (
        <div className="space-y-4">
          {records?.map((record) => (
            <div key={record.id} className="bg-white p-4 rounded-lg shadow-md flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg">{record.materialName}</h3>
                <p className="text-gray-600">{record.quantity} {record.unit} - {record.category}</p>
                <p className="text-sm text-gray-500">Supplier: {record.supplier || 'N/A'}</p>
                <p className="text-green-600 font-semibold mt-2">
                  Total Emissions: {record.totalCarbonEmissions} kg CO2e
                </p>
              </div>
              <button
                onClick={() => deleteMutation.mutate(record.id)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
