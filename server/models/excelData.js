import mongoose from 'mongoose';

const ExcelSchema = new mongoose.Schema({
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  fileName: {
    type: String,
    required: true,
  },
  fileSize: Number,
  totalRows: {
    type: Number,
    default: 0
  },
  chartCount: {
    type: Number,
    default: 0,
  },
  insightCount: {
    type: Number,
    default: 0,
  },
  data: {
    type: Array,
    required: true,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  }
}, { timestamps: true });

const ExcelData = mongoose.model('ExcelData', ExcelSchema);

export default ExcelData;
