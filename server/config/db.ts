import mongoose from 'mongoose';

/**
 * Establishes a connection to MongoDB using the configured MONGODB_URI.
 * Logs a warning instead of crashing or blocking if the database is offline or unconfigured.
 */
export async function connectDB(): Promise<void> {
  const uri = process.env.MONGODB_URI;
  
  if (!uri) {
    console.warn('⚠️ MONGODB_URI not found in environment. Running backend with local JSON database fallback.');
    return;
  }

  try {
    // Configure Mongoose options for stable production connection pooling
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds instead of hanging
    });
    console.log('✅ MongoDB connected successfully to Titan Watches DB');
  } catch (err: any) {
    console.error('❌ MongoDB connection failure. Falling back to local JSON database.');
    console.error('Error Details:', err.message);
  }
}

// Log connection pooling state changes
mongoose.connection.on('disconnected', () => {
  console.warn('⚠️ MongoDB connection lost. Falling back to local JSON repository.');
});

mongoose.connection.on('reconnected', () => {
  console.log('✅ MongoDB connection re-established.');
});
