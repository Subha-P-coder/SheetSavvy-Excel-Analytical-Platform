import mongoose from 'mongoose';

const chartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  fileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ExcelData', // assumes ExcelData is file model
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  config: {
    xField: String,
    yField: String,
    zField: String,
    rField: String,
    chartOptions: Object,
  },
}, {
  timestamps: true  
});

export default mongoose.model('Chart', chartSchema);
