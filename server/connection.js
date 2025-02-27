import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const MONGO_URI = process.env.MONGO_URI;

const connectDB = async () => {
    try {
        if (!MONGO_URI) {
            throw new Error("❌ MongoDB URI is missing in .env file!");
        }

        await mongoose.connect(MONGO_URI); // ✅ Removed deprecated options

        console.log("✅ MongoDB Connected Successfully");
    } catch (error) {
        console.error("❌ MongoDB Connection Failed:", error.message);
        process.exit(1);
    }
};

export default connectDB;
