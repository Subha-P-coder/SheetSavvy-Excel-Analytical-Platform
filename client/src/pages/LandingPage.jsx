import React, { useEffect, useState } from 'react';
import '../index.css';
import Cube from '../components/Cube.jsx';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar.jsx';

const LandingPage = () => {
  const navigate = useNavigate();
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((prev) => prev + 90);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="landing-container">
     <Navbar/>

      <div className="landing-wrapper">
        {/* LEFT SECTION */}
        <div className="left">
          <h1>Unleash Your Data with <span>SheetSavvy</span></h1>
          <p>Analyze, visualize, and export your Excel data effortlessly. Empower your decisions with smart insights.</p>
          <button className="btn-get-started" onClick={() => navigate('/login')}>Get Started</button>
        </div>

        {/* RIGHT SECTION - CUBE */}
        <div className="right">
          <div className="cube-wrapper">
            <Cube rotation={rotation} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;

