import asyncHandler from '../utils/asyncHandler.js';
import generateToken from '../utils/generateToken.js';
import User from '../models/User.model.js';

// POST /api/auth/login
export const login = asyncHandler(async (req, res) => {
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
export const getMe = asyncHandler(async (req, res) => {
  res.json(req.user);
});

// POST /api/auth/register
// Left in for projects that DO need public sign-up. If yours is a
// single-admin site, delete this and the route for it, and only ever
// create users via seed/createAdmin.js.
export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const exists = await User.findOne({ email });
  if (exists) {
    res.status(400);
    throw new Error('Email already in use');
  }

  // PLACEHOLDER: decide the default role for public sign-ups.
  const user = await User.create({ name, email, password, role: '_ROLE_USER_' });
  const token = generateToken({ id: user._id, role: user.role });

  res.status(201).json({
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
});
