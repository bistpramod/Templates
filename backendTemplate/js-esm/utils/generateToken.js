import jwt from 'jsonwebtoken';

// payload should be the minimum needed to identify + authorize the user,
// e.g. { id: user._id, role: user.role } — never put sensitive data in here,
// JWT payloads are base64-encoded, not encrypted.
export default function generateToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}
