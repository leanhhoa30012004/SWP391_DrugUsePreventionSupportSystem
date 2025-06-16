import React, { useState } from 'react';
import { FaSearch, FaCalendarAlt, FaEye, FaShareAlt, FaBookmark, FaFilter } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const News = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');

    // Sample news data - replace with API call later
    const [newsArticles, setNewsArticles] = useState([
        {
            id: 1,
            title: "New Research Reveals Impact of Early Drug Prevention Education",
            summary: "Recent studies show that early intervention programs for drug use prevention can reduce teenage drug use by up to 40%.",
            image: "https://placehold.co/600x400/e2e8f0/475569?text=News+Image",
            category: "research",
            date: "2024-06-10",
            author: "Dr. Emily Johnson",
            views: 1245,
            featured: true
        },
        {
            id: 2,
            title: "Government Announces New Funding for Drug Prevention Programs",
            summary: "The Ministry of Health has allocated $5 million for community-based drug prevention initiatives targeting youth and young adults.",
            image: "https://placehold.co/600x400/e2e8f0/475569?text=News+Image",
            category: "policy",
            date: "2024-06-08",
            author: "Thomas Wilson",
            views: 890,
            featured: false
        },
        {
            id: 3,
            title: "School-Based Prevention Programs Show Promising Results",
            summary: "A 3-year study of school-based drug prevention programs demonstrates significant reduction in substance abuse among participants.",
            image: "https://placehold.co/600x400/e2e8f0/475569?text=News+Image",
            category: "education",
            date: "2024-06-05",
            author: "Sarah Martinez",
            views: 732,
            featured: true
        },
        {
            id: 4,
            title: "Community Event: Drug Awareness Workshop Next Month",
            summary: "Join us for a free community workshop on drug awareness and prevention strategies for families on July 15th.",
            image: "https://placehold.co/600x400/e2e8f0/475569?text=News+Image",
            category: "events",
            date: "2024-06-02",
            author: "Michael Anderson",
            views: 512,
            featured: false
        },
        {
            id: 5,
            title: "New Mobile App Launched to Support Recovery",
            summary: "WeHope introduces a new mobile application designed to provide support and resources for individuals in recovery.",
            image: "https://placehold.co/600x400/e2e8f0/475569?text=News+Image",
            category: "technology",
            date: "2024-05-30",
            author: "Jennifer Lee",
            views: 678,
            featured: false
        }
    ]);

    const categories = [
        { id: 'all', name: 'All News' },
        { id: 'research', name: 'Research & Studies' },
        { id: 'policy', name: 'Policy & Regulations' },
        { id: 'education', name: 'Education' },
        { id: 'events', name: 'Events & Workshops' },
        { id: 'technology', name: 'Technology' }
    ];

    const filteredNews = newsArticles.filter(article => {
        const matchesCategory = activeCategory === 'all' || article.category === activeCategory;
        const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            article.summary.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const featuredNews = newsArticles.filter(article => article.featured);

    const handleNewsClick = (newsId) => {
        navigate(`/news/${newsId}`);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Latest News</h1>
                <p className="text-gray-600">Stay updated with the latest information about drug prevention and awareness</p>
            </div>

            {/* Search and Filter Bar */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="relative flex-grow">
                    <input
                        type="text"
                        placeholder="Search news..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                    <FaSearch className="absolute left-3 top-3 text-gray-400" />
                </div>

                <div className="relative">
                    <select
                        value={activeCategory}
                        onChange={(e) => setActiveCategory(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    >
                        {categories.map(category => (
                            <option key={category.id} value={category.id}>{category.name}</option>
                        ))}
                    </select>
                    <FaFilter className="absolute left-3 top-3 text-gray-400" />
                </div>
            </div>

            {/* Featured News Section (Carousel-like) */}
            {featuredNews.length > 0 && (
                <div className="mb-12">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Featured News</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {featuredNews.map(article => (
                            <div
                                key={article.id}
                                className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow duration-300"
                                onClick={() => handleNewsClick(article.id)}
                            >
                                <div className="relative">
                                    <img
                                        src={article.image}
                                        alt={article.title}
                                        className="w-full h-64 object-cover"
                                    />
                                    <div className="absolute top-0 right-0 bg-red-500 text-white px-3 py-1 m-3 rounded-full text-xs font-medium">
                                        Featured
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-2xl font-semibold text-gray-800 mb-2">{article.title}</h3>
                                    <p className="text-gray-600 mb-4">{article.summary}</p>
                                    <div className="flex justify-between items-center text-sm text-gray-500">
                                        <div className="flex items-center gap-2">
                                            <FaCalendarAlt />
                                            <span>{new Date(article.date).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <FaEye />
                                            <span>{article.views} views</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* News List */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    {activeCategory === 'all' ? 'All News' : categories.find(c => c.id === activeCategory)?.name}
                </h2>

                {filteredNews.length === 0 ? (
                    <div className="bg-gray-50 rounded-lg p-8 text-center">
                        <p className="text-gray-600">No news articles found matching your criteria.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {filteredNews.map(article => (
                            <div
                                key={article.id}
                                className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300"
                                onClick={() => handleNewsClick(article.id)}
                            >
                                <img
                                    src={article.image}
                                    alt={article.title}
                                    className="w-full h-48 object-cover"
                                />
                                <div className="p-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-xs font-medium text-red-500 bg-red-50 px-2 py-1 rounded">
                                            {categories.find(c => c.id === article.category)?.name || article.category}
                                        </span>
                                        <span className="text-xs text-gray-500 flex items-center">
                                            <FaCalendarAlt className="mr-1" />
                                            {new Date(article.date).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-800 mb-2 line-clamp-2">{article.title}</h3>
                                    <p className="text-sm text-gray-600 mb-3 line-clamp-3">{article.summary}</p>
                                    <div className="flex justify-between items-center text-xs text-gray-500">
                                        <span>By {article.author}</span>
                                        <div className="flex items-center gap-3">
                                            <span className="flex items-center"><FaEye className="mr-1" /> {article.views}</span>
                                            <button onClick={(e) => {
                                                e.stopPropagation();
                                                // Handle bookmark functionality
                                            }} className="hover:text-red-500">
                                                <FaBookmark />
                                            </button>
                                            <button onClick={(e) => {
                                                e.stopPropagation();
                                                // Handle share functionality
                                            }} className="hover:text-red-500">
                                                <FaShareAlt />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-8">
                <nav className="inline-flex rounded-md shadow">
                    <button className="px-3 py-1 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                        Previous
                    </button>
                    <button className="px-3 py-1 border-t border-b border-gray-300 bg-white text-sm font-medium text-red-500 hover:bg-red-50">
                        1
                    </button>
                    <button className="px-3 py-1 border-t border-b border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                        2
                    </button>
                    <button className="px-3 py-1 border-t border-b border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                        3
                    </button>
                    <button className="px-3 py-1 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                        Next
                    </button>
                </nav>
            </div>
        </div>
    );
};

export default News;