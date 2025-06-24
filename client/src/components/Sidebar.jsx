import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import {
  FaTachometerAlt,
  FaFileUpload,
  FaChartBar,
  FaHistory,
  FaComments,
  FaCog,
} from 'react-icons/fa';
import { AppContext } from '../context/AppContext';

const Sidebar = () => {
  const { recordId } = useContext(AppContext);

  return (
    <div className="sidebar">
      <ul>
        <li>
          <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>
            <FaTachometerAlt style={{ marginRight: '10px' }} /> Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to="/upload-excel" className={({ isActive }) => isActive ? 'active' : ''}>
            <FaFileUpload style={{ marginRight: '10px' }} /> Upload Excel
          </NavLink>
        </li>
        <li>
          <NavLink to={recordId ? `/analyze/${recordId}` : '/analyze/default'} className={({ isActive }) => isActive ? 'active' : ''}>
            <FaChartBar style={{ marginRight: '10px' }} /> Analyze Data
          </NavLink>
        </li>
        <li>
          <NavLink to="/history" className={({ isActive }) => isActive ? 'active' : ''}>
            <FaHistory style={{ marginRight: '10px' }} /> History
          </NavLink>
        </li>
        <li>
          <NavLink to="/chat-with-file" className={({ isActive }) => isActive ? 'active' : ''}>
            <FaComments style={{ marginRight: '10px' }} /> Chat & Ai Insights
          </NavLink>
        </li>
        <li>
          <NavLink to="/settings" className={({ isActive }) => isActive ? 'active' : ''}>
            <FaCog style={{ marginRight: '10px' }} /> Settings
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;