import { Router } from "express";
import {
  createContribution,
  getMyContributions,
  getLeaderboard,
} from "../controllers/contributions.controller";
import { authenticate, authorize } from "../middleware/auth.middleware";

const router = Router();

/**
 * --------------------------------------------------
 * DONOR → Confirm contribution
 * Protected: DONOR only
 * --------------------------------------------------
 */
router.post("/", authenticate, authorize(["DONOR"]), createContribution);

/**
 * --------------------------------------------------
 * DONOR → View my contributions
 * Protected: DONOR only
 * --------------------------------------------------
 */
router.get("/my", authenticate, authorize(["DONOR"]), getMyContributions);

/**
 * --------------------------------------------------
 * PUBLIC → Leaderboard (Top donors)
 * No authentication required
 * --------------------------------------------------
 */
router.get("/leaderboard", getLeaderboard);

export default router;
