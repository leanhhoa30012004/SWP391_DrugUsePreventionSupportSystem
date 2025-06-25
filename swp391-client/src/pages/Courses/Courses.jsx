import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/footer';
import CourseCompleted from './CourseCompleted';

function Courses() {
    const userId = localStorage.getItem('user_id');
    const navigate = useNavigate();
    const [filters, setFilters] = useState({
        ageGroup: '',
        searchQuery: ''
    });
    const [coursesData, setCoursesData] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const coursesPerPage = 6;

    // Fetch all courses
    useEffect(() => {
        const fetchAllCourses = async () => {
            try {
                setLoading(true);
                const response = await axios.get('http://localhost:3000/api/course/get-all-course', {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                console.log(response.data)
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
    }, []);

    // Filter courses when filters change
    useEffect(() => {
        filterCourses();
    }, [coursesData, filters]);

    const searchCoursesByName = async (courseName) => {
        if (!courseName.trim()) {
            setFilteredCourses(coursesData);
            return;
        }

        try {
            const response = await axios.get(`http://localhost:3000/api/course/get-course-by-name/${courseName}`);
            if (typeof response.data === 'string' && response.data.includes('Cannot found')) {
                setFilteredCourses([]);
            } else {
                setFilteredCourses(Array.isArray(response.data) ? response.data : [response.data]);
            }
        } catch (err) {
            console.error("Search API error:", err);
            Swal.fire({
                icon: 'warning',
                title: 'Search Error',
                text: 'An error occurred while searching for courses.',
                confirmButtonColor: '#dc2626'
            });
        }
    };

    const filterCourses = () => {
        let filtered = coursesData;

        // Filter by age group
        if (filters.ageGroup) {
            filtered = filtered.filter(course =>
                course.age_group === filters.ageGroup ||
                course.category === filters.ageGroup
            );
        }
        setFilteredCourses(filtered);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (filters.searchQuery.trim()) {
            searchCoursesByName(filters.searchQuery);
        } else {
            filterCourses();
        }
        setCurrentPage(1);
    };

    const handleFilterChange = (filterType, value) => {
        setFilters(prev => ({
            ...prev,
            [filterType]: value
        }));
        setCurrentPage(1);
    };

    const clearFilters = () => {
        setFilters({
            ageGroup: '',
            searchQuery: ''
        });
        setCurrentPage(1);
    };

    // Pagination
    const indexOfLastCourse = currentPage * coursesPerPage;
    const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
    const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);
    const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleViewCourse = (course_id, course_version) => {
        console.log(course_id, course_version)
        if (!course_id || !course_version) return;
        navigate(`/courses/${course_id}`,
            {
                state: {
                    course_version: course_version
                }
            }
        );
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="bg-white min-h-screen py-12">
                    <div className="container mx-auto px-4">
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
                            <span className="ml-3 text-gray-600">Đang tải khóa học...</span>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="bg-white min-h-screen py-12">
                <div className="container mx-auto px-4">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-red-600 mb-4">Anti-Drug Training Courses</h1>
                        <p className="text-gray-600 text-lg">Choose the right course based on your age and needs</p>
                        <div className="mt-6 max-w-md mx-auto">
                            <form onSubmit={handleSearchSubmit} className="flex">
                                <input
                                    type="text"
                                    placeholder="Search courses..."
                                    className="flex-1 px-4 py-2 border border-red-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                    value={filters.searchQuery}
                                    onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
                                />
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-red-600 text-white rounded-r-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                                >
                                    Search
                                </button>
                            </form>
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                            {error}
                        </div>
                    )}

                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Sidebar Filters */}
                        <div className="w-full lg:w-1/4 bg-red-50 border border-red-200 p-6 rounded-lg shadow-md h-fit">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold text-red-700">Filters</h2>
                                <button
                                    onClick={clearFilters}
                                    className="text-sm text-red-600 hover:text-red-800 underline"
                                >
                                    Clear filters
                                </button>
                            </div>

                            {/* Age Group Filter */}
                            <div className="mb-6">
                                <h3 className="text-red-600 font-medium mb-3">Age Group</h3>
                                <div className="space-y-2 text-sm text-gray-700">
                                    {['Teenager', 'Young Adult', 'Adult'].map(ageGroup => (
                                        <label key={ageGroup} className="flex items-center cursor-pointer">
                                            <input
                                                type="radio"
                                                name="ageGroup"
                                                value={ageGroup}
                                                checked={filters.ageGroup === ageGroup}
                                                onChange={(e) => handleFilterChange('ageGroup', e.target.value)}
                                                className="mr-2 text-red-600"
                                            />
                                            {ageGroup === 'Teenager' && 'Teenager (13-18)'}
                                            {ageGroup === 'Young Adult' && 'Young Adult (19-25)'}
                                            {ageGroup === 'Adult' && 'Adult (Parents, Teachers)'}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Course Stats */}
                            <div className="bg-white p-4 rounded-lg border border-red-100">
                                <h4 className="font-medium text-red-700 mb-2">Statistics</h4>
                                <p className="text-sm text-gray-600">
                                    Total courses: <span className="font-semibold">{coursesData.length}</span>
                                </p>
                                <p className="text-sm text-gray-600">
                                    Showing: <span className="font-semibold">{filteredCourses.length}</span>
                                </p>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="w-full lg:flex-1">
                            {currentCourses.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="text-gray-400 text-6xl mb-4">📚</div>
                                    <h3 className="text-xl font-semibold text-gray-600 mb-2">
                                        No courses found
                                    </h3>
                                    <p className="text-gray-500">
                                        Try changing your filters or search keywords
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                        {currentCourses.map(course => (
                                            <div key={course.id || course._id} className="bg-white border border-red-100 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                                                <div className="relative">
                                                    <img
                                                        src={course.image}
                                                        alt={course.title || course.course_name}
                                                        className="h-48 w-full object-cover"
                                                        onError={(e) => {
                                                            e.target.src = `https://source.unsplash.com/400x300/?education,training`;
                                                        }}
                                                    />
                                                    <div className="absolute top-3 right-3">
                                                        <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full">
                                                            {course.category || course.age_group || 'Free'}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="p-5">
                                                    <h3 className="text-lg font-semibold text-red-700 mb-3 line-clamp-2">
                                                        {course.title || course.course_name}
                                                    </h3>
                                                    <div className="text-sm text-gray-600 mb-4 space-y-1">
                                                        <div className="flex items-center">
                                                            <span>⭐</span>
                                                            <span className="ml-1">{course.rating || '4.5'}</span>
                                                            <span className="mx-2">•</span>
                                                            <span>👥 {course.students || '1k+'}</span>
                                                        </div>
                                                        <div className="flex items-center">
                                                            <span>⏱</span>
                                                            <span className="ml-1">{course.duration || 'Flexible'}</span>
                                                            <span className="mx-2">•</span>
                                                            <span>📊 {course.level || 'All levels'}</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-red-600 font-bold text-lg">
                                                            {course.price || 'Free'}
                                                        </span>
                                                        <button
                                                            onClick={() => handleViewCourse(course.course_id, course.version)}
                                                            className="text-sm text-white bg-red-600 hover:bg-red-700 px-4 py-2     rounded-lg transition-colors duration-200 font-medium"
                                                        >
                                                            View Details
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Pagination */}
                                    {totalPages > 1 && (
                                        <div className="mt-12 flex justify-center">
                                            <div className="flex items-center gap-2">
                                                {/* Previous button */}
                                                <button
                                                    onClick={() => paginate(currentPage - 1)}
                                                    disabled={currentPage === 1}
                                                    className={`px-3 py-2 rounded-lg ${currentPage === 1
                                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                        : 'bg-red-100 text-red-600 hover:bg-red-200'
                                                        }`}
                                                >
                                                    ← Previous
                                                </button>

                                                {/* Page numbers */}
                                                {[...Array(totalPages)].map((_, index) => {
                                                    const pageNumber = index + 1;
                                                    if (
                                                        pageNumber === 1 ||
                                                        pageNumber === totalPages ||
                                                        (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                                                    ) {
                                                        return (
                                                            <button
                                                                key={pageNumber}
                                                                onClick={() => paginate(pageNumber)}
                                                                className={`w-10 h-10 rounded-lg ${currentPage === pageNumber
                                                                    ? 'bg-red-600 text-white'
                                                                    : 'bg-red-100 text-red-600 hover:bg-red-200'
                                                                    }`}
                                                            >
                                                                {pageNumber}
                                                            </button>
                                                        );
                                                    } else if (
                                                        pageNumber === currentPage - 2 ||
                                                        pageNumber === currentPage + 2
                                                    ) {
                                                        return <span key={pageNumber} className="px-2 text-gray-400">...</span>;
                                                    }
                                                    return null;
                                                })}

                                                {/* Next button */}
                                                <button
                                                    onClick={() => paginate(currentPage + 1)}
                                                    disabled={currentPage === totalPages}
                                                    className={`px-3 py-2 rounded-lg ${currentPage === totalPages
                                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                        : 'bg-red-100 text-red-600 hover:bg-red-200'
                                                        }`}
                                                >
                                                    Next →
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer/>
        </>
    );
}

export default Courses;