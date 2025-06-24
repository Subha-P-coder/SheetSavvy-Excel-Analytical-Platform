import React, { useState, useContext, useRef } from "react";
import axios from "axios";
import { AppContext } from "../../context/AppContext.jsx";
import Sidebar from "../../components/Sidebar.jsx";
import DashNavbar from "../../components/DashNavbar.jsx";
import Charts from "../../components/Charts.jsx";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { toast } from "react-toastify";
import "../../styles/ChatWithFile.css";

const ChatWithFile = () => {
  const { backendUrl } = useContext(AppContext);
  const [file, setFile] = useState(null);
  const [fileId, setFileId] = useState("");
  const [fileData, setFileData] = useState(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [suggestedChart, setSuggestedChart] = useState(null);

  const chartRef = useRef();

  const handleUpload = async () => {
    if (!file) return toast.warn("Please select an Excel (.xlsx) file first!");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(`${backendUrl}/api/excel/upload`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const recordId = res.data.recordId;
      setFileId(recordId);
      toast.success("Upload successful! Now ask your question.");

      const recordRes = await axios.get(`${backendUrl}/api/excel/record/${recordId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setFileData(recordRes.data.data);
    } catch (err) {
      console.error("Upload failed:", err.response?.data || err.message);
      toast.error("Upload failed. Try again.");
    }
  };

  const handleAsk = async () => {
    if (!question || !fileId) return toast.warn("Upload a file and enter a question");

    try {
      const res = await axios.post(
        `${backendUrl}/api/excel/chart-insight`,
        { fileId, question },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.data.success) {
        setAnswer(res.data.answer);
        setSuggestedChart(res.data.suggestedChart);

        if (!fileData) {
          const recordRes = await axios.get(`${backendUrl}/api/excel/record/${fileId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          });
          setFileData(recordRes.data.data);
        }

        //  Save chart to DB
        await saveChartToDB(res.data.suggestedChart);
      } else {
        toast.error(res.data.message || "AI error");
      }
    } catch (err) {
      toast.error("AI request failed");
    }
  };

  const resolveField = (field) => {
    if (!field || !fileData || !fileData.length) return field;
    const matched = Object.keys(fileData[0]).find(
      key => key.toLowerCase().trim() === field.toLowerCase().trim()
    );
    return matched || field;
  };

 const saveChartToDB = async (chart) => {
    try {
      const { type, xField, yField } = chart;
      await axios.post(
        `${backendUrl}/api/excel/recent-chart-insight`,
        {
          type,
          fileId, 
          xField: resolveField(xField),
          yField: resolveField(yField),
          config: {},
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("✅ Chart saved to DB");
    } catch (err) {
      console.error("❌ Error saving chart:", err.response?.data || err.message);
    }
  };


  const exportAsImage = async () => {
    const chartContainer = document.querySelector(".chart-container");
    if (!chartContainer) return;

    const canvas = await html2canvas(chartContainer);
    const imageData = canvas.toDataURL("image/png");

    const link = document.createElement("a");
    link.href = imageData;
    link.download = "chart-export.png";
    link.click();
  };

  const exportAsPDF = async () => {
    const chartContainer = document.querySelector(".chart-container");
    if (!chartContainer) return;

    const canvas = await html2canvas(chartContainer);
    const imageData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({ orientation: "landscape" });
    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;

    pdf.addImage(imageData, "PNG", 0, 10, width, height);
    pdf.save("chart-export.pdf");
  };

  return (
    <div className="dashboard-wrapper">
      <Sidebar />
      <div className="main-content">
        <DashNavbar />
        <div className="chat-insight-container">
          <h2>📊 Smart Excel AI Chat</h2>

          {/* Upload Section */}
          <div className="upload-section">
            <input type="file" accept=".xlsx" onChange={(e) => setFile(e.target.files[0])} />
            <button className="upload-btn" onClick={handleUpload}>
              Upload Excel
            </button>
          </div>

          {/* Ask AI */}
          {fileId && (
            <>
              <textarea
                className="ai-question-input"
                rows={3}
                placeholder="Ask anything about your Excel data..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />
              <button onClick={handleAsk} className="ai-ask-btn">
                Ask AI
              </button>
            </>
          )}

          {/* AI Answer */}
          {answer && (
            <div className="ai-answer-box">
              <h4>Answer:</h4>
              <p>{answer}</p>
            </div>
          )}

          {/* Chart Rendering & Export */}
          {suggestedChart && fileData && (
            <div className="ai-chart-section">
              <Charts
                ref={chartRef}
                type={suggestedChart?.type}
                data={fileData}
                xField={resolveField(suggestedChart?.xField)}
                yField={resolveField(suggestedChart?.yField)}
                rField={resolveField(suggestedChart?.rField)}
              />

              <div className="export-buttons">
                <button onClick={exportAsImage}>📸 Export as Image</button>
                <button onClick={exportAsPDF}>🧾 Export as PDF</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatWithFile;
