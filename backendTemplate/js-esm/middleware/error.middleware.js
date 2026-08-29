// Catches requests to routes that don't exist and forwards a 404 into the
// error handler below, so every "not found" case returns the same JSON shape.
export function notFound(req, res, next) {
  res.status(404);
  next(new Error(`Route not found — ${req.originalUrl}`));
}

// Must be registered LAST in server.js, after all routes.
// Express recognizes this as an error handler because it takes 4 arguments.
export function errorHandler(err, req, res, next) {
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
    message = Object.values(err.errors).map((e) => e.message).join(', ');
  }

  res.status(statusCode).json({
    message,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });
}
