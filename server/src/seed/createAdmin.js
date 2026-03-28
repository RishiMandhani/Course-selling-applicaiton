import dotenv from "dotenv";
import { connectDB } from "../config/db.js";
import { User } from "../models/User.js";

dotenv.config();

const run = async () => {
  await connectDB();

  const email = "admin@example.com";
  const password = "Admin@123";
  const existing = await User.findOne({ email });

  if (existing) {
    existing.role = "admin";
    existing.password = password;
    await existing.save();
    console.log("Existing user promoted to admin.");
    process.exit(0);
  }

  await User.create({
    name: "Platform Admin",
    email,
    password,
    role: "admin"
  });

  console.log("Admin user created.");
  process.exit(0);
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
