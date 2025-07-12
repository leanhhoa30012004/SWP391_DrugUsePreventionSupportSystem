import React, { useEffect, useState } from 'react';
import { getActiveMembers, getSurveyDone } from '../../services/reportService';

const DashboardStats = () => {
  const [activeMembers, setActiveMembers] = useState(0);
  const [surveyDone, setSurveyDone] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Lấy số lượng member đang hoạt động
    getActiveMembers()
      .then(res => setActiveMembers(res.data.count || 0))
      .catch(() => setActiveMembers(0));

    // Lấy số lượng survey đã hoàn thành trong tháng hiện tại
    const now = new Date();
    const period = 'month';
    const date = now.getDate();
    const year = now.getFullYear();
    const week = 0;
    const month = now.getMonth() + 1;

    getSurveyDone(period, date, year, week, month)
      .then(res => setSurveyDone(res.data.count || 0))
      .catch(() => setSurveyDone(0))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ display: 'flex', gap: 32 }}>
      <div>
        <h3>Active Members</h3>
        <div style={{ fontSize: 32, fontWeight: 'bold' }}>{activeMembers}</div>
      </div>
      <div>
        <h3>Surveys Completed (This Month)</h3>
        <div style={{ fontSize: 32, fontWeight: 'bold' }}>{surveyDone}</div>
      </div>
    </div>
  );
};

export default DashboardStats;
