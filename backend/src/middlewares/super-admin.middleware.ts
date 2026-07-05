import { Response, NextFunction } from 'express';
import { supabaseAdmin } from '../config/supabase';
import { AuthenticatedRequest, UserProfile } from '../types';
import { sendError } from '../utils/response';

// Must be used AFTER authMiddleware — relies on req.user being set.
// Stricter than adminMiddleware: only 'super_admin' may invite new admins.
export async function superAdminMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  const { data, error } = await supabaseAdmin
    .from('user_profiles')
    .select('*')
    .eq('user_id', req.user.id)
    .single<UserProfile>();

  if (error || !data) return sendError(res, 'Profile not found', 403);
  if (data.role !== 'super_admin') {
    return sendError(res, 'Super admin access required', 403);
  }

  req.profile = data;
  return next();
}
