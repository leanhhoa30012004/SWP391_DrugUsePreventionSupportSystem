import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Logo from '../../assets/logo-WeHope.png';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    if (!username || !password) {
      setError('Please enter both username and password.');
      return;
    }
    setLoading(true);
    try {
      // Gọi API đăng nhập admin riêng (ví dụ: /api/admin/login)
      const res = await axios.post('http://localhost:3000/api/admin/login', { username, password });
      if (res.status === 200 && res.data.token) {
        localStorage.setItem('admin_token', res.data.token);
        localStorage.setItem('admin_user', JSON.stringify(res.data.admin));
        navigate('/admin');
      } else {
        setError('Invalid admin credentials.');
      }
    } catch (err) {
      setError('Invalid admin credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-orange-100 to-red-100 py-12 px-4">
      <div className="flex flex-col items-center mb-4">
        <img src={Logo} alt="Logo" className="w-40 h-24 object-contain mb-2" />
        <h2 className="text-2xl font-bold text-red-600 mb-2">Admin Login</h2>
        <p className="text-gray-500 text-sm">Drug Prevention Support System</p>
      </div>
      <form onSubmit={handleLogin} className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">Username</label>
          <input type="text" className="w-full border border-orange-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-400" value={username} onChange={e => setUsername(e.target.value)} autoFocus />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">Password</label>
          <input type="password" className="w-full border border-orange-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-400" value={password} onChange={e => setPassword(e.target.value)} />
        </div>
        {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
        <button type="submit" disabled={loading} className={`w-full py-2 rounded-lg font-semibold text-white transition bg-gradient-to-r from-orange-500 to-red-500 hover:from-red-500 hover:to-orange-500 shadow ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}>{loading ? 'Logging in...' : 'Log in as Admin'}</button>
      </form>
    </div>
  );
};

export default AdminLogin; 