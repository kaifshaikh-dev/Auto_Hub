import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Car, TrendingUp, IndianRupee, Tag, Activity, Archive, Building2 } from 'lucide-react';
import vehicleService from '../../services/vehicleService';
import useAuth from '../../hooks/useAuth';
import Loader from '../../components/Loader';
import { formatPrice } from '../../utils/formatPrice';

const Dashboard = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const { dealer } = useAuth();
  
  const [stats, setStats] = useState({
    total: 0,
    available: 0,
    sold: 0,
    totalValue: 0
  });

  useEffect(() => {
    const fetchDealerVehicles = async () => {
      try {
        if (dealer?._id) {
          const data = await vehicleService.getVehicles({ dealerId: dealer._id });
          if (data.success) {
            setVehicles(data.data);
            
            // Calculate stats
            const availableCount = data.data.filter(v => v.status === 'Available').length;
            const soldCount = data.data.filter(v => v.status === 'Sold').length;
            const value = data.data.reduce((acc, curr) => acc + (curr.status === 'Available' ? curr.price : 0), 0);
            
            setStats({
              total: data.data.length,
              available: availableCount,
              sold: soldCount,
              totalValue: value
            });
          }
        }
      } catch (error) {
        console.error('Error fetching vehicles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDealerVehicles();
  }, [dealer]);

  if (loading) return <Loader fullScreen />;

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Welcome Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-64 h-64 bg-primary-50 rounded-full -translate-y-1/2 translate-x-1/3 opacity-50"></div>
          
          <div className="relative z-10">
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Welcome back, {dealer?.name.split(' ')[0]} 👋
            </h1>
            <p className="text-gray-500 mt-3 text-lg">
              You currently have <span className="font-bold text-primary-600">{stats.total} vehicles</span> listed in your inventory at {dealer?.showroomName}.
            </p>
          </div>
          <Link 
            to="/dealer/vehicles/add" 
            className="btn btn-primary relative z-10 py-3 px-6 shadow-lg shadow-primary-500/20"
          >
            <PlusCircle size={20} className="mr-2" /> Add New Vehicle
          </Link>
        </div>


        {/* Quick Actions & Recent Inventory */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Quick Actions */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2 flex items-center">
                <Activity size={20} className="mr-2 text-primary-500" /> Quick Links
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link to="/dealer/vehicles" className="flex items-center text-gray-600 hover:text-primary-600 hover:bg-primary-50 p-2 rounded-lg transition-colors font-medium">
                    <Car size={18} className="mr-3 text-primary-500" /> Manage All Vehicles
                  </Link>
                </li>
                <li>
                  <Link to="/dealer/vehicles/add" className="flex items-center text-gray-600 hover:text-primary-600 hover:bg-primary-50 p-2 rounded-lg transition-colors font-medium">
                    <PlusCircle size={18} className="mr-3 text-primary-500" /> Add New Inventory
                  </Link>
                </li>
                <li>
                  <Link to={`/dealer/${dealer?._id}`} target="_blank" className="flex items-center text-gray-600 hover:text-primary-600 hover:bg-primary-50 p-2 rounded-lg transition-colors font-medium">
                    <Building2 size={18} className="mr-3 text-primary-500" /> View Public Showroom
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Recent Vehicles */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h3 className="text-lg font-bold text-gray-900 flex items-center">
                  <Archive size={20} className="mr-2 text-primary-500" /> Recently Added
                </h3>
                <Link to="/dealer/vehicles" className="text-sm font-semibold text-primary-600 hover:text-primary-700">
                  View All
                </Link>
              </div>
              
              {vehicles.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {vehicles.slice(0, 5).map(vehicle => (
                    <div key={vehicle._id} className="p-4 sm:p-6 hover:bg-gray-50 transition-colors flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0 w-16 h-12 rounded bg-gray-200 overflow-hidden">
                          <img src={vehicle.images[0] || 'https://via.placeholder.com/150'} alt={vehicle.model} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">{vehicle.brand} {vehicle.model}</p>
                          <p className="text-xs text-gray-500">{vehicle.year} • {formatPrice(vehicle.price)}</p>
                        </div>
                      </div>
                      <div>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          vehicle.status === 'Available' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {vehicle.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-10 text-center text-gray-500 flex flex-col items-center">
                  <Car size={48} className="text-gray-300 mb-4" />
                  <p className="font-medium">No vehicles added yet.</p>
                  <p className="text-sm">Click "Add New Vehicle" to start building your inventory.</p>
                </div>
              )}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
