import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { trpc } from '../lib/trpc';
import { Plus, Trash2, MapPin, Package } from 'lucide-react';

export function Inventory() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    projectId: 0,
    itemName: '',
    category: 'Tools',
    quantity: 1,
    unit: 'pcs',
    unitCost: 0,
    qrCode: '',
    rfidTag: '',
    currentLocation: '',
    notes: '',
  });

  const { data: inventory, isLoading, refetch } = useQuery({
    queryKey: ['inventory'],
    queryFn: () => trpc.inventory.list.query(),
  });

  const { data: summary } = useQuery({
    queryKey: ['inventorySummary'],
    queryFn: () => trpc.inventory.getSummary.query(),
  });

  const createMutation = useMutation({
    mutationFn: (data: typeof formData) => trpc.inventory.create.mutate(data),
    onSuccess: () => {
      refetch();
      setShowForm(false);
      setFormData({
        projectId: 0,
        itemName: '',
        category: 'Tools',
        quantity: 1,
        unit: 'pcs',
        unitCost: 0,
        qrCode: '',
        rfidTag: '',
        currentLocation: '',
        notes: '',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => trpc.inventory.delete.mutate({ id }),
    onSuccess: () => refetch(),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Inventory & Asset Tracking</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus size={20} />
          Add Item
        </button>
      </div>

      {summary && (
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <p className="text-gray-600 text-sm">Total Items</p>
            <p className="text-2xl font-bold text-blue-600">{summary.totalItems}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <p className="text-gray-600 text-sm">Total Value</p>
            <p className="text-2xl font-bold text-green-600">${summary.totalValue}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <p className="text-gray-600 text-sm">Available</p>
            <p className="text-2xl font-bold text-yellow-600">{summary.byStatus.available || 0}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <p className="text-gray-600 text-sm">In Use</p>
            <p className="text-2xl font-bold text-orange-600">{summary.byStatus.in_use || 0}</p>
          </div>
        </div>
      )}

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Add Inventory Item</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Item Name"
                value={formData.itemName}
                onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                className="border rounded px-3 py-2"
                required
              />
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="border rounded px-3 py-2"
              >
                <option>Tools</option>
                <option>Equipment</option>
                <option>Materials</option>
                <option>Vehicles</option>
                <option>Other</option>
              </select>
              <input
                type="number"
                placeholder="Quantity"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                className="border rounded px-3 py-2"
                required
              />
              <input
                type="text"
                placeholder="Unit (pcs, kg, m3)"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="border rounded px-3 py-2"
              />
              <input
                type="number"
                placeholder="Unit Cost"
                value={formData.unitCost}
                onChange={(e) => setFormData({ ...formData, unitCost: parseFloat(e.target.value) })}
                className="border rounded px-3 py-2"
                required
              />
              <input
                type="text"
                placeholder="Current Location"
                value={formData.currentLocation}
                onChange={(e) => setFormData({ ...formData, currentLocation: e.target.value })}
                className="border rounded px-3 py-2"
                required
              />
              <input
                type="text"
                placeholder="QR Code"
                value={formData.qrCode}
                onChange={(e) => setFormData({ ...formData, qrCode: e.target.value })}
                className="border rounded px-3 py-2"
              />
              <input
                type="text"
                placeholder="RFID Tag"
                value={formData.rfidTag}
                onChange={(e) => setFormData({ ...formData, rfidTag: e.target.value })}
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
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Save Item
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

      {isLoading ? (
        <div className="text-center py-12">Loading inventory...</div>
      ) : (
        <div className="space-y-4">
          {inventory?.map((item) => (
            <div key={item.id} className="bg-white p-4 rounded-lg shadow-md flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Package size={20} className="text-blue-600" />
                  <h3 className="font-semibold text-lg">{item.itemName}</h3>
                  <span className={`px-2 py-1 rounded text-sm font-medium ${
                    item.status === 'available' ? 'bg-green-100 text-green-800' :
                    item.status === 'in_use' ? 'bg-orange-100 text-orange-800' :
                    item.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {item.status}
                  </span>
                </div>
                <p className="text-gray-600">{item.quantity} {item.unit} - {item.category}</p>
                <div className="flex items-center gap-2 text-gray-500 text-sm mt-2">
                  <MapPin size={16} />
                  <span>{item.currentLocation}</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">Value: ${(parseFloat(item.totalValue as any) || 0).toFixed(2)}</p>
                {item.qrCode && <p className="text-xs text-gray-400 mt-1">QR: {item.qrCode}</p>}
              </div>
              <button
                onClick={() => deleteMutation.mutate(item.id)}
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
