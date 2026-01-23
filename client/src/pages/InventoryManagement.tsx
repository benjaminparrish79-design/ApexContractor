import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, Barcode, AlertTriangle, TrendingDown, Plus, ShoppingCart } from "lucide-react";

/**
 * Inventory & Materials Management - Track materials, suppliers, barcode scanning
 */
export default function InventoryManagement() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const inventory = [
    {
      id: 1,
      name: "Oak Plywood 3/4\"",
      sku: "OAK-PLY-34",
      category: "lumber",
      quantity: 45,
      unit: "sheets",
      reorderLevel: 20,
      cost: 65,
      supplier: "Home Depot",
      lastOrdered: new Date(2026, 0, 10),
    },
    {
      id: 2,
      name: "Drywall Screws 1.25\"",
      sku: "DRY-SCR-125",
      category: "hardware",
      quantity: 8,
      unit: "boxes",
      reorderLevel: 10,
      cost: 12,
      supplier: "Lowes",
      lastOrdered: new Date(2026, 0, 5),
    },
    {
      id: 3,
      name: "Paint - Eggshell White",
      sku: "PAINT-EGG-WHT",
      category: "paint",
      quantity: 12,
      unit: "gallons",
      reorderLevel: 5,
      cost: 35,
      supplier: "Benjamin Moore",
      lastOrdered: new Date(2026, 0, 15),
    },
    {
      id: 4,
      name: "Cabinet Hinges - Chrome",
      sku: "CAB-HINGE-CHR",
      category: "hardware",
      quantity: 3,
      unit: "boxes",
      reorderLevel: 5,
      cost: 28,
      supplier: "Acme Hardware",
      lastOrdered: new Date(2025, 11, 20),
    },
    {
      id: 5,
      name: "Granite Countertop",
      sku: "GRAN-CT-BLK",
      category: "materials",
      quantity: 2,
      unit: "slabs",
      reorderLevel: 1,
      cost: 450,
      supplier: "Stone Depot",
      lastOrdered: new Date(2026, 0, 1),
    },
  ];

  const categories = [
    { id: "all", name: "All Materials", count: 5 },
    { id: "lumber", name: "Lumber", count: 1 },
    { id: "hardware", name: "Hardware", count: 2 },
    { id: "paint", name: "Paint", count: 1 },
    { id: "materials", name: "Materials", count: 1 },
  ];

  const suppliers = [
    { name: "Home Depot", items: 12, totalSpent: 2400 },
    { name: "Lowes", items: 8, totalSpent: 1800 },
    { name: "Benjamin Moore", items: 5, totalSpent: 950 },
    { name: "Acme Hardware", items: 6, totalSpent: 1200 },
  ];

  const getNeedReorderStatus = (quantity: number, reorderLevel: number) => {
    if (quantity <= reorderLevel) {
      return { status: "critical", color: "bg-red-100 text-red-800", icon: AlertTriangle };
    }
    if (quantity <= reorderLevel * 1.5) {
      return { status: "low", color: "bg-yellow-100 text-yellow-800", icon: TrendingDown };
    }
    return { status: "ok", color: "bg-green-100 text-green-800", icon: null };
  };

  const filteredInventory =
    selectedCategory === "all"
      ? inventory
      : inventory.filter((item) => item.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <Package size={36} />
              Inventory Management
            </h1>
            <p className="text-gray-600">Track materials, suppliers, and reorder levels</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
            <Plus size={16} />
            Add Item
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
          {/* Categories */}
          <div className="lg:col-span-1">
            <Card className="p-4">
              <h3 className="font-bold text-gray-900 mb-3">Categories</h3>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`w-full text-left p-2 rounded-lg transition-colors ${
                      selectedCategory === cat.id
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                    }`}
                  >
                    <p className="font-medium text-sm">{cat.name}</p>
                    <p className="text-xs opacity-75">{cat.count} items</p>
                  </button>
                ))}
              </div>
            </Card>
          </div>

          {/* Inventory List */}
          <div className="lg:col-span-3">
            <Card className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Materials</h2>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-gray-200">
                    <tr>
                      <th className="text-left py-2 px-3 font-semibold text-gray-900">Item</th>
                      <th className="text-left py-2 px-3 font-semibold text-gray-900">SKU</th>
                      <th className="text-center py-2 px-3 font-semibold text-gray-900">Qty</th>
                      <th className="text-center py-2 px-3 font-semibold text-gray-900">Status</th>
                      <th className="text-left py-2 px-3 font-semibold text-gray-900">Supplier</th>
                      <th className="text-right py-2 px-3 font-semibold text-gray-900">Cost</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredInventory.map((item) => {
                      const status = getNeedReorderStatus(item.quantity, item.reorderLevel);
                      return (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="py-3 px-3">
                            <p className="font-medium text-gray-900">{item.name}</p>
                          </td>
                          <td className="py-3 px-3">
                            <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                              {item.sku}
                            </code>
                          </td>
                          <td className="py-3 px-3 text-center">
                            {item.quantity} {item.unit}
                          </td>
                          <td className="py-3 px-3 text-center">
                            <Badge className={status.color}>{status.status}</Badge>
                          </td>
                          <td className="py-3 px-3">{item.supplier}</td>
                          <td className="py-3 px-3 text-right font-medium text-gray-900">
                            ${item.cost}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Reorder Alerts */}
          <Card className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <AlertTriangle className="text-red-600" size={20} />
              Items to Reorder
            </h3>

            <div className="space-y-3">
              {inventory
                .filter((item) => item.quantity <= item.reorderLevel * 1.5)
                .map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-xs text-gray-600">
                        {item.quantity} {item.unit} (Reorder at {item.reorderLevel})
                      </p>
                    </div>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 flex items-center gap-1">
                      <ShoppingCart size={14} />
                      Order
                    </Button>
                  </div>
                ))}
            </div>
          </Card>

          {/* Top Suppliers */}
          <Card className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Top Suppliers</h3>

            <div className="space-y-3">
              {suppliers.map((supplier, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div>
                    <p className="font-medium text-gray-900">{supplier.name}</p>
                    <p className="text-xs text-gray-600">{supplier.items} items ordered</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">${supplier.totalSpent}</p>
                    <p className="text-xs text-gray-600">Total spent</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
