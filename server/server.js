import express from "express";
import cors from "cors";
import 'dotenv/config';
import cookieParser from "cookie-parser";

import connectDB from "./config/mongodb.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js"
import excelRoutes from './routes/excelRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

const allowedOrigins = ['http://localhost:5173']

const app =express();
const port = process.env.PORT || 4000;
connectDB();

app.use(express.json());
app.use(cors({origin: allowedOrigins,credentials:true}));
app.use(cookieParser());

//Allow API endpoints
app.use('/api/auth',authRoutes);
app.use('/api/user',userRoutes);
app.use('/api/excel',excelRoutes);
app.use('/api/admin', adminRoutes);


app.listen(port, () => console.log(`Server running on the PORT: ${port}`));




