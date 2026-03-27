import mongoose from "mongoose";

const connectDB = async () => {
  let retries = 5;
  const retryDelay = 3000;

  while (retries > 0) {
    try {
      const conn = await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log(`✓ MongoDB connected: ${conn.connection.host}`);
      return;
    } catch (error) {
      retries--;
      if (retries === 0) {
        console.error(`✗ MongoDB connection failed after 5 attempts`);
        console.error(`✗ Error: ${error.message}`);
        console.log("\n📝 SOLUTIONS:");
        console.log("1. Whitelist your IP on MongoDB Atlas: https://cloud.mongodb.com → Network Access");
        console.log("2. Or use local MongoDB: mongod");
        console.log("3. Or update MONGO_URI in .env\n");
        process.exit(1);
      }
      console.log(`⏳ MongoDB connection attempt ${6 - retries - 1} failed. Retrying in ${retryDelay}ms...`);
      await new Promise(resolve => setTimeout(resolve, retryDelay));
    }
  }
};

export default connectDB;
