import { Router } from "express";
import { upload } from "../config/upload.js";
import {
  addLesson,
  addModule,
  createCourse,
  getAdminCourses,
  getCourseById,
  getCourses,
  getOwnedCourseContent,
  updateCourse
} from "../controllers/courseController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", getCourses);
router.get("/admin/all", protect, authorize("admin"), getAdminCourses);
router.get("/:id", getCourseById);
router.get("/:id/content", protect, getOwnedCourseContent);
router.post("/", protect, authorize("admin"), upload.single("thumbnail"), createCourse);
router.put("/:id", protect, authorize("admin"), upload.single("thumbnail"), updateCourse);
router.post("/:id/modules", protect, authorize("admin"), addModule);
router.post("/:id/modules/:moduleId/lessons", protect, authorize("admin"), upload.single("file"), addLesson);

export default router;
