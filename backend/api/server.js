import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import { connectDB } from "../config/db.js";
import Service from "../models/Service.js";
import User from "../models/User.js";

import authRoutes from "../routes/authRoutes.js";
import serviceRoutes from "../routes/serviceRoutes.js";
import bookingRoutes from "../routes/bookingRoutes.js";
import reviewRoutes from "../routes/reviewRoutes.js";
import userRoutes from "../routes/userRoutes.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

/* =======================
   MIDDLEWARE
======================= */

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* =======================
   HELLO WORLD ROUTES
======================= */

// Root
app.get("/", (req, res) => {
  res.send("Hello World 🚀 Backend is running");
});

// API root
app.get("/api", (req, res) => {
  res.json({
    message: "Hello World 🌍 API is working",
    status: "OK",
  });
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ message: "Server is healthy ✅" });
});

/* =======================
   API ROUTES
======================= */

app.use("/api/auth", authRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/users", userRoutes);

/* =======================
   SEED DATA
======================= */

const seedInitialData = async () => {
  try {
    const serviceCount = await Service.countDocuments();

    if (serviceCount === 0) {
      await Service.insertMany([
        {
          name: "Electrician",
          description: "Professional electrical services",
          price: 150,
          duration: 2,
          category: "Electrical",
        },
        {
          name: "Plumber",
          description: "Expert plumbing services",
          price: 120,
          duration: 2,
          category: "Plumbing",
        },
        {
          name: "Cleaner",
          description: "Cleaning services",
          price: 80,
          duration: 3,
          category: "Cleaning",
        },
        {
          name: "Painter",
          description: "Painting services",
          price: 200,
          duration: 4,
          category: "Painting",
        },
      ]);

      console.log("✅ Services seeded");
    }

    const adminExists = await User.findOne({
      email: "amirkhan46509@gmail.com",
    });

    if (!adminExists) {
      await User.create({
        name: "Amir Khan",
        email: "amirkhan46509@gmail.com",
        password: "amkhan123",
        role: "admin",
        phone: "03351946509",
      });

      console.log("✅ Admin user created");
    }
  } catch (error) {
    console.error("❌ Seed error:", error.message);
  }
};

/* =======================
   INIT (SERVERLESS STYLE)
======================= */

await connectDB();
await seedInitialData();

// ❌ NO app.listen()
// ✅ Export app for Vercel / serverless
export default app;
