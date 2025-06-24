import ExcelData from "../models/excelData.js";
import axios from "axios";

export const generateChartInsight = async (req, res) => {
  try {
    const { fileId, question } = req.body;
    if (!fileId || !question) {
      return res.status(400).json({ success: false, message: "Missing file ID or question" });
    }

    const record = await ExcelData.findById(fileId);
    if (!record) return res.status(404).json({ success: false, message: "File not found" });

    const fileData = record.data;
    const sampleData = JSON.stringify(fileData.slice(0, 20), null, 2);

    const prompt = `
You are a helpful data analyst.

Here is a preview of an Excel sheet (first 20 rows):
${sampleData}

The user has this question: "${question}"

Please answer briefly and suggest a chart if useful.
You must respond ONLY with a raw JSON object like this:

{
  "answer": "Your short analysis here",
  "suggestedChart": {
    "type": "bar" | "line" | "pie" | "doughnut" | "scatter" | "bubble" | "polar" | "radar" | "scatter3d" | "bar3d",
    "xField": "ColumnNameForX",
    "yField": "ColumnNameForY",
    "rField": "ColumnNameForRadius", // optional, for 3D/bubble only
    "title": "Chart Title"
  }
}

If no chart is needed, use:
"suggestedChart": null

Output ONLY the JSON object. Do not include markdown or explanations.
`;

    const aiResponse = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "meta-llama/llama-3-8b-instruct",
        messages: [
          { role: "system", content: "You are a data analysis expert." },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const rawText = aiResponse.data.choices?.[0]?.message?.content || "";
   

    let parsed;
    try {
      const cleanText = rawText
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();

      parsed = JSON.parse(cleanText);
    } catch (err) {
      console.warn("⚠️ Failed to parse JSON from AI. Returning raw text.");
      return res.json({
        success: true,
        answer: rawText,
        suggestedChart: null,
      });
    }

    //  Increment chartCount & insightCount
    const updateFields = { $inc: { insightCount: 1 } };
    if (parsed.suggestedChart) updateFields.$inc.chartCount = 1;

    await ExcelData.findByIdAndUpdate(fileId, updateFields);

    res.json({
      success: true,
      answer: parsed.answer || "No answer generated.",
      suggestedChart: parsed.suggestedChart || null,
    });

  } catch (err) {
    console.error("❌ AI processing error:", err.response?.data || err.message);
    res.status(500).json({ success: false, message: "AI analysis failed" });
  }
};
