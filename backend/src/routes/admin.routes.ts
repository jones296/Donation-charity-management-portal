 import { Router } from "express";
 import { authenticate, authorize } from "../middleware/auth.middleware";
 import {
   getDisabledUsers,
   reactivateUser,
 } from "../controllers/admin.controller";

 const router = Router();

 // ADMIN ONLY
 router.get(
   "/disabled-users",
   authenticate,
   authorize(["ADMIN"]),
   getDisabledUsers
 );
 router.put(
   "/reactivate/:userId",
   authenticate,
   authorize(["ADMIN"]),
   reactivateUser
 );

 export default router;