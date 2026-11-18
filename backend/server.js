
import "dotenv/config";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";

import agentRoutes from "./routes/agentRoutes.js";
import propertyRoutes from "./routes/propertyRoutes.js";
import enquiryRoutes from "./routes/enquiryRoutes.js";
import visitRoutes from "./routes/visitRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import favoriteRoutes from "./routes/favoriteRoutes.js";

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use("/api/properties", propertyRoutes);
app.use("/api/agents", agentRoutes);
app.use("/api/enquiries", enquiryRoutes);
app.use("/api/visits", visitRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/users", userRoutes);
app.use("/api/favorites", favoriteRoutes);

// Test route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Estatify Backend is running",
  });
});

// Server start
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();
