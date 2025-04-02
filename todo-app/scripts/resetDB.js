import mongoose from "mongoose";
import User from "../models/User.js"; // Check the correct path
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

const resetDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await User.deleteMany({}); // Delete all users
    console.log("✅ All users deleted!");

    mongoose.connection.close();
  } catch (err) {
    console.error("❌ Error deleting users:", err);
    mongoose.connection.close();
  }
};

resetDatabase();
