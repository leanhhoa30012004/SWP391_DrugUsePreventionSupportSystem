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
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [fadeIn, setFadeIn] = useState(false);
  const [loginType, setLoginType] = useState('manager'); // 'manager' or 'consultant'

  React.useEffect(() => {
    setTimeout(() => setFadeIn(true), 100);
  }, []);

  // Check if manager is already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (token && ['manager', 'admin', 'consultant'].includes(user.role)) {
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

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      // Initialize Google OAuth
      window.location.href = 'http://localhost:3000/api/auth/google';
    } catch (error) {
      console.error("Google login error:", error);
      Swal.fire({
        icon: 'error',
        title: 'Google Login Failed',
        text: 'Unable to connect to Google. Please try again.',
        confirmButtonColor: "#ef4444"
      });
      setGoogleLoading(false);
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
          
          {/* Login Type Toggle */}
          <div className="flex mb-4 bg-gray-100 rounded-lg p-1">
            <button
              type="button"
              onClick={() => setLoginType('manager')}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all duration-200 ${
                loginType === 'manager'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Manager
            </button>
            <button
              type="button"
              onClick={() => setLoginType('consultant')}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all duration-200 ${
                loginType === 'consultant'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Consultant
            </button>
          </div>

          <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-6 tracking-wide">
            {loginType === 'consultant' ? 'Consultant Login' : 'Manager Login'}
          </h2>

          {/* Consultant Login - Only Google */}
          {loginType === 'consultant' ? (
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-gray-600 text-sm mb-6">
                  Please sign in with your Google account to continue
                </p>
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={googleLoading}
                  className={`w-full flex justify-center items-center py-3 px-4 rounded-lg border border-gray-300 text-gray-700 text-base font-medium bg-white shadow-sm transition-all duration-200 ${
                    googleLoading
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:bg-gray-50 hover:shadow-md active:scale-95'
                  }`}
                >
                  {googleLoading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Connecting to Google...
                    </span>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Sign in with Google
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            /* Manager Login - Traditional Form */
            <form className="space-y-6" onSubmit={handleLogin}>
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
          )}
          
          {/* Back to User Login Button */}
          <div className="w-full max-w-md mt-6 flex justify-center">
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