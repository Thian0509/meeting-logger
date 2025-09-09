import mongoose from "mongoose";

const URI = process.env.MONGODB_URI!;
const DB = process.env.MONGODB_DB || "meetinglogger";

if (!URI) {
  throw new Error("MONGODB_URI is not set in the environment.");
}

let cached = (global as any)._mongoose as { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };
if (!cached) cached = (global as any)._mongoose = { conn: null, promise: null };

export async function dbConnect() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(URI, { dbName: DB });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
