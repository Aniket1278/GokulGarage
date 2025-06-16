import React, { useState } from 'react';
import { Calendar, Clock, Car, Plus, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Appointment } from '../types';
import BookingForm from '../components/BookingForm';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useLocalStorage<Appointment[]>('appointments', []);
  const [showBookingForm, setShowBookingForm] = useState(false);

  const userAppointments = appointments.filter(apt => apt.userId === user?.id);

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome, {user?.name}!</h1>
          <p className="text-gray-600 mt-2">Manage your appointments and service history</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Appointments</p>
                <p className="text-2xl font-bold text-gray-900">{userAppointments.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {userAppointments.filter(apt => apt.status === 'pending').length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {userAppointments.filter(apt => apt.status === 'completed').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="mb-8">
          <button
            onClick={() => setShowBookingForm(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Book New Appointment</span>
          </button>
        </div>

        {/* Appointments List */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Your Appointments</h2>
          </div>

          {userAppointments.length === 0 ? (
            <div className="p-8 text-center">
              <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No appointments yet</p>
              <button
                onClick={() => setShowBookingForm(true)}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Book your first appointment
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {userAppointments.map((appointment) => (
                <div key={appointment.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {appointment.carModel}
                        </h3>
                        <span className="text-gray-500">({appointment.carNumber})</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(appointment.status)}`}>
                          {getStatusIcon(appointment.status)}
                          <span className="capitalize">{appointment.status}</span>
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(appointment.appointmentDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4" />
                          <span>{appointment.appointmentTime}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Car className="h-4 w-4" />
                          <span>{appointment.carKm} km</span>
                        </div>
                      </div>
                      {appointment.services.length > 0 && (
                        <div className="mt-3">
                          <p className="text-sm text-gray-600 mb-1">Services:</p>
                          <div className="flex flex-wrap gap-2">
                            {appointment.services.map((service, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-md"
                              >
                                {service}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Booking Form Modal */}
      {showBookingForm && (
        <BookingForm
          onClose={() => setShowBookingForm(false)}
          onSubmit={(appointmentData) => {
            const newAppointment: Appointment = {
              ...appointmentData,
              id: Date.now().toString(),
              userId: user?.id || '',
              customerName: user?.name || '',
              customerPhone: user?.phone || '',
              status: 'pending',
              createdAt: new Date().toISOString(),
            };
            setAppointments([...appointments, newAppointment]);
            setShowBookingForm(false);
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;