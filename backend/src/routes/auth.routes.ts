import { Router } from "express";
import {
  register,
  login,
  forgotPassword,
  adminReactivateUser,
} from "../controllers/auth.controller";

// ✅ Named imports (VERY IMPORTANT)
import { authenticate, authorize } from "../middleware/auth.middleware";

const router = Router();

// -------------------------
// PUBLIC ROUTES
// -------------------------
router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);

// -------------------------
// ADMIN ROUTE (DEMO ONLY)
// -------------------------
router.post(
  "/admin/reactivate",
  authenticate,
  authorize(["ADMIN"]),
  adminReactivateUser
);

export default router;
