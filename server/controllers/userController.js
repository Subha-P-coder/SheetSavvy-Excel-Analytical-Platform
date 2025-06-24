import User from '../models/userModel.js';
import bcrypt from "bcryptjs";

// to get all details
export const getUserData = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      userData: {
        name: user.name,
        email: user.email,
        role: user.role,   
        isAccountVerified: user.isAccountVerified
      }
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// UPDATE PROFILE (name only)
export const updateProfile = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || name.length > 30) {
      return res.status(400).json({ success: false, message: "Invalid name" });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name },
      { new: true }
    ).select("-password");

    res.status(200).json({ success: true, user });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// CHANGE PASSWORD
export const changePassword = async (req, res) => {
  try {
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6 || newPassword.length > 20) {
      return res.status(400).json({
        success: false,
        message: "Password must be 6–20 characters",
      });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(req.user.id, { password: hashed });

    res.status(200).json({ success: true, message: "Password updated" });
  } catch (err) {
    console.error("Change password error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// DELETE ACCOUNT
export const deleteAccount = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    res.clearCookie("token"); 
    res.status(200).json({ success: true, message: "Account deleted" });
  } catch (err) {
    console.error("Delete account error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
