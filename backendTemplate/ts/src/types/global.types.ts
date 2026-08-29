import mongoose from 'mongoose';
import { Role } from './enum.types';

export interface IJwtPayload {
  id: mongoose.Types.ObjectId | string;
  role: Role;
}

export interface IJwtReturn extends IJwtPayload {
  iat: number;
  exp: number;
}
