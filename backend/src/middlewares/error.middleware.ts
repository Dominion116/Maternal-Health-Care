import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response';

export function errorMiddleware(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  console.error(err.stack);
  return sendError(res, err.message || 'Internal server error', 500);
}
