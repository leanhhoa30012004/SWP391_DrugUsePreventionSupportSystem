import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import Navbar from '../../components/Navbar/Navbar';


function CourseDetail() {
    const location = useLocation();
    const course_name = location.state?.course_name;
    console.log("course_name:", course_name);
    const course_version = parseFloat(location?.state?.enroll_version || "1.0");
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
                {/* Hero Section with Image Background */}
                <div className="relative min-h-[80vh] flex items-center">
                    {/* Background Image */}
                    <div
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat backdrop-blur-md"
                        style={{
                            backgroundImage: `url(${'https://i.pinimg.com/736x/df/e8/26/dfe8263d1adbf192a3f9d6572a875020.jpg'})`,
                        }}
                    >
                        {/* Dark overlay for better text readability */}
                        <div className="absolute inset-0 bg-opacity-60 backdrop-blur-sm"></div>
                    </div>

                    <div className="relative z-10 container mx-auto px-4 py-16">
                        <div className="max-w-6xl mx-auto">
                            <div className="grid lg:grid-cols-3 gap-12 items-start">
                                {/* Course Info - Takes 2 columns */}
                                <div className="lg:col-span-2 text-white">
                                    <div className="flex items-center gap-3 mb-6">
                                        <span className="bg-red-600 text-white text-sm px-4 py-2 rounded-full font-medium">
                                            {course.category || course.age_group || 'Anti-Drug Training'}
                                        </span>
                                        <div className="flex items-center text-yellow-400 bg-black bg-opacity-30 px-3 py-1 rounded-full">
                                            <span>⭐</span>
                                            <span className="ml-1 font-semibold">{course.rating || '4.5'}</span>
                                            <span className="ml-2 text-white opacity-80 text-sm">({course.reviews || '1,234'} reviews)</span>
                                        </div>
                                    </div>

                                    <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                                        {course_name}
                                    </h1>
                                    <p className="text-xl text-gray-200 mb-8 leading-relaxed max-w-3xl">
                                        {course.description || 'Comprehensive anti-drug training program designed to educate and prevent substance abuse through evidence-based approaches and interactive learning.'}
                                    </p>
                                    <div className="flex flex-wrap gap-8 text-lg font-medium mt-6">
                                        <div className="flex items-center gap-2">
                                            <span>👥</span>
                                            <span>{course.students || '2,150'} students</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span>⏱</span>
                                            <span>{course.duration || '6 weeks'}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span>📊</span>
                                            <span>{course.level || 'All levels'}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span>🌐</span>
                                            <span>Online + Offline</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Course Card - Takes 1 column */}
                                {console.log("isCompleted>>>>>>>>>>>>>", isCompleted)}
                                <div className="lg:col-span-1">
                                    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden backdrop-blur-sm bg-opacity-95">
                                        <div className="aspect-video relative overflow-hidden">

                                            <div className="absolute inset-0 bg-gradient-to-t from-gray-400 via-transparent to-transparent flex items-center justify-center">
                                                <img
                                                    src="https://i.pinimg.com/1200x/33/fe/4f/33fe4feb099764b201a6128d465a8c56.jpg"
                                                    alt="Play Button"
                                                    className="w-16 h-16 bg-white bg-opacity-90 rounded-full p-4 transition-all duration-200 cursor-pointer"
                                                />
                                            </div>
                                        </div>

                                        <div className="p-6">
                                            <div className="text-center mb-6">
                                                <span className="text-4xl font-bold text-red-600">
                                                    {course.price || 'Free'}
                                                </span>
                                                {course.original_price && (
                                                    <span className="text-gray-500 line-through ml-2 text-lg">
                                                        ${course.original_price}
                                                    </span>
                                                )}
                                            </div>

                                            {isCompleted ? (
                                                <button
                                                    onClick={() => navigate(`/course-history/${course_id}`)}
                                                    className="w-full bg-gray-400 text-green-800 py-4 rounded-xl font-semibold hover:bg-red-300 transition-colors duration-200 flex items-center justify-center mb-4"
                                                >
                                                    <span className="mr-2"></span>
                                                    Course Completed & Review
                                                </button>
                                            ) : isEnrolled ? (
                                                <button
                                                    onClick={() => navigate(`/learning/${course_id}`)}
                                                    className="w-full py-4 rounded-xl font-semibold transition-all duration-200 bg-green-600 text-white hover:bg-green-700 hover:shadow-lg mb-4"
                                                >
                                                    Continue Learning →
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleEnroll(course_id, course_version)}
                                                    disabled={enrolling}
                                                    className="w-full bg-red-600 text-white py-4 rounded-xl font-semibold hover:bg-red-700 disabled:bg-red-400 transition-all duration-200 flex items-center justify-center hover:shadow-lg mb-4"
                                                >
                                                    {enrolling ? (
                                                        <>
                                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                                            Enrolling...
                                                        </>
                                                    ) : (
                                                        'Enroll Now'
                                                    )}
                                                </button>
                                            )}

                                            <div className="space-y-3 text-sm text-gray-600">
                                                <div className="flex items-center">
                                                    <span className="mr-3 text-green-500">✅</span>
                                                    <span>Lifetime access</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <span className="mr-3 text-blue-500">📱</span>
                                                    <span>Mobile friendly</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <span className="mr-3 text-yellow-500">🏆</span>
                                                    <span>Certificate included</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <span className="mr-3 text-purple-500">💬</span>
                                                    <span>Community support</span>
                                                </div>
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