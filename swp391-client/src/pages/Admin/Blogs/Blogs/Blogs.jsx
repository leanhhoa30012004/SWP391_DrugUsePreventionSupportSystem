import React from 'react';
import { FaBlog } from 'react-icons/fa';
import './Blogs.css';


const Blogs = () => (
  <div className="admin-page-root animate-fade-in">
    <div className="admin-page-header">
      <FaBlog className="admin-page-icon text-pink-400" />
      <h2 className="admin-page-title">Blogs</h2>
      <p className="admin-page-desc">Share knowledge, read the latest articles, and manage blog posts for your community. Create a new blog or edit existing ones below.</p>
    </div>
    <div className="admin-page-card animate-slide-up">
      <span className="text-lg text-gray-400">Blog posts and management tools will appear here.</span>
    </div>
  </div>
);
export default Blogs; 