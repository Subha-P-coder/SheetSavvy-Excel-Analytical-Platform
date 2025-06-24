import express from 'express';
import userAuth from '../middlewares/userAuth.js';
import { isAdmin } from '../middlewares/isAdmin.js';

import User from '../models/userModel.js';
import ExcelData from '../models/excelData.js'; 
import { getAllUsers, deleteUserById, getAllUploadedFiles,  deleteFileById , getAdminAnalytics } from '../controllers/adminController.js';

const router = express.Router();

// ========== Admin Stats ==========
router.get('/stats', userAuth, isAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const verifiedUsers = await User.countDocuments({ isAccountVerified: true });

    const totalFiles = await ExcelData.countDocuments();

    const chartAgg = await ExcelData.aggregate([
      { $group: { _id: null, totalCharts: { $sum: "$chartCount" } } }
    ]);
    const totalCharts = chartAgg[0]?.totalCharts || 0;

    const insightAgg = await ExcelData.aggregate([
      { $group: { _id: null, totalInsights: { $sum: "$insightCount" } } }
    ]);
    const totalInsights = insightAgg[0]?.totalInsights || 0;

    res.json({
      success: true,
      stats: {
        totalUsers,
        verifiedUsers,
        totalFiles,
        totalCharts,
        totalInsights
      }
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    res.status(500).json({ success: false, message: "Error fetching stats" });
  }
});

// ========== Admin: All Uploaded Files ==========
router.get('/all-files', userAuth, isAdmin, getAllUploadedFiles);

// ========== Admin: All Users ==========
router.get('/all-users', userAuth, isAdmin, getAllUsers);

// ========== Admin: Delete User ==========
router.delete('/delete-user/:id', userAuth, isAdmin, deleteUserById);
router.delete("/delete-file/:id", userAuth, isAdmin, deleteFileById);


router.get('/analytics', getAdminAnalytics);

export default router;
