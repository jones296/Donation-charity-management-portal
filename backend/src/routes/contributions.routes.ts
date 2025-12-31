import { Router } from "express";
import {
  createContribution,
  getDonorContributions,
  getNgoContributions,
} from "../controllers/contributions.controller";

const router = Router();

router.post("/", createContribution);
router.get("/donor/:donorId", getDonorContributions);
router.get("/ngo/:ngoId", getNgoContributions);

export default router;
