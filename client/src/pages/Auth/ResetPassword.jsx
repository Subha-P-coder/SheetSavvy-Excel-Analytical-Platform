import React, { useState, useRef, useContext } from 'react';
import { Navbar } from '../../components/Navbar.jsx';
import mail_icon from '../../assets/mail_icon.svg'; 
import lock_icon from '../../assets/lock_icon.svg';
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export const ResetPassword = () => {
  const { backendUrl } = useContext(AppContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [otp, setOtp] = useState(0);
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);

  const inputRefs = useRef([]);

  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text').slice(0, 6).split('');
    paste.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    });
  };

const onSubmitEmail = async (e) => {
  e.preventDefault();
  try {
    const { data } = await axios.post(`${backendUrl}/api/auth/send-reset-otp`, { email }, { withCredentials: true });
    
    if (data.success) {
      toast.success(data.message);
      setIsEmailSent(true);
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    toast.error(error.response?.data?.message || "Something went wrong");
  }
};

  const onSubmitOTP = async (e) => {
    e.preventDefault();
    const otpArray = inputRefs.current.map(input => input.value).join('');
    if (otpArray.length !== 6) {
      toast.error("Enter valid 6-digit OTP");
      return;
    }
    setOtp(otpArray);
    setIsOtpSubmitted(true);
  };

  const onSubmitNewPassword = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/auth/reset-password`,
        { email, otp, newPassword },
        { withCredentials: true }
      );

      if (data.success) {
        toast.success(data.message);
        navigate('/login');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className='wrapper'>
      <Navbar />

      {/* Step 1: Enter Email */}
      {!isEmailSent && 
        <form onSubmit={onSubmitEmail}>
          <div className="container">
            <h2>Reset Password</h2>
            <p>Enter your registered email address.</p>
            <div className='email-container'>
              <img src={mail_icon} alt="mail_icon" className='img-icon' />
              <input
                type="email"
                className='mail-box'
                placeholder='Email ID'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit" className='custom-button'>Submit</button>
          </div>
        </form>
      }

      {/* Step 2: Enter OTP */}
      {isEmailSent && !isOtpSubmitted && 
        <form onSubmit={onSubmitOTP}>
          <div className="container">
            <h2>Reset Password OTP</h2>
            <p>Enter the 6-digit code sent to your email.</p>
            <div className="verify-otp" onPaste={handlePaste}>
              {Array(6).fill(0).map((_, index) => (
                <input
                  type="text"
                  maxLength={1}
                  key={index}
                  required
                  className='custom-box'
                  ref={(el) => (inputRefs.current[index] = el)}
                  onInput={(e) => handleInput(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                />
              ))}
            </div>
            <button className='custom-button'>Submit OTP</button>
          </div>
        </form>
      }

      {/* Step 3: Enter New Password */}
      {isEmailSent && isOtpSubmitted && 
        <form onSubmit={onSubmitNewPassword}>
          <div className="container">
            <h2>New Password</h2>
            <p>Enter your new password below.</p>
            <div className='email-container'>
              <img src={lock_icon} alt="lock_icon" className='img-icon' />
              <input
                type="password"
                className='mail-box'
                placeholder='New Password'
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <button className='custom-button'>Reset Password</button>
          </div>
        </form>
      }
    </div>
  );
}
