import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Phone, MapPin, Building2, Car } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    showroomName: '',
    city: '',
    whatsappNumber: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, register, googleAuth } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const res = await login({ email: formData.email, password: formData.password });
        if (res.success) {
          navigate('/dealer/dashboard');
        } else {
          setError(res.message || 'Login failed');
        }
      } else {
        const res = await register(formData);
        if (res.success) {
          navigate('/dealer/dashboard');
        } else {
          setError(res.message || 'Registration failed');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      const res = await googleAuth(credentialResponse.credential);
      if (res.success) {
        navigate('/dealer/dashboard');
      } else {
        setError('Google authentication failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Google Auth Error');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError('Google Login Failed');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="bg-primary-600 text-white p-3 rounded-2xl inline-block mb-4 shadow-lg shadow-primary-500/30">
          <Car size={32} />
        </div>
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Dealer Portal
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          {isLogin ? 'Sign in to manage your inventory' : 'Register to start selling vehicles'}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-gray-100 relative overflow-hidden">
          {/* Decorative background element */}
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-24 h-24 rounded-full bg-primary-50 opacity-50 pointer-events-none"></div>
          
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-lg">
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            {!isLogin && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input 
                        name="name" type="text" required={!isLogin} 
                        className="input-field pl-9" placeholder="John Doe"
                        value={formData.name} onChange={handleChange} 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input 
                        name="phone" type="text" required={!isLogin} 
                        className="input-field pl-9" placeholder="+91 xxxxx xxxxx"
                        value={formData.phone} onChange={handleChange} 
                      />
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Showroom Name</label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input 
                        name="showroomName" type="text" required={!isLogin} 
                        className="input-field pl-9" placeholder="Auto Sales"
                        value={formData.showroomName} onChange={handleChange} 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input 
                        name="city" type="text" required={!isLogin} 
                        className="input-field pl-9" placeholder="Mumbai"
                        value={formData.city} onChange={handleChange} 
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input 
                      name="whatsappNumber" type="text" required={!isLogin} 
                      className="input-field pl-9" placeholder="For customer inquiries"
                      value={formData.whatsappNumber} onChange={handleChange} 
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                  name="email" type="email" required 
                  className="input-field pl-9" placeholder="dealer@example.com"
                  value={formData.email} onChange={handleChange} 
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                  name="password" type="password" required 
                  className="input-field pl-9" placeholder="••••••••"
                  value={formData.password} onChange={handleChange} 
                />
              </div>
            </div>

            {isLogin && (
              <div className="flex justify-end">
                <Link to="/dealer/forgot-password" className="text-sm font-medium text-primary-600 hover:text-primary-500">
                  Forgot Password?
                </Link>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full py-2.5 text-base font-semibold shadow-md focus:ring-offset-2 flex justify-center"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              ) : isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="mt-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">Or continue with</span>
              </div>
            </div>
            
            <div className="mt-4 flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                shape="rectangular"
                size="large"
                theme="outline"
                width="100%"
              />
            </div>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm font-medium text-primary-600 hover:text-primary-500 focus:outline-none bg-transparent"
            >
              {isLogin ? "Don't have an account? Register here" : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
