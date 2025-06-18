import React, { useState } from 'react';
import { FaSearch, FaCalendarAlt, FaEye, FaShareAlt, FaBookmark, FaFilter, FaExternalLinkAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';

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
            title: "Tệ nạn ma túy và một số biện pháp phòng tránh",
            summary: "Bài viết phân tích về tệ nạn ma túy trong xã hội hiện nay và các biện pháp phòng tránh hiệu quả, đặc biệt tập trung vào việc bảo vệ trẻ em khỏi tác hại của ma túy.",
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFwSYLeM8jbtoXbSYYhA0z0PSEhx-NYh5oOQ&s",
            category: "prevention",
            date: "2024-05-20",
            author: "UBND Tỉnh Bình Phước",
            views: 1245,
            featured: true,
            externalLink: "https://binhphuoc.gov.vn/vi/stttt/phong-chong-toi-pham-xam-hai-tre-em/te-nan-ma-tuy-va-mot-so-bien-phap-phong-tranh-2358.html",
            isExternal: true
        },
        {
            id: 2,
            title: "Có những biện pháp phòng chống ma túy nào trong trường học?",
            summary: "Hỏi đáp pháp luật về các biện pháp phòng chống ma túy trong môi trường giáo dục, bao gồm các quy định pháp lý và hướng dẫn thực hiện tại các trường học.",
            image: "https://cdn.thuvienphapluat.vn//uploads/Hoidapphapluat/2023/PVHM/Thang12/20231215/PHONG-CHONG-MA-TUY.jpg",
            category: "prevention",
            date: "2024-06-08",
            author: "Thư viện Pháp luật",
            views: 890,
            featured: false,
            externalLink: "https://thuvienphapluat.vn/hoi-dap-phap-luat/839F36F-hd-co-nhung-bien-phap-phong-chong-ma-tuy-nao-trong-truong-hoc.html",
            isExternal: true
        },
        {
            id: 3,
            title: "Các mức phạt tội vận chuyển trái phép chất ma túy",
            summary: "Hướng dẫn chi tiết về các mức độ xử phạt đối với tội vận chuyển trái phép chất ma túy theo quy định của pháp luật Việt Nam hiện hành.",
            image: "https://t4.ftcdn.net/jpg/03/26/58/15/360_F_326581570_nCRJaG2h8dHcVmYueannygQQyxd1s8wV.jpg",
            category: "prosecution",
            date: "2024-06-05",
            author: "Xây dựng Chính sách - Chính phủ",
            views: 732,
            featured: true,
            externalLink: "https://xaydungchinhsach.chinhphu.vn/cac-muc-phat-toi-van-chuyen-trai-phep-chat-ma-tuy-119230324164214971.htm",
            isExternal: true
        },
        {
            id: 4,
            title: "Tàng trữ ma túy vì mục đích sử dụng hoặc buôn bán sẽ bị xử phạt như thế nào?",
            summary: "Phân tích chi tiết về các mức độ xử phạt đối với hành vi tàng trữ ma túy theo Luật Hình sự hiện hành, bao gồm các tình tiết tăng nặng và giảm nhẹ.",
            image: "https://thehealthmaster.com/wp-content/uploads/2019/12/No-drugs.jpg",
            category: "prosecution",
            date: "2024-06-02",
            author: "Luật Minh Khuê",
            views: 512,
            featured: false,
            externalLink: "https://luatminhkhue.vn/tang-tru-ma-tuy-vi-muc-dich-su-dung-hoac-buon-ban-se-bi-xu-phat-nhu-the-nao-theo-luat-hinh-su---.aspx",
            isExternal: true
        },
        {
            id: 5,
            title: "TP.HCM: Người nghiện ma túy gia tăng, có xu hướng trẻ hóa",
            summary: "Báo cáo về tình hình nghiện ma túy tại TP.HCM cho thấy số lượng người nghiện có xu hướng gia tăng và ngày càng trẻ hóa, đặt ra nhiều thách thức trong công tác phòng chống.",
            image: "https://i.ebayimg.com/images/g/SCkAAOSwT5tjdrj4/s-l1200.jpg",
            category: "social",
            date: "2024-05-30",
            author: "Tuổi Trẻ",
            views: 678,
            featured: false,
            externalLink: "https://tuoitre.vn/tp-hcm-nguoi-nghien-ma-tuy-gia-tang-co-xu-huong-tre-hoa-20201113120649088.htm",
            isExternal: true
        },
        {
            id: 6,
            title: "Người nghiện ma túy có xu hướng trẻ hóa",
            summary: "Khảo sát cho thấy tình trạng nghiện ma túy đang có xu hướng trẻ hóa nghiêm trọng, với nhiều trường hợp từ 16-25 tuổi, đòi hỏi các biện pháp can thiệp sớm và hiệu quả.",
            image: "https://static.vecteezy.com/system/resources/previews/023/810/109/non_2x/say-no-to-drugs-text-design-isolated-on-white-background-vector.jpg",
            category: "social",
            date: "2024-05-28",
            author: "Thanh Niên",
            views: 423,
            featured: false,
            externalLink: "https://thanhnien.vn/nguoi-nghien-ma-tuy-co-xu-huong-tre-hoa-185927816.htm",
            isExternal: true
        },
        {
            id: 7,
            title: "TP.HCM: Trang bị kiến thức để tạo thành 'áo giáp' giúp sinh viên bảo vệ mình trước ma túy",
            summary: "Chương trình giáo dục phòng chống ma túy cho sinh viên tại TP.HCM nhằm trang bị kiến thức và kỹ năng cần thiết để các bạn trẻ có thể tự bảo vệ mình.",
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRZOz41bNZeVQcQ_fOfmvUM6ReuVdPX91DcA&s",
            category: "education",
            date: "2024-05-25",
            author: "Công An Nhân Dân",
            views: 567,
            featured: false,
            externalLink: "https://congan.com.vn/vu-an/phong-chong-ma-tuy/tphcm-trang-bi-kien-thuc-de-tao-thanh-ao-giap-giup-sinh-vien-bao-ve-minh-truoc-ma-tuy_177907.html",
            isExternal: true
        }
    ]);

    const categories = [
        { id: 'all', name: 'All News' },
        { id: 'prevention', name: 'Prevention' },
        { id: 'social', name: 'Social' },
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

                {/* Featured News Section */}
                {featuredNews.length > 0 && (
                    <div className="mb-12">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Featured News</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {featuredNews.map(article => (
                                <div
                                    key={article.id}
                                    className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow duration-300 relative"
                                    onClick={() => handleNewsClick(article)}
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
                                        {/* External link indicator */}
                                        {article.isExternal && (
                                            <div className="absolute top-0 left-0 bg-blue-500 text-white px-2 py-1 m-3 rounded-full text-xs font-medium flex items-center gap-1">
                                                <FaExternalLinkAlt className="text-xs" />
                                                External
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-2xl font-semibold text-gray-800 mb-2 flex items-center gap-2">
                                            {article.title}
                                            {article.isExternal && (
                                                <FaExternalLinkAlt className="text-blue-500 text-sm" />
                                            )}
                                        </h3>
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

                    {currentItems.length === 0 ? (
                        <div className="bg-gray-50 rounded-lg p-8 text-center">
                            <p className="text-gray-600">No news articles found matching your criteria.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {currentItems.map(article => (
                                <div
                                    key={article.id}
                                    className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300 relative"
                                    onClick={() => handleNewsClick(article)}
                                >
                                    <div className="relative">
                                        <img
                                            src={article.image}
                                            alt={article.title}
                                            className="w-full h-48 object-cover"
                                        />
                                        {/* External link indicator for grid items */}
                                        {article.isExternal && (
                                            <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                                                <FaExternalLinkAlt className="text-xs" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <div className="flex items-center gap-2 text-xs text-red-500 mb-2">
                                            <span className="font-medium bg-red-50 px-2 py-1 rounded">
                                                {categories.find(c => c.id === article.category)?.name || article.category}
                                            </span>
                                            <span className="text-gray-500 flex items-center">
                                                <FaCalendarAlt className="mr-1" />
                                                {new Date(article.date).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
                                            {article.title}
                                            {article.isExternal && (
                                                <FaExternalLinkAlt className="text-blue-500 text-xs flex-shrink-0" />
                                            )}
                                        </h3>
                                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{article.summary}</p>
                                        <div className="flex justify-between items-center text-xs text-gray-500">
                                            <span>By {article.author}</span>
                                            <div className="flex items-center gap-1">
                                                <FaEye />
                                                <span>{article.views}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Enhanced Pagination with Better Design */}
                {totalPages > 1 && (
                    <div className="flex flex-col items-center mt-8 space-y-4">
                        {/* Pagination Controls */}
                        <div className="flex items-center space-x-1">
                            {/* Previous Button */}
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg border transition-all duration-200
                                    ${currentPage === 1
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-300'
                                        : 'bg-white text-gray-700 hover:bg-red-50 hover:text-red-600 border-gray-300 hover:border-red-300 shadow-sm hover:shadow-md'}`}
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
                                    className={`px-4 py-2 text-sm font-medium rounded-lg border transition-all duration-200 min-w-[40px]
                                        ${currentPage === number
                                            ? 'bg-red-500 text-white border-red-500 shadow-lg transform scale-105 z-10'
                                            : 'bg-white text-gray-700 border-gray-300 hover:bg-red-50 hover:text-red-600 hover:border-red-300 shadow-sm hover:shadow-md'}`}
                                >
                                    {number}
                                </button>
                            ))}

                            {/* Next Button */}
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg border transition-all duration-200
                                    ${currentPage === totalPages
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-300'
                                        : 'bg-white text-gray-700 hover:bg-red-50 hover:text-red-600 border-gray-300 hover:border-red-300 shadow-sm hover:shadow-md'}`}
                            >
                                Next
                                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                                </svg>
                            </button>
                        </div>

                        {/* Page Info */}
                        <div className="text-sm text-gray-600">
                            Showing <span className="font-medium text-gray-900">{indexOfFirstItem + 1}</span> to{' '}
                            <span className="font-medium text-gray-900">{Math.min(indexOfLastItem, filteredNews.length)}</span> of{' '}
                            <span className="font-medium text-gray-900">{filteredNews.length}</span> results
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default News;