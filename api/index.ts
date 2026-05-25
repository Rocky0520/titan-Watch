import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Decoupled Configurations and Routers
import { connectDB } from '../server/config/db.js';
import authRoutes from '../server/routes/authRoutes.js';
import productRoutes from '../server/routes/productRoutes.js';
import orderRoutes from '../server/routes/orderRoutes.js';
import conciergeRoutes from '../server/routes/conciergeRoutes.js';
import { notFound, errorHandler } from '../server/middleware/errorMiddleware.js';

const app = express();

// Initialize Database Connection
// Connect to DB immediately for serverless invocations
connectDB().catch((err) => {
  console.error('💥 Failed to connect to MongoDB in serverless environment:', err);
});

// Standard Express Middleware Setup
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Health Endpoint Check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Titan Watches Modular Backend API is fully functional on Vercel',
    timestamp: new Date().toISOString()
  });
});

// Mount Modular E-commerce Routers
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/concierge', conciergeRoutes);

// Custom Error and 404 Route Handling
app.use(notFound);
app.use(errorHandler);

// Export the Express app instance for Vercel
export default app;
