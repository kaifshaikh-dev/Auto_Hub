import api from './api';

const dealerService = {
  // Register dealer
  register: async (dealerData) => {
    const response = await api.post('/dealers/register', dealerData);
    if (response.data.success) {
      localStorage.setItem('dealerToken', response.data.data.token);
      localStorage.setItem('dealerInfo', JSON.stringify(response.data.data));
    }
    return response.data;
  },

  // Login dealer
  login: async (credentials) => {
    const response = await api.post('/dealers/login', credentials);
    if (response.data.success) {
      localStorage.setItem('dealerToken', response.data.data.token);
      localStorage.setItem('dealerInfo', JSON.stringify(response.data.data));
    }
    return response.data;
  },

  // Logout dealer
  logout: () => {
    localStorage.removeItem('dealerToken');
    localStorage.removeItem('dealerInfo');
  },

  // Get dealer profile
  getProfile: async () => {
    const response = await api.get('/dealers/profile');
    return response.data;
  },

  // Get public dealer info
  getDealerInfo: async (id) => {
    const response = await api.get(`/dealers/${id}`);
    return response.data;
  },

  // Google Auth
  googleAuth: async (token) => {
    const response = await api.post('/dealers/google-auth', { token });
    if (response.data.success) {
      localStorage.setItem('dealerToken', response.data.data.token);
      localStorage.setItem('dealerInfo', JSON.stringify(response.data.data));
    }
    return response.data;
  },

  // Forgot Password
  forgotPassword: async (email) => {
    const response = await api.post('/dealers/forgotpassword', { email });
    return response.data;
  },

  // Reset Password
  resetPassword: async (token, password) => {
    const response = await api.put(`/dealers/resetpassword/${token}`, { password });
    if (response.data.success) {
      localStorage.setItem('dealerToken', response.data.data.token);
      localStorage.setItem('dealerInfo', JSON.stringify(response.data.data));
    }
    return response.data;
  }
};

export default dealerService;
