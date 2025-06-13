import React from 'react';
import { FaUsers, FaQuestionCircle, FaClock, FaChartLine, FaBrain, FaArrowUp, FaChartPie, FaMedal, FaUserCircle, FaTrophy } from 'react-icons/fa';
import './admin-theme.css';

const Dashboard = () => (
  <div className="dashboard-page">
    <div className="dashboard-header">
      <h2 className="dashboard-title">Hello Admin <span role="img" aria-label="wave">👋</span></h2>
      <p className="dashboard-sub">Let's learn something new today!</p>
      <div className="dashboard-filters">
        <select><option>All-time</option></select>
        <select><option>All</option></select>
        <select><option>All</option></select>
      </div>
    </div>
    <div className="dashboard-cards">
      <div className="dashboard-card"><div className="card-title">Active Users</div><div className="card-value">27/80</div></div>
      <div className="dashboard-card"><div className="card-title">Questions Answered</div><div className="card-value">3,298</div></div>
      <div className="dashboard-card"><div className="card-title">Av. Session Length</div><div className="card-value">2m 34s</div></div>
      <div className="dashboard-card"><div className="card-title">Starting Knowledge</div><div className="card-value">64%</div></div>
      <div className="dashboard-card"><div className="card-title">Current Knowledge</div><div className="card-value">86%</div></div>
      <div className="dashboard-card"><div className="card-title">Knowledge Gain</div><div className="card-value">+34%</div></div>
    </div>
    <div className="dashboard-row dashboard-row-2">
      <div className="dashboard-section dashboard-activity">
        <div className="section-title">Activity</div>
        <img src="https://i.imgur.com/8Km9tLL.png" alt="chart" className="dashboard-activity-chart" />
      </div>
      <div className="dashboard-section dashboard-topics">
        <div className="dashboard-topics-inner">
          <div className="dashboard-topic-box dashboard-weak">
            <div className="section-title">Weakest Topics</div>
            <div className="dashboard-topic-item"><img src="https://randomuser.me/api/portraits/men/11.jpg" alt="" className="dashboard-topic-avatar" /> Food Safety <div className="dashboard-bar dashboard-bar-red" style={{width:'74%'}}></div> <span className="dashboard-bar-label">74% Correct</span></div>
            <div className="dashboard-topic-item"><img src="https://randomuser.me/api/portraits/men/12.jpg" alt="" className="dashboard-topic-avatar" /> Compliance Basics Procedures <div className="dashboard-bar dashboard-bar-red" style={{width:'52%'}}></div> <span className="dashboard-bar-label">52% Correct</span></div>
            <div className="dashboard-topic-item"><img src="https://randomuser.me/api/portraits/men/13.jpg" alt="" className="dashboard-topic-avatar" /> Company Networking <div className="dashboard-bar dashboard-bar-red" style={{width:'36%'}}></div> <span className="dashboard-bar-label">36% Correct</span></div>
          </div>
          <div className="dashboard-topic-box dashboard-strong">
            <div className="section-title">Strongest Topics</div>
            <div className="dashboard-topic-item"><img src="https://randomuser.me/api/portraits/men/21.jpg" alt="" className="dashboard-topic-avatar" /> Covid Protocols <div className="dashboard-bar dashboard-bar-green" style={{width:'95%'}}></div> <span className="dashboard-bar-label">95% Correct</span></div>
            <div className="dashboard-topic-item"><img src="https://randomuser.me/api/portraits/men/22.jpg" alt="" className="dashboard-topic-avatar" /> Cyber Security Basics <div className="dashboard-bar dashboard-bar-green" style={{width:'92%'}}></div> <span className="dashboard-bar-label">92% Correct</span></div>
            <div className="dashboard-topic-item"><img src="https://randomuser.me/api/portraits/men/23.jpg" alt="" className="dashboard-topic-avatar" /> Social Media Policies <div className="dashboard-bar dashboard-bar-green" style={{width:'89%'}}></div> <span className="dashboard-bar-label">89% Correct</span></div>
          </div>
        </div>
      </div>
    </div>
    <div className="dashboard-row dashboard-row-3">
      <div className="dashboard-section dashboard-leaderboard">
        <div className="section-title">User Leaderboard</div>
        <div className="dashboard-leaderboard-list">
          <div className="dashboard-leaderboard-item"><img src="https://randomuser.me/api/portraits/men/31.jpg" alt="" className="dashboard-leaderboard-avatar" /> Jesse Thomas <span className="dashboard-leaderboard-score">637 Points</span> <span className="dashboard-leaderboard-rank up">1 ▲</span></div>
          <div className="dashboard-leaderboard-item"><img src="https://randomuser.me/api/portraits/men/32.jpg" alt="" className="dashboard-leaderboard-avatar" /> Thisai Maithyazhagan <span className="dashboard-leaderboard-score">637 Points</span> <span className="dashboard-leaderboard-rank down">2 ▼</span></div>
          <div className="dashboard-leaderboard-item"><img src="https://randomuser.me/api/portraits/women/33.jpg" alt="" className="dashboard-leaderboard-avatar" /> Helen Chuang <span className="dashboard-leaderboard-score">637 Points</span> <span className="dashboard-leaderboard-rank up">3 ▲</span></div>
          <div className="dashboard-leaderboard-item"><img src="https://randomuser.me/api/portraits/women/34.jpg" alt="" className="dashboard-leaderboard-avatar" /> Laura Silverman <span className="dashboard-leaderboard-score">637 Points</span> <span className="dashboard-leaderboard-rank up">4 ▲</span></div>
          <div className="dashboard-leaderboard-item"><img src="https://randomuser.me/api/portraits/men/35.jpg" alt="" className="dashboard-leaderboard-avatar" /> Winfried Groton <span className="dashboard-leaderboard-score">637 Points</span> <span className="dashboard-leaderboard-rank down">5 ▼</span></div>
          <div className="dashboard-leaderboard-item"><img src="https://randomuser.me/api/portraits/men/36.jpg" alt="" className="dashboard-leaderboard-avatar" /> Ken Alba <span className="dashboard-leaderboard-score">637 Points</span> <span className="dashboard-leaderboard-rank up">6 ▲</span></div>
          <div className="dashboard-leaderboard-item"><img src="https://randomuser.me/api/portraits/women/37.jpg" alt="" className="dashboard-leaderboard-avatar" /> Alice LeBeau <span className="dashboard-leaderboard-score">637 Points</span> <span className="dashboard-leaderboard-rank down">7 ▼</span></div>
          <div className="dashboard-leaderboard-item"><img src="https://randomuser.me/api/portraits/men/38.jpg" alt="" className="dashboard-leaderboard-avatar" /> Adrian Liu <span className="dashboard-leaderboard-score">637 Points</span> <span className="dashboard-leaderboard-rank up">8 ▲</span></div>
          <div className="dashboard-leaderboard-item"><img src="https://randomuser.me/api/portraits/women/39.jpg" alt="" className="dashboard-leaderboard-avatar" /> Evelyn Hamilton <span className="dashboard-leaderboard-score">637 Points</span> <span className="dashboard-leaderboard-rank down">9 ▼</span></div>
          <div className="dashboard-leaderboard-item"><img src="https://randomuser.me/api/portraits/women/40.jpg" alt="" className="dashboard-leaderboard-avatar" /> Rosa Fidderbrook <span className="dashboard-leaderboard-score">637 Points</span> <span className="dashboard-leaderboard-rank up">10 ▲</span></div>
        </div>
        <a href="#" className="dashboard-leaderboard-link">View full leaderboard &gt;</a>
      </div>
      <div className="dashboard-section dashboard-leaderboard">
        <div className="section-title">Groups Leaderboard</div>
        <div className="dashboard-leaderboard-list">
          <div className="dashboard-leaderboard-item">Houston Facility <span className="dashboard-leaderboard-score">52 Points / User</span> <span className="dashboard-leaderboard-rank up">1 ▲</span></div>
          <div className="dashboard-leaderboard-item">Test Group <span className="dashboard-leaderboard-score">52 Points / User</span> <span className="dashboard-leaderboard-rank down">2 ▼</span></div>
          <div className="dashboard-leaderboard-item">Sales Leadership <span className="dashboard-leaderboard-score">52 Points / User</span> <span className="dashboard-leaderboard-rank up">3 ▲</span></div>
          <div className="dashboard-leaderboard-item">Northeast Region <span className="dashboard-leaderboard-score">52 Points / User</span> <span className="dashboard-leaderboard-rank up">4 ▲</span></div>
          <div className="dashboard-leaderboard-item">Southeast Region <span className="dashboard-leaderboard-score">52 Points / User</span> <span className="dashboard-leaderboard-rank down">5 ▼</span></div>
          <div className="dashboard-leaderboard-item">District Managers <span className="dashboard-leaderboard-score">52 Points / User</span> <span className="dashboard-leaderboard-rank up">6 ▲</span></div>
          <div className="dashboard-leaderboard-item">Senior Managers <span className="dashboard-leaderboard-score">52 Points / User</span> <span className="dashboard-leaderboard-rank down">7 ▼</span></div>
          <div className="dashboard-leaderboard-item">New Hires <span className="dashboard-leaderboard-score">52 Points / User</span> <span className="dashboard-leaderboard-rank up">8 ▲</span></div>
          <div className="dashboard-leaderboard-item">Southwest Region <span className="dashboard-leaderboard-score">52 Points / User</span> <span className="dashboard-leaderboard-rank down">9 ▼</span></div>
          <div className="dashboard-leaderboard-item">Northwest Region <span className="dashboard-leaderboard-score">52 Points / User</span> <span className="dashboard-leaderboard-rank up">10 ▲</span></div>
        </div>
        <a href="#" className="dashboard-leaderboard-link">View full leaderboard &gt;</a>
      </div>
    </div>
  </div>
);

export default Dashboard; 