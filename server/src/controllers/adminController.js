import { Course } from "../models/Course.js";
import { Purchase } from "../models/Purchase.js";
import { User } from "../models/User.js";

export const getOverview = async (_req, res) => {
  const [students, admins, courses, purchases] = await Promise.all([
    User.countDocuments({ role: "student" }),
    User.countDocuments({ role: "admin" }),
    Course.countDocuments(),
    Purchase.find().populate("course", "price")
  ]);

  const revenue = purchases.reduce(
    (sum, purchase) => sum + (purchase.course?.price || purchase.amount || 0),
    0
  );

  res.json({ students, admins, courses, sales: purchases.length, revenue });
};
