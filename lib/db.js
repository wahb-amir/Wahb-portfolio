import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("❌ Please add your MongoDB URI to .env");
}

// 👇 globalThis is safer than global for cross-env
let cached = globalThis._mongooseCache;

if (!cached) {
  cached = globalThis._mongooseCache = { conn: null, promise: null };
}

export async function connectToDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      dbName: "portfolio", // 👈 optional, but good for clarity
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
