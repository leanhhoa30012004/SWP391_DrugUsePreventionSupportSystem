import React, { useState, useEffect } from 'react';
import { FaChartPie, FaBookOpen, FaUserFriends, FaHeartbeat, FaArrowUp, FaArrowDown, FaCircle, FaMedal, FaUser, FaCrown, FaUserCheck, FaChartLine, FaChartBar, FaUsers, FaUserClock, FaUserPlus, FaSignOutAlt } from 'react-icons/fa';
import axios from 'axios';

const fakeStats = {
  totalUsers: 11238,
  totalSurveys: 238,
  totalCourses: 56,
  totalConsultants: 12,
  totalConsultations: 1250,
  totalAtRiskYouth: 320,
  totalEvents: 24,
  surveyCompletionRate: 82,
  surveyCompletionChange: 8,
  consultationsChange: 15,
  atRiskYouthChange: 5,
  eventsChange: 20,
  leads: [
    { label: 'Member', value: 400, color: '#e11d48' },
    { label: 'Consultant', value: 300, color: '#f87171' },
    { label: 'Manager', value: 200, color: '#fbbf24' },
    { label: 'Admin', value: 100, color: '#be123c' },
  ],
  topUsers: [
    { name: 'Nguyen Van A', email: 'a@gmail.com', score: 98, role: 'Member', lastActive: '2024-06-10' },
    { name: 'Tran Thi B', email: 'b@gmail.com', score: 95, role: 'Consultant', lastActive: '2024-06-09' },
    { name: 'Le Van C', email: 'c@gmail.com', score: 92, role: 'Manager', lastActive: '2024-06-08' },
    { name: 'Pham Thi D', email: 'd@gmail.com', score: 90, role: 'Admin', lastActive: '2024-06-07' },
  ],
};

// Helper for animated numbers
function AnimatedNumber({ value }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) return;
    let increment = end / 40;
    let current = start;
    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        setDisplay(end);
        clearInterval(timer);
      } else {
        setDisplay(Math.floor(current));
      }
    }, 10);
    return () => clearInterval(timer);
  }, [value]);
  return <span>{display.toLocaleString()}</span>;
}

const roleColors = {
  Member: 'bg-[#e11d48]',
  Consultant: 'bg-[#f87171]',
  Manager: 'bg-[#fbbf24]',
  Admin: 'bg-[#be123c]',
};

// Helper to generate a unique color for each user based on their name
function getAvatarColor(name) {
  // Simple hash to pick a color from a palette
  const palette = ['#e11d48', '#fbbf24', '#f87171', '#be123c', '#6366f1', '#22c55e'];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return palette[Math.abs(hash) % palette.length];
}

// Data for 12 months
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const consultationsData = [200, 350, 400, 300, 500, 450, 420, 480, 510, 530, 490, 470];
const surveysData = [50, 80, 90, 70, 120, 110, 100, 130, 140, 120, 110, 115];
const consultantMonths = months;
const consultantActivity = [30, 45, 50, 40, 60, 55, 52, 58, 62, 65, 60, 59];

// Helper cho info card mới
const avgConsultations = Math.round(consultationsData.reduce((a, b) => a + b, 0) / consultationsData.length);
const peakMonthIdx = consultationsData.indexOf(Math.max(...consultationsData));
const peakMonth = months[peakMonthIdx];
const surveyCompletionRate = Math.round((surveysData.reduce((a, b) => a + b, 0) / consultationsData.reduce((a, b) => a + b, 0)) * 100);
const lastMonthChange = consultationsData[consultationsData.length - 1] - consultationsData[consultationsData.length - 2];
const lastMonthChangePercent = Math.round((lastMonthChange / consultationsData[consultationsData.length - 2]) * 100);
const lastMonthChangeUp = lastMonthChange > 0;

const avgConsultant = Math.round(consultantActivity.reduce((a, b) => a + b, 0) / consultantActivity.length / 8); // giả lập 8 consultant
const mostImprovedIdx = consultantActivity.slice(1).reduce((maxIdx, val, idx, arr) => {
  const diff = val - consultantActivity[idx];
  const maxDiff = arr[maxIdx] - consultantActivity[maxIdx];
  return diff > maxDiff ? idx : maxIdx;
}, 0) + 1;
const mostImprovedConsultant = `Consultant #${mostImprovedIdx + 1}`;
const consultantDiversity = `8/10`;
const longestActiveConsultant = 'Consultant #3';

const BarChart = ({ data, months, title, description, caption }) => {
  const chartHeight = 120;
  const barWidth = 20;
  const gap = 36;
  const topMargin = 30; // Thêm khoảng trống phía trên
  const maxVal = Math.max(...data);
  return (
    <div className="bg-white rounded-3xl shadow-lg p-8 flex flex-col items-center border border-[#e11d48]/10 w-full">
      <h2 className="font-bold text-2xl mb-2 text-[#e11d48] text-center">{title}</h2>
      {description && <div className="text-sm text-[#e11d48]/80 mb-6 text-center max-w-xl">{description}</div>}
      <div className="w-full overflow-x-auto flex justify-center">
        <svg width={months.length * (barWidth + gap) + gap} height={chartHeight + 70} className="block">
          {months.map((m, i) => {
            const barH = (data[i] / maxVal) * chartHeight;
            const centerX = gap + i * (barWidth + gap) + barWidth / 2;
            const valueY = chartHeight - barH - 10 + topMargin;
            return (
              <g key={m}>
                {/* Value label */}
                <text
                  x={centerX}
                  y={valueY}
                  textAnchor="middle"
                  fontSize="18"
                  fontWeight="bold"
                  fill="#e11d48"
                  style={{ pointerEvents: "none" }}
                >
                  {data[i]}
                </text>
                {/* Bar */}
                <rect
                  x={centerX - barWidth / 2}
                  y={chartHeight - barH + topMargin}
                  width={barWidth}
                  height={barH}
                  rx="12"
                  fill="#e11d48"
                />
                {/* Month label */}
                <text
                  x={centerX}
                  y={chartHeight + 32 + topMargin}
                  textAnchor="middle"
                  fontSize="15"
                  fill="#e11d48"
                  opacity="0.7"
                >
                  {m}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      {caption && <div className="mt-4 text-xs text-[#e11d48]/80 text-center">{caption}</div>}
    </div>
  );
};

const Dashboard = () => {
  const [managerInfo, setManagerInfo] = useState(null);
  // State cho real-time survey count
  const [surveyCount, setSurveyCount] = useState(0);
  const [surveyLoading, setSurveyLoading] = useState(false);
  const [surveyPeriod, setSurveyPeriod] = useState('month'); // day/week/month/year

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setManagerInfo(user);
  }, []);

  useEffect(() => {
    const fetchSurveyCount = async () => {
      setSurveyLoading(true);
      const today = new Date();
      const year = today.getFullYear();
      const month = today.getMonth() + 1;
      const week = Math.ceil((today.getDate() - today.getDay() + 1) / 7);
      const date = today.toISOString().slice(0, 10);
      const token = JSON.parse(localStorage.getItem('user'))?.token;
      try {
        const res = await axios.get(`/api/report/survey-done/${surveyPeriod}/${date}/${year}/${week}/${month}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSurveyCount(res.data.count ?? 0);
      } catch (err) {
        setSurveyCount(0);
      }
      setSurveyLoading(false);
    };
    fetchSurveyCount();
  }, [surveyPeriod]);

  // Helper to render line chart for analytics (Consultations & Surveys)
  const LineChart = () => {
    const maxY = Math.max(...consultationsData, ...surveysData);
    const chartWidth = 720; // Responsive width for 12 months
    const chartHeight = 130;
    const xStep = chartWidth / (months.length - 1);
    const getPoints = (data) =>
      data.map((v, i) => `${i * xStep},${chartHeight - (v / maxY) * 100}`).join(' ');
    return (
      <svg width={chartWidth} height={chartHeight} className="mb-2 w-full max-w-full">
        {/* Consultations line (red) */}
        <polyline
          fill="none"
          stroke="#e11d48"
          strokeWidth="3"
          points={getPoints(consultationsData)}
        />
        {/* Surveys line (yellow) */}
        <polyline
          fill="none"
          stroke="#fbbf24"
          strokeWidth="3"
          points={getPoints(surveysData)}
        />
        {/* Dots for consultations */}
        {consultationsData.map((v, i) => (
          <circle
            key={i}
            cx={i * xStep}
            cy={chartHeight - (v / maxY) * 100}
            r="4"
            fill="#e11d48"
            stroke="#fff"
            strokeWidth="1"
          />
        ))}
        {/* Dots for surveys */}
        {surveysData.map((v, i) => (
          <circle
            key={i}
            cx={i * xStep}
            cy={chartHeight - (v / maxY) * 100}
            r="4"
            fill="#fbbf24"
            stroke="#fff"
            strokeWidth="1"
          />
        ))}
      </svg>
    );
  };

  // Bar chart cho Consultant Analytics (đẹp, số liệu rõ, vừa khung)
  const ConsultantBarChart = () => {
    const chartWidth = 720;
    const chartHeight = 120;
    const barCount = consultantActivity.length;
    const barWidth = 36; // Đủ rộng để số không bị chồng
    const gap = (chartWidth - barCount * barWidth) / (barCount + 1); // spacing đều
    const maxVal = Math.max(...consultantActivity);
    return (
      <svg width={chartWidth} height={chartHeight} className="mb-2 w-full max-w-full">
        {consultantActivity.map((v, i) => {
          const x = gap + i * (barWidth + gap);
          const barH = (v / maxVal) * (chartHeight - 30); // chừa chỗ cho số
          return (
            <g key={i}>
              {/* Bar */}
              <rect
                x={x}
                y={chartHeight - barH}
                width={barWidth}
                height={barH}
                rx="7"
                fill="#e11d48"
                className="transition-all duration-300"
              />
              {/* Value label: chỉ hiện nếu > 10 */}
              {v > 10 && (
                <text
                  x={x + barWidth / 2}
                  y={chartHeight - barH - 8}
                  textAnchor="middle"
                  fontSize="16"
                  fill="#e11d48"
                  fontWeight="bold"
                  style={{ textShadow: '0 1px 2px #fff' }}
                >
                  {v}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    );
  };

  // Pie chart component cho tỷ lệ Consultations vs Surveys
  const PieChart = () => {
    const totalConsultations = consultationsData.reduce((a, b) => a + b, 0);
    const totalSurveys = surveysData.reduce((a, b) => a + b, 0);
    const total = totalConsultations + totalSurveys;
    const consultationsPercent = Math.round((totalConsultations / total) * 100);
    const surveysPercent = 100 - consultationsPercent;
    // Pie chart geometry
    const r = 70;
    const cx = 90;
    const cy = 90;
    const circumference = 2 * Math.PI * r;
    const consultationsArc = (consultationsPercent / 100) * circumference;
    const surveysArc = circumference - consultationsArc;
    return (
      <div className="flex flex-col items-center justify-center w-full">
        <svg width={180} height={180} className="mb-2">
          {/* Consultations (red) */}
          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke="#e11d48"
            strokeWidth={28}
            strokeDasharray={`${consultationsArc} ${circumference}`}
            strokeDashoffset={0}
            style={{ transition: 'stroke-dasharray 0.6s' }}
          />
          {/* Surveys (yellow) */}
          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke="#fbbf24"
            strokeWidth={28}
            strokeDasharray={`${surveysArc} ${circumference}`}
            strokeDashoffset={-consultationsArc}
            style={{ transition: 'stroke-dasharray 0.6s' }}
          />
          {/* Center text: Consultations % */}
          <text
            x={cx}
            y={cy - 8}
            textAnchor="middle"
            fontSize="2.2rem"
            fontWeight="bold"
            fill="#e11d48"
          >
            {consultationsPercent}%
          </text>
          <text
            x={cx}
            y={cy + 22}
            textAnchor="middle"
            fontSize="1.1rem"
            fill="#e11d48"
            fontWeight="600"
          >
            Consultations
          </text>
        </svg>
        <div className="flex flex-row gap-6 mt-2 items-center justify-center">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-[#e11d48] inline-block border border-white shadow" />
            <span className="text-[#e11d48] font-semibold">Consultations</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-[#fbbf24] inline-block border border-white shadow" />
            <span className="text-[#fbbf24] font-semibold">Surveys</span>
          </div>
        </div>
      </div>
    );
  };

  // TopUsersTable mới (bỏ avatar, hiện đầy đủ tên/email/role, badge Top 1)
  const TopUsersTable = ({ users }) => (
    <div className="bg-white rounded-3xl shadow p-6 flex flex-col border border-[#e11d48]/10">
      <h2 className="font-bold text-lg mb-4 text-[#e11d48]">Top Active Users</h2>
      <ul className="space-y-5">
        {users.map((user, idx) => (
          <li key={user.email} className="flex items-center gap-4 pb-2 border-b last:border-b-0 border-[#e11d48]/10">
            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-lg md:text-xl text-[#e11d48] break-words whitespace-normal">{user.name}</span>
                {idx === 0 && (
                  <span className="ml-1 flex items-center gap-1 bg-[#e11d48] text-white text-xs px-2 py-1 rounded-full font-semibold shadow-sm">
                    <FaCrown className="text-xs mr-1" />Top 1
                  </span>
                )}
              </div>
              <div className="text-xs text-gray-400 break-words whitespace-normal">{user.email}</div>
              <div className="text-xs text-gray-400 break-words whitespace-normal">{user.role} • Last active: {user.lastActive}</div>
            </div>
            {/* Score */}
            <div className="ml-2 flex flex-col items-end">
              <div className="font-extrabold text-2xl text-[#e11d48] drop-shadow-sm">{user.score}</div>
              <div className="text-xs text-gray-400 mt-0.5">Score</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );

  // StatTable tổng hợp 4 số liệu, Total Surveys lấy real-time
  const StatTable = () => (
    <div className="bg-white rounded-3xl shadow p-6 border border-[#e11d48]/10">
      <table className="w-full text-left">
        <tbody>
          <tr className="border-b border-[#e11d48]/10">
            <td className="py-3 pr-2"><FaUserFriends className="text-2xl text-[#e11d48]" /></td>
            <td className="font-semibold text-[#e11d48]">Users</td>
            <td className="text-2xl font-extrabold text-[#e11d48]">{fakeStats.totalUsers.toLocaleString()}</td>
            <td className="text-green-500 text-sm font-bold pl-2">+{fakeStats.totalUsers}%</td>
          </tr>
          <tr className="border-b border-[#e11d48]/10">
            <td className="py-3 pr-2"><FaBookOpen className="text-2xl text-[#e11d48]" /></td>
            <td className="font-semibold text-[#e11d48] flex items-center gap-2">
              Surveys
              <select value={surveyPeriod} onChange={e => setSurveyPeriod(e.target.value)} className="ml-2 px-2 py-1 rounded border border-[#e11d48]/30 text-xs text-[#e11d48] bg-white focus:outline-none">
                <option value="day">Today</option>
                <option value="week">This week</option>
                <option value="month">This month</option>
                <option value="year">This year</option>
              </select>
            </td>
            <td className="text-2xl font-extrabold text-[#e11d48]">
              {surveyLoading ? <span className="text-base text-gray-400">Loading...</span> : surveyCount}
            </td>
            <td></td>
          </tr>
          <tr className="border-b border-[#e11d48]/10">
            <td className="py-3 pr-2"><FaBookOpen className="text-2xl text-[#e11d48]" /></td>
            <td className="font-semibold text-[#e11d48]">Courses</td>
            <td className="text-2xl font-extrabold text-[#e11d48]">{fakeStats.totalCourses.toLocaleString()}</td>
            <td className="text-green-500 text-sm font-bold pl-2">+{fakeStats.totalCourses}%</td>
          </tr>
          <tr>
            <td className="py-3 pr-2"><FaHeartbeat className="text-2xl text-[#e11d48]" /></td>
            <td className="font-semibold text-[#e11d48]">Consultants</td>
            <td className="text-2xl font-extrabold text-[#e11d48]">{fakeStats.totalConsultants.toLocaleString()}</td>
            <td className="text-green-500 text-sm font-bold pl-2">+{fakeStats.totalConsultants}%</td>
          </tr>
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#fff1f2] to-[#f8fafc] text-[#e11d48] p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold flex items-center gap-2 text-[#e11d48]">
            <FaChartPie className="text-[#e11d48]" /> System Overview Statistics
          </h1>
          <p className="text-sm text-[#e11d48] italic mt-1">"Spreading Hope, Protecting the Future!"</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Auto-generated manager avatar with initials and unique color */}
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl shadow ring-2 ring-[#e11d48] bg-gradient-to-br from-[#e11d48] to-[#be123c] text-white"
            style={{
              background: `linear-gradient(135deg, ${getAvatarColor(managerInfo?.fullname || managerInfo?.username || 'Manager')} 60%, #fff 100%)`,
              color: '#fff',
            }}
            title={managerInfo?.fullname || managerInfo?.username || 'Manager'}
          >
            {((managerInfo?.fullname || managerInfo?.username || 'M').split(' ').map(w => w[0]).join('') || 'M').toUpperCase()}
          </div>
          <div>
            <div className="font-bold text-[#e11d48]">Hello, {managerInfo?.fullname || managerInfo?.username || 'Manager'}!</div>
            <span className="text-xs text-[#e11d48]/70">Manager</span>
          </div>
          <button
            className="ml-2 px-4 py-2 rounded-2xl bg-[#e11d48] text-white font-bold shadow-lg hover:bg-[#be123c] transition-colors flex items-center gap-2 border-none text-base"
            title="Đăng xuất"
            onClick={() => {
              localStorage.removeItem('user');
              window.location.href = '/login';
            }}
          >
            <FaSignOutAlt className="text-lg" style={{ color: 'white' }} />
            <span className="font-semibold text-white">Logout</span>
          </button>
        </div>
      </div>

      {/* Top Active Users - Nằm ngang, ở trên StatTable */}
      <div className="w-full flex flex-col items-center mb-8">
        <div className="w-full">
          <div className="flex flex-col items-center mb-4">
            <div className="flex items-center gap-2">
              <FaUserFriends className="text-2xl md:text-3xl text-[#e11d48] drop-shadow" />
              <h2 className="font-extrabold text-2xl md:text-3xl text-[#e11d48] tracking-tight text-center">Top Active Users</h2>
            </div>
            <div className="w-32 h-1 mt-2 rounded-full bg-gradient-to-r from-[#e11d48] via-[#fbbf24] to-[#e11d48] opacity-70" />
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-[#e11d48]/10">
            <div className="flex flex-row flex-wrap justify-center gap-6">
              {fakeStats.topUsers.map((user, idx) => (
                <div key={user.email} className="flex flex-col items-center justify-between p-4 min-w-[200px] max-w-[240px] flex-1 border-r last:border-r-0 border-[#e11d48]/10">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-lg md:text-xl text-[#e11d48] break-words whitespace-normal text-center">{user.name}</span>
                    {idx === 0 && (
                      <span className="ml-1 flex items-center gap-1 bg-[#e11d48] text-white text-xs px-2 py-1 rounded-full font-semibold shadow-sm">
                        <FaCrown className="text-xs mr-1" />Top 1
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-400 break-words whitespace-normal text-center">{user.email}</div>
                  <div className="text-xs text-gray-400 break-words whitespace-normal text-center">{user.role} • Last active: {user.lastActive}</div>
                  <div className="font-extrabold text-2xl text-[#e11d48] drop-shadow-sm mt-2">{user.score}</div>
                  <div className="text-xs text-gray-400 mt-0.5">Score</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* StatTable - Bảng tổng hợp với real-time data */}
      <div className="w-full flex flex-col items-center mb-8">
        <div className="w-full">
          <StatTable />
        </div>
      </div>

      {/* User Distribution Pie Chart */}
      <div className="w-full flex flex-col items-center mb-8">
        <div className="w-full">
          <div className="bg-white rounded-2xl p-6 shadow-lg flex flex-col items-center border border-[#e11d48]/10">
            <h2 className="font-bold text-lg mb-4 text-[#e11d48]">User Distribution</h2>
            {/* Pie chart SVG */}
            <svg viewBox="0 0 36 36" className="w-32 h-32 mb-2">
              {(() => {
                let total = fakeStats.leads.reduce((sum, l) => sum + l.value, 0);
                let acc = 0;
                return fakeStats.leads.map((lead, idx) => {
                  const start = (acc / total) * 100;
                  acc += lead.value;
                  const end = (acc / total) * 100;
                  const largeArc = end - start > 50 ? 1 : 0;
                  const r = 16;
                  const startAngle = (start / 100) * 2 * Math.PI - Math.PI / 2;
                  const endAngle = (end / 100) * 2 * Math.PI - Math.PI / 2;
                  const x1 = 18 + r * Math.cos(startAngle);
                  const y1 = 18 + r * Math.sin(startAngle);
                  const x2 = 18 + r * Math.cos(endAngle);
                  const y2 = 18 + r * Math.sin(endAngle);
                  return (
                    <path
                      key={lead.label}
                      d={`M18,18 L${x1},${y1} A${r},${r} 0 ${largeArc} 1 ${x2},${y2} Z`}
                      fill={lead.color}
                      stroke="#fff"
                      strokeWidth="0.7"
                    />
                  );
                });
              })()}
            </svg>
            <div className="flex flex-wrap justify-center gap-2 mt-2">
              {fakeStats.leads.map((lead) => (
                <span key={lead.label} className="flex items-center gap-1 text-xs font-semibold" style={{ color: lead.color }}>
                  ● {lead.label} ({lead.value})
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Analytics with line chart + info card */}
      <div className="bg-white rounded-2xl p-6 shadow-lg mt-8 border border-[#e11d48]/10 flex flex-row items-start justify-between gap-8">
        <div className="flex-1 min-w-0">
          <h2 className="font-bold text-lg mb-4 text-[#e11d48]">Consultation & Survey Analytics</h2>
          {/* Giải thích biểu đồ line */}
          <div className="text-sm text-[#e11d48]/80 mb-2">
            This chart visualizes the monthly number of consultations and surveys conducted throughout the year. It helps managers track service usage trends and evaluate the effectiveness of outreach efforts over time.
          </div>
          {/* Line chart for consultations and surveys */}
          <div className="w-full overflow-x-auto">
            <LineChart />
          </div>
          <div className="flex gap-4 mt-2">
            <div className="flex items-center gap-2 text-[#e11d48] font-semibold">
              <span className="w-4 h-2 rounded bg-[#e11d48] inline-block"></span> Consultations
            </div>
            <div className="flex items-center gap-2 text-[#fbbf24] font-semibold">
              <span className="w-4 h-2 rounded bg-[#fbbf24] inline-block"></span> Surveys
            </div>
          </div>
          {/* Month labels for 12 months */}
          <div className="flex gap-4 mt-4 ml-2 w-full" style={{ maxWidth: 720 }}>
            {months.map((m, i) => (
              <span key={m} className="text-xs text-[#e11d48]/70 w-12 text-center" style={{ minWidth: 48 }}>{m}</span>
            ))}
          </div>
        </div>
        {/* Info card mới bên phải line chart */}
        <div className="w-72 min-w-[220px] bg-gradient-to-br from-[#fff0f3] to-[#ffe3e8] rounded-2xl shadow-xl flex flex-col items-center justify-center p-7 gap-5 border border-[#e11d48]/20 ml-4 relative" style={{boxShadow:'0 4px 24px 0 #e11d4822'}}>
          <div className="absolute left-0 top-0 h-full w-1 bg-[#e11d48]/20 rounded-l-2xl" />
          <div className="flex flex-col items-center gap-1">
            <FaChartBar className="text-[#e11d48] text-3xl mb-1" />
            <div className="text-3xl font-extrabold text-[#e11d48] leading-tight">{avgConsultations}</div>
            <div className="text-xs text-[#e11d48]/70 font-medium tracking-wide">Avg. Consultations/Month</div>
          </div>
          <div className="flex flex-col items-center gap-1">
            <FaChartLine className="text-[#e11d48] text-2xl mb-1" />
            <div className="text-lg font-bold text-[#e11d48]">{peakMonth}</div>
            <div className="text-xs text-[#e11d48]/70 font-medium tracking-wide">Peak Month</div>
          </div>
          <div className="flex flex-col items-center gap-1">
            <FaUserCheck className="text-[#fbbf24] text-2xl mb-1" />
            <div className="text-lg font-bold text-[#fbbf24]">{surveyCompletionRate}%</div>
            <div className="text-xs text-[#e11d48]/70 font-medium tracking-wide">Survey Completion</div>
          </div>
          <div className={`flex flex-col items-center gap-1 ${lastMonthChangeUp ? 'text-green-600' : 'text-red-500'}`}> 
            {lastMonthChangeUp ? <FaArrowUp className="text-2xl mb-1" /> : <FaArrowDown className="text-2xl mb-1" />}
            <div className="text-lg font-bold">{Math.abs(lastMonthChangePercent)}%</div>
            <div className="text-xs text-[#e11d48]/70 font-medium tracking-wide">Last Month Change</div>
          </div>
        </div>
      </div>

      {/* Consultant Analytics Bar Chart + info card */}
      <div className="mt-10">
        <BarChart
          data={consultantActivity}
          months={consultantMonths}
          title="Consultant Analytics"
          description="This bar chart shows the total number of consultations handled by all consultants each month. It highlights periods of high activity and helps identify trends in consultant engagement."
          caption="Number of consultations per month (all consultants)"
        />
      </div>
    </div>
  );
};

export default Dashboard; 