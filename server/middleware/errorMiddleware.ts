import { Request, Response, NextFunction } from 'express';

/**
 * Custom 404 middleware for handling unmapped routes
 */
export const notFound = (req: Request, res: Response, next: NextFunction): void => {
  const error = new Error(`Resource Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

/**
 * Unified custom global error handler middleware
 */
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction): void => {
  // If headers are already sent, delegate to default Express error handler
  if (res.headersSent) {
    return next(err);
  }

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  
  res.json({
    message: err.message || 'An unexpected backend error occurred',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
};
