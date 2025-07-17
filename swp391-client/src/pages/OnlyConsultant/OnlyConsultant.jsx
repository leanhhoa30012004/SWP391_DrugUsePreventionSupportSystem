import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Calendar, Clock, User, Link, AlertCircle, CheckCircle, XCircle, Search, RefreshCw, Edit, Lock, Save, X } from 'lucide-react';
import Logo from "../../assets/logo-WeHope.png";
import Swal from "sweetalert2";

const ConsultantAppointmentsDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [userInfo, setUserInfo] = useState({
    username: '',
    fullname: '',
    email: '',
    birthday: ''
  });
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    birthday: ''
  });

  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const consultant_id = queryParams.get('user');
  const username = queryParams.get('username');
  
  console.log('Username value:', username);

  // Initialize user info from query params
  useEffect(() => {
    if (username) {
      setUserInfo(prev => ({ ...prev, username }));
    }
  }, [username]);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get('token');
    if (token) {
      localStorage.setItem('token', token);
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const token = localStorage.getItem("token");
      console.log("Token gửi lên:", token);

      const response = await fetch("http://localhost:3000/api/auth/profile", {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        setUserInfo({ ...userInfo, ...formData });
        setEditMode(false);
        // Show success message
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Profile updated successfully!"
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Update failed",
          text: data.message || "Update failed"
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      Swal.fire({
        icon: "error",
        title: "Update failed",
        text: "Failed to update profile"
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleCancelEdit = () => {
    setFormData({
      fullname: userInfo.fullname,
      email: userInfo.email,
      birthday: userInfo.birthday,
    });
    setEditMode(false);
  };

  useEffect(() => {
    if (consultant_id) {
      fetchAppointments(consultant_id);
    }
  }, [consultant_id]);

  const fetchAppointments = async (id) => {
    if (!id || !id.toString().trim()) {
      setError('Consultant ID is required');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`http://localhost:3000/api/consultation/get-all-appointment-by-consultant-id/${consultant_id}`);
      console.log(response);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setAppointments(data);
      console.log(data);
    } catch (err) {
      setError('Unable to load appointment data. Please try again.');
      console.error('Error fetching appointments:', err);
    } finally {
      setLoading(false);
    }
  };

   // Thêm hàm refresh để có thể reload dữ liệu
   const handleRefresh = () => {
    if (consultant_id) {
      fetchAppointments(consultant_id);
    }
  };


  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'pending':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmed';
      case 'pending':
        return 'Pending';
      case 'cancelled':
        return 'Cancelled';
      default:
        return 'Unknown';
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  function formatDate(isoString) {
    const date = new Date(isoString);
    date.setHours(date.getHours());
    
    
    const dd = String(date.getDate()).padStart(2, '0');
    const MM = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();
    
    return ` ${dd}/${MM}/${yyyy}`;
}

  const handleMeetingLinkClick = (meetingLink) => {
    if (window.confirm('Do you want to open the meeting link in a new tab?')) {
      window.open(meetingLink, '_blank', 'noopener,noreferrer');
    }
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-GB', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
      {/* Enhanced Header */}
      <div className="bg-white shadow-2xl border-b-4 border-red-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/5 to-orange-600/5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="py-4 flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex-shrink-0">
                <img
                  src={Logo}
                  alt="Logo"
                  className="h-36 w-auto object-contain drop-shadow-lg"
                />
              </div>
              <div className="flex-1 text-center pl-12">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent mb-2">
                  Consultant Dashboard
                </h1>
                <p className="text-gray-600 text-lg">Manage your appointments and profile</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-3 shadow-lg border border-red-100">
                <span className="text-gray-600 text-sm">Welcome back,</span>
                <span className="text-lg font-bold text-red-600 ml-2">
                  {username || 'Consultant'}
                </span>
              </div>
              
              <button
                onClick={() => setEditMode(true)}
                className="bg-gradient-to-r from-blue-300 to-blue-400 hover:from-blue-500 hover:to-blue-600 text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2"
              >
                <Edit className="w-5 h-5" />
                Edit Profile
              </button>
              
              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-red-400 to-red-500 hover:from-red-600 hover:to-red-700 text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
              >
                Logout
              </button>
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {editMode && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-red-600 to-orange-600 px-8 py-6 rounded-t-3xl">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <Edit className="w-7 h-7" />
                  Edit Profile
                </h2>
                <button
                  onClick={handleCancelEdit}
                  className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <form onSubmit={handleUpdateProfile} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Username
                  </label>
                  <input
                    type="text"
                    value={userInfo.username}
                    disabled
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm bg-gray-100 text-gray-500 cursor-not-allowed focus:outline-none"
                  />
                  <p className="mt-2 text-xs text-gray-500">Username cannot be changed</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullname"
                    value={formData.fullname}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400 transition-all duration-200"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400 transition-all duration-200"
                    placeholder="Enter your email"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Birthday
                  </label>
                  <input
                    type="date"
                    name="birthday"
                    value={formData.birthday}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400 transition-all duration-200"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className={`px-8 py-3 rounded-xl text-white font-semibold transition-all duration-200 shadow-lg flex items-center gap-2 ${
                    updating
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 hover:shadow-xl"
                  }`}
                >
                  {updating ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Loading State */}
        {loading && (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-red-100 py-20">
            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-red-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
                <RefreshCw className="w-16 h-16 text-red-600 animate-spin" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Loading appointments...
              </h3>
              <p className="text-gray-600 text-lg">Please wait while we fetch your appointment data.</p>
            </div>
          </div>
        )}

        {/* Enhanced Error Message */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 mb-8 shadow-lg">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-red-500" />
              <span className="text-red-700 font-semibold text-lg">{error}</span>
            </div>
          </div>
        )}

        {/* Enhanced Appointments List */}
        {!loading && appointments.length > 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-red-100 overflow-hidden">
            <div className="bg-gradient-to-r from-red-600 to-orange-600 px-8 py-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <Calendar className="w-8 h-8" />
                Appointment List ({appointments.length})
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-red-50 to-orange-50 border-b-2 border-red-100">
                  <tr>
                    <th className="px-8 py-5 text-left text-sm font-bold text-red-800 uppercase tracking-wider">
                      Patient
                    </th>
                    <th className="px-8 py-5 text-left text-sm font-bold text-red-800 uppercase tracking-wider">
                      Request Date
                    </th>
                    <th className="px-8 py-5 text-left text-sm font-bold text-red-800 uppercase tracking-wider">
                      Appointment Date
                    </th>
                    <th className="px-8 py-5 text-left text-sm font-bold text-red-800 uppercase tracking-wider">
                      Time
                    </th>
                    <th className="px-8 py-5 text-left text-sm font-bold text-red-800 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-8 py-5 text-left text-sm font-bold text-red-800 uppercase tracking-wider">
                      Meeting
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-red-50">
                  {appointments.map((appointment, index) => (
                    <tr key={index} className="hover:bg-gradient-to-r hover:from-red-50 hover:to-orange-50 transition-all duration-200">
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-orange-100 rounded-full flex items-center justify-center mr-4 shadow-md">
                            <User className="w-6 h-6 text-red-600" />
                          </div>
                          <span className="text-sm font-semibold text-gray-900">
                            {appointment.fullname}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap text-sm text-gray-600">
                        {formatDateTime(appointment.date_sent_request)}
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap text-sm text-gray-900 font-semibold">
                        {formatDate(appointment.appointment_date)}
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <div className="w-10 h-10 bg-gradient-to-br from-red-100 to-orange-100 rounded-full flex items-center justify-center mr-3 shadow-md">
                            <Clock className="w-5 h-5 text-red-600" />
                          </div>
                          <span className="font-semibold">{appointment.appointment_time}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        <span className={`inline-flex items-center px-4 py-2 rounded-full text-xs font-semibold border shadow-sm ${getStatusBadgeColor(appointment.status)}`}>
                          {getStatusIcon(appointment.status)}
                          <span className="ml-2">{getStatusText(appointment.status)}</span>
                        </span>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap text-sm">
                        {appointment.meeting_link ? (
                          <button
                            onClick={() => handleMeetingLinkClick(appointment.meeting_link)}
                            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl hover:from-red-700 hover:to-orange-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
                          >
                            <Link className="w-4 h-4 mr-2" />
                            Join Meeting
                          </button>
                        ) : (
                          <span className="text-gray-400 italic bg-gray-100 px-4 py-2 rounded-xl">No link available</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Enhanced Empty State */}
        {!loading && appointments.length === 0 && !error && consultant_id && (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-red-100 py-20">
            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-red-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
                <Calendar className="w-16 h-16 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                No appointments found
              </h3>
              <p className="text-gray-600 text-lg max-w-md mx-auto">
                You don't have any appointments scheduled yet. New appointments will appear here automatically.
              </p>
            </div>
          </div>
        )}

        {/* Enhanced No Consultant ID State */}
        {!loading && !consultant_id && (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-red-100 py-20">
            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-red-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
                <AlertCircle className="w-16 h-16 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Authentication Required
              </h3>
              <p className="text-gray-600 text-lg max-w-md mx-auto">
                Please ensure you are logged in properly. The consultant ID is required to load appointments.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsultantAppointmentsDashboard;