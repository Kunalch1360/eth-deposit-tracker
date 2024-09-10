// src/db/connect.ts
import { MongoClient, Db } from "mongodb";

let client: MongoClient | null = null;
let db: Db | null = null;

const MONGODB_URI = process.env.MONGODB_URI as string;
const DB_NAME = "ethereumTracker";

if (!MONGODB_URI) {
  throw new Error("Use correct mongodb uri");
}

export const connectToMongo = async (): Promise<Db> => {
  try {
    if (db) {
      return db;
    }

    if (!client) {
      client = new MongoClient(MONGODB_URI, {
        maxPoolSize: 10,
        minPoolSize: 2,
        serverSelectionTimeoutMS: 5000,
      });
    }
    await client.connect();

    db = client.db(DB_NAME);
    return db;
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    throw new Error("Database connection failed");
  }
};
