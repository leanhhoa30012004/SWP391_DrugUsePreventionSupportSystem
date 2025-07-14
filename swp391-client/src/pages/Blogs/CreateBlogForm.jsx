import React, { useState } from 'react';
import { FaImage } from 'react-icons/fa';

const CreateBlogForm = ({ onPostSuccess }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState('');
    const [coverImg, setCoverImg] = useState(null);
    const [previewImg, setPreviewImg] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // TODO: Lấy author từ localStorage hoặc context (giả sử user_id = 1)
    const author = localStorage.getItem('user_id') || 1;

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setCoverImg(file);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setPreviewImg(reader.result);
            reader.readAsDataURL(file);
        } else {
            setPreviewImg(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            const formData = new FormData();
            formData.append('author', author);
            formData.append('title', title);
            formData.append('tags', tags);
            formData.append('content', content);
            if (coverImg) formData.append('cover_img', coverImg);

            const res = await fetch('/api/blog/blogPost', {
                method: 'POST',
                body: formData,
            });
            if (!res.ok) throw new Error('Failed to create blog!');
            setSuccess('Blog posted successfully!');
            setTitle('');
            setContent('');
            setTags('');
            setCoverImg(null);
            setPreviewImg(null);
            if (onPostSuccess) onPostSuccess();
        } catch (err) {
            setError(err.message || 'Failed to create blog!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-10 max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="flex items-start gap-5">
                    <div className="w-14 h-14 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-2xl uppercase shadow-md">
                        <span>U</span>
                    </div>
                    <div className="flex-1 flex flex-col gap-3">
                        <input
                            type="text"
                            className="w-full border border-gray-200 focus:border-red-400 outline-none text-xl font-semibold px-4 py-3 rounded-lg transition mb-1 shadow-sm"
                            placeholder="Title..."
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            required
                        />
                        <textarea
                            className="w-full border border-gray-200 focus:border-red-400 outline-none resize-none min-h-[70px] px-4 py-3 rounded-lg text-base shadow-sm"
                            placeholder="What's on your mind?"
                            value={content}
                            onChange={e => setContent(e.target.value)}
                            required
                        />
                        <input
                            type="text"
                            className="w-full border border-gray-200 focus:border-red-400 outline-none text-base px-4 py-2 rounded-lg shadow-sm"
                            placeholder="Tags (comma separated)"
                            value={tags}
                            onChange={e => setTags(e.target.value)}
                        />
                        <div className="flex items-center gap-4 mt-1">
                            <label className="cursor-pointer flex items-center gap-2 text-red-500 font-medium hover:underline">
                                <FaImage className="text-xl" />
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageChange}
                                />
                                {coverImg ? 'Change Image' : 'Add Image'}
                            </label>
                            {previewImg && (
                                <div className="">
                                    <img
                                        src={previewImg}
                                        alt="Preview"
                                        className="w-20 h-20 object-cover rounded-xl border shadow"
                                        style={{ background: '#f3f4f6' }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex justify-end gap-2 mt-2">
                    <button
                        type="submit"
                        className="bg-red-500 text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-red-600 transition-colors disabled:opacity-60 shadow-md"
                        disabled={loading}
                    >
                        {loading ? 'Posting...' : 'Post'}
                    </button>
                </div>
                {error && <div className="text-red-500 text-sm text-center font-semibold">{error}</div>}
                {success && <div className="text-green-600 text-sm text-center font-semibold">{success}</div>}
            </form>
        </div>
    );
};

export default CreateBlogForm; 