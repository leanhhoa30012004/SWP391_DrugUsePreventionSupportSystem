import React, { useState } from 'react';
import { FaPlay, FaCertificate, FaLock, FaCheck } from 'react-icons/fa';

const CourseList = () => {
  const [courses, setCourses] = useState([
    {
      course_id: 1,
      title: "Understanding Drugs and Their Effects",
      video: "https://youtu.be/62FYNwd-8Jo",
      quiz: "Quiz 1 content",
      created_at: "2024-03-15 10:00:00",
      is_active: true,
      enrollment: {
        learning_process: "50%",
        course_certificate: null,
        status: "in process",
        is_active: true
      }
    },
    {
      course_id: 2,
      title: "Drug Prevention Strategies",
      video: "https://example.com/video2",
      quiz: "Quiz 2 content",
      created_at: "2024-03-16 10:00:00",
      is_active: true,
      enrollment: null
    }
  ]);

  const handleStartCourse = (courseId) => {
    // Xử lý bắt đầu khóa học
    console.log(`Starting course ${courseId}`);
  };

  const handleContinueCourse = (courseId) => {
    // Xử lý tiếp tục khóa học
    console.log(`Continuing course ${courseId}`);
  };

  const handleViewCertificate = (courseId) => {
    // Xử lý xem chứng chỉ
    console.log(`Viewing certificate for course ${courseId}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Available Courses</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course.course_id} className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Course Thumbnail */}
            <div className="relative h-48 bg-gray-200">
              <div className="absolute inset-0 flex items-center justify-center">
                <FaPlay className="text-4xl text-red-500 opacity-75" />
              </div>
            </div>

            {/* Course Content */}
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">{course.title}</h2>
              
              {/* Enrollment Status */}
              {course.enrollment ? (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Progress:</span>
                    <span className="text-sm font-medium text-gray-800">{course.enrollment.learning_process}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-red-500 h-2 rounded-full" 
                      style={{ width: course.enrollment.learning_process }}
                    ></div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-600 mb-4">Not enrolled yet</p>
              )}

              {/* Course Actions */}
              <div className="flex justify-between items-center">
                {course.enrollment ? (
                  <>
                    {course.enrollment.status === 'completed' ? (
                      <button
                        onClick={() => handleViewCertificate(course.course_id)}
                        className="flex items-center gap-2 text-green-600 hover:text-green-700"
                      >
                        <FaCertificate /> View Certificate
                      </button>
                    ) : (
                      <button
                        onClick={() => handleContinueCourse(course.course_id)}
                        className="flex items-center gap-2 text-red-500 hover:text-red-600"
                      >
                        <FaPlay /> Continue Learning
                      </button>
                    )}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      course.enrollment.status === 'completed' 
                        ? 'bg-green-100 text-green-800'
                        : course.enrollment.status === 'fail'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {course.enrollment.status === 'completed' ? (
                        <span className="flex items-center gap-1">
                          <FaCheck /> Completed
                        </span>
                      ) : course.enrollment.status === 'fail' ? 'Failed' : 'In Progress'}
                    </span>
                  </>
                ) : (
                  <button
                    onClick={() => handleStartCourse(course.course_id)}
                    className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                  >
                    <FaPlay /> Start Course
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseList; 