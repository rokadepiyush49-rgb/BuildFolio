const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log("Connecting to MongoDB...");

    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log("MongoDB connected");
  } catch (error) {
    console.error("Mongo FULL ERROR:", error);
    process.exit(1);
  }
};

module.exports = connectDB;