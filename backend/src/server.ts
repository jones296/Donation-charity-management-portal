import app from "./app";
import dotenv from "dotenv";
import cron from "node-cron";

// ✅ Import EXPIRE function (NOT delete)
import { markExpiredDonations } from "./controllers/donations.controller";

dotenv.config();

const PORT = process.env.PORT || 3000;

/**
 * --------------------------------------------------
 * 🚀 START SERVER
 * --------------------------------------------------
 */
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

/**
 * --------------------------------------------------
 * ⏰ CRON JOB → Mark expired unused donations
 * Runs EVERY HOUR (production safe)
 * --------------------------------------------------
 *
 * Condition:
 * - pickup_date_time < NOW()
 * - status = 'PENDING'
 * - remaining_quantity = quantity_or_amount
 *
 * Action:
 * - UPDATE status = 'EXPIRED'
 * (DO NOT DELETE — NGO must see expired rows)
 */
cron.schedule("0 * * * *", async () => {
  console.log("⏰ Running donation expiry check...");
  await markExpiredDonations();
});
