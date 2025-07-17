import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) throw new Error("Please add MONGODB_URI to .env.local");

let cached = global.mongoose || { conn: null };

export async function connectToDB() {
  if (cached.conn) return cached.conn;
  const conn = await mongoose.connect(MONGODB_URI);
  cached.conn = conn;
  global.mongoose = cached;
  return conn;
}
