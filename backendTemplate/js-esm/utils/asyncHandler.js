// Wraps an async controller function so any thrown/rejected error is
// forwarded to Express's error middleware instead of crashing the process
// or needing a try/catch in every single controller.

export default function asyncHandler(fn) {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
