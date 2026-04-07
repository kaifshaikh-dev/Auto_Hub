import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Building2, User } from 'lucide-react';
import dealerService from '../../services/dealerService';
import vehicleService from '../../services/vehicleService';
import VehicleCard from '../../components/VehicleCard';
import Loader from '../../components/Loader';

const DealerShowroom = () => {
  const { id } = useParams();
  const [dealer, setDealer] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dealerRes, vehiclesRes] = await Promise.all([
          dealerService.getDealerInfo(id),
          vehicleService.getVehicles({ dealerId: id })
        ]);

        if (dealerRes.success) setDealer(dealerRes.data);
        if (vehiclesRes.success) setVehicles(vehiclesRes.data);
      } catch (error) {
        console.error('Failed to fetch dealer data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <Loader fullScreen />;

  if (!dealer) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold mb-2">Dealer Not Found</h2>
          <p className="text-gray-500 mb-4">This dealer account does not exist or has been removed.</p>
          <Link to="/vehicles" className="btn btn-primary">Browse All Vehicles</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Dealer Header / Profile Banner */}
      <div className="bg-dark text-white py-16 px-4 mb-10 border-b-4 border-primary-500 shadow-xl overflow-hidden relative">
        <div className="absolute inset-0 z-0 opacity-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary-400 via-dark to-dark"></div>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-8 relative z-10">
          
          <div className="w-24 h-24 md:w-32 md:h-32 bg-primary-600 rounded-full flex items-center justify-center border-4 border-white shadow-2xl flex-shrink-0">
            <Building2 size={48} className="text-white" />
          </div>
          
          <div className="text-center md:text-left flex-grow">
            <h1 className="text-3xl md:text-4xl font-extrabold mb-2 tracking-tight">{dealer.showroomName}</h1>
            <p className="text-primary-300 font-medium text-lg flex items-center justify-center md:justify-start gap-2 mb-4">
              <User size={18} /> Contact: {dealer.name}
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <div className="flex items-center text-sm bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm border border-white/10">
                <MapPin size={16} className="mr-2 text-primary-400" />
                {dealer.city}
              </div>
              <div className="flex items-center text-sm bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm border border-white/10">
                <Phone size={16} className="mr-2 text-primary-400" />
                {dealer.phone}
              </div>
              <div className="flex items-center text-sm bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm border border-white/10">
                <Mail size={16} className="mr-2 text-primary-400" />
                {dealer.email}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8 border-b border-gray-200 pb-4">
          <h2 className="text-2xl font-bold text-gray-900">Showroom Inventory ({vehicles.length})</h2>
        </div>

        {vehicles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {vehicles.map((vehicle) => (
              <VehicleCard key={vehicle._id} vehicle={vehicle} />
            ))}
          </div>
        ) : (
          <div className="text-center bg-white p-12 rounded-xl shadow-sm border border-gray-100">
            <Building2 size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No vehicles currently listed</h3>
            <p className="text-gray-500">This dealer hasn't added any vehicles to their inventory yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DealerShowroom;
