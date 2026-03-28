import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  enrolledCourses: user.enrolledCourses
});

export const register = async (req, res) => {
  const { name, email, password, role } = req.body;
  const existingUser = await User.findOne({ email });
  const selectedRole = role === "admin" ? "admin" : "student";

  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  const user = await User.create({ name, email, password, role: selectedRole });
  res.status(201).json({ token: signToken(user._id), user: sanitizeUser(user) });
};

export const login = async (req, res) => {
  const { email, password, role } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await user.comparePassword(password))) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  if (role && user.role !== role) {
    return res.status(400).json({ message: `This account is registered as ${user.role}` });
  }

  res.json({ token: signToken(user._id), user: sanitizeUser(user) });
};

export const getProfile = async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate("enrolledCourses", "title slug thumbnailUrl")
    .select("-password");

  res.json(user);
};
