import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaBlog } from 'react-icons/fa';

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
      await axios.post(`/api/blog/reject-blog/${manager_id}/${blog_id}`, { reason }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRejectingBlogId(null);
      fetchBlogs();
    } catch (err) {
      alert('Reject failed!');
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto flex flex-col gap-3">
        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 flex flex-col gap-2 md:flex-row md:items-center md:gap-5 mb-0">
          <div className="bg-[#e11d48]/10 rounded-full p-5 text-4xl text-[#e11d48] flex items-center justify-center mb-4 md:mb-0">
            <FaBlog />
          </div>
          <div>
            <h2 className="text-3xl font-extrabold text-[#e11d48] tracking-tight mb-1">Blog Management</h2>
            <p className="text-gray-500 text-base">View, approve, and manage all blogs for your organization in one place.</p>
          </div>
        </div>
        {/* Table Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          {loading ? (
            <div className="text-center text-lg text-gray-500">Loading...</div>
          ) : error ? (
            <div className="text-center text-red-500 font-semibold">{error}</div>
          ) : blogs.length === 0 ? (
            <div className="text-center text-gray-400">No blogs found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-xl shadow border">
                <thead>
                  <tr className="bg-pink-50 text-[#e11d48] text-base">
                    <th className="py-3 px-4 border-b font-semibold text-left">Title</th>
                    <th className="py-3 px-4 border-b font-semibold text-left">Content</th>
                    <th className="py-3 px-4 border-b font-semibold text-left">Author</th>
                    <th className="py-3 px-4 border-b font-semibold text-left">Status</th>
                    <th className="py-3 px-4 border-b font-semibold text-left">Approved By</th>
                    <th className="py-3 px-4 border-b font-semibold text-left">Approved At</th>
                    <th className="py-3 px-4 border-b font-semibold text-left">Active</th>
                    <th className="py-3 px-4 border-b font-semibold text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {blogs.map(blog => (
                    <tr key={blog.blog_id} className="hover:bg-gray-50 transition">
                      <td className="py-2 px-4 border-b font-bold text-[#e11d48] max-w-xs truncate" title={blog.title}>{blog.title}</td>
                      <td className="py-2 px-4 border-b text-gray-700 max-w-md truncate" title={blog.content}>{blog.content?.length > 120 ? blog.content.slice(0, 120) + '...' : blog.content}</td>
                      <td className="py-2 px-4 border-b text-gray-700">{blog.fullname}</td>
                      <td className="py-2 px-4 border-b">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor[blog.status] || 'bg-gray-100 text-gray-500'}`}>{blog.status}</span>
                      </td>
                      <td className="py-2 px-4 border-b text-gray-700">{blog.manager_id || '-'}</td>
                      <td className="py-2 px-4 border-b text-gray-700">{blog.approval_date ? blog.approval_date.slice(0, 19).replace('T', ' ') : '-'}</td>
                      <td className="py-2 px-4 border-b text-gray-700">{blog.is_active ? 'Active' : 'Inactive'}</td>
                      <td className="py-2 px-4 border-b">
                        {blog.status === 'Pending' && (
                          <div className="flex gap-2">
                            <button onClick={() => handleApprove(blog.blog_id)} className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-1.5 rounded-lg shadow">Approve</button>
                            <button
                              onClick={() => {
                                setRejectingBlogId(blog.blog_id);
                                setRejectReason('');
                              }}
                              className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-4 py-1.5 rounded-lg shadow"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                        {rejectingBlogId === blog.blog_id && (
                          <div className="flex flex-col gap-2 mt-2">
                            <input
                              type="text"
                              value={rejectReason}
                              onChange={e => setRejectReason(e.target.value)}
                              placeholder="Enter reject reason..."
                              className="border px-2 py-1 rounded"
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleReject(blog.blog_id, rejectReason)}
                                className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-1.5 rounded-lg shadow"
                                disabled={!rejectReason.trim()}
                              >
                                Confirm Reject
                              </button>
                              <button
                                onClick={() => setRejectingBlogId(null)}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold px-4 py-1.5 rounded-lg shadow"
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
      </div>
    </div>
  );
};

export default BlogsManagement; 