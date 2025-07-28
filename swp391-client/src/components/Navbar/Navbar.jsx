import React, { useState, useRef, useEffect } from "react";
import { Link, NavLink } from 'react-router-dom'
import Logo from "../../assets/logo-WeHope.png";
import { NavbarMenu } from './Data';
import { Bell, X, Check, CheckCheck, Circle } from 'lucide-react';
import { useNotificationContext } from "../../context/NotificationContext";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const userMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const notificationRef = useRef(null);

  // Initialize notification hook with user ID
  const {
    notifications,
    unreadCount,
    isConnected,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    fetchNotifications
  } = useNotificationContext();

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
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user from localStorage:', error);
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
    localStorage.removeItem('token');
    setUser(null);
    window.location.href = '/login';
  };

  // User menu for popover (simple dropdown)
  const menu = (
    <div className="bg-white shadow-lg rounded-md py-2 min-w-[160px] border border-gray-200">
      <Link to="/profile" className="block px-4 py-2 hover:bg-red-50 transition-colors">
        Profile
      </Link>
      <hr className="my-1" />
      <button
        onClick={handleLogout}
        className="w-full text-left px-4 py-2 text-[#E53935] hover:bg-red-50 transition-colors"
      >
        Log out
      </button>
    </div>
  );

  // Notification Bell Component
  const NotificationBell = () => (
    <div className="relative" ref={notificationRef}>
      <button
        onClick={() => setIsNotificationOpen(!isNotificationOpen)}
        className="relative p-2 text-gray-600 hover:text-[#E53935] hover:bg-gray-100 rounded-full transition-colors duration-200"
        title="Notifications"
      >
        <Bell className="w-6 h-6" />

        {/* Unread count badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-[#E53935] text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center px-1 animate-pulse">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}

        {/* Connection status indicator */}
        <div
          className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${isConnected ? 'bg-green-500' : 'bg-gray-400'
            }`}
          title={isConnected ? 'Connected' : 'Disconnected'}
        />
      </button>

      {/* Notification Dropdown */}
      {isNotificationOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 max-h-96 overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-900 text-lg">Notifications</h3>
              <div className="flex items-center space-x-3">
                {unreadCount > 0 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      markAllAsRead();
                    }}
                    className="text-sm text-[#E53935] hover:text-[#E53935]/80 flex items-center space-x-1.5 transition-all duration-200 hover:scale-105 font-medium"
                    title="Mark all as read"
                  >
                    <CheckCheck className="w-4 h-4" />
                    <span>Mark all</span>
                  </button>
                )}
                <button
                  onClick={() => setIsNotificationOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-all duration-200 hover:scale-110 p-1 rounded-full hover:bg-gray-200"
                  title="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {loading ? (
              <div className="p-6 text-center text-gray-500">
                <div className="animate-spin rounded-full h-10 w-10 border-2 border-[#E53935] border-t-transparent mx-auto"></div>
                <p className="mt-3 font-medium">Loading notifications...</p>
              </div>
            ) : error ? (
              <div className="p-6 text-center text-red-500">
                <div className="w-12 h-12 mx-auto mb-3 bg-red-100 rounded-full flex items-center justify-center">
                  <X className="w-6 h-6 text-red-500" />
                </div>
                <p className="font-medium mb-3">Error loading notifications</p>
                <button
                  onClick={fetchNotifications}
                  className="px-4 py-2 bg-[#E53935] text-white rounded-lg text-sm hover:bg-[#E53935]/90 transition-all duration-200 hover:scale-105 font-medium shadow-md"
                >
                  Try again
                </button>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <div className="w-16 h-16 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
                  <Bell className="w-8 h-8 text-gray-400" />
                </div>
                <p className="font-medium text-gray-600">No notifications</p>
                <p className="text-sm text-gray-400 mt-1">You're all caught up!</p>
              </div>
            ) : (
              notifications.map((n, index) => (
                <div
                  key={n.id}
                  className={`px-4 py-3 cursor-pointer transition-all duration-200 hover:transform hover:scale-[1.02] ${n.is_read
                      ? "bg-white hover:bg-gray-50"
                      : "bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-red-100 hover:to-indigo-100 border-l-4 border-red-500"
                    } ${index !== notifications.length - 1 ? 'border-b border-gray-50' : ''}`}
                  onClick={() => {
                    markAsRead(n.id);
                    if (n.redirect_url) window.location.href = n.redirect_url;
                  }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className={`font-medium leading-tight ${n.is_read ? 'text-gray-900' : 'text-red-900 font-semibold'
                      }`}>
                      {n.title}
                    </h4>
                    {!n.is_read && (
                      <span className="ml-2 mt-1 inline-block w-2.5 h-2.5 rounded-full bg-blue-500 flex-shrink-0 animate-pulse" />
                    )}
                  </div>

                  <div className={`text-sm leading-relaxed mb-2 ${n.is_read ? 'text-gray-600' : 'text-blue-800'
                    }`}>
                    {n.message}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-400 font-medium">
                      {n.date
                        ? new Date(n.date).toLocaleString('vi-VN', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                        : n.created_at
                          ? new Date(n.created_at).toLocaleString('vi-VN', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })
                          : ""}
                    </div>

                    {n.redirect_url && (
                      <div className="text-xs text-[#E53935] font-medium">
                        Click to view →
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {/* {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100">
              <Link
                to="/notifications"
                className="w-full text-center text-sm text-[#E53935] hover:text-[#E53935]/80 block font-semibold transition-all duration-200 hover:scale-105 py-1 px-3 rounded-lg hover:bg-white"
                onClick={() => setIsNotificationOpen(false)}
              >
                View all notifications
              </Link>
            </div>
          )} */}
        </div>
      )}
    </div>
  );

  // Log notifications mỗi lần render Navbar
  console.log("[Navbar] notifications:", notifications);

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
                      `px-3 py-2 text-sm font-medium transition-all duration-200 rounded-lg whitespace-nowrap ${isActive
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
                      src={user.avatar || `https://api.dicebear.com/9.x/adventurer/svg?seed=${user.userID || user.id || user.username || 'default'}`}
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
                        {user.fullname || user.username || 'User'}
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
                    Sign in
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 text-sm bg-[#E53935] text-white rounded-lg transition-colors duration-200 hover:bg-white hover:text-[#E53935] border border-[#E53935] whitespace-nowrap"
                  >
                    Sign up
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
                        <span className="ml-auto bg-[#E53935] text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center px-1">
                          {unreadCount > 99 ? '99+' : unreadCount}
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
                          src={user.avatar || `https://api.dicebear.com/9.x/adventurer/svg?seed=${user.userID || user.id || user.username || 'default'}`}
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
                          Hồ sơ
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full py-2 text-center bg-[#E53935] text-white rounded-lg 
                                   hover:bg-white hover:text-[#E53935] transition-colors duration-200 border-2 border-[#E53935]"
                        >
                          Đăng xuất
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
                        Đăng nhập
                      </Link>
                      <Link
                        to="/register"
                        className="w-full py-2 text-center border-2 border-[#E53935] text-[#E53935] 
                                 rounded-lg hover:bg-[#E53935] hover:text-white 
                                 transition-colors duration-200"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Đăng ký
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