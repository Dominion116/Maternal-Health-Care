import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../types';
import * as historyService from './history.service';
import { sendSuccess } from '../../utils/response';

export async function getConversations(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const { page = 1, limit = 20 } = req.query as { page?: number; limit?: number };
    const data = await historyService.getConversations(req.user.id, +page, +limit);
    return sendSuccess(res, data);
  } catch (err) {
    return next(err);
  }
}

export async function getMessages(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = req.params;
    const { page = 1, limit = 20 } = req.query as { page?: number; limit?: number };
    const data = await historyService.getMessages(req.user.id, id, +page, +limit);
    return sendSuccess(res, data);
  } catch (err) {
    return next(err);
  }
}

export async function deleteConversation(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    await historyService.deleteConversation(req.user.id, req.params.id);
    return sendSuccess(res, null, 'Conversation deleted');
  } catch (err) {
    return next(err);
  }
}

export async function setSaved(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const data = await historyService.setSaved(req.user.id, req.params.id, req.body.is_saved);
    return sendSuccess(res, data, 'Conversation updated');
  } catch (err) {
    return next(err);
  }
}
