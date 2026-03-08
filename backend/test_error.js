import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import Service from "./models/Service.js";
import Doctor from "./models/Doctor.js";

async function test() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to DB");

        console.log("Testing Service...");
        const services = await Service.find().sort({ createdAt: -1 }).lean();
        console.log("Services OK:", services.length);

        console.log("Testing Doctor...");
        const docs = await Doctor.aggregate([{ $limit: 1 }]);
        console.log("Doctors OK:", docs.length);

    } catch (err) {
        console.error("ERROR OCCURRED:", err);
    } finally {
        process.exit(0);
    }
}

test();
