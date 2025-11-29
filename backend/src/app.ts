import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Import routes
import authRoutes from './api/routes/auth.routes';
import candidateRoutes from './api/routes/candidates.routes';
import verificationRoutes from './api/routes/verification.routes';
import reportRoutes from './api/routes/reports.routes';
import linkedinRoutes from './api/routes/linkedin.routes';

// Import middleware
import { errorHandler } from './api/middleware/errorHandler';
import { rateLimiter } from './api/middleware/rateLimiter';
import { logger } from './utils/logger';

const app: Application = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression middleware
app.use(compression());

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined', {
    stream: {
      write: (message: string) => logger.info(message.trim())
    }
  }));
}

// Rate limiting
app.use(rateLimiter);

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/candidates', candidateRoutes);
app.use('/api/v1/verifications', verificationRoutes);
app.use('/api/v1/reports', reportRoutes);
app.use('/api/v1/linkedin', linkedinRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`,
    path: req.path
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

export default app;
