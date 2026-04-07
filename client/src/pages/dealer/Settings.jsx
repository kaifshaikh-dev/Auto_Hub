import React from 'react';
import useAuth from '../../hooks/useAuth';

const Settings = () => {
  const { dealer } = useAuth();
  
  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
          <p className="text-gray-500 mt-1">View your profile details. Contact support for modifications.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          <h2 className="text-xl font-bold text-gray-900 border-b pb-4 mb-6">Profile Information</h2>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800">{dealer?.name}</div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800">{dealer?.email}</div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800">{dealer?.phone}</div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">WhatsApp Number</label>
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800">{dealer?.whatsappNumber}</div>
              </div>
            </div>
          </div>

          <h2 className="text-xl font-bold text-gray-900 border-b pb-4 mt-10 mb-6">Business Details</h2>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Showroom Name</label>
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800">{dealer?.showroomName}</div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">City</label>
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800">{dealer?.city}</div>
              </div>
            </div>
          </div>

          <div className="mt-10 bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-start text-blue-800">
            <div className="mr-3 mt-0.5 font-bold">ℹ️</div>
            <p className="text-sm">
              In this version, profile edits are disabled globally as part of security measures. 
              Please contact the AutoHub administration at <span className="font-semibold underline">support@autohub.com</span> to request account changes.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Settings;
