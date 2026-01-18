// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./db.js";
import userRoute from "./routes/userroute.js";
import libraryRoute from "./routes/libraryRoute.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

// ---------- Middleware ----------
app.use(
  cors({
    origin: CLIENT_URL,   // React app URL
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---------- Health check ----------
app.get("/", (req, res) => {
  res.json({ success: true, message: "API running" });
});

// ---------- Routes ----------
app.use("/api/user", userRoute);
app.use("/api/library", libraryRoute);

// ---------- 404 handler ----------
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// ---------- Global error handler ----------
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// ---------- Start server AFTER DB connects ----------
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`✅ Server running at http://localhost:${PORT}`);
      console.log(`✅ Allowed client: ${CLIENT_URL}`);
    });
  } catch (err) {
    console.error("❌ DB connection failed", err);
    process.exit(1);
  }
};

startServer();