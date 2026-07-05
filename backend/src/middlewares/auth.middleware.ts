import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from '../config/supabase';
import { AuthenticatedRequest } from '../types';
import { sendError } from '../utils/response';

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return sendError(res, 'Missing or invalid Authorization header', 401);
  }

  const token = authHeader.split(' ')[1];

  const { data, error } = await supabaseAdmin.auth.getUser(token);

  if (error || !data.user) {
    return sendError(res, 'Invalid or expired token', 401);
  }

  (req as AuthenticatedRequest).user = { id: data.user.id, email: data.user.email! };
  return next();
}
