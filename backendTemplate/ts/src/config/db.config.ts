import mongoose from 'mongoose';
import ENV_CONFIG from './env.config';

export async function connectDatabase(): Promise<void> {
  try {
    const conn = await mongoose.connect(ENV_CONFIG.DB_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
}
