import React, { useState, useEffect } from 'react';
import { Bell, Calendar, Clock, User, MessageCircle, AlertCircle, CheckCircle, Info, XCircle, Home, Settings, LogOut, Menu, X } from 'lucide-react';
import Navbar from './Navbar';

const AppointmentPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('appointments');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Get user info from localStorage (simulated)
  const storedUser = localStorage.getItem('user');
  let user_id = null;
  let member_id = null;
  if (storedUser) {
    try {
      const parsedUser = JSON.parse(storedUser);
      user_id = parsedUser.user_id || parsedUser.id;
      member_id = parsedUser.member_id || parsedUser.user_id || parsedUser.id;
      console.log("user_id:", user_id, "member_id:", member_id);
    } catch (e) {
      console.error("Error parsing user from localStorage:", e);
    }
  }
  
  // Format date time function
  const formatDateTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Format notification date
  const formatNotificationDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get notification type icon and color
  const getNotificationTypeStyle = (type) => {
    switch (type?.toLowerCase()) {
      case 'success':
        return { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' };
      case 'error':
        return { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' };
      case 'warning':
        return { icon: AlertCircle, color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200' };
      case 'info':
      default:
        return { icon: Info, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' };
    }
  };

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const VITE_API_URL = 'http://localhost:3000/api'; // Replace with your actual API URL
      const response = await fetch(`${VITE_API_URL}/notice/${user_id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }
      
      const data = await response.json();
      console.log("Notification API response:", data);
      
      if (data.error) {
        setNotifications([]);
        setError(data.error);
        return;
      }

      // Đảm bảo data là array
      const notificationArray = Array.isArray(data) ? data : [];
      setNotifications(notificationArray);
      console.log("array", notificationArray)
     
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError('Không thể tải thông báo');
    }
  };

  // Fetch appointments
  const fetchAppointments = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/consultation/get-all-appointment-by-id/${member_id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch appointments');
      }
      
      const data = await response.json();
      setAppointments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError('Không thể tải lịch hẹn');
    }
  };

  // Handle cancel booking
  const handleCancelBooking = async (appointmentId) => {
    if (!window.confirm('Bạn có chắc chắn muốn hủy cuộc hẹn này?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/consultation/reject-appointment/${appointmentId}/0`,{
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to cancel appointment');
      }

      // Remove cancelled appointment from state
      setAppointments(prev => prev.filter(apt => apt.appointment_id !== appointmentId));
      alert('Cuộc hẹn đã được hủy thành công');
    } catch (err) {
      console.error('Error cancelling appointment:', err);
      alert('Không thể hủy cuộc hẹn. Vui lòng thử lại.');
    }
  };

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await Promise.all([fetchNotifications(), fetchAppointments()]);
      } catch (err) {
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-white flex items-center justify-center">
        <div className="flex flex-col items-center bg-white p-8 rounded-2xl shadow-lg">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-red-200 border-t-red-600"></div>
          <p className="mt-6 text-gray-700 font-medium">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white">
      <Navbar/>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Manage Appointments & Notifications
          </h1>
          <p className="text-lg text-gray-600">View your consultation appointments and system notifications</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 rounded-r-lg p-4 shadow-sm">
            <div className="flex">
              <XCircle className="h-5 w-5 text-red-500" />
              <div className="ml-3">
                <p className="text-sm text-red-700 font-medium">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <nav className="flex space-x-0">
              <button
                onClick={() => setActiveTab('appointments')}
                className={`flex-1 py-4 px-6 font-medium text-sm transition-all duration-200 ${
                  activeTab === 'appointments'
                    ? 'bg-red-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
                }`}
              >
                <Calendar className="inline h-5 w-5 mr-2" />
                Consultation Appointments ({appointments.length})
              </button>
              <button
                onClick={() => setActiveTab('notifications')}
                className={`flex-1 py-4 px-6 font-medium text-sm transition-all duration-200 ${
                  activeTab === 'notifications'
                    ? 'bg-red-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
                }`}
              >
                <Bell className="inline h-5 w-5 mr-2" />
                System Notifications ({notifications.length})
              </button>
            </nav>
          </div>
        </div>

        {/* Appointments Tab */}
        {activeTab === 'appointments' && (
          <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-red-50 to-white">
              <h2 className="text-xl font-bold text-gray-900">Consultation Appointments</h2>
            </div>
            
            {appointments.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments</h3>
                <p className="text-gray-600">You have no consultation appointments scheduled.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Consultant Name
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Time
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Meeting Link
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {appointments.map((appointment) => (
                      <tr key={appointment.appointment_id} className="hover:bg-red-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                              <User className="h-5 w-5 text-red-600" />
                            </div>
                            <div className="text-sm font-medium text-gray-900">
                              {appointment.fullname || 'Not updated'}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 font-medium">
                            {formatDateTime(appointment.appointment_date)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 text-gray-500 mr-2" />
                            <span className="text-sm text-gray-900 font-medium">
                              {appointment.appointment_time}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {appointment.meeting_link ? (
                            <a
                              href={appointment.meeting_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full hover:bg-green-200 transition-colors"
                            >
                              Join Meeting
                            </a>
                          ) : (
                            <span className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-600 text-sm font-medium rounded-full">
                              No link yet
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <button
                            onClick={() => handleCancelBooking(appointment.appointment_id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm hover:shadow-md"
                          >
                            Cancel
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-red-50 to-white">
              <h2 className="text-xl font-bold text-gray-900">System Notifications</h2>
            </div>
            
            {notifications.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bell className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
                <p className="text-gray-600">You have no notifications from the system.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {notifications.map((notification, index) => {
                  const typeStyle = getNotificationTypeStyle(notification.type);
                  const IconComponent = typeStyle.icon;
                  
                  return (
                    <div key={index} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start">
                        <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${typeStyle.bg} ${typeStyle.border} border`}>
                          <IconComponent className={`h-6 w-6 ${typeStyle.color}`} />
                        </div>
                        <div className="ml-4 flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {notification.title || 'Notification'}
                            </h3>
                            <span className="text-sm text-gray-500 font-medium">
                              {formatNotificationDate(notification.date)}
                            </span>
                          </div>
                          <div className="mt-2">
                            <p className="text-sm text-gray-700 leading-relaxed">
                              {notification.message || 'No content'}
                            </p>
                          </div>
                          <div className="mt-4 flex items-center justify-between">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${typeStyle.color} ${typeStyle.bg} ${typeStyle.border} border`}>
                              {notification.type || 'info'}
                            </span>
                            <span className="text-xs text-gray-400 font-medium">
                              User ID: {notification.user_id}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentPage;