import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Calendar, Clock, User, Link, AlertCircle, CheckCircle, XCircle, Search, RefreshCw, Edit, Lock, Save, X, History, Book, ClipboardList, Ban } from 'lucide-react';
import Logo from "../../assets/logo-WeHope.png";
import Swal from "sweetalert2";
import axiosInstance from '../../config/axios/axiosInstance';

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

  // History related states
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedPatientHistory, setSelectedPatientHistory] = useState(null);
  const [courseHistory, setCourseHistory] = useState([]);
  const [surveyHistory, setSurveyHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [activeHistoryTab, setActiveHistoryTab] = useState('courses');

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
      const response = await axiosInstance.get(`/consultation/get-all-appointment-by-consultant-id/${id}`);
      console.log('Appointments response:', response.data);
      setAppointments(response.data);
    } catch (err) {
      console.error('Error fetching appointments:', err);
      if (err.response) {
        setError(`Error: ${err.response.status} - ${err.response.data?.message || 'Failed to fetch appointments'}`);
      } else if (err.request) {
        setError('Network error - please check your connection');
      } else {
        setError('An unexpected error occurred');
      }
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

  // History functions
  const fetchPatientHistory = async (appointment) => {
    setHistoryLoading(true);
    setSelectedPatientHistory(appointment);
    setShowHistoryModal(true);

    console.log('=== Fetching Patient History ===');
    console.log('Appointment data:', appointment);
    console.log('All appointment keys:', Object.keys(appointment));
    console.log('Member ID:', appointment.member_id);

    // Try to find the correct member ID field
    const possibleMemberFields = ['member_id', 'memberId', 'user_id', 'userId', 'patient_id', 'patientId', 'id'];
    let memberId = null;

    for (const field of possibleMemberFields) {
      if (appointment[field]) {
        memberId = appointment[field];
        console.log(`Found member ID in field '${field}':`, memberId);
        break;
      }
    }

    if (!memberId) {
      console.error('No member ID found in appointment data!');
      console.log('Available fields:', Object.keys(appointment));
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Cannot find patient ID to fetch history. Please check console for available fields."
      });
      setHistoryLoading(false);
      return;
    }

    try {
      // Fetch course history
      console.log('Fetching course history for member ID:', memberId);
      const courseResponse = await axiosInstance.get(`/course/get-all-course-follow-course-enrollment-by-member-id/${memberId}`);
      console.log('Course history response:', courseResponse.data);
      setCourseHistory(courseResponse.data || []);

      // Fetch survey history data
      try {
        // Use the survey-history API as requested
        console.log('Calling survey history API with member ID:', memberId);
        const surveyHistoryResponse = await axiosInstance.get(`/survey/survey-history/${memberId}`);
        console.log('Survey history full response:', surveyHistoryResponse);
        console.log('Survey history response data:', surveyHistoryResponse.data);

        const surveyHistoryData = surveyHistoryResponse.data?.consultHistorySurvey || [];
        console.log('Survey history data array:', surveyHistoryData);

        if (surveyHistoryData.length > 0) {
          // Transform history data for display
          const transformedHistoryData = surveyHistoryData.map(survey => ({
            survey_id: survey.survey_id,
            survey_name: `Survey ${survey.survey_id}`,
            submission_date: survey.date,
            score: survey.score || 0,
            status: survey.score > 0 ? 'completed' : 'submitted',
            member_name: survey.memberName,
            version: survey.version
          }));

          console.log('Transformed survey data:', transformedHistoryData);
          setSurveyHistory(transformedHistoryData);
        } else {
          // Empty history
          console.log('No survey history data found');
          setSurveyHistory([]);
        }
      } catch (surveyError) {
        console.error('Survey history API error:', surveyError);
        console.error('Survey error response:', surveyError.response?.data);
        setSurveyHistory([]);
      }

    } catch (error) {
      console.error('Error fetching patient history:', error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch patient history"
      });
      setCourseHistory([]);
      setSurveyHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  // const handleRejectHistory = (type, id) => {
  //   // Hard-coded reject function as requested
  //   Swal.fire({
  //     icon: "success",
  //     title: "Rejected",
  //     text: `${type} with ID ${id} has been rejected (hard-coded)`
  //   });
  // };

  // Appointment Action Functions
  // Appointment Action Functions
  const handleCompleted = async (appointmentId) => {
    try {
      const result = await Swal.fire({
        title: 'Confirm Completion',
        text: 'Are you sure you want to mark this appointment as completed?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#059669',
        cancelButtonColor: '#dc2626',
        confirmButtonText: 'Yes, mark as completed',
        cancelButtonText: 'Cancel'
      });

      if (result.isConfirmed) {
        // Show loading
        Swal.fire({
          title: 'Updating...',
          text: 'Please wait while we update the appointment status',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });

        // Gọi API với appointment_status = 'completed'
        const response = await axiosInstance.get(`/consultation/change-appointment-status/${appointmentId}/completed`);

        if (response.data) {
          // Refresh danh sách appointments sau khi cập nhật thành công
          if (consultant_id) {
            await fetchAppointments(consultant_id);
          }

          Swal.fire({
            icon: "success",
            title: "Completed",
            text: "Appointment marked as completed successfully!"
          });
        } else {
          throw new Error('Failed to update appointment status');
        }
      }
    } catch (error) {
      console.error('Error updating appointment status:', error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Failed to mark appointment as completed"
      });
    }
  };

  const handleNotCompleted = async (appointmentId) => {
    try {
      const result = await Swal.fire({
        title: 'Confirm Completion',
        text: 'Are you sure you want to mark this appointment as not completed?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#059669',
        cancelButtonColor: '#dc2626',
        confirmButtonText: 'Yes, mark as not completed',
        cancelButtonText: 'Cancel'
      });

      if (result.isConfirmed) {
        // Show loading
        Swal.fire({
          title: 'Updating...',
          text: 'Please wait while we update the appointment status',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });
        const status = encodeURIComponent('not completed');
        // Gọi API với appointment_status = 'not completed'
        const response = await axiosInstance.get(`/consultation/change-appointment-status/${appointmentId}/${status}`);

        if (response.data) {
          // Refresh danh sách appointments sau khi cập nhật thành công
          if (consultant_id) {
            await fetchAppointments(consultant_id);
          }

          Swal.fire({
            icon: "success",
            title: "Completed",
            text: "Appointment marked as not completed successfully!"
          });
        } else {
          throw new Error('Failed to update appointment status');
        }
      }
    } catch (error) {
      console.error('Error updating appointment status:', error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Failed to mark appointment as not completed"
      });
    }
  };

  const handleReject = async (appointmentId) => {
    try {
      const result = await Swal.fire({
        title: 'Confirm Rejection',
        text: 'Are you sure you want to reject this appointment?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc2626',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Yes, reject it',
        cancelButtonText: 'Cancel'
      });

      if (result.isConfirmed) {
        // Show loading
        Swal.fire({
          title: 'Updating...',
          text: 'Please wait while we update the appointment status',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });

        // Gọi API để reject appointment
        const response = await axiosInstance.post(`consultation/change-consultant/${appointmentId}`);

        if (response.data) {
          // Refresh danh sách appointments sau khi cập nhật thành công
          if (consultant_id) {
            await fetchAppointments(consultant_id);
          }

          Swal.fire({
            icon: "success",
            title: "Rejected",
            text: "Appointment has been rejected successfully!"
          });
        } else {
          throw new Error('Failed to reject appointment');
        }
      }
    } catch (error) {
      console.error('Error rejecting appointment:', error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Failed to reject appointment"
      });
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'pending':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'not completed':
        return <XCircle className="w-5 h-5 text-orange-500" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusText = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'Completed';
      case 'pending':
        return 'Pending';
      case 'not completed':
        return 'Not Completed';
      case 'rejected':
        return 'Rejected';
      default:
        return status || 'Unknown';
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'not completed':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'rejected':
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
                  className={`px-8 py-3 rounded-xl text-white font-semibold transition-all duration-200 shadow-lg flex items-center gap-2 ${updating
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
      </div>

      {/* Full Width Appointments List */}
      {!loading && appointments.length > 0 && (
        <div className="w-full px-4 sm:px-6 lg:px-8 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-red-100 overflow-hidden">
            <div className="bg-gradient-to-r from-red-600 to-orange-600 px-8 py-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <Calendar className="w-8 h-8" />
                Appointment List ({appointments.length})
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead className="bg-gradient-to-r from-red-50 to-orange-50 border-b-2 border-red-100">
                  <tr>
                    <th className="px-4 py-5 text-left text-sm font-bold text-red-800 uppercase tracking-wider border-r border-red-100 min-w-[150px]">
                      Patient
                    </th>
                    <th className="px-4 py-5 text-left text-sm font-bold text-red-800 uppercase tracking-wider border-r border-red-100 min-w-[120px]">
                      Request Date
                    </th>
                    <th className="px-4 py-5 text-left text-sm font-bold text-red-800 uppercase tracking-wider border-r border-red-100 min-w-[120px]">
                      Appointment Date
                    </th>
                    <th className="px-4 py-5 text-left text-sm font-bold text-red-800 uppercase tracking-wider border-r border-red-100 min-w-[100px]">
                      Time
                    </th>
                    <th className="px-4 py-5 text-left text-sm font-bold text-red-800 uppercase tracking-wider border-r border-red-100 min-w-[100px]">
                      Status
                    </th>
                    <th className="px-4 py-5 text-left text-sm font-bold text-red-800 uppercase tracking-wider border-r border-red-100 min-w-[120px]">
                      Meeting
                    </th>
                    <th className="px-4 py-5 text-left text-sm font-bold text-red-800 uppercase tracking-wider min-w-[150px]">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-red-50">
                  {appointments.map((appointment, index) => (
                    <tr key={index} className="hover:bg-gradient-to-r hover:from-red-50 hover:to-orange-50 transition-all duration-200">
                      <td className="px-4 py-6 cursor-pointer hover:bg-red-50 transition-colors border-r border-red-100" onClick={() => fetchPatientHistory(appointment)}>
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-orange-100 rounded-full flex items-center justify-center mr-3 shadow-md flex-shrink-0">
                            <User className="w-6 h-6 text-red-600" />
                          </div>
                          <span className="text-sm font-semibold text-gray-900 hover:text-red-600 transition-colors" title={appointment.fullname}>
                            {appointment.fullname}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-6 text-sm text-gray-600 border-r border-red-100" title={formatDateTime(appointment.date_sent_request)}>
                        {formatDateTime(appointment.date_sent_request)}
                      </td>
                      <td className="px-4 py-6 text-sm text-gray-900 font-semibold border-r border-red-100" title={formatDate(appointment.appointment_date)}>
                        {formatDate(appointment.appointment_date)}
                      </td>
                      <td className="px-4 py-6 border-r border-red-100">
                        <div className="flex items-center text-sm text-gray-900">
                          <div className="w-8 h-8 bg-gradient-to-br from-red-100 to-orange-100 rounded-full flex items-center justify-center mr-2 shadow-md flex-shrink-0">
                            <Clock className="w-4 h-4 text-red-600" />
                          </div>
                          <span className="font-semibold" title={appointment.appointment_time}>{appointment.appointment_time}</span>
                        </div>
                      </td>
                      <td className="px-4 py-6 border-r border-red-100">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border shadow-sm whitespace-nowrap ${getStatusBadgeColor(appointment.status)}`}>
                          {getStatusIcon(appointment.status)}
                          <span className="ml-1">{getStatusText(appointment.status)}</span>
                        </span>
                      </td>
                      <td className="px-4 py-6 text-sm border-r border-red-100">
                        {appointment.meeting_link ? (
                          <button
                            onClick={() => handleMeetingLinkClick(appointment.meeting_link)}
                            className="inline-flex items-center px-3 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg hover:from-red-700 hover:to-orange-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 whitespace-nowrap"
                          >
                            <Link className="w-3 h-3 mr-1" />
                            Join Meeting
                          </button>
                        ) : (
                          <span className="text-gray-400 italic bg-gray-100 px-3 py-2 rounded-lg text-center text-xs whitespace-nowrap">No link available</span>
                        )}
                      </td>
                      <td className="px-4 py-6 text-sm">
                        {appointment.status === 'pending' ? (
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() => handleCompleted(appointment.appointment_id || index)}
                              className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-md hover:shadow-lg text-xs"
                            >
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Completed
                            </button>
                            <button
                              onClick={() => handleNotCompleted(appointment.appointment_id || index)}
                              className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-md hover:shadow-lg text-xs"
                            >
                              <XCircle className="w-3 h-3 mr-1" />
                              Not completed
                            </button>
                            <button
                              onClick={() => handleReject(appointment.appointment_id || index)}
                              className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-md hover:shadow-lg text-xs"
                            >
                              <AlertCircle className="w-3 h-3 mr-1" />
                              Rejected
                            </button>
                          </div>
                        ) : appointment.status === 'confirmed' ? (
                          <span className="text-gray-400 italic text-sm">No actions available</span>
                        ) : (
                          <span className="text-gray-400 italic text-sm">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Empty State - Full Width */}
      {!loading && appointments.length === 0 && !error && consultant_id && (
        <div className="w-full px-4 sm:px-6 lg:px-8 mb-8">
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
        </div>
      )}

      {/* Enhanced No Consultant ID State - Full Width */}
      {!loading && !consultant_id && (
        <div className="w-full px-4 sm:px-6 lg:px-8 mb-8">
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
        </div>
      )}

      {/* History Modal */}
      {showHistoryModal && selectedPatientHistory && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
            <div className="bg-gradient-to-r from-red-600 to-orange-600 px-8 py-6 rounded-t-3xl">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <User className="w-7 h-7" />
                  Patient Details - {selectedPatientHistory.fullname}
                </h2>
                <button
                  onClick={() => setShowHistoryModal(false)}
                  className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-8">
              {/* Patient Information Section */}
              <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-6 mb-8 border border-red-100">
                <h3 className="text-xl font-bold text-red-800 mb-4 flex items-center gap-2">
                  <User className="w-6 h-6" />
                  Patient Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Full Name</label>
                    <p className="text-lg font-semibold text-gray-900">{selectedPatientHistory.fullname}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Appointment Date</label>
                    <p className="text-lg font-semibold text-gray-900">{selectedPatientHistory.appointment_date ? new Date(selectedPatientHistory.appointment_date).toLocaleDateString() : 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Appointment Time</label>
                    <p className="text-lg font-semibold text-gray-900">{selectedPatientHistory.appointment_time || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Request Date</label>
                    <p className="text-lg font-semibold text-gray-900">{selectedPatientHistory.date_sent_request ? new Date(selectedPatientHistory.date_sent_request).toLocaleDateString() : 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Status</label>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${selectedPatientHistory.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      selectedPatientHistory.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                      {selectedPatientHistory.status || 'N/A'}
                    </span>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-600 block mb-1">Meeting Link</label>
                    {selectedPatientHistory.meeting_link ? (
                      <button
                        onClick={() => window.open(selectedPatientHistory.meeting_link, '_blank')}
                        className="inline-flex items-center px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors"
                      >
                        <Link className="w-4 h-4 mr-2" />
                        Open Meeting
                      </button>
                    ) : (
                      <p className="text-gray-500 text-sm">No link available</p>
                    )}
                  </div>
                </div>
              </div>

              {/* History Tabs */}
              <div className="flex border-b border-gray-200 mb-6">
                <button
                  className={`px-6 py-3 font-semibold flex items-center gap-2 ${activeHistoryTab === 'courses'
                    ? 'border-b-2 border-red-600 text-red-600'
                    : 'text-gray-500 hover:text-gray-700'
                    }`}
                  onClick={() => setActiveHistoryTab('courses')}
                >
                  <Book className="w-5 h-5" />
                  Course History ({courseHistory.length})
                </button>
                <button
                  className={`px-6 py-3 font-semibold flex items-center gap-2 ${activeHistoryTab === 'surveys'
                    ? 'border-b-2 border-red-600 text-red-600'
                    : 'text-gray-500 hover:text-gray-700'
                    }`}
                  onClick={() => setActiveHistoryTab('surveys')}
                >
                  <ClipboardList className="w-5 h-5" />
                  Survey History ({surveyHistory.length})
                </button>
              </div>

              {/* Loading State */}
              {historyLoading && (
                <div className="text-center py-12">
                  <RefreshCw className="w-12 h-12 text-red-600 animate-spin mx-auto mb-4" />
                  <p className="text-gray-600">Loading patient history...</p>
                </div>
              )}

              {/* Course History Tab */}
              {!historyLoading && activeHistoryTab === 'courses' && (
                <div className="overflow-x-auto">
                  {courseHistory.length === 0 ? (
                    <div className="text-center py-12">
                      <Book className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No course history found for this patient</p>
                    </div>
                  ) : (
                    <table className="w-full text-sm text-left table-fixed">
                      <thead className="bg-gradient-to-r from-red-50 to-orange-50 border-b-2 border-red-100">
                        <tr>
                          <th className="px-6 py-4 font-bold text-red-800 w-1/3">Course Name</th>
                          <th className="px-6 py-4 font-bold text-red-800 w-1/4">Enrollment Date</th>
                          <th className="px-6 py-4 font-bold text-red-800 w-1/4">Progress</th>
                          <th className="px-6 py-4 font-bold text-red-800 w-1/6">Status</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-red-50">
                        {courseHistory.map((course, index) => (
                          <tr key={index} className="hover:bg-gradient-to-r hover:from-red-50 hover:to-orange-50 transition-all duration-200">
                            <td className="px-6 py-4 font-semibold truncate" title={course.course_name || course.name || 'N/A'}>{course.course_name || course.name || 'N/A'}</td>
                            <td className="px-6 py-4">{course.enrollment_date ? new Date(course.enrollment_date).toLocaleDateString() : 'N/A'}</td>
                            <td className="px-6 py-4">
                              <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                                <div
                                  className="bg-gradient-to-r from-red-500 to-orange-500 h-2 rounded-full"
                                  style={{ width: `${course.progress || 0}%` }}
                                ></div>
                              </div>
                              <span className="text-xs text-gray-600">{course.progress || 0}%</span>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${course.status === 'completed' ? 'bg-green-100 text-green-800' :
                                course.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                {course.status || 'enrolled'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}

              {/* Survey History Tab */}
              {!historyLoading && activeHistoryTab === 'surveys' && (
                <div className="overflow-x-auto">
                  {surveyHistory.length === 0 ? (
                    <div className="text-center py-12">
                      <ClipboardList className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No survey history found for this patient</p>
                    </div>
                  ) : (
                    <table className="w-full text-sm text-left table-fixed">
                      <thead className="bg-gradient-to-r from-red-50 to-orange-50 border-b-2 border-red-100">
                        <tr>
                          <th className="px-6 py-4 font-bold text-red-800 w-2/5">Survey Type</th>
                          <th className="px-6 py-4 font-bold text-red-800 w-1/4">Submission Date</th>
                          <th className="px-6 py-4 font-bold text-red-800 w-1/6">Score</th>
                          <th className="px-6 py-4 font-bold text-red-800 w-1/6">Status</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-red-50">
                        {surveyHistory.map((survey, index) => (
                          <tr key={index} className="hover:bg-gradient-to-r hover:from-red-50 hover:to-orange-50 transition-all duration-200">
                            <td className="px-6 py-4 font-semibold truncate" title={survey.survey_type || `Survey ${survey.survey_id}` || 'N/A'}>
                              {survey.survey_type || `Survey ${survey.survey_id}` || 'Unknown Survey'}
                            </td>
                            <td className="px-6 py-4">
                              {survey.submission_date ?
                                new Date(survey.submission_date).toLocaleDateString() :
                                'N/A'
                              }
                            </td>
                            <td className="px-6 py-4">
                              <span className="font-semibold text-red-600">
                                {(survey.score !== undefined && survey.score !== null) ?
                                  survey.score :
                                  'N/A'
                                }
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${survey.status === 'completed' ? 'bg-green-100 text-green-800' :
                                survey.status === 'submitted' ? 'bg-blue-100 text-blue-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                {survey.status || 'Submitted'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsultantAppointmentsDashboard;