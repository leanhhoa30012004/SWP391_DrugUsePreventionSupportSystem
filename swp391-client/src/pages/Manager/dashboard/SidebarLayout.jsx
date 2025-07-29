import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import Logo from '../../../assets/logo-WeHope.png';
import { FaSignOutAlt } from 'react-icons/fa';
import { FaBlog } from 'react-icons/fa';

const navItems = [
  { label: 'Home', path: '/manager/dashboard' },
  { label: 'User Management', path: '/manager/dashboard/users' },
  { label: 'Survey', path: '/manager/dashboard/survey' },
  { label: 'Course', path: '/manager/dashboard/course' },
  { label: 'Consultant', path: '/manager/dashboard/consultant' },
  { label: 'Community Program', path: '/manager/dashboard/community-program' },
  { label: 'Blogs', path: '/manager/dashboard/blogs'},
  { label: 'Certificate', path: '/manager/dashboard/certificate' }
];

const SidebarLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Thêm state và effect để lấy thông tin user
  const [managerInfo, setManagerInfo] = React.useState({});
  React.useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setManagerInfo(user);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/manager-login');
  };

  return (
    <div className="bg-gray-100 min-h-screen flex">
      {/* Sidebar cố định */}
      <aside className="fixed top-0 left-0 h-screen w-64 bg-white shadow-lg border-r border-gray-200 flex flex-col z-30 overflow-hidden">
        {/* Header section - cố định */}
        <div className="flex-shrink-0 flex flex-col items-center justify-center border-b-2 border-[#e11d48]/20 pt-10 pb-6 px-4">
          <img src={Logo} alt="WeHope Logo" className="h-12 w-12 rounded-full object-cover shadow-md mb-3 border-2 border-[#e11d48]/20" />
          <span className="text-2xl font-extrabold text-[#e11d48] tracking-widest uppercase text-center mb-2 drop-shadow">MANAGER DASHBOARD</span>
          <span className="block w-16 h-1 bg-[#e11d48] rounded-full mb-3"></span>
          {/* Avatar và tên user nổi bật */}
          <div className="flex flex-col items-center gap-2 mb-2 mt-2">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center font-extrabold text-2xl shadow-lg ring-4 ring-[#e11d48]/30 bg-gradient-to-br from-[#e11d48] to-[#be123c] text-white mb-1 border-2 border-white"
              title={managerInfo?.fullname || managerInfo?.username || 'Manager'}
            >
              {((managerInfo?.fullname || managerInfo?.username || 'M').split(' ').map(w => w[0]).join('') || 'M').toUpperCase()}
            </div>
            <div className="text-lg font-bold text-[#e11d48] text-center">
              {managerInfo?.fullname || managerInfo?.username || 'Manager'}
            </div>
            <div className="text-xs text-[#e11d48]/70 capitalize font-semibold bg-[#e11d48]/10 px-2 py-1 rounded-full">
              {managerInfo?.role || 'manager'}
            </div>
          </div>
        </div>
        
        {/* Navigation section - có thể scroll */}
        <nav className="flex-1 py-8 overflow-y-auto min-h-0">
          <ul className="space-y-2 px-2">
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
        
        {/* Logout section - cố định ở dưới */}
        <div className="flex-shrink-0 px-6 pb-8 pt-4">
          <button
            onClick={handleLogout}
            className="w-full bg-[#e11d48] hover:bg-[#be123c] text-white font-semibold py-2 rounded-xl shadow transition-all duration-200 text-base focus:outline-none focus:ring-2 focus:ring-[#e11d48] focus:ring-offset-2 flex items-center justify-center gap-2"
          >
            <FaSignOutAlt className="text-white" /> <span className="text-white">Logout</span>
          </button>
        </div>
      </aside>
      {/* Main Content */}
      <main className="flex-1 p-8 ml-64 bg-[#fff] min-h-screen rounded-l-3xl shadow-inner">
        <Outlet />
      </main>
    </div>
  );
};

export default SidebarLayout; 