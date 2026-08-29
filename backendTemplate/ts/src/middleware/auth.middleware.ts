import { NextFunction, Request, Response } from 'express';
import asyncHandler from '../utils/asyncHandler';
import { verifyJwtToken } from '../utils/jwt.utils';
import User from '../models/User.model';
import { Role } from '../types/enum.types';

// Verifies the JWT on the Authorization header and attaches req.user.
// Doesn't care about roles — just "is this a real, logged-in user".
export const verifyToken = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401);
    throw new Error('Not authenticated — no token provided');
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyJwtToken(token);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      res.status(401);
      throw new Error('User no longer exists');
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(401);
    throw new Error('Not authenticated — invalid or expired token');
  }
});

// Factory: requireRole(Role.ADMIN) or requireRole(Role.ADMIN, Role.USER)
// Use AFTER verifyToken in the route's middleware chain.
export function requireRole(...allowedRoles: Role[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      res.status(403);
      throw new Error('Not authorized for this action');
    }
    next();
  };
}
