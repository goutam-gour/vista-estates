import mongoose from "mongoose";

let mongodInstance = null;

const connectDB = async () => {
  const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/property_sales";

  try {
    // Attempt standard connection with 3-second timeout
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(` MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (err) {
    console.warn(`! Could not connect to MongoDB at ${uri}: ${err.message}`);
    console.log(`⚡ Initializing in-memory MongoDB fallback server...`);

    try {
      const { MongoMemoryServer } = await import("mongodb-memory-server");
      mongodInstance = await MongoMemoryServer.create();
      const memUri = mongodInstance.getUri();
      const conn = await mongoose.connect(memUri);
      console.log(` MongoDB Memory Server connected successfully: ${memUri}`);
      return conn;
    } catch (memErr) {
      console.error(` Error initializing MongoDB Memory Server: ${memErr.message}`);
      process.exit(1);
    }
  }
};

export const closeDB = async () => {
  await mongoose.connection.close();
  if (mongodInstance) {
    await mongodInstance.stop();
  }
};

export default connectDB;
