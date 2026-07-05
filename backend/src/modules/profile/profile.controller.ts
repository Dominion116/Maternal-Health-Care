import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../types';
import * as profileService from './profile.service';
import { sendSuccess } from '../../utils/response';

export async function getProfile(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const profile = await profileService.getProfile(req.user.id);
    return sendSuccess(res, profile);
  } catch (err) {
    return next(err);
  }
}

export async function updateProfile(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const profile = await profileService.updateProfile(req.user.id, req.body);
    return sendSuccess(res, profile, 'Profile updated');
  } catch (err) {
    return next(err);
  }
}
