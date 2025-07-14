import React, { useState, useRef, useEffect } from "react";
import { Link, NavLink } from 'react-router-dom'
import Logo from "../../assets/logo-WeHope.png";
import { NavbarMenu } from './Data';
import { IoMdSearch } from "react-icons/io";
import FaceIcon from '@mui/icons-material/Face';
import { Bell, X, Check, CheckCheck, Circle } from 'lucide-react';
import useNotification from '../../hooks/useNotification';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  
  const userMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const notificationRef = useRef(null);

  // Initialize notification hook
  const {
    notifications,
    unreadCount,
    isConnected,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    fetchNotifications
  } = useNotification(user?.userId);

  // Add scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Get user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, []);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationOpen(false);
      }
    };
    
    if (isUserMenuOpen || isMobileMenuOpen || isNotificationOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isUserMenuOpen, isMobileMenuOpen, isNotificationOpen]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/login';
  };

  const handleNotificationClick = (notification) => {
    if (!notification.is_read) {
      markAsRead(notification.id);
    }
    
    if (notification.redirect_url) {
      window.open(notification.redirect_url, '_blank');
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return <Circle className="w-3 h-3 text-green-500 fill-current" />;
      case 'warning':
        return <Circle className="w-3 h-3 text-yellow-500 fill-current" />;
      case 'error':
        return <Circle className="w-3 h-3 text-red-500 fill-current" />;
      default:
        return <Circle className="w-3 h-3 text-blue-500 fill-current" />;
    }
  };

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Vừa xong';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} phút trước`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} giờ trước`;
    return `${Math.floor(diffInSeconds / 86400)} ngày trước`;
  };

  // User menu for popover (simple dropdown)
  const menu = (
    <div className="bg-white shadow-lg rounded-md py-2 min-w-[160px]">
      <Link to="/profile" className="block px-4 py-2 hover:bg-red-50">Profile</Link>
      <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-[#E53935] hover:bg-red-50">Log out</button>
    </div>
  );

  // Notification Bell Component
  const NotificationBell = () => (
    <div className="relative" ref={notificationRef}>
      <button
        onClick={() => setIsNotificationOpen(!isNotificationOpen)}
        className="relative p-2 text-gray-600 hover:text-[#E53935] hover:bg-gray-100 rounded-full transition-colors duration-200"
      >
        <Bell className="w-6 h-6" />
        
        {/* Unread count badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-[#E53935] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
        
        {/* Connection status */}
        <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-400'}`} />
      </button>

      {/* Notification Dropdown */}
      {isNotificationOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Notification</h3>
              <div className="flex items-center space-x-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-sm text-[#E53935] hover:text-[#E53935]/80 flex items-center space-x-1"
                  >
                    <CheckCheck className="w-4 h-4" />
                    <span>Mark All</span>
                  </button>
                )}
                <button
                  onClick={() => setIsNotificationOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-500">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E53935] mx-auto"></div>
                <p className="mt-2">Loading...</p>
              </div>
            ) : error ? (
              <div className="p-4 text-center text-red-500">
                <p>Error Loading Notification</p>
                <button 
                  onClick={fetchNotifications}
                  className="mt-2 px-3 py-1 bg-[#E53935] text-white rounded text-sm hover:bg-[#E53935]/80"
                >
                  Thử lại
                </button>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p>Không có thông báo nào</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                    !notification.is_read ? 'bg-red-50' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className={`text-sm font-medium ${!notification.is_read ? 'text-gray-900' : 'text-gray-700'}`}>
                          {notification.title}
                        </p>
                        {!notification.is_read && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsRead(notification.id);
                            }}
                            className="text-[#E53935] hover:text-[#E53935]/80 ml-2"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                      <p className="text-xs text-gray-400 mt-2">
                        {formatTimeAgo(notification.created_at)}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-200">
              <Link
                to="/notifications"
                className="w-full text-center text-sm text-[#E53935] hover:text-[#E53935]/80 block"
                onClick={() => setIsNotificationOpen(false)}
              >
                Xem tất cả thông báo
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Spacer for fixed navbar */}
      <div className="h-[50px] sm:h-[60px] lg:h-[90px] w-full">
        <nav className={`fixed top-0 left-0 right-0 h-[50px] sm:h-[60px] lg:h-[90px] w-full bg-white z-[1000] transition-all duration-300
          ${isScrolled ? 'bg-white/95 backdrop-blur-sm shadow-md' : 'bg-white shadow-md'}`}>
          
          {/* Container with justify-between layout */}
          <div className="h-full w-full max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-10 lg:px-4 relative">
            
            {/* Logo container */}
            <div className="w-[120px] h-[50px] sm:w-[140px] sm:h-[60px] lg:w-[200px] lg:h-[90px] flex items-center">
              <Link to="/" className="block w-full h-full relative">
                <img
                  src={Logo}
                  alt="Logo"
                  className="absolute inset-0 w-full h-full object-contain"
                />
              </Link>
            </div>

            {/* Desktop Menu - Absolute positioned center */}
            <div className="hidden lg:flex items-center justify-center transform -translate-x-1/2">
              <div className="flex items-center absolute justify-center-safe space-x-2">
                {NavbarMenu.map((item) => (
                  <NavLink
                    key={item.id}
                    to={item.link}
                    className={({ isActive }) =>
                      `px-3 py-2 text-sm font-medium transition-all duration-200 rounded-lg whitespace-nowrap ${
                        isActive
                          ? 'bg-red-50 text-red-600 font-bold shadow'
                          : 'text-gray-700 hover:text-red-600'
                      }`
                    }
                    end
                  >
                    {item.title}
                  </NavLink>
                ))}
              </div>
            </div>

            {/* Right side: Search, Notification, User/Auth, Hamburger */}
            <div className="flex items-center gap-4 flex-shrink-0">
              
              {/* Notification Bell - Only show when user is logged in */}
              {user && <NotificationBell />}

              {/* User Section */}
              {user ? (
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={user.avatar || `https://api.dicebear.com/9.x/adventurer/svg?seed=${user.userId || user.username || 'default'}`}
                      alt={user.fullname || user.username || "User"}
                      className="w-8 h-8 lg:w-10 lg:h-10 rounded-full object-cover border-2 border-[#E53935]/20 cursor-pointer hover:border-[#E53935] transition-all duration-200 hover:scale-105 shadow-sm"
                      onClick={() => setIsUserMenuOpen((prev) => !prev)}
                    />
                    {/* Popover menu */}
                    {isUserMenuOpen && (
                      <div ref={userMenuRef} className="absolute right-0 mt-2 z-50">
                        {menu}
                      </div>
                    )}
                  </div>

                  <div className="hidden xl:block">
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-gray-600">Welcome,</span>
                      <span className="text-sm font-semibold text-[#E53935] max-w-[100px] truncate">
                        {user.fullname || 'User'}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm text-[#E53935] border border-[#E53935] rounded-lg transition-colors duration-200 hover:bg-[#E53935] hover:text-white whitespace-nowrap"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 text-sm bg-[#E53935] text-white rounded-lg transition-colors duration-200 hover:bg-white hover:text-[#E53935] border border-[#E53935] whitespace-nowrap"
                  >
                    Register
                  </Link>
                </div>
              )}

              {/* Hamburger for mobile/tablet */}
              <button
                className="lg:hidden flex flex-col justify-center items-center w-8 h-8"
                onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                aria-label="Open menu"
              >
                <span className={`block w-5 h-0.5 bg-[#E53935] mb-1 transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
                <span className={`block w-5 h-0.5 bg-[#E53935] mb-1 transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
                <span className={`block w-5 h-0.5 bg-[#E53935] transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
              </button>
            </div>

            {/* Mobile/Tablet Menu Dropdown */}
            <div
              ref={mobileMenuRef}
              className={`
                absolute top-full left-0 right-0 
                bg-white shadow-lg border-t border-[#E53935]/20
                transition-all duration-300 transform
                lg:hidden
                ${isMobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0 pointer-events-none'}
              `}
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-10 lg:px-4 py-2">
               
                {/* Mobile Menu Items */}
                <div className="py-2 space-y-1">
                  {NavbarMenu.map((item) => (
                    <Link
                      key={item.id}
                      to={item.link}
                      className="flex items-center px-4 py-3 text-[#E53935] hover:bg-[#E53935]/10 
                               rounded-lg transition-colors duration-200"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.icon && (
                        <span className="mr-3 text-[#E53935]">{item.icon}</span>
                      )}
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  ))}
                  
                  {/* Mobile Notifications Link */}
                  {user && (
                    <Link
                      to="/notifications"
                      className="flex items-center px-4 py-3 text-[#E53935] hover:bg-[#E53935]/10 
                               rounded-lg transition-colors duration-200"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Bell className="w-5 h-5 mr-3" />
                      <span className="font-medium">Thông báo</span>
                      {unreadCount > 0 && (
                        <span className="ml-auto bg-[#E53935] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {unreadCount}
                        </span>
                      )}
                    </Link>
                  )}
                </div>

                {/* Mobile User Section */}
                <div className="py-4 border-t border-[#E53935]/20">
                  {user ? (
                    <div className="px-4">
                      <div className="flex items-center mb-3">
                        <img
                          src={user.avatar || `https://api.dicebear.com/9.x/adventurer/svg?seed=${user.userId || user.username || 'default'}`}
                          alt={user.fullname || user.username || "User"}
                          className="w-8 h-8 rounded-full object-cover border-2 border-[#E53935]/20"
                        />
                        <span className="ml-3 font-medium text-[#E53935]">
                          {user.fullname || user.username || 'User'}
                        </span>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Link
                          to="/profile"
                          className="w-full py-2 text-center border-2 border-[#E53935] text-[#E53935] 
                                   rounded-lg hover:bg-[#E53935] hover:text-white 
                                   transition-colors duration-200"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Profile
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full py-2 text-center bg-[#E53935] text-white rounded-lg 
                                   hover:bg-white hover:text-[#E53935] transition-colors duration-200 border-2 border-[#E53935]"
                        >
                          Log out
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2 px-4">
                      <Link
                        to="/login"
                        className="w-full py-2 text-center bg-[#E53935] text-white rounded-lg 
                                 hover:bg-white hover:text-[#E53935] transition-colors duration-200 border-2 border-[#E53935]"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Log in
                      </Link>
                      <Link
                        to="/register"
                        className="w-full py-2 text-center border-2 border-[#E53935] text-[#E53935] 
                                 rounded-lg hover:bg-[#E53935] hover:text-white 
                                 transition-colors duration-200"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Register
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        </nav>
      </div>
    </>
  );
}

export default Navbar;