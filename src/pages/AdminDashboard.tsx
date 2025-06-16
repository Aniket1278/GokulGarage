import React, { useState } from 'react';
import { Users, Calendar, DollarSign, TrendingUp, Eye, FileText, Check, X } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Appointment, Bill } from '../types';
import BillGenerator from '../components/BillGenerator';

const AdminDashboard: React.FC = () => {
  const [appointments] = useLocalStorage<Appointment[]>('appointments', []);
  const [bills] = useLocalStorage<Bill[]>('bills', []);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showBillGenerator, setShowBillGenerator] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'completed'>('all');

  const filteredAppointments = appointments.filter(apt => 
    filter === 'all' || apt.status === filter
  );

  const totalRevenue = bills.reduce((sum, bill) => sum + bill.total, 0);
  const pendingAppointments = appointments.filter(apt => apt.status === 'pending').length;
  const completedAppointments = appointments.filter(apt => apt.status === 'completed').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'text-green-600 bg-green-100';
      case 'completed':
        return 'text-blue-600 bg-blue-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-yellow-600 bg-yellow-100';
    }
  };

  const updateAppointmentStatus = (appointmentId: string, status: Appointment['status']) => {
    const updatedAppointments = appointments.map(apt =>
      apt.id === appointmentId ? { ...apt, status } : apt
    );
    localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
    window.location.reload(); // Simple refresh to update the data
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage appointments, generate bills, and track performance</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Appointments</p>
                <p className="text-2xl font-bold text-gray-900">{appointments.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{pendingAppointments}</p>
              </div>
              <Users className="h-8 w-8 text-yellow-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{completedAppointments}</p>
              </div>
              <Check className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">₹{totalRevenue.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-xl shadow-md mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { key: 'all', label: 'All Appointments', count: appointments.length },
                { key: 'pending', label: 'Pending', count: pendingAppointments },
                { key: 'confirmed', label: 'Confirmed', count: appointments.filter(a => a.status === 'confirmed').length },
                { key: 'completed', label: 'Completed', count: completedAppointments },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    filter === tab.key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </nav>
          </div>

          {/* Appointments Table */}
          <div className="overflow-x-auto">
            {filteredAppointments.length === 0 ? (
              <div className="p-8 text-center">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No appointments found</p>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Car Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAppointments.map((appointment) => (
                    <tr key={appointment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {appointment.customerName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {appointment.customerPhone}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {appointment.carModel}
                          </div>
                          <div className="text-sm text-gray-500">
                            {appointment.carNumber} • {appointment.carKm} km
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(appointment.appointmentDate).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-gray-500">
                          {appointment.appointmentTime}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getStatusColor(appointment.status)}`}>
                          {appointment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => setSelectedAppointment(appointment)}
                          className="text-blue-600 hover:text-blue-900 inline-flex items-center space-x-1"
                        >
                          <Eye className="h-4 w-4" />
                          <span>View</span>
                        </button>
                        
                        {appointment.status === 'pending' && (
                          <button
                            onClick={() => updateAppointmentStatus(appointment.id, 'confirmed')}
                            className="text-green-600 hover:text-green-900 inline-flex items-center space-x-1"
                          >
                            <Check className="h-4 w-4" />
                            <span>Confirm</span>
                          </button>
                        )}
                        
                        {appointment.status === 'confirmed' && (
                          <button
                            onClick={() => {
                              setSelectedAppointment(appointment);
                              setShowBillGenerator(true);
                            }}
                            className="text-purple-600 hover:text-purple-900 inline-flex items-center space-x-1"
                          >
                            <FileText className="h-4 w-4" />
                            <span>Bill</span>
                          </button>
                        )}
                        
                        {appointment.status !== 'cancelled' && appointment.status !== 'completed' && (
                          <button
                            onClick={() => updateAppointmentStatus(appointment.id, 'cancelled')}
                            className="text-red-600 hover:text-red-900 inline-flex items-center space-x-1"
                          >
                            <X className="h-4 w-4" />
                            <span>Cancel</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Appointment Details Modal */}
      {selectedAppointment && !showBillGenerator && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Appointment Details</h2>
              <button
                onClick={() => setSelectedAppointment(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h3>
                  <div className="space-y-2">
                    <p><span className="font-medium">Name:</span> {selectedAppointment.customerName}</p>
                    <p><span className="font-medium">Phone:</span> {selectedAppointment.customerPhone}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Vehicle Information</h3>
                  <div className="space-y-2">
                    <p><span className="font-medium">Model:</span> {selectedAppointment.carModel}</p>
                    <p><span className="font-medium">Number:</span> {selectedAppointment.carNumber}</p>
                    <p><span className="font-medium">KM Reading:</span> {selectedAppointment.carKm}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Appointment Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <p><span className="font-medium">Date:</span> {new Date(selectedAppointment.appointmentDate).toLocaleDateString()}</p>
                  <p><span className="font-medium">Time:</span> {selectedAppointment.appointmentTime}</p>
                  <p><span className="font-medium">Status:</span> 
                    <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full capitalize ${getStatusColor(selectedAppointment.status)}`}>
                      {selectedAppointment.status}
                    </span>
                  </p>
                </div>
              </div>
              
              {selectedAppointment.services.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Services Requested</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedAppointment.services.map((service, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-md">
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {selectedAppointment.notes && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Notes</h3>
                  <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{selectedAppointment.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Bill Generator Modal */}
      {showBillGenerator && selectedAppointment && (
        <BillGenerator
          appointment={selectedAppointment}
          onClose={() => {
            setShowBillGenerator(false);
            setSelectedAppointment(null);
          }}
          onBillGenerated={() => {
            updateAppointmentStatus(selectedAppointment.id, 'completed');
            setShowBillGenerator(false);
            setSelectedAppointment(null);
          }}
        />
      )}
    </div>
  );
};

export default AdminDashboard;