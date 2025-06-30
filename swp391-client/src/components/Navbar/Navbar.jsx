import React, { useState, useRef, useEffect } from "react";
import { Link, NavLink } from 'react-router-dom'
import Logo from "../../assets/logo-WeHope.png";
import { NavbarMenu } from './Data';
import { IoMdSearch } from "react-icons/io";
import FaceIcon from '@mui/icons-material/Face';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const userMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);

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

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };
    if (isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isUserMenuOpen]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };
    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileMenuOpen]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/login';
  };

  // User menu for popover (simple dropdown)
  const menu = (
    <div className="bg-white shadow-lg rounded-md py-2 min-w-[160px]">
      <Link to="/profile" className="block px-4 py-2 hover:bg-red-50">Profile</Link>
      <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-[#E53935] hover:bg-red-50">Log out</button>
    </div>
  );

  return (
    <>
      {/* Spacer for fixed navbar */}
      <div className="h-[70px] sm:h-[80px] lg:h-[90px] w-full">
        <nav className={`fixed top-0 left-0 right-0 h-[70px] w-full sm:h-[80px] lg:h-[90px] bg-white z-[1000] transition-all duration-300
          ${isScrolled ? 'bg-white/95 backdrop-blur-sm shadow-md' : 'bg-white shadow-md'}`}>
          <div className="h-full w-full max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-10 lg:px-4 relative">
            {/* Logo container */}
            <div className="h-[90px] px-4 flex items-center">
              <Link to="/" className="p-2 w-[100px]">
                <img
                  src={Logo}
                  alt="Logo"
                  className="h-full w-auto object-contain"
                />
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center justify-center space-x-4 grow">
              {NavbarMenu.map((item) => (
                <NavLink
                  key={item.id}
                  to={item.link}
                  className={({ isActive }) =>
                    `px-3 py-2 text-center whitespace-nowrap transition-all duration-200 font-medium rounded-lg ${
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

            {/* Right side: Search, User/Auth, Hamburger */}
            <div className="flex items-center gap-8 lg:gap-4">
              {/* Search Bar (desktop) */}
              <div className="relative hidden sm:block ml-4">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-32 sm:w-40 lg:w-48 h-9 border-2 border-[#ac302e] rounded-full 
                           px-4 pr-6 text-sm focus:outline-none focus:border-[#e53535f2]
                           transition-all duration-200 bg-white hover:bg-red-50 text-[#ff0400]"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 text-[#E53935] hover:text-white cursor-pointer">
                  <IoMdSearch className="w-4 h-4" />
                </div>
              </div>

              {/* User Section */}
              {user ? (
                <div className="relative group">
                  <img
                    src={user.avatar || `https://api.dicebear.com/9.x/adventurer/svg?seed=${user.userId || user.userName || 'default'}`}
                    alt={user.fullName || "User"}
                    className="w-8 h-8 mx-2 lg:w-10 lg:h-10 rounded-full object-cover border cursor-pointer"
                    onClick={() => setIsUserMenuOpen((prev) => !prev)}
                  />
                  {/* Popover menu */}
                  {isUserMenuOpen && (
                    <div ref={userMenuRef} className="absolute right-0 mt-2 z-50">
                      {menu}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex gap-2">
                  <Link
                    to="/login"
                    className="px-5 py-2 text-sm text-[#E53935] border border-[#E53935] rounded-lg transition-colors duration-200 hover:bg-[#E53935] hover:text-white whitespace-nowrap"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/register"
                    className="px-5 py-2 text-sm bg-[#E53935] text-white rounded-lg transition-colors duration-200 hover:bg-white hover:text-[#E53935] border border-[#E53935] whitespace-nowrap"
                  >
                    Register
                  </Link>
                </div>
              )}

              {/* Hamburger for mobile/tablet */}
              <button
                className="lg:hidden flex flex-col justify-center items-center w-10 h-10 ml-2"
                onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                aria-label="Open menu"
              >
                <span className={`block w-6 h-0.5 bg-[#E53935] mb-1 transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
                <span className={`block w-6 h-0.5 bg-[#E53935] mb-1 transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
                <span className={`block w-6 h-0.5 bg-[#E53935] transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
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
              <div className="container mx-auto px-4 py-2">
                {/* Mobile Search */}
                <div className="py-4 border-b border-[#E53935]/20">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full h-10 px-4 pr-10 rounded-lg border-2 border-[#E53935] 
                               focus:outline-none focus:border-[#E53935] bg-white text-[#E53935]"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <IoMdSearch className="w-5 h-5 text-[#E53935]" />
                    </div>
                  </div>
                </div>

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
                </div>

                {/* Mobile User Section */}
                <div className="py-4 border-t border-[#E53935]/20">
                  {user ? (
                    <div className="px-4">
                      <div className="flex items-center mb-3">
                        <img
                          src={user.avatar || `https://api.dicebear.com/9.x/adventurer/svg?seed=${user.userId || 'default'}`}
                          alt={user.fullName}
                          className="w-10 h-10 rounded-full"
                        />
                        <span className="ml-3 font-medium text-[#E53935]">
                          {user.fullName}
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

