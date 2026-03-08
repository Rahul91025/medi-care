import mongoose from "mongoose";

let cached = global._mongooseConnection;
if (!cached) {
    cached = global._mongooseConnection = { conn: null, promise: null };
}

const connectDB = async () => {
    if (cached.conn) return cached.conn;

    const uri = process.env.MONGODB_URI;
    if (!uri) {
        throw new Error("MONGODB_URI is not defined in environment variables");
    }

    if (!cached.promise) {
        cached.promise = mongoose.connect(uri).then((m) => {
            console.log(`MongoDB connected: ${m.connection.host}`);
            return m;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (error) {
        cached.promise = null;
        throw error;
    }

    return cached.conn;
};

export default connectDB;
