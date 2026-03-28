import { Router } from "express";
import { getOverview } from "../controllers/adminController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/overview", protect, authorize("admin"), getOverview);

export default router;
