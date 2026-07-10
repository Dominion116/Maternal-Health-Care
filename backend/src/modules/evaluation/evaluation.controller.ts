import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../types';
import * as evaluationService from './evaluation.service';
import { sendSuccess, sendError } from '../../utils/response';

// ── Consent ────────────────────────────────────────────────────────────────

export async function getConsent(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const data = await evaluationService.getConsent(req.user.id);
    return sendSuccess(res, data);
  } catch (err) {
    return next(err);
  }
}

export async function submitConsent(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const data = await evaluationService.submitConsent(req.user.id, req.body);
    return sendSuccess(res, data, 'Consent recorded', 201);
  } catch (err) {
    return next(err);
  }
}

export async function withdrawConsent(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const data = await evaluationService.withdrawConsent(req.user.id);
    return sendSuccess(res, data, 'Consent withdrawn');
  } catch (err) {
    return next(err);
  }
}

// ── SUS ────────────────────────────────────────────────────────────────────

export async function getSusResponse(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const data = await evaluationService.getSusResponse(req.user.id);
    return sendSuccess(res, data);
  } catch (err) {
    return next(err);
  }
}

export async function submitSus(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const data = await evaluationService.submitSus(req.user.id, req.body);
    return sendSuccess(res, data, 'SUS response submitted', 201);
  } catch (err) {
    if (err instanceof Error && err.message === 'SUS response already submitted') {
      return sendError(res, err.message, 409);
    }
    return next(err);
  }
}

// ── Feedback ───────────────────────────────────────────────────────────────

export async function getFeedback(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const data = await evaluationService.getFeedback(req.user.id);
    return sendSuccess(res, data);
  } catch (err) {
    return next(err);
  }
}

export async function submitFeedback(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const data = await evaluationService.submitFeedback(req.user.id, req.body);
    return sendSuccess(res, data, 'Feedback submitted', 201);
  } catch (err) {
    return next(err);
  }
}
