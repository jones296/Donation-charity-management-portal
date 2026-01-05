import { Router } from "express";
import {
  getAllDonations,
  createDonation,
  getNgoDonations,
  markDonationCompleted,
} from "../controllers/donations.controller";
import { authenticate, authorize } from "../middleware/auth.middleware";

const router = Router();

// PUBLIC → All donations
router.get("/", getAllDonations);

// NGO → View own donations
router.get("/ngo", authenticate, authorize(["NGO"]), getNgoDonations);

// NGO → Create donation
router.post("/", authenticate, authorize(["NGO"]), createDonation);

// NGO → Mark COMPLETED
router.put(
  "/:id/complete",
  authenticate,
  authorize(["NGO"]),
  markDonationCompleted
);

export default router;
