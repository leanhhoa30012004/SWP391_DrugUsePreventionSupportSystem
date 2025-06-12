import React, { useState } from 'react';
import { FaEdit, FaTrash, FaPlus, FaEye, FaUsers, FaCertificate } from 'react-icons/fa';

const CourseManagement = () => {
  const [courses, setCourses] = useState([
    {
      course_id: 1,
      title: "Understanding Drugs and Their Effects",
      video: "https://example.com/video1",
      quiz: "Quiz 1 content",
      created_at: "2024-03-15 10:00:00",
      created_by: 1,
      edited_by: null,
      edited_at: null,
      is_active: true,
      enrollments: [
        {
          member_id: 2,
          learning_process: "50%",
          course_certificate: "certificate1.pdf",
          status: "in process",
          is_active: true
        }
      ]
    }
  ]);

  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(''); // 'add', 'edit', 'view', 'enrollments'
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);

  const handleAddCourse = () => {
    setModalType('add');
    setSelectedCourse(null);
    setIsModalOpen(true);
  };

  const handleEditCourse = (course) => {
    setModalType('edit');
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  const handleViewCourse = (course) => {
    setModalType('view');
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  const handleViewEnrollments = (course) => {
    setModalType('enrollments');
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  const handleDeleteCourse = (courseId) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      // Xử lý xóa khóa học
      setCourses(courses.filter(course => course.course_id !== courseId));
    }
  };

  const handleUpdateEnrollmentStatus = (courseId, memberId, newStatus) => {
    // Xử lý cập nhật trạng thái enrollment
    setCourses(courses.map(course => {
      if (course.course_id === courseId) {
        return {
          ...course,
          enrollments: course.enrollments.map(enrollment => {
            if (enrollment.member_id === memberId) {
              return { ...enrollment, status: newStatus };
            }
            return enrollment;
          })
        };
      }
      return course;
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Course Management</h1>
        <button
          onClick={handleAddCourse}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <FaPlus /> Add New Course
        </button>
      </div>

      {/* Course List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Course ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created At
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Edited
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {courses.map((course) => (
              <tr key={course.course_id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {course.course_id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{course.title}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(course.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {course.edited_at ? new Date(course.edited_at).toLocaleDateString() : 'Never'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    course.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {course.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleViewCourse(course)}
                      className="text-blue-600 hover:text-blue-900"
                      title="View Course"
                    >
                      <FaEye />
                    </button>
                    <button
                      onClick={() => handleViewEnrollments(course)}
                      className="text-green-600 hover:text-green-900"
                      title="View Enrollments"
                    >
                      <FaUsers />
                    </button>
                    <button
                      onClick={() => handleEditCourse(course)}
                      className="text-yellow-600 hover:text-yellow-900"
                      title="Edit Course"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteCourse(course.course_id)}
                      className="text-red-600 hover:text-red-900"
                      title="Delete Course"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            {modalType === 'enrollments' ? (
              // Enrollment Modal
              <div>
                <h2 className="text-xl font-bold mb-4">Course Enrollments</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Member ID</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Progress</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Certificate</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedCourse?.enrollments.map((enrollment) => (
                        <tr key={enrollment.member_id}>
                          <td className="px-4 py-2 text-sm text-gray-500">{enrollment.member_id}</td>
                          <td className="px-4 py-2 text-sm text-gray-500">{enrollment.learning_process}</td>
                          <td className="px-4 py-2">
                            <select
                              value={enrollment.status}
                              onChange={(e) => handleUpdateEnrollmentStatus(selectedCourse.course_id, enrollment.member_id, e.target.value)}
                              className="rounded-md border-gray-300 text-sm"
                            >
                              <option value="in process">In Process</option>
                              <option value="completed">Completed</option>
                              <option value="fail">Failed</option>
                            </select>
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-500">
                            {enrollment.course_certificate ? (
                              <a href={enrollment.course_certificate} className="text-blue-600 hover:text-blue-800">
                                <FaCertificate className="inline mr-1" />
                                View Certificate
                              </a>
                            ) : 'Not Available'}
                          </td>
                          <td className="px-4 py-2">
                            <button
                              onClick={() => {/* Handle certificate generation */}}
                              className="text-green-600 hover:text-green-800"
                              title="Generate Certificate"
                            >
                              <FaCertificate />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              // Course Form Modal
              <form className="space-y-4">
                <h2 className="text-xl font-bold mb-4">
                  {modalType === 'add' ? 'Add New Course' : 
                   modalType === 'edit' ? 'Edit Course' : 'View Course'}
                </h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                    defaultValue={selectedCourse?.title}
                    disabled={modalType === 'view'}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Video URL</label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                    defaultValue={selectedCourse?.video}
                    disabled={modalType === 'view'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Quiz Content</label>
                  <textarea
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                    rows="4"
                    defaultValue={selectedCourse?.quiz}
                    disabled={modalType === 'view'}
                  />
                </div>

                {modalType !== 'view' && (
                  <div className="flex justify-end gap-2 mt-6">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                    >
                      {modalType === 'add' ? 'Add Course' : 'Save Changes'}
                    </button>
                  </div>
                )}
                
                {modalType === 'view' && (
                  <div className="flex justify-end mt-6">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                    >
                      Close
                    </button>
                  </div>
                )}
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseManagement; 