import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X, Save, AlertCircle } from 'lucide-react';
import vehicleService from '../../services/vehicleService';

const AddVehicle = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    price: '',
    kmDriven: '',
    fuelType: 'Petrol',
    transmission: 'Manual',
    location: '',
    description: '',
  });

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [video, setVideo] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);

  const BRANDS = ['Maruti Suzuki', 'Hyundai', 'Tata', 'Mahindra', 'Honda', 'Toyota', 'Kia', 'BMW', 'Mercedes', 'Audi', 'Royal Enfield', 'Bajaj', 'TVS', 'Honda Two Wheelers', 'Yamaha'];
  const FUEL_TYPES = ['Petrol', 'Diesel', 'Electric', 'CNG', 'Hybrid'];
  const TRANSMISSIONS = ['Manual', 'Automatic'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 10) { // Increased to 10 images
      alert("You can only upload up to 10 images.");
      return;
    }

    setImages([...images, ...files]);

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...newPreviews]);
  };

  const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);

    const newPreviews = [...imagePreviews];
    URL.revokeObjectURL(newPreviews[index]); // Free memory
    newPreviews.splice(index, 1);
    setImagePreviews(newPreviews);
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 100 * 1024 * 1024) { // 100MB limit
        alert("Video size should be less than 100MB");
        return;
      }
      setVideo(file);
      setVideoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.location || formData.location.trim() === '') {
      setError("Location is mandatory. Please provide a valid location.");
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (images.length === 0) {
      setError("Please add at least one image.");
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    
    setError('');
    setLoading(true);

    const submitData = new FormData();
    Object.keys(formData).forEach(key => {
      submitData.append(key, formData[key]);
    });

    images.forEach(image => {
      submitData.append('images', image);
    });

    if (video) {
      submitData.append('video', video);
    }

    try {
      const res = await vehicleService.addVehicle(submitData);
      if (res.success) {
        navigate('/dealer/vehicles');
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to add vehicle. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Add New Vehicle</h1>
          <p className="text-gray-500 mt-1">Provide details and upload media for the new listing.</p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-xl flex items-start shadow-sm">
            <AlertCircle size={20} className="text-red-500 mr-3 mt-0.5" />
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Basic Details */}
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6 border-b pb-2">Basic Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Listing Title</label>
                <input 
                  type="text" name="title" required placeholder="e.g. Excellent Condition Honda City 2019"
                  className="input-field border-gray-200 focus:border-primary-500" value={formData.title} onChange={handleInputChange} 
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Brand/Make</label>
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
                  type="text" name="model" required placeholder="e.g. City ZX"
                  className="input-field border-gray-200" value={formData.model} onChange={handleInputChange} 
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Year of Manufacture</label>
                <input 
                  type="number" name="year" required min="1990" max={new Date().getFullYear()}
                  className="input-field border-gray-200" value={formData.year} onChange={handleInputChange} 
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Price (₹)</label>
                <input 
                  type="number" name="price" required min="1" placeholder="e.g. 500000"
                  className="input-field border-gray-200" value={formData.price} onChange={handleInputChange} 
                />
              </div>
            </div>
          </div>

          {/* Specifications */}
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6 border-b pb-2">Specifications</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Kilometers Driven</label>
                <input 
                  type="number" name="kmDriven" required min="0" placeholder="e.g. 45000"
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
                  type="text" name="location" required placeholder="e.g. Mumbai, Maharashtra"
                  className="input-field border-gray-200" value={formData.location} onChange={handleInputChange} 
                />
              </div>

              <div className="md:col-span-3">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Detailed Description</label>
                <textarea 
                  name="description" required rows="4" placeholder="Mention features, service history, mechanical condition..."
                  className="input-field border-gray-200" value={formData.description} onChange={handleInputChange} 
                ></textarea>
              </div>
            </div>
          </div>

          {/* Media Upload */}
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6 border-b pb-2">Media Upload</h2>
            
            <div className="space-y-6">
              {/* Images */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Vehicle Images (Required, Max 10)</label>
                <div className="flex flex-wrap gap-4">
                  {imagePreviews.map((src, index) => (
                    <div key={index} className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200">
                      <img src={src} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                      <button 
                        type="button" onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  
                  {imagePreviews.length < 10 && (
                    <label className="w-24 h-24 flex flex-col items-center justify-center border-2 border-dashed border-primary-300 rounded-lg cursor-pointer bg-primary-50 text-primary-500 hover:bg-primary-100 transition-colors">
                      <Upload size={24} />
                      <span className="text-xs font-medium mt-1">Upload</span>
                      <input 
                        type="file" multiple accept="image/*" className="hidden" 
                        onChange={handleImageChange}
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Video */}
              <div className="pt-4 border-t border-gray-100">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Video Tour (Optional, Max 100MB)</label>
                {videoPreview ? (
                  <div className="relative w-48 h-32 rounded-lg overflow-hidden border border-gray-200">
                    <video src={videoPreview} className="w-full h-full object-cover" />
                    <button 
                      type="button" onClick={() => { setVideo(null); setVideoPreview(null); }}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ) : (
                  <label className="w-full h-32 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 text-gray-500 hover:bg-gray-100 transition-colors">
                    <Upload size={32} className="mb-2 text-gray-400" />
                    <span className="text-sm font-medium">Click to upload a video tour</span>
                    <input 
                      type="file" accept="video/*" className="hidden" 
                      onChange={handleVideoChange}
                    />
                  </label>
                )}
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
              type="submit" disabled={loading}
              className="btn btn-primary px-8 py-3 font-semibold shadow-lg justify-center min-w-[150px]"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <><Save size={18} className="mr-2" /> Publish Vehicle</>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AddVehicle;
