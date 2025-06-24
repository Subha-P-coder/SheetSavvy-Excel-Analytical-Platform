import React, { useContext, useState } from 'react';
import { FaSignOutAlt, FaLanguage, FaMoon } from 'react-icons/fa';
import logo from '../assets/logo-excel.png';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const DashNavbar = () => {
   const navigate = useNavigate();

  const { userData, setIsLoggedIn, setUserData,backendUrl,toggleTheme} = useContext(AppContext);
  const [showProfileOptions, setShowProfileOptions] = useState(false);

  const userInitial = userData?.name ? userData.name.charAt(0).toUpperCase() : 'U';

  const handleProfileClick = () => {
    setShowProfileOptions(prev => !prev);
  };
  
  const sendVerificationOtp = async () => {
    try{

      axios.defaults.withCredentials = true;

      const {data} = await axios.post(`${backendUrl}/api/auth/send-verify-otp`);

      if(data.success){
        navigate('/email-verify')
        toast.success(data.message)
      }else{
        toast.error(data.message)
      }

    }catch(error){
      toast.error(data.message)
    }
  }

  const Logout = async () => {
    try{
      axios.defaults.withCredentials = true;

      const {data} = await axios.post(`${backendUrl}/api/auth/logout`);

      data.success && setIsLoggedIn(false);
      data.success && setUserData(null);
      navigate('/login');
    }catch(error){
      toast.error(error.message)
    }
  } 

  return (
    <div className="navbar">
      <div className="nav-left">
        <img src={logo} alt="SheetSavvy Logo" className="logo" />
        <span className="brand">
          Sheet<span className="highlight">Savvy</span>
        </span>
      </div>

      <div className="nav-right">
        

        <div className="nav-icon profile-icon" onClick={handleProfileClick} title="Profile Options">
          <span className="user-initial">{userInitial}</span>
        </div>

        {showProfileOptions && (
          <div className="profile-popup">
            <p>Hello, {userData?.name}</p>
            {!userData?.isAccountVerified && (
              <button onClick={sendVerificationOtp} className="verify-btn">Verify Email</button>
            )}
          </div>
        )}

        
        <button onClick={toggleTheme} className="nav-icon" title="Toggle Dark Mode">
          <FaMoon />
        </button>

        <button onClick={Logout} className="nav-icon logout-btn" title="Logout">
          <FaSignOutAlt />
        </button>
      </div>

     
    
    </div>
  );
};

export default DashNavbar;
