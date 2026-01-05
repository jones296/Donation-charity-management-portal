import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.middleware";
import {
  schedulePickup,
  getMyPickups,
} from "../controllers/pickups.controller";

const router = Router();

// DONOR → Schedule pickup
router.post("/", authenticate, authorize(["DONOR"]), schedulePickup);

// DONOR → View my pickups
router.get("/my", authenticate, authorize(["DONOR"]), getMyPickups);

export default router;
