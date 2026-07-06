import { Request, Response, NextFunction } from 'express';
import * as authService from './auth.service';
import { sendSuccess, sendError } from '../../utils/response';

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await authService.register(req.body);
    return sendSuccess(res, data, 'Registration successful', 201);
  } catch (err) {
    return next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await authService.login(req.body);
    return sendSuccess(res, data, 'Login successful');
  } catch (err) {
    if (err instanceof Error) return sendError(res, err.message, 401);
    return next(err);
  }
}

export async function forgotPassword(req: Request, res: Response, next: NextFunction) {
  try {
    await authService.forgotPassword(req.body);
    // Always 200 — never reveal whether the email exists
    return sendSuccess(res, null, 'If that email is registered, a reset link has been sent');
  } catch (err) {
    return next(err);
  }
}

export async function resetPassword(req: Request, res: Response, next: NextFunction) {
  try {
    await authService.resetPassword(req.body);
    return sendSuccess(res, null, 'Password updated successfully');
  } catch (err) {
    if (err instanceof Error && err.message === 'Invalid or expired reset token') {
      return sendError(res, err.message, 401);
    }
    return next(err);
  }
}

export async function acceptInvite(req: Request, res: Response, next: NextFunction) {
  try {
    await authService.acceptInvite(req.body);
    return sendSuccess(res, null, 'Account activated — you can now log in');
  } catch (err) {
    if (err instanceof Error && err.message === 'Invalid or expired invite link') {
      return sendError(res, err.message, 401);
    }
    return next(err);
  }
}

export async function verifyOtp(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await authService.verifyOtp(req.body);
    return sendSuccess(res, data, 'Email verified successfully');
  } catch (err) {
    if (err instanceof Error) return sendError(res, err.message, 401);
    return next(err);
  }
}

export async function resendOtp(req: Request, res: Response, next: NextFunction) {
  try {
    await authService.resendOtp(req.body);
    return sendSuccess(res, null, 'If that email is registered and unconfirmed, a new code has been sent');
  } catch (err) {
    return next(err);
  }
}

export async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.headers.authorization!.split(' ')[1];
    await authService.logout(token);
    return sendSuccess(res, null, 'Logged out successfully');
  } catch (err) {
    return next(err);
  }
}
