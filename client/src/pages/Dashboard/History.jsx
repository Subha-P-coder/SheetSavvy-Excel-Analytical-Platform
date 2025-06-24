import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext.jsx";
import axios from "axios";
import HistoryCard from "../../components/HistoryCard.jsx";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Sidebar from '../../components/Sidebar.jsx';
import DashNavbar from '../../components/DashNavbar.jsx';
import '../../styles/History.css';

const History = () => {
  const { backendUrl, isLoggedIn } = useContext(AppContext);
  const [records, setRecords] = useState([]);
  const navigate = useNavigate();
  
  const fetchHistory = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/excel/history`, {
        withCredentials: true
      });
      setRecords(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch history");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${backendUrl}/api/excel/delete/${id}`, {
        withCredentials: true
      });
      setRecords(prev => prev.filter(r => r._id !== id));
      toast.success("Record deleted");
    } catch (err) {
      toast.error("Failed to delete record");
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchHistory();
    }
  }, [isLoggedIn]);

  return (
    <div className="dashboard-wrapper">
      <Sidebar />
      <div className="main-content">
        <DashNavbar />
        <div className="history-container">
          <h1 className="history-title">Upload History</h1>
          <div className="history-grid">
            {records.length > 0 ? (
              records.map((record) => {
                const keys = record.data?.[0] ? Object.keys(record.data[0]) : [];
                const xKey = keys[0];
                const yKey = keys[1];

                return (
                  <HistoryCard
                    key={record._id}
                    fileName={record.fileName || "Untitled"}
                    uploadedAt={record.uploadedAt}
                    rowCount={record.data?.length || 0}
                    data={record.data}
                    xKey={xKey}
                    yKey={yKey}
                    onView={() => navigate(`/analyze/${record._id}`)}
                    onDelete={() => handleDelete(record._id)}
                  />
                );
              })
            ) : (
              <p className="no-history">No records found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default History;
