import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();
connectDB(); // Connect to MongoDB

// CORS configuration to allow credentials (cookies)
app.use(cors({
  origin: "http://localhost:5173" || "https://blogfrontend-theta-ten.vercel.app", // allow your frontend
  credentials: true // if you're using cookies or sessions
}));

app.use(express.json());
app.use(cookieParser()); // Middleware to parse cookies

// Routes
app.use('/api', userRoutes);
app.use('/api', blogRoutes);

// Start server
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
