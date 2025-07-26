import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import Logo from "../../assets/logo-WeHope.png";
import Navbar from "../../components/Navbar/Navbar";

const Profile = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({
    username: "",
    email: "",
    fullname: "",
    birthday: "",
    member_id: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    birthday: "",
  });
  const [activeTab, setActiveTab] = useState('info');
  const [courses, setCourses] = useState([]);
  const [surveys, setSurveys] = useState([]);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchUserProfile(); 
    fetchUserSurveys();
  }, []);
  
  useEffect(() => {
    if (userInfo.member_id) {
      fetchUserCourses(); 
    }
  }, [userInfo.member_id]);
  

  useEffect(() => {
    if (activeTab === 'booking' && userInfo.member_id) {
      fetchUserBookings();
    }
  }, [activeTab, userInfo.member_id]);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      const response = await axios.get("http://localhost:3000/api/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      console.log('Profile Response:', response.data); // Debug log
      
      if (response.data.success) {
        setUserInfo({
          ...response.data.user,
          member_id: response.data.user.member_id || response.data.user.user_id
        });
        setFormData({
          fullname: response.data.user.fullname,
          email: response.data.user.email,
          birthday: response.data.user.birthday,
        });
      }
    } catch (error) {
      console.error('Profile fetch error:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        Swal.fire({ 
          icon: "error", 
          title: "Error", 
          text: "Failed to load profile information" 
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Thêm debug log để kiểm tra member_id
  console.log('Current userInfo.member_id:', userInfo.member_id);

  const fetchUserCourses = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      console.log('Fetching courses for member_id:', userInfo.member_id);
      const response = await axios.get(
        `http://localhost:3000/api/course/get-all-course-follow-course-enrollment-by-member-id/${userInfo.member_id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log('Courses API Response:', response.data);
      // Kiểm tra structure của response
      if (Array.isArray(response.data)) {
        console.log('Sample course object:', response.data[0]);
        setCourses(response.data);
      } else {
        console.log('Response is not an array:', response.data);
        setCourses([]);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      console.error("Error response:", error.response?.data);
      setCourses([]);
    }
  };

  const fetchUserSurveys = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      
      const response = await axios.get("http://localhost:3000/api/auth/profile/surveys", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      console.log('Surveys API Response:', response.data); // Debug log
      
      if (response.data.success) {
        setSurveys(response.data.surveys || []);
      } else {
        setSurveys([]);
      }
    } catch (error) {
      console.error("Error fetching surveys:", error);
      console.error("Error response:", error.response?.data);
      setSurveys([]);
    }
  };

  const fetchUserBookings = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      
      console.log('Fetching bookings for member_id:', userInfo.member_id);
      
      const response = await axios.get(
        `http://localhost:3000/api/consultation/get-all-appointment-by-id/${userInfo.member_id}`, 
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      console.log('Bookings API Response:', response.data);
      console.log('Response status:', response.status);
      
      // Check if response.data is an array
      if (Array.isArray(response.data)) {
        setBookings(response.data);
      } else {
        console.log('Response is not an array:', response.data);
        setBookings([]);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
      setBookings([]);
    }
  };

  const handleCancelBooking = async (appointmentId) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to cancel this booking?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, cancel it!',
      });
      
      if (!result.isConfirmed) return;
      
      const token = localStorage.getItem("token");
      await axios.get(`http://localhost:3000/api/consultation/reject-appointment/${appointmentId}/0`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // Remove the cancelled booking from the list
      setBookings((prev) => prev.filter(b => b.appointment_id !== appointmentId));
      Swal.fire('Cancelled!', 'Your booking has been cancelled.', 'success');
    } catch (error) {
      console.error("Error cancelling booking:", error);
      Swal.fire('Error', 'Failed to cancel booking.', 'error');
    }
  };


  function formatDateTime(isoString) {
    const date = new Date(isoString);
    date.setHours(date.getHours());
    

    const dd = String(date.getDate()).padStart(2, '0');
    const MM = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();
    
    return `${dd}/${MM}/${yyyy}`;
}
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
      const response = await axios.put(
        "http://localhost:3000/api/auth/profile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setUserInfo({ ...userInfo, ...formData });
        setEditMode(false);

        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Profile updated successfully",
          timer: 2000,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: error.response?.data?.message || "Failed to update profile",
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

  const handleChangePassword = () => {
    navigate("/change-password");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-red-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-20 w-20 border-4 border-red-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-red-50/30 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-red-700 to-red-800 mb-2">
            My Profile
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Manage your account, track your progress, and view your achievements
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-3xl overflow-hidden border border-white/20 mb-8">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-300 via-red-400 to-red-400 px-8 py-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-16 -translate-x-16"></div>
            <div className="relative z-10 flex flex-col sm:flex-row items-center text-center sm:text-left">
              <div className="relative mb-6 sm:mb-0">
                <div className="h-28 w-28 bg-white rounded-full flex items-center justify-center shadow-xl ring-4 ring-white/20">
                  <span className="text-3xl font-black text-red-600">
                    {userInfo.fullname?.charAt(0)?.toUpperCase() || "U"}
                  </span>
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
              </div>
              <div className="sm:ml-8">
                <h1 className="text-3xl font-bold text-white mb-2">
                  {userInfo.fullname}
                </h1>
                <p className="text-red-100 text-lg mb-4">@{userInfo.username}</p>
                <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                  <span className="px-3 py-1 bg-white/20 text-white text-sm rounded-full font-medium">
                    Active Member
                  </span>
                  <span className="px-3 py-1 bg-white/20 text-white text-sm rounded-full font-medium">
                    {courses.length} Courses
                  </span>
                  <span className="px-3 py-1 bg-white/20 text-white text-sm rounded-full font-medium">
                    {surveys.length} Surveys
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Main Content with Sidebar */}
        <div className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-3xl overflow-hidden border border-white/20">
          <div className="flex flex-col lg:flex-row min-h-[600px]">
            {/* Vertical Sidebar Navigation */}
            <div className="w-full lg:w-80 bg-gradient-to-b from-gray-50 to-white border-r border-gray-200 lg:rounded-l-3xl">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Navigation</h3>
                <p className="text-sm text-gray-600">Manage your profile and view your progress</p>
              </div>

              <nav className="p-4 space-y-2">
                <button
                  onClick={() => setActiveTab('info')}
                  className={`w-full flex items-center space-x-4 px-4 py-4 rounded-xl text-left font-medium transition-all duration-200 group ${activeTab === 'info'
                      ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg scale-105'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-red-600 hover:scale-105'
                    }`}
                >
                  <div className={`p-2 rounded-lg ${activeTab === 'info'
                      ? 'bg-white/20'
                      : 'bg-gray-200 group-hover:bg-red-100'
                    }`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold">Profile Information</div>
                    <div className={`text-xs ${activeTab === 'info' ? 'text-red-100' : 'text-gray-500'
                      }`}>
                      Manage your account details
                    </div>
                  </div>
                  {activeTab === 'info' && (
                    <div className="w-2 h-8 bg-white rounded-full"></div>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('courses')}
                  className={`w-full flex items-center space-x-4 px-4 py-4 rounded-xl text-left font-medium transition-all duration-200 group ${activeTab === 'courses'
                      ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg scale-105'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-red-600 hover:scale-105'
                    }`}
                >
                  <div className={`p-2 rounded-lg ${activeTab === 'courses'
                      ? 'bg-white/20'
                      : 'bg-gray-200 group-hover:bg-red-100'
                    }`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold">My Courses</div>
                    <div className={`text-xs ${activeTab === 'courses' ? 'text-red-100' : 'text-gray-500'
                      }`}>
                      View enrolled courses
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${activeTab === 'courses'
                        ? 'bg-white/20 text-white'
                        : 'bg-red-100 text-red-600'
                      }`}>
                      {courses.length}
                    </span>
                    {activeTab === 'courses' && (
                      <div className="w-2 h-8 bg-white rounded-full"></div>
                    )}
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab('surveys')}
                  className={`w-full flex items-center space-x-4 px-4 py-4 rounded-xl text-left font-medium transition-all duration-200 group ${activeTab === 'surveys'
                      ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg scale-105'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-red-600 hover:scale-105'
                    }`}
                >
                  <div className={`p-2 rounded-lg ${activeTab === 'surveys'
                      ? 'bg-white/20'
                      : 'bg-gray-200 group-hover:bg-red-100'
                    }`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold">Surveys</div>
                    <div className={`text-xs ${activeTab === 'surveys' ? 'text-red-100' : 'text-gray-500'
                      }`}>
                      Track your progress
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${activeTab === 'surveys'
                        ? 'bg-white/20 text-white'
                        : 'bg-blue-100 text-blue-600'
                      }`}>
                      {surveys.length}
                    </span>
                    {activeTab === 'surveys' && (
                      <div className="w-2 h-8 bg-white rounded-full"></div>
                    )}
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab('booking')}
                  className={`w-full flex items-center space-x-4 px-4 py-4 rounded-xl text-left font-medium transition-all duration-200 group ${activeTab === 'booking'
                      ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg scale-105'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-red-600 hover:scale-105'
                    }`}
                >
                  <div className={`p-2 rounded-lg ${activeTab === 'booking'
                      ? 'bg-white/20'
                      : 'bg-gray-200 group-hover:bg-red-100'
                    }`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 4h-1V2h-2v2H8V2H6v2H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2zm0 16H5V9h14v11zm0-13H5V6h14v1z"/>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold">My Booking Consultant</div>
                    <div className={`text-xs ${activeTab === 'booking' ? 'text-red-100' : 'text-gray-500'
                      }`}>
                      View your booked appointments
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${activeTab === 'booking'
                        ? 'bg-white/20 text-white'
                        : 'bg-purple-100 text-purple-600'
                      }`}>
                      {bookings.length}
                    </span>
                    {activeTab === 'booking' && (
                      <div className="w-2 h-8 bg-white rounded-full"></div>
                    )}
                  </div>
                </button>
              </nav>
            </div>

            {/* Content Area */}
            <div className="flex-1 p-8 bg-white/30 lg:rounded-r-3xl overflow-y-auto">
              {/* Tab Content */}
              {activeTab === 'info' && (
                <div className="space-y-8">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Profile Information
                      </h2>
                      <p className="text-gray-600">Manage your personal information and account settings</p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {!editMode ? (
                        <>
                          <button
                            onClick={() => setEditMode(true)}
                            className="bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-700 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-95 shadow-lg hover:shadow-xl flex items-center space-x-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            <span>Edit Profile</span>
                          </button>
                          <button
                            onClick={handleChangePassword}
                            className="bg-gradient-to-r from-gray-300 to-gray-400 hover:from-gray-400 hover:to-gray-500 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-95 shadow-lg hover:shadow-xl flex items-center space-x-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            <span>Change Password</span>
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={handleCancelEdit}
                            className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-95 shadow-lg hover:shadow-xl flex items-center space-x-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            <span>Cancel</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {editMode ? (
                    // Edit Form
                    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/30">
                      <form onSubmit={handleUpdateProfile} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                            <p className="mt-2 text-xs text-gray-500 flex items-center">
                              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                              </svg>
                              Username cannot be changed
                            </p>
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
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400 transition-all duration-200 bg-white/80"
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
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400 transition-all duration-200 bg-white/80"
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
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400 transition-all duration-200 bg-white/80"
                            />
                          </div>
                        </div>

                        <div className="flex justify-end pt-6 border-t border-gray-200">
                          <button
                            type="submit"
                            disabled={updating}
                            className={`px-8 py-3 rounded-xl text-sm font-semibold text-white transition-all duration-200 shadow-lg active:scale-95 ${updating
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 hover:shadow-xl"
                              }`}
                          >
                            {updating ? (
                              <span className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Updating...
                              </span>
                            ) : (
                              <span className="flex items-center">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Save Changes
                              </span>
                            )}
                          </button>
                        </div>
                      </form>
                    </div>
                  ) : (
                    // Display Mode
                    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/30">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-gray-700">
                            Username
                          </label>
                          <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
                            <p className="text-gray-900 font-medium">{userInfo.username}</p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-gray-700">
                            Full Name
                          </label>
                          <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
                            <p className="text-gray-900 font-medium">{userInfo.fullname}</p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-gray-700">
                            Email Address
                          </label>
                          <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
                            <p className="text-gray-900 font-medium">{userInfo.email}</p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-gray-700">
                            Birthday
                          </label>
                          <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
                            <p className="text-gray-900 font-medium">
                              {new Date(userInfo.birthday).toLocaleDateString('vi-VN')}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-8 pt-6 border-t border-gray-200">
                        <div className="flex items-center text-sm text-gray-600">
                          <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Profile verified and up to date
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Courses Tab */}
              {activeTab === 'courses' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900">My Courses</h2>
                  {courses.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-24 h-24 mx-auto mb-4 text-gray-300">
                        <svg fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2L3.09 8.26V12H21V8.26L12 2ZM18.18 9H5.82L12 5.09L18.18 9Z" />
                          <path d="M3.09 13V17.74L12 24L20.91 17.74V13L12 19.26L3.09 13Z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Courses Yet</h3>
                      <p className="text-gray-500">You haven't enrolled in any courses yet.</p>
                      <button
                        onClick={() => navigate('/courses')}
                        className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                      >
                        Browse Courses
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {courses.map((course) => (
                        <div key={course.course_id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                          {/* Hiển thị course image nếu có */}
                          {course.course_img && (
                            <div className="h-48 bg-gray-200 overflow-hidden">
                              <img 
                                src={course.course_img} 
                                alt={course.course_name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                }}
                              />
                            </div>
                          )}
                          <div className="p-6">
                            {/* Sử dụng course_name thay vì title */}
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                              {course.course_name || 'Untitled Course'}
                            </h3>
                            {/* Hiển thị thông tin course */}
                            <div className="space-y-2 mb-4">
                              <p className="text-sm text-gray-600">
                                <span className="font-medium">Age Group:</span> {course.age_group || 'Not specified'}
                              </p>
                              <p className="text-sm text-gray-600">
                                <span className="font-medium">Version:</span> {course.version || course.enroll_version}
                              </p>
                              <p className="text-sm text-gray-600">
                                <span className="font-medium">Enrolled:</span> {course.created_at ? new Date(course.created_at).toLocaleDateString('vi-VN') : 'N/A'}
                              </p>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                Enrolled
                              </span>
                              <button
                                onClick={() => navigate(`/course-learning/${course.member_id || userInfo.member_id}/${course.course_id}`)}
                                className="text-red-600 hover:text-red-700 text-sm font-medium"
                              >
                                Continue Learning
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Surveys Tab */}
              {activeTab === 'surveys' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900">My Surveys</h2>
                  {surveys.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-24 h-24 mx-auto mb-4 text-gray-300">
                        <svg fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17,9H7V7H17M17,13H7V11H17M14,17H7V15H14M12,3A1,1 0 0,1 13,4A1,1 0 0,1 12,5H8V18A2,2 0 0,0 10,20H16A2,2 0 0,0 18,18V8L13,3H12Z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Surveys Yet</h3>
                      <p className="text-gray-500">Complete surveys to track your progress and earn certificates.</p>
                      <button
                        onClick={() => navigate('/survey')}
                        className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                      >
                        Take Survey
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {surveys.map((survey) => (
                        <div key={survey.survey_id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">{survey.title}</h3>
                              <p className="text-sm text-gray-600">Completed on {new Date(survey.completed_date).toLocaleDateString('vi-VN')}</p>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center space-x-2">
                                <span className="text-2xl font-bold text-red-600">{survey.score}</span>
                                <span className="text-sm text-gray-500">/ {survey.total_questions}</span>
                              </div>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${survey.risk_level === 'low'
                                  ? 'bg-green-100 text-green-800'
                                  : survey.risk_level === 'medium'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                {survey.risk_level === 'low' ? 'Low Risk' :
                                  survey.risk_level === 'medium' ? 'Medium Risk' : 'High Risk'}
                              </span>
                            </div>
                          </div>
                          {survey.recommendations && (
                            <div className="bg-blue-50 p-4 rounded-md">
                              <h4 className="text-sm font-medium text-blue-900 mb-2">Recommendations:</h4>
                              <p className="text-sm text-blue-800">{survey.recommendations}</p>
                            </div>
                          )}
                          <div className="mt-4 flex space-x-3">
                            <button
                              onClick={() => navigate(`/survey/result/${survey.survey_id}`)}
                              className="text-red-600 hover:text-red-700 text-sm font-medium"
                            >
                              View Details
                            </button>
                            {survey.certificate_eligible && (
                              <button className="text-green-600 hover:text-green-700 text-sm font-medium">
                                Claim Certificate
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Booking Tab */}
              {activeTab === 'booking' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900">My Booking Consultant</h2>
                  {bookings.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-24 h-24 mx-auto mb-4 text-gray-300">
                        <svg fill="currentColor" viewBox="0 0 24 24"><path d="M19 4h-1V2h-2v2H8V2H6v2H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2zm0 16H5V9h14v11zm0-13H5V6h14v1z"/></svg>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Bookings Yet</h3>
                      <p className="text-gray-500">You have not booking any consultant appointments yet.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Consultant name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Link Meet</th>
                            <th className="px-6 py-3"></th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {bookings.map((b) => (
                            <tr key={b.appointment_id}>
                              <td className="px-4 py-4 whitespace-nowrap">{b.fullname}</td>
                              <td className="px-4 py-4 whitespace-nowrap">{formatDateTime(b.appointment_date)}</td >
                              <td className="px-4 py-4 whitespace-nowrap">{b.appointment_time}</td>
                              <td className="px-4py-4 whitespace-nowrap">
                                <a href={b.meeting_link} style={{color: "blue"}}>{b.meeting_link}</a>
                                </td>
                              <td className="px-3 py-4 whitespace-nowrap text-right">
                                <button onClick={() => handleCancelBooking(b.appointment_id)} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm font-medium">Cancel</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Profile;
