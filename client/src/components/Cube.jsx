import React from 'react';
import '../index.css';
import uploadIcon from '../assets/upload.jpg';
import chartIcon from '../assets/charts.jpg';
import downloadIcon from '../assets/download.png';
import insightIcon from '../assets/insight.jpg';

const Cube = ({ rotation }) => {
  return (
    <div
      className="cube"
      style={{ transform: `rotateY(${rotation}deg) rotateX(10deg)` }}
    >
      <div className="face face1">
        <img src={uploadIcon} alt="Upload" className="face-icon" />
        <h2>Upload Sheets</h2>
        <p>Drag, drop & you're in. Start analyzing instantly.</p>
      </div>
      <div className="face face2">
        <img src={chartIcon} alt="Charts" className="face-icon" />
        <h2>Smart Charts</h2>
        <p>Get beautiful dashboards without formulas.</p>
      </div>
      <div className="face face3">
        <img src={downloadIcon} alt="Download" className="face-icon" />
        <h2>Export Reports</h2>
        <p>Download your data as Excel or PDF in one click.</p>
      </div>
      <div className="face face4">
        <img src={insightIcon} alt="Insights" className="face-icon" />
        <h2>Instant Insights</h2>
        <p>We auto-scan your sheet and reveal trends.</p>
      </div>
    </div>
  );
};

export default Cube;
