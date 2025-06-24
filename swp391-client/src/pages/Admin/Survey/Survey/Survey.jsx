import React from 'react';
import { FaPoll } from 'react-icons/fa';
import './Survey.css';

const Survey = () => (
  <div className="admin-page-root animate-fade-in">
    <div className="admin-page-header">
      <FaPoll className="admin-page-icon text-red-400" />
      <h2 className="admin-page-title">Survey</h2>
      <p className="admin-page-desc">Assess risk, collect feedback, and gain insights from users with our interactive survey tools. Start a new survey or view results below.</p>
    </div>
    <div className="admin-page-card animate-slide-up">
      <span className="text-lg text-gray-400">Survey analytics and charts will appear here.</span>
    </div>
  </div>
);
export default Survey; 