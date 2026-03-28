import mongoose from "mongoose";

const purchaseSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ["paid"], default: "paid" }
  },
  { timestamps: true }
);

purchaseSchema.index({ user: 1, course: 1 }, { unique: true });

export const Purchase = mongoose.model("Purchase", purchaseSchema);
