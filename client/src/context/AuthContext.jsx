import React, { createContext, useState, useEffect } from 'react';
import dealerService from '../services/dealerService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [dealer, setDealer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedDealerInfo = localStorage.getItem('dealerInfo');
    if (storedDealerInfo) {
      try {
        setDealer(JSON.parse(storedDealerInfo));
      } catch (e) {
        console.error('Error parsing stored dealer information', e);
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    const data = await dealerService.login(credentials);
    if (data.success) {
      setDealer(data.data);
    }
    return data;
  };

  const register = async (dealerData) => {
    const data = await dealerService.register(dealerData);
    if (data.success) {
      setDealer(data.data);
    }
    return data;
  };

  const logout = () => {
    dealerService.logout();
    setDealer(null);
  };

  const googleAuth = async (token) => {
    const data = await dealerService.googleAuth(token);
    if (data.success) {
      setDealer(data.data);
    }
    return data;
  };

  return (
    <AuthContext.Provider value={{ dealer, login, register, logout, googleAuth, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
