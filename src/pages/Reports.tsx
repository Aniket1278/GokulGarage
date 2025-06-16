import React, { useState } from 'react';
import { BarChart3, Calendar, DollarSign, Download, TrendingUp } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Bill, Appointment } from '../types';
import { generateMonthlyReport } from '../utils/pdfGenerator';

const Reports: React.FC = () => {
  const [bills] = useLocalStorage<Bill[]>('bills', []);
  const [appointments] = useLocalStorage<Appointment[]>('appointments', []);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  const getMonthlyData = (month: number, year: number) => {
    const monthlyBills = bills.filter(bill => {
      const billDate = new Date(bill.createdAt);
      return billDate.getMonth() === month && billDate.getFullYear() === year;
    });

    const monthlyAppointments = appointments.filter(apt => {
      const aptDate = new Date(apt.appointmentDate);
      return aptDate.getMonth() === month && aptDate.getFullYear() === year;
    });

    return {
      bills: monthlyBills,
      appointments: monthlyAppointments,
      revenue: monthlyBills.reduce((sum, bill) => sum + bill.total, 0),
      averageBill: monthlyBills.length > 0 ? monthlyBills.reduce((sum, bill) => sum + bill.total, 0) / monthlyBills.length : 0,
      completedAppointments: monthlyAppointments.filter(apt => apt.status === 'completed').length,
      pendingAppointments: monthlyAppointments.filter(apt => apt.status === 'pending').length,
    };
  };

  const currentMonthData = getMonthlyData(selectedMonth, selectedYear);

  const downloadMonthlyReport = () => {
    generateMonthlyReport(currentMonthData.bills, monthNames[selectedMonth], selectedYear);
  };

  const getLast6MonthsData = () => {
    const data = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const month = date.getMonth();
      const year = date.getFullYear();
      const monthData = getMonthlyData(month, year);
      data.push({
        month: monthNames[month].slice(0, 3),
        year,
        revenue: monthData.revenue,
        appointments: monthData.appointments.length,
      });
    }
    return data;
  };

  const chartData = getLast6MonthsData();
  const maxRevenue = Math.max(...chartData.map(d => d.revenue));

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 mt-2">Track your garage's performance and generate reports</p>
        </div>

        {/* Month/Year Selector */}
        <div className="bg-white p-6 rounded-xl shadow-md mb-8">
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Month</label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {monthNames.map((month, index) => (
                  <option key={index} value={index}>{month}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            <div className="flex-1 flex justify-end">
              <button
                onClick={downloadMonthlyReport}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Download Report</span>
              </button>
            </div>
          </div>
        </div>

        {/* Monthly Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                <p className="text-2xl font-bold text-gray-900">₹{currentMonthData.revenue.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Bills</p>
                <p className="text-2xl font-bold text-gray-900">{currentMonthData.bills.length}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Bill</p>
                <p className="text-2xl font-bold text-gray-900">₹{currentMonthData.averageBill.toFixed(0)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Appointments</p>
                <p className="text-2xl font-bold text-gray-900">{currentMonthData.appointments.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="bg-white p-6 rounded-xl shadow-md mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Revenue Trend (Last 6 Months)</h2>
          <div className="space-y-4">
            {chartData.map((data, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="w-20 text-sm text-gray-600">
                  {data.month} {data.year}
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-8 relative">
                  <div
                    className="bg-blue-600 h-8 rounded-full flex items-center justify-end pr-4 text-white text-sm font-medium"
                    style={{ width: `${maxRevenue > 0 ? (data.revenue / maxRevenue) * 100 : 0}%` }}
                  >
                    {data.revenue > 0 && `₹${data.revenue.toLocaleString()}`}
                  </div>
                </div>
                <div className="w-20 text-sm text-gray-600 text-right">
                  {data.appointments} apts
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Bills List */}
        <div className="bg-white rounded-xl shadow-md">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Bills for {monthNames[selectedMonth]} {selectedYear}
            </h2>
          </div>

          {currentMonthData.bills.length === 0 ? (
            <div className="p-8 text-center">
              <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No bills generated this month</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Car Number
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentMonthData.bills.map((bill) => (
                    <tr key={bill.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(bill.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{bill.customerName}</div>
                          <div className="text-sm text-gray-500">{bill.customerPhone}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {bill.carNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ₹{bill.total.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;