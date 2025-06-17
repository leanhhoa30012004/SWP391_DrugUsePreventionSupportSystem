import React, { useState } from 'react'
import Navbar from '../../components/Navbar/Navbar';
import logoWehope from '../../assets/logo-Wehope.png';
import Footer from '../../components/Footer/Footer';

function Courses() {
    const [filters, setFilters] = useState({
        age: '',
        courses: ''
    });

    // Thêm state cho pagination
    const [currentPage, setCurrentPage] = useState(1);
    const coursesPerPage = 4; // Hiển thị 4 courses mỗi trang

    const coursesData = [
        {
            id: 1,
            title: "Create An LMS Website With LearnDash",
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxuBzSwf22uJ86aFTaTDLJp_mwUZlaYRwkZg&s",
            rating: 4.5,
            students: "15k Students",
            lessons: "All levels",
            duration: "10 Hours",
            price: " $20.0 Free",
            category: "Development"
        },
        {
            id: 2,
            title: "Create An LMS Website With LearnDash",
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7iRS6H9nmM7X4ka4CDBM0rRThtPFYcbkNYQ&s",
            rating: 4.5,
            students: "15k Students",
            lessons: "All levels",
            duration: "10 Hours",
            price: "$20.0 Free",
            category: "Photoshop"
        },
        {
            id: 3,
            title: "Create An LMS Website With LearnDash",
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpFOJvu177YOokqky6zb7e1k2B4iZ3atOuMg&s",
            rating: 4.5,
            students: "15k Students",
            lessons: "All levels",
            duration: "10 Hours",
            price: "$20.0 Free",
            category: "Development"
        },
        {
            id: 4,
            title: "Create An LMS Website With LearnDash",
            image: "https://www.train4academy.co.uk/img/alcohol-and-drug-awareness-course/alcohol-and-drug-awareness-training-online1.jpg",
            rating: 4.5,
            students: "15k Students",
            lessons: "All levels",
            duration: "10 Hours",
            price: "$20.0 Free",
            category: "Development"
        },
        {
            id: 5,
            title: "Create An LMS Website With LearnDash",
            image: "https://t4.ftcdn.net/jpg/04/10/78/23/360_F_410782386_wRjZM340f2erGZjuMKZzcsuKDUUiQ2ZD.jpg",
            rating: 4.5,
            students: "15k Students",
            lessons: "All levels",
            duration: "10 Hours",
            price: "$20.0 Free",
            category: "Personal Fitness"
        },
        {
            id: 6,
            title: "Create An LMS Website With LearnDash",
            image: "https://static.vecteezy.com/system/resources/previews/025/681/132/non_2x/say-no-to-drug-for-health-and-welfare-background-vector.jpg",
            rating: 4.5,
            students: "15k Students",
            lessons: "All levels",
            duration: "10 Hours",
            price: "$20.0 Free",
            category: "Personal Fitness"
        }
    ];

    // Tính toán pagination
    const totalPages = Math.ceil(coursesData.length / coursesPerPage);
    const indexOfLastCourse = currentPage * coursesPerPage;
    const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
    const currentCourses = coursesData.slice(indexOfFirstCourse, indexOfLastCourse);

    // Hàm chuyển trang
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handlePrevious = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <>
            <Navbar />
            <div className="courses-container bg-pink-50 min-h-screen">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex gap-8">
                        {/* Sidebar Filters */}
                        <div className="w-1/4 bg-white p-6 rounded-lg shadow-sm h-fit">
                            <h3 className="font-semibold text-lg mb-4">Filters</h3>

                            {/* Age Filter */}
                            <div className="mb-6">
                                <h4 className="font-medium mb-3">Age</h4>
                                <div className="space-y-2">
                                    <label className="flex items-center">
                                        <input type="checkbox" className="mr-2" />
                                        <span className="text-sm">18-25</span>
                                    </label>
                                    <label className="flex items-center">
                                        <input type="checkbox" className="mr-2" />
                                        <span className="text-sm">26-35</span>
                                    </label>
                                </div>
                            </div>

                            {/* Courses Filter */}
                            <div>
                                <h4 className="font-medium mb-3">Courses</h4>
                                <div className="space-y-2">
                                    <label className="flex items-center">
                                        <input type="checkbox" className="mr-2" />
                                        <span className="text-sm">Drug Awareness</span>
                                    </label>
                                    <label className="flex items-center">
                                        <input type="checkbox" className="mr-2" />
                                        <span className="text-sm">Prevention</span>
                                    </label>
                                    <label className="flex items-center">
                                        <input type="checkbox" className="mr-2" />
                                        <span className="text-sm">Life skills</span>
                                    </label>
                                    <label className="flex items-center">
                                        <input type="checkbox" className="mr-2" />
                                        <span className="text-sm">Support</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="flex-1">
                            {/* Header */}
                            <div className="flex justify-between items-center mb-6">
                                <h1 className="text-2xl font-bold">All Courses</h1>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        placeholder="Search courses..."
                                        className="px-4 py-2 border rounded-lg"
                                    />
                                    <span className="text-gray-600 cursor-pointer text-lg">☰</span>
                                </div>
                            </div>

                            {/* Course Grid - Hiển thị theo trang */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                {currentCourses.map((course) => (
                                    <div key={course.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                                        <div className="relative">
                                            <img
                                                src={course.image}
                                                alt={course.title}
                                                className="w-full h-64 object-contain bg-gray-50"
                                                onError={(e) => {
                                                    e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
                                                }}
                                            />
                                            <span className="absolute top-3 right-3 bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold">
                                                ID: {course.id}
                                            </span>
                                            <span className="absolute top-3 left-3 bg-black text-white px-2 py-1 rounded text-xs">
                                                {course.category}
                                            </span>
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-semibold text-lg mb-2">
                                                {course.title}
                                            </h3>
                                            <div className="flex items-center mb-3">
                                                <div className="flex items-center mr-4">
                                                    <span className="text-yellow-500">⭐</span>
                                                    <span className="text-sm ml-1">{course.rating}</span>
                                                </div>
                                                <span className="text-sm text-gray-600">{course.students}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm text-gray-600 mb-3">
                                                <span>📚 {course.lessons}</span>
                                                <span>🕒 {course.duration}</span>
                                                <span>👥 {course.students}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-lg font-bold text-red-500">{course.price}</span>
                                                <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200">
                                                    View More
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination giống như trong ảnh */}
                            <div className="flex flex-col items-center space-y-4 mb-8">
                                {/* Pagination Buttons */}
                                <div className="flex items-center space-x-2">
                                    {/* Previous Button */}
                                    <button
                                        onClick={handlePrevious}
                                        disabled={currentPage === 1}
                                        className={`px-3 py-2 text-sm font-medium border rounded-lg flex items-center ${currentPage === 1
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
                                            : 'bg-white text-gray-600 hover:bg-gray-50 border-gray-300'
                                            }`}
                                    >
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                        </svg>
                                        Previous
                                    </button>

                                    {/* Page Numbers */}
                                    {Array.from({ length: totalPages }, (_, index) => {
                                        const pageNumber = index + 1;
                                        return (
                                            <button
                                                key={pageNumber}
                                                onClick={() => handlePageChange(pageNumber)}
                                                className={`px-3 py-2 text-sm font-medium border rounded-lg min-w-[40px] ${currentPage === pageNumber
                                                    ? 'bg-red-500 text-white border-red-500'
                                                    : 'bg-white text-gray-600 hover:bg-gray-50 border-gray-300'
                                                    }`}
                                            >
                                                {pageNumber}
                                            </button>
                                        );
                                    })}

                                    {/* Next Button */}
                                    <button
                                        onClick={handleNext}
                                        disabled={currentPage === totalPages}
                                        className={`px-3 py-2 text-sm font-medium border rounded-lg flex items-center ${currentPage === totalPages
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
                                            : 'bg-white text-gray-600 hover:bg-gray-50 border-gray-300'
                                            }`}
                                    >
                                        Next
                                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </div>

                                {/* Results Info */}
                                <div className="text-sm text-gray-600">
                                    Showing {indexOfFirstCourse + 1} to {Math.min(indexOfLastCourse, coursesData.length)} of {coursesData.length} results
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    )
}

export default Courses