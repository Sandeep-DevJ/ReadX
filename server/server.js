import express from "express";
import "dotenv/config";
import cors from "cors";

import connectDB from "./db.js";
import userroute from "./routes/userroute.js";
import libraryRoute from "./routes/libraryRoute.js";

const app = express();
const PORT = process.env.PORT || 8000;

// middleware
app.use(cors({
  origin: "http://localhost:5174",
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use("/api/user", userroute);
app.use("/api/library", libraryRoute);

// start server ONLY after DB connects
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ DB connection failed", err);
    process.exit(1);
  }
};

startServer();
