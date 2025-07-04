import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import axios from 'axios'
import Logo from '../../assets/logo-WeHope.png'
import LoginBg from '../../assets/Login3.png'

const ManagerLogin = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [fadeIn, setFadeIn] = useState(false);

  React.useEffect(() => {
    setTimeout(() => setFadeIn(true), 100);
  }, []);

  // Check if manager is already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (token && ['manager', 'admin'].includes(user.role)) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [navigate]);

  // Prevent browser back navigation
  useEffect(() => {
    const handlePopState = () => {
      window.history.pushState(null, null, window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    window.history.pushState(null, null, window.location.pathname);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!username.trim()) {
      newErrors.username = 'Username is required';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setLoading(true);
    console.log("Attempting manager login with:", { username, password });
    try {
      const response = await axios.post('http://localhost:3000/api/auth/login-manager', {
        username,
        password
      });
      console.log("Login response:", response.data);
      if (response.data.token && response.data.user) {
        console.log("Login successful, redirecting...");
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        await Swal.fire({
          title: "Login Successful!",
          text: "Welcome back, Manager!",
          icon: "success",
          confirmButtonColor: "#ef4444",
          timer: 2000,
          showConfirmButton: false
        });
        // Clear browser history to prevent back navigation
        window.history.replaceState(null, null, '/manager/dashboard');
        navigate('/manager/dashboard', { replace: true });
      }
    } catch (error) {
      console.error("Login error:", error);
      console.error("Error response:", error.response?.data);
      let errorMessage = 'Invalid username or password. Please try again.';
      if (error.response) {
        switch (error.response.status) {
          case 401:
            errorMessage = 'Invalid username or password';
            break;
          case 403:
            errorMessage = 'Your account has been disabled. Please contact support.';
            break;
          case 429:
            errorMessage = 'Too many login attempts. Please try again later.';
            break;
          default:
            errorMessage = error.response.data?.message || errorMessage;
        }
      } else if (error.request) {
        errorMessage = 'Unable to connect to the server. Please check your internet connection.';
      }
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: errorMessage,
        confirmButtonColor: "#ef4444"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex bg-gray-100 transition-opacity duration-700 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
      {/* Left: Login form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center bg-white order-1 md:order-none animate-fadeInLeft">
        <div className="w-full max-w-md p-10 rounded-3xl shadow-2xl bg-white transition-transform duration-300 hover:scale-[1.02]">
          <Link to="/" className="flex justify-center mb-8">
            <img src={Logo} alt="Logo" className="w-40 drop-shadow-lg hover:scale-105 transition-transform duration-200" />
          </Link>
          <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-6 tracking-wide">
            Manager Login
          </h2>
          <form className="space-y-7" onSubmit={handleLogin}>
            {errors.username && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                ⚠️ {errors.username}
              </div>
            )}
            {errors.password && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                ⚠️ {errors.password}
              </div>
            )}
            <div>
              <label htmlFor="username" className="block text-base font-semibold text-gray-700 mb-1">
                Username
              </label>
              <div className="mt-1">
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (errors.username) {
                      setErrors(prev => ({ ...prev, username: '' }));
                    }
                  }}
                  className={`appearance-none block w-full px-4 py-3 border ${errors.username ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400 transition-all duration-200 bg-gray-50 focus:bg-white text-base`}
                  placeholder="Enter your username"
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="block text-base font-semibold text-gray-700 mb-1">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) {
                      setErrors(prev => ({ ...prev, password: '' }));
                    }
                  }}
                  className={`appearance-none block w-full px-4 py-3 pr-12 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400 transition-all duration-200 bg-gray-50 focus:bg-white text-base`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded transition-all duration-200"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <Link to="/forgot-password" className="font-medium text-red-600 hover:text-red-500 transition-colors duration-200">
                  Forgot your password?
                </Link>
              </div>
            </div>
            <div>
              <button
                type="submit"
                disabled={loading || !username || !password}
                className={`w-full flex justify-center py-3 px-4 rounded-xl shadow-lg text-base font-bold transition-all duration-200
                  ${loading
                    ? 'bg-gray-400 cursor-not-allowed text-white'
                    : 'bg-red-600 text-white hover:bg-red-700 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 shadow-red-200'}
                `}
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Logging in...
                  </span>
                ) : (
                  'Log in'
                )}
              </button>
            </div>
          </form>
          {/* Back to User Login Button */}
          <div className="w-full max-w-md mt-4 flex justify-center">
            <Link to="/login" className="w-full">
              <button
                type="button"
                className="w-full flex justify-center py-2 px-4 rounded-xl border border-gray-300 text-gray-800 text-sm font-medium bg-white shadow-none hover:bg-gray-100 active:scale-95 focus:outline-none transition-all duration-200"
              >
                Back to User Login
              </button>
            </Link>
          </div>
        </div>
      </div>
      {/* Right: Background image */}
      <div className="w-1/2 hidden md:block relative order-2 animate-fadeIn">
        <img
          src={LoginBg}
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover scale-100 transition-transform duration-1000" />
        <div className="absolute inset-0 bg-gradient-to-tl from-black/60 via-black/30 to-transparent opacity-80"></div>
      </div>
    </div>
  )
}

export default ManagerLogin 