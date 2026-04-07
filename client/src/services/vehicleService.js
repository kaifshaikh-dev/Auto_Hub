import api from './api';

const vehicleService = {
  // Get all vehicles (public, with filters)
  getVehicles: async (params = {}) => {
    const response = await api.get('/vehicles', { params });
    return response.data;
  },

  // Get single vehicle
  getVehicleById: async (id) => {
    const response = await api.get(`/vehicles/${id}`);
    return response.data;
  },

  // Add new vehicle (dealer private)
  addVehicle: async (vehicleData) => {
    const response = await api.post('/vehicles/add', vehicleData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Update a vehicle
  updateVehicle: async (id, vehicleData) => {
    const response = await api.put(`/vehicles/${id}`, vehicleData);
    return response.data;
  },

  // Delete a vehicle
  deleteVehicle: async (id) => {
    const response = await api.delete(`/vehicles/${id}`);
    return response.data;
  },

  // Delete multiple vehicles
  deleteMultipleVehicles: async (vehicleIds) => {
    const response = await api.post('/vehicles/bulk-delete', { vehicleIds });
    return response.data;
  }
};

export default vehicleService;
