import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, Filter, X } from 'lucide-react';
import vehicleService from '../../services/vehicleService';
import VehicleCard from '../../components/VehicleCard';
import Loader from '../../components/Loader';

const VehicleList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);

  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    brand: '',
    fuelType: '',
    minPrice: '',
    maxPrice: '',
  });

  const BRANDS = ['Maruti Suzuki', 'Hyundai', 'Tata', 'Mahindra', 'Honda', 'Toyota', 'Kia', 'BMW', 'Mercedes', 'Audi', 'Royal Enfield', 'Bajaj', 'TVS', 'Honda Two Wheelers', 'Yamaha'];
  const FUEL_TYPES = ['Petrol', 'Diesel', 'Electric', 'CNG', 'Hybrid'];

  const fetchVehicles = async (currentFilters) => {
    setLoading(true);
    try {
      const activeFilters = Object.fromEntries(
        Object.entries(currentFilters).filter(([_, v]) => v !== '')
      );

      const data = await vehicleService.getVehicles(activeFilters);
      if (data.success) {
        setVehicles(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch vehicles:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchVehicles(filters);
      
      // Update URL silently
      const params = new URLSearchParams();
      if (filters.search) params.set('search', filters.search);
      navigate({ pathname: '/vehicles', search: params.toString() }, { replace: true });
    }, 400);

    return () => clearTimeout(timer);
  }, [filters, navigate]); // Runs on mount and every filter edit with debounce

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const applyFilters = (e) => {
    if (e) e.preventDefault();
    if (window.innerWidth < 1024) {
      setShowFilters(false);
    }
  };

  const clearFilters = () => {
    const defaultFilters = {
      search: '',
      brand: '',
      fuelType: '',
      minPrice: '',
      maxPrice: '',
    };
    setFilters(defaultFilters);
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-20 sm:pb-8 sm:pt-8">

      {/* Mobile Search Bar */}
      <div className="bg-white px-4 py-3 shadow-sm sticky top-16 z-40 sm:hidden mb-2">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
            onKeyDown={(e) => e.key === 'Enter' && applyFilters(e)}
            placeholder="Find Cars, Bikes and more..."
            className="w-full bg-slate-100 border border-transparent rounded-md py-2.5 pl-10 pr-4 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-gray-900 focus:bg-white transition-colors"
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">

        <div className="flex justify-between items-center mb-4 sm:mb-8 px-2 sm:px-0">
          <div className="hidden sm:block">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Vehicles</h1>
            <p className="text-gray-500">Find the perfect car or bike for you</p>
          </div>
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider block sm:hidden">
            Fresh Recommendations
          </h2>
          <button
            className="lg:hidden text-primary-600 font-medium flex items-center gap-1 text-sm bg-primary-50 px-3 py-1.5 rounded-md"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={16} />
            Filters
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:w-1/4 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <Filter size={18} className="text-primary-600" /> Filters
                </h2>
                <button onClick={clearFilters} className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                  Clear All
                </button>
              </div>

              <form onSubmit={applyFilters} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="text"
                      name="search"
                      value={filters.search}
                      onChange={handleFilterChange}
                      placeholder="Keywords..."
                      className="input-field pl-9"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
                  <select
                    name="brand"
                    value={filters.brand}
                    onChange={handleFilterChange}
                    className="input-field"
                  >
                    <option value="">All Brands</option>
                    {BRANDS.map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fuel Type</label>
                  <select
                    name="fuelType"
                    value={filters.fuelType}
                    onChange={handleFilterChange}
                    className="input-field"
                  >
                    <option value="">All Fuel Types</option>
                    {FUEL_TYPES.map(f => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      name="minPrice"
                      value={filters.minPrice}
                      onChange={handleFilterChange}
                      placeholder="Min"
                      className="input-field"
                    />
                    <input
                      type="number"
                      name="maxPrice"
                      value={filters.maxPrice}
                      onChange={handleFilterChange}
                      placeholder="Max"
                      className="input-field"
                    />
                  </div>
                </div>

                <button type="button" onClick={() => setShowFilters(false)} className="btn btn-primary w-full justify-center lg:hidden">
                  View Results
                </button>
              </form>
            </div>
          </div>

          {/* Vehicle Grid */}
          <div className="lg:w-3/4">
            {loading ? (
              <Loader />
            ) : vehicles.length > 0 ? (
              <>
                <p className="text-sm text-gray-500 mb-4 font-medium hidden sm:block">Showing {vehicles.length} results</p>
                <div className="flex flex-col gap-3 sm:grid sm:grid-cols-2 xl:grid-cols-3 sm:gap-6">
                  {vehicles.map((vehicle) => (
                    <VehicleCard key={vehicle._id} vehicle={vehicle} />
                  ))}
                </div>
              </>
            ) : (
              <div className="bg-white p-12 rounded-xl text-center border border-gray-100 shadow-sm flex flex-col items-center justify-center h-64">
                <Search size={48} className="text-gray-300 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">No vehicles found</h3>
                <p className="text-gray-500 max-w-sm mb-6">We couldn't find any vehicles matching your current filters.</p>
                <button onClick={clearFilters} className="btn btn-secondary">
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>


    </div>
  );
};

export default VehicleList;
