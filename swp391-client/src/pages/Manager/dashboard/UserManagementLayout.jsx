import React, { useState, useEffect } from 'react';
import { useNavigate, Link, Outlet, useLocation } from 'react-router-dom';
import Logo from '../../../assets/logo-WeHope.png';
import UserManagement from './UserManagement';

const navItems = [
  { label: 'User Management', path: '/manager/dashboard' },
  { label: 'Survey', path: '/manager/dashboard/survey' },
  { label: 'Course', path: '/manager/dashboard/course' },
  { label: 'Consultant', path: '/manager/dashboard/consultant' },
];

const UserManagementLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
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
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg border-r border-gray-200 flex flex-col">
        <div className="h-20 flex items-center justify-center border-b border-gray-200">
          <span className="text-2xl font-bold text-red-600 tracking-wide">Manager</span>
        </div>
        <nav className="flex-1 py-6">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`block px-6 py-3 rounded-lg font-medium transition-colors duration-200
                    ${location.pathname === item.path ? 'bg-red-100 text-red-600' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      {/* Main Content */}
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default UserManagementLayout; 