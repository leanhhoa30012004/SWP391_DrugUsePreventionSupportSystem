import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";

const Profile = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({
    username: "",
    email: "",
    fullname: "",
    birthday: "",
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
  const [certificates, setCertificates] = useState([]);
  const [surveys, setSurveys] = useState([]);

  // Lấy thông tin user khi component mount
  useEffect(() => {
    fetchUserProfile();
    fetchUserCourses();
    fetchUserCertificates();
    fetchUserSurveys();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await axios.get("http://localhost:3000/api/auth/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setUserInfo(response.data.user);
        setFormData({
          fullname: response.data.user.fullname,
          email: response.data.user.email,
          birthday: response.data.user.birthday,
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load profile information",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchUserCourses = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await axios.get("http://localhost:3000/api/auth/course/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setCourses(response.data.courses);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const fetchUserCertificates = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await axios.get("http://localhost:3000/api/auth/profile/certificates", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setCertificates(response.data.certificates);
      }
    } catch (error) {
      console.error("Error fetching certificates:", error);
    }
  };

  const fetchUserSurveys = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await axios.get(`http://localhost:3000/api/survey/survey-history/${memberId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setSurveys(response.data.surveys);
      }
    } catch (error) {
      console.error("Error fetching surveys:", error);
    }
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
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-gray-50 to-red-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-red-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-gray-50 to-red-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-100">
          {/* Header */}
          <div className="relative bg-gradient-to-r from-red-500 via-red-600 to-red-700 px-8 py-12">
            <div className="absolute inset-0 bg-black opacity-10"></div>
            <div className="relative flex items-center">
              <div className="relative">
                <div className="h-24 w-24 bg-white rounded-full flex items-center justify-center shadow-lg ring-4 ring-white ring-opacity-50">
                  <span className="text-3xl font-bold text-red-600">
                    {userInfo.fullname?.charAt(0)?.toUpperCase() || "U"}
                  </span>
                </div>
                <div className="absolute -bottom-1 -right-0 bg-green-500 rounded-full w-6 h-6 flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
              </div>
              <div className="ml-8">
                <h1 className="text-3xl font-bold text-white mb-2">
                  {userInfo.fullname}
                </h1>
                <p className="text-red-100 text-lg">@{userInfo.username}</p>
                
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-8 py-8">
            {/* Tab Navigation */}
            <div className="border-b border-gray-200 mb-8">
              <nav className="-mb-px flex space-x-8">
                {[
                  { id: 'info', label: 'Profile Information', icon: '👤' },
                  { id: 'courses', label: `My Courses (${courses.length})`, icon: '📚' },
                  { id: 'certificates', label: `Certificates (${certificates.length})`, icon: '🏆' },
                  { id: 'surveys', label: `Surveys (${surveys.length})`, icon: '📊' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-3 px-4 border-b-2 font-medium text-sm transition-all duration-200 flex items-center space-x-2 ${
                      activeTab === tab.id
                        ? 'border-red-500 text-red-600 bg-red-50 rounded-t-lg'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50 rounded-t-lg'
                    }`}
                  >
                    <span className="text-lg">{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            {activeTab === 'info' && (
              <div className="animate-fadeIn">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                    <span className="text-red-600 mr-3">👤</span>
                    Profile Information
                  </h2>
                  <div className="space-x-3">
                    {!editMode ? (
                      <>
                        <button
                          onClick={() => setEditMode(true)}
                          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                          ✏️ Edit Profile
                        </button>
                        <button
                          onClick={handleChangePassword}
                          className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                          🔒 Change Password
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={handleCancelEdit}
                          className="bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                        >
                          ❌ Cancel
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {editMode ? (
                  // Edit Form
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-8 shadow-inner">
                    <form onSubmit={handleUpdateProfile} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Username
                          </label>
                          <input
                            type="text"
                            value={userInfo.username}
                            disabled
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-gray-100 text-gray-500 cursor-not-allowed"
                          />
                          <p className="mt-2 text-xs text-gray-500">Username cannot be changed</p>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Full Name
                          </label>
                          <input
                            type="text"
                            name="fullname"
                            value={formData.fullname}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Email
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Birthday
                          </label>
                          <input
                            type="date"
                            name="birthday"
                            value={formData.birthday}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end mt-8">
                        <button
                          type="submit"
                          disabled={updating}
                          className={`px-8 py-3 rounded-lg text-sm font-medium text-white transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${
                            updating
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                          }`}
                        >
                          {updating ? "💾 Updating..." : "💾 Save Changes"}
                        </button>
                      </div>
                    </form>
                  </div>
                ) : (
                  // Display Mode
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      { label: 'Username', value: userInfo.username, icon: '👤' },
                      { label: 'Full Name', value: userInfo.fullname, icon: '🏷️' },
                      { label: 'Email', value: userInfo.email, icon: '📧' },
                      { label: 'Birthday', value: new Date(userInfo.birthday).toLocaleDateString('vi-VN'), icon: '🎂' }
                    ].map((field, index) => (
                      <div key={index} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200">
                        <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                          <span className="mr-2">{field.icon}</span>
                          {field.label}
                        </label>
                        <p className="text-lg text-gray-900 font-medium">
                          {field.value}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Courses Tab */}
            {activeTab === 'courses' && (
              <div className="space-y-6 animate-fadeIn">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  <span className="text-red-600 mr-3">📚</span>
                  My Courses
                </h2>
                {courses.length === 0 ? (
                  <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
                    <div className="w-32 h-32 mx-auto mb-6 text-gray-300 animate-bounce">
                      <svg fill="currentColor" viewBox="0 0 24 24" className="w-full h-full">
                        <path d="M12 2L3.09 8.26V12H21V8.26L12 2ZM18.18 9H5.82L12 5.09L18.18 9Z"/>
                        <path d="M3.09 13V17.74L12 24L20.91 17.74V13L12 19.26L3.09 13Z"/>
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">No Courses Yet</h3>
                    <p className="text-gray-600 mb-6">You haven't enrolled in any courses yet. Start your learning journey!</p>
                    <button
                      onClick={() => navigate('/courses')}
                      className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-8 py-3 rounded-lg text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      🔍 Browse Courses
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((course) => (
                      <div key={course.course_id} className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                        <div className="p-6">
                          <h3 className="text-lg font-semibold text-gray-900 mb-3">{course.title}</h3>
                          <p className="text-sm text-gray-600 mb-4 line-clamp-3">{course.description}</p>
                          <div className="flex items-center justify-between mb-4">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                              course.status === 'completed' 
                                ? 'bg-green-100 text-green-800'
                                : course.status === 'in_progress'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {course.status === 'completed' ? '✅ Completed' : 
                               course.status === 'in_progress' ? '📚 In Progress' : '⏳ Not Started'}
                            </span>
                            <button
                              onClick={() => navigate(`/courses/${course.course_id}`)}
                              className="text-red-600 hover:text-red-700 text-sm font-medium hover:underline"
                            >
                              View Course →
                            </button>
                          </div>
                          {course.progress && (
                            <div className="mt-4">
                              <div className="flex justify-between text-sm text-gray-600 mb-2">
                                <span>Progress</span>
                                <span className="font-semibold">{Math.round(course.progress)}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div 
                                  className="bg-gradient-to-r from-red-500 to-red-600 h-2.5 rounded-full transition-all duration-500"
                                  style={{ width: `${course.progress}%` }}
                                ></div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Certificates Tab */}
            {activeTab === 'certificates' && (
              <div className="space-y-6 animate-fadeIn">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  <span className="text-red-600 mr-3">🏆</span>
                  My Certificates
                </h2>
                {certificates.length === 0 ? (
                  <div className="text-center py-16 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl">
                    <div className="w-32 h-32 mx-auto mb-6 text-yellow-300 animate-pulse">
                      <svg fill="currentColor" viewBox="0 0 24 24" className="w-full h-full">
                        <path d="M9,10H12A1,1 0 0,1 13,11V12A1,1 0 0,1 12,13H9V11M9,15H12A1,1 0 0,1 13,16V17A1,1 0 0,1 12,18H9V16M12,3A1,1 0 0,1 13,4V8A1,1 0 0,1 12,9H11V7H9V9H8A1,1 0 0,1 7,8V4A1,1 0 0,1 8,3H12M21,6V8H19V6H21M21,10V12H19V10H21M21,14V16H19V14H21Z"/>
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">No Certificates Yet</h3>
                    <p className="text-gray-600">Complete courses and surveys to earn certificates and showcase your achievements!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {certificates.map((certificate) => (
                      <div key={certificate.certificate_id} className="bg-gradient-to-br from-yellow-50 via-yellow-100 to-yellow-200 border-2 border-yellow-300 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center">
                            <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center mr-4 shadow-lg">
                              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M9,10H12A1,1 0 0,1 13,11V12A1,1 0 0,1 12,13H9V11M9,15H12A1,1 0 0,1 13,16V17A1,1 0 0,1 12,18H9V16M12,3A1,1 0 0,1 13,4V8A1,1 0 0,1 12,9H11V7H9V9H8A1,1 0 0,1 7,8V4A1,1 0 0,1 8,3H12Z"/>
                              </svg>
                            </div>
                            <div>
                              <h3 className="text-lg font-bold text-gray-900">{certificate.title}</h3>
                              <p className="text-sm text-gray-700 font-medium">{certificate.type}</p>
                            </div>
                          </div>
                          <span className="text-xs text-gray-600 bg-white px-2 py-1 rounded-full">
                            {new Date(certificate.earned_date).toLocaleDateString('vi-VN')}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 mb-4">{certificate.description}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-yellow-800 bg-yellow-200 px-3 py-1 rounded-full">
                            ID: {certificate.certificate_id}
                          </span>
                          <button className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg">
                            📥 Download
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Surveys Tab */}
            {activeTab === 'surveys' && (
              <div className="space-y-6 animate-fadeIn">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  <span className="text-red-600 mr-3">📊</span>
                  My Surveys
                </h2>
                {surveys.length === 0 ? (
                  <div className="text-center py-16 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                    <div className="w-32 h-32 mx-auto mb-6 text-blue-300 animate-pulse">
                      <svg fill="currentColor" viewBox="0 0 24 24" className="w-full h-full">
                        <path d="M17,9H7V7H17M17,13H7V11H17M14,17H7V15H14M12,3A1,1 0 0,1 13,4A1,1 0 0,1 12,5H8V18A2,2 0 0,0 10,20H16A2,2 0 0,0 18,18V8L13,3H12Z"/>
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">No Surveys Yet</h3>
                    <p className="text-gray-600 mb-6">Complete surveys to track your progress and earn certificates.</p>
                    <button
                      onClick={() => navigate('/survey')}
                      className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-8 py-3 rounded-lg text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      📝 Take Survey
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {surveys.map((survey) => (
                      <div key={survey.survey_id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">{survey.title}</h3>
                            <p className="text-sm text-gray-600 flex items-center">
                              <span className="mr-2">📅</span>
                              Completed on {new Date(survey.completed_date).toLocaleDateString('vi-VN')}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="text-3xl font-bold text-red-600">{survey.score}</span>
                              <span className="text-lg text-gray-500">/ {survey.total_questions}</span>
                            </div>
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                              survey.risk_level === 'low' 
                                ? 'bg-green-100 text-green-800'
                                : survey.risk_level === 'medium'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {survey.risk_level === 'low' ? '🟢 Low Risk' : 
                               survey.risk_level === 'medium' ? '🟡 Medium Risk' : '🔴 High Risk'}
                            </span>
                          </div>
                        </div>
                        {survey.recommendations && (
                          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200 mb-4">
                            <h4 className="text-sm font-semibold text-blue-900 mb-2 flex items-center">
                              <span className="mr-2">💡</span>
                              Recommendations:
                            </h4>
                            <p className="text-sm text-blue-800">{survey.recommendations}</p>
                          </div>
                        )}
                        <div className="mt-4 flex space-x-3">
                          <button
                            onClick={() => navigate(`/survey/result/${survey.survey_id}`)}
                            className="text-red-600 hover:text-red-700 text-sm font-medium hover:underline flex items-center"
                          >
                            <span className="mr-1">👁️</span>
                            View Details
                          </button>
                          {survey.certificate_eligible && (
                            <button className="text-green-600 hover:text-green-700 text-sm font-medium hover:underline flex items-center">
                              <span className="mr-1">🏆</span>
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
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default Profile;