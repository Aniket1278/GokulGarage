import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Car, User, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-blue-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2 hover:text-orange-300 transition-colors">
            <Car className="h-8 w-8" />
            <span className="font-bold text-xl">Gokul Motor Garage</span>
          </Link>

          <div className="flex items-center space-x-6">
            {!user ? (
              <>
                <Link
                  to="/login"
                  className={`px-4 py-2 rounded-md hover:bg-blue-600 transition-colors ${
                    isActive('/login') ? 'bg-blue-600' : ''
                  }`}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
                >
                  Register
                </Link>
              </>
            ) : (
              <>
                <Link
                  to={user.role === 'admin' ? '/admin' : '/dashboard'}
                  className={`flex items-center space-x-1 px-4 py-2 rounded-md hover:bg-blue-600 transition-colors ${
                    isActive(user.role === 'admin' ? '/admin' : '/dashboard') ? 'bg-blue-600' : ''
                  }`}
                >
                  <User className="h-4 w-4" />
                  <span>{user.role === 'admin' ? 'Admin Panel' : 'Dashboard'}</span>
                </Link>
                
                {user.role === 'admin' && (
                  <Link
                    to="/admin/reports"
                    className={`flex items-center space-x-1 px-4 py-2 rounded-md hover:bg-blue-600 transition-colors ${
                      isActive('/admin/reports') ? 'bg-blue-600' : ''
                    }`}
                  >
                    <Settings className="h-4 w-4" />
                    <span>Reports</span>
                  </Link>
                )}

                <button
                  onClick={logout}
                  className="flex items-center space-x-1 px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;