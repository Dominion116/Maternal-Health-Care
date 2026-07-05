import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { AuthenticatedUser } from '../types';

export function verifyToken(token: string): AuthenticatedUser {
  return jwt.verify(token, env.JWT_SECRET) as AuthenticatedUser;
}
