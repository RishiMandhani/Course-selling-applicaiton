import { Router } from "express";
import { getMyCourses, purchaseCourse } from "../controllers/purchaseController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/:courseId", protect, purchaseCourse);
router.get("/me/list", protect, getMyCourses);

export default router;
