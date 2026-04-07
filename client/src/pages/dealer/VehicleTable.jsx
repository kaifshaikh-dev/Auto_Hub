import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Pencil, Trash2, Eye, PlusCircle, Search } from 'lucide-react';
import vehicleService from '../../services/vehicleService';
import useAuth from '../../hooks/useAuth';
import Loader from '../../components/Loader';
import { formatPrice } from '../../utils/formatPrice';

const VehicleTable = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVehicles, setSelectedVehicles] = useState([]);
  const { dealer } = useAuth();

  const fetchVehicles = async () => {
    try {
      if (dealer?._id) {
        const data = await vehicleService.getVehicles({ dealerId: dealer._id });
        if (data.success) {
          setVehicles(data.data);
        }
      }
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, [dealer]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this vehicle? This action cannot be undone.')) {
      try {
        const res = await vehicleService.deleteVehicle(id);
        if (res.success) {
          setVehicles(vehicles.filter(v => v._id !== id));
          setSelectedVehicles(selectedVehicles.filter(vId => vId !== id));
        }
      } catch (error) {
        console.error('Failed to delete:', error);
        alert('Failed to delete vehicle');
      }
    }
  };

  const filteredVehicles = vehicles.filter(v => 
    v.brand.toLowerCase().includes(searchTerm.toLowerCase()) || 
    v.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedVehicles(filteredVehicles.map(v => v._id));
    } else {
      setSelectedVehicles([]);
    }
  };

  const handleSelectVehicle = (id) => {
    setSelectedVehicles(prev => 
      prev.includes(id) ? prev.filter(vId => vId !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${selectedVehicles.length} vehicles? This action cannot be undone.`)) {
      try {
        const res = await vehicleService.deleteMultipleVehicles(selectedVehicles);
        if (res.success) {
          setVehicles(vehicles.filter(v => !selectedVehicles.includes(v._id)));
          setSelectedVehicles([]);
        }
      } catch (error) {
        console.error('Failed to bulk delete:', error);
        alert('Failed to delete vehicles');
      }
    }
  };

  if (loading) return <Loader fullScreen />;

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Inventory</h1>
            <p className="text-gray-500 mt-1">View, edit, or delete your vehicles</p>
          </div>
          <div className="flex gap-3">
            {selectedVehicles.length > 0 && (
              <button 
                onClick={handleBulkDelete}
                className="btn bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/20 whitespace-nowrap"
              >
                <Trash2 size={18} className="mr-2" /> Delete Selected ({selectedVehicles.length})
              </button>
            )}
            <Link to="/dealer/vehicles/add" className="btn btn-primary shadow-lg shadow-primary-500/20 whitespace-nowrap">
              <PlusCircle size={18} className="mr-2" /> Add Vehicle
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 md:p-6 border-b border-gray-100 bg-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search inventory..." 
                className="input-field pl-10 border-gray-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="text-sm font-medium text-gray-500 whitespace-nowrap">
              Showing {filteredVehicles.length} of {vehicles.length} vehicles
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap">
              <thead className="bg-white border-b border-gray-100 uppercase text-xs font-bold font-sans tracking-tight text-gray-400">
                <tr>
                  <th className="px-6 py-4 w-12">
                    <input 
                      type="checkbox" 
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      onChange={handleSelectAll}
                      checked={filteredVehicles.length > 0 && selectedVehicles.length === filteredVehicles.length}
                    />
                  </th>
                  <th className="px-6 py-4">Vehicle</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Added On</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredVehicles.length > 0 ? (
                  filteredVehicles.map((vehicle) => (
                    <tr key={vehicle._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <input 
                          type="checkbox" 
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          checked={selectedVehicles.includes(vehicle._id)}
                          onChange={() => handleSelectVehicle(vehicle._id)}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-12 w-16 flex-shrink-0 rounded bg-gray-200 overflow-hidden mr-4">
                            <img className="h-full w-full object-cover" src={vehicle.images[0] || 'https://via.placeholder.com/150'} alt="" />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-gray-900">{vehicle.brand} {vehicle.model}</div>
                            <div className="text-xs text-gray-500">{vehicle.year} • {vehicle.fuelType}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-gray-900">{formatPrice(vehicle.price)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${
                          vehicle.status === 'Available' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {vehicle.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{new Date(vehicle.createdAt).toLocaleDateString()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <Link to={`/vehicles/${vehicle._id}`} target="_blank" className="text-gray-400 hover:text-blue-600 bg-gray-50 hover:bg-blue-50 p-2 rounded-lg transition-colors" title="View Public">
                            <Eye size={18} />
                          </Link>
                          <Link to={`/dealer/vehicles/edit/${vehicle._id}`} className="text-gray-400 hover:text-orange-500 bg-gray-50 hover:bg-orange-50 p-2 rounded-lg transition-colors" title="Edit">
                            <Pencil size={18} />
                          </Link>
                          <button onClick={() => handleDelete(vehicle._id)} className="text-gray-400 hover:text-red-600 bg-gray-50 hover:bg-red-50 p-2 rounded-lg transition-colors" title="Delete">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                      No vehicles found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleTable;
