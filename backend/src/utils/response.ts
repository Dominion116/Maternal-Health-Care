import { Response } from 'express';
import { ApiResponse } from '../types';

export function sendSuccess<T>(res: Response, data: T, message?: string, statusCode = 200) {
  const body: ApiResponse<T> = { success: true, data, message };
  return res.status(statusCode).json(body);
}

export function sendError(res: Response, error: string, statusCode = 400) {
  const body: ApiResponse = { success: false, error };
  return res.status(statusCode).json(body);
}
