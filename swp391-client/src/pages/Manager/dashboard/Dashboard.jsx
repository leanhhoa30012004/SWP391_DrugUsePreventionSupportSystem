import { DateTime } from 'luxon';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { FaChartPie, FaBookOpen, FaClipboardCheck, FaCalendarAlt, FaUsers, FaSignOutAlt, FaSyncAlt, FaExclamationTriangle, FaChartBar, FaChartLine, FaUserCheck, FaArrowUp, FaArrowDown, FaChevronDown, FaChevronRight, FaCheck, FaTimes, FaClipboardList, FaCalendar, FaGraduationCap, FaClock, FaStar, FaCrown, FaUserFriends, FaHeartbeat, FaMedal } from 'react-icons/fa';
import ReactApexChart from 'react-apexcharts';
import axios from 'axios';


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

// Helper to generate a unique color for each user based on their name
function getAvatarColor(name) {
  const palette = ['#e11d48', '#fbbf24', '#f87171', '#be123c', '#6366f1', '#22c55e'];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return palette[Math.abs(hash) % palette.length];
}

// Fake data for charts
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const consultationsData = [200, 350, 400, 300, 500, 450, 420, 480, 510, 530, 490, 470];
const surveysData = [50, 80, 90, 70, 120, 110, 100, 130, 140, 120, 110, 115];
const consultantActivity = [30, 45, 50, 40, 60, 55, 52, 58, 62, 65, 60, 59];

// Helper calculations for fake data
const avgConsultations = Math.round(consultationsData.reduce((a, b) => a + b, 0) / consultationsData.length);
const peakMonthIdx = consultationsData.indexOf(Math.max(...consultationsData));
const peakMonth = months[peakMonthIdx];
const surveyCompletionRate = Math.round((surveysData.reduce((a, b) => a + b, 0) / consultationsData.reduce((a, b) => a + b, 0)) * 100);
const lastMonthChange = consultationsData[consultationsData.length - 1] - consultationsData[consultationsData.length - 2];
const lastMonthChangePercent = Math.round((lastMonthChange / consultationsData[consultationsData.length - 2]) * 100);
const lastMonthChangeUp = lastMonthChange > 0;

// Thêm hook cho số liệu động
function useDynamicDashboardStats() {
  const [stats, setStats] = useState({
    avgConsultations: 0,
    peakMonth: 'Jan',
    surveyCompletionRate: 0,
    lastMonthChangePercent: 0,
    lastMonthChangeUp: false
  });

  useEffect(() => {
    let interval;
    async function fetchStats() {
      try {
        // TODO: Thay thế URL này bằng API thực tế nếu có
        // const res = await axios.get('/api/manager/dashboard-stats');
        // setStats(res.data);
        // MOCK dữ liệu động:
        setStats(prev => {
          // Tạo số liệu động giả lập
          const now = new Date();
          const monthIdx = now.getMonth();
          const avg = 400 + Math.floor(Math.random() * 100);
          const peak = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][Math.floor(Math.random() * 12)];
          const survey = 20 + Math.floor(Math.random() * 80);
          const lastChange = Math.floor(Math.random() * 20 - 10);
          return {
            avgConsultations: avg,
            peakMonth: peak,
            surveyCompletionRate: survey,
            lastMonthChangePercent: Math.abs(lastChange),
            lastMonthChangeUp: lastChange >= 0
          };
        });
      } catch (e) {
        // Nếu lỗi, giữ nguyên số liệu cũ
      }
    }
    fetchStats();
    interval = setInterval(fetchStats, 10000); // 10s
    return () => clearInterval(interval);
  }, []);
  return stats;
}

// Real-time Statistics Component
const RealTimeStats = () => {
  const [stats, setStats] = useState({
    activeUsers: 0,
    surveysCompleted: 0,
    coursesCompleted: 0,
    appointments: 0
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState('today');
  const [totalStats, setTotalStats] = useState({
    activeUsers: 0,
    surveysCompleted: 0,
    coursesCompleted: 0,
    appointments: 0
  });

  const fetchTodayStats = useCallback(async (isRefresh = false) => {
    console.log('fetchTodayStats called, isRefresh:', isRefresh);
    if (!isRefresh) {
      setLoading(true);
    }
    // Không set refreshing ở đây nữa vì đã set trong handleRefresh
    setError('');

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Token not found. Please login again.');
      setLoading(false);
      setRefreshing(false);
      return;
    }

    try {

      const today = DateTime.now().setZone('Asia/Ho_Chi_Minh');
      const isoDate = today.toISODate(); // YYYY-MM-DD
      const year = today.year;

      console.log(">>> ISO:", isoDate, "Local:", today.toFormat('yyyy-MM-dd HH:mm:ss'));


      console.log('Fetching data for:', isoDate, year);

      const [activeUsersRes, surveysRes, coursesRes, appointmentsRes] = await Promise.all([
        axios.get(`http://localhost:3000/api/manager/report/active-members`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        axios.get(`http://localhost:3000/api/manager/report/survey-done/day/${isoDate}/${year}/0/0`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        axios.get(`http://localhost:3000/api/manager/report/course-done/day/${isoDate}/${year}/0/0`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        axios.get(`http://localhost:3000/api/manager/report/appointment-done/day/${isoDate}/${year}/0/0`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);
      console.log(">>>>>", coursesRes)
      console.log('Data fetched successfully:', {
        activeUsers: activeUsersRes.data.active || 0,
        surveys: surveysRes.data.count || 0,
        courses: coursesRes.data.count || 0,
        appointments: appointmentsRes.data.count || 0
      });

      setStats({
        activeUsers: activeUsersRes.data.active || 0,
        surveysCompleted: surveysRes.data.count || 0,
        coursesCompleted: coursesRes.data.count || 0,
        appointments: appointmentsRes.data.count || 0
      });

    } catch (err) {
      console.error('Error fetching today stats:', err);
      setError('Failed to load today\'s statistics. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const fetchTotalStats = useCallback(async (period, isRefresh = false) => {
    if (!isRefresh) {
      setLoading(true);
    }
    // Không set refreshing ở đây nữa vì đã set trong handleRefresh
    setError('');

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Token not found. Please login again.');
      setLoading(false);
      setRefreshing(false);
      return;
    }

    try {
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth() + 1;
      const currentWeek = DateTime.now().setZone('Asia/Ho_Chi_Minh').weekNumber;

      let surveysUrl, coursesUrl, appointmentsUrl;
      console.log("Current WEEK", currentWeek)
      switch (period) {
        case 'week':
          surveysUrl = `http://localhost:3000/api/manager/report/survey-done/week/0/${currentYear}/${currentWeek}/0`;
          coursesUrl = `http://localhost:3000/api/manager/report/course-done/week/0/${currentYear}/${currentWeek}/0`;
          appointmentsUrl = `http://localhost:3000/api/manager/report/appointment-done/week/0/${currentYear}/${currentWeek}/0`;
          break;
        case 'month':
          surveysUrl = `http://localhost:3000/api/manager/report/survey-done/month/0/${currentYear}/0/${currentMonth}`;
          coursesUrl = `http://localhost:3000/api/manager/report/course-done/month/0/${currentYear}/0/${currentMonth}`;
          appointmentsUrl = `http://localhost:3000/api/manager/report/appointment-done/month/0/${currentYear}/0/${currentMonth}`;
          break;
        case 'year':
          surveysUrl = `http://localhost:3000/api/manager/report/survey-done/year/0/${currentYear}/0/0`;
          coursesUrl = `http://localhost:3000/api/manager/report/course-done/year/0/${currentYear}/0/0`;
          appointmentsUrl = `http://localhost:3000/api/manager/report/appointment-done/year/0/${currentYear}/0/0`;
          break;
        default:
          return;
      }

      const [surveysRes, coursesRes, appointmentsRes] = await Promise.all([
        axios.get(surveysUrl, { headers: { 'Authorization': `Bearer ${token}` } }),
        axios.get(coursesUrl, { headers: { 'Authorization': `Bearer ${token}` } }),
        axios.get(appointmentsUrl, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);

      setTotalStats({
        activeUsers: 0,
        surveysCompleted: surveysRes.data.count || 0,
        coursesCompleted: coursesRes.data.count || 0,
        appointments: appointmentsRes.data.count || 0
      });

    } catch (err) {
      console.error('Error fetching total stats:', err);
      setError('Failed to load statistics. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const handleRefresh = useCallback(() => {
    console.log('Refresh clicked, viewMode:', viewMode);

    // Hiển thị trạng thái refreshing ngay lập tức
    setRefreshing(true);

    // Thêm delay nhỏ để tránh refresh quá nhanh
    setTimeout(() => {
      if (viewMode === 'today') {
        console.log('Fetching today stats...');
        fetchTodayStats(true);
      } else {
        console.log('Fetching total stats for:', viewMode);
        fetchTotalStats(viewMode, true);
      }
    }, 500); // Delay 500ms để tạo cảm giác mượt mà hơn
  }, [viewMode, fetchTodayStats, fetchTotalStats]);

  const handleViewModeChange = useCallback((mode) => {
    setViewMode(mode);
    if (mode === 'today') {
      fetchTodayStats();
    } else {
      fetchTotalStats(mode);
    }
  }, [fetchTodayStats, fetchTotalStats]);

  useEffect(() => {
    fetchTodayStats();
  }, [fetchTodayStats]);

  const currentData = useMemo(() => {
    return viewMode === 'today' ? stats : totalStats;
  }, [viewMode, stats, totalStats]);

  const getPeriodLabel = useCallback(() => {
    switch (viewMode) {
      case 'today':
        return 'Today';
      case 'week':
        return 'This Week';
      case 'month':
        return 'This Month';
      case 'year':
        return 'This Year';
      default:
        return 'Today';
    }
  }, [viewMode]);

  const periodLabel = useMemo(() => getPeriodLabel(), [getPeriodLabel]);

  return (
    <div className="bg-white rounded-3xl shadow-lg p-6 mb-8 border border-[#e11d48]/10" key={`stats-${viewMode}-${refreshing}`}>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <FaChartPie className="text-2xl text-[#e11d48] flex-shrink-0" />
          <h2 className="text-2xl font-bold text-[#e11d48]">Overview</h2>
          {refreshing && (
            <div className="ml-2 px-2 py-1 bg-[#e11d48]/10 rounded-full">
              <span className="text-xs text-[#e11d48] font-medium">Refreshing...</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-[#e11d48]/70">View:</span>
            <select
              value={viewMode}
              onChange={(e) => handleViewModeChange(e.target.value)}
              className="px-3 py-1 border border-[#e11d48]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e11d48]/50 text-sm"
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="px-4 py-2 bg-[#e11d48] text-white rounded-lg hover:bg-[#be123c] disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-sm flex items-center gap-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#e11d48]/50"
          >
            <FaSyncAlt className={`text-sm text-white ${refreshing ? 'animate-spin' : ''}`} />
            <span className="text-white">{refreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Active Users Card */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
              <FaUsers className="text-white text-xl" />
            </div>
            <div className="text-right">
              <div className="text-xs text-blue-600 font-medium">{periodLabel}</div>
              <div className="text-xs text-blue-500">Active Users</div>
            </div>
          </div>
          <div className="text-3xl font-bold text-blue-700 mb-2 transition-all duration-300 ease-in-out">
            {loading && !refreshing ? '...' : currentData.activeUsers}
          </div>
          <div className="text-sm text-blue-600">
            Users currently active
          </div>
        </div>

        {/* Surveys Completed Card */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
              <FaChartBar className="text-white text-xl" />
            </div>
            <div className="text-right">
              <div className="text-xs text-green-600 font-medium">{periodLabel}</div>
              <div className="text-xs text-green-500">Surveys</div>
            </div>
          </div>
          <div className="text-3xl font-bold text-green-700 mb-2 transition-all duration-300 ease-in-out">
            {loading && !refreshing ? '...' : currentData.surveysCompleted}
          </div>
          <div className="text-sm text-green-600">
            Surveys completed
          </div>
        </div>

        {/* Courses Completed Card */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
              <FaGraduationCap className="text-white text-xl" />
            </div>
            <div className="text-right">
              <div className="text-xs text-purple-600 font-medium">{periodLabel}</div>
              <div className="text-xs text-purple-500">Courses</div>
            </div>
          </div>
          <div className="text-3xl font-bold text-purple-700 mb-2 transition-all duration-300 ease-in-out">
            {loading && !refreshing ? '...' : currentData.coursesCompleted}
          </div>
          <div className="text-sm text-purple-600">
            Courses completed
          </div>
        </div>

        {/* Appointments Card */}
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 border border-orange-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
              <FaCalendarAlt className="text-white text-xl" />
            </div>
            <div className="text-right">
              <div className="text-xs text-orange-600 font-medium">{periodLabel}</div>
              <div className="text-xs text-orange-500">Appointments</div>
            </div>
          </div>
          <div className="text-3xl font-bold text-orange-700 mb-2 transition-all duration-300 ease-in-out">
            {loading && !refreshing ? '...' : currentData.appointments}
          </div>
          <div className="text-sm text-orange-600">
            Appointments completed
          </div>
        </div>
      </div>
    </div>
  );
};

// Chart Components
const BarChart = ({ data, months, title, description, caption }) => {
  const chartHeight = 120;
  const barWidth = 20;
  const gap = 36;
  const topMargin = 30;
  const maxVal = Math.max(...data);
  return (
    <div className="bg-white rounded-3xl shadow-lg p-8 flex flex-col items-center border border-[#e11d48]/10 w-full">
      <h2 className="font-bold text-2xl mb-2 text-[#e11d48] text-center">{title}</h2>
      {description && (
        <div className="text-sm text-[#e11d48]/80 mb-6 text-center max-w-xl">{description}</div>
      )}
      <div className="w-full overflow-x-auto flex justify-center">
        <svg width={months.length * (barWidth + gap) + gap} height={chartHeight + 70} className="block">
          {months.map((m, i) => {
            const barH = (data[i] / maxVal) * chartHeight;
            const centerX = gap + i * (barWidth + gap) + barWidth / 2;
            const valueY = chartHeight - barH - 10 + topMargin;
            return (
              <g key={m}>
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
                <rect
                  x={centerX - barWidth / 2}
                  y={chartHeight - barH + topMargin}
                  width={barWidth}
                  height={barH}
                  rx="12"
                  fill="#e11d48"
                />
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

const LineChart = () => {
  const maxY = Math.max(...consultationsData, ...surveysData);
  const chartWidth = 720;
  const chartHeight = 130;
  const xStep = chartWidth / (months.length - 1);
  const getPoints = (data) =>
    data.map((v, i) => `${i * xStep},${chartHeight - (v / maxY) * 100}`).join(' ');
  return (
    <svg width={chartWidth} height={chartHeight} className="mb-2 w-full max-w-full">
      <polyline
        fill="none"
        stroke="#e11d48"
        strokeWidth="3"
        points={getPoints(consultationsData)}
      />
      <polyline
        fill="none"
        stroke="#fbbf24"
        strokeWidth="3"
        points={getPoints(surveysData)}
      />
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

// Survey Report Manager Component
const SurveyReportManager = () => {
  const [reportType, setReportType] = useState('survey'); // 'survey', 'appointment', 'course', 'active-member'
  const [period, setPeriod] = useState('day');
  const [date, setDate] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [week, setWeek] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [details, setDetails] = useState([]);

  const handleFetch = async () => {
    setLoading(true);
    setError('');
    setResult(null);
    setDetails([]);

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Token not found in localStorage. Please login again.');
      setLoading(false);
      return;
    }

    let url = '';
    let baseUrl = '';

    // Determine base URL based on report type
    switch (reportType) {
      case 'survey':
        baseUrl = 'http://localhost:3000/api/manager/report/survey-done';
        break;
      case 'appointment':
        baseUrl = 'http://localhost:3000/api/manager/report/appointment-done';
        break;
      case 'course':
        baseUrl = 'http://localhost:3000/api/manager/report/course-done';
        break;
      case 'active-member':
        baseUrl = 'http://localhost:3000/api/manager/report/active-member';
        break;
      default:
        setError('Invalid report type selected');
        setLoading(false);
        return;
    }

    if (period === 'day') {
      if (!date) return setError('Please select a date!');
      const y = date.slice(0, 4);
      url = `${baseUrl}/day/${date}/${y}/0/0`;
    } else if (period === 'week') {
      if (!year || !week) return setError('Please enter year and week!');
      url = `${baseUrl}/week/0/${year}/${week}/0`;
    } else if (period === 'month') {
      if (!year || !month) return setError('Please enter year and month!');
      url = `${baseUrl}/month/0/${year}/0/${month}`;
    } else if (period === 'year') {
      if (!year) return setError('Please enter year!');
      url = `${baseUrl}/year/0/${year}/0/0`;
    }

    try {
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      console.log(date)
      console.log(response)
      setResult(response.data.count);

      // If API returns detailed data, use it; otherwise show count only
      if (response.data.data && Array.isArray(response.data.data)) {
        setDetails(response.data.data);
      }

    } catch (err) {
      if (err.response) {
        const status = err.response.status;
        const message = err.response.data?.message || err.response.data?.error || 'Unknown error';

        if (status === 401) {
          setError(`Authentication error (401): ${message}. Token may have expired, please login again.`);
        } else if (status === 403) {
          setError(`Access denied (403): ${message}. You need manager permissions to view this report.`);
        } else if (status === 404) {
          setError(`API not found (404): ${message}. Please check the API endpoint.`);
        } else {
          setError(`Error ${status}: ${message}`);
        }
      } else if (err.request) {
        setError('Cannot connect to server. Please check your network connection.');
      } else {
        setError(`Error: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const getReportTitle = () => {
    switch (reportType) {
      case 'survey':
        return 'Survey Completion Report';
      case 'appointment':
        return 'Appointment Completion Report';
      case 'course':
        return 'Course Completion Report';
      case 'active-member':
        return 'Active Member Report';
      default:
        return 'Report';
    }
  };

  const getReportIcon = () => {
    switch (reportType) {
      case 'survey':
        return <FaChartBar className="text-2xl text-[#e11d48]" />;
      case 'appointment':
        return <FaCalendarAlt className="text-2xl text-[#e11d48]" />;
      case 'course':
        return <FaGraduationCap className="text-2xl text-[#e11d48]" />;
      case 'active-member':
        return <FaUsers className="text-2xl text-[#e11d48]" />;
      default:
        return <FaChartBar className="text-2xl text-[#e11d48]" />;
    }
  };

  const getResultText = () => {
    switch (reportType) {
      case 'survey':
        return `Result: ${result} surveys completed!`;
      case 'appointment':
        return `Result: ${result} appointments completed!`;
      case 'course':
        return `Result: ${result} courses completed!`;
      case 'active-member':
        return `Result: ${result} active members!`;
      default:
        return `Result: ${result}`;
    }
  };

  const getDetailsTitle = () => {
    switch (reportType) {
      case 'survey':
        return 'Details of completed surveys:';
      case 'appointment':
        return 'Details of completed appointments:';
      case 'course':
        return 'Details of completed courses:';
      case 'active-member':
        return 'Details of active members:';
      default:
        return 'Details:';
    }
  };

  const getTableHeaders = () => {
    switch (reportType) {
      case 'survey':
        return (
          <tr className="bg-green-100">
            <th className="px-3 py-2 text-left text-green-800">Survey Name</th>
            <th className="px-3 py-2 text-left text-green-800">Completed By</th>
            <th className="px-3 py-2 text-left text-green-800">Completion Date</th>
            <th className="px-3 py-2 text-left text-green-800">Score</th>
            <th className="px-3 py-2 text-left text-green-800">Status</th>
          </tr>
        );
      case 'appointment':
        return (
          <tr className="bg-green-100">
            <th className="px-3 py-2 text-left text-green-800">Appointment ID</th>
            <th className="px-3 py-2 text-left text-green-800">Patient Name</th>
            <th className="px-3 py-2 text-left text-green-800">Consultant</th>
            <th className="px-3 py-2 text-left text-green-800">Date & Time</th>
            <th className="px-3 py-2 text-left text-green-800">Status</th>
          </tr>
        );
      case 'course':
        return (
          <tr className="bg-green-100">
            <th className="px-3 py-2 text-left text-green-800">Course Name</th>
            <th className="px-3 py-2 text-left text-green-800">Completed By</th>
            <th className="px-3 py-2 text-left text-green-800">Completion Date</th>
            <th className="px-3 py-2 text-left text-green-800">Progress</th>
            <th className="px-3 py-2 text-left text-green-800">Status</th>
          </tr>
        );
      case 'active-member':
        return (
          <tr className="bg-green-100">
            <th className="px-3 py-2 text-left text-green-800">Member ID</th>
            <th className="px-3 py-2 text-left text-green-800">Full Name</th>
            <th className="px-3 py-2 text-left text-green-800">Email</th>
            <th className="px-3 py-2 text-left text-green-800">Last Activity</th>
            <th className="px-3 py-2 text-left text-green-800">Status</th>
          </tr>
        );
      default:
        return null;
    }
  };

  const getTableRow = (item, index) => {
    switch (reportType) {
      case 'survey':
        return (
          <tr key={item.id || index} className="border-b border-green-200">
            <td className="px-3 py-2 text-green-700">{item.title || `Survey ${index + 1}`}</td>
            <td className="px-3 py-2 text-green-700">{item.completedBy || 'N/A'}</td>
            <td className="px-3 py-2 text-green-700">{item.completedDate || 'N/A'}</td>
            <td className="px-3 py-2 text-green-700">
              <span className="bg-green-200 px-2 py-1 rounded text-green-800 font-medium">
                {item.score || 'N/A'}
              </span>
            </td>
            <td className="px-3 py-2 text-green-700">
              <span className="bg-green-500 text-white px-2 py-1 rounded text-xs">
                Completed
              </span>
            </td>
          </tr>
        );
      case 'appointment':
        return (
          <tr key={item.id || index} className="border-b border-green-200">
            <td className="px-3 py-2 text-green-700">{item.id || `APT-${index + 1}`}</td>
            <td className="px-3 py-2 text-green-700">{item.patientName || 'N/A'}</td>
            <td className="px-3 py-2 text-green-700">{item.consultantName || 'N/A'}</td>
            <td className="px-3 py-2 text-green-700">{item.dateTime || 'N/A'}</td>
            <td className="px-3 py-2 text-green-700">
              <span className="bg-green-500 text-white px-2 py-1 rounded text-xs">
                Completed
              </span>
            </td>
          </tr>
        );
      case 'course':
        return (
          <tr key={item.id || index} className="border-b border-green-200">
            <td className="px-3 py-2 text-green-700">{item.courseName || `Course ${index + 1}`}</td>
            <td className="px-3 py-2 text-green-700">{item.completedBy || 'N/A'}</td>
            <td className="px-3 py-2 text-green-700">{item.completedDate || 'N/A'}</td>
            <td className="px-3 py-2 text-green-700">
              <span className="bg-green-200 px-2 py-1 rounded text-green-800 font-medium">
                {item.progress || '100%'}
              </span>
            </td>
            <td className="px-3 py-2 text-green-700">
              <span className="bg-green-500 text-white px-2 py-1 rounded text-xs">
                Completed
              </span>
            </td>
          </tr>
        );
      case 'active-member':
        return (
          <tr key={item.id || index} className="border-b border-green-200">
            <td className="px-3 py-2 text-green-700">{item.id || `M-${index + 1}`}</td>
            <td className="px-3 py-2 text-green-700">{item.fullName || 'N/A'}</td>
            <td className="px-3 py-2 text-green-700">{item.email || 'N/A'}</td>
            <td className="px-3 py-2 text-green-700">{item.lastActivity || 'N/A'}</td>
            <td className="px-3 py-2 text-green-700">
              <span className="bg-green-500 text-white px-2 py-1 rounded text-xs">
                Active
              </span>
            </td>
          </tr>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-lg p-6 mb-8 border border-[#e11d48]/10">
      <div className="flex items-center gap-2 mb-4">
        {getReportIcon()}
        <h2 className="text-xl font-bold text-[#e11d48]">Report</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-[#e11d48] mb-1">Report Type</label>
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="w-full px-3 py-2 border border-[#e11d48]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e11d48]/50"
          >
            <option value="survey">Survey</option>
            <option value="appointment">Appointment</option>
            <option value="course">Course</option>
            <option value="active-member">Active Member</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#e11d48] mb-1">Period</label>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="w-full px-3 py-2 border border-[#e11d48]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e11d48]/50"
          >
            <option value="day">Day</option>
            <option value="week">Week</option>
            <option value="month">Month</option>
            <option value="year">Year</option>
          </select>
        </div>

        {period === 'day' && (
          <div>
            <label className="block text-sm font-medium text-[#e11d48] mb-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 border border-[#e11d48]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e11d48]/50"
            />
          </div>
        )}

        {period === 'week' && (
          <>
            <div>
              <label className="block text-sm font-medium text-[#e11d48] mb-1">Year</label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="2025"
                className="w-full px-3 py-2 border border-[#e11d48]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e11d48]/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#e11d48] mb-1">Week</label>
              <input
                type="number"
                value={week}
                onChange={(e) => setWeek(e.target.value)}
                placeholder="27"
                min="1"
                max="53"
                className="w-full px-3 py-2 border border-[#e11d48]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e11d48]/50"
              />
            </div>
          </>
        )}

        {period === 'month' && (
          <>
            <div>
              <label className="block text-sm font-medium text-[#e11d48] mb-1">Year</label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="2025"
                className="w-full px-3 py-2 border border-[#e11d48]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e11d48]/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#e11d48] mb-1">Month</label>
              <input
                type="number"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                placeholder="7"
                min="1"
                max="12"
                className="w-full px-3 py-2 border border-[#e11d48]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e11d48]/50"
              />
            </div>
          </>
        )}

        {period === 'year' && (
          <div>
            <label className="block text-sm font-medium text-[#e11d48] mb-1">Year</label>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="2025"
              className="w-full px-3 py-2 border border-[#e11d48]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e11d48]/50"
            />
          </div>
        )}

        <div className="flex items-end">
          <button
            onClick={handleFetch}
            disabled={loading}
            className="w-full px-4 py-2 bg-[#e11d48] text-white rounded-lg hover:bg-[#be123c] disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          >
            <span className="font-semibold text-white">{loading ? 'Loading...' : 'Get Report'}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {result !== null && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          <div className="flex items-center gap-2">
            {getReportIcon()}
            <span className="font-medium">{getResultText()}</span>
          </div>

          {/* Details Table - Only show if we have detailed data */}
          {details.length > 0 && (
            <div className="mt-4">
              <h3 className="font-medium text-green-800 mb-2">{getDetailsTitle()}</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    {getTableHeaders()}
                  </thead>
                  <tbody>
                    {details.map((item, index) => getTableRow(item, index))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Main Dashboard Component
const Dashboard = () => {
  const [managerInfo, setManagerInfo] = useState(null);
  const dynamicStats = useDynamicDashboardStats();

  // Survey chart state
  const [surveyData, setSurveyData] = useState(Array(12).fill(0));
  const [consultationData, setConsultationData] = useState(Array(12).fill(0));
  const [chartLoading, setChartLoading] = useState(true);
  const [chartError, setChartError] = useState('');

  useEffect(() => {
    // Hàm fetch dữ liệu cho cả survey và consultation (appointment)
    const fetchChartData = async () => {
      setChartLoading(true);
      setChartError('');
      const year = new Date().getFullYear();
      const token = localStorage.getItem('token');
      try {
        // Gọi song song 12 tháng cho survey và consultation
        const surveyPromises = months.map((_, idx) =>
          axios.get(`/api/manager/report/survey-done/month/0/${year}/0/${idx + 1}`,
            { headers: { Authorization: `Bearer ${token}` } }
          )
        );
        const consultationPromises = months.map((_, idx) =>
          axios.get(`/api/manager/report/appointment-done/month/0/${year}/0/${idx + 1}`,
            { headers: { Authorization: `Bearer ${token}` } }
          )
        );
        const surveyResults = await Promise.all(surveyPromises);
        const consultationResults = await Promise.all(consultationPromises);
        setSurveyData(surveyResults.map(res => res.data.count || 0));
        setConsultationData(consultationResults.map(res => res.data.count || 0));
      } catch (err) {
        setChartError('Failed to load chart data.');
      } finally {
        setChartLoading(false);
      }
    };
    fetchChartData();
  }, []);

  // Chart options cho 2 line: Consultation (đỏ), Survey (vàng)
  const chartOptions = {
    chart: { type: 'line', height: 350, toolbar: { show: false }, zoom: { enabled: false }, foreColor: '#e11d48' },
    colors: ['#e11d48', '#fbbf24'],
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 3 },
    grid: { borderColor: '#f3f3f3', row: { colors: ['#fff', '#f9fafb'], opacity: 0.5 } },
    xaxis: { categories: months, labels: { style: { colors: '#e11d48', fontWeight: 600 } } },
    yaxis: { title: { text: 'Count', style: { color: '#e11d48' } }, labels: { style: { colors: '#e11d48' } } },
    legend: { position: 'top', labels: { colors: ['#e11d48', '#fbbf24'] } },
    title: { text: 'Consultations & Surveys per Month', align: 'left', style: { color: '#e11d48', fontWeight: 700, fontSize: '18px' } },
    tooltip: { theme: 'light' },
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setManagerInfo(user);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#fff1f2] to-[#f8fafc] text-[#e11d48] p-8">
      {/* Header fixed trong main content */}
      <div
        className="fixed left-64 right-8 top-8 z-30 bg-gradient-to-br from-white via-[#fff1f2] to-[#f8fafc] py-6 shadow-md flex flex-col items-center justify-center text-center rounded-2xl"
        style={{
          maxWidth: 'calc(100vw - 18rem - 4rem)',
          marginLeft: 'auto',
          marginRight: 'auto'
        }}
      >
        <h1
          className="text-5xl font-extrabold uppercase tracking-widest text-[#e11d48] drop-shadow-lg mb-2 border-b-4 border-[#e11d48] pb-2"
          style={{
            fontFamily: "'Bungee', cursive",
            letterSpacing: '0.15em',
            textShadow: '0 2px 12px #e11d4844'
          }}
        >
          <FaChartPie className="inline-block mr-3 text-5xl align-middle -mt-2" />
          System Overview Statistics
        </h1>
        <p className="text-lg md:text-xl italic font-semibold text-[#e11d48] px-4 py-2 rounded-xl shadow-sm inline-block font-serif tracking-wide mt-2">
          "Spreading Hope, Protecting the Future!"
        </p>
      </div>
      {/* Nội dung cuộn độc lập, có padding-top để không bị che */}
      <div
        style={{
          marginTop: '180px',
          height: 'calc(100vh - 180px - 2rem)',
          overflowY: 'auto',
          paddingTop: '24px'
        }}
        className="pr-2"
      >
        <RealTimeStats />
        <SurveyReportManager />
        <div className="bg-white rounded-2xl p-6 shadow-lg mt-8 border border-[#e11d48]/10 flex flex-row items-start justify-between gap-8">
          <div className="flex-1 min-w-0">
            <h2 className="font-bold text-lg mb-4 text-[#e11d48]">Consultation & Survey Analytics</h2>
            <div className="text-sm text-[#e11d48]/80 mb-2">
              This chart visualizes the monthly number of consultations and surveys conducted throughout the year.
              It helps managers track service usage trends and evaluate the effectiveness of outreach efforts over time.
            </div>
            <div className="bg-white rounded-3xl shadow-lg p-6 border border-[#e11d48]/10">
              {chartLoading ? (
                <div className="text-[#e11d48] text-center py-8 font-semibold">Loading chart data...</div>
              ) : chartError ? (
                <div className="text-red-500 text-center py-8 font-semibold">{chartError}</div>
              ) : (
                <ReactApexChart
                  options={chartOptions}
                  series={[
                    { name: 'Consultations', data: consultationData },
                    { name: 'Surveys', data: surveyData }
                  ]}
                  type="line"
                  height={350}
                />
              )}
            </div>
          </div>
          {/* Bỏ box số liệu trung bình trên tháng, chỉ giữ các số liệu động khác nếu cần */}
        </div>
        {/* Consultant Analytics Bar Chart */}
        {/* Đã gộp vào ApexDashboardCharts, không cần BarChart riêng */}
      </div>
    </div>
  );
};

export default Dashboard; 