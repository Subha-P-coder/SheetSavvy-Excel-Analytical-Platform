import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Line, Doughnut } from 'react-chartjs-2';
import { AppContext } from '../../context/AppContext.jsx';
import AdminNavbar from '../../components/Admin/AdminNavbar.jsx';
import AdminSidebar from '../../components/Admin/AdminSidebar.jsx';
import { useLocation } from 'react-router-dom'; 
import '../../styles/AdminAnalytics.css';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const AdminAnalytics = () => {
  const { backendUrl } = useContext(AppContext);
  const location = useLocation(); 
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    if (!backendUrl) return;
    axios
      .get(`${backendUrl}/api/admin/analytics`, { withCredentials: true })
      .then((res) => setAnalytics(res.data))
      .catch((err) => console.error('Analytics fetch error:', err));
  }, [backendUrl, location.pathname]); 

  const uploadData = {
    labels: analytics?.uploadsPerDay?.map((d) => d._id) || [],
    datasets: [
      {
        label: 'Uploads Per Day',
        data: analytics?.uploadsPerDay?.map((d) => d.count) || [],
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        fill: false,
        tension: 0.4,
      },
    ],
  };

  const usageData = {
    labels: ['Charts', 'Insights'],
    datasets: [
      {
        label: 'Usage Count',
        data: [
          analytics?.chartStats?.totalCharts || 0,
          analytics?.chartStats?.totalInsights || 0,
        ],
        backgroundColor: ['#36a2eb', '#ff6384'],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: { display: false },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  return (
    <div className="admin-layout">
      <AdminNavbar />
      <div className="admin-body">
        <AdminSidebar />
        <div className="admin-main-content">
          <h2 className="section-title">Admin Analytics</h2>

          <div className="analytics-grid">
            <div className="chart-card">
              <h3>Daily Uploads</h3>
              {uploadData.labels.length === 0 ? (
                <p>No upload data available.</p>
              ) : (
                <div className="chart-container">
                  <Line data={uploadData} options={chartOptions} />
                </div>
              )}
            </div>

            <div className="chart-card">
              <h3>Chart vs Insight Usage</h3>
              <div className="chart-container">
                <Doughnut
                  data={usageData}
                  options={{ responsive: true, maintainAspectRatio: false }}
                />
              </div>
            </div>

            <div className="chart-card">
              <h3>Top Active Users</h3>
              {analytics?.mostActiveUsers?.length > 0 ? (
                <ul className="top-users-list">
                  {analytics.mostActiveUsers.map((user, index) => (
                    <li key={index}>
                      <strong>{user.name}</strong> ({user.email}) — {user.uploads} uploads
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No active users data available.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
