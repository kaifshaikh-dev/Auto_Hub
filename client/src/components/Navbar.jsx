import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Car, LogOut, LayoutDashboard, Settings, User, Home } from 'lucide-react';
import useAuth from '../hooks/useAuth';

const Navbar = () => {
  const { dealer, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 top-0 sticky z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-primary-600 text-white p-2 rounded-lg">
                <Car size={24} />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-800">
                AutoHub
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {/* Removed Browse Vehicles Link */}
            <Link 
              to="/" 
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-primary-700 bg-primary-50 rounded-full border border-primary-100 hover:bg-primary-100 hover:border-primary-200 hover:text-primary-800 transition-all duration-200 shadow-sm"
            >
              <Home size={16} />
              <span className="hidden sm:inline">Home</span>
            </Link>

            <div className="flex items-center border-l pl-4 ml-2">
              {dealer ? (
                <div className="relative group flex items-center gap-4">
                  <Link to="/dealer/dashboard" className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors">
                    <LayoutDashboard size={18} />
                    <span className="hidden sm:inline">Dashboard</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
                  >
                    <LogOut size={18} />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;


