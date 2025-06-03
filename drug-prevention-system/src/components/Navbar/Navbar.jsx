import React, { useState } from "react";
import { Link } from 'react-router-dom'
import Logo from "../../assets/logo-WeHope.png";  
import { NavbarMenu } from './Data';
import { IoMdSearch } from "react-icons/io";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Add scroll event listener
  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Spacer for fixed navbar */}
      <div className="h-[70px] sm:h-[80px] lg:h-[90px] w-full">
      
        <nav className={`fixed top-0 left-0 right-0 h-[70px] w-full sm:h-[80px] lg:h-[90px] bg-white z-[1000] transition-all duration-300
        ${isScrolled ? 'bg-white/95 backdrop-blur-sm shadow-md' : 'bg-white shadow-md'}
        `}>
            <div className="h-full w-full max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-10 lg:px-4">
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

                {/* Right side: Menu, Search, and Auth */}
                <div className="flex items-center gap-6 grow justify-end">

                  {/* Menu items */}
                  <div className="hidden lg:flex items-center justify-center space-x-4 grow">
                    {NavbarMenu.map((item) => (
                      <Link
                          key={item.id}
                          to={item.link}
                          className="text-gray-700 font-medium hover:text-red-600 px-1 py-2 text-center transition-colors duration-200 whitespace-nowrap"
                      >
                          {item.title}
                      </Link>
                      ))}
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Search Bar */}
                    <div className="relative hidden sm:block">
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-32 sm:w-40 lg:w-48 h-9 border-2 border-gray-200 rounded-full 
                                 px-4 pr-6 text-sm focus:outline-none focus:border-red-500
                                 transition-all duration-200 bg-white hover:bg-gray-50"
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer">
                      <IoMdSearch className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Auth Buttons */}
                  <div className="flex items-center gap-2">
                    {/* Login Button */}
                    <Link 
                      to="/login"
                      className="px-3 py-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200 text-sm whitespace-nowrap"
                    >
                      Log in
                    </Link>
                  </div>
                  </div>
                </div>
              </div>
        </nav>
      </div>
    </>
  )
}

export default Navbar;

