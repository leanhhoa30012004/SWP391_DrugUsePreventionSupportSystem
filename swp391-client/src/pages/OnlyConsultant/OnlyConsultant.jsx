import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Calendar, Clock, User, Link, AlertCircle, CheckCircle, XCircle, Search, RefreshCw, Edit, Lock, Save, X, History, Book, ClipboardList, Ban, Award, Upload, Eye } from 'lucide-react';
import Logo from "../../assets/logo-WeHope.png";
import Swal from "sweetalert2";
import axiosInstance from '../../config/axios/axiosInstance';

const ConsultantAppointmentsDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editCertificateMode, setEditCertificateMode] = useState(false);
  const [viewCertificateMode, setViewCertificateMode] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [certificateLoading, setCertificateLoading] = useState(false);
  const [certificateList, setCertificateList] = useState([]);
  const [selectedCertificate, setSelectedCertificate] = useState(null);

  // Certificate related states
  const [certificateInfo, setCertificateInfo] = useState({
    certificate_name: '',
    date_submit: '',
    expired: '',
    fullname: '',
    reject_reason: null,
    status: '',
    url: ''
  });
  const [certificateFormData, setCertificateFormData] = useState({
    certificate_name: '',
    expired: '',
    certificate_img: null
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

  // Fetch certificate data
  const fetchCertificate = async () => {
    if (!consultant_id) {
      console.log('❌ No consultant_id found:', consultant_id);
      return;
    }

    console.log('🔍 Fetching certificate for consultant_id:', consultant_id);
    setCertificateLoading(true);

    try {
      const response = await axiosInstance.get(`/consultation/get-certificate-by-consultant-id/${consultant_id}`);
      console.log('✅ Certificate response:', response.data);

      if (response.data && response.data.length > 0) {
        // Lưu toàn bộ array certificates
        setCertificateList(response.data);

        // Set certificate đầu tiên làm selected (hoặc approved nếu có)
        const approvedCert = response.data.find(cert => cert.status === 'approved');
        const defaultCert = approvedCert || response.data[0];

        setSelectedCertificate(defaultCert);
        setCertificateInfo(defaultCert);

        // Set form data
        setCertificateFormData({
          certificate_name: defaultCert.certificate_name || '',
          expired: defaultCert.expired ? defaultCert.expired.split('T')[0] : '',
          certificate_img: null
        });

        console.log('✅ Certificate list updated:', response.data);
      } else {
        console.log('📭 No certificates found');
        setCertificateList([]);
        setSelectedCertificate(null);
        setCertificateInfo({
          certificate_name: '',
          date_submit: '',
          expired: '',
          fullname: '',
          reject_reason: null,
          status: '',
          url: ''
        });
      }
    } catch (error) {
      console.error('💥 Error fetching certificate:', error);
      setCertificateList([]);
      if (error.response?.status !== 404) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load certificate data"
        });
      }
    } finally {
      setCertificateLoading(false);
    }
  };

  useEffect(() => {
    if (consultant_id) {
      fetchCertificate();
      fetchAppointments(consultant_id);
    }
  }, [consultant_id]);

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

  const handleCertificateInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'certificate_img') {
      setCertificateFormData((prev) => ({
        ...prev,
        [name]: files[0]
      }));
    } else {
      setCertificateFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleUpdateCertificate = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const formData = new FormData();
      formData.append('consultant_id', consultant_id);
      formData.append('certificate_name', certificateFormData.certificate_name);
      formData.append('expired', certificateFormData.expired);

      if (certificateFormData.certificate_img) {
        formData.append('certificate_img', certificateFormData.certificate_img);
      }

      const response = await axiosInstance.post('/consultation/add-consultant-certificate', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      if (response.data && response.data.includes('Successfully')) {
        setEditCertificateMode(false);

        // Refresh certificate list
        await fetchCertificate();

        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Certificate updated successfully!",
          timer: 3000,
          timerProgressBar: true
        });
      }
    } catch (error) {
      console.error("Error updating certificate:", error);
      Swal.fire({
        icon: "error",
        title: "Update failed",
        text: error.response?.data?.message || "Failed to update certificate"
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleCancelCertificateEdit = () => {
    setCertificateFormData({
      certificate_name: '',
      expired: '',
      certificate_img: null
    });
    setEditCertificateMode(false);
  };

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

  const handleRefresh = () => {
    if (consultant_id) {
      fetchAppointments(consultant_id);
      fetchCertificate();
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
        console.log('Calling survey history API with member ID:', memberId);
        const surveyHistoryResponse = await axiosInstance.get(`/survey/survey-history/${memberId}`);
        console.log('Survey history full response:', surveyHistoryResponse);
        console.log('Survey history response data:', surveyHistoryResponse.data);

        const surveyHistoryData = surveyHistoryResponse.data?.consultHistorySurvey || [];
        console.log('Survey history data array:', surveyHistoryData);

        if (surveyHistoryData.length > 0) {
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
        Swal.fire({
          title: 'Updating...',
          text: 'Please wait while we update the appointment status',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });

        const response = await axiosInstance.get(`/consultation/change-appointment-status/${appointmentId}/completed`);

        if (response.data) {
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
        Swal.fire({
          title: 'Updating...',
          text: 'Please wait while we update the appointment status',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });
        const status = encodeURIComponent('not completed');
        const response = await axiosInstance.get(`/consultation/change-appointment-status/${appointmentId}/${status}`);

        if (response.data) {
          if (consultant_id) {
            await fetchAppointments(consultant_id);
          }

          Swal.fire({
            icon: "success",
            title: "Updated",
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
        Swal.fire({
          title: 'Updating...',
          text: 'Please wait while we update the appointment status',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });

        const response = await axiosInstance.post(`consultation/change-consultant/${appointmentId}`);

        if (response.data) {
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
          <div className="py-4 flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-0">
            {/* Logo + Title (center on desktop) */}
            <div className="flex flex-col sm:flex-row items-center mx-auto sm:mx-0 w-full sm:w-auto">
              <img
                src={Logo}
                alt="Logo"
                className="h-24 w-auto object-contain drop-shadow-lg mb-2 sm:mb-0 sm:mr-6"
              />
              <div className="text-center sm:text-left">
                <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent mb-1 sm:mb-2">
                  Consultant Dashboard
                </h1>
                <div className="text-gray-600 text-base sm:text-lg font-medium">
                  Welcome back,
                  <span className="font-bold text-red-600 ml-2">{username || "Consultant"}</span>
                </div>
              </div>
            </div>
            {/* Action buttons */}
            <div className="flex flex-wrap justify-center sm:justify-end gap-3 sm:gap-4">
              <button
                onClick={() => setViewCertificateMode(true)}
                className="bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-600 hover:to-blue-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2"
              >
                <Eye className="w-5 h-5" />
                View Certificate
              </button>
              <button
                onClick={() => setEditCertificateMode(true)}
                className="bg-gradient-to-r from-green-400 to-green-500 hover:from-green-600 hover:to-green-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2"
              >
                <Award className="w-5 h-5" />
                {certificateList && certificateList.length > 0 ? "Edit Certificate" : "Add Certificate"}
              </button>
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
                className="bg-gradient-to-r from-red-400 to-red-500 hover:from-red-600 hover:to-red-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>


      {viewCertificateMode && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-center z-40 p-4 pt-20 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-[95vw] lg:max-w-6xl my-4 max-h-[85vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6 rounded-t-3xl">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <Eye className="w-7 h-7" />
                  My Certificates ({certificateList.length})
                </h2>
                <button
                  onClick={() => setViewCertificateMode(false)}
                  className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-6 lg:p-8">
              {certificateLoading ? (
                <div className="text-center py-12">
                  <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
                  <p className="text-gray-600">Loading certificate data...</p>
                </div>
              ) : certificateList.length > 0 ? (
                <div className="space-y-6">
                  {/* Certificate List */}
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {certificateList.map((certificate, index) => (
                      <div
                        key={index}
                        className={`border-2 rounded-2xl p-6 transition-all duration-200 cursor-pointer ${selectedCertificate && selectedCertificate === certificate
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                          }`}
                        onClick={() => setSelectedCertificate(certificate)}
                      >
                        {/* Certificate Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-bold text-gray-900 mb-2 truncate">
                              {certificate.certificate_name || 'Unnamed Certificate'}
                            </h3>
                            <div className="flex items-center gap-2">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${certificate.status === 'approved' ? 'bg-green-100 text-green-800 border border-green-200' :
                                certificate.status === 'pending' || certificate.status === 'waiting' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                                  certificate.status === 'rejected' ? 'bg-red-100 text-red-800 border border-red-200' :
                                    'bg-gray-100 text-gray-800 border border-gray-200'
                                }`}>
                                <div className={`w-2 h-2 rounded-full mr-2 ${certificate.status === 'approved' ? 'bg-green-500' :
                                  certificate.status === 'pending' || certificate.status === 'waiting' ? 'bg-yellow-500' :
                                    certificate.status === 'rejected' ? 'bg-red-500' :
                                      'bg-gray-500'
                                  }`}></div>
                                {certificate.status ? certificate.status.charAt(0).toUpperCase() + certificate.status.slice(1) : 'Unknown'}
                              </span>
                            </div>
                          </div>
                          <div className="text-right text-sm text-gray-500 ml-4 flex-shrink-0">
                            <div className="whitespace-nowrap">Submit: {certificate.date_submit ? new Date(certificate.date_submit).toLocaleDateString() : 'N/A'}</div>
                            <div className="whitespace-nowrap">Expiry: {certificate.expired ? new Date(certificate.expired).toLocaleDateString() : 'N/A'}</div>
                          </div>
                        </div>

                        {/* Certificate Image Thumbnail */}
                        {certificate.url && (
                          <div className="mb-4">
                            <div className="border border-gray-300 rounded-lg p-2 bg-gray-50">
                              <img
                                src={certificate.url}
                                alt="Certificate"
                                className="w-full h-32 object-cover rounded-lg shadow-sm"
                              />
                            </div>
                          </div>
                        )}

                        {/* Reject Reason Preview */}
                        {certificate.reject_reason && (
                          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                            <div className="flex items-start gap-2">
                              <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                              <div className="min-w-0">
                                <p className="text-xs font-semibold text-red-700 mb-1">Reject Reason:</p>
                                <p className="text-xs text-red-600 break-words line-clamp-2">
                                  {certificate.reject_reason.length > 100
                                    ? `${certificate.reject_reason.substring(0, 100)}...`
                                    : certificate.reject_reason
                                  }
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* View Action Only */}
                        <div className="flex justify-center">
                          {certificate.url && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(certificate.url, '_blank');
                              }}
                              className="inline-flex items-center justify-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors"
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View Full Image
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Selected Certificate Detail */}
                  {selectedCertificate && (
                    <div className="border-t-2 border-blue-200 pt-6">
                      <h3 className="text-xl font-bold text-blue-800 mb-4 flex items-center gap-2">
                        <Award className="w-6 h-6" />
                        <span className="truncate">Certificate Details - {selectedCertificate.certificate_name}</span>
                      </h3>

                      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        {/* Certificate Info */}
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                          <h4 className="text-lg font-bold text-blue-800 mb-4 flex items-center gap-2">
                            <Award className="w-5 h-5" />
                            Certificate Information
                          </h4>
                          <div className="space-y-4">
                            <div>
                              <label className="text-sm font-semibold text-gray-600 block mb-1">Certificate Name</label>
                              <p className="text-lg font-semibold text-gray-900 break-words">{selectedCertificate.certificate_name || 'Not specified'}</p>
                            </div>
                            <div>
                              <label className="text-sm font-semibold text-gray-600 block mb-1">Consultant Name</label>
                              <p className="text-lg font-semibold text-gray-900 break-words">{selectedCertificate.fullname || username || 'Not specified'}</p>
                            </div>
                            <div>
                              <label className="text-sm font-semibold text-gray-600 block mb-1">Submit Date</label>
                              <p className="text-gray-900">{selectedCertificate.date_submit ? new Date(selectedCertificate.date_submit).toLocaleDateString() : 'Not specified'}</p>
                            </div>
                            <div>
                              <label className="text-sm font-semibold text-gray-600 block mb-1">Expiry Date</label>
                              <p className="text-gray-900">{selectedCertificate.expired ? new Date(selectedCertificate.expired).toLocaleDateString() : 'Not specified'}</p>
                            </div>
                            <div>
                              <label className="text-sm font-semibold text-gray-600 block mb-1">Status</label>
                              <span className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-semibold ${selectedCertificate.status === 'approved' ? 'bg-green-100 text-green-800 border border-green-200' :
                                selectedCertificate.status === 'pending' || selectedCertificate.status === 'waiting' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                                  selectedCertificate.status === 'rejected' ? 'bg-red-100 text-red-800 border border-red-200' :
                                    'bg-gray-100 text-gray-800 border border-gray-200'
                                }`}>
                                <div className={`w-2 h-2 rounded-full mr-2 ${selectedCertificate.status === 'approved' ? 'bg-green-500' :
                                  selectedCertificate.status === 'pending' || selectedCertificate.status === 'waiting' ? 'bg-yellow-500' :
                                    selectedCertificate.status === 'rejected' ? 'bg-red-500' :
                                      'bg-gray-500'
                                  }`}></div>
                                {selectedCertificate.status ? selectedCertificate.status.charAt(0).toUpperCase() + selectedCertificate.status.slice(1) : 'Unknown'}
                              </span>
                            </div>

                            {/* Full Reject Reason Display */}
                            {/* Full Reject Reason Display */}
                            {selectedCertificate.reject_reason && (
                              <div>
                                <label className="text-sm font-semibold text-gray-600 block mb-2">Reject Reason</label>
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                  <div className="flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                                    <div className="min-w-0 flex-1">
                                      <p className="text-red-700 leading-relaxed break-words whitespace-pre-wrap">
                                        {selectedCertificate.reject_reason}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}


                          </div>
                        </div>

                        {/* Certificate Image */}
                        {selectedCertificate.url && (
                          <div className="bg-white rounded-2xl p-6 border border-gray-200">
                            <label className="text-sm font-semibold text-gray-600 block mb-3">Certificate Image</label>
                            <div className="border border-gray-300 rounded-xl p-4 bg-gray-50">
                              <img
                                src={selectedCertificate.url}
                                alt="Certificate"
                                className="w-full h-auto max-h-[50vh] object-contain mx-auto rounded-lg shadow-lg"
                              />
                            </div>
                            <div className="mt-4 text-center">
                              <button
                                onClick={() => window.open(selectedCertificate.url, '_blank')}
                                className="inline-flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors shadow-md hover:shadow-lg"
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                View Full Size
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No Certificates Found</h3>
                  <p className="text-gray-500 mb-6">You haven't uploaded any certificates yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit Certificate Modal */}
      {editCertificateMode && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-center z-40 p-4 pt-20 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-[95vw] lg:max-w-3xl my-4 max-h-[85vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-green-600 to-green-700 px-8 py-6 rounded-t-3xl">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <Award className="w-7 h-7" />
                  Add Certificate
                </h2>
                <button
                  onClick={handleCancelCertificateEdit}
                  className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {certificateLoading ? (
              <div className="p-8 text-center">
                <RefreshCw className="w-12 h-12 text-green-600 animate-spin mx-auto mb-4" />
                <p className="text-gray-600">Loading certificate data...</p>
              </div>
            ) : (
              <form onSubmit={handleUpdateCertificate} className="p-4 sm:p-6 lg:p-8 space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Certificate Name *
                    </label>
                    <input
                      type="text"
                      name="certificate_name"
                      onChange={handleCertificateInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all duration-200"
                      placeholder="Enter certificate name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Expiry Date *
                    </label>
                    <input
                      type="date"
                      name="expired"
                      onChange={handleCertificateInputChange}
                      required
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all duration-200"
                    />
                    <p className="text-xs text-gray-500 mt-1">Certificate must be valid in the future</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Certificate Image *
                    </label>
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-4 text-gray-500" />
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">PNG, JPG, JPEG (MAX. 5MB)</p>
                        </div>
                        <input
                          type="file"
                          name="certificate_img"
                          onChange={handleCertificateInputChange}
                          accept="image/*"
                          className="hidden"
                          required
                        />
                      </label>
                    </div>
                    {certificateFormData.certificate_img && (
                      <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <p className="text-sm text-green-700 font-medium">
                            Selected: {certificateFormData.certificate_img.name}
                          </p>
                        </div>
                        <p className="text-xs text-green-600 mt-1">
                          Size: {(certificateFormData.certificate_img.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Important Notice */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-semibold text-yellow-800 mb-1">Important Notice</h4>
                      <ul className="text-xs text-yellow-700 space-y-1">
                        <li>• Your certificate will be reviewed by administrators</li>
                        <li>• Approval may take 1-3 business days</li>
                        <li>• Ensure all information is accurate before submitting</li>
                        <li>• Only valid, authentic certificates will be approved</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleCancelCertificateEdit}
                    className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updating}
                    className={`px-8 py-3 rounded-xl text-white font-semibold transition-all duration-200 shadow-lg flex items-center gap-2 ${updating
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 hover:shadow-xl"
                      }`}
                  >
                    {updating ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        Adding Certificate...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        Add Certificate
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
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

      {/* History Modal - Same as before */}
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