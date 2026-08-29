import { NextFunction, Request, RequestHandler, Response } from 'express';

// Wraps an async controller so any thrown/rejected error is forwarded to
// Express's error middleware instead of crashing the process or needing a
// try/catch in every single controller.
export default function asyncHandler(fn: RequestHandler): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
