import React from "react";
import { FaMoon } from "react-icons/fa";
import "../../styles/AdminNavbar.css";
import logo from "../../assets/logo-excel.png";


const AdminNavbar = () => {
  

  const toggleDarkMode = () => {
    document.body.classList.toggle("dark-theme");
  };

  return (
    <nav className="admin-navbar">
      <div className="admin-navbar-logo">
        <img src={logo} alt="Logo" className="admin-logo" />
        <span className="brand">
          Sheet<span className="highlight">Savvy</span>
        </span>
      </div>

      <div className="admin-navbar-right">
        <span className="welcome-msg">Welcome, Admin</span>

        <button className="nav-icon" title="Toggle Dark Mode" onClick={toggleDarkMode}>
          <FaMoon />
        </button>

        
      </div>
    </nav>
  );
};

export default AdminNavbar;
