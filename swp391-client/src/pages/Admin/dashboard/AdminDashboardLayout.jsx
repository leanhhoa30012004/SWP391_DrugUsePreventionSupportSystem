import React from 'react';
import { FaTachometerAlt, FaUser, FaBookOpen, FaUsers, FaPoll, FaBlog, FaCog, FaSearch, FaBell } from 'react-icons/fa';
import { Link, Outlet, useLocation } from 'react-router-dom';
import './admin-theme.css';
import Logo from '../../../assets/logo-WeHope.png';

const menu = [
  { icon: <FaTachometerAlt />, label: 'Dashboard', path: '/admin/dashboard' },
  { icon: <FaUser />, label: 'Users', path: '/admin/dashboard/users' },
  { icon: <FaPoll />, label: 'Survey', path: '/admin/dashboard/survey' },
  { icon: <FaBookOpen />, label: 'Course', path: '/admin/dashboard/course' },
  { icon: <FaUsers />, label: 'Staff', path: '/admin/dashboard/staff' },
  { icon: <FaBlog />, label: 'Blogs', path: '/admin/dashboard/blogs' },
  { icon: <FaCog />, label: 'Setting', path: '/admin/dashboard/setting' },
];

const AdminDashboardLayout = () => {
  const location = useLocation();
  
  return (
    <div>
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="sidebar-logo">
          <Link to="/">
            <img src={Logo} alt="Logo" style={{ width: 180, margin: '0 auto 0 ', cursor: 'pointer' }} />
          </Link>
        </div>
        <nav>
          <ul className="admin-sidebar-menu">
            {menu.map((item) => {
              const isActive = item.path === '/admin/dashboard'
                ? location.pathname === '/admin/dashboard' || location.pathname === '/admin/dashboard/'
                : location.pathname.startsWith(item.path);
              return (
                <li key={item.label} className={isActive ? 'active' : ''}>
                  <Link className="admin-sidebar-link" to={item.path}>
                    {item.icon} <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
      
      {/* Main content wrapper */}
      <div className="admin-main-wrapper">
        {/* Header */}
        <header className="admin-header">
          <div className="header-center">
            <div className="search-container">
              <FaSearch className="search-icon-inside" />
              <input
                className="header-search"
                placeholder="Search"
                style={{ paddingLeft: 40, paddingRight: 48 }}
              />
              <span className="search-shortcut-inside">⌘ F</span>
            </div>
          </div>
          
          <div className="header-right">
            {/* Bell notification */}
            <div className="header-bell-box">
              <span className="header-bell">
                <FaBell size={20} color="#ff5858" />
                <span className="header-bell-dot"></span>
              </span>
            </div>
            
            {/* User avatar */}
            <img 
              src="https://randomuser.me/api/portraits/men/32.jpg" 
              alt="avatar" 
              className="header-avatar" 
            />
            
            {/* User name and dropdown */}
            <span className="header-user">
              User
              <span style={{fontSize: 18, verticalAlign: 'middle'}}>▼</span>
            </span>
          </div>
        </header>
        
        {/* Main content */}
        <main className="admin-main-content">
          <Outlet />
        </main>
      </div>
      <footer className="admin-footer">
        Copyright 2025. All Rights Reserved by Tung Tung Tung Sahur
      </footer>
    </div>
  );
};

export default AdminDashboardLayout;