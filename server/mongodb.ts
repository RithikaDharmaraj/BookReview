import { MongoClient, ServerApiVersion } from 'mongodb';
import mongoose from 'mongoose';

// Set the MongoDB connection string
// Check for MongoDB URI first, then fall back to a default local URI
const uri: string = process.env.MONGODB_URI || 'mongodb://localhost:27017/bookreviews';

// Create a MongoClient instance for direct MongoDB operations
export const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Connect mongoose for schema-based operations
export async function connectToMongoDB() {
  try {
    // Set connection timeout to 5 seconds to avoid long waits
    const connectOptions = {
      serverSelectionTimeoutMS: 5000, // 5 seconds
    };
    
    // Connect MongoDB client with timeout
    await client.connect();
    console.log("Connected to MongoDB client");
    
    // Connect Mongoose with timeout
    await mongoose.connect(uri, connectOptions);
    console.log("Connected to MongoDB with Mongoose");
    
    return { client, mongoose };
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    throw error;
  }
}

// Export database reference
export const db = client.db();

// Handle application shutdown
process.on('SIGINT', async () => {
  await mongoose.disconnect();
  await client.close();
  console.log('MongoDB connections closed');
  process.exit(0);
});