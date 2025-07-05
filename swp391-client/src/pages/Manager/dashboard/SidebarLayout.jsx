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
      <aside className="w-64 bg-white shadow-2xl border-r-2 border-[#e11d48]/20 flex flex-col rounded-r-3xl">
        <div className="flex flex-col items-center justify-center border-b-2 border-[#e11d48]/20 pt-10 pb-6 px-4">
          <img src={Logo} alt="WeHope Logo" className="h-20 w-20 rounded-full object-cover shadow-xl mb-4 border-4 border-[#e11d48]/30" />
          <span className="text-2xl font-extrabold text-[#e11d48] tracking-widest uppercase text-center mb-2 drop-shadow">MANAGER DASHBOARD</span>
          <span className="block w-16 h-1 bg-[#e11d48] rounded-full mb-1"></span>
        </div>
        <nav className="flex-1 py-8">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`block px-7 py-3 rounded-xl font-semibold text-base transition-colors duration-200 tracking-wide
                    ${location.pathname === item.path ? 'bg-[#e11d48]/10 text-[#e11d48] shadow' : 'text-gray-700 hover:bg-[#e11d48]/5 hover:text-[#e11d48]'}`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      {/* Main Content */}
      <main className="flex-1 p-8 bg-[#fff] min-h-screen rounded-l-3xl shadow-inner">
        <Outlet />
      </main>
    </div>
  );
};

export default SidebarLayout; 