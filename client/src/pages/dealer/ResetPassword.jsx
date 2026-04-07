import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Lock, Car } from 'lucide-react';
import dealerService from '../../services/dealerService';
import useAuth from '../../hooks/useAuth';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setError('');
    setLoading(true);

    try {
      const res = await dealerService.resetPassword(token, password);
      // Optional: Because the backend sets a new token, they might be logged in. 
      // A full page reload or proper auth state update might be needed 
      // but ideally we just redirect to dashboard or login.
      if (res.success) {
        // We probably need to force AuthContext to refetch, or we can just redirect to dashboard 
        // since dealerService set the token. Wait, context needs to know.
        // Let's redirect to login and prompt them to login to be safe, or just dashboard 
        // and let ProtectedRoute handle state. Doing login page redirect.
        window.location.href = '/dealer/dashboard'; // Force reload to pick up localStorage
      } else {
        setError(res.message || 'Failed to reset password.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired token.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="bg-primary-600 text-white p-3 rounded-2xl inline-block mb-4 shadow-lg shadow-primary-500/30">
          <Car size={32} />
        </div>
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Reset Password
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Please enter your new password
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-24 h-24 rounded-full bg-primary-50 opacity-50 pointer-events-none"></div>
          
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-lg">
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                  type="password" required 
                  className="input-field pl-9" placeholder="••••••••"
                  value={password} onChange={(e) => setPassword(e.target.value)} 
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                  type="password" required 
                  className="input-field pl-9" placeholder="••••••••"
                  value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} 
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full py-2.5 text-base font-semibold shadow-md focus:ring-offset-2 flex justify-center"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              ) : 'Reset Password'}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <Link
              to="/dealer/login"
              className="text-sm font-medium text-primary-600 hover:text-primary-500"
            >
              Cancel
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
