import React, { useState } from 'react';

const HistoryCard = ({ fileName, uploadedAt, rowCount, data, xKey, yKey, onView, onDelete }) => {
  const [showData, setShowData] = useState(false);

  const formatDate = () => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    };
    return new Date(uploadedAt).toLocaleString(undefined, options);
  };

  return (
    <div className="history-card">
      <h3 className='graph-filename'>{fileName}</h3>
      <p><strong>Uploaded At:</strong> {formatDate(uploadedAt)}</p>
      <p><strong>Total Rows:</strong> {rowCount}</p>

      <div className="card-buttons">
        <button className="view-btn" onClick={onView}>View</button>
        <button className="delete-btn" onClick={onDelete}>Delete</button>
      </div>

      {xKey && yKey && (
        <button className="toggle-data-btn" onClick={() => setShowData(!showData)}>
          {showData ? "Hide X/Y Data" : "Show X/Y Data"}
        </button>
      )}

      {showData && (
        <div className="data-preview-table">
          <table>
            <thead>
              <tr>
                <th>{xKey}</th>
                <th>{yKey}</th>
              </tr>
            </thead>
            <tbody>
              {data.slice(0, 5).map((row, index) => (
                <tr key={index}>
                  <td>{row[xKey]}</td>
                  <td>{row[yKey]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default HistoryCard;
