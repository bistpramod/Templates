import { NextFunction, Request, Response } from 'express';

export function notFound(req: Request, res: Response, next: NextFunction) {
  res.status(404);
  next(new Error(`Route not found — ${req.originalUrl}`));
}

// Must be registered LAST in app.ts, after all routes.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

  let message = err.message;
  if (err.name === 'CastError') {
    message = `Invalid ${err.path}: ${err.value}`;
  }
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0];
    message = `Duplicate value for ${field}`;
  }
  if (err.name === 'ValidationError') {
    message = Object.values(err.errors).map((e: any) => e.message).join(', ');
  }

  res.status(statusCode).json({
    message,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });
}
