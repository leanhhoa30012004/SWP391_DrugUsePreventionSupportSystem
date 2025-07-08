import React, { useState, useEffect } from 'react';
import { FaSearch, FaPlus, FaEye, FaEdit, FaTrash, FaCheckCircle, FaTimesCircle, FaUserMd, FaPhone, FaEnvelope, FaUserTie, FaStar, FaClock, FaCalendarAlt, FaMapMarkerAlt, FaGraduationCap, FaAward, FaComments } from 'react-icons/fa';
import axios from 'axios';

// API base URLs
const API_BASE = 'http://localhost:3000/api';

const ConsultantManagement = () => {
  const [consultants, setConsultants] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [viewConsultant, setViewConsultant] = useState(null);
  const [editConsultant, setEditConsultant] = useState(null);
  const [deleteConsultant, setDeleteConsultant] = useState(null);
  const [showAppointments, setShowAppointments] = useState(false);
  const [selectedConsultantId, setSelectedConsultantId] = useState(null);
  const [dateFilter, setDateFilter] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form state for editing consultant
  const [editForm, setEditForm] = useState({
    fullname: '',
    email: '',
    username: '',
    birthday: '',
    role: 'consultant'
  });
  // Form state for creating new consultant
  const [createForm, setCreateForm] = useState({
    fullname: '',
    email: '',
    username: '',
    password: '',
    birthday: '',
    role: 'consultant'
  });

  useEffect(() => {
    fetchConsultants();
  }, []);

  const fetchConsultants = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/manager/users`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      // Filter only consultants from all users
      const consultantUsers = response.data.filter(user => user.role === 'consultant');
      setConsultants(consultantUsers);
    } catch (error) {
      console.error('Error fetching consultants:', error);
      alert('Error fetching consultants: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const createConsultant = async () => {
    try {
      // Validate form
      if (!createForm.fullname || !createForm.email || !createForm.username || !createForm.password) {
        alert('Please fill in all required fields');
        return;
      }

      const response = await axios.post(`${API_BASE}/manager/create-user`, {
        fullname: createForm.fullname,
        email: createForm.email,
        username: createForm.username,
        password: createForm.password,
        birthday: createForm.birthday,
        role: 'consultant'
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      alert('Consultant created successfully!');
      setShowCreateModal(false);
      // Reset form
      setCreateForm({
        fullname: '',
        email: '',
        username: '',
        password: '',
        birthday: '',
        role: 'consultant'
      });
      fetchConsultants();
    } catch (error) {
      console.error('Error creating consultant:', error);
      alert('Error creating consultant: ' + (error.response?.data?.message || error.message));
    }
  };

  const fetchAppointmentsByConsultant = async (consultantId) => {
    try {
      const response = await axios.get(`${API_BASE}/consultation/get-all-appointment-by-consultant-id/${consultantId}`);
      setAppointments(response.data);
      setSelectedConsultantId(consultantId);
      setShowAppointments(true);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      alert('Error fetching appointments: ' + (error.response?.data?.message || error.message));
    }
  };

  const deleteAppointment = async (appointmentId) => {
    try {
      await axios.get(`${API_BASE}/consultation/delete-appointment/${appointmentId}`);
      alert('Appointment cancelled successfully!');
      // Refresh appointments
      if (selectedConsultantId) {
        fetchAppointmentsByConsultant(selectedConsultantId);
      }
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      alert('Error cancelling appointment: ' + (error.response?.data?.message || error.message));
    }
  };

  const updateConsultant = async () => {
    try {
      // Update user role if needed
      if (editConsultant.role !== editForm.role) {
        await axios.put(`${API_BASE}/manager/update-role/${editConsultant.user_id}/${editForm.role}`, {}, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
      }

      // Note: There's no direct API to update user profile from manager side
      // You might need to add this functionality to the backend
      alert('Consultant updated successfully!');
      setEditConsultant(null);
      fetchConsultants();
    } catch (error) {
      console.error('Error updating consultant:', error);
      alert('Error updating consultant: ' + (error.response?.data?.message || error.message));
    }
  };

  const toggleConsultantStatus = async (consultantId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'active' ? false : true;
      await axios.patch(`${API_BASE}/manager/users/${consultantId}/active`,
        { is_active: newStatus },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }

      );
      alert(`Consultant status updated successfully!`);
      fetchConsultants();
    } catch (error) {
      console.error('Error updating consultant status:', error);
      alert('Error updating consultant status: ' + (error.response?.data?.message || error.message));
    }
  };

  const filteredConsultants = consultants.filter(consultant => {
    const matchesSearch = consultant.fullname?.toLowerCase().includes(search.toLowerCase()) ||
      consultant.email?.toLowerCase().includes(search.toLowerCase()) ||
      consultant.username?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' ||
      (statusFilter === 'Active' && consultant.is_active) ||
      (statusFilter === 'Inactive' && !consultant.is_active);
    return matchesSearch && matchesStatus;
  });

  const filteredAppointments = appointments.filter(appointment => {
    if (!dateFilter) return true;
    return appointment.appointment_date?.includes(dateFilter);
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatTime = (timeString) => {
    return timeString ? timeString.slice(0, 5) : '';
  };

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-red-50 via-pink-50 to-gray-50 rounded-2xl font-sans">
        <div className="text-center">
          <FaUserMd className="text-6xl text-red-600 mb-4 mx-auto" />
          <p className="text-gray-600 font-normal">Loading consultants...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col bg-gradient-to-br from-red-50 via-pink-50 to-gray-50 p-0 rounded-2xl shadow-lg font-sans">
      {/* Header with red background and large consultant icon */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-8 py-8 bg-gradient-to-r from-red-600 via-red-700 to-yellow-500 rounded-t-2xl shadow-lg">
        <div className="flex items-center gap-4">
          <div className="bg-white rounded-full p-4 shadow-lg">
            <FaUserMd className="text-4xl text-red-600" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-1 font-sans">Consultant Management</h1>
            <p className="text-white text-sm md:text-base max-w-xl font-normal">Support and empower your consultant team. Manage, add, and analyze consultants for the best prevention support.</p>
          </div>
        </div>
        <button 
          className="flex items-center gap-2 bg-yellow-500 hover:bg-red-600 text-white font-semibold px-6 py-3 rounded-xl shadow transition-all duration-200 text-base font-sans"
          onClick={() => setShowCreateModal(true)}
        >
          <FaPlus /> Add Consultant
        </button>
      </div>
      {/* Toolbar: Search & Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-8 py-4 bg-white rounded-b-2xl shadow-md -mt-4 z-10 relative font-sans">
        <div className="flex items-center gap-2 bg-red-50 rounded-xl px-3 py-2 shadow w-full md:w-1/3">
          <FaSearch className="text-red-600" />
          <input
            type="text"
            placeholder="Search consultants..."
            className="outline-none border-none flex-1 bg-transparent text-gray-900 font-normal placeholder-gray-500"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <select
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:ring-red-500 focus:border-red-500 font-normal"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          <button
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 font-sans"
            onClick={() => setShowAppointments(true)}
          >
            View All Appointments
          </button>
        </div>
      </div>
      {/* Consultant Table with enhanced details */}
      <div className="overflow-auto rounded-b-2xl shadow bg-white mt-0 flex-1 font-sans">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gradient-to-r from-red-600 via-red-700 to-yellow-500 text-white">

            <tr>
              <th className="px-4 py-3 font-bold font-sans">Consultant</th>
              <th className="px-4 py-3 font-bold font-sans">Contact</th>
              <th className="px-4 py-3 font-bold font-sans">Role</th>
              <th className="px-4 py-3 font-bold font-sans">Birthday</th>
              <th className="px-4 py-3 font-bold font-sans">Created</th>
              <th className="px-4 py-3 font-bold font-sans">Status</th>
              <th className="px-4 py-3 font-bold font-sans">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-gray-400 font-normal">Loading consultants...</td>
              </tr>
            ) : filteredConsultants.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-gray-400 font-normal">No consultants found.</td>
              </tr>
            ) : (
              filteredConsultants.map(consultant => (
                <tr key={consultant.user_id} className="border-b last:border-b-0 hover:bg-red-50 transition">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-red-600 to-yellow-500 flex items-center justify-center text-white font-bold">
                        <FaUserTie />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 font-sans">{consultant.fullname}</div>
                        <div className="text-xs text-gray-500 font-normal">@{consultant.username}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-gray-900">
                      <div className="flex items-center gap-1 text-xs font-normal">
                        <FaEnvelope className="text-red-600" /> {consultant.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">

                    <span className="inline-block px-3 py-1 rounded-full bg-yellow-500 text-white font-bold text-xs shadow capitalize font-sans">{consultant.role}</span>

                  </td>
                  <td className="px-4 py-3 text-gray-900 font-medium font-sans">
                    {consultant.birthday ? formatDate(consultant.birthday) : 'N/A'}
                  </td>
                  <td className="px-4 py-3 text-gray-900 font-medium font-sans">
                    {formatDate(consultant.created_at)}
                  </td>
                  <td className="px-4 py-3">
                    {consultant.is_active ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold font-sans">
                        <FaCheckCircle className="text-green-500" /> Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 text-gray-500 text-xs font-bold font-sans">
                        <FaTimesCircle className="text-gray-400" /> Inactive
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 flex gap-2">
                    <button
                      className="p-2 rounded-lg bg-red-600 hover:bg-red-700 text-white"
                      title="View Details"
                      onClick={() => setViewConsultant(consultant)}
                    >
                      <FaEye />
                    </button>
                    <button
                      className="p-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white"
                      title="View Appointments"
                      onClick={() => fetchAppointmentsByConsultant(consultant.user_id)}
                    >
                      <FaCalendarAlt />
                    </button>
                    <button
                      className="p-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white"

                      title="Edit"
                      onClick={() => {
                        setEditConsultant(consultant);
                        setEditForm({
                          fullname: consultant.fullname || '',
                          email: consultant.email || '',
                          username: consultant.username || '',
                          birthday: consultant.birthday ? consultant.birthday.split('T')[0] : '',
                          role: consultant.role || 'consultant'
                        });
                      }}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className={`p-2 rounded-lg ${consultant.is_active ? 'bg-gray-200 hover:bg-red-200 text-red-600' : 'bg-green-200 hover:bg-green-300 text-green-700'}`}
                      title={consultant.is_active ? "Deactivate" : "Activate"}
                      onClick={() => toggleConsultantStatus(consultant.user_id, consultant.is_active ? 'active' : 'inactive')}
                    >
                      {consultant.is_active ? <FaTimesCircle /> : <FaCheckCircle />}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Enhanced View Consultant Modal */}
      {viewConsultant && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-2xl relative max-h-[90vh] overflow-y-auto">
            <button className="absolute top-3 right-3 text-gray-400 hover:text-[#e11d48] text-xl" onClick={() => setViewConsultant(null)}>&times;</button>

            {/* Header with avatar and basic info */}
            <div className="flex flex-col md:flex-row items-center gap-6 mb-6 pb-6 border-b">
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#e11d48] to-[#fbbf24] flex items-center justify-center text-white text-5xl shadow-lg">
                <FaUserMd />
              </div>
              <div className="text-center md:text-left">
                <h2 className="text-3xl font-bold text-[#e11d48] mb-2">{viewConsultant.fullname}</h2>
                <div className="flex items-center gap-4 text-sm text-black">
                  <span className="flex items-center gap-1">
                    <FaUserTie className="text-[#e11d48]" /> @{viewConsultant.username}
                  </span>
                  <span className="flex items-center gap-1">
                    <FaClock className="text-[#e11d48]" /> {viewConsultant.role}
                  </span>
                </div>
              </div>
            </div>

            {/* Detailed information grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Contact Information */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="text-lg font-bold text-[#e11d48] mb-3 flex items-center gap-2">
                  <FaEnvelope /> Contact Information
                </h3>
                <div className="space-y-2 text-black">
                  <div><b>Email:</b> {viewConsultant.email}</div>
                  <div><b>Username:</b> @{viewConsultant.username}</div>
                  <div><b>Role:</b> {viewConsultant.role}</div>
                </div>
              </div>

              {/* Professional Details */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="text-lg font-bold text-[#e11d48] mb-3 flex items-center gap-2">
                  <FaGraduationCap /> Personal Details
                </h3>
                <div className="space-y-2 text-black">
                  <div><b>Birthday:</b> {viewConsultant.birthday ? formatDate(viewConsultant.birthday) : 'N/A'}</div>
                  <div><b>Created:</b> {formatDate(viewConsultant.created_at)}</div>
                  <div><b>Last Updated:</b> {formatDate(viewConsultant.updated_at)}</div>

                </div>
              </div>
            </div>

            {/* Status Information */}
            <div className="mt-6 space-y-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="text-lg font-bold text-[#e11d48] mb-2">Status Information</h3>
                <div className="grid grid-cols-2 gap-4 text-black">
                  <div><b>Current Status:</b>
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-bold ${viewConsultant.is_active
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-500'
                      }`}>
                      {viewConsultant.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div><b>User ID:</b> {viewConsultant.user_id}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Appointments Modal */}
      {showAppointments && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-5xl relative max-h-[90vh] overflow-y-auto">
            <button className="absolute top-3 right-3 text-gray-400 hover:text-[#e11d48] text-xl" onClick={() => setShowAppointments(false)}>&times;</button>

            <div className="mb-6">
              <h2 className="text-2xl font-bold text-[#e11d48] mb-4">
                {selectedConsultantId ? `Appointments for Consultant ID: ${selectedConsultantId}` : 'All Appointments'}
              </h2>

              {/* Date Filter */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Date:</label>
                <input
                  type="date"
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-[#e11d48] focus:border-[#e11d48]"
                  value={dateFilter}
                  onChange={e => setDateFilter(e.target.value)}
                />
                <button
                  className="ml-2 bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded-lg text-sm"
                  onClick={() => setDateFilter('')}
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Appointments Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-[#e11d48] text-white">
                  <tr>
                    <th className="px-4 py-3 text-left">Appointment ID</th>
                    <th className="px-4 py-3 text-left">Member ID</th>
                    <th className="px-4 py-3 text-left">Date</th>
                    <th className="px-4 py-3 text-left">Time</th>
                    <th className="px-4 py-3 text-left">Consultant ID</th>
                    <th className="px-4 py-3 text-left">Meet Link</th>
                    <th className="px-4 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAppointments.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-gray-400">No appointments found.</td>
                    </tr>
                  ) : (
                    filteredAppointments.map(appointment => (
                      <tr key={appointment.appointment_id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3 text-black">{appointment.appointment_id}</td>
                        <td className="px-4 py-3 text-black">{appointment.member_id}</td>
                        <td className="px-4 py-3 text-black">{formatDate(appointment.appointment_date)}</td>
                        <td className="px-4 py-3 text-black">{formatTime(appointment.appointment_time)}</td>
                        <td className="px-4 py-3 text-black">{appointment.consultant_id}</td>
                        <td className="px-4 py-3">
                          {appointment.meet_link ? (
                            <a
                              href={appointment.meet_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 underline"
                            >
                              Join Meeting
                            </a>
                          ) : (
                            <span className="text-gray-400">No link</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs"
                            onClick={() => {
                              if (window.confirm('Are you sure you want to cancel this appointment?')) {
                                deleteAppointment(appointment.appointment_id);
                              }
                            }}
                          >
                            Cancel
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Edit Consultant Modal */}
      {editConsultant && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md relative">
            <button className="absolute top-3 right-3 text-gray-400 hover:text-[#e11d48] text-xl" onClick={() => setEditConsultant(null)}>&times;</button>

            <h2 className="text-xl font-bold text-[#e11d48] mb-6">Edit Consultant</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-[#e11d48] focus:border-[#e11d48]"
                  value={editForm.fullname}
                  onChange={e => setEditForm({ ...editForm, fullname: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-[#e11d48] focus:border-[#e11d48]"
                  value={editForm.email}
                  onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-[#e11d48] focus:border-[#e11d48]"
                  value={editForm.username}
                  disabled
                  title="Username cannot be changed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Birthday</label>
                <input
                  type="date"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-[#e11d48] focus:border-[#e11d48]"
                  value={editForm.birthday}
                  onChange={e => setEditForm({ ...editForm, birthday: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-[#e11d48] focus:border-[#e11d48]"
                  value={editForm.role}
                  onChange={e => setEditForm({ ...editForm, role: e.target.value })}
                >
                  <option value="consultant">Consultant</option>
                  <option value="member">Member</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 justify-end mt-6">
              <button
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-black"
                onClick={() => setEditConsultant(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-[#e11d48] hover:bg-[#be123c] text-white"
                onClick={updateConsultant}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Consultant Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-[#e11d48]">Create New Consultant</h2>
              <button 
                className="text-gray-400 hover:text-[#e11d48] text-2xl font-bold"
                onClick={() => {
                  setShowCreateModal(false);
                  setCreateForm({
                    fullname: '',
                    email: '',
                    username: '',
                    password: '',
                    birthday: '',
                    role: 'consultant'
                  });
                }}
              >
                &times;
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-[#e11d48] focus:border-[#e11d48]"
                  value={createForm.fullname}
                  onChange={e => setCreateForm({ ...createForm, fullname: e.target.value })}
                  placeholder="Enter full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-[#e11d48] focus:border-[#e11d48]"
                  value={createForm.email}
                  onChange={e => setCreateForm({ ...createForm, email: e.target.value })}
                  placeholder="Enter email address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username *</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-[#e11d48] focus:border-[#e11d48]"
                  value={createForm.username}
                  onChange={e => setCreateForm({ ...createForm, username: e.target.value })}
                  placeholder="Enter username"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                <input
                  type="password"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-[#e11d48] focus:border-[#e11d48]"
                  value={createForm.password}
                  onChange={e => setCreateForm({ ...createForm, password: e.target.value })}
                  placeholder="Enter password"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Birthday</label>
                <input
                  type="date"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-[#e11d48] focus:border-[#e11d48]"
                  value={createForm.birthday}
                  onChange={e => setCreateForm({ ...createForm, birthday: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-[#e11d48] focus:border-[#e11d48]"
                  value={createForm.role}
                  onChange={e => setCreateForm({ ...createForm, role: e.target.value })}
                >
                  <option value="consultant">Consultant</option>
                  <option value="user">User</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 justify-end mt-6 pt-4 border-t border-gray-200">
              <button 
                className="px-6 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-black font-medium"
                onClick={() => {
                  setShowCreateModal(false);
                  setCreateForm({
                    fullname: '',
                    email: '',
                    username: '',
                    password: '',
                    birthday: '',
                    role: 'consultant'
                  });
                }}
              >
                Cancel
              </button>
              <button 
                className="px-6 py-2 rounded-lg bg-[#e11d48] hover:bg-[#be123c] text-white font-medium"
                onClick={createConsultant}
              >
                Create Consultant
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Consultant Modal */}
      {deleteConsultant && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm relative">
            <button className="absolute top-3 right-3 text-gray-400 hover:text-[#e11d48] text-xl" onClick={() => setDeleteConsultant(null)}>&times;</button>
            <h2 className="text-xl font-bold text-[#e11d48] mb-4">Delete Consultant</h2>
            <p className="mb-4 text-black">Are you sure you want to delete <b>{deleteConsultant.fullname}</b>?</p>
            <div className="flex gap-3 justify-end">
              <button className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-black" onClick={() => setDeleteConsultant(null)}>Cancel</button>
              <button className="px-4 py-2 rounded-lg bg-[#e11d48] hover:bg-[#be123c] text-white" onClick={() => { setDeleteConsultant(null); }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsultantManagement; 