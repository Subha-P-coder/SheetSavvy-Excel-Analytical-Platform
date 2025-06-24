import React, { useContext, useEffect, useRef } from 'react';
import { Navbar } from '../../components/Navbar.jsx';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext.jsx';

const EmailVerify = () => {
  const navigate = useNavigate();
  const { backendUrl, getUserData, userData, isLoggedIn } = useContext(AppContext);
  const inputRefs = useRef([]);

  // Handle input change: auto-move to next
  const handleInput = (e, index) => {
    const value = e.target.value;
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Backspace handling
  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !e.target.value && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste: fill all boxes
  const handlePaste = (e) => {
  e.preventDefault();
  const paste = e.clipboardData.getData('text').slice(0, 6);

  paste.split('').forEach((char, index) => {
    const input = inputRefs.current[index];
    if (input) {
      input.value = char;
      // Manually trigger input event to update ref and possibly move focus
      const event = new Event('input', { bubbles: true });
      input.dispatchEvent(event);
    }
  });
};


  // Submit OTP
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const otp = inputRefs.current.map((ref) => ref.value.trim()).join('');
    if (otp.length < 6) {
      return toast.error("Please enter all 6 digits.");
    }

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/auth/verify-account`,
        { otp },
        { withCredentials: true }
      );

      if (data.success) {
        toast.success(data.message);
        getUserData();
        navigate('/dashboard');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Something went wrong during verification."
      );
    }
  };

  // Auto redirect if already verified
  useEffect(() => {
    if (isLoggedIn && userData?.isAccountVerified) {
      navigate('/dashboard');
    }
  }, [isLoggedIn, userData, navigate]);

  return (
    <div className='wrapper'>
      <Navbar />
      <form onSubmit={onSubmitHandler}>
        <div className="container">
          <h2>Email Verification</h2>
          <p>Enter the 6-digit code sent to your email address</p>

          <div className="verify-otp" onPaste={handlePaste}>
            {Array(6).fill(0).map((_, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                required
                className="custom-box"
                ref={(el) => (inputRefs.current[index] = el)}
                onInput={(e) => handleInput(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
              />
            ))}
          </div>

          <button type="submit" className="custom-button">
            Verify Email
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmailVerify;
