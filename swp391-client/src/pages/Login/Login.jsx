import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import axios from 'axios'
import Logo from '../../assets/logo-WeHope.png'
import LoginBg from '../../assets/Login.jpg'


const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [fadeIn, setFadeIn] = useState(false);
  const [shake, setShake] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  React.useEffect(() => {
    setTimeout(() => setFadeIn(true), 100);
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
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }
    setLoading(true);
    setShake(false);
    try {
      const response = await axios.post('http://localhost:3000/api/auth/login', {
        username,
        password
      });
      if (response.data.token && response.data.user) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));

        // Dispatch custom event to notify Navbar about user login
        window.dispatchEvent(new CustomEvent('userStateChanged'));

        const user = response.data.user;
        let redirectPath = '/';
        let welcomeMessage = 'Welcome back!';

        // Redirect based on user role
        if (user.role === 'manager' || user.role === 'admin') {
          redirectPath = '/admin/dashboard';
          welcomeMessage = `Welcome back, ${user.role}! Redirecting to admin dashboard...`;
        } else {
          redirectPath = '/';
          welcomeMessage = `Welcome back ${user.fullname || user.username}!`;
        }

        await Swal.fire({
          title: "Login Successful!",
          text: welcomeMessage,
          icon: "success",
          confirmButtonColor: "#ef4444",
          timer: 2000,
          showConfirmButton: false
        });

        navigate(redirectPath, { replace: true });
      }
    } catch (error) {
      setShake(true);
      setTimeout(() => setShake(false), 500);

      let errorMessage = 'Invalid username or password.';
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
        errorMessage = 'Unable to connect to server. Please check your internet connection.';
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
      {/* Left: Background image */}
      <div className="w-1/2 hidden md:block relative animate-fadeIn">
        <img
          src={LoginBg}
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover scale-100 transition-transform duration-1000" />
        <div className="absolute inset-0 bg-gradient-to-tl from-black/60 via-black/30 to-transparent opacity-80"></div>
      </div>
      {/* Right: Login form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center bg-white">
        <div className={`w-full max-w-md p-8 rounded-2xl shadow-2xl bg-white animate-fadeInRight transition-transform duration-700 hover:scale-105 focus-within:shadow-2xl ${shake ? 'animate-shake' : ''}`}>
          <Link to="/" className="flex justify-center mb-6">
            <img src={Logo} alt="Logo" className="w-40 drop-shadow-lg hover:scale-105 transition-transform duration-200" />
          </Link>
          <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-4">
            Sign in to your account
          </h2>
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
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
                  className={`appearance-none block w-full px-3 py-2 border ${errors.username ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400 transition-all duration-200 bg-gray-50 focus:bg-white`}
                  placeholder="Enter your username"
                />
                {errors.username && (
                  <p className="mt-1 text-sm text-red-600">{errors.username}</p>
                )}
              </div>
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
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
                  className={`appearance-none block w-full px-3 py-2 pr-10 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400 transition-all duration-200 bg-gray-50 focus:bg-white`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg
                      className="h-5 w-5 text-gray-400 hover:text-gray-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="h-5 w-5 text-gray-400 hover:text-gray-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
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
                disabled={loading}
                className={`w-full flex justify-center py-3 px-4 rounded-xl shadow-md text-base font-semibold transition-all duration-200
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
                    Signing in...
                  </span>
                ) : (
                  'Sign in'
                )}
              </button>
            </div>
            <div className="mt-3">
              <Link to="/manager-login">
                <button type="button" className="w-full flex justify-center py-3 px-4 rounded-xl border-2 border-red-600 text-red-600 bg-white text-base font-semibold shadow-md hover:bg-red-50 hover:border-red-700 hover:text-red-700 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200">
                  Manager Login
                </button>
              </Link>
            </div>
          </form>
          <div className="mt-6">
            <p className="text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="font-medium text-red-600 hover:text-red-500 transition-colors duration-200">
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login