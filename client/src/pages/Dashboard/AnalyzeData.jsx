import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../../components/Sidebar.jsx";
import DashNavbar from "../../components/DashNavbar.jsx";
import Charts from "../../components/Charts.jsx";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { AppContext } from "../../context/AppContext.jsx";
import "../../styles/AnalyzeData.css";
import Plotly from "plotly.js-dist-min";
window.Plotly = Plotly;

const AnalyzeData = () => {
  const { backendUrl } = useContext(AppContext);
  const { id: recordId } = useParams();

  const [chartType, setChartType] = useState("bar");
  const [fetchedData, setFetchedData] = useState([]);
  const [xKey, setXKey] = useState("");
  const [yKey, setYKey] = useState("");
  const [zKey, setZKey] = useState("");
  const [rKey, setRKey] = useState("");

  const chartTypes = [
    "bar",
    "line",
    "pie",
    "doughnut",
    "radar",
    "polar",
    "scatter",
    "bubble",
    "scatter3d",
    "surface",
    "bar3d",
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${backendUrl}/api/excel/record/${recordId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const data = res.data.data;
        setFetchedData(data);

        if (data.length > 0) {
          const keys = Object.keys(data[0]);
          const numericKeys = keys.filter(
            (key) => !isNaN(data[0][key]) && isFinite(data[0][key])
          );
          setXKey(numericKeys[0] || "");
          setYKey(numericKeys[1] || "");
          setZKey(numericKeys[2] || "");
          setRKey(numericKeys[2] || "");
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    if (recordId) fetchData();
  }, [backendUrl, recordId]);

  const exportAsPDF = async () => {
    const canvas = document.querySelector("canvas");
    const plotlyDiv = document.querySelector(".js-plotly-plot");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });
    const pageWidth = pdf.internal.pageSize.getWidth();

    pdf.setFillColor(85, 93, 239);
    pdf.rect(0, 0, pageWidth, 20, "F");
    pdf.setFontSize(18);
    pdf.setTextColor("#fff");
    pdf.setFont("helvetica", "bold");
    pdf.text("SheetSavvy - Excel Analytics Report", 10, 13);

    try {
      let imgData;
      if (plotlyDiv && window.Plotly) {
        imgData = await window.Plotly.toImage(plotlyDiv, {
          format: "png",
          width: 900,
          height: 500,
          background: "rgba(255,255,255,1)",
        });
      } else if (canvas) {
        imgData = canvas.toDataURL("image/png");
      } else {
        alert("No chart found to export.");
        return;
      }

      pdf.addImage(imgData, "PNG", 10, 30, 190, 100);

      const tableBody = fetchedData.map((row) => [
        String(row[xKey]),
        String(row[yKey]),
      ]);

      autoTable(pdf, {
        startY: 140,
        head: [[xKey, yKey]],
        body: tableBody,
        theme: "grid",
        styles: { fontSize: 8, textColor: "#000" },
        headStyles: { fillColor: [85, 93, 239], textColor: "#fff" },
        margin: { left: 10, right: 10 },
      });

      const finalY = pdf.lastAutoTable?.finalY || 140;
      pdf.setFontSize(9);
      pdf.setTextColor("#555");
      pdf.text(`Exported on: ${new Date().toLocaleString()}`, 10, finalY + 10);

      pdf.save(`${chartType}-chart-report.pdf`);
    } catch (error) {
      console.error("PDF Export Failed", error);
      alert("Export failed. Try again.");
    }
  };

  const downloadAsImage = async () => {
    const plotlyDiv = document.querySelector(".js-plotly-plot");
    const canvas = document.querySelector("canvas");

    try {
      let imgData;
      if (plotlyDiv && window.Plotly) {
        imgData = await window.Plotly.toImage(plotlyDiv, {
          format: "png",
          width: 900,
          height: 500,
        });
      } else if (canvas) {
        imgData = canvas.toDataURL("image/png");
      } else {
        alert("No chart available to download.");
        return;
      }

      const link = document.createElement("a");
      link.href = imgData;
      link.download = `${chartType}-chart.png`;
      link.click();
    } catch (error) {
      console.error("Image download failed", error);
      alert("Download failed. Try again.");
    }
  };

  return (
    <div className="dashboard-wrapper">
      <Sidebar />
      <div className="main-content">
        <DashNavbar />
        <div className="page-wrapper">
          <h1>📊 Analyze Your Excel Data</h1>

          <div className="button-group">
            {chartTypes.map((type) => (
              <button
                key={type}
                className={`chart-btn ${chartType === type ? "active" : ""}`}
                onClick={() => setChartType(type)}
              >
                {type.toUpperCase()}
              </button>
            ))}
          </div>

          {fetchedData.length > 0 && (
            <>
              <div className="axis-selectors">
                <label>
                  X-Axis:
                  <select
                    value={xKey}
                    onChange={(e) => setXKey(e.target.value)}
                  >
                    {Object.keys(fetchedData[0]).map((key) => (
                      <option key={key} value={key}>
                        {key}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  Y-Axis:
                  <select
                    value={yKey}
                    onChange={(e) => setYKey(e.target.value)}
                  >
                    {Object.keys(fetchedData[0]).map((key) => (
                      <option key={key} value={key}>
                        {key}
                      </option>
                    ))}
                  </select>
                </label>

                {chartType === "bubble" && (
                  <label>
                    Radius (r):
                    <select
                      value={rKey}
                      onChange={(e) => setRKey(e.target.value)}
                    >
                      {Object.keys(fetchedData[0]).map((key) => (
                        <option key={key} value={key}>
                          {key}
                        </option>
                      ))}
                    </select>
                  </label>
                )}

                {(chartType === "scatter3d" ||
                  chartType === "surface" ||
                  chartType === "bar3d") && (
                  <label>
                    Z-Axis:
                    <select
                      value={zKey}
                      onChange={(e) => setZKey(e.target.value)}
                    >
                      {Object.keys(fetchedData[0]).map((key) => (
                        <option key={key} value={key}>
                          {key}
                        </option>
                      ))}
                    </select>
                  </label>
                )}
              </div>

              <div className="chart-area">
                <h1>{chartType.toUpperCase()} Chart</h1>
                <Charts
                  type={chartType}
                  data={fetchedData}
                  xField={xKey}
                  yField={yKey}
                  rField={rKey}
                  zField={zKey}
                />
              </div>

              <div className="button-group">
                <button className="chart-btn" onClick={exportAsPDF}>
                  Export as PDF
                </button>
                <button className="chart-btn" onClick={downloadAsImage}>
                  Download Image
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyzeData;
