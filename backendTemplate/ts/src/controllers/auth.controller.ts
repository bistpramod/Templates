import { Request, Response } from 'express';
import asyncHandler from '../utils/asyncHandler';
import { generateToken } from '../utils/jwt.utils';
import User from '../models/User.model';
import { Role } from '../types/enum.types';

// POST /api/auth/login
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  const token = generateToken({ id: user._id, role: user.role });

  res.json({
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
});

// GET /api/auth/me  (protected)
export const getMe = asyncHandler(async (req: Request, res: Response) => {
  res.json(req.user);
});

// POST /api/auth/register
// Left in for projects that DO need public sign-up. Delete for a
// single-admin site — use src/seed/createAdmin.ts instead.
export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  const exists = await User.findOne({ email });
  if (exists) {
    res.status(400);
    throw new Error('Email already in use');
  }

  const user = await User.create({ name, email, password, role: Role.USER });
  const token = generateToken({ id: user._id, role: user.role });

  res.status(201).json({
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
});
