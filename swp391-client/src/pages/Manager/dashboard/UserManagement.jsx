import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../config/axios/axiosInstance';
import { Link } from 'react-router-dom';
import Logo from '../../../assets/logo-WeHope.png';
import { FaEdit } from 'react-icons/fa';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [error, setError] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editUserData, setEditUserData] = useState({ user_id: '', fullname: '', email: '', birthday: '', password: '', role: '' });

  // Form state
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    fullname: '',
    email: '',
    phone: '',
    birthday: '',
    role: 'member'
  });

  // Lấy user hiện tại từ localStorage
  const currentUser = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/manager/users');
      setUsers(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post('/manager/create-user', formData);
      setShowCreateModal(false);
      setFormData({
        username: '',
        password: '',
        fullname: '',
        email: '',
        phone: '',
        birthday: '',
        role: 'member'
      });
      fetchUsers();
      setError(''); // Xóa lỗi cũ nếu có
      // Hiển thị thông báo thành công từ BE
      console.log(res.data.message)
      alert(res.data.message || 'User created successfully FE');
    } catch (error) {
      console.error('Error creating user:', error);
      // Hiển thị thông báo lỗi từ BE
      setError(error.response?.data?.message || 'Failed to create user');
      alert(error.response?.data?.message || 'Failed to create user');
    }
  };

  const handleUpdateRole = async (userId, newRole) => {
    try {
      await axiosInstance.put(`/manager/update-role/${userId}/${newRole}`);
      // Cập nhật role ngay trên state users, không fetch lại toàn bộ
      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          (u.user_id || u.id || u.username) === userId
            ? { ...u, role: newRole }
            : u
        )
      );
      setError('');
    } catch (error) {
      console.error('Error updating role:', error);
      setError('Failed to update user role');
    }
  };

  // NHỮNG THAY ĐỔI ĐÃ THỰC HIỆN: Thay thế chức năng delete bằng toggle active/inactive
  // - Thêm soft delete sử dụng flag is_active thay vì hard delete
  // - Thêm optimistic UI updates để cải thiện trải nghiệm người dùng
  // - Thêm xử lý lỗi phù hợp
  // - Duy trì tính toàn vẹn dữ liệu trong khi cho phép deactivate user
  const handleToggleActive = async (userId, currentActive) => {
    try {
      await axiosInstance.patch(`/manager/users/${userId}/active`, { is_active: !currentActive });
      setUsers((prevUsers) => prevUsers.map(u =>
        (u.user_id || u.id || u.username) === userId ? { ...u, is_active: !currentActive } : u
      ));
      setError('');
    } catch (error) {
      console.error('Error toggling active:', error);
      setError('Failed to update user status');
    }
  };

  // NHỮNG THAY ĐỔI ĐÃ THỰC HIỆN: Cập nhật chức năng edit user
  // - Thêm validation cho các trường bắt buộc (fullname, email, birthday)
  // - Thêm hỗ trợ cập nhật password tùy chọn
  // - Thêm chức năng cập nhật role
  // - Cải thiện xử lý lỗi với thông báo lỗi từ backend
  // - Thêm reset form đúng cách sau khi cập nhật thành công
  const handleEditUser = async (e) => {
    e.preventDefault();
    // Kiểm tra các trường bắt buộc
    if (!editUserData.fullname || !editUserData.email || !editUserData.birthday) {
      alert('Fullname, Email, and Birthday are required!');
      return;
    }
    try {
      const res = await axiosInstance.put(`/manager/users/${editUserData.user_id}`, {
        fullname: editUserData.fullname,
        email: editUserData.email,
        password: editUserData.password || '', // truyền chuỗi rỗng nếu không đổi
        role: editUserData.role,
        birthday: editUserData.birthday,
      });
      setShowEditModal(false);
      setEditUserData({ user_id: '', fullname: '', email: '', birthday: '', password: '', role: '' });
      setError('');
      alert(res.data.message || 'User updated successfully!');
      fetchUsers();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update user');
      alert(error.response?.data?.message || 'Failed to update user');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'manager': return 'bg-blue-100 text-blue-800';
      case 'consultant': return 'bg-green-100 text-green-800';
      case 'member': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-red-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-400">🔍</span>
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent w-full sm:w-64"
              />
            </div>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-4 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="consultant">Consultant</option>
              <option value="member">Member</option>
            </select>
          </div>

          {/* Create User Button */}
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors duration-200"
          >
            <span className="text-white">➕</span>
            <span className="text-white font-bold">Create User</span>
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-red-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-red-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#000000] uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#000000] uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#000000] uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#000000] uppercase uppercase tracking-wider">
                  Birthday
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#000000] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-red-200">
              {filteredUsers.map((user) => {
                const uid = user.user_id || user.id || user.username;
                return (
                  <tr key={uid} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                            <span className="text-sm font-medium text-red-600">
                              {user.fullname?.charAt(0)?.toUpperCase() || user.username?.charAt(0)?.toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-[#000000]">{user.fullname}</div>
                          <div className="text-sm text-[#000000]">@{user.username}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-[#000000]">{user.email}</div>
                      <div className="text-sm text-[#000000]">{user.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={user.role}
                        onChange={(e) => handleUpdateRole(uid, e.target.value)}
                        className={`text-xs font-medium px-2 py-1 rounded-full ${getRoleBadgeColor(user.role)} border-0 focus:ring-2 focus:ring-red-500`}
                      >
                        <option value="admin">Admin</option>
                        <option value="manager">Manager</option>
                        <option value="consultant">Consultant</option>
                        <option value="member">Member</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#000000]">
                      {user.birthday ? new Date(user.birthday).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleToggleActive(uid, user.is_active)}
                          className={`relative w-12 h-7 flex items-center rounded-full p-1 transition-colors duration-300 focus:outline-none border shadow-sm
                            ${user.is_active ? 'bg-red-500 border-red-600' : 'bg-gray-300 border-gray-400'}`}
                          title={user.is_active ? 'Deactivate user' : 'Activate user'}
                          style={{ minWidth: '48px' }}
                        >
                          <span
                            className={`inline-block w-5 h-5 transform bg-white rounded-full shadow-md transition-transform duration-300 absolute top-1/2 -translate-y-1/2
                              ${user.is_active ? 'right-1' : 'left-1'}`}
                            style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.10)', zIndex: 3 }}
                          >
                            {user.is_active ? (
                              <svg className="w-4 h-4 text-red-500 mx-auto mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                            ) : (
                              <svg className="w-4 h-4 text-gray-500 mx-auto mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                            )}
                          </span>
                        </button>
                        <span className={`font-semibold text-xs select-none transition-colors duration-300 ml-2 ${user.is_active ? 'text-red-600' : 'text-red-700'}`}>
                          {user.is_active ? 'Active' : 'Inactive'}
                        </span>
                        <button
                          className="ml-2 p-2 rounded-lg bg-[#e11d48] hover:bg-[#be123c] text-white"
                          title="Edit Profile"
                          onClick={() => {
                            setEditUserData({
                              user_id: uid,
                              username: user.username, // thêm dòng này!
                              fullname: user.fullname || '',
                              email: user.email || '',
                              birthday: user.birthday ? new Date(user.birthday).toISOString().split('T')[0] : '',
                              password: '',
                              role: user.role || '',
                            });
                            console.log(user);
                            setShowEditModal(true);
                          }}
                        >
                          <FaEdit />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <span className="text-4xl">👥</span>
            <h3 className="mt-2 text-sm font-medium text-[#000000]">No users found</h3>
            <p className="mt-1 text-sm text-[#000000]">
              {searchTerm || selectedRole !== 'all'
                ? 'Try adjusting your search or filter criteria.'
                : 'Get started by creating a new user.'}
            </p>
          </div>
        )}
      </div>

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="relative w-full max-w-md mx-auto bg-white rounded-2xl shadow-2xl p-8 animate-fadeInUp">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white tracking-tight">Create New User</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-red-500 text-2xl font-bold focus:outline-none"
                title="Close"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleCreateUser} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-[#000000] mb-1">Username</label>
                <input
                  type="text"
                  required
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full px-4 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-red-400 transition-all bg-red-50 text-base"
                  placeholder="Enter username"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#000000] mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-red-400 transition-all bg-red-50 text-base"
                  placeholder="Enter password"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#000000] mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.fullname}
                  onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
                  className="w-full px-4 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-red-400 transition-all bg-red-50 text-base"
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#000000] mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-red-400 transition-all bg-red-50 text-base"
                  placeholder="Enter email"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#000000] mb-1">Birthday</label>
                <input
                  type="date"
                  required
                  value={formData.birthday}
                  onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
                  className="w-full px-4 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-red-400 transition-all bg-red-50 text-base"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#000000] mb-1">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-4 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-red-400 transition-all bg-red-50 text-base"
                >
                  <option value="member">Member</option>
                  <option value="consultant">Consultant</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex flex-col sm:flex-row sm:space-x-6 space-y-3 sm:space-y-0 pt-4 justify-center items-center">
                <button
                  type="submit"
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-xl font-semibold shadow-md transition-all duration-200 text-base min-w-[140px]"
                >
                  Create User
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 bg-red-200 hover:bg-red-300 text-red-700 py-2 px-4 rounded-xl font-semibold shadow-md transition-all duration-200 text-base min-w-[140px]"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="relative w-full max-w-md mx-auto bg-white rounded-2xl shadow-2xl p-8 animate-fadeInUp">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-[#000000] tracking-tight">Edit User Profile</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-red-500 text-2xl font-bold focus:outline-none"
                title="Close"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleEditUser} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-[#000000] mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editUserData.fullname}
                  onChange={(e) => setEditUserData({ ...editUserData, fullname: e.target.value })}
                  className="w-full px-4 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-red-400 transition-all bg-red-50 text-base"
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#000000] mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={editUserData.email}
                  onChange={(e) => setEditUserData({ ...editUserData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-red-400 transition-all bg-red-50 text-base"
                  placeholder="Enter email"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#000000] mb-1">Birthday</label>
                <input
                  type="date"
                  required
                  value={editUserData.birthday}
                  onChange={(e) => setEditUserData({ ...editUserData, birthday: e.target.value })}
                  className="w-full px-4 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-red-400 transition-all bg-red-50 text-base"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#000000] mb-1">Password (leave blank to keep current)</label>
                <input
                  type="password"
                  value={editUserData.password}
                  onChange={(e) => setEditUserData({ ...editUserData, password: e.target.value })}
                  className="w-full px-4 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-red-400 transition-all bg-red-50 text-base"
                  placeholder="Enter new password"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#000000] mb-1">Role</label>
                <select
                  value={editUserData.role}
                  onChange={(e) => setEditUserData({ ...editUserData, role: e.target.value })}
                  className="w-full px-4 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-red-400 transition-all bg-red-50 text-base"
                >
                  <option value="member">Member</option>
                  <option value="consultant">Consultant</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex flex-col sm:flex-row sm:space-x-6 space-y-3 sm:space-y-0 pt-4 justify-center items-center">
                <button
                  type="submit"
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-xl font-semibold shadow-md transition-all duration-200 text-base min-w-[140px]"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 bg-red-200 hover:bg-red-300 text-red-700 py-2 px-4 rounded-xl font-semibold shadow-md transition-all duration-200 text-base min-w-[140px]"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement; 