import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import connectDB from "./config/mongodb.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import excelRoutes from "./routes/excelRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

const allowedOrigins = ["http://localhost:5173"];

const app = express();
const port = process.env.PORT || 4000;

connectDB();

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/excel", excelRoutes);
app.use("/api/admin", adminRoutes);

app.use(express.static(path.join(__dirname, "../client/dist")));
app.use("/*a-z", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

app.listen(port, () => console.log(`Server running on the PORT: ${port}`));
