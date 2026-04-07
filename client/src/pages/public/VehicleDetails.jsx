import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Calendar, Gauge, Fuel, Info, PhoneCall, ChevronLeft, MapPin, Building2, ExternalLink } from 'lucide-react';
import vehicleService from '../../services/vehicleService';
import VehicleGallery from '../../components/VehicleGallery';
import Loader from '../../components/Loader';
import { formatPrice } from '../../utils/formatPrice';
import { generateWhatsAppLink } from '../../utils/whatsappLink';

const VehicleDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVehicleDetails = async () => {
      try {
        const data = await vehicleService.getVehicleById(id);
        if (data.success) {
          setVehicle(data.data);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError('Failed to fetch vehicle details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicleDetails();
  }, [id]);

  if (loading) return <Loader fullScreen />;

  if (error || !vehicle) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-md w-full">
          <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Info size={32} />
          </div>
          <h2 className="text-2xl font-bold mb-2">Vehicle Not Found</h2>
          <p className="text-gray-500 mb-6">{error || 'The vehicle you are looking for does not exist or has been removed.'}</p>
          <button onClick={() => navigate('/vehicles')} className="btn btn-primary w-full justify-center">
            Back to Vehicles
          </button>
        </div>
      </div>
    );
  }

  const { dealerId } = vehicle;
  const vehicleUrl = window.location.href;
  const whatsappMsg = `Hi! I am interested in this vehicle. Is it still available?

*${vehicle.brand} ${vehicle.model} (${vehicle.year})*
${vehicle.title ? '_' + vehicle.title + '_\n\n' : '\n'}*Price:* ${formatPrice(vehicle.price)}
*Status:* ${vehicle.status}
*Driven:* ${vehicle.kmDriven?.toLocaleString()} km
*Fuel:* ${vehicle.fuelType}
*Transmission:* ${vehicle.transmission}

View full details on AutoHub:
${vehicleUrl}`;

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Navigation Breadcrumb */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-sm font-medium text-gray-500 hover:text-primary-600 mb-6 transition-colors group w-fit"
        >
          <ChevronLeft size={16} className="mr-1 group-hover:-translate-x-1 transition-transform" /> Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Gallery & Description */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2 overflow-hidden">
              <VehicleGallery images={vehicle.images} video={vehicle.video} />
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center border-b pb-4">
                <Info className="mr-3 text-primary-500" size={24} /> Vehicle Overview
              </h2>
              <div className="prose max-w-none text-gray-600 whitespace-pre-wrap leading-relaxed">
                {vehicle.description}
              </div>
            </div>
          </div>

          {/* Right Column - Info & Actions */}
          <div className="space-y-6">

            {/* Price & Primary Info Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <div className="flex justify-between items-start mb-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${vehicle.status === 'Available' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                  {vehicle.status}
                </span>
                <span className="text-gray-400 text-sm">{new Date(vehicle.createdAt).toLocaleDateString()}</span>
              </div>

              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mt-4 leading-tight mb-2">
                {vehicle.brand} {vehicle.model}
              </h1>
              <p className="text-lg text-gray-500 mb-4">{vehicle.title}</p>

              <div className="text-4xl font-black text-primary-600 mb-8 border-b border-gray-100 pb-6">
                {formatPrice(vehicle.price)}
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-gray-50 rounded-xl p-4 flex flex-col">
                  <span className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5"><Calendar size={14} /> Year</span>
                  <span className="font-semibold text-gray-900">{vehicle.year}</span>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 flex flex-col">
                  <span className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5"><Gauge size={14} /> Driven</span>
                  <span className="font-semibold text-gray-900">{vehicle.kmDriven.toLocaleString()} km</span>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 flex flex-col">
                  <span className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5"><Fuel size={14} /> Fuel</span>
                  <span className="font-semibold text-gray-900">{vehicle.fuelType}</span>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 flex flex-col">
                  <span className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5"><Info size={14} /> Trans.</span>
                  <span className="font-semibold text-gray-900">{vehicle.transmission}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <a
                  href={generateWhatsAppLink(dealerId?.whatsappNumber, whatsappMsg)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn bg-[#25D366] hover:bg-[#20bd5a] text-white w-full py-3.5 flex justify-center text-base font-bold shadow-md shadow-[#25D366]/20 transition-transform active:scale-[0.98]"
                >
                  Message on WhatsApp
                </a>

                <a
                  href={`tel:${dealerId?.phone}`}
                  className="btn btn-secondary w-full py-3.5 flex justify-center text-base font-bold text-gray-700 bg-white border-2 border-gray-200 hover:border-gray-300 transition-transform active:scale-[0.98]"
                >
                  <PhoneCall size={20} className="mr-2" /> Call Dealer
                </a>
              </div>
            </div>

            {/* Dealer Info Card */}
            {/* <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <Building2 size={20} className="mr-2 text-primary-500" /> Seller Information
              </h3>

              <div className="space-y-4">
                <div>
                  <div className="font-bold text-lg text-gray-800">{dealerId?.showroomName}</div>
                  <div className="text-sm text-gray-500">Contact: {dealerId?.name}</div>
                </div>

                <div className="flex items-start text-gray-600 bg-gray-50 p-3 rounded-lg">
                  <MapPin size={18} className="mr-2 mt-0.5 text-gray-400 flex-shrink-0" />
                  <span className="text-sm">{dealerId?.city}</span>
                </div>

                <Link
                  to={`/dealer/${dealerId?._id}`}
                  className="text-primary-600 text-sm font-semibold flex items-center hover:text-primary-700 mt-2 hover:underline"
                >
                  View Dealer Profile <ExternalLink size={14} className="ml-1" />
                </Link>
              </div>
            </div> */}

          </div>
        </div>

      </div>
    </div>
  );
};

export default VehicleDetails;
