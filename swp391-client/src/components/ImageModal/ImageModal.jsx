import React, { useState, useEffect } from 'react';
import { FaHeart, FaComment, FaShareAlt, FaTimes, FaUser, FaCalendarAlt } from 'react-icons/fa';

const ImageModal = ({ isOpen, onClose, blog, onLike, likedBlogs, comments, commentInputs, setCommentInputs, handleCommentSubmit }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [imageAspectRatio, setImageAspectRatio] = useState(1); // width/height ratio

    useEffect(() => {
        if (isOpen && blog) {
            setIsLiked(likedBlogs[blog.id] || false);
            setImageError(false); // Reset image error when modal opens
            setImageAspectRatio(1); // Reset aspect ratio
        }
    }, [isOpen, blog, likedBlogs]);

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen || !blog) return null;

    const handleLike = () => {
        setIsLiked(!isLiked);
        onLike(blog.id);
    };

    const handleImageClick = (e) => {
        e.stopPropagation();
    };

    const handleImageError = (e) => {
        setImageError(true);
        e.target.src = 'https://via.placeholder.com/600x400?text=Blog+Image';
    };

    const handleImageLoad = (e) => {
        setImageError(false);
        const img = e.target;
        const aspectRatio = img.naturalWidth / img.naturalHeight;
        setImageAspectRatio(aspectRatio);
    };

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-90 z-[9999] flex items-center justify-center p-2"
            onClick={onClose}
        >
            {/* Close button */}
            <button
                onClick={onClose}
                className="absolute top-4 left-4 text-gray-700 hover:text-gray-900 transition-colors z-[10000] bg-white bg-opacity-90 rounded-full p-3 shadow-lg"
            >
                <FaTimes size={32} />
            </button>

            <div className="flex w-full h-full max-h-[96vh] bg-white overflow-hidden shadow-2xl rounded-lg flex-col lg:flex-row">
                {/* Left side - Image */}
                <div className="flex-1 flex items-center justify-center bg-black relative min-h-[400px] lg:min-h-0">
                    {imageError ? (
                        <div className="text-white text-center">
                            <div className="text-6xl mb-4">📷</div>
                            <div className="text-xl mb-2">Image not available</div>
                            <div className="text-sm text-gray-400">The image could not be loaded</div>
                        </div>
                    ) : (
                        <img
                            src={blog.image || 'https://via.placeholder.com/600x400?text=Blog+Image'}
                            alt={blog.title}
                            className="max-w-full max-h-full object-contain"
                            onClick={handleImageClick}
                            onError={handleImageError}
                            onLoad={handleImageLoad}
                        />
                    )}
                </div>

                {/* Right side - Blog info and comments */}
                <div className="w-full lg:w-[450px] bg-white flex flex-col">
                    {/* Blog header */}
                    <div className="p-8 border-b">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-14 h-14 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-xl uppercase">
                                {blog.author?.charAt(0) || 'U'}
                            </div>
                            <div className="flex-1">
                                <div className="font-bold text-xl text-gray-900">{blog.author}</div>
                                <div className="text-base text-gray-500 flex items-center gap-2">
                                    <FaCalendarAlt size={14} />
                                    {blog.date ? new Date(blog.date).toLocaleDateString() : ''}
                                </div>
                            </div>
                        </div>
                        
                        <h2 className="text-2xl font-semibold text-gray-900 mb-3">{blog.title}</h2>
                        <p className="text-gray-700 text-base whitespace-pre-line leading-relaxed">{blog.content}</p>
                        
                        {blog.tags && blog.tags.length > 0 && (
                            <div className="flex flex-wrap gap-3 mt-4">
                                {blog.tags.map((tag, idx) => (
                                    <span key={idx} className="bg-gray-100 text-gray-600 px-3 py-2 rounded-full text-sm font-medium">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Action buttons */}
                    <div className="px-8 py-6 border-b">
                        <div className="flex items-center gap-8 text-gray-600">
                            <button
                                className={`flex items-center gap-2 transition-colors ${isLiked ? 'text-red-500' : 'hover:text-red-500'}`}
                                onClick={handleLike}
                            >
                                <FaHeart className={`text-2xl ${isLiked ? 'fill-red-500' : ''}`} />
                                <span className="font-semibold text-lg">{blog.likes + (isLiked ? 1 : 0)}</span>
                            </button>
                            <button className="flex items-center gap-2 hover:text-blue-500 transition-colors">
                                <FaComment className="text-2xl" />
                                <span className="font-semibold text-lg">{comments?.length || 0}</span>
                            </button>
                            <button className="flex items-center gap-2 hover:text-green-500 transition-colors">
                                <FaShareAlt className="text-2xl" />
                                <span className="font-semibold text-lg">Share</span>
                            </button>
                        </div>
                    </div>

                    {/* Comments section */}
                    <div className="flex-1 overflow-y-auto p-8">
                        <h3 className="font-semibold text-xl text-gray-900 mb-6">Comments</h3>
                        
                        <div className="space-y-6 mb-6">
                            {comments?.length > 0 ? (
                                comments.map(comment => (
                                    <div key={comment.comment_id} className="flex items-start gap-4">
                                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-white font-bold text-base flex-shrink-0">
                                            {comment.fullname?.charAt(0) || 'U'}
                                        </div>
                                        <div className="flex-1">
                                            <div className="bg-gray-100 rounded-lg px-4 py-3">
                                                <div className="font-semibold text-gray-800 text-base">{comment.fullname}</div>
                                                <div className="text-sm text-gray-500 mb-2">
                                                    {comment.comment_date ? new Date(comment.comment_date).toLocaleString() : ''}
                                                </div>
                                                <div className="text-gray-700 text-base">{comment.content}</div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-gray-500 text-base text-center py-6">
                                    No comments yet. Be the first to comment!
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Comment input */}
                    <div className="p-8 border-t bg-gray-50">
                        <div className="flex items-center gap-3">
                            <input
                                type="text"
                                className="flex-1 border rounded-full px-6 py-3 text-base bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                                placeholder="Write a comment..."
                                value={commentInputs[blog.id] || ''}
                                onChange={e => setCommentInputs(prev => ({ ...prev, [blog.id]: e.target.value }))}
                                onKeyDown={e => { 
                                    if (e.key === 'Enter') handleCommentSubmit(blog.id); 
                                }}
                            />
                            <button
                                className="bg-red-500 text-white px-6 py-3 rounded-full text-base font-semibold hover:bg-red-600 transition-colors"
                                onClick={() => handleCommentSubmit(blog.id)}
                            >
                                Post
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageModal; 