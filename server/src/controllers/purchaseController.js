import mongoose from "mongoose";
import { Course } from "../models/Course.js";
import { Purchase } from "../models/Purchase.js";
import { User } from "../models/User.js";

export const purchaseCourse = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.courseId)) {
    return res.status(404).json({ message: "Course not found" });
  }

  const course = await Course.findById(req.params.courseId);

  if (!course) {
    return res.status(404).json({ message: "Course not found" });
  }

  const existingPurchase = await Purchase.findOne({ user: req.user._id, course: course._id });
  if (existingPurchase) {
    return res.status(400).json({ message: "Course already purchased" });
  }

  await Purchase.create({
    user: req.user._id,
    course: course._id,
    amount: course.price
  });

  await User.findByIdAndUpdate(req.user._id, { $addToSet: { enrolledCourses: course._id } });
  res.status(201).json({ message: "Course purchased successfully" });
};

export const getMyCourses = async (req, res) => {
  const purchases = await Purchase.find({ user: req.user._id }).populate("course").sort({ createdAt: -1 });
  res.json(purchases);
};
