import React, { useState } from 'react';
import { X, Plus, Trash2, Download, Send } from 'lucide-react';
import { Appointment, Bill, BillItem } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { generateBillPDF } from '../utils/pdfGenerator';

interface BillGeneratorProps {
  appointment: Appointment;
  onClose: () => void;
  onBillGenerated: () => void;
}

const BillGenerator: React.FC<BillGeneratorProps> = ({ appointment, onClose, onBillGenerated }) => {
  const [bills, setBills] = useLocalStorage<Bill[]>('bills', []);
  const [items, setItems] = useState<BillItem[]>([
    { id: '1', name: '', quantity: 1, price: 0, total: 0 }
  ]);

  const addItem = () => {
    const newItem: BillItem = {
      id: Date.now().toString(),
      name: '',
      quantity: 1,
      price: 0,
      total: 0
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id: string, field: keyof BillItem, value: string | number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'quantity' || field === 'price') {
          updatedItem.total = updatedItem.quantity * updatedItem.price;
        }
        return updatedItem;
      }
      return item;
    }));
  };

  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const tax = subtotal * 0.18; // 18% GST
  const total = subtotal + tax;

  const generateBill = () => {
    const bill: Bill = {
      id: Date.now().toString(),
      appointmentId: appointment.id,
      customerName: appointment.customerName,
      customerPhone: appointment.customerPhone,
      carNumber: appointment.carNumber,
      carKm: appointment.carKm,
      items: items.filter(item => item.name && item.price > 0),
      subtotal,
      tax,
      total,
      createdAt: new Date().toISOString(),
    };

    setBills([...bills, bill]);
    onBillGenerated();
  };

  const downloadPDF = () => {
    const bill: Bill = {
      id: Date.now().toString(),
      appointmentId: appointment.id,
      customerName: appointment.customerName,
      customerPhone: appointment.customerPhone,
      carNumber: appointment.carNumber,
      carKm: appointment.carKm,
      items: items.filter(item => item.name && item.price > 0),
      subtotal,
      tax,
      total,
      createdAt: new Date().toISOString(),
    };

    generateBillPDF(bill);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Generate Bill</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Bill Header */}
          <div className="text-center mb-8 pb-4 border-b-2 border-blue-600">
            <h1 className="text-3xl font-bold text-blue-700">GOKUL MOTOR GARAGE</h1>
            <p className="text-lg text-gray-600">AMALNER</p>
          </div>

          {/* Customer & Vehicle Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3">Customer Details</h3>
              <p><span className="font-medium">Name:</span> {appointment.customerName}</p>
              <p><span className="font-medium">Phone:</span> {appointment.customerPhone}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3">Vehicle Details</h3>
              <p><span className="font-medium">Car Number:</span> {appointment.carNumber}</p>
              <p><span className="font-medium">Car KM:</span> {appointment.carKm}</p>
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Services & Products</h3>
              <button
                onClick={addItem}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add Item</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Service/Product</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Qty</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Price</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Total</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter service/product name"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                          className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          min="1"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          value={item.price}
                          onChange={(e) => updateItem(item.id, 'price', parseFloat(e.target.value) || 0)}
                          className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          min="0"
                          step="0.01"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-medium">₹{item.total.toFixed(2)}</span>
                      </td>
                      <td className="px-4 py-3">
                        {items.length > 1 && (
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-red-600 hover:text-red-800 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bill Summary */}
          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <div className="flex justify-end">
              <div className="w-64 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (18% GST):</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total:</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center py-4 border-t-2 border-blue-600">
            <p className="text-lg font-semibold text-blue-700">Contact: 9370071035</p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              onClick={downloadPDF}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Download PDF</span>
            </button>
            <button
              onClick={generateBill}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Send className="h-4 w-4" />
              <span>Generate & Save Bill</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillGenerator;