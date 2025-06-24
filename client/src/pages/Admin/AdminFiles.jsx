import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { FaTrash, FaSort } from "react-icons/fa";
import AdminNavbar from "../../components/Admin/AdminNavbar.jsx";
import AdminSidebar from "../../components/Admin/AdminSidebar.jsx";
import { AppContext } from "../../context/AppContext.jsx";
import "../../styles/AdminFiles.css";

const AdminFiles = () => {
  const { backendUrl } = useContext(AppContext);
  const [files, setFiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("uploadDate");
  const [sortOrder, setSortOrder] = useState("desc");

  useEffect(() => {
    axios
      .get(`${backendUrl}/api/admin/all-files`, { withCredentials: true })
      .then((res) => setFiles(res.data.files))
      .catch((err) => console.error("Fetch files failed:", err));
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${backendUrl}/api/admin/delete-file/${id}`, {
        withCredentials: true,
      });
      setFiles((prev) => prev.filter((file) => file._id !== id));
    } catch (err) {
      console.error("Delete file failed:", err);
    }
  };

  const handleSort = (field) => {
    const isAsc = sortField === field && sortOrder === "asc";
    setSortField(field);
    setSortOrder(isAsc ? "desc" : "asc");
  };

  const filteredFiles = files
    .filter((file) =>
      file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      file.uploadedBy?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (sortField === "uploadDate") {
        return sortOrder === "asc"
          ? new Date(aVal) - new Date(bVal)
          : new Date(bVal) - new Date(aVal);
      }
      if (typeof aVal === "string") {
        return sortOrder === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
    });

  return (
    <div className="admin-layout">
      <AdminNavbar />
      <div className="admin-body">
        <AdminSidebar />
        <div className="admin-main-content">
          <h2 className="section-title">Manage Uploaded Files</h2>

          <input
            type="text"
            className="admin-search"
            placeholder="Search by file or uploader..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th onClick={() => handleSort("name")}>File Name <FaSort /></th>
                  <th>Uploaded By</th>
                  <th onClick={() => handleSort("rowCount")}>Rows <FaSort /></th>
                  <th onClick={() => handleSort("uploadDate")}>Uploaded At <FaSort /></th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredFiles.length > 0 ? (
                  filteredFiles.map((file) => (
                    <tr key={file._id}>
                      <td>{file.name}</td>
                      <td>{file.uploadedBy?.name || "Unknown"}</td>
                      <td>{file.rowCount}</td>
                      <td>{new Date(file.uploadDate).toLocaleString()}</td>
                      <td>
                        <button className="delete-btn" onClick={() => handleDelete(file._id)}>
                          <FaTrash /> Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5">No files found.</td>
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

export default AdminFiles;
