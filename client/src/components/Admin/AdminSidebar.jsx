import React from "react";
import {
  FaChartBar,
  FaFileAlt,
  FaUsersCog,
  FaSignOutAlt,
  FaChartLine, 
} from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import "../../styles/AdminSidebar.css";

const AdminSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="admin-sidebar">
      <h2>Admin Panel</h2>
      <ul className="admin-nav-list">
        <li>
          <NavLink
            to="/admin-secret"
            className={({ isActive }) =>
              isActive ? "admin-link active" : "admin-link"
            }
          >
            <FaChartBar /> Overview
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin-files"
            className={({ isActive }) =>
              isActive ? "admin-link active" : "admin-link"
            }
          >
            <FaFileAlt /> Uploaded Files
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin-users"
            className={({ isActive }) =>
              isActive ? "admin-link active" : "admin-link"
            }
          >
            <FaUsersCog /> Manage Users
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin-analytics"
            className={({ isActive }) =>
              isActive ? "admin-link active" : "admin-link"
            }
          >
            <FaChartLine /> Analytics
          </NavLink>
        </li>
      </ul>

      <div className="admin-logout" onClick={handleLogout}>
        <FaSignOutAlt /> Logout
      </div>
    </div>
  );
};

export default AdminSidebar;
