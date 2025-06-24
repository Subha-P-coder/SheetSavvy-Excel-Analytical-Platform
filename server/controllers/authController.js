import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { transporter } from "../config/nodemailer.js";

// ========== Register ==========
export const Register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: "Please provide Name, Email, and Password." });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: "User already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const isAdmin = email === 'subhapandiyarajan9@gmail.com'; 
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: isAdmin ? 'admin' : 'user'  
    });
    await user.save();


    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '7d' });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Welcome to SheetSavvy",
      html: `<div style="padding:20px;border:2px solid #555;border-radius:10px;">
        <h2>Welcome to SheetSavvy!</h2>
        <p>Your account has been successfully created.</p>
        <p><strong>Email:</strong> ${email}</p>
      </div>`
    });

    return res.status(201).json({ 
      success: true, 
      message: "User registered successfully." ,
      user: {
        role: user.role,
        name: user.name,
        email: user.email,
      }
    });
  } catch (error) {
    console.error("Register Error:", error.message);
    return res.status(500).json({ success: false, message: "Server error during registration." });
  }
};




// ========== Login ==========
export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email and Password are required." });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials." });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '7d' });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({ 
      success: true, 
      message: "Login successful.",
      user: {
        role: user.role,
        name: user.name,
        email: user.email,
      }
    });
  } catch (error) {
    console.error("Login Error:", error.message);
    return res.status(500).json({ success: false, message: "Server error during login." });
  }
};

// ========== Logout ==========
export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    return res.status(200).json({ success: true, message: "Logged out successfully." });
  } catch (error) {
    console.error("Logout Error:", error.message);
    return res.status(500).json({ success: false, message: "Server error during logout." });
  }
};

// ========== Send Verification OTP ==========
export const sendVerifyOtp = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ success: false, message: "User not found." });
    if (user.isAccountVerified) {
      return res.status(400).json({ success: false, message: "Account already verified." });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.verifyOtp = otp;
    user.verifyOtpExpiredAt = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();

    await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Account Verification OTP",
      html: `
        <div style="text-align:center;">
          <h2>Verify Your Email</h2>
          <p>Use the OTP below to verify your email:</p>
          <h3>${otp}</h3>
          <p>This OTP is valid for 24 hours.</p>
        </div>
      `
    });

    return res.status(200).json({ success: true, message: "Verification OTP sent to your email." });
  } catch (error) {
    console.error("Send OTP Error:", error.message);
    return res.status(500).json({ success: false, message: "Server error while sending OTP." });
  }
};

// ========== Verify Email with OTP ==========
export const verifyEmail = async (req, res) => {
  const { otp } = req.body;
  const userId = req.user.id;

  if (!otp || !userId) {
    return res.status(400).json({ success: false, message: "OTP and User ID are required." });
  }

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found." });

    if (user.verifyOtpExpiredAt < Date.now()) {
      return res.status(400).json({ success: false, message: "OTP expired. Please request a new one." });
    }

    if (String(user.verifyOtp).trim() !== String(otp).trim()) {
      return res.status(400).json({ success: false, message: "Invalid OTP." });
    }
 

    user.isAccountVerified = true;
    user.verifyOtp = '';
    user.verifyOtpExpiredAt = 0;
    await user.save();

    return res.status(200).json({ success: true, message: "Email verified successfully." });
  } catch (error) {
    console.error("Verify Email Error:", error.message);
    return res.status(500).json({ success: false, message: "Server error during email verification." });
  }
};

// ========== Check Authenticated ==========
export const isAuthenticated = async (req, res) => {
  try {
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error while checking authentication." });
  }
};

// ========== Send Reset OTP ==========
export const sendResetOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, message: "Email is required." });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.resetOtp = otp;
    user.resetOtpExpiredAt = Date.now() + 15 * 60 * 1000;
    await user.save();

    await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Password Reset OTP",
      html: `
        <div style="text-align:center;">
          <h2>Reset Your Password</h2>
          <p>Use the OTP below to reset your password:</p>
          <h3>${otp}</h3>
          <p>This OTP is valid for 15 minutes.</p>
        </div>
      `
    });

    return res.status(200).json({ success: true, message: "OTP sent to your email." });
  } catch (error) {
    console.error("Send Reset OTP Error:", error.message);
    return res.status(500).json({ success: false, message: "Server error while sending reset OTP." });
  }
};

// ========== Reset Password ==========
export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.status(400).json({ success: false, message: "Email, OTP, and new password are required." });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: "User not found." });

    if (user.resetOtpExpiredAt < Date.now()) {
      return res.status(400).json({ success: false, message: "OTP expired." });
    }

    if (String(user.resetOtp).trim() !== String(otp).trim()) {
      return res.status(400).json({ success: false, message: "Invalid OTP." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetOtp = '';
    user.resetOtpExpiredAt = 0;
    await user.save();

    return res.status(200).json({ success: true, message: "Password reset successfully." });
  } catch (error) {
    console.error("Reset Password Error:", error.message);
    return res.status(500).json({ success: false, message: "Server error while resetting password." });
  }
};
