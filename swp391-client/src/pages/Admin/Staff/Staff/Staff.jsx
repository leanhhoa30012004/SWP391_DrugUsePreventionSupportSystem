import React from 'react';
import { FaUsers } from 'react-icons/fa';
import './Staff.css';

const Staff = () => (
  <div className="admin-page-root animate-fade-in">
    <div className="admin-page-header">
      <FaUsers className="admin-page-icon text-blue-400" />
      <h2 className="admin-page-title">Staff</h2>
      <p className="admin-page-desc">Manage your team, assign roles, and view staff performance. Add new staff members or update existing profiles below.</p>
    </div>
    <div className="admin-page-card animate-slide-up">
      <span className="text-lg text-gray-400">Staff list and management tools will appear here.</span>
    </div>
  </div>
);
export default Staff; 