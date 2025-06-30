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

      const response = await axios.get("http://localhost:3000/api/auth/profile/courses", {
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

      const response = await axios.get("http://localhost:3000/api/auth/profile/surveys", {
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-8">
            <div className="flex items-center">
              <div className="h-20 w-20 bg-white rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-red-600">
                  {userInfo.fullname?.charAt(0)?.toUpperCase() || "U"}
                </span>
              </div>
              <div className="ml-6">
                <h1 className="text-2xl font-bold text-white">
                  {userInfo.fullname}
                </h1>
                <p className="text-red-100">@{userInfo.username}</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-8">
            {/* Tab Navigation */}
            <div className="border-b border-gray-200 mb-6">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('info')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'info'
                      ? 'border-red-500 text-red-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Profile Information
                </button>
                <button
                  onClick={() => setActiveTab('courses')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'courses'
                      ? 'border-red-500 text-red-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  My Courses ({courses.length})
                </button>
                <button
                  onClick={() => setActiveTab('certificates')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'certificates'
                      ? 'border-red-500 text-red-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Certificates ({certificates.length})
                </button>
                <button
                  onClick={() => setActiveTab('surveys')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'surveys'
                      ? 'border-red-500 text-red-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Surveys ({surveys.length})
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            {activeTab === 'info' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Profile Information
                  </h2>
                  <div className="space-x-3">
                    {!editMode ? (
                      <>
                        <button
                          onClick={() => setEditMode(true)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                        >
                          Edit Profile
                        </button>
                        <button
                          onClick={handleChangePassword}
                          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                        >
                          Change Password
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={handleCancelEdit}
                          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                  </div>
                </div>

            {editMode ? (
              // Edit Form
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Username
                  </label>
                  <input
                    type="text"
                    value={userInfo.username}
                    disabled
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 text-gray-500 cursor-not-allowed"
                  />
                  <p className="mt-1 text-xs text-gray-500">Username cannot be changed</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullname"
                    value={formData.fullname}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Birthday
                  </label>
                  <input
                    type="date"
                    name="birthday"
                    value={formData.birthday}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={updating}
                    className={`px-6 py-2 rounded-md text-sm font-medium text-white transition-colors ${
                      updating
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-red-600 hover:bg-red-700"
                    }`}
                  >
                    {updating ? "Updating..." : "Save Changes"}
                  </button>
                </div>
              </form>
            ) : (
              // Display Mode
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Username
                    </label>
                    <p className="mt-1 text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                      {userInfo.username}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <p className="mt-1 text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                      {userInfo.fullname}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <p className="mt-1 text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                      {userInfo.email}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Birthday
                    </label>
                    <p className="mt-1 text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                      {new Date(userInfo.birthday).toLocaleDateString('vi-VN')}
                    </p>
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
                        <path d="M12 2L3.09 8.26V12H21V8.26L12 2ZM18.18 9H5.82L12 5.09L18.18 9Z"/>
                        <path d="M3.09 13V17.74L12 24L20.91 17.74V13L12 19.26L3.09 13Z"/>
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
                        <div className="p-6">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">{course.title}</h3>
                          <p className="text-sm text-gray-600 mb-4 line-clamp-3">{course.description}</p>
                          <div className="flex items-center justify-between">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              course.status === 'completed' 
                                ? 'bg-green-100 text-green-800'
                                : course.status === 'in_progress'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {course.status === 'completed' ? 'Completed' : 
                               course.status === 'in_progress' ? 'In Progress' : 'Not Started'}
                            </span>
                            <button
                              onClick={() => navigate(`/courses/${course.course_id}`)}
                              className="text-red-600 hover:text-red-700 text-sm font-medium"
                            >
                              View Course
                            </button>
                          </div>
                          {course.progress && (
                            <div className="mt-4">
                              <div className="flex justify-between text-sm text-gray-600 mb-1">
                                <span>Progress</span>
                                <span>{Math.round(course.progress)}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-red-500 h-2 rounded-full transition-all duration-300"
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
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">My Certificates</h2>
                {certificates.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 mx-auto mb-4 text-gray-300">
                      <svg fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9,10H12A1,1 0 0,1 13,11V12A1,1 0 0,1 12,13H9V11M9,15H12A1,1 0 0,1 13,16V17A1,1 0 0,1 12,18H9V16M12,3A1,1 0 0,1 13,4V8A1,1 0 0,1 12,9H11V7H9V9H8A1,1 0 0,1 7,8V4A1,1 0 0,1 8,3H12M21,6V8H19V6H21M21,10V12H19V10H21M21,14V16H19V14H21Z"/>
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Certificates Yet</h3>
                    <p className="text-gray-500">Complete courses and surveys to earn certificates.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {certificates.map((certificate) => (
                      <div key={certificate.certificate_id} className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-2 border-yellow-200 rounded-lg p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center">
                            <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mr-4">
                              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M9,10H12A1,1 0 0,1 13,11V12A1,1 0 0,1 12,13H9V11M9,15H12A1,1 0 0,1 13,16V17A1,1 0 0,1 12,18H9V16M12,3A1,1 0 0,1 13,4V8A1,1 0 0,1 12,9H11V7H9V9H8A1,1 0 0,1 7,8V4A1,1 0 0,1 8,3H12Z"/>
                              </svg>
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">{certificate.title}</h3>
                              <p className="text-sm text-gray-600">{certificate.type}</p>
                            </div>
                          </div>
                          <span className="text-xs text-gray-500">
                            {new Date(certificate.earned_date).toLocaleDateString('vi-VN')}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 mb-4">{certificate.description}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-yellow-700">
                            Certificate ID: {certificate.certificate_id}
                          </span>
                          <button className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors">
                            Download
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
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">My Surveys</h2>
                {surveys.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 mx-auto mb-4 text-gray-300">
                      <svg fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17,9H7V7H17M17,13H7V11H17M14,17H7V15H14M12,3A1,1 0 0,1 13,4A1,1 0 0,1 12,5H8V18A2,2 0 0,0 10,20H16A2,2 0 0,0 18,18V8L13,3H12Z"/>
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
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              survey.risk_level === 'low' 
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
