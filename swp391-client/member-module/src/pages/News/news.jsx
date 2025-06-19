import React, { useState } from 'react';
import { FaSearch, FaCalendarAlt, FaEye, FaShareAlt, FaBookmark, FaFilter, FaExternalLinkAlt, FaTimes, FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';

const News = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedNews, setSelectedNews] = useState(null); // State cho modal
    const [isModalOpen, setIsModalOpen] = useState(false); // State cho modal

    // Number of items per page
    const itemsPerPage = 6;

    // Sample news data - replace with API call later
    const [newsArticles, setNewsArticles] = useState([
        {
            id: 1,
            title: "Tệ nạn ma túy và một số biện pháp phòng tránh",
            summary: "Bài viết phân tích về tệ nạn ma túy trong xã hội hiện nay và các biện pháp phòng tránh hiệu quả, đặc biệt tập trung vào việc bảo vệ trẻ em khỏi tác hại của ma túy.",
            content: `
                <div class="space-y-4">
                    <h2 class="text-xl font-semibold text-gray-800">Tình hình tệ nạn ma túy hiện nay</h2>
                    <p>Tệ nạn ma túy đang ngày càng phức tạp và có xu hướng gia tăng trong xã hội hiện nay. Việc sử dụng ma túy không chỉ gây tác hại nghiêm trọng đến sức khỏe của người sử dụng mà còn ảnh hưởng tiêu cực đến gia đình và xã hội.</p>
                    
                    <h3 class="text-lg font-semibold text-gray-800">Nguyên nhân dẫn đến tệ nạn ma túy</h3>
                    <ul class="list-disc list-inside space-y-2">
                        <li>Thiếu hiểu biết về tác hại của ma túy</li>
                        <li>Áp lực cuộc sống, stress, trầm cảm</li>
                        <li>Ảnh hưởng từ bạn bè, môi trường xung quanh</li>
                        <li>Tò mò, muốn thử nghiệm</li>
                        <li>Điều kiện kinh tế khó khăn</li>
                    </ul>
                    
                    <h3 class="text-lg font-semibold text-gray-800">Các biện pháp phòng tránh</h3>
                    <ol class="list-decimal list-inside space-y-2">
                        <li><strong>Tuyên truyền giáo dục:</strong> Nâng cao nhận thức về tác hại của ma túy</li>
                        <li><strong>Tăng cường quản lý:</strong> Kiểm soát chặt chẽ các hoạt động liên quan đến ma túy</li>
                        <li><strong>Hỗ trợ tâm lý:</strong> Tư vấn, hỗ trợ những người có nguy cơ</li>
                        <li><strong>Phối hợp đa ngành:</strong> Sự phối hợp giữa các cơ quan, tổ chức</li>
                        <li><strong>Xây dựng môi trường lành mạnh:</strong> Tạo điều kiện cho hoạt động tích cực</li>
                    </ol>
                    
                    <p>Việc phòng chống tệ nạn ma túy cần sự chung tay của toàn xã hội, từ gia đình, nhà trường đến cộng đồng và các cơ quan chức năng.</p>
                </div>
            `,
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
            content: `
                <div class="space-y-4">
                    <h2 class="text-xl font-semibold text-gray-800">Biện pháp phòng chống ma túy trong trường học</h2>
                    <p>Môi trường giáo dục đóng vai trò quan trọng trong việc phòng chống tệ nạn ma túy. Các trường học cần có những biện pháp cụ thể và hiệu quả.</p>
                    
                    <h3 class="text-lg font-semibold text-gray-800">Các biện pháp cụ thể</h3>
                    <ul class="list-disc list-inside space-y-2">
                        <li>Tổ chức các buổi tuyên truyền, giáo dục về tác hại của ma túy</li>
                        <li>Xây dựng quy chế, nội quy nghiêm cấm ma túy trong trường</li>
                        <li>Tăng cường công tác quản lý học sinh</li>
                        <li>Phối hợp với gia đình trong việc giáo dục</li>
                        <li>Tổ chức các hoạt động tích cực, lành mạnh</li>
                    </ul>
                    
                    <h3 class="text-lg font-semibold text-gray-800">Trách nhiệm của nhà trường</h3>
                    <p>Nhà trường có trách nhiệm xây dựng môi trường giáo dục lành mạnh, an toàn, tạo điều kiện cho học sinh phát triển toàn diện.</p>
                </div>
            `,
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
            content: `
                <div class="space-y-4">
                    <h2 class="text-xl font-semibold text-gray-800">Các mức phạt tội vận chuyển trái phép chất ma túy</h2>
                    
                    <h3 class="text-lg font-semibold text-gray-800">Khung hình phạt theo Luật Hình sự</h3>
                    <div class="bg-yellow-50 p-4 rounded-lg">
                        <h4 class="font-semibold text-gray-800">Tội vận chuyển trái phép chất ma túy (Điều 249)</h4>
                        <ul class="list-disc list-inside space-y-1 mt-2">
                            <li>Phạt tù từ 2 năm đến 7 năm</li>
                            <li>Phạt tù từ 7 năm đến 15 năm (tình tiết tăng nặng)</li>
                            <li>Phạt tù từ 15 năm đến 20 năm hoặc tù chung thân</li>
                        </ul>
                    </div>
                    
                    <h3 class="text-lg font-semibold text-gray-800">Các tình tiết tăng nặng</h3>
                    <ul class="list-disc list-inside space-y-2">
                        <li>Có tổ chức</li>
                        <li>Tái phạm nguy hiểm</li>
                        <li>Lợi dụng chức vụ, quyền hạn</li>
                        <li>Sử dụng người dưới 16 tuổi</li>
                        <li>Qua biên giới</li>
                    </ul>
                </div>
            `,
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
            content: `
                <div class="space-y-4">
                    <h2 class="text-xl font-semibold text-gray-800">Xử phạt hành vi tàng trữ ma túy</h2>
                    
                    <h3 class="text-lg font-semibold text-gray-800">Phân biệt mục đích sử dụng và buôn bán</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="bg-blue-50 p-4 rounded-lg">
                            <h4 class="font-semibold text-blue-800">Tàng trữ để sử dụng</h4>
                            <ul class="list-disc list-inside text-sm mt-2">
                                <li>Phạt cảnh cáo hoặc phạt tiền</li>
                                <li>Cải tạo không giam giữ đến 3 năm</li>
                                <li>Phạt tù đến 2 năm</li>
                            </ul>
                        </div>
                        <div class="bg-red-50 p-4 rounded-lg">
                            <h4 class="font-semibold text-red-800">Tàng trữ để buôn bán</h4>
                            <ul class="list-disc list-inside text-sm mt-2">
                                <li>Phạt tù từ 2 năm đến 7 năm</li>
                                <li>Phạt tù từ 7 năm đến 15 năm</li>
                                <li>Phạt tù từ 15 năm đến 20 năm</li>
                            </ul>
                        </div>
                    </div>
                    
                    <p class="text-gray-600 italic">Việc xác định mục đích tàng trữ dựa trên khối lượng, loại ma túy và các chứng cứ khác.</p>
                </div>
            `,
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
            content: `
                <div class="space-y-4">
                    <h2 class="text-xl font-semibold text-gray-800">Tình hình nghiện ma túy tại TP.HCM</h2>
                    
                    <div class="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
                        <h3 class="text-lg font-semibold text-red-800">Số liệu báo động</h3>
                        <ul class="list-disc list-inside space-y-1 mt-2">
                            <li>Số người nghiện tăng 15% so với năm trước</li>
                            <li>70% người nghiện trong độ tuổi 16-35</li>
                            <li>Tỷ lệ tái nghiện cao (45%)</li>
                        </ul>
                    </div>
                    
                    <h3 class="text-lg font-semibold text-gray-800">Xu hướng trẻ hóa</h3>
                    <p>Đáng lo ngại, độ tuổi bắt đầu sử dụng ma túy ngày càng giảm, nhiều trường hợp từ 14-16 tuổi đã tiếp xúc với chất kích thích.</p>
                    
                    <h3 class="text-lg font-semibold text-gray-800">Nguyên nhân chính</h3>
                    <ul class="list-disc list-inside space-y-2">
                        <li>Tác động của mạng xã hội và internet</li>
                        <li>Áp lực học tập, cuộc sống</li>
                        <li>Thiếu sự quan tâm của gia đình</li>
                        <li>Môi trường sống không lành mạnh</li>
                    </ul>
                </div>
            `,
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
            content: `
                <div class="space-y-4">
                    <h2 class="text-xl font-semibold text-gray-800">Xu hướng trẻ hóa trong nghiện ma túy</h2>
                    
                    <div class="bg-orange-50 p-4 rounded-lg">
                        <h3 class="text-lg font-semibold text-orange-800">Thống kê đáng lo ngại</h3>
                        <div class="grid grid-cols-2 gap-4 mt-2">
                            <div class="text-center">
                                <div class="text-2xl font-bold text-orange-600">65%</div>
                                <div class="text-sm">Người nghiện dưới 30 tuổi</div>
                            </div>
                            <div class="text-center">
                                <div class="text-2xl font-bold text-orange-600">18 tuổi</div>
                                <div class="text-sm">Độ tuổi trung bình bắt đầu</div>
                            </div>
                        </div>
                    </div>
                    
                    <h3 class="text-lg font-semibold text-gray-800">Tác động đến xã hội</h3>
                    <p>Người nghiện người dùng phải đối mặt với những rủi ro lớn hơn của:</p>
                    <ul class="list-disc list-inside space-y-1">
                        <li>Bỏ học, thất nghiệp</li>
                        <li>Tệ nạn xã hội khác</li>
                        <li>Tác động đến gia đình</li>
                        <li>Chi phí điều trị cao</li>
                    </ul>
                </div>
            `,
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
            content: `
                <div class="space-y-4">
                    <h2 class="text-xl font-semibold text-gray-800">Chương trình "Áo giáp" phòng chống ma túy</h2>
                    
                    <h3 class="text-lg font-semibold text-gray-800">Mục tiêu chương trình</h3>
                    <div class="bg-green-50 p-4 rounded-lg">
                        <ul class="list-disc list-inside space-y-2">
                            <li>Trang bị kiến thức cơ bản về tác hại của ma túy</li>
                            <li>Nâng cao kỹ năng từ chối và tự bảo vệ</li>
                            <li>Xây dựng lối sống tích cực, lành mạnh</li>
                            <li>Tạo môi trường học tập an toàn</li>
                        </ul>
                    </div>
                    
                    <h3 class="text-lg font-semibold text-gray-800">Nội dung chương trình</h3>
                    <ol class="list-decimal list-inside space-y-2">
                        <li>Tuyên truyền về tác hại của ma túy</li>
                        <li>Kỹ năng nhận biết và tránh xa ma túy</li>
                        <li>Xây dựng mạng lưới hỗ trợ</li>
                        <li>Tư vấn tâm lý cho sinh viên</li>
                    </ol>
                    
                    <p class="text-green-700 font-medium">Chương trình đã thu hút hơn 10,000 sinh viên tham gia và nhận được phản hồi tích cực.</p>
                </div>
            `,
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
        { id: 'prosecution', name: 'Prosecution' },
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

    // Hàm mở modal thay vì chuyển trang
    const handleNewsClick = (article) => {
        setSelectedNews(article);
        setIsModalOpen(true);
        // Prevent body scroll when modal is open
        document.body.style.overflow = 'hidden';
    };

    // Hàm đóng modal
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedNews(null);
        // Restore body scroll
        document.body.style.overflow = 'unset';
    };

    // Hàm mở link external
    const openExternalLink = (url) => {
        window.open(url, '_blank', 'noopener,noreferrer');
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
                                    <div className="relative bg-gray-50">
                                        <img
                                            src={article.image}
                                            alt={article.title}
                                            className="w-full h-64 object-contain"
                                            onError={(e) => {
                                                e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
                                            }}
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
                                    <div className="relative bg-gray-50 flex items-center justify-center min-h-[200px]">
                                        <img
                                            src={article.image}
                                            alt={article.title}
                                            className="max-w-full max-h-[200px] object-contain"
                                            onError={(e) => {
                                                e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
                                            }}
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

            {/* NEWS DETAIL MODAL */}
            {isModalOpen && selectedNews && (
                <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="relative bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                                News Details
                                {selectedNews.isExternal && (
                                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                                        <FaExternalLinkAlt className="text-xs" />
                                        External
                                    </span>
                                )}
                            </h2>
                            <button
                                onClick={closeModal}
                                className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
                            >
                                <FaTimes size={20} />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6">
                            {/* News Image */}
                            <div className="mb-6 bg-gray-50 rounded-lg p-4 flex items-center justify-center">
                                <img
                                    src={selectedNews.image}
                                    alt={selectedNews.title}
                                    className="max-w-full max-h-80 object-contain rounded-lg"
                                    onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/600x400?text=Image+Not+Found';
                                    }}
                                />
                            </div>

                            {/* News Title */}
                            <h1 className="text-3xl font-bold text-gray-800 mb-4">
                                {selectedNews.title}
                            </h1>

                            {/* News Meta */}
                            <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <FaUser className="text-gray-400" />
                                    <span className="font-medium">{selectedNews.author}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FaCalendarAlt className="text-gray-400" />
                                    <span>{new Date(selectedNews.date).toLocaleDateString('vi-VN')}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FaEye className="text-gray-400" />
                                    <span>{selectedNews.views} views</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-medium">
                                        {categories.find(c => c.id === selectedNews.category)?.name || selectedNews.category}
                                    </span>
                                </div>
                            </div>

                            {/* News Summary */}
                            <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
                                <h3 className="font-semibold text-blue-800 mb-2">Summary</h3>
                                <p className="text-blue-700 leading-relaxed">{selectedNews.summary}</p>
                            </div>

                            {/* News Content */}
                            <div className="prose prose-lg max-w-none">
                                <div
                                    className="text-gray-700 leading-relaxed"
                                    dangerouslySetInnerHTML={{ __html: selectedNews.content }}
                                />
                            </div>

                            {/* External Link Button */}
                            {selectedNews.isExternal && selectedNews.externalLink && (
                                <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                    <h4 className="font-semibold text-blue-800 mb-2">External Source</h4>
                                    <p className="text-blue-700 text-sm mb-3">
                                        For more detailed information, you can visit the original source:
                                    </p>
                                    <button
                                        onClick={() => openExternalLink(selectedNews.externalLink)}
                                        className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        <FaExternalLinkAlt />
                                        Visit Original Article
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <button className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors">
                                    <FaBookmark />
                                    Bookmark
                                </button>
                                <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
                                    <FaShareAlt />
                                    Share
                                </button>
                            </div>
                            <button
                                onClick={closeModal}
                                className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </>
    );
};

export default News;