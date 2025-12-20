import mongoose, { Mongoose } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("❌ Please add your MongoDB URI to .env");
}

// Extend globalThis for caching in serverless environments
declare global {
  var _mongooseCache:
    | {
        conn: Mongoose | null;
        promise: Promise<Mongoose> | null;
      }
    | undefined;
}

// Ensure we have a cache object
if (!global._mongooseCache) {
  global._mongooseCache = { conn: null, promise: null };
}

const cached = global._mongooseCache;

export async function connectToDB(): Promise<Mongoose> {
  // Return existing connection if available
  if (cached.conn) return cached.conn;

  // If no promise exists, create one
  if (!cached.promise) {
    if (MONGODB_URI === undefined) throw new Error("MONGODB_URI is undefined");
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      dbName: "portfolio",
    });
  }

  // Await connection and store it in cache
  cached.conn = await cached.promise;
  return cached.conn;
}
