import React, { useState, useRef, useEffect } from 'react';
import { FaImage } from 'react-icons/fa';

const CreateBlogForm = ({ onPostSuccess }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState('');
    const [selectedTag, setSelectedTag] = useState(''); // Chỉ 1 tag
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [coverImg, setCoverImg] = useState(null);
    const [previewImg, setPreviewImg] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const dropdownRef = useRef(null);

    // Predefined tags based on WeHope categories
    const predefinedTags = [
        'Addiction',
        'Prevention', 
        'Recovery',
        'Family Support',
        'Community',
        'Mental Health',
        'Drug Education',
        'Rehabilitation',
        'Support Groups',
        'Health Awareness',
        'Social Issues',
        'Youth Protection'
    ];

    // TODO: Lấy author từ localStorage hoặc context (giả sử user_id = 1)
    const author = localStorage.getItem('user_id') || 1;

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

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

    const handleTagSelect = (tag) => {
        setSelectedTag(tag);
        setTags(tag);
        setIsDropdownOpen(false); // Đóng dropdown sau khi chọn
    };

    const handleTagRemove = () => {
        setSelectedTag('');
        setTags('');
    };

    const handleCustomTagInput = (e) => {
        const value = e.target.value;
        setTags(value);
        setSelectedTag(value.trim());
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
            setSelectedTag('');
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
                        
                        {/* Tags Section with Dropdown */}
                        <div className="relative" ref={dropdownRef}>
                            <div className="flex items-center gap-2 mb-2">
                                <input
                                    type="text"
                                    className="flex-1 border border-gray-200 focus:border-red-400 outline-none text-base px-4 py-2 rounded-lg shadow-sm"
                                    placeholder="Enter tag or select from dropdown"
                                    value={tags}
                                    onChange={handleCustomTagInput}
                                />
                                <button
                                    type="button"
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm font-medium whitespace-nowrap"
                                >
                                    {isDropdownOpen ? 'Close' : 'Select Tag'}
                                </button>
                            </div>

                            {/* Selected Tag Display */}
                            {selectedTag && (
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium inline-flex items-center gap-2">
                                        #{selectedTag}
                                        <button
                                            type="button"
                                            onClick={handleTagRemove}
                                            className="text-red-500 hover:text-red-700 font-bold text-lg leading-none"
                                        >
                                            ×
                                        </button>
                                    </span>
                                </div>
                            )}

                            {/* Dropdown Menu */}
                            {isDropdownOpen && (
                                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                                    <div className="p-2">
                                        <div className="text-xs text-gray-500 font-semibold mb-2 px-2 flex justify-between items-center">
                                            <span>SUGGESTED TAGS</span>
                                            <span className="text-blue-600">Select one tag</span>
                                        </div>
                                        {predefinedTags.map((tag, index) => (
                                            <button
                                                key={index}
                                                type="button"
                                                onClick={() => handleTagSelect(tag)}
                                                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                                                    selectedTag === tag
                                                        ? 'bg-red-100 text-red-700 font-medium'
                                                        : 'hover:bg-red-50 hover:text-red-600'
                                                }`}
                                            >
                                                {selectedTag === tag ? '● ' : ''}#{tag}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

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