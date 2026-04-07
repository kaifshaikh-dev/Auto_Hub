import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { formatPrice } from '../utils/formatPrice';

const VehicleCard = ({ vehicle }) => {
  return (
    <Link
      to={`/vehicles/${vehicle._id}`}
      className="flex bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden h-[140px] sm:h-auto sm:flex-col hover:shadow-md transition-all group"
    >
      {/* Image Section */}
      <div className="relative w-[140px] sm:w-full sm:aspect-[4/3] flex-shrink-0 bg-gray-100">
        <img
          src={vehicle.images?.[0] || 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=800&q=80'}
          alt={`${vehicle.brand} ${vehicle.model}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* Status Badge */}
        {vehicle.status && vehicle.status !== 'Available' && (
          <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-bold text-gray-800 shadow-sm uppercase tracking-wide">
            {vehicle.status}
          </div>
        )}
        {/* Heart Button */}
        <button
          className="absolute top-2 right-2 p-1.5 rounded-full bg-black/40 text-white backdrop-blur-sm hover:bg-black/60 transition-colors z-10"
          onClick={(e) => {
            e.preventDefault();
            // toggle favorite functionality
          }}
        >
          <Heart size={14} className="text-white" />
        </button>
      </div>

      {/* Details Section */}
      <div className="flex flex-col justify-between p-3 sm:p-4 flex-grow w-[calc(100%-140px)] sm:w-full">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 leading-tight truncate">
            {formatPrice(vehicle.price)}
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            {vehicle.year} - {(vehicle.kmDriven || 0).toLocaleString()} km
          </p>
          <h4 className="text-sm sm:text-base font-semibold text-gray-800 mt-1 sm:mt-2 truncate group-hover:text-primary-600 transition-colors">
            {vehicle.brand} {vehicle.model}
          </h4>
        </div>

        <div className="flex justify-between items-center mt-2 text-[10px] sm:text-xs text-gray-500 uppercase tracking-wide">
          <span className="whitespace-nowrap font-medium">{vehicle.location}</span>
        </div>
      </div>
    </Link>
  );
};

export default VehicleCard;
