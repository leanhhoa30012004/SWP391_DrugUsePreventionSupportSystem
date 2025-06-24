import React from 'react';
import { FaCog } from 'react-icons/fa';
import './Setting.css';

const Setting = () => (
  <div className="admin-page-root animate-fade-in">
    <div className="admin-page-header">
      <FaCog className="admin-page-icon text-gray-500 spin-slow" />
      <h2 className="admin-page-title">Settings</h2>
      <p className="admin-page-desc">Customize your admin dashboard, update preferences, and configure system settings for a personalized experience.</p>
    </div>
    <div className="admin-page-card animate-slide-up">
      <span className="text-lg text-gray-400">Settings options will appear here.</span>
    </div>
  </div>
);
export default Setting; 