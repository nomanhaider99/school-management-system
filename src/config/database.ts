import { config } from "dotenv";
import mongoose from "mongoose";
config();
export const connectDatabase = async () => {
    try {
        await mongoose.connect(
            process.env.DATABASE_URI as string
        )
        console.log("🔥 MongoDB Connect Successfully!")
    } catch (error: any) {
        throw new Error(error.message);
    }
}