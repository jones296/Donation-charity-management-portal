import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Routes
import authRoutes from "./routes/auth.routes";
import donationRoutes from "./routes/donations.routes";
import contributionRoutes from "./routes/contributions.routes";
import pickupRoutes from "./routes/pickups.routes";

dotenv.config();

const app = express();

// --------------------------------------------------
// GLOBAL MIDDLEWARE
// --------------------------------------------------
app.use(cors());
app.use(express.json());

// --------------------------------------------------
// API ROUTES
// --------------------------------------------------
app.use("/api/auth", authRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/contributions", contributionRoutes);
app.use("/api/pickups", pickupRoutes);

// --------------------------------------------------
// HEALTH CHECK (OPTIONAL BUT GOOD)
// --------------------------------------------------
app.get("/", (_req, res) => {
  res.json({
    message: "Donation & Charity Management API is running 🚀",
  });
});

export default app;
