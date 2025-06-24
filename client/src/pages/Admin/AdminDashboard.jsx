import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import '../../styles/AdminDashboard.css';
import { FaUsers, FaFileAlt, FaChartBar, FaCheckCircle, FaBrain, FaTrash } from 'react-icons/fa';
import { AppContext } from '../../context/AppContext.jsx';
import AdminSidebar from '../../components/Admin/AdminSidebar.jsx';
import AdminNavbar from '../../components/Admin/AdminNavbar.jsx';

const AdminDashboard = () => {
  const { backendUrl } = useContext(AppContext);
  const [stats, setStats] = useState(null);
  const [files, setFiles] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, filesRes, usersRes] = await Promise.all([
          axios.get(`${backendUrl}/api/admin/stats`, { withCredentials: true }),
          axios.get(`${backendUrl}/api/admin/all-files`, { withCredentials: true }),
          axios.get(`${backendUrl}/api/admin/all-users`, { withCredentials: true }),
        ]);
        setStats(statsRes.data.stats);
        setFiles(filesRes.data.files);
        setUsers(usersRes.data.users);
      } catch (err) {
        console.error('Error loading admin dashboard:', err);
      }
    };
    fetchData();
  }, []);

  const deleteUser = async (id) => {
    try {
      await axios.delete(`${backendUrl}/api/admin/delete-user/${id}`, { withCredentials: true });
      setUsers(prev => prev.filter(user => user._id !== id));
    } catch (err) {
      console.error('Delete user failed:', err);
    }
  };

  const { totalUsers = 0, verifiedUsers = 0, totalFiles = 0, totalCharts = 0, totalInsights = 0 } = stats || {};

  return (
    <div className="admin-layout">
      <AdminNavbar  />
      <div className="admin-body">
        <AdminSidebar />
        <div className="admin-main-content">
          
          {/* Stat Cards */}
          <div className="admin-stats-container">
            <div className="stat-card"><FaUsers className="stat-icon" /> <span>Total Users: {totalUsers}</span></div>
            <div className="stat-card"><FaCheckCircle className="stat-icon" /> <span>Verified: {verifiedUsers}</span></div>
            <div className="stat-card"><FaFileAlt className="stat-icon" /> <span>Files: {totalFiles}</span></div>
            <div className="stat-card"><FaChartBar className="stat-icon" /> <span>Charts: {totalCharts}</span></div>
            <div className="stat-card"><FaBrain className="stat-icon" /> <span>Insights: {totalInsights}</span></div>
          </div>

          {/* Recent Uploads */}
          <h2 className="section-title">Recent Uploads</h2>
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>File Name</th>
                  <th>Uploaded By</th>
                  <th>Rows</th>
                  <th>Uploaded At</th>
                </tr>
              </thead>
              <tbody>
                {files.length > 0 ? (
                  files.map(file => (
                    <tr key={file._id}>
                      <td>{file.name}</td>
                      <td>{file.uploadedBy?.name || 'Unknown'}</td>
                      <td>{file.rowCount || 0}</td>
                      <td>{file.uploadDate ? new Date(file.uploadDate).toLocaleString() : 'N/A'}</td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="4">No files found.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Recent Users */}
          <h2 className="section-title">Recent Users</h2>
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Verified</th>
                  <th>Joined At</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map(user => (
                    <tr key={user._id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.isAccountVerified ? 'Yes' : 'No'}</td>
                      <td>{new Date(user.createdAt).toLocaleString()}</td>
                      <td>
                        <button className="delete-btn" onClick={() => deleteUser(user._id)}>
                          <FaTrash /> Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="5">No users found.</td></tr>
                )}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
