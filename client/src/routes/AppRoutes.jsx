import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

// Public Pages
import Home from '../pages/public/Home';
import VehicleList from '../pages/public/VehicleList';
import VehicleDetails from '../pages/public/VehicleDetails';
import DealerShowroom from '../pages/public/DealerShowroom';

// Dealer Pages
import Login from '../pages/dealer/Login';
import Dashboard from '../pages/dealer/Dashboard';
import AddVehicle from '../pages/dealer/AddVehicle';
import EditVehicle from '../pages/dealer/EditVehicle';
import VehicleTable from '../pages/dealer/VehicleTable';
import Settings from '../pages/dealer/Settings';
import ForgotPassword from '../pages/dealer/ForgotPassword';
import ResetPassword from '../pages/dealer/ResetPassword';

// Layouts or Components
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ProtectedRoute = ({ children }) => {
  const { dealer, loading } = useAuth();
  
  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  
  if (!dealer) {
    return <Navigate to="/dealer/login" />;
  }
  
  return children;
};

const AppRoutes = () => {
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/vehicles" element={<VehicleList />} />
          <Route path="/vehicles/:id" element={<VehicleDetails />} />
          <Route path="/dealer/:id" element={<DealerShowroom />} />

          {/* Dealer Routes */}
          <Route path="/dealer/login" element={<Login />} />
          <Route path="/dealer/forgot-password" element={<ForgotPassword />} />
          <Route path="/dealer/reset-password/:token" element={<ResetPassword />} />
          <Route 
            path="/dealer/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dealer/vehicles" 
            element={
              <ProtectedRoute>
                <VehicleTable />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dealer/vehicles/add" 
            element={
              <ProtectedRoute>
                <AddVehicle />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dealer/vehicles/edit/:id" 
            element={
              <ProtectedRoute>
                <EditVehicle />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dealer/settings" 
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </main>
      {location.pathname === '/' && <Footer />}
    </div>
  );
};

export default AppRoutes;
