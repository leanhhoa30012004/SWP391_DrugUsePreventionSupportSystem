import React, { useState, useEffect } from 'react';
import { FaChartPie, FaBookOpen, FaUserFriends, FaHeartbeat, FaArrowUp, FaArrowDown, FaCircle, FaMedal, FaUser, FaCrown, FaUserCheck, FaChartLine, FaChartBar, FaUsers, FaUserClock, FaUserPlus } from 'react-icons/fa';

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

const Dashboard = () => {
  const [managerInfo, setManagerInfo] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setManagerInfo(user);
  }, []);

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
            className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl shadow-lg ring-2 ring-[#e11d48]"
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
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {/* Top Active Users */}
        <div className="bg-white rounded-2xl p-6 shadow-lg flex flex-col col-span-1 border border-[#e11d48]/10">
          <h2 className="font-bold text-lg mb-4 text-[#e11d48]">Top Active Users</h2>
          <ul>
            {fakeStats.topUsers.map((user, idx) => (
              <li key={user.email} className="flex items-center gap-3 mb-4">
                {/* Avatar with initials, unique color, and ring */}
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-lg ring-2 ring-[#e11d48]"
                  style={{
                    background: `linear-gradient(135deg, ${getAvatarColor(user.name)} 60%, #fff 100%)`,
                    color: '#fff',
                  }}
                  title={user.name}
                >
                  {user.name.split(' ').map(w => w[0]).join('').toUpperCase()}
                </div>
                <div>
                  <div className="font-semibold text-[#e11d48] flex items-center gap-2">
                    {user.name} {idx === 0 && <span className="ml-2 bg-[#fbbf24] text-white text-xs px-2 py-1 rounded-full flex items-center gap-1"><FaCrown className="text-xs" />Top 1</span>}
                  </div>
                  <div className="text-xs text-[#e11d48]/70">{user.email}</div>
                  <div className="text-xs text-[#e11d48]/70">{user.role} • Last active: {user.lastActive}</div>
                </div>
                <div className="ml-auto font-bold text-[#e11d48]">{user.score}</div>
              </li>
            ))}
          </ul>
        </div>

        {/* Stat Cards */}
        <div className="col-span-2 grid grid-cols-2 gap-6">
          {/* Total Users */}
          <div className="bg-gradient-to-tr from-[#e11d48] to-[#fbbf24] rounded-2xl shadow-lg p-6 flex flex-col items-start border border-[#e11d48]/10">
            <div className="text-2xl mb-2 text-white"><FaUserFriends /></div>
            <div className="text-3xl font-extrabold text-white">{fakeStats.totalUsers.toLocaleString()}</div>
            <div className="font-semibold text-white/90">Total Users</div>
            <div className={`text-sm mt-2 flex items-center gap-1 ${fakeStats.totalUsers > 0 ? 'text-green-500' : 'text-red-500'}`}>
              {fakeStats.totalUsers > 0 ? <FaArrowUp /> : <FaArrowDown />}
              {fakeStats.totalUsers > 0 ? `+${fakeStats.totalUsers > 0 ? fakeStats.totalUsers : 0}%` : ''} this month
            </div>
          </div>
          {/* Total Surveys */}
          <div className="bg-gradient-to-tr from-[#e11d48] to-[#f87171] rounded-2xl shadow-lg p-6 flex flex-col items-start border border-[#e11d48]/10">
            <div className="text-2xl mb-2 text-white"><FaBookOpen /></div>
            <div className="text-3xl font-extrabold text-white">{fakeStats.totalSurveys.toLocaleString()}</div>
            <div className="font-semibold text-white/90">Total Surveys</div>
            <div className={`text-sm mt-2 flex items-center gap-1 ${fakeStats.totalSurveys > 0 ? 'text-green-500' : 'text-red-500'}`}>
              {fakeStats.totalSurveys > 0 ? <FaArrowUp /> : <FaArrowDown />}
              {fakeStats.totalSurveys > 0 ? `+${fakeStats.totalSurveys > 0 ? fakeStats.totalSurveys : 0}%` : ''} this month
            </div>
          </div>
          {/* Total Courses */}
          <div className="bg-gradient-to-tr from-[#e11d48] to-[#fbbf24] rounded-2xl shadow-lg p-6 flex flex-col items-start border border-[#e11d48]/10">
            <div className="text-2xl mb-2 text-white"><FaBookOpen /></div>
            <div className="text-3xl font-extrabold text-white">{fakeStats.totalCourses.toLocaleString()}</div>
            <div className="font-semibold text-white/90">Total Courses</div>
            <div className={`text-sm mt-2 flex items-center gap-1 ${fakeStats.totalCourses > 0 ? 'text-green-500' : 'text-red-500'}`}>
              {fakeStats.totalCourses > 0 ? <FaArrowUp /> : <FaArrowDown />}
              {fakeStats.totalCourses > 0 ? `+${fakeStats.totalCourses > 0 ? fakeStats.totalCourses : 0}%` : ''} this month
            </div>
          </div>
          {/* Total Consultants */}
          <div className="bg-gradient-to-tr from-[#e11d48] to-[#be123c] rounded-2xl shadow-lg p-6 flex flex-col items-start border border-[#e11d48]/10">
            <div className="text-2xl mb-2 text-white"><FaHeartbeat /></div>
            <div className="text-3xl font-extrabold text-white">{fakeStats.totalConsultants.toLocaleString()}</div>
            <div className="font-semibold text-white/90">Total Consultants</div>
            <div className={`text-sm mt-2 flex items-center gap-1 ${fakeStats.totalConsultants > 0 ? 'text-green-500' : 'text-red-500'}`}>
              {fakeStats.totalConsultants > 0 ? <FaArrowUp /> : <FaArrowDown />}
              {fakeStats.totalConsultants > 0 ? `+${fakeStats.totalConsultants > 0 ? fakeStats.totalConsultants : 0}%` : ''} this month
            </div>
          </div>
        </div>

        {/* User Distribution Pie Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-lg flex flex-col items-center col-span-1 border border-[#e11d48]/10">
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
      <div className="bg-white rounded-2xl p-6 shadow-lg mt-8 border border-[#e11d48]/10 flex flex-row items-start justify-between gap-8">
        <div className="flex-1 min-w-0">
          <h2 className="font-bold text-lg mb-4 text-[#e11d48]">Consultant Analytics</h2>
          {/* Giải thích biểu đồ bar */}
          <div className="text-sm text-[#e11d48]/80 mb-2">
            This bar chart shows the total number of consultations handled by all consultants each month. It highlights periods of high activity and helps identify trends in consultant engagement.
          </div>
          {/* Bar chart cho consultant activity (đẹp, số liệu rõ, vừa khung) */}
          <ConsultantBarChart />
          {/* Month labels for 12 months */}
          <div className="flex gap-1 mt-2 ml-2 w-full" style={{ maxWidth: 720 }}>
            {consultantMonths.map((m, i) => (
              <span key={m} className="text-xs text-[#e11d48]/70 w-12 text-center" style={{ minWidth: 36 }}>{m}</span>
            ))}
          </div>
          <div className="mt-2 text-xs text-[#e11d48]">Number of consultations per month (all consultants)</div>
        </div>
        {/* Info card mới bên phải bar chart */}
        <div className="w-72 min-w-[220px] bg-gradient-to-br from-[#fff0f3] to-[#ffe3e8] rounded-2xl shadow-xl flex flex-col items-center justify-center p-7 gap-5 border border-[#e11d48]/20 ml-4 relative" style={{boxShadow:'0 4px 24px 0 #e11d4822'}}>
          <div className="absolute left-0 top-0 h-full w-1 bg-[#e11d48]/20 rounded-l-2xl" />
          <div className="flex flex-col items-center gap-1">
            <FaUsers className="text-[#e11d48] text-3xl mb-1" />
            <div className="text-3xl font-extrabold text-[#e11d48] leading-tight">{avgConsultant}</div>
            <div className="text-xs text-[#e11d48]/70 font-medium tracking-wide">Avg. per Consultant</div>
          </div>
          <div className="flex flex-col items-center gap-1">
            <FaUserPlus className="text-[#e11d48] text-2xl mb-1" />
            <div className="text-lg font-bold text-[#e11d48]">{mostImprovedConsultant}</div>
            <div className="text-xs text-[#e11d48]/70 font-medium tracking-wide">Most Improved</div>
          </div>
          <div className="flex flex-col items-center gap-1">
            <FaUserCheck className="text-[#fbbf24] text-2xl mb-1" />
            <div className="text-lg font-bold text-[#fbbf24]">{consultantDiversity}</div>
            <div className="text-xs text-[#e11d48]/70 font-medium tracking-wide">Diversity</div>
          </div>
          <div className="flex flex-col items-center gap-1">
            <FaUserClock className="text-[#e11d48] text-2xl mb-1" />
            <div className="text-lg font-bold text-[#e11d48]">{longestActiveConsultant}</div>
            <div className="text-xs text-[#e11d48]/70 font-medium tracking-wide">Longest Active</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 