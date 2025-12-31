import { Router } from "express";
import {
  getAllDonations,
  createDonation,
} from "../controllers/donations.controller";

const router = Router();

router.get("/", getAllDonations);
router.post("/", createDonation);

export default router;
