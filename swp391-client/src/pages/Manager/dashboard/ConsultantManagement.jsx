import React, { useState, useEffect } from 'react';
import { FaSearch, FaPlus, FaEye, FaEyeSlash, FaEdit, FaTrash, FaCheckCircle, FaTimesCircle, FaUserMd, FaPhone, FaEnvelope, FaUserTie, FaStar, FaClock, FaCalendarAlt, FaMapMarkerAlt, FaGraduationCap, FaAward, FaComments, FaTimes, FaInfo, FaSave, FaExclamationTriangle, FaCheck } from 'react-icons/fa';
import axiosInstance from '../../../config/axios/axiosInstance';
import axios from 'axios';



const ConsultantManagement = () => {
  const [consultants, setConsultants] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [viewConsultant, setViewConsultant] = useState(null);
  const [editConsultant, setEditConsultant] = useState(null);
  const [showAppointments, setShowAppointments] = useState(false);
  const [selectedConsultantId, setSelectedConsultantId] = useState(null);
  const [dateFilter, setDateFilter] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [notification, setNotification] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

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

  // Show notification function
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const fetchConsultants = async () => {
    try {
      setLoading(true);

      let response;
      try {
        // Try the main endpoint first with axiosInstance
        response = await axiosInstance.get('/manager/users');
      } catch (error) {
        // Try with regular axios and manual headers if axiosInstance fails
        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        try {
          response = await axios.get('http://localhost:3000/api/manager/users', { headers });
        } catch (error2) {
          response = await axios.get('http://localhost:3000/api/users', { headers });
        }
      }

      // Check if response.data is an array
      let users = [];
      if (Array.isArray(response.data)) {
        users = response.data;
      } else if (response.data && Array.isArray(response.data.users)) {
        users = response.data.users;
      } else if (response.data && Array.isArray(response.data.data)) {
        users = response.data.data;
      } else {
        users = [];
      }

      // Filter only consultants from all users
      const consultantUsers = users.filter(user => user.role === 'consultant');
      setConsultants(consultantUsers);
    } catch (error) {
      showNotification('Error fetching consultants: ' + (error.response?.data?.message || error.message), 'error');
    } finally {
      setLoading(false);

    }
  };

  const createConsultant = async () => {
    try {
      // Validate form
      if (!createForm.fullname || !createForm.email || !createForm.username || !createForm.password) {
        showNotification('Please fill in all required fields!', 'error');
        return;
      }

      let response;
      try {
        // Try with axiosInstance first
        response = await axiosInstance.post('/manager/create-user', {
          fullname: createForm.fullname,
          email: createForm.email,
          username: createForm.username,
          password: createForm.password,
          birthday: createForm.birthday,
          role: 'consultant'
        });
      } catch (error) {
        // Try with regular axios if axiosInstance fails
        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        response = await axios.post('http://localhost:3000/api/manager/create-user', {
          fullname: createForm.fullname,
          email: createForm.email,
          username: createForm.username,
          password: createForm.password,
          birthday: createForm.birthday,
          role: 'consultant'
        }, { headers });
      }

      showNotification('Consultant created successfully!', 'success');
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
      showNotification('Error creating consultant: ' + (error.response?.data?.message || error.message), 'error');
    }
  };

  const fetchAppointmentsByConsultant = async (consultantId) => {
    try {
      if (!consultantId) {
        showNotification('Invalid consultant ID provided', 'error');
        return;
      }

      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };      // Use the get-all-appointment endpoint to get complete data including appointment_id
      // Then filter by consultant_id on frontend
      const response = await axios.get(`http://localhost:3000/api/consultation/get-all-appointment/:/:`, { headers });
      
      console.log('=== APPOINTMENT FETCH DEBUG ===');
      console.log('Raw API response:', response.data);
      
      let allAppointmentsData = response.data;
      if (response.data && response.data.data) {
        allAppointmentsData = response.data.data;
      }

      console.log('Processed appointments data:', allAppointmentsData);
      console.log('Is array?', Array.isArray(allAppointmentsData));
      console.log('Length:', allAppointmentsData?.length);

      // Ensure we have an array
      if (!Array.isArray(allAppointmentsData)) {
        allAppointmentsData = allAppointmentsData ? [allAppointmentsData] : [];
      }

      console.log('Consultant ID to filter by:', consultantId, typeof consultantId);

      // Filter for this specific consultant - use strict comparison and handle type conversion
      const consultantAppointments = allAppointmentsData.filter(appointment => {
        console.log('Checking appointment:', appointment.appointment_id, 'consultant_id:', appointment.consultant_id, typeof appointment.consultant_id);
        
        // Convert both to same type for comparison
        const appointmentConsultantId = parseInt(appointment.consultant_id);
        const targetConsultantId = parseInt(consultantId);

        const matches = appointmentConsultantId === targetConsultantId;
        console.log('Match result:', matches, '(', appointmentConsultantId, '===', targetConsultantId, ')');
        
        return matches;
      });

      console.log('Filtered appointments for consultant:', consultantAppointments);
      console.log('Filtered appointments count:', consultantAppointments.length);

      // Find consultant info for display
      const consultant = consultants.find(c => c.user_id == consultantId);
      const consultantName = consultant ? consultant.fullname : 'Unknown';

      // Add consultant info to each appointment
      const enrichedAppointments = consultantAppointments.map(appointment => ({
        ...appointment,
        consultant_name: consultantName,
        consultant_email: consultant?.email || null
      }));

      setAppointments(enrichedAppointments);
      setSelectedConsultantId(consultantId);
      setShowAppointments(true);

      if (enrichedAppointments.length === 0) {
        showNotification(`No appointments found for consultant ${consultantName}`, 'info');
      } else {
        showNotification(`Found ${enrichedAppointments.length} appointments for ${consultantName}`, 'success');
      }

    } catch (error) {
      showNotification('Error fetching appointments: ' + (error.response?.data?.message || error.message), 'error');
    }
  };

  const deleteAppointment = async (appointmentId) => {
    try {
      // Check if appointmentId is valid
      if (!appointmentId || appointmentId === 'undefined') {
        showNotification('Invalid appointment ID. Cannot reject appointment.', 'error');
        return;
      }

      console.log('Attempting to reject appointment:', appointmentId); // Debug log

      let response;
      try {
        // Try with axiosInstance first
        response = await axiosInstance.get(`/consultation/reject-appointment/${appointmentId}`);
        console.log('AxiosInstance response:', response.data); // Debug log
      } catch (axiosError) {
        console.log('AxiosInstance failed, trying manual axios:', axiosError.message); // Debug log
        
        // Fallback to manual axios with headers
        const token = localStorage.getItem('token');
        const headers = {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        };
        
        try {
          response = await axios.get(`http://localhost:3000/api/consultation/reject-appointment/${appointmentId}`, { headers });
          console.log('Manual axios response:', response.data); // Debug log
        } catch (manualError) {
          console.error('Both axios methods failed:', manualError); // Debug log
          throw manualError;
        }
      }

      // Check if response indicates success
      console.log('Response status:', response.status); // Debug log
      console.log('Response data type:', typeof response.data); // Debug log
      console.log('Response data content:', response.data); // Debug log
      
      if (response.status === 200) {
        // Check the response message to determine if it was successful
        if (response.data && typeof response.data === 'string' && 
            (response.data.includes('cancelled') || response.data.includes('canceled'))) {
          showNotification('Appointment rejected successfully!', 'success');
          
          // Refresh appointments list
          if (selectedConsultantId) {
            fetchAppointmentsByConsultant(selectedConsultantId);
          } else {
            fetchAllAppointments();
          }
        } else {
          showNotification('Failed to reject appointment: ' + response.data, 'error');
        }
      } else {
        showNotification('Failed to reject appointment. Status: ' + response.status, 'error');
      }

    } catch (error) {
      console.error('Error rejecting appointment:', error);
      showNotification('Error rejecting appointment: ' + (error.response?.data?.message || error.message), 'error');
    }
  };

  const updateConsultant = async () => {
    try {
      // Validate required fields (only fullname is required now)
      if (!editForm.fullname.trim()) {
        showNotification('Please fill in the full name.', 'error');
        return;
      }

      // Check if basic info has changed (only name and birthday)
      const basicInfoChanged =
        editConsultant.fullname !== editForm.fullname.trim() ||
        (editConsultant.birthday ? editConsultant.birthday.split('T')[0] : '') !== editForm.birthday;

      if (!basicInfoChanged) {
        showNotification('No changes detected.', 'info');
        setEditConsultant(null);
        return;
      }

      let successUpdates = [];
      let errorMessages = [];

      // Try to update basic information using available endpoints
      if (editConsultant.fullname !== editForm.fullname.trim() ||
        (editConsultant.birthday ? editConsultant.birthday.split('T')[0] : '') !== editForm.birthday) {

        try {
          // Try using the manager profile endpoint with user_id parameter
          const updateData = {
            fullname: editForm.fullname.trim(),
            email: editConsultant.email, // Keep original email
            password: editConsultant.password || '', // Keep original password
            birthday: editForm.birthday || editConsultant.birthday,
            user_id: editConsultant.user_id // Add target user ID
          };

          let profileUpdated = false;

          // Approach 1: Try the new user profile update endpoint
          try {
            const response = await axiosInstance.put(`/manager/users/${editConsultant.user_id}/profile`, {
              fullname: editForm.fullname.trim(),
              email: editConsultant.email, // Keep original email  
              birthday: editForm.birthday || null
            });
            profileUpdated = true;
            successUpdates.push('Profile information');
          } catch (err1) {
            console.log('New profile endpoint failed:', err1.message);

            // Approach 2: Try with regular axios if axiosInstance fails
            try {
              const token = localStorage.getItem('token');
              const headers = {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
              };

              const response = await axios.put(`http://localhost:3000/api/manager/users/${editConsultant.user_id}/profile`, {
                fullname: editForm.fullname.trim(),
                email: editConsultant.email,
                birthday: editForm.birthday || null
              }, { headers });

              profileUpdated = true;
              successUpdates.push('Profile information');
            } catch (err2) {
              console.log('Fallback profile endpoint failed:', err2.message);

              // Approach 3: Update locally as fallback
              const updatedConsultants = consultants.map(consultant => {
                if (consultant.user_id === editConsultant.user_id) {
                  return {
                    ...consultant,
                    fullname: editForm.fullname.trim(),
                    birthday: editForm.birthday || consultant.birthday
                  };
                }
                return consultant;
              });

              setConsultants(updatedConsultants);
              errorMessages.push('Profile updates are temporary (backend limitation)');
            }
          }
        } catch (error) {
          errorMessages.push('Failed to update profile information');
          console.error('Profile update error:', error);
        }
      }

      // Show results
      if (successUpdates.length > 0 && errorMessages.length === 0) {
        showNotification('Consultant information updated successfully!', 'success');
      } else if (successUpdates.length > 0 && errorMessages.length > 0) {
        showNotification(`Partially updated: ${successUpdates.join(', ')}. Issues: ${errorMessages.join(', ')}`, 'info');
      } else if (errorMessages.length > 0) {
        showNotification(`Updates applied locally. ${errorMessages.join(', ')}`, 'info');
      }

      setEditConsultant(null);

      // Refresh consultants to get latest data from server
      if (successUpdates.length > 0) {
        fetchConsultants();
      }

    } catch (error) {
      console.error('Error updating consultant:', error);
      showNotification('Error updating consultant: ' + (error.response?.data?.message || error.message), 'error');
    }
  };

  const toggleConsultantStatus = async (consultantId, isCurrentlyActive) => {
    try {
      // Convert database values (0/1) to boolean if needed
      const currentStatus = Boolean(isCurrentlyActive);
      // Toggle the current status: if currently active, make inactive (false), and vice versa
      const newStatus = !currentStatus;

      let response;
      try {
        response = await axiosInstance.patch(`/manager/users/${consultantId}/active`,
          { is_active: newStatus }
        );
      } catch (axiosError) {
        // Fallback to regular axios with manual headers
        const token = localStorage.getItem('token');
        const headers = {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        };
        response = await axios.patch(`http://localhost:3000/api/manager/users/${consultantId}/active`,
          { is_active: newStatus },
          { headers }
        );
      }

      showNotification(`Consultant ${newStatus ? 'activated' : 'deactivated'} successfully!`, 'success');
      fetchConsultants();
    } catch (error) {
      console.error('Error toggling consultant status:', error);
      showNotification('Error updating consultant status: ' + (error.response?.data?.message || error.message), 'error');
    }
  };

  const fetchAllAppointments = async () => {
    try {
      let allAppointments = [];
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };

      console.log('=== FETCH ALL APPOINTMENTS DEBUG ===');
      
      // Call the API with colon placeholders for empty parameters
      const response = await axios.get(`http://localhost:3000/api/consultation/get-all-appointment/:/:`, { headers });

      console.log('Global appointments raw response:', response.data);

      let globalAppointments = response.data;
      if (response.data && response.data.data) {
        globalAppointments = response.data.data;
      }

      console.log('Global appointments processed:', globalAppointments);
      console.log('Is array?', Array.isArray(globalAppointments));
      console.log('Length:', globalAppointments?.length);

      if (Array.isArray(globalAppointments)) {
        // Match consultant information from our consultants list
        const consultantMap = consultants.reduce((map, consultant) => {
          // Convert to integer for consistent comparison
          map[parseInt(consultant.user_id)] = {
            name: consultant.fullname,
            email: consultant.email
          };
          return map;
        }, {});

        console.log('Consultant map:', consultantMap);

        // Add consultant info to appointments
        allAppointments = globalAppointments.map(appointment => {
          // Convert appointment consultant_id to integer for lookup
          const consultantInfo = consultantMap[parseInt(appointment.consultant_id)];
          console.log('Appointment', appointment.appointment_id, 'consultant_id:', appointment.consultant_id, 'found info:', consultantInfo);
          return {
            ...appointment,
            consultant_name: consultantInfo?.name || null,
            consultant_email: consultantInfo?.email || null
          };
        });
        
        console.log('Final enriched appointments:', allAppointments);
      }

      console.log('Setting appointments to:', allAppointments);
      console.log('Total appointments to display:', allAppointments.length);

      setAppointments(allAppointments);
      setSelectedConsultantId(null); // No specific consultant selected
      setShowAppointments(true);

      if (allAppointments.length === 0) {
        showNotification('No appointments found for any consultant', 'info');
      } else {
        showNotification(`Found ${allAppointments.length} appointments from all consultants`, 'success');
      }

    } catch (error) {
      showNotification('Error fetching all appointments: ' + (error.response?.data?.message || error.message), 'error');
    }
  };

  const filteredConsultants = consultants.filter(consultant => {
    const matchesSearch = consultant.fullname?.toLowerCase().includes(search.toLowerCase()) ||
      consultant.email?.toLowerCase().includes(search.toLowerCase()) ||
      consultant.username?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' ||
      (statusFilter === 'Active' && Boolean(consultant.is_active)) ||
      (statusFilter === 'Inactive' && !Boolean(consultant.is_active));
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
            onClick={fetchAllAppointments}
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
                    {Boolean(consultant.is_active) ? (
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
                      className={`p-2 rounded-lg ${Boolean(consultant.is_active) ? 'bg-gray-200 hover:bg-red-200 text-red-600' : 'bg-green-200 hover:bg-green-300 text-green-700'}`}
                      title={Boolean(consultant.is_active) ? "Deactivate" : "Activate"}
                      onClick={() => toggleConsultantStatus(consultant.user_id, consultant.is_active)}
                    >
                      {Boolean(consultant.is_active) ? <FaTimesCircle /> : <FaCheckCircle />}
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
        <div className="fixed inset-0 bg-white/20 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-0 w-full max-w-5xl relative max-h-[95vh] overflow-y-auto border border-gray-200 transform transition-all duration-300 scale-100">
            <button
              className="absolute top-4 right-4 w-12 h-12 bg-red-50 hover:bg-red-100 rounded-full flex items-center justify-center text-red-500 hover:text-red-600 transition-all duration-200 z-20 shadow-lg hover:shadow-xl"
              onClick={() => setViewConsultant(null)}
            >
              <FaTimes className="text-lg" />
            </button>

            {/* Header with enhanced design */}
            <div className="relative mb-0 p-8 bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-700 rounded-t-3xl text-white overflow-hidden shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm"></div>
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-10 -translate-x-10"></div>

              <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
                <div className="w-28 h-28 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-4xl shadow-2xl border-2 border-white/30 hover:scale-105 transition-transform duration-300">
                  <FaUserMd />
                </div>
                <div className="text-center md:text-left flex-1">
                  <h2 className="text-4xl font-bold mb-3 text-white drop-shadow-lg tracking-tight">{viewConsultant.fullname}</h2>
                  <div className="flex flex-wrap items-center gap-3 text-sm">
                    <span className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-white font-medium shadow-lg">
                      <FaUserTie className="text-lg" /> @{viewConsultant.username}
                    </span>
                    <span className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-white font-medium shadow-lg">
                      <FaUserMd className="text-lg" /> {viewConsultant.role}
                    </span>
                    <span className={`flex items-center gap-2 rounded-full px-4 py-2 font-medium shadow-lg ${Boolean(viewConsultant.is_active)
                      ? 'bg-green-500/90 text-white'
                      : 'bg-red-500/90 text-white'}`}>
                      {Boolean(viewConsultant.is_active) ? <FaCheckCircle className="text-lg" /> : <FaTimesCircle className="text-lg" />}
                      {Boolean(viewConsultant.is_active) ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Information Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-8 bg-gray-50">
              {/* Contact Information */}
              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200 group">
                <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <FaEnvelope className="text-white text-sm" />
                  </div>
                  Contact Information
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mt-0.5">
                      <FaEnvelope className="text-white text-xs" />
                    </div>
                    <div>
                      <p className="font-semibold text-xs text-blue-600 uppercase tracking-wide mb-1">Email</p>
                      <p className="text-sm text-gray-700 font-medium">{viewConsultant.email}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mt-0.5">
                      <FaUserTie className="text-white text-xs" />
                    </div>
                    <div>
                      <p className="font-semibold text-xs text-blue-600 uppercase tracking-wide mb-1">Username</p>
                      <p className="text-sm text-gray-700 font-medium">@{viewConsultant.username}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mt-0.5">
                      <FaUserMd className="text-white text-xs" />
                    </div>
                    <div>
                      <p className="font-semibold text-xs text-blue-600 uppercase tracking-wide mb-1">Role</p>
                      <span className="inline-block px-3 py-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg text-xs font-medium capitalize shadow-sm">
                        {viewConsultant.role}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Personal Details */}
              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-green-200 group">
                <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <FaGraduationCap className="text-white text-sm" />
                  </div>
                  Personal Details
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-3 bg-green-50 rounded-lg border border-green-100">
                    <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mt-0.5">
                      <FaClock className="text-white text-xs" />
                    </div>
                    <div>
                      <p className="font-semibold text-xs text-green-600 uppercase tracking-wide mb-1">Birthday</p>
                      <p className="text-sm text-gray-700 font-medium">{viewConsultant.birthday ? formatDate(viewConsultant.birthday) : 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-3 bg-green-50 rounded-lg border border-green-100">
                    <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mt-0.5">
                      <FaCalendarAlt className="text-white text-xs" />
                    </div>
                    <div>
                      <p className="font-semibold text-xs text-green-600 uppercase tracking-wide mb-1">Created</p>
                      <p className="text-sm text-gray-700 font-medium">{formatDate(viewConsultant.created_at)}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-3 bg-green-50 rounded-lg border border-green-100">
                    <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mt-0.5">
                      <FaEdit className="text-white text-xs" />
                    </div>
                    <div>
                      <p className="font-semibold text-xs text-green-600 uppercase tracking-wide mb-1">Last Updated</p>
                      <p className="text-sm text-gray-700 font-medium">{formatDate(viewConsultant.updated_at)}</p>
                    </div>
                  </div>
                </div>
              </div>


              {/* Status Information */}
              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-purple-200 group">
                <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <FaCheckCircle className="text-white text-sm" />
                  </div>
                  Status Information
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-3 bg-purple-50 rounded-lg border border-purple-100">
                    <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center mt-0.5">
                      <FaCheckCircle className="text-white text-xs" />
                    </div>
                    <div>
                      <p className="font-semibold text-xs text-purple-600 uppercase tracking-wide mb-1">Current Status</p>
                      <span className={`inline-block px-3 py-1 rounded-lg text-xs font-bold shadow-sm ${Boolean(viewConsultant.is_active)
                        ? 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                        : 'bg-gradient-to-r from-red-500 to-red-600 text-white'
                        }`}>
                        {Boolean(viewConsultant.is_active) ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-3 bg-purple-50 rounded-lg border border-purple-100">
                    <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center mt-0.5">
                      <FaUserMd className="text-white text-xs" />
                    </div>
                    <div>
                      <p className="font-semibold text-xs text-purple-600 uppercase tracking-wide mb-1">User ID</p>
                      <p className="text-sm text-gray-700 font-mono bg-gray-100 px-2 py-1 rounded font-medium border">{viewConsultant.user_id}</p>
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
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 justify-center p-6 bg-white border-t border-gray-200">
              <button
                onClick={() => {
                  setViewConsultant(null);
                  setEditConsultant(viewConsultant);
                  setEditForm({
                    fullname: viewConsultant.fullname || '',
                    email: viewConsultant.email || '',
                    username: viewConsultant.username || '',
                    birthday: viewConsultant.birthday ? viewConsultant.birthday.split('T')[0] : '',
                    role: viewConsultant.role || 'consultant'
                  });
                }}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-3"
              >
                <FaEdit className="text-lg" />
                Edit Consultant
              </button>
              <button
                onClick={() => fetchAppointmentsByConsultant(viewConsultant.user_id)}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-3"
              >
                <FaCalendarAlt className="text-lg" />
                View Appointments
              </button>
              <button
                onClick={() => setViewConsultant(null)}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-semibold transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-3"
              >
                <FaTimes className="text-lg" />
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Appointments Modal */}
      {showAppointments && (
        <div className="fixed inset-0 bg-white/20 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-5xl relative max-h-[90vh] overflow-y-auto">
            <button className="absolute top-3 right-3 text-gray-400 hover:text-[#e11d48] text-xl" onClick={() => setShowAppointments(false)}>&times;</button>

            <div className="mb-6">
              <h2 className="text-2xl font-bold text-[#e11d48] mb-4">
                {selectedConsultantId
                  ? `Appointments for Consultant ID: ${selectedConsultantId}`
                  : `All Appointments (${appointments.length} total)`}
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
                    <th className="px-4 py-3 text-left">Consultant</th>
                    <th className="px-4 py-3 text-left">Meet Link</th>
                    <th className="px-4 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAppointments.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-gray-400">
                        No appointments found.
                        <br />
                        <small className="text-xs">
                          Total appointments: {appointments.length},
                          Filtered: {filteredAppointments.length},
                          Date filter: {dateFilter || 'None'}
                        </small>
                      </td>
                    </tr>
                  ) : (
                    filteredAppointments.map(appointment => {
                      return (
                        <tr key={appointment.appointment_id || appointment.id || Math.random()} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-3 text-black">
                            {appointment.appointment_id || appointment.id || appointment.appointmentId || appointment.appointmentID || appointment.AppointmentID || appointment.APPOINTMENT_ID || 'N/A'}
                          </td>
                          <td className="px-4 py-3 text-black">
                            {appointment.member_id || appointment.memberId || appointment.memberID || appointment.MemberID || appointment.MEMBER_ID || 'N/A'}
                          </td>
                          <td className="px-4 py-3 text-black">{formatDate(appointment.appointment_date)}</td>
                          <td className="px-4 py-3 text-black">{formatTime(appointment.appointment_time)}</td>
                          <td className="px-4 py-3 text-black">
                            {appointment.consultant_name ? (
                              <div>
                                <div className="font-semibold">{appointment.consultant_name}</div>
                                <div className="text-xs text-gray-500">ID: {appointment.consultant_id}</div>
                                {appointment.consultant_email && (
                                  <div className="text-xs text-gray-500">{appointment.consultant_email}</div>
                                )}
                              </div>
                            ) : (
                              <span className="text-gray-600">ID: {appointment.consultant_id}</span>
                            )}
                          </td>
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
                                // Debug: Log the entire appointment object
                                console.log('Full appointment object:', appointment);
                                
                                // Try multiple possible ID fields
                                const appointmentId = appointment.appointment_id || appointment.id || appointment.appointmentId || appointment.appointmentID || appointment.AppointmentID || appointment.APPOINTMENT_ID;

                                console.log('Extracted appointment ID:', appointmentId); // Debug log

                                if (!appointmentId || appointmentId === 'undefined' || appointmentId === 'N/A') {
                                  showNotification('Invalid appointment ID. Cannot reject appointment.', 'error');
                                  console.error('No valid appointment ID found in:', appointment); // Debug log
                                  return;
                                }

                                if (window.confirm('Are you sure you want to reject this appointment?')) {
                                  console.log('Calling deleteAppointment with ID:', appointmentId); // Debug log
                                  deleteAppointment(appointmentId);
                                }
                              }}
                            >
                              Reject
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Edit Consultant Modal */}
      {editConsultant && (
        <div
          className="fixed inset-0 bg-white/20 backdrop-blur-md flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setEditConsultant(null);
            }
          }}
        >
          <div className="bg-white rounded-3xl shadow-2xl p-0 w-full max-w-2xl relative border border-gray-200 transform transition-all duration-300 scale-100 max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              className="absolute top-4 right-4 w-12 h-12 bg-red-50 hover:bg-red-100 rounded-full flex items-center justify-center text-red-500 hover:text-red-600 transition-all duration-200 z-50 shadow-lg hover:shadow-xl"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setEditConsultant(null);
              }}
            >
              <FaTimes className="text-lg" />
            </button>

            {/* Header */}
            <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-t-3xl p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-8 translate-x-8"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-8 -translate-x-8"></div>

              <div className="relative z-10 flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
                  <FaEdit className="text-white text-2xl" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold mb-1">Edit Consultant</h2>
                  <p className="text-blue-100">Update consultant information</p>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="p-8 space-y-6">
              {/* Info Notice */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <FaInfo className="text-white text-sm" />
                </div>
                <div>
                  <p className="text-sm text-blue-800 font-medium">Edit Consultant Information</p>
                  <p className="text-xs text-blue-600">Only name and birthday can be updated. Email, username, and role cannot be changed.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group">
                  <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <FaUserTie className="text-blue-500" />
                    Full Name
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all duration-200 group-hover:border-gray-300"
                    value={editForm.fullname}
                    onChange={e => setEditForm({ ...editForm, fullname: e.target.value })}
                    placeholder="Enter full name"
                  />
                </div>

                <div className="group">
                  <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <FaEnvelope className="text-green-500" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50 text-gray-500 cursor-not-allowed"
                    value={editForm.email}
                    disabled
                    title="Email cannot be changed"
                  />
                  <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                    <FaInfo className="text-gray-400" />
                    Email cannot be modified
                  </p>
                </div>

                <div className="group">
                  <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <FaUserTie className="text-gray-400" />
                    Username
                  </label>
                  <input
                    type="text"
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50 text-gray-500 cursor-not-allowed"
                    value={editForm.username}
                    disabled
                    title="Username cannot be changed"
                  />
                  <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                    <FaInfo className="text-gray-400" />
                    Username cannot be modified
                  </p>
                </div>

                <div className="group">
                  <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <FaClock className="text-purple-500" />
                    Birthday
                  </label>
                  <input
                    type="date"
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-4 focus:ring-purple-100 focus:border-purple-400 transition-all duration-200 group-hover:border-gray-300"
                    value={editForm.birthday}
                    onChange={e => setEditForm({ ...editForm, birthday: e.target.value })}
                  />
                </div>

                <div className="group md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <FaUserMd className="text-orange-500" />
                    Role
                  </label>
                  <select
                    className="w-full border-2 rounded-xl px-4 py-3 text-sm bg-gray-50 text-gray-500 cursor-not-allowed border-gray-200"
                    value={editForm.role}
                    disabled
                  >
                    <option value="consultant">Consultant</option>
                    <option value="member">Member</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                  <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                    <FaInfo className="text-gray-400" />
                    Role cannot be changed
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 justify-end pt-6 border-t border-gray-200">
                <button
                  type="button"
                  className="px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold transition-all duration-200 hover:scale-105 flex items-center gap-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setEditConsultant(null);
                  }}
                >
                  <FaTimes />
                  Cancel
                </button>
                <button
                  type="button"
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2"
                  onClick={updateConsultant}
                >
                  <FaSave />
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Consultant Modal */}
      {showCreateModal && (
        <div
          className="fixed inset-0 bg-white/20 backdrop-blur-md flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowCreateModal(false);
              setCreateForm({
                fullname: '',
                email: '',
                username: '',
                password: '',
                birthday: '',
                role: 'consultant'
              });
            }
          }}
        >
          <div className="bg-white rounded-3xl shadow-2xl p-0 w-full max-w-3xl relative border border-gray-200 max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100">
            <button
              type="button"
              className="absolute top-4 right-4 w-12 h-12 bg-red-50 hover:bg-red-100 rounded-full flex items-center justify-center text-red-500 hover:text-red-600 transition-all duration-200 z-50 shadow-lg hover:shadow-xl"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
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
              <FaTimes className="text-lg" />
            </button>
            {/* Header */}
            <div className="bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700 rounded-t-3xl p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-8 translate-x-8"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-8 -translate-x-8"></div>

              <div className="relative z-10 flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
                  <FaPlus className="text-white text-2xl" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold mb-1">Create New Consultant</h2>
                  <p className="text-green-100">Add a new consultant to the system</p>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="p-8 space-y-6">
              {/* Info Box */}
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                  <FaInfo className="text-white text-sm" />
                </div>
                <div>
                  <p className="text-sm text-green-800 font-medium">Creating new consultant account</p>
                  <p className="text-xs text-green-600">All fields marked with * are required</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group">
                  <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <FaUserTie className="text-blue-500" />
                    Full Name
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all duration-200 group-hover:border-gray-300"
                    value={createForm.fullname}
                    onChange={e => setCreateForm({ ...createForm, fullname: e.target.value })}
                    placeholder="Enter full name"
                  />
                </div>

                <div className="group">
                  <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <FaEnvelope className="text-green-500" />
                    Email Address
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-4 focus:ring-green-100 focus:border-green-400 transition-all duration-200 group-hover:border-gray-300"
                    value={createForm.email}
                    onChange={e => setCreateForm({ ...createForm, email: e.target.value })}
                    placeholder="Enter email address"
                  />
                </div>

                <div className="group">
                  <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <FaUserTie className="text-purple-500" />
                    Username
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-4 focus:ring-purple-100 focus:border-purple-400 transition-all duration-200 group-hover:border-gray-300"
                    value={createForm.username}
                    onChange={e => setCreateForm({ ...createForm, username: e.target.value })}
                    placeholder="Enter username"
                  />
                </div>

                <div className="group">
                  <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <FaEye className="text-red-500" />
                    Password
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 pr-12 text-sm focus:ring-4 focus:ring-red-100 focus:border-red-400 transition-all duration-200 group-hover:border-gray-300"
                      value={createForm.password}
                      onChange={e => setCreateForm({ ...createForm, password: e.target.value })}
                      placeholder="Enter secure password"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                <div className="group">
                  <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <FaClock className="text-orange-500" />
                    Birthday
                  </label>
                  <input
                    type="date"
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-4 focus:ring-orange-100 focus:border-orange-400 transition-all duration-200 group-hover:border-gray-300"
                    value={createForm.birthday}
                    onChange={e => setCreateForm({ ...createForm, birthday: e.target.value })}
                  />
                </div>

                <div className="group">
                  <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <FaUserMd className="text-indigo-500" />
                    Role
                  </label>
                  <select
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50 text-gray-500 cursor-not-allowed"
                    value={createForm.role}
                    disabled
                  >
                    <option value="consultant">Consultant</option>
                  </select>
                  <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                    <FaInfo className="text-gray-400" />
                    Role is fixed as consultant
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 justify-end pt-6 border-t border-gray-200">
                <button
                  type="button"
                  className="px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold transition-all duration-200 hover:scale-105 flex items-center gap-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
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
                  <FaTimes />
                  Cancel
                </button>
                <button
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2"
                  onClick={createConsultant}
                >
                  <FaPlus />
                  Create Consultant
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-[9999] transform transition-all duration-500 ease-in-out ${notification ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
          }`}>
          <div className={`flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border-l-4 backdrop-blur-sm ${notification.type === 'success'
            ? 'bg-gradient-to-r from-green-500/90 to-emerald-500/90 border-green-400 text-white'
            : 'bg-gradient-to-r from-red-500/90 to-rose-500/90 border-red-400 text-white'
            }`}>
            <div>
              <p className="font-semibold text-sm">{notification.message}</p>
              <p className="text-xs opacity-80">
                {notification.type === 'success' ? 'Success' : 'Error'}
              </p>
            </div>
            <button
              onClick={() => setNotification(null)}
              className="ml-2 p-1 rounded-full hover:bg-white/20 transition-colors duration-200"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsultantManagement;