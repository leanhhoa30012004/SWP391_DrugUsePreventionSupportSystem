import React from 'react';

import { FaBookOpen } from 'react-icons/fa';
import './Course.css';
import "../../dashboard/admin-theme.css";

const Course = () => (
  <div className="admin-page-root animate-fade-in">
    <div className="admin-page-header">
      <FaBookOpen className="admin-page-icon text-green-500" />
      <h2 className="admin-page-title">Courses</h2>
      <p className="admin-page-desc">Browse, create, and manage educational courses for your users. Add new lessons or update course content below.</p>
    </div>
    <div className="admin-page-card animate-slide-up">
      <span className="text-lg text-gray-400">Course list and management tools will appear here.</span>
    </div>
  </div>
);
export default Course; 