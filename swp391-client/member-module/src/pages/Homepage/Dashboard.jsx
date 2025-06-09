import React, { useState } from 'react';
import './Dashboard.css';
import { FaTachometerAlt, FaPoll, FaBook, FaUsers, FaBlog, FaCog } from 'react-icons/fa';

const features = [
  { key: 'dashboard', label: 'Dashboard', icon: <FaTachometerAlt /> },
  { key: 'survey', label: 'Survey', icon: <FaPoll /> },
  { key: 'course', label: 'Course', icon: <FaBook /> },
  { key: 'staff', label: 'Staff', icon: <FaUsers /> },
  { key: 'blogs', label: 'Blogs', icon: <FaBlog /> },
  { key: 'setting', label: 'Setting', icon: <FaCog /> },
];

const Dashboard = () => {
  const [active, setActive] = useState('dashboard');
  const [hovered, setHovered] = useState(null);

  return (
    <div className="db-root">
      {/* Sidebar */}
      <aside className="db-sidebar">
        <div className="db-logo">WeHope</div>
        <nav className="db-menu">
          {features.map((f) => (
            <div
              key={f.key}
              className={`db-menu-item${active === f.key ? ' active' : ''}${hovered === f.key ? ' hovered' : ''}`}
              onClick={() => setActive(f.key)}
              onMouseEnter={() => setHovered(f.key)}
              onMouseLeave={() => setHovered(null)}
            >
              <span className="db-menu-icon">{f.icon}</span>
              <span className="db-menu-label">{f.label}</span>
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="db-main">
        {/* Header */}
        <header className="db-header">
          <input className="db-search" placeholder="Search..." />
          <div className="db-user">
            <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="avatar" className="db-avatar" />
            <span className="db-username">Admin</span>
          </div>
        </header>
        {/* Content */}
        <div className="db-content">
          <h2>Hello Admin <span role="img" aria-label="wave">👋</span></h2>
          <p className="db-sub">Let's learn something new today!</p>
          {/* Placeholders for cards, chart, leaderboard, etc. */}
          <div className="db-cards-row">
            <div className="db-card">Active Users<br/><b>27/80</b></div>
            <div className="db-card">Questions Answered<br/><b>3,298</b></div>
            <div className="db-card">Av. Session Length<br/><b>2m 34s</b></div>
            <div className="db-card">Starting Knowledge<br/><b>64%</b></div>
            <div className="db-card">Current Knowledge<br/><b>86%</b></div>
            <div className="db-card">Knowledge Gain<br/><b>+34%</b></div>
          </div>
          <div className="db-row">
            <div className="db-chart-placeholder">[Activity Chart]</div>
            <div className="db-topics">
              <div className="db-topic-box db-weak">
                <h4>Weakest Topics</h4>
                <ul>
                  <li>Food Safety <span className="db-bar db-bar-red" style={{width:'74%'}}></span> 74%</li>
                  <li>Compliance Basics <span className="db-bar db-bar-red" style={{width:'52%'}}></span> 52%</li>
                  <li>Company Networking <span className="db-bar db-bar-red" style={{width:'36%'}}></span> 36%</li>
                </ul>
              </div>
              <div className="db-topic-box db-strong">
                <h4>Strongest Topics</h4>
                <ul>
                  <li>Covid Protocols <span className="db-bar db-bar-green" style={{width:'95%'}}></span> 95%</li>
                  <li>Cyber Security <span className="db-bar db-bar-green" style={{width:'92%'}}></span> 92%</li>
                  <li>Social Media <span className="db-bar db-bar-green" style={{width:'89%'}}></span> 89%</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="db-row">
            <div className="db-leaderboard">[User Leaderboard]</div>
            <div className="db-leaderboard">[Group Leaderboard]</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 