import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import Logo from '../../../assets/logo-WeHope.png';

const navItems = [
  { label: 'Home', path: '/manager/dashboard' },
  { label: 'User Management', path: '/manager/dashboard/users' },
  { label: 'Survey', path: '/manager/dashboard/survey' },
  { label: 'Course', path: '/manager/dashboard/course' },
  { label: 'Consultant', path: '/manager/dashboard/consultant' },
];

const SidebarLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/manager-login');
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg border-r border-gray-200 flex flex-col">
        <div className="flex flex-col items-center justify-center border-b border-gray-200 pt-10 pb-6 px-4">
          <img src={Logo} alt="WeHope Logo" className="h-16 w-16 rounded-full object-cover shadow-lg mb-4" />
          <span className="text-2xl font-extrabold text-[#e11d48] tracking-widest uppercase text-center mb-2">
            MANAGER DASHBOARD
          </span>
          <span className="block w-12 h-1 bg-[#e11d48] rounded-full mb-1"></span>
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
        <div className="px-6 pb-8 mt-auto">
          <button
            onClick={handleLogout}
            className="w-full bg-[#e11d48] hover:bg-[#be123c] text-white font-semibold py-2 rounded-xl shadow transition-all duration-200 text-base focus:outline-none focus:ring-2 focus:ring-[#e11d48] focus:ring-offset-2"
          >
            Logout
          </button>
        </div>
      </aside>
      {/* Main Content */}
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default SidebarLayout; 