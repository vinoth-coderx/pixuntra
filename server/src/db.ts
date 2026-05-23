import mongoose from "mongoose";

function getMongoDbName(uri: string): string {
  try {
    const url = new URL(uri);
    const dbName = url.pathname.replace(/^\/+/, "");
    return dbName || "";
  } catch {
    return "";
  }
}

export async function connectDB(): Promise<{ uri: string }> {
  const uri = process.env.MONGODB_URI?.trim() || "";
  if (!uri) {
    throw new Error(
      "MONGODB_URI is not set. Add it to server/.env (e.g. mongodb://127.0.0.1:27017/pixuntra).",
    );
  }
  
  mongoose.set("strictQuery", true);
  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 12000,
    dbName: getMongoDbName(uri),
  });
  return { uri };
}
