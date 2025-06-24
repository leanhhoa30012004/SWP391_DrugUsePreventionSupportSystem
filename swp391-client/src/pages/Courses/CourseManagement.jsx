import React, { useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import logoWehope from '../../assets/logo-Wehope.png';

function Courses() {
    const [filters, setFilters] = useState({
        ageGroup: '',
        category: ''
    });

    const coursesData = [
        {
            id: 1,
            title: "Drug Awareness for Teenagers",
            image: "https://source.unsplash.com/400x300/?school,awareness",
            rating: 4.7,
            students: "12k",
            level: "Beginner",
            duration: "5 hours",
            price: "Free",
            category: "Teenager"
        },
        {
            id: 2,
            title: "Life Skills & Refusal Techniques",
            image: "https://source.unsplash.com/400x300/?education,skills",
            rating: 4.8,
            students: "9k",
            level: "All levels",
            duration: "6 hours",
            price: "Free",
            category: "Young Adult"
        },
        {
            id: 3,
            title: "Parenting & Drug Prevention",
            image: "https://source.unsplash.com/400x300/?parenting,training",
            rating: 4.6,
            students: "5k",
            level: "Intermediate",
            duration: "8 hours",
            price: "Free",
            category: "Adult"
        },
    ];

    return (
        <>
            <Navbar />
            <div className="bg-white min-h-screen py-12">
                <div className="container mx-auto px-4">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-3xl font-bold text-red-600">Anti-Drug Training Courses</h1>
                        <p className="text-gray-600 mt-2">Choose the right course based on your age and needs</p>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Sidebar Filters */}
                        <div className="w-full lg:w-1/4 bg-red-50 border border-red-200 p-6 rounded-lg shadow-md">
                            <h2 className="text-xl font-semibold mb-4 text-red-700">Filters</h2>

                            {/* Age Group */}
                            <div className="mb-6">
                                <h3 className="text-red-600 font-medium mb-2">Age Group</h3>
                                <div className="space-y-2 text-sm text-gray-700">
                                    <label className="flex items-center">
                                        <input type="checkbox" className="mr-2" />
                                        Teenager (13-18)
                                    </label>
                                    <label className="flex items-center">
                                        <input type="checkbox" className="mr-2" />
                                        Young Adult (19-25)
                                    </label>
                                    <label className="flex items-center">
                                        <input type="checkbox" className="mr-2" />
                                        Adult (Parents, Teachers)
                                    </label>
                                </div>
                            </div>

                            {/* Category Filter */}
                            <div>
                                <h3 className="text-red-600 font-medium mb-2">Course Topics</h3>
                                <div className="space-y-2 text-sm text-gray-700">
                                    <label className="flex items-center">
                                        <input type="checkbox" className="mr-2" />
                                        Drug Awareness
                                    </label>
                                    <label className="flex items-center">
                                        <input type="checkbox" className="mr-2" />
                                        Refusal Skills
                                    </label>
                                    <label className="flex items-center">
                                        <input type="checkbox" className="mr-2" />
                                        Mental Support
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="w-full lg:flex-1">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {coursesData.map(course => (
                                    <div key={course.id} className="bg-white border border-red-100 rounded-lg shadow-md overflow-hidden">
                                        <img src={course.image} alt={course.title} className="h-48 w-full object-cover" />
                                        <div className="p-4">
                                            <h3 className="text-lg font-semibold text-red-700 mb-2">{course.title}</h3>
                                            <div className="text-sm text-gray-600 mb-3">
                                                ⭐ {course.rating} / 👥 {course.students} / ⏱ {course.duration}
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-red-600 font-bold">{course.price}</span>
                                                <button className="text-sm text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded">
                                                    View Course
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination */}
                            <div className="mt-10 flex justify-center gap-2">
                                <button className="w-8 h-8 bg-red-600 text-white rounded-full">1</button>
                                <button className="w-8 h-8 bg-red-100 text-red-600 rounded-full">2</button>
                                <button className="w-8 h-8 bg-red-100 text-red-600 rounded-full">3</button>
                                <span className="px-2 text-gray-400">...</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Courses;
