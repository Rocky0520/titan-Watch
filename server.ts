import express from 'express';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

// Decoupled Configurations and Routers
import { connectDB } from './server/config/db.js';
import authRoutes from './server/routes/authRoutes.js';
import productRoutes from './server/routes/productRoutes.js';
import orderRoutes from './server/routes/orderRoutes.js';
import conciergeRoutes from './server/routes/conciergeRoutes.js';
import { notFound, errorHandler } from './server/middleware/errorMiddleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const isProd = process.env.NODE_ENV === 'production';

async function bootstrap() {
  const app = express();

  // Initialize Database Connection (Mongoose connection pool configuration)
  await connectDB();

  // Standard Express Middleware Setup
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // API Health Endpoint Check
  app.get('/api/health', (req, res) => {
    res.json({ 
      status: 'ok', 
      message: 'Titan Watches Modular Backend API is fully functional',
      timestamp: new Date().toISOString()
    });
  });

  // Mount Modular E-commerce Routers
  app.use('/api/auth', authRoutes);
  app.use('/api/products', productRoutes);
  app.use('/api/orders', orderRoutes);
  app.use('/api/concierge', conciergeRoutes);

  // Frontend SPA Routing / Dev Server Integration
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // modular Custom Error and 404 Route Handling
  app.use(notFound);
  app.use(errorHandler);

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Titan Watches server running on http://localhost:${PORT}`);
    console.log(`⚙️  Environment mode: ${isProd ? 'production' : 'development'}`);
  });
}

bootstrap().catch((err) => {
  console.error('💥 Failed to start Titan Watches server:', err);
});