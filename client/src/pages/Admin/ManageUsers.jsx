import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { FaTrash, FaShieldAlt } from "react-icons/fa";
import { AppContext } from "../../context/AppContext.jsx";
import AdminNavbar from "../../components/Admin/AdminNavbar.jsx";
import AdminSidebar from "../../components/Admin/AdminSidebar.jsx";
import "../../styles/ManageUsers.css";

const ManageUsers = () => {
  const { backendUrl } = useContext(AppContext);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios
      .get(`${backendUrl}/api/admin/all-users`, { withCredentials: true })
      .then((res) => setUsers(res.data.users))
      .catch((err) => console.error(err));
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${backendUrl}/api/admin/delete-user/${id}`, {
        withCredentials: true,
      });
      setUsers(users.filter((user) => user._id !== id));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  return (
    <div className="admin-layout">
      <AdminNavbar />
      <div className="admin-body">
        <AdminSidebar />
        <div className="admin-main-content">
          <h2 className="section-title">Manage Users</h2>
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Verified</th>
                  <th>Role</th>
                  <th>Joined</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user._id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.isAccountVerified ? "Yes" : "No"}</td>
                      <td>{user.role}</td>
                      <td>{new Date(user.createdAt).toLocaleString()}</td>
                      <td>
                        <button
                          className="delete-btn"
                          onClick={() => handleDelete(user._id)}
                        >
                          <FaTrash /> Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6">No users found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;
