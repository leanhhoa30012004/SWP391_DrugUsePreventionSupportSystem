import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaBlog, FaSearch, FaTimes } from 'react-icons/fa';

const statusColor = {
  Approved: 'bg-green-100 text-green-700',
  Rejected: 'bg-red-100 text-red-700',
  Pending: 'bg-yellow-100 text-yellow-700',
};

const BlogsManagement = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [rejectingBlogId, setRejectingBlogId] = useState(null);
  const [modalImage, setModalImage] = useState(null); // <--- Thêm state cho modal ảnh
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const user = JSON.parse(localStorage.getItem('user'));
  const manager_id = user?.user_id;

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/blog/getAllPendingBlog', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBlogs(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError('Failed to load blog list!');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (blog_id) => {
    if (!manager_id) {
      alert('Manager ID not found!');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      await axios.get(`/api/blog/approval-blog/${manager_id}/${blog_id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchBlogs();
    } catch (err) {
      alert('Approve failed!');
    }
  };

  const handleReject = async (blog_id, reason) => {
    if (!manager_id) {
      alert('Manager ID not found!');
      return;
    }
    if (!reason || !reason.trim()) {
      alert('Please enter a reject reason!');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      await axios.post(`/api/blog/reject-blog/${manager_id}/${blog_id}`, { reject_reason: reason }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Reject reason:', reason);
      alert('Blog rejected successfully!');
      setRejectingBlogId(null);
      fetchBlogs();
    } catch (err) {
      alert('Reject failed!');
    }
  };

  // Filter blogs based on search and filters
  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = search === '' ||
      blog.title?.toLowerCase().includes(search.toLowerCase()) ||
      blog.content?.toLowerCase().includes(search.toLowerCase()) ||
      blog.fullname?.toLowerCase().includes(search.toLowerCase()) ||
      blog.tags?.toLowerCase().includes(search.toLowerCase()); // Thêm search theo tags

    const matchesStatus = statusFilter === 'All' || blog.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="h-full w-full flex flex-col bg-gradient-to-br from-[#faf5ff] via-[#f3e8ff] to-[#f8fafc] p-0 rounded-2xl shadow-lg">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-8 py-8 bg-white rounded-t-3xl shadow border-b border-[#e11d48]/20">
        <div className="flex items-center gap-4">
          <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg border-2 border-[#e11d48]/30">
            <FaBlog className="text-4xl text-[#e11d48]" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#e11d48] mb-1 drop-shadow">Blog Management</h1>
            <p className="text-black text-sm md:text-base max-w-xl font-medium">
              View, approve, and manage all blogs for your organization in one place.
            </p>
          </div>
        </div>
      </div>

      {/* Toolbar: Search & Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 px-6 py-3 bg-white border-b border-[#e11d48]/10">
        <div className="flex items-center gap-2 bg-[#fff1f2] rounded-xl px-3 py-2 shadow w-full md:w-1/3 border border-[#e11d48]/10">
          <FaSearch className="text-[#e11d48]" />
          <input
            type="text"
            placeholder="Search blogs, authors, content, or tags..."
            className="outline-none border-none flex-1 bg-transparent text-black"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <select
            className="rounded-lg border border-[#e11d48]/20 px-3 py-2 text-sm text-black focus:ring-[#e11d48] focus:border-[#e11d48]"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Blog Table */}
      <div className="overflow-auto rounded-b-2xl shadow bg-white mt-0 flex-1 border border-[#e11d48]/10">
        {error && (
          <div className="text-red-500 mb-4 p-4 bg-red-50 rounded-lg border border-red-200">
            <div className="font-semibold">Error:</div>
            <div>{error}</div>
          </div>
        )}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e11d48]"></div>
            <span className="ml-3 text-gray-600">Loading blogs...</span>
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <FaBlog className="text-6xl text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No blogs found</h3>
            <p className="text-gray-400">
              {search || statusFilter !== 'All'
                ? 'Try adjusting your search or filter criteria.'
                : 'No blogs have been submitted yet.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-[#fff1f2] text-[#e11d48] border-b border-[#e11d48]/20">
                <tr>
                  <th className="px-4 py-3 font-bold">Blog Info</th>
                  <th className="px-4 py-3 font-bold">Image</th>
                  <th className="px-4 py-3 font-bold">Tags</th>
                  <th className="px-4 py-3 font-bold">Content</th>
                  <th className="px-4 py-3 font-bold">Status</th>
                  <th className="px-4 py-3 font-bold">Approved By</th>
                  <th className="px-4 py-3 font-bold">Approved At</th>
                  <th className="px-4 py-3 font-bold">Active</th>
                  <th className="px-4 py-3 font-bold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBlogs.map(blog => (
                  <tr key={blog.blog_id} className="border-b last:border-b-0 hover:bg-[#fff1f2] transition">
                    <td className="px-4 py-3 max-w-xs whitespace-normal break-words">
                      <div className="font-bold text-[#e11d48] whitespace-normal break-words text-sm" title={blog.title}>{blog.title}</div>
                      <div className="text-xs text-gray-500 mt-1 whitespace-normal break-words">by {blog.fullname}</div>
                    </td>
                    <td className="px-4 py-3">
                      {blog.cover_img ? (
                        <button onClick={() => setModalImage(blog.cover_img)} className="focus:outline-none">
                          <img src={blog.cover_img} alt="blog" className="w-16 h-16 object-cover rounded shadow hover:scale-110 transition-transform duration-200" />
                        </button>
                      ) : (
                        <span className="text-gray-400 italic text-sm">No image</span>
                      )}
                    </td>
                    <td className="px-4 py-3 max-w-sm">
                      {blog.tags ? (
                        <div className="flex flex-wrap gap-1">
                          {blog.tags.split(',').map((tag, index) => (
                            <span
                              key={index}
                              className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-medium"
                              title={tag.trim()}
                            >
                              #{tag.trim()}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 italic">No tags</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-700 max-w-md whitespace-normal break-words text-sm" title={blog.content}>{blog.content}</td>
                    <td className="px-4 py-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor[blog.status] || 'bg-gray-100 text-gray-500'}`}>{blog.status}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-700 text-sm">{blog.manager_id || '-'}</td>
                    <td className="px-4 py-3 text-gray-700 text-sm">{blog.approval_date ? blog.approval_date.slice(0, 19).replace('T', ' ') : '-'}</td>
                    <td className="px-4 py-3 text-gray-700 text-sm">{blog.is_active ? 'Active' : 'Inactive'}</td>
                    <td className="px-4 py-3 text-center align-middle">
                      {blog.status === 'Pending' && (
                        <div className="flex flex-col items-center gap-2">
                          <button onClick={() => handleApprove(blog.blog_id)} className="bg-green-600 hover:bg-green-700 text-white text-sm font-semibold p-2 rounded-lg shadow w-24">Approve</button>
                          <button
                            onClick={() => {
                              setRejectingBlogId(blog.blog_id);
                              setRejectReason('');
                            }}
                            className="bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-semibold p-2 rounded-lg shadow w-24"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                      {rejectingBlogId === blog.blog_id && (
                        <div className="flex flex-col gap-2 mt-2 items-center">
                          <input
                            type="text"
                            value={rejectReason}
                            onChange={e => setRejectReason(e.target.value)}
                            placeholder="Enter reject reason..."
                            className="border px-2 py-1 rounded w-full text-sm"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleReject(blog.blog_id, rejectReason)}
                              className="bg-red-600 hover:bg-red-700 text-white text-sm font-semibold p-2 rounded-lg shadow"
                              disabled={!rejectReason.trim()}
                            >
                              Confirm Reject
                            </button>
                            <button
                              onClick={() => setRejectingBlogId(null)}
                              className="bg-gray-500 hover:bg-gray-600 text-white text-sm font-semibold p-2 rounded-lg shadow"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {/* Modal xem ảnh lớn */}
      {
        modalImage && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setModalImage(null)}>
            <div className="relative" onClick={e => e.stopPropagation()}>
              <button
                className="absolute -top-2 -right-2 text-white bg-red-500 hover:bg-red-600 rounded-full w-8 h-8 flex items-center justify-center transition-all duration-200 shadow-lg"
                onClick={() => setModalImage(null)}
                title="Close"
              >
                <FaTimes className="text-sm" />
              </button>
              <img
                src={modalImage}
                alt="blog large"
                className="rounded-xl shadow-xl max-w-[90vw] max-h-[80vh] object-contain bg-white"
              />
            </div>
          </div>
        )
      }
    </div >
  );
};

export default BlogsManagement; 