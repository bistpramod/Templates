import jwt from 'jsonwebtoken';
import ENV_CONFIG from '../config/env.config';
import { IJwtPayload, IJwtReturn } from '../types/global.types';

export function generateToken(payload: IJwtPayload): string {
  return jwt.sign(payload, ENV_CONFIG.JWT_SECRET, {
    expiresIn: ENV_CONFIG.JWT_EXPIRES_IN as any,
  });
}

export function verifyJwtToken(token: string): IJwtReturn {
  return jwt.verify(token, ENV_CONFIG.JWT_SECRET) as IJwtReturn;
}
