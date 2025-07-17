import React, { useState, useEffect } from 'react';
import { useNavigate,  useLocation } from 'react-router-dom';
import { Calendar, Clock, User, Link, AlertCircle, CheckCircle, XCircle, Search, RefreshCw } from 'lucide-react';
import axios from 'axios';
import Swal from 'sweetalert2';
import Logo from "../../assets/logo-WeHope.png";

const ConsultantAppointmentsDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search);
  const [consultant_id, setconsultant_id] = useState(queryParams.get('user'));
  const username = queryParams.get('username')
  
  console.log('Username value:', username);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  // Tự động lấy consultant_id từ localStorage hoặc một source khác
  // useEffect(() => {
  //   // Lấy consultant_id từ localStorage (hoặc từ context, props, etc.)
  //   const savedConsultantId = localStorage.getItem('consultant_id') || 
  //                            localStorage.getItem('userId') || 
  //                            localStorage.getItem('user_id');
    
  //   if (savedConsultantId) {
  //     setconsultant_id(savedConsultantId);
  //   }
  // }, []);

  // Tự động gọi API khi component mount hoặc khi consultant_id thay đổi
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
      // Using fetch instead of axios for artifact compatibility
      const response = await fetch(`http://localhost:3000/api/consultation/get-all-appointment-by-consultant-id/${consultant_id}`);
      console.log(response)
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

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
      key: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white">
      {/* Header */}
      <div className="bg-white shadow-lg border-b-4 border-red-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-2 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {/* Logo */}
              <div className="flex-shrink-0">
                <img
                  src={Logo}
                  alt="Logo"
                  className="h-40 w-auto object-contain"
                />
              </div>
              {/* Title Section */}
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2 pl-36">
                  Consultant Appointment Management
                </h1>
              </div>
            </div>
            {/* Refresh and Logout Buttons */}
            <div className="flex items-center space-x-3">
              <div className = "px-3">
                      <span className="text-lglg text-gray-600 px-1">Welcome,</span>
                      <span className="text-lg font-semibold text-[#E53935] max-w-[100px] truncate">
                        {username}
                      </span>
              </div>     
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <button
                onClick={handleLogout}
                className="px-6 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors shadow"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-xl shadow-lg border border-red-100 py-16">
            <div className="text-center">
              <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <RefreshCw className="w-12 h-12 text-red-600 animate-spin" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Loading appointments...
              </h3>
              <p className="text-gray-500">Please wait while we fetch your appointment data.</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6 shadow-sm">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span className="text-red-700 font-medium">{error}</span>
            </div>
          </div>
        )}

        {/* Appointments List */}
        {!loading && appointments.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg border border-red-100 overflow-hidden">
            <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <Calendar className="w-6 h-6" />
                Appointment List ({appointments.length})
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-red-50 border-b-2 border-red-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-red-800 uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-red-800 uppercase tracking-wider">
                      Request Sent Date
                    </th>
                    <th className="px-2 py-4 text-left text-xs font-bold text-red-800 uppercase tracking-wider">
                      Appointment Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-red-800 uppercase tracking-wider">
                      Appointment Time
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-red-800 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-red-800 uppercase tracking-wider">
                      Meeting Link
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-red-100">
                  {appointments.map((appointment, index) => (
                    <tr key={index} className="hover:bg-red-50 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                            <User className="w-5 h-5 text-red-600" />
                          </div>
                          <span className="text-sm font-medium text-gray-900">
                            {appointment.fullname}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatDateTime(appointment.date_sent_request)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        {formatDate(appointment.appointment_date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-2">
                            <Clock className="w-4 h-4 text-red-600" />
                          </div>
                          <span className="font-medium">{appointment.appointment_time}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border shadow-sm ${getStatusBadgeColor(appointment.status)}`}>
                          {getStatusIcon(appointment.status)}
                          <span className="ml-2">{getStatusText(appointment.status)}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {appointment.meeting_link ? (
                          <button
                            onClick={() => handleMeetingLinkClick(appointment.meeting_link)}
                            className="inline-flex items-center px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 shadow-sm hover:shadow-md"
                          >
                            <Link className="w-4 h-4 mr-1" />
                            Join Meeting
                          </button>
                        ) : (
                          <span className="text-gray-400 italic bg-gray-100 px-3 py-1 rounded-lg">No link available</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && appointments.length === 0 && !error && consultant_id && (
          <div className="bg-white rounded-xl shadow-lg border border-red-100 py-16">
            <div className="text-center">
              <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar className="w-12 h-12 text-red-600" />
              </div>
              <h3 className="text-xl font-semibized text-gray-900 mb-2">
                No appointments found
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                This consultant has no appointments scheduled. New appointments will appear here automatically.
              </p>
            </div>
          </div>
        )}

        {/* No Consultant ID State */}
        {!loading && !consultant_id && (
          <div className="bg-white rounded-xl shadow-lg border border-red-100 py-16">
            <div className="text-center">
              <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-12 h-12 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No consultant ID found
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
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