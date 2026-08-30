import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { env } from './config/env.js';
import { globalLimiter } from './middleware/rateLimiter.js';
import apiRoutes from './routes/index.js';
import { notFoundHandler, globalErrorHandler } from './middleware/errorHandler.js';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function createApp() {
  const app = express();

  // Security Headers (crossOriginResourcePolicy: cross-origin for static images)
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' }
    })
  );

  // CORS Configuration
  const allowedOrigins = env.CORS_ORIGIN.split(',').map((origin) => origin.trim());

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
          callback(null, true);
        } else {
          callback(new Error(`Origin ${origin} CORS tarafından engellendi.`));
        }
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
    })
  );

  // Rate Limiting
  app.use(globalLimiter);

  // Body parsers with 10mb limit for uploads
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Cookie Parser for HttpOnly Auth Token
  app.use(cookieParser());

  // Static Images Serving
  app.use('/images', express.static(path.resolve(__dirname, '../../images')));

  // Mount API Routes
  app.use('/api', apiRoutes);

  // 404 Handler
  app.use(notFoundHandler);

  // Global Error Handler
  app.use(globalErrorHandler);

  return app;
}

export const app = createApp();
export default app;
