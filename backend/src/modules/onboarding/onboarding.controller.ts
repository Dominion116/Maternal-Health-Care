import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../types';
import { sendSuccess } from '../../utils/response';
import * as onboardingService from './onboarding.service';

export async function completeOnboarding(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const data = await onboardingService.completeOnboarding(req.user!.id, req.body);
    return sendSuccess(res, data, 'Onboarding completed');
  } catch (err) {
    return next(err);
  }
}
