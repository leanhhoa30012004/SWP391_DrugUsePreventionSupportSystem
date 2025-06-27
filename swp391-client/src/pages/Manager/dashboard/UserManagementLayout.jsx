import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../../../assets/logo-WeHope.png';
import UserManagement from './UserManagement';

const UserManagementLayout = () => {
  const navigate = useNavigate();
  const [managerInfo, setManagerInfo] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setManagerInfo(user);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/manager-login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b-4 border-red-500">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="flex justify-between items-center py-5">
            {/* Left: Logo + System Name */}
            <div className="flex items-center space-x-4">
              <img src={Logo} alt="WeHope Logo" className="h-12 w-12 object-contain drop-shadow-md" />
              <div className="flex flex-col">
                <span className="text-3xl font-extrabold text-gray-900 tracking-tight leading-tight">WeHope</span>
                <span className="text-sm text-gray-500 font-medium -mt-1 tracking-wide">Drug Prevention Support System</span>
              </div>
            </div>

            {/* Right: Manager Info + Logout */}
            <div className="flex items-center space-x-6">
              <div className="text-right">
                <span className="block text-base text-gray-500 font-medium">Welcome back,</span>
                <span className="block text-lg font-bold text-gray-900 leading-tight">{managerInfo?.fullname || managerInfo?.username || 'Manager'}</span>
                <span className="block text-xs text-red-500 font-semibold uppercase tracking-wider mt-0.5">{managerInfo?.role || 'Manager'}</span>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded-xl shadow transition-all duration-200 text-base focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-red-100 rounded-lg">
              <span className="text-red-600 text-xl">👥</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">User Management</h2>
          </div>
        </div>

        {/* User Management Component */}
        <UserManagement />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <p className="text-sm text-gray-600">
              © 2024 WeHope - Drug Prevention Support System. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default UserManagementLayout; 