import path from "path";
import mongoose from "mongoose";
import slugify from "slugify";
import { Course } from "../models/Course.js";
import { Purchase } from "../models/Purchase.js";

const buildFileUrl = (file) => `/uploads/${path.basename(file.path)}`;
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

export const getCourses = async (_req, res) => {
  const courses = await Course.find({ published: true })
    .select("-modules.lessons.fileUrl")
    .sort({ createdAt: -1 });

  res.json(courses);
};

export const getAdminCourses = async (_req, res) => {
  const courses = await Course.find().sort({ createdAt: -1 });
  res.json(courses);
};

export const getCourseById = async (req, res) => {
  if (!isValidId(req.params.id)) {
    return res.status(404).json({ message: "Course not found" });
  }

  const course = await Course.findById(req.params.id).populate("createdBy", "name email");

  if (!course) {
    return res.status(404).json({ message: "Course not found" });
  }

  const previewCourse = {
    ...course.toObject(),
    modules: course.modules.map((module) => ({
      ...module.toObject(),
      lessons: module.lessons.map((lesson) => ({
        _id: lesson._id,
        title: lesson.title,
        contentType: lesson.contentType,
        duration: lesson.duration,
        freePreview: lesson.freePreview,
        order: lesson.order
      }))
    }))
  };

  res.json(previewCourse);
};

export const createCourse = async (req, res) => {
  const { title, description, price, category, level, requirements, learningOutcomes, published } =
    req.body;

  const course = await Course.create({
    title,
    slug: slugify(title, { lower: true, strict: true }),
    description,
    price: Number(price),
    category,
    level,
    published: published !== "false",
    requirements: requirements ? JSON.parse(requirements) : [],
    learningOutcomes: learningOutcomes ? JSON.parse(learningOutcomes) : [],
    thumbnailUrl: req.file ? buildFileUrl(req.file) : "",
    createdBy: req.user._id
  });

  res.status(201).json(course);
};

export const updateCourse = async (req, res) => {
  if (!isValidId(req.params.id)) {
    return res.status(404).json({ message: "Course not found" });
  }

  const course = await Course.findById(req.params.id);

  if (!course) {
    return res.status(404).json({ message: "Course not found" });
  }

  ["title", "description", "category", "level"].forEach((field) => {
    if (req.body[field] !== undefined) {
      course[field] = req.body[field];
    }
  });

  if (req.body.price !== undefined) {
    course.price = Number(req.body.price);
  }
  if (req.body.published !== undefined) {
    course.published = req.body.published !== "false";
  }
  if (req.body.requirements) {
    course.requirements = JSON.parse(req.body.requirements);
  }
  if (req.body.learningOutcomes) {
    course.learningOutcomes = JSON.parse(req.body.learningOutcomes);
  }
  if (req.body.title) {
    course.slug = slugify(req.body.title, { lower: true, strict: true });
  }
  if (req.file) {
    course.thumbnailUrl = buildFileUrl(req.file);
  }

  await course.save();
  res.json(course);
};

export const addModule = async (req, res) => {
  if (!isValidId(req.params.id)) {
    return res.status(404).json({ message: "Course not found" });
  }

  const course = await Course.findById(req.params.id);

  if (!course) {
    return res.status(404).json({ message: "Course not found" });
  }

  course.modules.push({
    title: req.body.title,
    description: req.body.description,
    order: Number(req.body.order || course.modules.length + 1),
    lessons: []
  });

  await course.save();
  res.status(201).json(course);
};

export const addLesson = async (req, res) => {
  if (!isValidId(req.params.id)) {
    return res.status(404).json({ message: "Course not found" });
  }

  const course = await Course.findById(req.params.id);

  if (!course) {
    return res.status(404).json({ message: "Course not found" });
  }

  const module = course.modules.id(req.params.moduleId);
  if (!module) {
    return res.status(404).json({ message: "Module not found" });
  }
  if (!req.file) {
    return res.status(400).json({ message: "Lesson file is required" });
  }

  module.lessons.push({
    title: req.body.title,
    contentType: req.body.contentType,
    duration: req.body.duration,
    freePreview: req.body.freePreview === "true",
    order: Number(req.body.order || module.lessons.length + 1),
    fileUrl: buildFileUrl(req.file)
  });

  await course.save();
  res.status(201).json(course);
};

export const getOwnedCourseContent = async (req, res) => {
  if (!isValidId(req.params.id)) {
    return res.status(404).json({ message: "Course not found" });
  }

  const course = await Course.findById(req.params.id);

  if (!course) {
    return res.status(404).json({ message: "Course not found" });
  }

  const enrolled = req.user.enrolledCourses.some(
    (courseId) => courseId.toString() === course._id.toString()
  );

  if (req.user.role !== "admin" && !enrolled) {
    const purchase = await Purchase.findOne({ user: req.user._id, course: course._id });
    if (!purchase) {
      return res.status(403).json({ message: "Purchase required" });
    }
  }

  res.json(course);
};
