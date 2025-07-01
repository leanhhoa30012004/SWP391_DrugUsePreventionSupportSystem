import React, { useState } from 'react';
import { FaSearch, FaPlus, FaEye, FaEdit, FaTrash, FaCheckCircle, FaTimesCircle, FaBookOpen, FaUserGraduate, FaClock, FaStar, FaUsers, FaCalendarAlt, FaGraduationCap, FaChartLine, FaPlay, FaCertificate } from 'react-icons/fa';

// Enhanced fake course data for demo
const fakeCourses = [
  {
    id: 1,
    name: 'Drug Prevention 101',
    type: 'Education',
    instructor: 'Dr. Nguyen Van A',
    createdAt: '2024-06-01',
    lastUpdated: '2024-01-15',
    duration: '8 weeks',
    difficulty: 'Beginner',
    capacity: 100,
    enrolled: 80,
    completed: 65,
    rating: 4.8,
    modules: 12,
    status: 'Active',
    description: 'Comprehensive introductory course on drug prevention for youth, covering basic concepts, risk factors, and prevention strategies.',
    objectives: ['Understand drug types and effects', 'Identify risk factors', 'Learn prevention strategies'],
    targetAudience: 'High School Students',
    certificate: true,
    language: 'Vietnamese'
  },
  {
    id: 2,
    name: 'Community Engagement Strategies',
    type: 'Community',
    instructor: 'Ms. Tran Thi B',
    createdAt: '2024-05-15',
    lastUpdated: '2024-01-10',
    duration: '6 weeks',
    difficulty: 'Intermediate',
    capacity: 50,
    enrolled: 45,
    completed: 38,
    rating: 4.6,
    modules: 8,
    status: 'Inactive',
    description: 'Advanced course on engaging the community in anti-drug activities and building effective prevention networks.',
    objectives: ['Develop community outreach skills', 'Create prevention programs', 'Build partnerships'],
    targetAudience: 'Community Leaders',
    certificate: true,
    language: 'Vietnamese'
  },
  {
    id: 3,
    name: 'Healthy Living & Wellness',
    type: 'Health',
    instructor: 'Dr. Le Van C',
    createdAt: '2024-04-10',
    lastUpdated: '2024-01-20',
    duration: '10 weeks',
    difficulty: 'Beginner',
    capacity: 150,
    enrolled: 120,
    completed: 95,
    rating: 4.9,
    modules: 15,
    status: 'Active',
    description: 'Holistic approach to promoting healthy lifestyles and mental wellness to prevent drug abuse.',
    objectives: ['Adopt healthy habits', 'Improve mental wellness', 'Build resilience'],
    targetAudience: 'General Public',
    certificate: true,
    language: 'Vietnamese & English'
  },
  {
    id: 4,
    name: 'Parenting Skills for Prevention',
    type: 'Education',
    instructor: 'Ms. Pham Thi D',
    createdAt: '2024-03-20',
    lastUpdated: '2024-01-18',
    duration: '5 weeks',
    difficulty: 'Intermediate',
    capacity: 80,
    enrolled: 75,
    completed: 62,
    rating: 4.7,
    modules: 10,
    status: 'Active',
    description: 'Specialized course for parents to develop skills in preventing drug use among their children.',
    objectives: ['Improve communication skills', 'Set boundaries effectively', 'Recognize warning signs'],
    targetAudience: 'Parents',
    certificate: true,
    language: 'Vietnamese'
  }
];

const courseTypes = ['All', 'Education', 'Community', 'Health'];
const courseStatuses = ['All', 'Active', 'Inactive'];
const difficultyLevels = ['All', 'Beginner', 'Intermediate', 'Advanced'];

const CourseManagement = () => {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [viewCourse, setViewCourse] = useState(null);
  const [editCourse, setEditCourse] = useState(null);
  const [deleteCourse, setDeleteCourse] = useState(null);

  const filteredCourses = fakeCourses.filter(course => {
    const matchesSearch = course.name.toLowerCase().includes(search.toLowerCase()) || course.instructor.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'All' || course.type === typeFilter;
    const matchesStatus = statusFilter === 'All' || course.status === statusFilter;
    const matchesDifficulty = difficultyFilter === 'All' || course.difficulty === difficultyFilter;
    return matchesSearch && matchesType && matchesStatus && matchesDifficulty;
  });

  const getCompletionRate = (completed, enrolled) => {
    return enrolled > 0 ? Math.round((completed / enrolled) * 100) : 0;
  };

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-700';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-700';
      case 'Advanced': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FaStar 
          key={i} 
          className={i <= rating ? 'text-yellow-400' : 'text-gray-300'} 
        />
      );
    }
    return stars;
  };

  return (
    <div className="h-full w-full flex flex-col bg-gradient-to-br from-[#e0e7ff] via-[#fef6fb] to-[#f8fafc] p-0 rounded-2xl shadow-lg">
      {/* Header with gradient and large book icon */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-8 py-8 bg-gradient-to-r from-[#6366f1] via-[#22c55e] to-[#fbbf24] rounded-t-2xl shadow-lg">
        <div className="flex items-center gap-4">
          <div className="bg-white rounded-full p-4 shadow-lg">
            <FaBookOpen className="text-4xl text-[#6366f1]" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white mb-1">Course Management</h1>
            <p className="text-white text-sm md:text-base max-w-xl">Empower the community with knowledge. Manage, create, and analyze courses for a drug-free future.</p>
          </div>
        </div>
        <button className="flex items-center gap-2 bg-[#6366f1] hover:bg-[#22c55e] text-white font-semibold px-6 py-3 rounded-xl shadow transition-all duration-200 text-base">
          <FaPlus /> Create Course
        </button>
      </div>
      {/* Toolbar: Search & Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-8 py-4 bg-white rounded-b-2xl shadow-md -mt-4 z-10 relative">
        <div className="flex items-center gap-2 bg-[#f1f5f9] rounded-xl px-3 py-2 shadow w-full md:w-1/3">
          <FaSearch className="text-[#6366f1]" />
          <input
            type="text"
            placeholder="Search courses..."
            className="outline-none border-none flex-1 bg-transparent text-black"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <select
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-black focus:ring-[#6366f1] focus:border-[#6366f1]"
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
          >
            {courseTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <select
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-black focus:ring-[#22c55e] focus:border-[#22c55e]"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            {courseStatuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          <select
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-black focus:ring-[#fbbf24] focus:border-[#fbbf24]"
            value={difficultyFilter}
            onChange={e => setDifficultyFilter(e.target.value)}
          >
            {difficultyLevels.map(difficulty => (
              <option key={difficulty} value={difficulty}>{difficulty}</option>
            ))}
          </select>
        </div>
      </div>
      {/* Enhanced Course Table with progress bars */}
      <div className="overflow-auto rounded-b-2xl shadow bg-white mt-0 flex-1">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gradient-to-r from-[#6366f1] via-[#22c55e] to-[#fbbf24] text-white">
            <tr>
              <th className="px-4 py-3 font-bold">Course Details</th>
              <th className="px-4 py-3 font-bold">Instructor</th>
              <th className="px-4 py-3 font-bold">Progress</th>
              <th className="px-4 py-3 font-bold">Statistics</th>
              <th className="px-4 py-3 font-bold">Status</th>
              <th className="px-4 py-3 font-bold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCourses.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-400">No courses found.</td>
              </tr>
            ) : (
              filteredCourses.map(course => (
                <tr key={course.id} className="border-b last:border-b-0 hover:bg-[#e0e7ff] transition">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#6366f1] to-[#22c55e] flex items-center justify-center text-white font-bold">
                        <FaBookOpen />
                      </div>
                      <div>
                        <div className="font-semibold text-black">{course.name}</div>
                        <div className="text-xs text-gray-500 flex items-center gap-2">
                          <FaCalendarAlt className="text-[#6366f1]" /> {course.createdAt}
                          <span className="inline-block px-2 py-1 rounded-full bg-[#fbbf24] text-white font-bold text-xs">{course.type}</span>
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-bold ${getDifficultyColor(course.difficulty)}`}>
                            {course.difficulty}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 text-black">
                      <FaUserGraduate className="text-[#6366f1]" />
                      <div>
                        <div className="font-semibold text-sm">{course.instructor}</div>
                        <div className="text-xs text-gray-500">{course.targetAudience}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-black">
                        <span>Completion</span>
                        <span className="font-bold">{getCompletionRate(course.completed, course.enrolled)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full bg-[#22c55e]"
                          style={{ width: `${getCompletionRate(course.completed, course.enrolled)}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500">
                        {course.completed}/{course.enrolled} completed
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="space-y-1 text-black">
                      <div className="flex items-center gap-1 text-xs">
                        <FaClock className="text-[#6366f1]" /> {course.duration}
                      </div>
                      <div className="flex items-center gap-1 text-xs">
                        <FaPlay className="text-[#22c55e]" /> {course.modules} modules
                      </div>
                      <div className="flex items-center gap-1 text-xs">
                        <FaUsers className="text-[#fbbf24]" /> {course.enrolled}/{course.capacity}
                      </div>
                      <div className="flex items-center gap-1 text-xs">
                        <FaStar className="text-yellow-400" /> {course.rating}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {course.status === 'Active' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold">
                        <FaCheckCircle className="text-green-500" /> Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 text-gray-500 text-xs font-bold">
                        <FaTimesCircle className="text-gray-400" /> Inactive
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 flex gap-2">
                    <button
                      className="p-2 rounded-lg bg-[#6366f1] hover:bg-[#22c55e] text-white"
                      title="View Details"
                      onClick={() => setViewCourse(course)}
                    >
                      <FaEye />
                    </button>
                    <button
                      className="p-2 rounded-lg bg-[#fbbf24] hover:bg-[#eab308] text-white"
                      title="Edit"
                      onClick={() => setEditCourse(course)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="p-2 rounded-lg bg-gray-200 hover:bg-red-200 text-[#e11d48]"
                      title="Delete"
                      onClick={() => setDeleteCourse(course)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Enhanced View Course Modal */}
      {viewCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-2xl relative max-h-[90vh] overflow-y-auto">
            <button className="absolute top-3 right-3 text-gray-400 hover:text-[#6366f1] text-xl" onClick={() => setViewCourse(null)}>&times;</button>
            
            {/* Header with icon and basic info */}
            <div className="flex flex-col md:flex-row items-center gap-6 mb-6 pb-6 border-b">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#6366f1] to-[#22c55e] flex items-center justify-center text-white text-4xl shadow-lg">
                <FaBookOpen />
              </div>
              <div className="text-center md:text-left">
                <h2 className="text-2xl font-bold text-[#6366f1] mb-2">{viewCourse.name}</h2>
                <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                  <div className="flex">{renderStars(viewCourse.rating)}</div>
                  <span className="text-black font-bold">{viewCourse.rating}/5</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-black">
                  <span className="flex items-center gap-1">
                    <FaCalendarAlt className="text-[#6366f1]" /> {viewCourse.createdAt}
                  </span>
                  <span className="flex items-center gap-1">
                    <FaUsers className="text-[#22c55e]" /> {viewCourse.targetAudience}
                  </span>
                </div>
              </div>
            </div>

            {/* Statistics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-[#e0e7ff] rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-[#6366f1]">{viewCourse.enrolled}</div>
                <div className="text-xs text-black">Enrolled</div>
              </div>
              <div className="bg-[#dcfce7] rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-[#22c55e]">{viewCourse.completed}</div>
                <div className="text-xs text-black">Completed</div>
              </div>
              <div className="bg-[#fef3c7] rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-[#fbbf24]">{getCompletionRate(viewCourse.completed, viewCourse.enrolled)}%</div>
                <div className="text-xs text-black">Completion</div>
              </div>
              <div className="bg-[#e0e7ff] rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-[#6366f1]">{viewCourse.modules}</div>
                <div className="text-xs text-black">Modules</div>
              </div>
            </div>

            {/* Detailed information grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Course Details */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="text-lg font-bold text-[#6366f1] mb-3 flex items-center gap-2">
                  <FaBookOpen /> Course Details
                </h3>
                <div className="space-y-2 text-black">
                  <div><b>Type:</b> <span className="inline-block px-2 py-1 rounded-full bg-[#fbbf24] text-white font-bold text-xs">{viewCourse.type}</span></div>
                  <div><b>Difficulty:</b> <span className={`inline-block px-2 py-1 rounded-full text-xs font-bold ${getDifficultyColor(viewCourse.difficulty)}`}>{viewCourse.difficulty}</span></div>
                  <div><b>Duration:</b> {viewCourse.duration}</div>
                  <div><b>Target Audience:</b> {viewCourse.targetAudience}</div>
                  <div><b>Language:</b> {viewCourse.language}</div>
                  <div><b>Certificate:</b> {viewCourse.certificate ? 'Yes' : 'No'}</div>
                </div>
              </div>

              {/* Instructor & Progress */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="text-lg font-bold text-[#6366f1] mb-3 flex items-center gap-2">
                  <FaUserGraduate /> Instructor & Progress
                </h3>
                <div className="space-y-3">
                  <div className="text-black">
                    <div><b>Instructor:</b> {viewCourse.instructor}</div>
                    <div><b>Capacity:</b> {viewCourse.capacity} students</div>
                    <div><b>Last Updated:</b> {viewCourse.lastUpdated}</div>
                  </div>
                  <div>
                    <div className="flex justify-between text-black text-sm mb-1">
                      <span>Completion Rate</span>
                      <span className="font-bold">{getCompletionRate(viewCourse.completed, viewCourse.enrolled)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full bg-[#22c55e]"
                        style={{ width: `${getCompletionRate(viewCourse.completed, viewCourse.enrolled)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Objectives */}
            <div className="mt-6">
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="text-lg font-bold text-[#6366f1] mb-2">Learning Objectives</h3>
                <div className="space-y-1">
                  {viewCourse.objectives.map((objective, index) => (
                    <div key={index} className="text-black text-sm flex items-center gap-2">
                      <FaGraduationCap className="text-[#22c55e]" />
                      {objective}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mt-6">
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="text-lg font-bold text-[#6366f1] mb-2">Description</h3>
                <p className="text-black">{viewCourse.description}</p>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Delete Course Modal */}
      {deleteCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm relative">
            <button className="absolute top-3 right-3 text-gray-400 hover:text-[#6366f1] text-xl" onClick={() => setDeleteCourse(null)}>&times;</button>
            <h2 className="text-xl font-bold text-[#6366f1] mb-4">Delete Course</h2>
            <p className="mb-4 text-black">Are you sure you want to delete <b>{deleteCourse.name}</b>?</p>
            <div className="flex gap-3 justify-end">
              <button className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-black" onClick={() => setDeleteCourse(null)}>Cancel</button>
              <button className="px-4 py-2 rounded-lg bg-[#6366f1] hover:bg-[#22c55e] text-white" onClick={() => { setDeleteCourse(null); }}>Delete</button>
            </div>
          </div>
        </div>
      )}
      {/* Edit Course Modal (Demo only, not functional) */}
      {editCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md relative">
            <button className="absolute top-3 right-3 text-gray-400 hover:text-[#6366f1] text-xl" onClick={() => setEditCourse(null)}>&times;</button>
            <h2 className="text-xl font-bold text-[#6366f1] mb-4">Edit Course (Demo)</h2>
            <p className="text-gray-500">This is a demo modal. You can implement the edit form here.</p>
            <div className="flex gap-3 justify-end mt-6">
              <button className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-black" onClick={() => setEditCourse(null)}>Cancel</button>
              <button className="px-4 py-2 rounded-lg bg-[#6366f1] hover:bg-[#22c55e] text-white" onClick={() => setEditCourse(null)}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseManagement; 