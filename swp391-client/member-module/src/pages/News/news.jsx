import React, { useState } from 'react';
import { FaSearch, FaCalendarAlt, FaEye, FaShareAlt, FaBookmark, FaFilter, FaExternalLinkAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/footer';

const News = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    // Number of items per page
    const itemsPerPage = 6;

    // Sample news data - replace with API call later
    const [newsArticles, setNewsArticles] = useState([
        {
            id: 1,
            title: "Drug Addiction and Prevention Measures",
            summary: "An in-depth analysis of drug addiction issues in today's society and effective prevention measures, with special focus on protecting children from the harmful effects of drugs.",
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFwSYLeM8jbtoXbSYYhA0z0PSEhx-NYh5oOQ&s",
            category: "prevention",
            date: "2024-05-20",
            author: "Department of Health",
            views: 1245,
            featured: true,
            externalLink: "https://binhphuoc.gov.vn/vi/stttt/phong-chong-toi-pham-xam-hai-tre-em/te-nan-ma-tuy-va-mot-so-bien-phap-phong-tranh-2358.html",
            isExternal: true
        },
        {
            id: 2,
            title: "Drug Prevention Measures in Schools",
            summary: "Legal Q&A about drug prevention measures in educational environments, including legal regulations and implementation guidelines in schools.",
            image: "https://cdn.thuvienphapluat.vn//uploads/Hoidapphapluat/2023/PVHM/Thang12/20231215/PHONG-CHONG-MA-TUY.jpg",
            category: "prevention",
            date: "2024-06-08",
            author: "Legal Library",
            views: 890,
            featured: false,
            externalLink: "https://thuvienphapluat.vn/hoi-dap-phap-luat/839F36F-hd-co-nhung-bien-phap-phong-chong-ma-tuy-nao-trong-truong-hoc.html",
            isExternal: true
        },
        {
            id: 3,
            title: "Penalties for Illegal Drug Transportation",
            summary: "Detailed guidelines on penalty levels for illegal drug transportation crimes according to current legal regulations and enforcement procedures.",
            image: "https://t4.ftcdn.net/jpg/03/26/58/15/360_F_326581570_nCRJaG2h8dHcVmYueannygQQyxd1s8wV.jpg",
            category: "prosecution",
            date: "2024-06-05",
            author: "Government Policy",
            views: 732,
            featured: true,
            externalLink: "https://xaydungchinhsach.chinhphu.vn/cac-muc-phat-toi-van-chuyen-trai-phep-chat-ma-tuy-119230324164214971.htm",
            isExternal: true
        },
        {
            id: 4,
            title: "Penalties for Drug Possession: Usage vs. Distribution",
            summary: "Detailed analysis of penalty levels for drug possession under current criminal law, including aggravating and mitigating circumstances.",
            image: "https://thehealthmaster.com/wp-content/uploads/2019/12/No-drugs.jpg",
            category: "prosecution",
            date: "2024-06-02",
            author: "Legal Experts",
            views: 512,
            featured: false,
            externalLink: "https://luatminhkhue.vn/tang-tru-ma-tuy-vi-muc-dich-su-dung-hoac-buon-ban-se-bi-xu-phat-nhu-the-nao-theo-luat-hinh-su---.aspx",
            isExternal: true
        },
        {
            id: 5,
            title: "Rising Drug Addiction Among Youth",
            summary: "Report on drug addiction trends showing increasing numbers and younger demographics, posing new challenges for prevention and treatment programs.",
            image: "https://i.ebayimg.com/images/g/SCkAAOSwT5tjdrj4/s-l1200.jpg",
            category: "social",
            date: "2024-05-30",
            author: "Youth Today",
            views: 678,
            featured: false,
            externalLink: "https://tuoitre.vn/tp-hcm-nguoi-nghien-ma-tuy-gia-tang-co-xu-huong-tre-hoa-20201113120649088.htm",
            isExternal: true
        },
        {
            id: 6,
            title: "Drug Addiction: A Growing Youth Crisis",
            summary: "Research reveals alarming trends in drug addiction among young people aged 16-25, requiring early intervention and effective prevention strategies.",
            image: "https://static.vecteezy.com/system/resources/previews/023/810/109/non_2x/say-no-to-drugs-text-design-isolated-on-white-background-vector.jpg",
            category: "social",
            date: "2024-05-28",
            author: "Youth News",
            views: 423,
            featured: false,
            externalLink: "https://thanhnien.vn/nguoi-nghien-ma-tuy-co-xu-huong-tre-hoa-185927816.htm",
            isExternal: true
        },
        {
            id: 7,
            title: "Building Students' Defense Against Drugs Through Education",
            summary: "Educational programs aimed at equipping students with knowledge and skills to protect themselves from drug-related dangers and peer pressure.",
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRZOz41bNZeVQcQ_fOfmvUM6ReuVdPX91DcA&s",
            category: "education",
            date: "2024-05-25",
            author: "Education Department",
            views: 567,
            featured: false,
            externalLink: "https://congan.com.vn/vu-an/phong-chong-ma-tuy/tphcm-trang-bi-kien-thuc-de-tao-thanh-ao-giap-giup-sinh-vien-bao-ve-minh-truoc-ma-tuy_177907.html",
            isExternal: true
        }
    ]);

    const categories = [
        { id: 'all', name: 'All News' },
        { id: 'prevention', name: 'Prevention' },
        { id: 'prosecution', name: 'Legal & Prosecution' },
        { id: 'social', name: 'Social Impact' },
        { id: 'education', name: 'Education' },
    ];

    const filteredNews = newsArticles.filter(article => {
        const matchesCategory = activeCategory === 'all' || article.category === activeCategory;
        const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            article.summary.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    // Calculate total pages
    const totalPages = Math.max(1, Math.ceil(filteredNews.length / itemsPerPage));

    // Get current page items
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredNews.slice(indexOfFirstItem, indexOfLastItem);

    // Change page
    const handlePageChange = (pageNumber) => {
        // Keep page number within valid range
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
            // Scroll to top when changing pages
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const featuredNews = newsArticles.filter(article => article.featured);

    const handleNewsClick = (article) => {
        if (article.isExternal && article.externalLink) {
            // Open external link in new tab
            window.open(article.externalLink, '_blank', 'noopener,noreferrer');
        } else {
            // Navigate to internal news detail page
            navigate(`/news/${article.id}`);
        }
    };

    // Generate page numbers array for rendering
    const getPageNumbers = () => {
        const pageNumbers = [];

        // For simplicity, showing max 5 page numbers
        const maxPageButtons = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
        let endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

        // Adjust if we're near the end
        if (endPage - startPage + 1 < maxPageButtons) {
            startPage = Math.max(1, endPage - maxPageButtons + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }

        return pageNumbers;
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
                <div className="container mx-auto px-4 py-12">
                    {/* Enhanced Header with Gradient Background */}
                    <div className="relative mb-16 text-center">
                        <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-purple-500/10 to-blue-500/10 rounded-3xl blur-3xl"></div>
                        <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-xl border border-white/50">
                            <h1 className="text-5xl font-bold bg-gradient-to-r from-red-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
                                Latest News & Updates
                            </h1>
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                                Stay informed with comprehensive coverage on drug prevention, legal updates, and community awareness initiatives
                            </p>
                        </div>
                    </div>

                    {/* Enhanced Search and Filter Bar */}
                    <div className="flex flex-col lg:flex-row gap-6 mb-12">
                        <div className="relative flex-grow">
                            <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-purple-500/20 rounded-2xl blur-lg"></div>
                            <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl p-1 shadow-lg border border-white/50">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search for news, topics, or keywords..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-14 pr-6 py-4 bg-transparent border-0 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 text-lg"
                                    />
                                    <FaSearch className="absolute left-5 top-5 text-gray-400 text-xl" />
                                </div>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-lg"></div>
                            <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl p-1 shadow-lg border border-white/50">
                                <select
                                    value={activeCategory}
                                    onChange={(e) => setActiveCategory(e.target.value)}
                                    className="pl-14 pr-8 py-4 bg-transparent border-0 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-lg text-gray-800 min-w-[200px]"
                                >
                                    {categories.map(category => (
                                        <option key={category.id} value={category.id}>{category.name}</option>
                                    ))}
                                </select>
                                <FaFilter className="absolute left-5 top-5 text-gray-400 text-xl" />
                            </div>
                        </div>
                    </div>

                    {/* Enhanced Featured News Section */}
                    {featuredNews.length > 0 && (
                        <div className="mb-16">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-8 bg-gradient-to-b from-red-500 to-purple-500 rounded-full"></div>
                                    <h2 className="text-3xl font-bold text-gray-800">Featured Stories</h2>
                                </div>
                                <div className="flex-grow h-px bg-gradient-to-r from-red-500/30 to-transparent"></div>
                            </div>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {featuredNews.map(article => (
                                    <div
                                        key={article.id}
                                        className="group relative bg-white rounded-3xl shadow-xl overflow-hidden cursor-pointer hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100"
                                        onClick={() => handleNewsClick(article)}
                                    >
                                        <div className="relative overflow-hidden">
                                            <img
                                                src={article.image}
                                                alt={article.title}
                                                className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-700"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                            
                                            {/* Enhanced Featured Badge */}
                                            <div className="absolute top-4 right-4">
                                                <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2">
                                                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                                                    Featured
                                                </div>
                                            </div>
                                            
                                            {/* External link indicator */}
                                            {article.isExternal && (
                                                <div className="absolute top-4 left-4">
                                                    <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-3 py-2 rounded-full text-sm font-medium flex items-center gap-2 shadow-lg">
                                                        <FaExternalLinkAlt className="text-xs" />
                                                        External
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        
                                        <div className="p-8">
                                            <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-red-600 transition-colors duration-300 flex items-start gap-3">
                                                {article.title}
                                                {article.isExternal && (
                                                    <FaExternalLinkAlt className="text-blue-500 text-lg mt-1 flex-shrink-0" />
                                                )}
                                            </h3>
                                            <p className="text-gray-600 mb-6 leading-relaxed">{article.summary}</p>
                                            
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-3 text-sm text-gray-500">
                                                    <div className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-full">
                                                        <FaCalendarAlt className="text-red-500" />
                                                        <span>{new Date(article.date).toLocaleDateString()}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-full">
                                                        <FaEye className="text-blue-500" />
                                                        <span>{article.views.toLocaleString()} views</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Enhanced News List */}
                    <div className="mb-12">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
                                <h2 className="text-3xl font-bold text-gray-800">
                                    {activeCategory === 'all' ? 'All News' : categories.find(c => c.id === activeCategory)?.name}
                                </h2>
                            </div>
                            <div className="flex-grow h-px bg-gradient-to-r from-blue-500/30 to-transparent"></div>
                        </div>

                        {currentItems.length === 0 ? (
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-gray-200/20 to-gray-300/20 rounded-3xl blur-xl"></div>
                                <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-16 text-center shadow-lg border border-gray-200">
                                    <div className="text-6xl text-gray-300 mb-4">📰</div>
                                    <p className="text-xl text-gray-600 mb-2">No articles found</p>
                                    <p className="text-gray-500">Try adjusting your search criteria or browse different categories</p>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                                {currentItems.map(article => (
                                    <div
                                        key={article.id}
                                        className="group bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
                                        onClick={() => handleNewsClick(article)}
                                    >
                                        <div className="relative overflow-hidden">
                                            <img
                                                src={article.image}
                                                alt={article.title}
                                                className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                            
                                            {/* External link indicator */}
                                            {article.isExternal && (
                                                <div className="absolute top-3 right-3">
                                                    <div className="bg-blue-500 text-white p-2 rounded-full shadow-lg">
                                                        <FaExternalLinkAlt className="text-xs" />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        
                                        <div className="p-6">
                                            <div className="flex items-center justify-between mb-4">
                                                <span className="inline-block bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-3 py-1 rounded-full font-medium">
                                                    {categories.find(c => c.id === article.category)?.name || article.category}
                                                </span>
                                                <div className="flex items-center text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-full">
                                                    <FaCalendarAlt className="mr-1 text-red-500" />
                                                    {new Date(article.date).toLocaleDateString()}
                                                </div>
                                            </div>
                                            
                                            <h3 className="text-lg font-bold text-gray-800 mb-3 group-hover:text-red-600 transition-colors duration-300 flex items-start gap-2 line-clamp-2">
                                                {article.title}
                                                {article.isExternal && (
                                                    <FaExternalLinkAlt className="text-blue-500 text-sm mt-1 flex-shrink-0" />
                                                )}
                                            </h3>
                                            
                                            <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">{article.summary}</p>
                                            
                                            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                                                <span className="text-sm text-gray-500 font-medium">By {article.author}</span>
                                                <div className="flex items-center gap-1 text-sm text-gray-500 bg-gray-50 px-2 py-1 rounded-full">
                                                    <FaEye className="text-blue-500" />
                                                    <span>{article.views.toLocaleString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Enhanced Pagination */}
                    {totalPages > 1 && (
                        <div className="flex flex-col items-center mt-16 space-y-6">
                            {/* Pagination Controls */}
                            <div className="flex items-center space-x-2">
                                {/* Previous Button */}
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className={`flex items-center px-6 py-3 text-sm font-medium rounded-xl border transition-all duration-300 shadow-lg
                                        ${currentPage === 1
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-300'
                                            : 'bg-white text-gray-700 hover:bg-gradient-to-r hover:from-red-500 hover:to-pink-500 hover:text-white border-gray-300 hover:border-red-300 hover:shadow-xl hover:-translate-y-1'}`}
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                                    </svg>
                                    Previous
                                </button>

                                {/* Page Numbers */}
                                {getPageNumbers().map(number => (
                                    <button
                                        key={number}
                                        onClick={() => handlePageChange(number)}
                                        className={`px-4 py-3 text-sm font-bold rounded-xl border transition-all duration-300 min-w-[50px] shadow-lg
                                            ${currentPage === number
                                                ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white border-red-500 shadow-xl transform scale-110 z-10'
                                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 hover:text-white hover:border-blue-300 hover:shadow-xl hover:-translate-y-1'}`}
                                    >
                                        {number}
                                    </button>
                                ))}

                                {/* Next Button */}
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className={`flex items-center px-6 py-3 text-sm font-medium rounded-xl border transition-all duration-300 shadow-lg
                                        ${currentPage === totalPages
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-300'
                                            : 'bg-white text-gray-700 hover:bg-gradient-to-r hover:from-red-500 hover:to-pink-500 hover:text-white border-gray-300 hover:border-red-300 hover:shadow-xl hover:-translate-y-1'}`}
                                >
                                    Next
                                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                                    </svg>
                                </button>
                            </div>

                            {/* Enhanced Page Info */}
                            <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-3 shadow-lg border border-gray-200">
                                <div className="text-sm text-gray-600">
                                    Showing <span className="font-bold text-red-600">{indexOfFirstItem + 1}</span> to{' '}
                                    <span className="font-bold text-red-600">{Math.min(indexOfLastItem, filteredNews.length)}</span> of{' '}
                                    <span className="font-bold text-red-600">{filteredNews.length}</span> results
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <Footer/>
        </>
    );
};

export default News;