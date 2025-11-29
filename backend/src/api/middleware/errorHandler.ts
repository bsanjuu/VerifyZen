import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../utils/errorHandler';
import { logger } from '../../utils/logger';
import { ValidationError } from 'sequelize';
import { ZodError } from 'zod';

export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  logger.error('Error occurred:', {
    error: error.message,
    stack: error.stack,
    path: req.path,
    method: req.method,
  });

  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      error: error.message,
      statusCode: error.statusCode,
    });
    return;
  }

  if (error instanceof ValidationError) {
    res.status(400).json({
      error: 'Validation error',
      details: error.errors.map((e) => ({
        field: e.path,
        message: e.message,
      })),
    });
    return;
  }

  if (error instanceof ZodError) {
    res.status(400).json({
      error: 'Validation error',
      details: error.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      })),
    });
    return;
  }

  res.status(500).json({
    error: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { message: error.message }),
  });
}
