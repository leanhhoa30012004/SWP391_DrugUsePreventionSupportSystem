import React, { useState } from 'react'
import { FaSearch, FaFilter, FaStar, FaUsers, FaClock, FaBookOpen, FaPlay, FaHeart, FaShare, FaArrowLeft, FaArrowRight, FaGraduationCap, FaAward, FaChevronDown, FaChild, FaDollarSign } from 'react-icons/fa';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';

function Courses() {
    const [currentPage, setCurrentPage] = useState(1);
    const [viewMode, setViewMode] = useState('grid');
    const [sortBy, setSortBy] = useState('popular');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedAge, setSelectedAge] = useState('All');
    const [selectedLevel, setSelectedLevel] = useState('All');
    const [selectedPrice, setSelectedPrice] = useState('All');
    const coursesPerPage = 6;

    const coursesData = [
        {
            id: 1,
            title: "Drug Prevention for Teenagers",
            image: "https://uploads.heightsplatform.com/program/public/blogarticle/602/cover_image/original-04814f76e2e035a6a98528da9eff36c1.png",
            rating: 4.8,
            students: 1250,
            lessons: 12,
            duration: "8 hours",
            price: "Free",
            instructor: "Dr. Nguyen Van An",
            category: "Prevention",
            level: "Beginner",
            ageGroup: "Teenagers",
            description: "Comprehensive course providing basic knowledge about drug harm and effective prevention methods.",
            tags: ["Teenagers", "Prevention", "Social Issues"],
            featured: true,
            progress: 0
        },
        {
            id: 2,
            title: "Applied Psychology in Addiction Treatment",
            image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=300&q=80",
            rating: 4.9,
            students: 890,
            lessons: 16,
            duration: "12 hours",
            price: "$299",
            instructor: "MS. Tran Thi Bich",
            category: "Psychology",
            level: "Advanced",
            ageGroup: "Adults",
            description: "Modern psychological methods for supporting addiction treatment and recovery processes.",
            tags: ["Psychology", "Treatment", "Recovery"],
            featured: false,
            progress: 35
        },
        {
            id: 3,
            title: "Life Skills and Family Drug Prevention",
            image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=300&q=80",
            rating: 4.7,
            students: 2100,
            lessons: 10,
            duration: "6 hours",
            price: "Free",
            instructor: "Prof. Le Van Cuong",
            category: "Family",
            level: "Beginner",
            ageGroup: "Adults",
            description: "Guide families to build safe environments and recognize signs of addiction.",
            tags: ["Family", "Life Skills", "Safety"],
            featured: true,
            progress: 0
        },
        {
            id: 4,
            title: "Psychological Support for Recovering Addicts",
            image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=300&q=80",
            rating: 4.6,
            students: 675,
            lessons: 14,
            duration: "10 hours",
            price: "$199",
            instructor: "Dr. Hoang Minh Tuan",
            category: "Support",
            level: "Intermediate",
            ageGroup: "Adults",
            description: "Professional psychological support methods for effective addiction recovery processes.",
            tags: ["Support", "Recovery", "Psychology"],
            featured: false,
            progress: 60
        },
        {
            id: 5,
            title: "Drug Prevention Education in Schools",
            image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=300&q=80",
            rating: 4.8,
            students: 1850,
            lessons: 8,
            duration: "5 hours",
            price: "Free",
            instructor: "Ms. Pham Thi Hong",
            category: "Education",
            level: "Beginner",
            ageGroup: "Children",
            description: "Comprehensive educational program about drug harm designed for students.",
            tags: ["Education", "School", "Students"],
            featured: true,
            progress: 0
        },
        {
            id: 6,
            title: "Functional Recovery After Addiction",
            image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=300&q=80",
            rating: 4.9,
            students: 420,
            lessons: 18,
            duration: "15 hours",
            price: "$499",
            instructor: "Dr. Do Van Hung",
            category: "Recovery",
            level: "Expert",
            ageGroup: "Adults",
            description: "Comprehensive functional recovery process after successful addiction treatment.",
            tags: ["Recovery", "Function", "Reintegration"],
            featured: false,
            progress: 0
        },
        {
            id: 7,
            title: "Advanced Social Issues Prevention",
            image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=300&q=80",
            rating: 4.7,
            students: 850,
            lessons: 15,
            duration: "10 hours",
            price: "$199",
            instructor: "Dr. Nguyen Thi Mai",
            category: "Prevention",
            level: "Advanced",
            ageGroup: "Teenagers",
            description: "Advanced course on modern strategies for preventing social issues.",
            tags: ["Advanced", "Strategy", "Prevention"],
            featured: false,
            progress: 0
        },
        {
            id: 8,
            title: "Family Counseling for Drug Addiction",
            image: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=300&q=80",
            rating: 4.5,
            students: 320,
            lessons: 12,
            duration: "8 hours",
            price: "$249",
            instructor: "MS. Hoang Thi Lan",
            category: "Family",
            level: "Intermediate",
            ageGroup: "Adults",
            description: "Support families in dealing with and helping children with drug problems.",
            tags: ["Family", "Counseling", "Support"],
            featured: false,
            progress: 0
        }
    ];

    // Calculate count for each filter
    const getCount = (filterType, value) => {
        if (value === 'All') return coursesData.length;

        switch (filterType) {
            case 'category':
                return coursesData.filter(course => course.category === value).length;
            case 'age':
                return coursesData.filter(course => course.ageGroup === value).length;
            case 'level':
                return coursesData.filter(course => course.level === value).length;
            case 'price':
                if (value === 'Free') {
                    return coursesData.filter(course => course.price === 'Free').length;
                } else {
                    return coursesData.filter(course => course.price !== 'Free').length;
                }
            default:
                return 0;
        }
    };

    // Filter options lists
    const categories = [
        { name: "All", count: getCount('category', 'All'), color: "bg-red-500" },
        { name: "Prevention", count: getCount('category', 'Prevention'), color: "bg-blue-500" },
        { name: "Psychology", count: getCount('category', 'Psychology'), color: "bg-purple-500" },
        { name: "Family", count: getCount('category', 'Family'), color: "bg-green-500" },
        { name: "Support", count: getCount('category', 'Support'), color: "bg-orange-500" },
        { name: "Education", count: getCount('category', 'Education'), color: "bg-indigo-500" },
        { name: "Recovery", count: getCount('category', 'Recovery'), color: "bg-pink-500" }
    ];

    const ageGroups = [
        { name: "All", count: getCount('age', 'All'), color: "bg-cyan-500" },
        { name: "Children", count: getCount('age', 'Children'), color: "bg-yellow-500" },
        { name: "Teenagers", count: getCount('age', 'Teenagers'), color: "bg-green-500" },
        { name: "Adults", count: getCount('age', 'Adults'), color: "bg-blue-500" }
    ];

    const levels = [
        { name: "All", count: getCount('level', 'All'), color: "bg-gray-500" },
        { name: "Beginner", count: getCount('level', 'Beginner'), color: "bg-green-500" },
        { name: "Intermediate", count: getCount('level', 'Intermediate'), color: "bg-yellow-500" },
        { name: "Advanced", count: getCount('level', 'Advanced'), color: "bg-orange-500" },
        { name: "Expert", count: getCount('level', 'Expert'), color: "bg-red-500" }
    ];

    const priceRanges = [
        { name: "All", count: getCount('price', 'All'), color: "bg-purple-500" },
        { name: "Free", count: getCount('price', 'Free'), color: "bg-green-500" },
        { name: "Paid", count: getCount('price', 'Paid'), color: "bg-blue-500" }
    ];

    // Filter logic
    const filteredCourses = coursesData.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.instructor.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
        const matchesAge = selectedAge === 'All' || course.ageGroup === selectedAge;
        const matchesLevel = selectedLevel === 'All' || course.level === selectedLevel;
        const matchesPrice = selectedPrice === 'All' ||
            (selectedPrice === 'Free' && course.price === 'Free') ||
            (selectedPrice === 'Paid' && course.price !== 'Free');

        return matchesSearch && matchesCategory && matchesAge && matchesLevel && matchesPrice;
    });

    // Reset page to 1 when filter changes
    React.useEffect(() => {
        setCurrentPage(1);
    }, [selectedCategory, selectedAge, selectedLevel, selectedPrice, searchTerm]);

    // Pagination
    const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);
    const indexOfLastCourse = currentPage * coursesPerPage;
    const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
    const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Filter click handlers
    const handleCategoryClick = (categoryName) => setSelectedCategory(categoryName);
    const handleAgeClick = (ageName) => setSelectedAge(ageName);
    const handleLevelClick = (levelName) => setSelectedLevel(levelName);
    const handlePriceClick = (priceName) => setSelectedPrice(priceName);

    const getLevelColor = (level) => {
        switch (level) {
            case 'Beginner': return 'bg-green-100 text-green-600';
            case 'Intermediate': return 'bg-yellow-100 text-yellow-600';
            case 'Advanced': return 'bg-orange-100 text-orange-600';
            case 'Expert': return 'bg-red-100 text-red-600';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    // Reset all filters function
    const resetAllFilters = () => {
        setSelectedCategory('All');
        setSelectedAge('All');
        setSelectedLevel('All');
        setSelectedPrice('All');
        setSearchTerm('');
    };

    return (
        <>
            <Navbar />

            {/* Hero Section with White Search */}
            <div className="bg-gradient-to-r from-red-500 via-red-600 to-pink-600 text-white">
                <div className="container mx-auto px-4 py-16">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            Drug Prevention & Social Issues Courses
                        </h1>
                        <p className="text-xl text-red-100 mb-8 max-w-3xl mx-auto">
                            Enhance awareness, provide knowledge and skills necessary to build healthy communities
                        </p>

                        {/* White Search Bar */}
                        <div className="max-w-2xl mx-auto relative">
                            <div className="relative">
                                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search courses, instructors..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 text-gray-800 text-lg rounded-full border-0 shadow-lg focus:outline-none focus:ring-4 focus:ring-white/30 bg-white"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-gray-50 min-h-screen">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex gap-8">
                        {/* Enhanced Sidebar with clickable filters */}
                        <div className="w-80 space-y-6">
                            {/* Reset Filters Button */}
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <button
                                    onClick={resetAllFilters}
                                    className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                                >
                                    Clear All Filters
                                </button>
                            </div>

                            {/* Categories */}
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <h3 className="font-bold text-lg mb-4 flex items-center">
                                    <FaFilter className="mr-2 text-red-500" />
                                    Course Categories
                                </h3>
                                <div className="space-y-3">
                                    {categories.map((category, index) => (
                                        <div
                                            key={index}
                                            onClick={() => handleCategoryClick(category.name)}
                                            className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-300 group ${selectedCategory === category.name
                                                ? 'bg-red-50 border-2 border-red-200 shadow-sm'
                                                : 'hover:bg-gray-50 border-2 border-transparent'
                                                }`}
                                        >
                                            <div className="flex items-center">
                                                <div className={`w-3 h-3 rounded-full ${category.color} mr-3 ${selectedCategory === category.name ? 'animate-pulse' : ''
                                                    }`}></div>
                                                <span className={`font-medium transition-colors ${selectedCategory === category.name
                                                    ? 'text-red-600 font-semibold'
                                                    : 'group-hover:text-red-500'
                                                    }`}>
                                                    {category.name}
                                                </span>
                                            </div>
                                            <span className={`text-sm px-2 py-1 rounded-full transition-colors ${selectedCategory === category.name
                                                ? 'bg-red-100 text-red-600 font-semibold'
                                                : 'text-gray-500 bg-gray-100'
                                                }`}>
                                                {category.count}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Age Groups */}
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <h3 className="font-bold text-lg mb-4 flex items-center">
                                    <FaChild className="mr-2 text-red-500" />
                                    Age Groups
                                </h3>
                                <div className="space-y-3">
                                    {ageGroups.map((age, index) => (
                                        <div
                                            key={index}
                                            onClick={() => handleAgeClick(age.name)}
                                            className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-300 group ${selectedAge === age.name
                                                ? 'bg-cyan-50 border-2 border-cyan-200 shadow-sm'
                                                : 'hover:bg-gray-50 border-2 border-transparent'
                                                }`}
                                        >
                                            <div className="flex items-center">
                                                <div className={`w-3 h-3 rounded-full ${age.color} mr-3 ${selectedAge === age.name ? 'animate-pulse' : ''
                                                    }`}></div>
                                                <span className={`font-medium transition-colors ${selectedAge === age.name
                                                    ? 'text-cyan-600 font-semibold'
                                                    : 'group-hover:text-cyan-500'
                                                    }`}>
                                                    {age.name}
                                                </span>
                                            </div>
                                            <span className={`text-sm px-2 py-1 rounded-full transition-colors ${selectedAge === age.name
                                                ? 'bg-cyan-100 text-cyan-600 font-semibold'
                                                : 'text-gray-500 bg-gray-100'
                                                }`}>
                                                {age.count}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Level Filter */}
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <h3 className="font-bold text-lg mb-4 flex items-center">
                                    <FaGraduationCap className="mr-2 text-red-500" />
                                    Difficulty Level
                                </h3>
                                <div className="space-y-3">
                                    {levels.map((level, index) => (
                                        <div
                                            key={index}
                                            onClick={() => handleLevelClick(level.name)}
                                            className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-300 group ${selectedLevel === level.name
                                                ? 'bg-gray-50 border-2 border-gray-200 shadow-sm'
                                                : 'hover:bg-gray-50 border-2 border-transparent'
                                                }`}
                                        >
                                            <div className="flex items-center">
                                                <div className={`w-3 h-3 rounded-full ${level.color} mr-3 ${selectedLevel === level.name ? 'animate-pulse' : ''
                                                    }`}></div>
                                                <span className={`font-medium transition-colors ${selectedLevel === level.name
                                                    ? 'text-gray-700 font-semibold'
                                                    : 'group-hover:text-gray-600'
                                                    }`}>
                                                    {level.name}
                                                </span>
                                            </div>
                                            <span className={`text-sm px-2 py-1 rounded-full transition-colors ${selectedLevel === level.name
                                                ? 'bg-gray-100 text-gray-700 font-semibold'
                                                : 'text-gray-500 bg-gray-100'
                                                }`}>
                                                {level.count}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Price Filter */}
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <h3 className="font-bold text-lg mb-4 flex items-center">
                                    <FaDollarSign className="mr-2 text-red-500" />
                                    Course Price
                                </h3>
                                <div className="space-y-3">
                                    {priceRanges.map((price, index) => (
                                        <div
                                            key={index}
                                            onClick={() => handlePriceClick(price.name)}
                                            className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-300 group ${selectedPrice === price.name
                                                ? 'bg-purple-50 border-2 border-purple-200 shadow-sm'
                                                : 'hover:bg-gray-50 border-2 border-transparent'
                                                }`}
                                        >
                                            <div className="flex items-center">
                                                <div className={`w-3 h-3 rounded-full ${price.color} mr-3 ${selectedPrice === price.name ? 'animate-pulse' : ''
                                                    }`}></div>
                                                <span className={`font-medium transition-colors ${selectedPrice === price.name
                                                    ? 'text-purple-600 font-semibold'
                                                    : 'group-hover:text-purple-500'
                                                    }`}>
                                                    {price.name}
                                                </span>
                                            </div>
                                            <span className={`text-sm px-2 py-1 rounded-full transition-colors ${selectedPrice === price.name
                                                ? 'bg-purple-100 text-purple-600 font-semibold'
                                                : 'text-gray-500 bg-gray-100'
                                                }`}>
                                                {price.count}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="flex-1">
                            {/* Header with Controls */}
                            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-800">
                                            Search Results ({filteredCourses.length} courses)
                                        </h2>
                                        <p className="text-gray-600 mt-1">
                                            {filteredCourses.length > 0
                                                ? 'Discover courses that suit you'
                                                : 'No suitable courses found'
                                            }
                                        </p>

                                        {/* Active Filters */}
                                        <div className="flex flex-wrap gap-2 mt-3">
                                            {selectedCategory !== 'All' && (
                                                <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                                                    {selectedCategory}
                                                    <button onClick={() => setSelectedCategory('All')} className="ml-2 text-red-400 hover:text-red-600">×</button>
                                                </span>
                                            )}
                                            {selectedAge !== 'All' && (
                                                <span className="bg-cyan-100 text-cyan-600 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                                                    {selectedAge}
                                                    <button onClick={() => setSelectedAge('All')} className="ml-2 text-cyan-400 hover:text-cyan-600">×</button>
                                                </span>
                                            )}
                                            {selectedLevel !== 'All' && (
                                                <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                                                    {selectedLevel}
                                                    <button onClick={() => setSelectedLevel('All')} className="ml-2 text-gray-400 hover:text-gray-600">×</button>
                                                </span>
                                            )}
                                            {selectedPrice !== 'All' && (
                                                <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                                                    {selectedPrice}
                                                    <button onClick={() => setSelectedPrice('All')} className="ml-2 text-purple-400 hover:text-purple-600">×</button>
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        {/* Sort Dropdown */}
                                        <div className="relative">
                                            <select
                                                value={sortBy}
                                                onChange={(e) => setSortBy(e.target.value)}
                                                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-red-500"
                                            >
                                                <option value="popular">Most Popular</option>
                                                <option value="rating">Highest Rated</option>
                                                <option value="newest">Newest</option>
                                                <option value="price">Lowest Price</option>
                                            </select>
                                            <FaChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                                        </div>

                                        {/* View Mode Toggle */}
                                        <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                                            <button
                                                onClick={() => setViewMode('grid')}
                                                className={`p-2 ${viewMode === 'grid' ? 'bg-red-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                                            >
                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => setViewMode('list')}
                                                className={`p-2 ${viewMode === 'list' ? 'bg-red-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                                            >
                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Empty State */}
                            {filteredCourses.length === 0 ? (
                                <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <FaBookOpen className="text-3xl text-gray-400" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                        No courses found
                                    </h3>
                                    <p className="text-gray-600 mb-6">
                                        Try adjusting your filters or search terms
                                    </p>
                                    <button
                                        onClick={resetAllFilters}
                                        className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                                    >
                                        View All Courses
                                    </button>
                                </div>
                            ) : (
                                <>
                                    {/* Course Grid/List */}
                                    <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8' : 'space-y-6 mb-8'}>
                                        {currentCourses.map((course) => (
                                            <div key={course.id} className={`bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group ${viewMode === 'list' ? 'flex' : ''}`}>
                                                {/* Image with Error Handling */}
                                                <div className={`relative ${viewMode === 'list' ? 'w-80 flex-shrink-0' : ''}`}>
                                                    <img
                                                        src={course.image}
                                                        alt={course.title}
                                                        className={`w-full object-cover group-hover:scale-105 transition-transform duration-300 ${viewMode === 'list' ? 'h-full' : 'h-48'}`}
                                                        onError={(e) => {
                                                            e.target.src = "https://via.placeholder.com/400x300/ef4444/ffffff?text=Course+Image";
                                                        }}
                                                        loading="lazy"
                                                    />

                                                    {/* Overlays */}
                                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>

                                                    {/* Featured Badge */}
                                                    {course.featured && (
                                                        <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center">
                                                            <FaAward className="mr-1" />
                                                            Featured
                                                        </div>
                                                    )}

                                                    {/* Level Badge */}
                                                    <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold ${getLevelColor(course.level)}`}>
                                                        {course.level}
                                                    </div>

                                                    {/* Play Button */}
                                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                        <div className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                                                            <FaPlay className="text-red-500 text-xl ml-1" />
                                                        </div>
                                                    </div>

                                                    {/* Progress Bar */}
                                                    {course.progress > 0 && (
                                                        <div className="absolute bottom-0 left-0 right-0 bg-gray-200 h-1">
                                                            <div
                                                                className="bg-red-500 h-full transition-all duration-300"
                                                                style={{ width: `${course.progress}%` }}
                                                            ></div>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Content */}
                                                <div className={`p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                                                    {/* Category & Age */}
                                                    <div className="flex items-center justify-between mb-3">
                                                        <div className="flex items-center gap-2">
                                                            <span
                                                                onClick={() => handleCategoryClick(course.category)}
                                                                className="text-red-500 text-sm font-semibold uppercase tracking-wide cursor-pointer hover:text-red-600 transition-colors"
                                                            >
                                                                {course.category}
                                                            </span>
                                                            <span className="text-gray-300">•</span>
                                                            <span
                                                                onClick={() => handleAgeClick(course.ageGroup)}
                                                                className="text-cyan-500 text-sm font-medium cursor-pointer hover:text-cyan-600 transition-colors"
                                                            >
                                                                {course.ageGroup}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <button className="text-gray-400 hover:text-red-500 transition-colors">
                                                                <FaHeart />
                                                            </button>
                                                            <button className="text-gray-400 hover:text-red-500 transition-colors">
                                                                <FaShare />
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* Title */}
                                                    <h3 className="font-bold text-lg text-gray-800 mb-3 line-clamp-2 group-hover:text-red-500 transition-colors">
                                                        {course.title}
                                                    </h3>

                                                    {/* Description */}
                                                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                                        {course.description}
                                                    </p>

                                                    {/* Instructor */}
                                                    <div className="flex items-center mb-4">
                                                        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
                                                            <span className="text-red-500 text-sm font-bold">
                                                                {course.instructor.split(' ').pop().charAt(0)}
                                                            </span>
                                                        </div>
                                                        <span className="text-gray-700 text-sm font-medium">{course.instructor}</span>
                                                    </div>

                                                    {/* Stats */}
                                                    <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
                                                        <div className="flex items-center gap-4">
                                                            <div className="flex items-center">
                                                                <FaStar className="text-yellow-400 mr-1" />
                                                                <span className="font-semibold">{course.rating}</span>
                                                            </div>
                                                            <div className="flex items-center">
                                                                <FaUsers className="text-gray-400 mr-1" />
                                                                <span>{course.students.toLocaleString()}</span>
                                                            </div>
                                                            <div className="flex items-center">
                                                                <FaBookOpen className="text-gray-400 mr-1" />
                                                                <span>{course.lessons} lessons</span>
                                                            </div>
                                                            <div className="flex items-center">
                                                                <FaClock className="text-gray-400 mr-1" />
                                                                <span>{course.duration}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Tags */}
                                                    <div className="flex flex-wrap gap-2 mb-4">
                                                        {course.tags.slice(0, 3).map((tag, index) => (
                                                            <span key={index} className="bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-xs">
                                                                {tag}
                                                            </span>
                                                        ))}
                                                    </div>

                                                    {/* Price and Action */}
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <span className="text-2xl font-bold text-red-500">{course.price}</span>
                                                            {course.price !== "Free" && (
                                                                <span className="text-gray-400 line-through ml-2">$399</span>
                                                            )}
                                                        </div>
                                                        <button className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors">
                                                            {course.progress > 0 ? 'Continue' : 'Enroll Now'}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Enhanced Pagination */}
                                    {totalPages > 1 && (
                                        <div className="bg-white rounded-xl shadow-sm p-6">
                                            <div className="flex flex-col items-center space-y-4">
                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        onClick={() => handlePageChange(currentPage - 1)}
                                                        disabled={currentPage === 1}
                                                        className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${currentPage === 1
                                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                            : 'bg-white text-gray-600 hover:bg-red-50 hover:text-red-500 border border-gray-300'
                                                            }`}
                                                    >
                                                        <FaArrowLeft className="mr-2" />
                                                        Previous
                                                    </button>

                                                    {Array.from({ length: totalPages }, (_, index) => {
                                                        const pageNumber = index + 1;
                                                        return (
                                                            <button
                                                                key={pageNumber}
                                                                onClick={() => handlePageChange(pageNumber)}
                                                                className={`w-10 h-10 rounded-lg font-medium transition-colors ${currentPage === pageNumber
                                                                    ? 'bg-red-500 text-white'
                                                                    : 'bg-white text-gray-600 hover:bg-red-50 hover:text-red-500 border border-gray-300'
                                                                    }`}
                                                            >
                                                                {pageNumber}
                                                            </button>
                                                        );
                                                    })}

                                                    <button
                                                        onClick={() => handlePageChange(currentPage + 1)}
                                                        disabled={currentPage === totalPages}
                                                        className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${currentPage === totalPages
                                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                            : 'bg-white text-gray-600 hover:bg-red-50 hover:text-red-500 border border-gray-300'
                                                            }`}
                                                    >
                                                        Next
                                                        <FaArrowRight className="ml-2" />
                                                    </button>
                                                </div>

                                                <div className="text-sm text-gray-600">
                                                    Showing {indexOfFirstCourse + 1} - {Math.min(indexOfLastCourse, filteredCourses.length)} of {filteredCourses.length} courses
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    )
}

export default Courses