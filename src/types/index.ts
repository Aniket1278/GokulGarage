export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'user' | 'admin';
}

export interface Appointment {
  id: string;
  userId: string;
  customerName: string;
  customerPhone: string;
  carNumber: string;
  carModel: string;
  carKm: number;
  appointmentDate: string;
  appointmentTime: string;
  services: string[];
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: string;
}

export interface BillItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Bill {
  id: string;
  appointmentId: string;
  customerName: string;
  customerPhone: string;
  carNumber: string;
  carKm: number;
  items: BillItem[];
  subtotal: number;
  tax: number;
  total: number;
  createdAt: string;
  paidAt?: string;
}

export interface MonthlyReport {
  month: string;
  year: number;
  totalRevenue: number;
  totalBookings: number;
  completedBookings: number;
  pendingBookings: number;
}