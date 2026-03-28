import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    contentType: { type: String, enum: ["video", "document"], required: true },
    fileUrl: { type: String, required: true },
    duration: { type: String, default: "" },
    freePreview: { type: Boolean, default: false },
    order: { type: Number, default: 0 }
  },
  { _id: true }
);

const moduleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    order: { type: Number, default: 0 },
    lessons: [lessonSchema]
  },
  { _id: true }
);

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true },
    level: { type: String, enum: ["beginner", "intermediate", "advanced"], default: "beginner" },
    thumbnailUrl: { type: String, default: "" },
    requirements: [{ type: String }],
    learningOutcomes: [{ type: String }],
    published: { type: Boolean, default: true },
    modules: [moduleSchema],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

export const Course = mongoose.model("Course", courseSchema);
