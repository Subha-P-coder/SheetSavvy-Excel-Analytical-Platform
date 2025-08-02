import express from "express";
import dotenv from "dotenv";
dotenv.config();
import multer from "multer";
import xlsx from "xlsx";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import auth from "../middlewares/userAuth.js";
import ExcelData from "../models/excelData.js";
import { generateChartInsight } from "../controllers/aiController.js";
import Chart from "../models/chartModel.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

/** --------- Upload Excel File --------- */
router.post("/upload", auth, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const filePath = path.join(__dirname, "..", "uploads", req.file.filename);
    const workbook = xlsx.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheet);

    const newRecord = new ExcelData({
      uploadedBy: req.user.id,
      fileName: req.file.originalname,
      fileSize: req.file.size,
      totalRows: data.length,
      chartCount: 0,
      insightCount: 0,
      data,
    });

    await newRecord.save();
    fs.unlinkSync(filePath);

    res.status(201).json({
      message: "Excel file uploaded and data saved!",
      recordId: newRecord._id,
      rowCount: data.length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Upload failed" });
  }
});

/** --------- Get Single Record --------- */
router.get("/record/:id", auth, async (req, res) => {
  try {
    const record = await ExcelData.findById(req.params.id);
    if (!record) return res.status(404).json({ error: "Record not found" });

    res.status(200).json({
      message: "Record Fetched Successfully",
      data: record.data,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch data" });
  }
});

/** --------- Analyze for Chart.js --------- */
router.get("/analyze/:id", auth, async (req, res) => {
  try {
    const record = await ExcelData.findById(req.params.id);
    if (!record || !record.data || record.data.length === 0)
      return res
        .status(404)
        .json({ success: false, message: "No data found for analysis" });

    const data = record.data;
    const firstKey = Object.keys(data[0])[0];
    const summary = {};

    data.forEach((row) => {
      const key = row[firstKey];
      if (key !== undefined && key !== null) {
        summary[key] = (summary[key] || 0) + 1;
      }
    });

    res.status(200).json({ success: true, summary });
  } catch (error) {
    console.error("Analysis error:", error);
    res.status(500).json({ success: false, message: "Data analysis failed" });
  }
});

/** --------- Plotly 3D Chart Data --------- */
router.get("/plotly/:id", auth, async (req, res) => {
  try {
    const record = await ExcelData.findById(req.params.id);
    if (!record || !record.data || record.data.length === 0)
      return res
        .status(404)
        .json({ success: false, message: "No data found for 3D plot" });

    const data = record.data;
    const numericKeys = Object.keys(data[0]).filter(
      (key) => typeof data[0][key] === "number"
    );

    if (numericKeys.length < 3)
      return res
        .status(400)
        .json({
          success: false,
          message: "Need at least 3 numeric fields for 3D plot",
        });

    const [xKey, yKey, zKey] = numericKeys;

    const plotData = {
      x: data.map((row) => row[xKey]),
      y: data.map((row) => row[yKey]),
      z: data.map((row) => row[zKey]),
      xKey,
      yKey,
      zKey,
    };

    res.status(200).json({ success: true, plotData });
  } catch (error) {
    console.error("Plotly 3D error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to process 3D plot data" });
  }
});

/** --------- Get Upload History --------- */
router.get("/history", auth, async (req, res) => {
  try {
    const records = await ExcelData.find({ uploadedBy: req.user.id }).sort({
      uploadedAt: -1,
    });

    const simplified = records.map((record) => ({
      _id: record._id,
      fileName: record.fileName || "Untitled",
      uploadedAt: record.uploadedAt,
      rowCount: Array.isArray(record.data) ? record.data.length : 0,
      data: record.data,
    }));

    res.status(200).json(simplified);
  } catch (err) {
    console.error("Fetch history error:", err);
    res.status(500).json({ message: "Failed to fetch history" });
  }
});

/** --------- Delete Record --------- */
router.delete("/delete/:id", auth, async (req, res) => {
  try {
    const deleted = await ExcelData.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Record not found" });

    res.status(200).json({ message: "Record deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ message: "Failed to delete record" });
  }
});

router.post("/chart-insight", auth, generateChartInsight);

/** --------- Dashboard Stats --------- */
router.get("/stats", auth, async (req, res) => {
  try {
    const records = await ExcelData.find({ uploadedBy: req.user.id });

    const stats = {
      totalFiles: records.length,
      chartsCreated: records.reduce((sum, r) => sum + (r.chartCount || 0), 0),
      aiInsights: records.reduce((sum, r) => sum + (r.insightCount || 0), 0),
      dataProcessed: records.reduce((sum, r) => sum + (r.totalRows || 0), 0),
      totalFileSize: records.reduce((sum, r) => sum + (r.fileSize || 0), 0),
    };

    res.status(200).json({ success: true, stats });
  } catch (err) {
    console.error("Error in /stats route:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to compute stats" });
  }
});

/** --------- Get Recent Uploads and Charts --------- */
router.get("/recent", auth, async (req, res) => {
  try {
    const userId = req.user.id;

    // Recent Uploads (from ExcelData)
    const recentUploads = await ExcelData.find({ uploadedBy: userId })
      .sort({ uploadedAt: -1 })
      .limit(8)
      .select("fileName uploadedAt totalRows");

    // Recent Charts (from Chart model)
    const recentCharts = await Chart.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("type config createdAt");

    res.status(200).json({
      success: true,
      recentUploads,
      recentCharts,
    });
  } catch (error) {
    console.error("Error in /recent route:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch recent activity" });
  }
});

//get all recent chart-insight
router.post("/recent-chart-insight", auth, async (req, res) => {
  try {
    const {
      type,
      xField,
      yField,
      zField,
      rField,
      config = {},
      fileId,
    } = req.body;

    // Save chart in DB
    const chart = new Chart({
      userId: req.user.id,
      type,
      fileId,
      config: { xField, yField, ...config },
    });

    await chart.save();

    res.status(200).json({
      success: true,
      message: "Chart saved",
      chartId: chart._id,
    });
  } catch (err) {
    console.error("Chart insight error:", err);
    res.status(500).json({ success: false, message: "Failed to save chart" });
  }
});

export default router;
