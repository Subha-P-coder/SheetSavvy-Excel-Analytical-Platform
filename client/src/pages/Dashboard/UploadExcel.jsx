import React, { useState, useContext } from 'react';
import Sidebar from '../../components/Sidebar.jsx';
import DashNavbar from '../../components/DashNavbar.jsx';
import axios from 'axios';
import { AppContext } from '../../context/AppContext.jsx';
import '../../styles/UploadExcel.css';
import { useNavigate } from 'react-router-dom';
import { FaUpload } from 'react-icons/fa';


const UploadExcel = () => {
  const { backendUrl, setRecordId, recordId } = useContext(AppContext);
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');
  const [fetchedData, setFetchedData] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setStatus('');
    setFetchedData(null);
  };

  const handleUpload = async () => {
    if (!file) {
      setStatus('⚠️ Please select a file first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setStatus('⏳ Uploading...');
      const res = await axios.post(`${backendUrl}/api/excel/upload`, formData, {
        withCredentials: true,
      });

      setStatus('✅ Upload successful! Fetching data...');
      const newId = res.data.recordId;
      setRecordId(newId);

      const fetchRes = await axios.get(
        `${backendUrl}/api/excel/record/${newId}`,
        { withCredentials: true }
      );
      setFetchedData(fetchRes.data.data);
      setStatus('✅ Data loaded!');
    } catch (err) {
      console.error(err);
      setStatus('❌ Error uploading or fetching data.');
    }
  };

  return (
    <div className="dashboard-wrapper">
      <Sidebar />
      <div className="main-content">
        <DashNavbar />
        <div className="page-wrapper">
          <h1>Upload Excel File</h1>
          <p>Select your Excel file and upload it for analysis and insights.</p>

          <div className="upload-container">
            
            <input type="file" accept=".xlsx" onChange={handleFileChange} />
            <button onClick={handleUpload} disabled={!file}>
              <FaUpload style={{ marginRight: '8px' }} />
              Upload Excel
            </button>

            {status && <div className="status">{status}</div>}

            {fetchedData && fetchedData.length > 0 && (
              <div className="data-table-container">
                <h3>📊 Excel Data Preview</h3>
                <div className="data-table-wrapper">
                  <table className="data-table">
                    <thead>
                      <tr>
                        {Object.keys(fetchedData[0]).map((key) => (
                          <th key={key}>{key}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {fetchedData.map((row, idx) => (
                        <tr key={idx}>
                          {Object.values(row).map((val, i) => (
                            <td key={i}>{val}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <button
              onClick={() => {
                if (recordId) {
                  setStatus('Redirecting to analyze...');
                  navigate(`/analyze/${recordId}`);
                } else {
                  setStatus('Please upload a file first.');
                }
              }}
              disabled={!fetchedData}
            >
              Analyze Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadExcel;
