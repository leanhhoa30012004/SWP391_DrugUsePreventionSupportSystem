import React, { useState, useEffect } from 'react';
import { FaSearch, FaCalendarAlt, FaUser, FaEye, FaHeart, FaShareAlt, FaBookmark, FaTags, FaClock, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import CreateBlogForm from './CreateBlogForm';

const Blogs = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [expandedCards, setExpandedCards] = useState(new Set());
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const blogsPerPage = 6;
    const [likedBlogs, setLikedBlogs] = useState({}); // { [blogId]: true }
    const [comments, setComments] = useState({}); // { [blogId]: [comment, ...] }
    const [commentInputs, setCommentInputs] = useState({}); // { [blogId]: '' }
    const [commentLoading, setCommentLoading] = useState({}); // { [blogId]: true/false }

    const fetchBlogs = () => {
        setLoading(true);
        setError(null);
        fetch('/api/blog/get-all-blog-approved')
            .then(res => {
                if (!res.ok) throw new Error('Failed to load blogs!');
                return res.json();
            })
            .then(data => {
                setBlogs(Array.isArray(data) ? data : data.blogs || []);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message || 'Failed to load blogs!');
                setLoading(false);
            });
    };

    // Lấy comment cho blog
    const fetchComments = async (blogId) => {
        setCommentLoading(prev => ({ ...prev, [blogId]: true }));
        try {
            const res = await fetch(`/api/blog/get-all-comment-by-blog-id/${blogId}`);
            const data = await res.json();
            setComments(prev => ({ ...prev, [blogId]: Array.isArray(data) ? data : data.comments || [] }));
        } catch {
            setComments(prev => ({ ...prev, [blogId]: [] }));
        } finally {
            setCommentLoading(prev => ({ ...prev, [blogId]: false }));
        }
    };

    // Gửi comment mới
    const handleCommentSubmit = async (blogId) => {
        const member = JSON.parse(localStorage.getItem('user'));
        const member_id = member.user_id;
        console.log(member_id);
        if (!member_id) {
            alert('Please log in to comment!');
            return;
        }
        const content = commentInputs[blogId]?.trim();
        if (!content) return;
        try {
            await fetch(`/api/blog/comment-blog/${member_id}/${blogId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content }),
            });
            setCommentInputs(prev => ({ ...prev, [blogId]: '' }));
            fetchComments(blogId);
        } catch {
            alert('Failed to post comment!');
        }
    };

    // Khi mount, tự động fetch comment cho từng blog (chỉ khi mở rộng hoặc khi user focus vào input)
    // Để tối ưu, chỉ fetch khi user click "Show comments" hoặc focus vào input
    // Ở đây sẽ fetch luôn khi render (có thể tối ưu sau)
    useEffect(() => {
        if (blogs.length > 0) {
            blogs.forEach(blog => {
                if (blog.blog_id) fetchComments(blog.blog_id);
            });
        }
        // eslint-disable-next-line
    }, [blogs.length]);

    useEffect(() => {
        fetchBlogs();
    }, []);

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

    // Map dữ liệu backend sang format frontend
    const blogsData = blogs.map(blog => ({
        id: blog.blog_id,
        title: blog.title,
        content: blog.content,
        excerpt: blog.content ? blog.content.slice(0, 120) + '...' : '',
        author: blog.fullname || `User #${blog.author}` || 'Unknown',
        date: blog.approval_date || blog.post_date || blog.date,
        category: blog.tags ? blog.tags.split(',')[0]?.trim().toLowerCase().replace(/\s/g, '-') : 'other',
        image: blog.cover_img,
        readTime: '5 min read',
        views: blog.views || 0,
        likes: blog.likes || 0,
        tags: blog.tags ? (typeof blog.tags === 'string' ? blog.tags.split(',').map(t => t.trim()) : blog.tags) : [],
        status: blog.status,
    }));

    // Sắp xếp blogs mới nhất lên trên (KHAI BÁO TRƯỚC KHI DÙNG TRONG useEffect)
    const sortedBlogs = [...blogsData].sort((a, b) => new Date(b.date) - new Date(a.date));

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

    // Xử lý Like blog
    const handleLike = async (blogId) => {
        // Lấy member_id từ localStorage hoặc context (giả sử user_id = 1 nếu chưa đăng nhập)
        const member = JSON.parse(localStorage.getItem('user'));
        const member_id = member.user_id;
        if (!member_id) {
            alert('Please log in to like blogs!');
            return;
        }
        // Optimistic update
        setLikedBlogs(prev => ({ ...prev, [blogId]: !prev[blogId] }));
        // Gọi API like/unlike
        try {
            await fetch(`/api/blog/like-blog/${member_id}/${blogId}`);
            // Không cần xử lý response, số like sẽ được cập nhật ở lần fetch tiếp theo
            // Có thể cập nhật số like ngay trên UI nếu muốn (ở đây chỉ đổi màu icon)
        } catch (err) {
            // Nếu lỗi, revert lại
            setLikedBlogs(prev => ({ ...prev, [blogId]: !!prev[blogId] }));
            alert('Failed to like blog!');
        }
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

    // Loading state
    if (loading) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <span className="text-red-500 text-xl font-semibold">Loading blogs...</span>
                </div>
                <Footer />
            </>
        );
    }

    // Error state
    if (error) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <span className="text-red-500 text-xl font-semibold">{error}</span>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-50">
                <div className="mx-auto px-2 py-10 max-w-[700px]">
                    {/* Create Blog Form */}
                    <CreateBlogForm onPostSuccess={fetchBlogs} />

                    {/* Newsfeed Blogs */}
                    {sortedBlogs.length === 0 ? (
                        <div className="bg-white rounded-2xl shadow-lg p-12 text-center mt-8">
                            <p className="text-gray-600 text-lg">No blogs found.</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-10 mt-6">
                            {sortedBlogs.map(blog => (
                                <div key={blog.id} className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-200">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-14 h-14 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-2xl uppercase">
                                            {blog.author?.charAt(0) || 'U'}
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-bold text-xl text-gray-900">{blog.author}</div>
                                            <div className="text-xs text-gray-400">{blog.date ? new Date(blog.date).toLocaleString() : ''}</div>
                                        </div>
                                        {/* Status badge */}
                                        <div>
                                            {blog.status === 'Approved' && <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">Approved</span>}
                                            {blog.status === 'Pending' && <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold">Pending</span>}
                                            {blog.status === 'Rejected' && <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-semibold">Rejected</span>}
                                        </div>
                                    </div>
                                    <div className="text-2xl font-semibold text-gray-900 mb-2">{blog.title}</div>
                                    <div className="text-gray-700 text-base mb-4 whitespace-pre-line">{blog.content}</div>
                                    {blog.image && (
                                        <img src={import.meta.env.VITE_API_URL + `/uploads/${blog.image}`} alt="cover" className="w-full rounded-xl mb-4 object-cover max-h-96 border" onError={e => { e.target.src = 'https://via.placeholder.com/600x400?text=Blog+Image' }} />
                                    )}
                                    {blog.tags && blog.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            {blog.tags.map((tag, idx) => (
                                                <span key={idx} className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">#{tag}</span>
                                            ))}
                                        </div>
                                    )}
                                    <div className="flex items-center gap-10 mt-6 text-gray-500 text-xl">
                                        <button
                                            className={`flex items-center gap-2 transition font-semibold group ${likedBlogs[blog.id] ? 'text-red-500' : 'hover:text-red-500'}`}
                                            onClick={() => handleLike(blog.id)}
                                        >
                                            <FaHeart className={`text-2xl group-hover:scale-110 transition-transform ${likedBlogs[blog.id] ? 'fill-red-500' : ''}`} />
                                            <span className="text-lg">{blog.likes + (likedBlogs[blog.id] ? 1 : 0)}</span>
                                        </button>
                                        <button className="flex items-center gap-2 hover:text-blue-500 transition font-semibold group">
                                            <FaEye className="text-2xl group-hover:scale-110 transition-transform" />
                                            <span className="text-lg">0</span>
                                        </button>
                                        <button className="flex items-center gap-2 hover:text-green-500 transition font-semibold group">
                                            <FaShareAlt className="text-2xl group-hover:scale-110 transition-transform" />
                                            <span className="text-lg">Share</span>
                                        </button>
                                    </div>
                                    {/* Comment section */}
                                    <div className="mt-8 border-t pt-5">
                                        <div className="text-xs text-gray-400 mb-2">Comments</div>
                                        <div className="flex flex-col gap-2 mb-3">
                                            {commentLoading[blog.id] ? (
                                                <div className="text-gray-400 text-sm">Loading comments...</div>
                                            ) : comments[blog.id]?.length > 0 ? (
                                                comments[blog.id].map(c => (
                                                    <div key={c.comment_id} className="flex items-start gap-3">
                                                        <div className="w-9 h-9 bg-gray-300 rounded-full flex items-center justify-center text-white font-bold text-base">
                                                            {c.fullname?.charAt(0) || 'U'}
                                                        </div>
                                                        <div className="bg-gray-100 rounded-xl px-4 py-2 flex-1">
                                                            <div className="font-semibold text-gray-800 text-sm">{c.fullname}</div>
                                                            <div className="text-xs text-gray-500 mb-1">{c.comment_date ? new Date(c.comment_date).toLocaleString() : ''}</div>
                                                            <div className="text-gray-700 text-sm">{c.content}</div>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="text-gray-400 text-sm">No comments yet.</div>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 mt-2">
                                            <input
                                                type="text"
                                                className="w-full border rounded-full px-5 py-3 text-base bg-gray-50"
                                                placeholder="Write a comment..."
                                                value={commentInputs[blog.id] || ''}
                                                onChange={e => setCommentInputs(prev => ({ ...prev, [blog.id]: e.target.value }))}
                                                onKeyDown={e => { if (e.key === 'Enter') handleCommentSubmit(blog.id); }}
                                            />
                                            <button
                                                className="bg-red-500 text-white px-4 py-2 rounded-full font-semibold hover:bg-red-600 transition-colors"
                                                onClick={() => handleCommentSubmit(blog.id)}
                                            >
                                                Post
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Blogs;