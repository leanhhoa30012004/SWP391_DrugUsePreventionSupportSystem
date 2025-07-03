import React, { useState } from 'react';
import { FaSearch, FaCalendarAlt, FaUser, FaEye, FaHeart, FaShareAlt, FaBookmark, FaTags, FaClock, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';

const Blogs = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [expandedCards, setExpandedCards] = useState(new Set());
    const blogsPerPage = 6;

    // Sample blog data
    const blogsData = [
        {
            id: 1,
            title: "Understanding Addiction: A Comprehensive Guide",
            content: "Addiction is a complex brain disorder that affects millions of people worldwide. This comprehensive guide explores the science behind addiction, its causes, and effective treatment approaches.",
            excerpt: "Learn about the science behind addiction and discover effective treatment approaches that can help in recovery.",
            author: "Dr. Sarah Johnson",
            date: "2024-12-15",
            category: "addiction",
            image: "https://www.datocms-assets.com/92605/1725916116-blogs-and-influencers.png?auto=format&fit=max&w=1200",
            readTime: "8 min read",
            views: 1250,
            likes: 45,
            tags: ["addiction", "recovery", "health"]
        },
        {
            id: 2,
            title: "5 Signs Your Loved One May Need Help",
            content: "Recognizing the warning signs of substance abuse in family members or friends can be challenging. Here are key indicators to watch for.",
            excerpt: "Identifying early warning signs of substance abuse can make all the difference in getting help for your loved ones.",
            author: "Michael Chen",
            date: "2024-12-10",
            category: "family",
            image: "https://f.hubspotusercontent10.net/hubfs/8093962/FEATURED%20IMAGE%20BLOG.jpg",
            readTime: "5 min read",
            views: 980,
            likes: 32,
            tags: ["family", "warning signs", "support"]
        },
        {
            id: 3,
            title: "Youth Prevention Programs That Work",
            content: "Effective prevention programs can significantly reduce the risk of substance abuse among young people. Here's what research shows works best.",
            excerpt: "Discover evidence-based prevention programs that are making a real difference in protecting our youth.",
            author: "Emma Rodriguez",
            date: "2024-12-08",
            category: "prevention",
            image: "https://www.amritahospitals.org/_next/image?url=https%3A%2F%2Fadmin.amritahospitals.org%2Fsites%2Fdefault%2Ffiles%2F2023-09%2Fsubstance-abuse-blog.jpg&w=3840&q=100",
            readTime: "7 min read",
            views: 1450,
            likes: 68,
            tags: ["youth", "prevention", "education"]
        },
        {
            id: 4,
            title: "Building Resilience in Recovery",
            content: "Recovery is a journey that requires building strong resilience skills. Learn practical strategies for maintaining sobriety.",
            excerpt: "Essential strategies for building the resilience needed to maintain long-term recovery and prevent relapse.",
            author: "Dr. James Wilson",
            date: "2024-12-05",
            category: "recovery",
            image: "https://static.wixstatic.com/media/f027ed155a8a4874b856344a5b970a4b.jpg/v1/fill/w_600,h_400,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/f027ed155a8a4874b856344a5b970a4b.jpg",
            readTime: "6 min read",
            views: 890,
            likes: 41,
            tags: ["recovery", "resilience", "mental health"]
        },
        {
            id: 5,
            title: "The Role of Community in Prevention",
            content: "Communities play a crucial role in preventing substance abuse. Learn how collective action can create lasting change.",
            excerpt: "Discover how communities can work together to create effective prevention strategies and support systems.",
            author: "Lisa Thompson",
            date: "2024-12-02",
            category: "community",
            image: "https://c8y.doxcdn.com/image/upload/c_fill,fl_progressive,h_800,q_auto,w_1600/mudytdnslarcskpbzmfi.webp",
            readTime: "9 min read",
            views: 1120,
            likes: 55,
            tags: ["community", "prevention", "support"]
        },
        {
            id: 6,
            title: "Mental Health and Substance Abuse",
            content: "Understanding the connection between mental health issues and substance abuse is crucial for effective treatment.",
            excerpt: "Explore the complex relationship between mental health disorders and substance abuse, and treatment approaches.",
            author: "Dr. Rachel Green",
            date: "2024-11-28",
            category: "mental-health",
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGLZAyMEu--nK08Yg9hG5CShrtLNQzCpks8Q&s",
            readTime: "10 min read",
            views: 1680,
            likes: 78,
            tags: ["mental health", "dual diagnosis", "treatment"]
        }
    ];

    // Categories
    const categories = [
        { id: 'all', name: 'All Blogs' },
        { id: 'addiction', name: 'Addiction' },
        { id: 'prevention', name: 'Prevention' },
        { id: 'recovery', name: 'Recovery' },
        { id: 'family', name: 'Family Support' },
        { id: 'community', name: 'Community' },
        { id: 'mental-health', name: 'Mental Health' }
    ];

    // Filter blogs
    const filteredBlogs = blogsData.filter(blog => {
        const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            blog.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
            blog.author.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = activeCategory === 'all' || blog.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    // Pagination
    const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);
    const indexOfLastBlog = currentPage * blogsPerPage;
    const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
    const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);

    // Featured blog (first blog)
    const featuredBlog = blogsData[0];

    const handleBlogClick = (blog) => {
        navigate(`/blogs/${blog.id}`);
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleLike = (blogId, e) => {
        e.stopPropagation();
        // Handle like functionality here
        console.log('Liked blog:', blogId);
    };

    const handleBookmark = (blogId, e) => {
        e.stopPropagation();
        // Handle bookmark functionality here
        console.log('Bookmarked blog:', blogId);
    };

    const toggleCardExpansion = (blogId, e) => {
        e.stopPropagation();
        const newExpandedCards = new Set(expandedCards);
        if (expandedCards.has(blogId)) {
            newExpandedCards.delete(blogId);
        } else {
            newExpandedCards.add(blogId);
        }
        setExpandedCards(newExpandedCards);
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-50">
                {/* Hero Section */}
                <div className="bg-gradient-to-r from-red-500 to-red-600 text-white py-16">
                    <div className="container mx-auto px-4 text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            WeHope Blog
                        </h1>
                        <p className="text-xl mb-8 max-w-2xl mx-auto">
                            Expert insights, personal stories, and practical guidance on drug prevention,
                            recovery, and building healthier communities
                        </p>
                        <div className="relative max-w-md mx-auto">
                            <input
                                type="text"
                                placeholder="Search blogs..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-6 py-3 pl-12 rounded-full bg-white text-gray-800 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white shadow-lg"
                            />
                            <FaSearch className="absolute left-4 top-4 text-gray-400" />
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-12">
                    {/* Featured Blog */}
                    {featuredBlog && (
                        <div className="mb-12">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Featured Article</h2>
                            <div
                                className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow duration-300"
                                onClick={() => handleBlogClick(featuredBlog)}
                            >
                                <div className="md:flex">
                                    <div className="md:w-1/2 bg-gray-50 flex items-center justify-center p-4">
                                        <img
                                            src={featuredBlog.image}
                                            alt={featuredBlog.title}
                                            className="max-w-full max-h-80 object-contain"
                                            onError={(e) => {
                                                e.target.src = 'https://via.placeholder.com/600x400?text=Blog+Image';
                                            }}
                                        />
                                    </div>
                                    <div className="md:w-1/2 p-8">
                                        <div className="flex items-center gap-4 mb-4">
                                            <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-medium">
                                                Featured
                                            </span>
                                            <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
                                                {categories.find(c => c.id === featuredBlog.category)?.name}
                                            </span>
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-800 mb-4">
                                            {featuredBlog.title}
                                        </h3>
                                        <p className="text-gray-600 mb-6 leading-relaxed">
                                            {featuredBlog.excerpt}
                                        </p>
                                        <div className="flex items-center justify-between text-sm text-gray-500">
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center gap-1">
                                                    <FaUser />
                                                    <span>{featuredBlog.author}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <FaCalendarAlt />
                                                    <span>{new Date(featuredBlog.date).toLocaleDateString()}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <FaClock />
                                                    <span>{featuredBlog.readTime}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center gap-1">
                                                    <FaEye />
                                                    <span>{featuredBlog.views}</span>
                                                </div>
                                                <button
                                                    onClick={(e) => handleLike(featuredBlog.id, e)}
                                                    className="flex items-center gap-1 hover:text-red-500 transition-colors"
                                                >
                                                    <FaHeart />
                                                    <span>{featuredBlog.likes}</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Category Filter */}
                    <div className="mb-8">
                        <div className="flex flex-wrap gap-3">
                            {categories.map(category => (
                                <button
                                    key={category.id}
                                    onClick={() => {
                                        setActiveCategory(category.id);
                                        setCurrentPage(1);
                                    }}
                                    className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${activeCategory === category.id
                                        ? 'bg-red-500 text-white shadow-lg'
                                        : 'bg-white text-gray-600 hover:bg-red-50 hover:text-red-600 shadow-sm border'
                                        }`}
                                >
                                    {category.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Blog Grid */}
                    <div className="mb-12">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">
                                {activeCategory === 'all' ? 'Latest Blogs' : categories.find(c => c.id === activeCategory)?.name}
                            </h2>
                            <p className="text-gray-600">
                                {filteredBlogs.length} article{filteredBlogs.length !== 1 ? 's' : ''} found
                            </p>
                        </div>

                        {currentBlogs.length === 0 ? (
                            <div className="bg-white rounded-lg p-12 text-center">
                                <p className="text-gray-600 text-lg">No blogs found matching your criteria.</p>
                                <button
                                    onClick={() => {
                                        setSearchTerm('');
                                        setActiveCategory('all');
                                    }}
                                    className="mt-4 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                >
                                    Reset Filters
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {currentBlogs.map(blog => {
                                    const isExpanded = expandedCards.has(blog.id);
                                    return (
                                        <div
                                            key={blog.id}
                                            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                                        >
                                            <div className="relative bg-gray-50 h-48 flex items-center justify-center p-4">
                                                <img
                                                    src={blog.image}
                                                    alt={blog.title}
                                                    className="max-w-full max-h-full object-contain cursor-pointer"
                                                    onClick={() => handleBlogClick(blog)}
                                                    onError={(e) => {
                                                        e.target.src = 'https://via.placeholder.com/400x300?text=Blog+Image';
                                                    }}
                                                />
                                                <div className="absolute top-3 right-3 flex gap-2">
                                                    <button
                                                        onClick={(e) => handleBookmark(blog.id, e)}
                                                        className="bg-white/90 p-2 rounded-full hover:bg-white transition-colors"
                                                    >
                                                        <FaBookmark className="text-gray-600 hover:text-red-500" />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="p-6">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-xs font-medium">
                                                        {categories.find(c => c.id === blog.category)?.name}
                                                    </span>
                                                    <span className="text-gray-400 text-xs">•</span>
                                                    <span className="text-gray-500 text-xs">{blog.readTime}</span>
                                                </div>
                                                <h3
                                                    className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 cursor-pointer hover:text-red-600 transition-colors"
                                                    onClick={() => handleBlogClick(blog)}
                                                >
                                                    {blog.title}
                                                </h3>
                                                <p className="text-gray-600 mb-4 line-clamp-3">
                                                    {blog.excerpt}
                                                </p>

                                                {/* Expand/Collapse Button */}
                                                <button
                                                    onClick={(e) => toggleCardExpansion(blog.id, e)}
                                                    className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium mb-4 transition-colors"
                                                >
                                                    {isExpanded ? (
                                                        <>
                                                            <span>Ẩn chi tiết</span>
                                                            <FaChevronUp />
                                                        </>
                                                    ) : (
                                                        <>
                                                            <span>Xem chi tiết</span>
                                                            <FaChevronDown />
                                                        </>
                                                    )}
                                                </button>

                                                {/* Expanded Content */}
                                                <div className={`transition-all duration-300 overflow-hidden ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                                    }`}>
                                                    <div className="border-t border-gray-200 pt-4 mb-4">
                                                        <h4 className="font-semibold text-gray-800 mb-2">Nội dung chi tiết:</h4>
                                                        <p className="text-gray-600 text-sm leading-relaxed mb-4">
                                                            {blog.content}
                                                        </p>

                                                        {/* Tags */}
                                                        <div className="mb-4">
                                                            <h5 className="font-medium text-gray-700 mb-2 flex items-center gap-1">
                                                                <FaTags className="text-gray-500" />
                                                                Tags:
                                                            </h5>
                                                            <div className="flex flex-wrap gap-2">
                                                                {blog.tags.map((tag, index) => (
                                                                    <span
                                                                        key={index}
                                                                        className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs"
                                                                    >
                                                                        #{tag}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>

                                                        {/* Action Buttons */}
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => handleBlogClick(blog)}
                                                                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2 text-sm"
                                                            >
                                                                <FaEye />
                                                                Đọc toàn bộ
                                                            </button>
                                                            <button
                                                                onClick={(e) => handleLike(blog.id, e)}
                                                                className="bg-pink-100 text-pink-600 px-4 py-2 rounded-lg hover:bg-pink-200 transition-colors flex items-center gap-2 text-sm"
                                                            >
                                                                <FaHeart />
                                                                Thích ({blog.likes})
                                                            </button>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    // Handle share functionality
                                                                    navigator.share?.({
                                                                        title: blog.title,
                                                                        text: blog.excerpt,
                                                                        url: window.location.href
                                                                    }).catch(() => {
                                                                        // Fallback for browsers that don't support Web Share API
                                                                        navigator.clipboard.writeText(window.location.href);
                                                                        alert('Link đã được sao chép!');
                                                                    });
                                                                }}
                                                                className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors flex items-center gap-2 text-sm"
                                                            >
                                                                <FaShareAlt />
                                                                Chia sẻ
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                                                            {blog.author.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-800">{blog.author}</p>
                                                            <p className="text-xs text-gray-500">
                                                                {new Date(blog.date).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3 text-sm text-gray-500">
                                                        <div className="flex items-center gap-1">
                                                            <FaEye />
                                                            <span>{blog.views}</span>
                                                        </div>
                                                        <button
                                                            onClick={(e) => handleLike(blog.id, e)}
                                                            className="flex items-center gap-1 hover:text-red-500 transition-colors"
                                                        >
                                                            <FaHeart />
                                                            <span>{blog.likes}</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex flex-col items-center space-y-4">
                            {/* Pagination Controls */}
                            <div className="flex items-center space-x-2">
                                {/* Previous Button */}
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg border transition-all duration-200 ${currentPage === 1
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-300'
                                        : 'bg-white text-gray-700 hover:bg-red-50 hover:text-red-600 border-gray-300 hover:border-red-300 shadow-sm hover:shadow-md'
                                        }`}
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
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
                                            className={`px-4 py-2 text-sm font-medium rounded-lg border transition-all duration-200 min-w-[40px] ${currentPage === pageNumber
                                                ? 'bg-red-500 text-white border-red-500 shadow-lg'
                                                : 'bg-white text-gray-700 border-gray-300 hover:bg-red-50 hover:text-red-600 hover:border-red-300 shadow-sm hover:shadow-md'
                                                }`}
                                        >
                                            {pageNumber}
                                        </button>
                                    );
                                })}

                                {/* Next Button */}
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg border transition-all duration-200 ${currentPage === totalPages
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-300'
                                        : 'bg-white text-gray-700 hover:bg-red-50 hover:text-red-600 border-gray-300 hover:border-red-300 shadow-sm hover:shadow-md'
                                        }`}
                                >
                                    Next
                                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                                    </svg>
                                </button>
                            </div>

                            {/* Page Info */}
                            <div className="text-sm text-gray-600">
                                Showing <span className="font-medium text-gray-900">{indexOfFirstBlog + 1}</span> to{' '}
                                <span className="font-medium text-gray-900">{Math.min(indexOfLastBlog, filteredBlogs.length)}</span> of{' '}
                                <span className="font-medium text-gray-900">{filteredBlogs.length}</span> results
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Blogs;