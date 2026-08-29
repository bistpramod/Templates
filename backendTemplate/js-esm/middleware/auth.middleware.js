import jwt from 'jsonwebtoken';
import asyncHandler from '../utils/asyncHandler.js';
import User from '../models/User.model.js';

// Verifies the JWT on the Authorization header and attaches req.user.
// Doesn't care about roles — just "is this a real, logged-in user".
export const verifyToken = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401);
    throw new Error('Not authenticated — no token provided');
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) {
      res.status(401);
      throw new Error('User no longer exists');
    }
    next();
  } catch (err) {
    res.status(401);
    throw new Error('Not authenticated — invalid or expired token');
  }
});

// Factory: requireRole('_ROLE_ADMIN_') or requireRole('_ROLE_ADMIN_', '_ROLE_USER_')
// Use AFTER verifyToken in the route's middleware chain.
// PLACEHOLDER: call sites should use your real role strings once renamed.
export function requireRole(...allowedRoles) {
  return function (req, res, next) {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      res.status(403);
      throw new Error('Not authorized for this action');
    }
    next();
  };
}
