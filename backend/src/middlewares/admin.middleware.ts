import { Response, NextFunction } from 'express';
import { supabaseAdmin } from '../config/supabase';
import { AuthenticatedRequest, UserProfile } from '../types';
import { sendError } from '../utils/response';

// Must be used AFTER authMiddleware — relies on req.user being set.
// Allows 'admin', 'researcher', and 'super_admin' — researchers need read
// access to analytics/SUS/feedback for the thesis evaluation, and
// super_admin is a superset of admin permissions. Inviting new admins
// (POST /admin/invite) has its own stricter superAdminMiddleware.
export async function adminMiddleware(
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
  if (!['admin', 'researcher', 'super_admin'].includes(data.role)) {
    return sendError(res, 'Admin access required', 403);
  }

  req.profile = data;
  return next();
}
