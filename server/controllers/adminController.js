import moment from 'moment';
import User from '../models/userModel.js';
import ExcelData from '../models/excelData.js';



// GET /admin/all-users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error("Get All Users Error:", error.message);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

// DELETE /admin/delete-user/:id
export const deleteUserById = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    res.status(200).json({ success: true, message: "User deleted successfully." });
  } catch (error) {
    console.error("Delete User Error:", error.message);
    res.status(500).json({ success: false, message: "Server error." });
  }
};


// Corrected getAllUploadedFiles function
export const getAllUploadedFiles = async (req, res) => {
  try {
    const files = await ExcelData.find()
    .sort({ createdAt: -1 })
    .limit(10)
    .populate('uploadedBy', 'name email'); 
  
    const formatted = files.map(file => ({
      _id: file._id,
      name: file.fileName,
      uploadedBy: {
        name: file.uploadedBy?.name || 'Unknown',
        email: file.uploadedBy?.email || '',
      },
      rowCount: file.totalRows || (file.data?.length || 0),
      uploadDate: file.createdAt || file.uploadedAt,
    }));

    res.status(200).json({ success: true, files: formatted });
  } catch (error) {
    console.error('Fetch Admin Files Error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch files' });
  }
};

export const deleteFileById = async (req, res) => {
  try {
    const file = await ExcelData.findByIdAndDelete(req.params.id);
    if (!file) return res.status(404).json({ success: false, message: "File not found" });
    res.status(200).json({ success: true, message: "File deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Deletion failed" });
  }
};




export const getAdminAnalytics = async (req, res) => {
  try {
    const past30Days = moment().subtract(30, 'days').toDate();

    // 1. Uploads per day
    const rawUploads = await ExcelData.aggregate([
      { $match: { createdAt: { $gte: past30Days } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const uploadsPerDay = [];
    for (let i = 0; i < 30; i++) {
      const date = moment().subtract(29 - i, 'days').format('YYYY-MM-DD');
      const record = rawUploads.find(r => r._id === date);
      uploadsPerDay.push({ _id: date, count: record ? record.count : 0 });
    }

    // 2. Most Active Users
    const mostActiveUsers = await ExcelData.aggregate([
      {
        $group: {
          _id: "$uploadedBy",
          uploads: { $sum: 1 }
        }
      },
      { $sort: { uploads: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: "$user" },
      {
        $project: {
          name: "$user.name",
          email: "$user.email",
          uploads: 1
        }
      }
    ]);

    // 3. Chart & Insight usage count
    const chartStats = await ExcelData.aggregate([
      {
        $group: {
          _id: null,
          totalCharts: { $sum: "$chartCount" },
          totalInsights: { $sum: "$insightCount" }
        }
      }
    ]);

    // 4. Weekly User Growth (last 8 weeks)
    const startDate = moment().subtract(8, 'weeks').startOf('isoWeek').toDate();
    const rawUserGrowth = await User.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: {
            year: { $isoWeekYear: "$createdAt" },
            week: { $isoWeek: "$createdAt" }
          },
          users: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.week": 1 } }
    ]);

    const userGrowth = [];
    for (let i = 0; i < 8; i++) {
      const date = moment().subtract(7 - i, 'weeks');
      const week = date.isoWeek();
      const year = date.isoWeekYear();
      const match = rawUserGrowth.find(
        u => u._id.week === week && u._id.year === year
      );
      userGrowth.push({
        _id: { week, year },
        users: match ? match.users : 0
      });
    }



    // Final response
    res.json({
      success: true,
      uploadsPerDay,
      mostActiveUsers,
      chartStats: chartStats[0] || { totalCharts: 0, totalInsights: 0 },
      userGrowth,
     
    });

  } catch (err) {
    console.error("Analytics Error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch analytics" });
  }
};
