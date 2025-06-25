import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import AdminNavbar from '../../components/Admin/AdminNavbar.jsx';
import AdminSidebar from '../../components/Admin/AdminSidebar.jsx';
import Charts from '../../components/Charts.jsx';
import { AppContext } from '../../context/AppContext.jsx';
import '../../styles/AdminAnalytics.css';

const AdminAnalytics = () => {
  const { backendUrl } = useContext(AppContext);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!backendUrl) return;
    axios
      .get(`${backendUrl}/api/admin/analytics`, { withCredentials: true })
      .then((res) => {
        setAnalytics(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Analytics fetch error:', err);
        setLoading(false);
      });
  }, [backendUrl]);

  if (loading) {
    return (
      <div className="admin-layout">
        <AdminNavbar />
        <div className="admin-body">
          <AdminSidebar />
          <div className="admin-main-content">
            <h2 className="section-title">📊 Admin Analytics Dashboard</h2>
            <p style={{ fontSize: '1.2rem', color: '#888', marginTop: '2rem' }}>Loading analytics data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!analytics) return null;

  // === Data Preparation ===
  const uploadsPerUser = analytics.mostActiveUsers?.map(user => ({
    user: user.name,
    uploads: user.uploads
  })) || [];

  const dailyUploads = analytics.uploadsPerDay?.map(item => ({
    date: item._id,
    count: item.count
  })) || [];

  const chartInsightStats = [
    { type: 'Charts', count: analytics.chartStats?.totalCharts || 0 },
    { type: 'Insights', count: analytics.chartStats?.totalInsights || 0 },
  ];

  const featureUsage = [
    { type: 'Uploads', count: analytics.totalUploads || 0 },
    { type: 'Charts', count: analytics.chartStats?.totalCharts || 0 },
    { type: 'Insights', count: analytics.chartStats?.totalInsights || 0 },
  ];

  const bubbleData = analytics.mostActiveUsers?.map(user => ({
    name: user.name,
    uploads: user.uploads,
    insights: user.insightCount || 0,
    chartCount: user.chartCount || 0,
  })) || [];

  return (
    <div className="admin-layout">
      <AdminNavbar />
      <div className="admin-body">
        <AdminSidebar />
        <div className="admin-main-content">
          <h2 className="section-title">📊 Admin Analytics Dashboard</h2>

          <div className="analytics-grid">

            {/* Chart 1: Uploads Per User (3D Bar) */}
            <div className="chart-card">
              <h3>📦 Uploads Per User (3D Bar)</h3>
              {uploadsPerUser.length > 0 ? (
                <Charts
                  type="bar3d"
                  data={uploadsPerUser}
                  xField="user"
                  yField="uploads"
                  rField="uploads"
                />
              ) : (
                <p>No upload user data available.</p>
              )}
            </div>

            {/* Chart 2: Daily Uploads */}
            <div className="chart-card">
              <h3>📈 Daily Uploads</h3>
              {dailyUploads.length > 0 ? (
                <Charts
                  type="line"
                  data={dailyUploads}
                  xField="date"
                  yField="count"
                />
              ) : (
                <p>No daily upload data.</p>
              )}
            </div>

            {/* Chart 3: Chart vs Insight */}
            <div className="chart-card">
              <h3>📊 Chart vs Insight Usage</h3>
              <Charts
                type="doughnut"
                data={chartInsightStats}
                xField="type"
                yField="count"
              />
            </div>

            {/* Chart 4: Platform Feature Usage */}
            <div className="chart-card">
              <h3>📌 Platform Feature Usage</h3>
              <Charts
                type="polar"
                data={featureUsage}
                xField="type"
                yField="count"
              />
            </div>

            {/* Chart 5: Uploads vs Insights vs Charts */}
            <div className="chart-card">
              <h3>🎈 Uploads vs Insights vs Charts (Bubble)</h3>
              <Charts
                type="bubble"
                data={bubbleData}
                xField="uploads"
                yField="insights"
                rField="chartCount"
              />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
