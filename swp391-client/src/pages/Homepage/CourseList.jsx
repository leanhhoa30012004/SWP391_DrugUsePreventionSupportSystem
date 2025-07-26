import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

const CourseList = () => {
  const userId = JSON.parse(localStorage.getItem('user'))?.user_id;
  const navigate = useNavigate();
  const [coursesData, setCoursesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch all courses
  useEffect(() => {
    const fetchAllCourses = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:3000/api/course/get-all-course-for-member-by-member-id/:member_id${userId}`, {
          headers: {
            'Content-Type': 'application/json',
          }
        });

        console.log(response.data);
        setCoursesData(response.data);
        setError('');
      } catch (err) {
        console.error("Course API error:", err);
        Swal.fire({
          icon: 'error',
          title: 'Error Loading Courses',
          text: 'An error occurred while loading course data.',
          confirmButtonColor: '#dc2626'
        });
      } finally {
        setLoading(false);
      }
    };
    fetchAllCourses();
  }, [userId]);

  // Filter courses when filters change
  useEffect(() => {
    // Simply display first 6 courses for homepage
    setCoursesData(prev => prev.slice(0, 6));
  }, []);

  const handleViewCourse = (course_id, course_version) => {
    console.log(course_id, course_version);
    if (!course_id || !course_version) return;
    navigate(`/courses/${course_id}`, {
      state: {
        course_version: course_version
      }
    });
  };

  if (loading) {
    return (
      <section className="py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            <span className="ml-3 text-gray-600">Đang tải khóa học...</span>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-10 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-bold text-red-700">Featured Courses</h2>
            <p className="text-gray-600">
              Explore our programs for drug prevention and healthy lifestyles
            </p>
          </div>
          <button
            onClick={() => navigate('/courses')}
            className="border border-red-600 text-red-600 hover:bg-red-50 px-4 py-2 rounded-full font-medium transition"
          >
            All Courses
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {coursesData.slice(0, 6).map(course => (
            <div key={course.id || course._id} className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-4 flex flex-col border border-red-200">
              <div className="relative mb-4">
                <img
                  src={course.course_img || course.image}
                  alt={course.title || course.course_name}
                  className="rounded-xl w-full h-40 object-cover"
                  onError={(e) => {
                    e.target.src = `https://source.unsplash.com/400x300/?education,training`;
                  }}
                />
                <span className="absolute top-3 left-3 bg-red-600 text-white text-xs px-3 py-1 rounded-full shadow-md">
                  {course.category || course.age_group || 'Free'}
                </span>
              </div>
              <div className="flex-1 flex flex-col">
                <div className="text-xs text-gray-500 mb-1">
                  by {course.author || 'Instructor'}
                </div>
                <div className="font-semibold text-lg text-red-700 mb-2 line-clamp-2">
                  {course.title || course.course_name}
                </div>
                <div className="flex text-xs text-gray-400 mb-2">
                  <span>{course.duration || 'Flexible'}</span>
                  <span className="mx-2">•</span>
                  <span>{course.students || '1k+'} Students</span>
                </div>
                <div className="flex justify-between items-center mt-auto">
                  <span className="text-red-600 font-semibold">
                    {course.price || 'Free'}
                  </span>
                  <button
                    onClick={() => handleViewCourse(course.course_id || course.id, course.version || '1.0')}
                    className="text-sm text-red-700 hover:underline font-medium"
                  >
                    View More
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CourseList;