import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import Navbar from '../../components/Navbar/Navbar';
import { set } from 'mongoose';

function CourseDetail() {
    const location = useLocation();
    const course_name = location.course_name;
    const course_version = location.state.course_version;
    const { course_id } = useParams()
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [enrolling, setEnrolling] = useState(false);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');
    const uid = JSON.parse(localStorage.getItem('user')).user_id;
    const [isCompleted, setIsCompleted] = useState(false);

    // Fetch course details
    useEffect(() => {
        const fetchCourseDetail = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`http://localhost:3000/api/course/get-course-by-name/${course_name}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setCourse(response.data);

                // Check if user is already enrolled
                await checkEnrollmentStatus(course_id, course_version);
            } catch (err) {
                console.error("Course detail API error:", err);
                Swal.fire({
                    icon: 'error',
                    title: 'Error Loading Course',
                    text: 'Course not found or an error occurred.',
                    confirmButtonColor: '#dc2626'
                }).then(() => {
                    navigate('/courses');
                });
            } finally {
                setLoading(false);
            }
        };

        fetchCourseDetail();
    }, []);

    // Check enrollment status
    const checkEnrollmentStatus = async (course_id, course_version) => {
        try {
            const response = await axios.get(`http://localhost:3000/api/course/check-enrollment-course/${uid}/${course_id}/${course_version}`
            );
            console.log('du lieu response:', response)
            setIsEnrolled(response.data.isEnrolled || false);
            setIsCompleted(response.data.status === 'completed' || false);

        } catch (err) {
            console.error("Enrollment check error:", err);
        }
    };

    // Handle course enrollment
    const handleEnroll = async (course_id, course_version) => {
        try {
            setEnrolling(true);
            const response = await axios.get(
                `http://localhost:3000/api/course/enroll-course/${uid}/${course_id}/${course_version}`
            );

            if (response.status === 200 || response.status === 201) {
                setIsEnrolled(true);
                Swal.fire({
                    icon: 'success',
                    title: 'Enrollment Successful!',
                    text: 'You have successfully enrolled in this course.',
                    confirmButtonColor: '#dc2626'
                });
            }
        } catch (err) {
            console.error("Enrollment error:", err);
            Swal.fire({
                icon: 'error',
                title: 'Enrollment Failed',
                text: err.response?.data?.message || 'An error occurred during enrollment.',
                confirmButtonColor: '#dc2626'
            });
        } finally {
            setEnrolling(false);
        }
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="bg-white min-h-screen py-12">
                    <div className="container mx-auto px-4">
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
                            <span className="ml-3 text-gray-600">Đang tải chi tiết khóa học...</span>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    if (!course) {
        return (
            <>
                <Navbar />
                <div className="bg-white min-h-screen py-12">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-2xl font-bold text-gray-600 mb-4">Course Not Found</h2>
                        <button
                            onClick={() => navigate('/courses')}
                            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
                        >
                            Back to Courses
                        </button>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="bg-white min-h-screen">
                {/* Hero Section */}
                <div className="bg-gradient-to-r from-red-600 to-red-800 text-white py-16">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto">
                            <div className="flex flex-col lg:flex-row gap-8 items-start">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-4">
                                        <span className="bg-red-500 text-white text-sm px-3 py-1 rounded-full">
                                            {course.category || course.age_group || 'Anti-Drug Training'}
                                        </span>
                                        <div className="flex items-center text-yellow-400">
                                            <span>⭐</span>
                                            <span className="ml-1">{course.rating || '4.5'}</span>
                                            <span className="ml-2 text-red-200">({course.reviews || '1,234'} reviews)</span>
                                        </div>
                                    </div>
                                    <h1 className="text-4xl font-bold mb-4">
                                        {course.title || course.course_name}
                                    </h1>
                                    <p className="text-red-100 text-lg mb-6 leading-relaxed">
                                        {course.description || 'Comprehensive anti-drug training program designed to educate and prevent substance abuse through evidence-based approaches and interactive learning.'}
                                    </p>
                                    <div className="flex flex-wrap gap-6 text-sm">
                                        <div className="flex items-center">
                                            <span className="mr-2">👥</span>
                                            <span>{course.students || '2,150'} students enrolled</span>
                                        </div>
                                        <div className="flex items-center">
                                            <span className="mr-2">⏱</span>
                                            <span>{course.duration || '6 weeks'} duration</span>
                                        </div>
                                        <div className="flex items-center">
                                            <span className="mr-2">📊</span>
                                            <span>{course.level || 'All levels'}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <span className="mr-2">🌐</span>
                                            <span>Online + Offline</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Course Card */}
                                {console.log("isCompleted>>>>>>>>>>>>>", isCompleted)}
                                <div className="w-full lg:w-80 bg-white rounded-xl shadow-2xl overflow-hidden">
                                    <img
                                        src={course.image}
                                        alt={course.title || course.course_name}
                                        className="w-full h-48 object-cover"
                                        onError={(e) => {
                                            e.target.src = `https://source.unsplash.com/400x250/?education,training`;
                                        }}
                                    />
                                    <div className="p-6">
                                        <div className="text-center mb-6">
                                            <span className="text-3xl font-bold text-red-600">
                                                {course.price || 'Free'}
                                            </span>
                                            {course.original_price && (
                                                <span className="text-gray-500 line-through ml-2">
                                                    ${course.original_price}
                                                </span>
                                            )}
                                        </div>

                                        {isCompleted ? (

                                            <button
                                                className="w-full bg-gray-400 text-white py-3 rounded-lg font-semibold cursor-not-allowed"
                                                disabled
                                            >
                                                Course Completed
                                            </button>
                                        ) : isEnrolled ? (
                                            <button
                                                onClick={() => navigate(`/learning/${course_id}`)}
                                                className={`w-full py-3 rounded-lg font-semibold transition-colors duration-200 ${(course?.status === 'completed' || isCompleted)
                                                    ? 'bg-green-500 text-white cursor-default'
                                                    : 'bg-green-600 text-white hover:bg-green-700'
                                                    }`}
                                                disabled={course?.status === 'completed' || isCompleted}
                                            >
                                                {(course?.status === 'completed' || isCompleted) ? 'Completed' : 'Continue Learning'}
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleEnroll(course_id, course_version)}
                                                disabled={enrolling}
                                                className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 disabled:bg-red-400 transition-colors duration-200 flex items-center justify-center"
                                            >
                                                {enrolling ? (
                                                    <>
                                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                        Enrolling...
                                                    </>
                                                ) : (
                                                    'Enroll Now'
                                                )}
                                            </button>
                                        )}

                                        <div className="mt-4 text-sm text-gray-600 space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span>✅ Lifetime access</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span>📱 Mobile friendly</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span>🏆 Certificate included</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span>💬 Community support</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Tabs */}
                <div className="container mx-auto px-4 py-12">
                    <div className="max-w-4xl mx-auto">
                        {/* Tab Navigation */}
                        <div className="flex border-b border-gray-200 mb-8">
                            {[
                                { id: 'overview', label: 'Overview', icon: '📋' },
                                { id: 'instructor', label: 'Instructor', icon: '👨‍🏫' },
                                { id: 'reviews', label: 'Reviews', icon: '⭐' }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center px-6 py-3 font-medium transition-colors duration-200 ${activeTab === tab.id
                                        ? 'text-red-600 border-b-2 border-red-600'
                                        : 'text-gray-600 hover:text-red-600'
                                        }`}
                                >
                                    <span className="mr-2">{tab.icon}</span>
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Tab Content */}
                        <div className="bg-white">
                            {/* Overview Tab */}
                            {activeTab === 'overview' && (
                                <div className="space-y-8">
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-800 mb-4">About This Course</h2>
                                        <div className="prose prose-lg text-gray-600 leading-relaxed">
                                            <p>
                                                {course.description || 'This comprehensive anti-drug training course is designed to provide participants with essential knowledge and practical skills to understand, prevent, and address substance abuse issues. Through interactive lessons, real-world case studies, and evidence-based strategies, learners will gain the tools needed to make informed decisions and help others in their community.'}
                                            </p>
                                            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">What You'll Learn</h3>
                                            <ul className="list-disc list-inside space-y-2 text-gray-600">
                                                <li>Understanding different types of drugs and their effects on the body and mind</li>
                                                <li>Recognizing signs and symptoms of substance abuse</li>
                                                <li>Evidence-based prevention strategies and intervention techniques</li>
                                                <li>Building support systems and communication skills</li>
                                                <li>Legal and ethical considerations in drug prevention</li>
                                                <li>Community resources and referral pathways</li>
                                            </ul>
                                            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Prerequisites</h3>
                                            <p>No prior experience required. This course is suitable for educators, parents, community leaders, and anyone interested in drug prevention and awareness.</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Instructor Tab */}
                            {activeTab === 'instructor' && (
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Meet Your Instructor</h2>
                                    <div className="flex items-start space-x-6">
                                        <img
                                            src={course.instructor_image || `https://source.unsplash.com/150x150/?professional,teacher`}
                                            alt="Instructor"
                                            className="w-24 h-24 rounded-full object-cover"
                                        />
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-800">
                                                {course.instructor || 'Dr. Sarah Johnson'}
                                            </h3>
                                            <p className="text-red-600 font-medium mb-4">
                                                Substance Abuse Prevention Specialist
                                            </p>
                                            <p className="text-gray-600 leading-relaxed">
                                                {course.instructor_bio || 'Dr. Johnson has over 15 years of experience in substance abuse prevention and treatment. She holds a Ph.D. in Psychology and has worked with various community organizations to develop effective drug prevention programs. Her research focuses on evidence-based intervention strategies and community-based prevention approaches.'}
                                            </p>
                                            <div className="mt-4 flex items-center text-sm text-gray-600">
                                                <span className="mr-6">⭐ 4.9 instructor rating</span>
                                                <span className="mr-6">👥 12,000+ students taught</span>
                                                <span>🏆 25+ courses</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Reviews Tab */}
                            {activeTab === 'reviews' && (
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Student Reviews</h2>
                                    <div className="mb-8">
                                        <div className="flex items-center mb-4">
                                            <span className="text-4xl font-bold text-red-600 mr-4">
                                                {course.rating || '4.5'}
                                            </span>
                                            <div>
                                                <div className="flex text-yellow-400 text-xl mb-1">
                                                    ⭐⭐⭐⭐⭐
                                                </div>
                                                <p className="text-gray-600">Based on {course.reviews || '1,234'} reviews</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        {/* Sample reviews */}
                                        {[
                                            {
                                                name: 'Emily Chen',
                                                rating: 5,
                                                date: '2 weeks ago',
                                                comment: 'Excellent course! Very informative and practical. The interactive elements made learning engaging and memorable.'
                                            },
                                            {
                                                name: 'Michael Rodriguez',
                                                rating: 5,
                                                date: '1 month ago',
                                                comment: 'As a teacher, this course provided me with valuable tools to help my students. Highly recommended for educators.'
                                            },
                                            {
                                                name: 'Lisa Thompson',
                                                rating: 4,
                                                date: '2 months ago',
                                                comment: 'Great content and well-structured. The instructor is knowledgeable and presents complex topics in an easy-to-understand way.'
                                            }
                                        ].map((review, index) => (
                                            <div key={index} className="border-b border-gray-200 pb-6">
                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="flex items-center">
                                                        <img
                                                            src={`https://source.unsplash.com/40x40/?person,portrait&${index}`}
                                                            alt={review.name}
                                                            className="w-10 h-10 rounded-full object-cover mr-3"
                                                        />
                                                        <div>
                                                            <h4 className="font-semibold text-gray-800">{review.name}</h4>
                                                            <div className="flex items-center">
                                                                <div className="flex text-yellow-400 text-sm mr-2">
                                                                    {'⭐'.repeat(review.rating)}
                                                                </div>
                                                                <span className="text-gray-500 text-sm">{review.date}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <p className="text-gray-600 leading-relaxed">{review.comment}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default CourseDetail;