import React, { useContext, useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar.jsx";
import Navbar from "../../components/DashNavbar.jsx";
import "../../styles/Dashboard.css";
import "../../styles/DashNavbar.css";
import "../../styles/Sidebar.css";
import { AppContext } from "../../context/AppContext.jsx";
import axios from "axios";
import CountUp from "react-countup";
import { FaFileAlt, FaChartBar, FaRobot, FaDatabase } from "react-icons/fa";

const Dashboard = () => {
  const { userData, backendUrl } = useContext(AppContext);

  const [stats, setStats] = useState({
    totalFiles: 0,
    chartsCreated: 0,
    aiInsights: 0,
    dataProcessed: 0,
    totalFileSize: 0,
  });

  const [recentUploads, setRecentUploads] = useState([]);
  const [recentCharts, setRecentCharts] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        const [statsRes, recentRes] = await Promise.all([
          axios.get(`${backendUrl}/api/excel/stats`, { headers }),
          axios.get(`${backendUrl}/api/excel/recent`, { headers }),
        ]);

        if (statsRes.data.success) setStats(statsRes.data.stats);
        if (recentRes.data.success) {
          setRecentUploads(recentRes.data.recentUploads || []);
          setRecentCharts(recentRes.data.recentCharts || []);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, [backendUrl]);

  return (
    <div className="dashboard-wrapper">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <div className="page-content">
          <h1>
            {userData?.name
              ? `Welcome ${userData.name}!`
              : "Welcome to the Dashboard!"}
          </h1>
          <p>Your complete Excel activity summary is shown below.</p>
        </div>

        {/* Stats */}
        <div className="dashboard-stats-wrapper">
          <div className="stat-card">
            <FaFileAlt size={32} className="stat-icon" />
            <h3>Total Files</h3>
            <p>
              <CountUp end={stats.totalFiles} duration={1.5} />
            </p>
          </div>

          <div className="stat-card">
            <FaChartBar size={32} className="stat-icon" />
            <h3>Charts Created</h3>
            <p>
              <CountUp end={stats.chartsCreated} duration={1.5} />
            </p>
          </div>

          <div className="stat-card">
            <FaRobot size={32} className="stat-icon" />
            <h3>AI Insights</h3>
            <p>
              <CountUp end={stats.aiInsights} duration={1.5} />
            </p>
          </div>

          <div className="stat-card">
            <FaDatabase size={32} className="stat-icon" />
            <h3>Total File Size</h3>
            <p>
              <CountUp
                end={Math.round(stats.totalFileSize / 1024)}
                duration={1.5}
              />{" "}
              KB
            </p>
          </div>
        </div>

        {/* Recent Uploads */}
        <div className="recent-section">
          <h2>📂 Recent Uploads</h2>
          <div className="recent-cards">
            {recentUploads.length === 0 ? (
              <p>No recent uploads found.</p>
            ) : (
              recentUploads.map((file, idx) => (
                <div className="recent-card" key={idx}>
                  <strong>{file.fileName || file.name}</strong>
                  <p>{new Date(file.uploadedAt).toLocaleString()}</p>
                  <p>Rows: {file.totalRows || file.rowCount}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Charts */}
        <div className="recent-section">
          <h2>📊 Recent Charts</h2>
          <div className="recent-cards">
            {recentCharts.length === 0 ? (
              <p>No recent charts generated.</p>
            ) : (
              recentCharts.map((chart, idx) => (
                <div className="recent-card" key={idx}>
                  <strong>{chart.type} Chart</strong>
                  <p>{new Date(chart.createdAt).toLocaleString()}</p>
                  {chart.config?.xField && chart.config?.yField && (
                    <p>
                      X: {chart.config.xField}, Y: {chart.config.yField}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
