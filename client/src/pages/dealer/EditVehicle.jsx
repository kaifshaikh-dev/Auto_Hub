import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Upload, X, Save, AlertCircle } from 'lucide-react';
import vehicleService from '../../services/vehicleService';
import Loader from '../../components/Loader';

const EditVehicle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    brand: '',
    model: '',
    year: '',
    price: '',
    kmDriven: '',
    fuelType: '',
    transmission: '',
    location: '',
    description: '',
    status: 'Available'
  });

  const BRANDS = ['Maruti Suzuki', 'Hyundai', 'Tata', 'Mahindra', 'Honda', 'Toyota', 'Kia', 'BMW', 'Mercedes', 'Audi', 'Royal Enfield', 'Bajaj', 'TVS', 'Honda Two Wheelers', 'Yamaha'];
  const FUEL_TYPES = ['Petrol', 'Diesel', 'Electric', 'CNG', 'Hybrid'];
  const TRANSMISSIONS = ['Manual', 'Automatic'];

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const res = await vehicleService.getVehicleById(id);
        if (res.success) {
          const v = res.data;
          setFormData({
            title: v.title,
            brand: v.brand,
            model: v.model,
            year: v.year,
            price: v.price,
            kmDriven: v.kmDriven,
            fuelType: v.fuelType,
            transmission: v.transmission,
            location: v.location || '',
            description: v.description,
            status: v.status
          });
        }
      } catch (err) {
        setError('Failed to fetch vehicle details.');
      } finally {
        setLoading(false);
      }
    };

    fetchVehicle();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.location || formData.location.trim() === '') {
      setError("Location is mandatory. Please provide a valid location.");
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setSaving(true);
    setError('');

    try {
      const res = await vehicleService.updateVehicle(id, formData);
      if (res.success) {
        navigate('/dealer/vehicles');
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to update vehicle');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader fullScreen />;

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Edit Vehicle</h1>
          <p className="text-gray-500 mt-1">Update details for existing listing. (Image update via edit is not supported in this version)</p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-xl flex items-start">
            <AlertCircle size={20} className="text-red-500 mr-3 mt-0.5" />
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6 border-b pb-2 flex justify-between">
              Basic Details
              <div className="flex items-center text-sm font-normal">
                <span className="mr-2 text-gray-500">Status:</span>
                <select 
                  name="status" value={formData.status} onChange={handleInputChange}
                  className={`input-field py-1 px-3 w-auto min-w-[120px] font-bold ${formData.status === 'Available' ? 'text-green-600 bg-green-50 border-green-200' : 'text-gray-600 bg-gray-50'}`}
                >
                  <option value="Available">Available</option>
                  <option value="Sold">Sold</option>
                </select>
              </div>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Listing Title</label>
                <input 
                  type="text" name="title" required
                  className="input-field border-gray-200" value={formData.title} onChange={handleInputChange} 
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Brand</label>
                <input 
                  list="brand-options" name="brand" required placeholder="Select or type brand"
                  className="input-field border-gray-200" value={formData.brand} onChange={handleInputChange} 
                />
                <datalist id="brand-options">
                  {BRANDS.map(b => <option key={b} value={b} />)}
                </datalist>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Model Name</label>
                <input 
                  type="text" name="model" required
                  className="input-field border-gray-200" value={formData.model} onChange={handleInputChange} 
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Year</label>
                <input 
                  type="number" name="year" required min="1990" max={new Date().getFullYear()}
                  className="input-field border-gray-200" value={formData.year} onChange={handleInputChange} 
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Price (₹)</label>
                <input 
                  type="number" name="price" required min="1"
                  className="input-field border-gray-200" value={formData.price} onChange={handleInputChange} 
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Kilometers Driven</label>
                <input 
                  type="number" name="kmDriven" required min="0"
                  className="input-field border-gray-200" value={formData.kmDriven} onChange={handleInputChange} 
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Fuel Type</label>
                <select name="fuelType" required className="input-field border-gray-200" value={formData.fuelType} onChange={handleInputChange}>
                  {FUEL_TYPES.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Transmission</label>
                <select name="transmission" required className="input-field border-gray-200" value={formData.transmission} onChange={handleInputChange}>
                  {TRANSMISSIONS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Location</label>
                <input 
                  type="text" name="location" required
                  className="input-field border-gray-200" value={formData.location} onChange={handleInputChange} 
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                <textarea 
                  name="description" required rows="4"
                  className="input-field border-gray-200" value={formData.description} onChange={handleInputChange} 
                ></textarea>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 pb-12">
            <button 
              type="button" onClick={() => navigate('/dealer/vehicles')}
              className="btn bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-3 font-semibold"
            >
              Cancel
            </button>
            <button 
              type="submit" disabled={saving}
              className="btn btn-primary px-8 py-3 font-semibold shadow-lg justify-center min-w-[150px]"
            >
              {saving ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <><Save size={18} className="mr-2" /> Save Changes</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditVehicle;
