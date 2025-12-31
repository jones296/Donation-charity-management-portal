import express from "express";
import cors from "cors";

// Routes
import donationsRoutes from "./routes/donations.routes";
import contributionsRoutes from "./routes/contributions.routes";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/donations", donationsRoutes);
app.use("/api/contributions", contributionsRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("Donation & Charity Management Portal API running");
});

export default app;
